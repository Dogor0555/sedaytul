# Seda y Tul

Sitio público y panel administrativo para gestionar accesorios artesanales, categorías, fotografías, contenido y consultas por WhatsApp.

## Tecnologías

- Next.js 16, React 19 y TypeScript
- Tailwind CSS 4
- PostgreSQL en Neon
- Prisma ORM
- Auth.js con credenciales y roles
- Vercel Blob para fotografías en producción

## Desarrollo local

1. Copia las variables documentadas en `.env.example` a un archivo `.env`.
2. Inicia PostgreSQL local con `docker compose -f docker-compose.dev.yml up -d` o configura una base Neon.
3. Ejecuta `npm install`.
4. Aplica las migraciones con `npm run db:deploy`.
5. Crea la administradora y las categorías con `npm run db:seed`.
6. Inicia el proyecto con `npm run dev`.

El sitio estará en `http://localhost:3000` y el panel en `http://localhost:3000/admin/iniciar-sesion`.

## Variables de Vercel

Configura estos secretos y valores desde Project Settings > Environment Variables:

- `DATABASE_URL`: conexión pooled de Neon con SSL.
- `AUTH_SECRET`: valor aleatorio largo para firmar sesiones.
- `AUTH_TRUST_HOST=true`.
- `BLOB_READ_WRITE_TOKEN`: creado al vincular Vercel Blob.
- `WHATSAPP_NUMBER`: número internacional sin `+` ni espacios.
- `INSTAGRAM_URL` y `FACEBOOK_URL`.
- `NEXT_PUBLIC_SITE_URL`: dominio definitivo.

Las variables `SEED_ADMIN_*` solo son necesarias al ejecutar el seed inicial. No deben quedar expuestas en código cliente ni confirmarse en Git.

## Base de datos

- Desarrollo de esquema: `npm run db:migrate`
- Producción: `npm run db:deploy`
- Datos iniciales mínimos: `npm run db:seed`

El seed crea una administradora, cuatro categorías vacías y la configuración principal. No carga productos ni fotografías de demostración.

## Verificación

```bash
npm run lint
npx tsc --noEmit
npm run build
```
