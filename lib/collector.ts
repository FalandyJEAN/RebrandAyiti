import { sql } from "@/lib/db"
import { classifyText } from "@/lib/classifier"
import { NEWS_SOURCES, type NewsSource } from "@/lib/news-sources"

const UA = "Mozilla/5.0 (compatible; RebrandAyitiBot/1.0; +https://github.com/FalandyJEAN/RebrandAyiti)"
const MAX_BYTES = 3 * 1024 * 1024
const NEGATIVE_THRESHOLD = 0.3
const MAX_PAGE_FETCHES_PER_SOURCE = 8

interface Item { title: string; link: string; summary: string; image: string | null; publishedAt: string | null }

// Téléchargement borné : délai, taille max, http(s) uniquement
async function fetchText(url: string): Promise<string | null> {
  try {
    if (!/^https?:\/\//.test(url)) return null
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000), redirect: "follow" })
    if (!res.ok) return null
    const text = await res.text()
    return text.length > MAX_BYTES ? text.slice(0, MAX_BYTES) : text
  } catch {
    return null
  }
}

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;|&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim()
}

function stripTags(s: string) {
  return decode(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"))
  return m ? decode(m[1]) : ""
}

function findImage(block: string): string | null {
  const patterns = [
    /<media:content[^>]+url=["']([^"']+)["']/i,
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+\.(?:jpe?g|png|webp)[^"']*)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
    /&lt;img[^&]+src=(?:&quot;|["'])([^"&]+)/i,
  ]
  for (const p of patterns) {
    const m = block.match(p)
    if (m && /^https?:\/\//.test(decode(m[1]))) return decode(m[1])
  }
  return null
}

export function parseFeed(xml: string): Item[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || []
  return blocks.map((b) => {
    const atomLink = b.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1]
    const date = tag(b, "pubDate") || tag(b, "published") || tag(b, "dc:date")
    const parsed = date ? new Date(date) : null
    return {
      title: stripTags(tag(b, "title")),
      link: tag(b, "link") || (atomLink ? decode(atomLink) : ""),
      summary: stripTags(tag(b, "description") || tag(b, "summary")).slice(0, 500),
      image: findImage(b),
      publishedAt: parsed && !isNaN(parsed.getTime()) ? parsed.toISOString() : null,
    }
  }).filter((i) => i.title && /^https?:\/\//.test(i.link))
}

// Image principale d'un article (og:image), seulement sur le domaine du média (anti-SSRF, OWASP-105)
async function fetchOgImage(articleUrl: string, source: NewsSource): Promise<string | null> {
  const feedHost = new URL(source.feed).hostname.replace(/^www\./, "")
  const host = new URL(articleUrl).hostname.replace(/^www\./, "")
  if (host !== feedHost && !host.endsWith(`.${feedHost}`)) return null
  const html = await fetchText(articleUrl)
  if (!html) return null
  const m =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  const url = m ? decode(m[1]) : null
  return url && /^https?:\/\//.test(url) ? new URL(url, articleUrl).toString() : null
}

const HAITI = /ha[iï]ti|ayiti|port-au-prince|p[oò]toprens/i

export interface SourceResult { source: string; items: number; stored: number; error?: string }

async function collectSource(source: NewsSource): Promise<SourceResult> {
  const xml = await fetchText(source.feed)
  if (!xml) return { source: source.name, items: 0, stored: 0, error: "flux inaccessible" }

  const items = parseFeed(xml).filter((i) => source.haitiOnly || HAITI.test(`${i.title} ${i.summary}`))
  let stored = 0
  let pageFetches = 0

  for (const item of items) {
    const { score, labels } = classifyText(`${item.title} ${item.summary}`)
    if (score < NEGATIVE_THRESHOLD) continue

    const known = await sql`SELECT 1 FROM negative_images WHERE page_url = ${item.link}`
    if (known.length > 0) continue

    let image = item.image
    if (!image && pageFetches < MAX_PAGE_FETCHES_PER_SOURCE) {
      pageFetches++
      image = await fetchOgImage(item.link, source)
    }
    if (!image) continue

    const inserted = await sql`
      INSERT INTO negative_images
        (image_url, page_url, search_query, title, context, negativity_score, ai_labels, source_id, source_name, published_at)
      VALUES
        (${image}, ${item.link}, ${source.name}, ${item.title}, ${item.summary}, ${score},
         ${JSON.stringify({ labels, method: "keyword" })}, ${source.id}, ${source.name}, ${item.publishedAt})
      ON CONFLICT (image_url) DO NOTHING
      RETURNING id
    `
    stored += inserted.length
  }
  return { source: source.name, items: items.length, stored }
}

export async function collectAll(): Promise<SourceResult[]> {
  return Promise.all(NEWS_SOURCES.map((s) =>
    collectSource(s).catch((e) => ({ source: s.name, items: 0, stored: 0, error: String(e).slice(0, 100) }))
  ))
}
