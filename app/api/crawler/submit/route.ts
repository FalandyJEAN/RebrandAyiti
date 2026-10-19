import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { classifyImage } from "@/lib/classifier"
import { verifyToken, getTokenFromRequest } from "@/lib/jwt"

// POST /api/crawler/submit — un membre soumet une image négative trouvée sur le web
export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    const user = token ? await verifyToken(token) : null
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const imageUrl = String(body.image_url ?? "").trim()
    const pageUrl = String(body.page_url ?? "").trim()
    const query = String(body.search_query ?? "").trim().slice(0, 120) || "Haiti"
    const title = String(body.title ?? "").trim().slice(0, 200) || query

    // Seuls des liens http(s) sont acceptés ; l'URL n'est jamais téléchargée côté serveur
    const isHttp = (u: string) => {
      try { return ["http:", "https:"].includes(new URL(u).protocol) } catch { return false }
    }
    if (imageUrl.length > 2000 || !isHttp(imageUrl)) {
      return NextResponse.json({ error: "URL d'image invalide" }, { status: 400 })
    }
    if (pageUrl && (pageUrl.length > 2000 || !isHttp(pageUrl))) {
      return NextResponse.json({ error: "URL de page invalide" }, { status: 400 })
    }

    const { score, labels, method } = await classifyImage(title, query)
    const result = await sql`
      INSERT INTO negative_images (image_url, page_url, search_query, title, negativity_score, ai_labels)
      VALUES (${imageUrl}, ${pageUrl}, ${query}, ${title}, ${score}, ${JSON.stringify({ labels, method, submitted_by: user.id })})
      ON CONFLICT (image_url) DO NOTHING
      RETURNING *
    `
    if (result.length === 0) return NextResponse.json({ error: "Image déjà soumise" }, { status: 409 })
    return NextResponse.json({ image: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Submit negative image error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
