import { randomUUID } from "crypto"

export const UPLOAD_DIR = process.env.UPLOAD_DIR || "./.data/uploads"
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

// Liste blanche, détectée par signature binaire (le Content-Type client n'est pas fiable — OWASP-044)
function detectImageType(buf: Uint8Array): "jpg" | "png" | "webp" | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg"
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png"
  if (String.fromCharCode(...buf.slice(0, 4)) === "RIFF" && String.fromCharCode(...buf.slice(8, 12)) === "WEBP") return "webp"
  return null
}

export async function saveImage(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Fichier trop volumineux (5 Mo max)")
  const bytes = new Uint8Array(await file.arrayBuffer())
  const ext = detectImageType(bytes)
  if (!ext) throw new UploadError("Format non supporté (JPG, PNG ou WebP)")

  // Nom généré par l'application, jamais celui du client
  const filename = `photos/${Date.now()}-${randomUUID()}.${ext}`
  const contentType = ext === "jpg" ? "image/jpeg" : `image/${ext}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob")
    const blob = await put(filename, Buffer.from(bytes), { access: "public", contentType })
    return blob.url
  }

  // Prototype local : hors de la racine web, servi par app/uploads/[...path]/route.ts
  const { mkdir, writeFile } = await import("fs/promises")
  const path = await import("path")
  await mkdir(path.join(UPLOAD_DIR, "photos"), { recursive: true })
  await writeFile(path.join(UPLOAD_DIR, filename), bytes)
  return `/uploads/${filename}`
}

export class UploadError extends Error {}
