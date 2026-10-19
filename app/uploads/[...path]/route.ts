import { readFile } from "fs/promises"
import path from "path"
import { UPLOAD_DIR } from "@/lib/storage"

const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" }

// Sert les photos stockées localement (prototype sans Vercel Blob)
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path
  const name = parts.join("/")
  // Seul le format généré par saveImage est accepté (pas de traversée de chemin)
  if (!/^photos\/[\w-]+\.(jpg|png|webp)$/.test(name)) return new Response("Not found", { status: 404 })
  try {
    const data = await readFile(path.join(UPLOAD_DIR, name))
    return new Response(data, {
      headers: {
        "Content-Type": TYPES[path.extname(name)],
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
