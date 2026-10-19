import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken, getTokenFromRequest } from "@/lib/jwt"

// POST /api/crawler/:id/action — un membre déclare avoir contacté le média ou signalé à Google
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const imageId = parseInt((await params).id)
    if (!Number.isInteger(imageId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

    const token = getTokenFromRequest(req)
    const user = token ? await verifyToken(token) : null
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const action = body.action
    if (action !== "media" && action !== "google") {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 })
    }

    const inserted = await sql`
      INSERT INTO image_actions (image_id, user_id, action)
      SELECT ${imageId}, ${user.id}, ${action} WHERE EXISTS (SELECT 1 FROM negative_images WHERE id = ${imageId})
      ON CONFLICT DO NOTHING
      RETURNING image_id
    `
    // Un seul comptage par membre et par action
    if (inserted.length > 0) {
      if (action === "media") await sql`UPDATE negative_images SET media_contacts = media_contacts + 1 WHERE id = ${imageId}`
      else await sql`UPDATE negative_images SET google_reports = google_reports + 1 WHERE id = ${imageId}`
    }
    const [row] = await sql`SELECT media_contacts, google_reports FROM negative_images WHERE id = ${imageId}`
    if (!row) return NextResponse.json({ error: "Image introuvable" }, { status: 404 })
    return NextResponse.json(row)
  } catch (error) {
    console.error("Image action error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
