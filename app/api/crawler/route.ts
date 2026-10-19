import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { classifyImage } from "@/lib/classifier"
import { getGoogleAccessToken } from "@/lib/google-auth"
import { verifyToken, getTokenFromRequest } from "@/lib/jwt"

// Queries to search — exactly what people type on Google to find negative Haiti images
const NEGATIVE_QUERIES = [
  "Haiti poverty",
  "Haiti earthquake damage",
  "Haiti slums",
  "Haiti violence",
  "Haiti gang",
  "Haiti disaster",
  "Haiti cholera",
  "Haiti hunger",
  "Haiti refugees",
  "Haiti instability",
]

interface GoogleImageResult {
  link: string
  title: string
  image?: { contextLink?: string }
}

async function fetchGoogleImages(query: string): Promise<Array<{
  url: string
  title: string
  pageUrl: string
}>> {
  const cx = process.env.GOOGLE_CSE_ID
  if (!cx) {
    console.warn("GOOGLE_CSE_ID not configured")
    return []
  }

  // Use service account OAuth2 token (preferred) or fall back to API key
  const accessToken = await getGoogleAccessToken()
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY

  if (!accessToken && !apiKey) {
    console.warn("No Google auth configured (no service account token or API key)")
    return []
  }

  try {
    const auth = accessToken
      ? `access_token=${accessToken}`
      : `key=${apiKey}`
    const url = `https://www.googleapis.com/customsearch/v1?${auth}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=10&safe=off`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })

    if (!res.ok) {
      const err = await res.json()
      console.error("Google Search API error:", err)
      return []
    }

    const data = await res.json()
    return (data.items || []).map((item: GoogleImageResult) => ({
      url: item.link,
      title: item.title || query,
      pageUrl: item.image?.contextLink || "",
    }))
  } catch (e) {
    console.error("fetchGoogleImages error:", e)
    return []
  }
}

export async function GET(req: Request) {
  // Security: only Vercel Cron or admin can trigger
  const isVercelCron = req.headers.get("x-vercel-cron") === "1"
  const authHeader = req.headers.get("authorization")
  const isAdmin = !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`
  const token = getTokenFromRequest(req)
  const isMember = token ? !!(await verifyToken(token)) : false

  if (!isVercelCron && !isAdmin && !isMember && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  // Pick a random query to stay within the 100/day Google API limit
  const query = NEGATIVE_QUERIES[Math.floor(Math.random() * NEGATIVE_QUERIES.length)]

  const images = await fetchGoogleImages(query)
  const configured = !!process.env.GOOGLE_CSE_ID
  const results = { query, configured, scanned: images.length, stored: 0, skipped: 0 }

  for (const image of images) {
    const { score, labels, method } = await classifyImage(image.title, query)

    // Only store if likely negative (threshold: 0.35)
    if (score < 0.35) {
      results.skipped++
      continue
    }

    try {
      await sql`
        INSERT INTO negative_images (image_url, page_url, search_query, title, negativity_score, ai_labels)
        VALUES (
          ${image.url},
          ${image.pageUrl},
          ${query},
          ${image.title},
          ${score},
          ${JSON.stringify({ labels, method })}
        )
        ON CONFLICT (image_url) DO UPDATE
          SET negativity_score = GREATEST(negative_images.negativity_score, ${score}),
              report_count = negative_images.report_count
      `
      results.stored++
    } catch (e) {
      console.error("DB insert error:", e)
    }
  }

  return NextResponse.json(results)
}
