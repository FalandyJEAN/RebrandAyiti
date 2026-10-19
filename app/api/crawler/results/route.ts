import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const source = searchParams.get("source")
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "60") || 60, 1), 200)

    // Par défaut : tout ce qui n'est pas résolu, les plus récents d'abord
    const images = await sql`
      SELECT * FROM negative_images
      WHERE (${status}::text IS NULL AND status <> 'resolved' OR status = ${status})
        AND (${source}::text IS NULL OR source_id = ${source})
      ORDER BY COALESCE(published_at, found_at) DESC, negativity_score DESC
      LIMIT ${limit}
    `

    const stats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'reported') as reported,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
        COALESCE(SUM(report_count), 0) as total_reports,
        COALESCE(SUM(media_contacts), 0) as media_contacts,
        COALESCE(SUM(google_reports), 0) as google_reports
      FROM negative_images
    `

    return NextResponse.json({ images, stats: stats[0] })
  } catch (error) {
    console.error("GET crawler results error:", error)
    return NextResponse.json({ images: [], stats: {} }, { status: 500 })
  }
}
