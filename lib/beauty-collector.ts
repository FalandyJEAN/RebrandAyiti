import { sql } from "@/lib/db"
import { classifyText } from "@/lib/classifier"
import { parseFeed } from "@/lib/collector"

const UA = "RebrandAyitiBot/1.0 (+https://github.com/FalandyJEAN/RebrandAyiti)"

// Recherches Wikimedia Commons par catégorie du catalogue (point d'accès public, sans clé)
export const CATALOG_CATEGORIES: { id: string; label: string; queries: string[] }[] = [
  { id: "plaj", label: "Plaj", queries: ["Labadee beach", "Jacmel beach", "Haiti beach", "Port-Salut Haiti", "Ile-a-Vache Haiti", "Cote des Arcadins"] },
  { id: "patrimwan", label: "Patrimwàn", queries: ["Citadelle Laferrière", "Sans-Souci Palace Milot", "Cap-Haïtien cathedral", "Jacmel architecture", "Marché en fer Port-au-Prince", "Fort Jacques Haiti"] },
  { id: "lanati", label: "Lanati", queries: ["Bassin Bleu Jacmel", "Saut-Mathurine", "Pic la Selle", "Kenscoff landscape", "Haiti mountains landscape", "Lake Azuei", "Haiti waterfall"] },
  { id: "kilti", label: "Kilti", queries: ["Jacmel carnival", "Haitian carnival masks", "Haitian painting", "Haitian art metal Croix-des-Bouquets", "Haitian music festival", "Rara Haiti"] },
  { id: "lavil", label: "Lavil", queries: ["Cap-Haïtien street", "Jacmel street", "Pétion-Ville", "Port-au-Prince skyline", "Tap tap Haiti"] },
  { id: "manje", label: "Manje", queries: ["Haitian cuisine", "griot Haiti", "Haitian market fruits", "Haitian coffee"] },
]

const FREE_LICENSE = /^(cc by(-sa)?( \d\.\d)?|cc0|public domain|pd)/i
const NOT_A_PHOTO = /\b(map|carte|plan|flag|drapeau|logo|coat of arms|stamp|timbre|document|diagram|chart|sign|scan|poster|affiche|banknote|coin|chant|partition|sheet music|journal|newspaper|gravure|engraving|lithograph|portrait|loc \d+|cartes|maps|army|troops?|soldiers?|military|marines|navy|task force|minustah|aruba|polling|election|vote|usaid|usaf|embassy|ambassade|conference|meeting|ceremony|lounge|brooklyn|miami|new york)\b/i
// L'image doit parler d'Haïti (titre, description ou catégories Commons)
const HAITI = /ha[iï]ti|ayiti|jacmel|cap-ha[iï]tien|labadee|labadie|milot|citadelle|sans-souci|kenscoff|p[ée]tion-?ville|port-au-prince|port-salut|ile-?[àa]-?vache|bassin bleu|saut-?mathurine|l[ée]og[âa]ne|hinche|gona[iï]ves|j[ée]r[ée]mie|les cayes|croix-des-bouquets|furcy|arcadins|la gon[âa]ve|azuei|fort-libert[ée]|ouanaminthe|saint-marc|petit-go[âa]ve/i

const strip = (s = "") =>
  s.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()

interface CommonsPage {
  title: string
  imageinfo?: {
    url: string; thumburl?: string; width: number; height: number; descriptionurl: string; mime?: string
    extmetadata?: Record<string, { value: string }>
  }[]
}

async function searchCommons(query: string): Promise<CommonsPage[]> {
  const params = new URLSearchParams({
    action: "query", format: "json", generator: "search", gsrnamespace: "6",
    gsrsearch: `${query} filetype:bitmap`, gsrlimit: "40", prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata", iiurlwidth: "1200",
    iiextmetadatafilter: "LicenseShortName|LicenseUrl|Artist|ImageDescription|ObjectName|Categories|DateTimeOriginal",
  })
  // Politesse envers Wikimedia : une requête à la fois, pause, et une seconde chance si limité (429)
  for (let attempt = 0; attempt < 2; attempt++) {
    await new Promise((r) => setTimeout(r, attempt ? 3000 : 400))
    try {
      const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
        headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000),
      })
      if (res.status === 429) continue
      if (!res.ok) return []
      const data = await res.json()
      return Object.values(data.query?.pages ?? {}) as CommonsPage[]
    } catch {
      return []
    }
  }
  return []
}

async function collectCommons(): Promise<number> {
  let stored = 0
  for (const cat of CATALOG_CATEGORIES) {
    for (const q of cat.queries) {
      for (const page of await searchCommons(q)) {
        const ii = page.imageinfo?.[0]
        const meta = ii?.extmetadata ?? {}
        const license = strip(meta.LicenseShortName?.value)
        if (!ii || !FREE_LICENSE.test(license) || ii.mime !== "image/jpeg") continue
        if (ii.width < 1000 || ii.width < ii.height * 0.6) continue // photos de qualité, pas de miniatures

        const title = strip(meta.ObjectName?.value) || page.title.replace(/^File:/, "").replace(/\.[a-z]+$/i, "")
        const description = strip(meta.ImageDescription?.value).slice(0, 400)
        const categories = strip(meta.Categories?.value).replace(/\|/g, " ")
        if (!HAITI.test(`${title} ${description} ${categories}`)) continue
        if (/[぀-鿿]/.test(title)) continue // homonymes (ex. « Haitian Road » à Shenzhen)
        if (NOT_A_PHOTO.test(`${title} ${description} ${categories}`) || classifyText(`${title} ${description} ${categories}`).score > 0) continue
        // Photos récentes seulement : écarte gravures, cartes anciennes et archives
        const year = parseInt(strip(meta.DateTimeOriginal?.value).match(/(1[89]|20)\d{2}/)?.[0] ?? "")
        if (year && year < 1990) continue

        const inserted = await sql`
          INSERT INTO catalog_images
            (kind, source, page_url, image_url, thumb_url, title, description, category, credit, license, license_url, width, height)
          VALUES
            ('free', 'Wikimedia Commons', ${ii.descriptionurl}, ${ii.url}, ${ii.thumburl ?? ii.url}, ${title.slice(0, 200)},
             ${description}, ${cat.id}, ${strip(meta.Artist?.value).slice(0, 120) || "Wikimedia Commons"}, ${license},
             ${meta.LicenseUrl?.value ?? ""}, ${ii.width}, ${ii.height})
          ON CONFLICT (image_url) DO NOTHING
          RETURNING id
        `
        stored += inserted.length
      }
    }
  }
  return stored
}

// Sites partenaires : aperçu (vignette + titre + lien), le contenu reste chez eux
const PARTNERS = [
  { name: "Visit Haiti", feed: "https://visithaiti.com/feed/" },
  { name: "Haiti Wonderland", sitemap: "https://haitiwonderland.com/sitemap.xml" },
]

async function fetchText(url: string) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) })
    return res.ok ? (await res.text()).slice(0, 3_000_000) : null
  } catch {
    return null
  }
}

function meta(html: string, prop: string) {
  const m =
    html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i")) ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i"))
  return m ? strip(m[1]) : ""
}

async function storePartner(source: string, pageUrl: string, title: string, image: string, description: string) {
  if (!/^https?:\/\//.test(image) || classifyText(`${title} ${description}`).score > 0) return 0
  const inserted = await sql`
    INSERT INTO catalog_images (kind, source, page_url, image_url, thumb_url, title, description, category, credit, license)
    VALUES ('partner', ${source}, ${pageUrl}, ${image}, ${image}, ${title.slice(0, 200)}, ${description.slice(0, 400)}, 'patne', ${source}, '© ' || ${source})
    ON CONFLICT (image_url) DO NOTHING
    RETURNING id
  `
  return inserted.length
}

async function collectPartners(): Promise<number> {
  let stored = 0
  for (const p of PARTNERS) {
    if (p.feed) {
      const xml = await fetchText(p.feed)
      for (const item of xml ? parseFeed(xml) : []) {
        if (item.image) stored += await storePartner(p.name, item.link, item.title, item.image, item.summary)
      }
    } else if (p.sitemap) {
      const xml = await fetchText(p.sitemap)
      const host = new URL(p.sitemap).hostname
      const urls = (xml?.match(/<loc>([^<]+)<\/loc>/g) ?? [])
        .map((l) => l.replace(/<\/?loc>/g, ""))
        .filter((u) => new URL(u).hostname === host) // même domaine uniquement (OWASP-105)
        .slice(0, 30)
      for (const url of urls) {
        const known = await sql`SELECT 1 FROM catalog_images WHERE page_url = ${url}`
        if (known.length) continue
        const html = await fetchText(url)
        if (!html) continue
        const image = meta(html, "og:image")
        if (image) stored += await storePartner(p.name, url, meta(html, "og:title") || url, image, meta(html, "og:description"))
      }
    }
  }
  return stored
}

export async function collectBeauty() {
  const [free, partners] = await Promise.all([collectCommons(), collectPartners()])
  return { free, partners }
}
