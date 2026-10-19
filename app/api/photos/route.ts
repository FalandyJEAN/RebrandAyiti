import { NextResponse } from "next/server"
import { saveImage, UploadError } from "@/lib/storage"
import { sql } from "@/lib/db"
import { verifyToken, getTokenFromRequest } from "@/lib/jwt"

// GET /api/photos — liste publique
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50") || 50, 1), 100)
    const offset = Math.max(parseInt(searchParams.get("offset") || "0") || 0, 0)

    let photos
    if (category && category !== "all") {
      photos = await sql`
        SELECT p.*, COALESCE(u.name, p.author_name) as author_name
        FROM photos p
        LEFT JOIN users u ON p.author_id = u.id
        WHERE p.category = ${category}
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      photos = await sql`
        SELECT p.*, COALESCE(u.name, p.author_name) as author_name
        FROM photos p
        LEFT JOIN users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    return NextResponse.json({ photos })
  } catch (error) {
    console.error("GET photos error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/photos — upload (authentifié)
export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file")
    const text = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max)
    const title = text("title", 120)
    const description = text("description", 1000)
    const location = text("location", 120)
    const category = text("category", 50)
    const subcategory = text("subcategory", 50)
    const tagsRaw = text("tags", 300)

    if (!(file instanceof File) || !title || !location || !category) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    let url: string
    try {
      url = await saveImage(file)
    } catch (e) {
      if (e instanceof UploadError) return NextResponse.json({ error: e.message }, { status: 400 })
      throw e
    }

    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10)

    // Sauvegarde en DB
    const result = await sql`
      INSERT INTO photos (title, description, location, category, subcategory, tags, url, author_id, author_name)
      VALUES (
        ${title}, ${description}, ${location}, ${category}, ${subcategory},
        ${tags}, ${url}, ${user.id}, ${user.name}
      )
      RETURNING *
    `

    return NextResponse.json({ photo: result[0] }, { status: 201 })
  } catch (error) {
    console.error("POST photo error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
