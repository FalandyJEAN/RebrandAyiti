import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken, getTokenFromRequest } from "@/lib/jwt"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const imageId = parseInt(id)
    if (!Number.isInteger(imageId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

    const body = await req.json().catch(() => ({}))
    const reason = String(body.reason || "Stéréotype négatif").slice(0, 200)

    // Auth optional — anonymous reports allowed but tracked
    const token = getTokenFromRequest(req)
    const user = token ? await verifyToken(token) : null

    // Check if this user already reported this image (prevent spam)
    if (user) {
      const existing = await sql`
        SELECT 1 FROM image_reports
        WHERE image_id = ${imageId} AND user_id = ${user.id}
      `
      if (existing.length > 0) {
        return NextResponse.json({ error: "Vous avez déjà signalé cette image" }, { status: 409 })
      }
    }

    const found = await sql`SELECT 1 FROM negative_images WHERE id = ${imageId}`
    if (found.length === 0) return NextResponse.json({ error: "Image introuvable" }, { status: 404 })

    // Record the report
    await sql`
      INSERT INTO image_reports (image_id, user_id, reason)
      VALUES (${imageId}, ${user?.id ?? null}, ${reason})
    `

    // Increment counter
    const result = await sql`
      UPDATE negative_images
      SET
        report_count = report_count + 1,
        status = CASE WHEN report_count + 1 >= 10 THEN 'reported' ELSE status END
      WHERE id = ${imageId}
      RETURNING report_count, image_url, search_query
    `

    const image = result[0]

    // Generate Google report URL for this image
    const googleReportUrl = generateGoogleReportUrl(image.image_url, image.search_query)

    return NextResponse.json({
      success: true,
      report_count: image.report_count,
      google_report_url: googleReportUrl,
    })
  } catch (error) {
    console.error("Report error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

function generateGoogleReportUrl(imageUrl: string, searchQuery: string): string {
  // Opens Google Images search for the query — user can then report directly
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery + " site:" + new URL(imageUrl).hostname)}`
  return googleImagesUrl
}
