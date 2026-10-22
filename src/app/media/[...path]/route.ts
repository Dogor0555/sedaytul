import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  if (segments.length !== 1 || !/^[0-9a-f-]+\.webp$/i.test(segments[0])) notFound();

  const mediaRoot = path.resolve(/* turbopackIgnore: true */ process.env.MEDIA_ROOT ?? "./data/media");
  try {
    const file = await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ mediaRoot, segments[0]));
    return new Response(file, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    notFound();
  }
}
