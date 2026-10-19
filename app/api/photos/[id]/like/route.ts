import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken, getTokenFromRequest } from "@/lib/jwt"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const photoId = parseInt(id)
    if (!Number.isInteger(photoId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    const user = await verifyToken(token)
    if (!user) return NextResponse.json({ error: "Token invalide" }, { status: 401 })

    // Toggle like
    const existing = await sql`
      SELECT 1 FROM likes WHERE user_id = ${user.id} AND photo_id = ${photoId}
    `

    if (existing.length > 0) {
      await sql`DELETE FROM likes WHERE user_id = ${user.id} AND photo_id = ${photoId}`
      await sql`UPDATE photos SET likes_count = likes_count - 1 WHERE id = ${photoId}`
      return NextResponse.json({ liked: false })
    } else {
      await sql`INSERT INTO likes (user_id, photo_id) VALUES (${user.id}, ${photoId})`
      await sql`UPDATE photos SET likes_count = likes_count + 1 WHERE id = ${photoId}`
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Like error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
