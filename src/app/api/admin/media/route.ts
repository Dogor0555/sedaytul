import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 4 * 1024 * 1024;

async function optimizeImage(source: Buffer) {
  const image = sharp(source, { failOn: "error", limitInputPixels: 40_000_000 });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height || !["jpeg", "png", "webp"].includes(metadata.format ?? "")) {
    throw new Error("Formato no compatible.");
  }
  const optimized = await image.rotate().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
  return { optimized, metadata: await sharp(optimized).metadata() };
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "No autorizado." }, { status: 401 });

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return Response.json({ error: "Origen no permitido." }, { status: 403 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
  if (!files.length || files.length > 10) {
    return Response.json({ error: "Selecciona entre 1 y 10 imágenes." }, { status: 400 });
  }

  const mediaRoot = path.resolve(/* turbopackIgnore: true */ process.env.MEDIA_ROOT ?? "./data/media");
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) await mkdir(mediaRoot, { recursive: true });
  const uploaded = [];

  for (const file of files) {
    if (!allowedTypes.has(file.type) || file.size > maxFileSize) {
      return Response.json({ error: `${file.name}: formato no permitido o archivo mayor de 8 MB.` }, { status: 400 });
    }

    const source = Buffer.from(await file.arrayBuffer());
    let output;
    try {
      output = await optimizeImage(source);
    } catch {
      return Response.json({ error: `${file.name}: el contenido no es una imagen válida.` }, { status: 400 });
    }

    const storageKey = `${randomUUID()}.webp`;
    let storedUrl = `/media/${storageKey}`;
    let persistedKey = storageKey;
    if (blobToken) {
      const blob = await put(`media/${storageKey}`, output.optimized, {
        access: "public",
        addRandomSuffix: false,
        contentType: "image/webp",
        token: blobToken,
      });
      storedUrl = blob.url;
      persistedKey = blob.pathname;
    } else {
      const outputPath = path.join(mediaRoot, storageKey);
      await writeFile(outputPath, output.optimized, { flag: "wx" });
    }

    const media = await db.media.create({
      data: {
        storageKey: persistedKey,
        url: storedUrl,
        mimeType: "image/webp",
        size: output.optimized.byteLength,
        width: output.metadata.width,
        height: output.metadata.height,
        altText: file.name.replace(/\.[^.]+$/, ""),
      },
    });
    uploaded.push({ id: media.id, url: media.url, name: file.name });
  }

  return Response.json({ media: uploaded }, { status: 201 });
}
