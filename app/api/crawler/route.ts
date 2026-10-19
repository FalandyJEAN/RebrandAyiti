import { NextResponse } from "next/server"
import { collectAll } from "@/lib/collector"
import { verifyToken, getTokenFromRequest } from "@/lib/jwt"

export const maxDuration = 300

// GET /api/crawler — lit les flux RSS des journaux et stocke les images d'articles stigmatisants.
// Déclenché chaque jour par Vercel Cron, ou à la main par un membre connecté.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  const isCron = !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`
  const token = getTokenFromRequest(req)
  const isMember = !isCron && token ? !!(await verifyToken(token)) : false

  if (!isCron && !isMember && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const sources = await collectAll()
  return NextResponse.json({
    sources,
    scanned: sources.reduce((n, s) => n + s.items, 0),
    stored: sources.reduce((n, s) => n + s.stored, 0),
  })
}
