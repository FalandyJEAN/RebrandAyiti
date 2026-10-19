import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import { SITE_URL, safeJson } from "@/lib/site"
import { CATALOG_CATEGORIES } from "@/lib/beauty-collector"
import EmbedBox from "@/components/EmbedBox"

export const dynamic = "force-dynamic"

type Item = {
  id: number; kind: string; source: string; page_url: string; image_url: string; thumb_url: string; title: string
  description: string; category: string; credit: string; license: string; license_url: string; width: number; height: number
}

async function getItem(id: string): Promise<Item | null> {
  const n = parseInt(id)
  if (!Number.isInteger(n)) return null
  try {
    const [row] = await sql`SELECT * FROM catalog_images WHERE id = ${n}`
    return (row as Item) || null
  } catch {
    return null
  }
}

const catLabel = (id: string) => CATALOG_CATEGORIES.find((c) => c.id === id)?.label ?? "Patnè"
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const item = await getItem((await params).id)
  if (!item) return { title: "Foto introuvable — RebrandAyiti" }
  const title = `Haiti — ${item.title} | Beautiful Haiti`
  const description = item.description || `Beautiful photo of Haiti: ${item.title}. Bèl foto Ayiti — ${catLabel(item.category)}.`
  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical: `/katalog/${item.id}` },
    openGraph: { title, description, images: [{ url: item.thumb_url, alt: `Haiti — ${item.title}` }], type: "article" },
    twitter: { card: "summary_large_image", title, images: [item.thumb_url] },
  }
}

export default async function KatalogItem({ params }: { params: Promise<{ id: string }> }) {
  const item = await getItem((await params).id)
  if (!item) notFound()
  const free = item.kind === "free"
  const alt = `Haiti — ${item.title}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: alt,
    description: item.description || alt,
    contentUrl: item.image_url,
    thumbnailUrl: item.thumb_url,
    url: `${SITE_URL}/katalog/${item.id}`,
    creator: { "@type": "Person", name: item.credit },
    creditText: item.credit,
    keywords: ["Haiti", "Haïti", "Ayiti", catLabel(item.category)].join(", "),
    contentLocation: { "@type": "Place", name: "Haiti", address: { "@type": "PostalAddress", addressCountry: "HT" } },
    ...(free && item.license_url ? { license: item.license_url, acquireLicensePage: item.page_url } : {}),
  }

  const embed = `<figure style="margin:0 0 1.5em">
  <img src="${esc(item.thumb_url)}" alt="${esc(alt)}" loading="lazy" style="width:100%;height:auto" />
  <figcaption style="font-size:0.85em;color:#555">${esc(item.title)} — Haiti. Photo : ${esc(item.credit)}, ${esc(item.license)} (<a href="${esc(item.page_url)}">source</a>)</figcaption>
</figure>`

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href={`/katalog?kategori=${item.category}`} className="text-sm text-gray-500 hover:underline">
          ← {catLabel(item.category)}
        </Link>

        <figure className="mt-4 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumb_url}
            alt={alt}
            referrerPolicy="no-referrer"
            className="w-full h-auto bg-gray-100 dark:bg-gray-900"
          />
          <figcaption className="text-xs text-gray-500 mt-2">
            © {item.credit} · {item.license} ·{" "}
            <a href={item.page_url} target="_blank" rel="noopener" className="underline">
              {free ? "Sous : " : "Wè sou "}
              {item.source}
            </a>
          </figcaption>
        </figure>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">{alt}</h1>
        {item.description && <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">{item.description}</p>}

        {free ? (
          <div className="border border-gray-200 dark:border-gray-800 p-6">
            <p className="font-black text-gray-900 dark:text-white mb-2">Pataje foto sa a sou blog ou</p>
            <p className="text-sm text-gray-500 mb-3">Lisans {item.license} : ou ka itilize l, depi kredi a rete.</p>
            <EmbedBox code={embed} rows={5} />
          </div>
        ) : (
          <a href={item.page_url} target="_blank" rel="noopener" className="btn-haiti inline-block px-8 py-3 font-bold text-sm">
            Li atik la sou {item.source} ↗
          </a>
        )}
      </div>
    </div>
  )
}
