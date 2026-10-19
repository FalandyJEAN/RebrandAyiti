import type { Metadata } from "next"
import Link from "next/link"
import { sql } from "@/lib/db"
import { CATALOG_CATEGORIES } from "@/lib/beauty-collector"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 48
const TABS = [...CATALOG_CATEGORIES.map((c) => ({ id: c.id, label: c.label })), { id: "patne", label: "Patnè" }]

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ kategori?: string }> }): Promise<Metadata> {
  const { kategori } = await searchParams
  const label = TABS.find((t) => t.id === kategori)?.label
  return {
    title: `Beautiful photos of Haiti${label ? ` — ${label}` : ""} | Bèl foto Ayiti | RebrandAyiti`,
    description:
      "Catalogue of beautiful photos of Haiti: beaches, heritage, nature, culture, cities and food. Photos d'Haïti libres de droits, avec crédit. Katalòg bèl foto Ayiti.",
    alternates: { canonical: kategori ? `/katalog?kategori=${kategori}` : "/katalog" },
  }
}

export default async function KatalogPage({ searchParams }: { searchParams: Promise<{ kategori?: string; paj?: string }> }) {
  const { kategori, paj } = await searchParams
  const cat = TABS.some((t) => t.id === kategori) ? (kategori as string) : null
  const page = Math.max(parseInt(paj || "1") || 1, 1)
  const offset = (page - 1) * PAGE_SIZE

  let rows: Record<string, string | number>[] = []
  let total = 0
  try {
    rows = await sql`
      SELECT id, kind, title, thumb_url, credit, source, category FROM catalog_images
      WHERE (${cat}::text IS NULL OR category = ${cat})
      ORDER BY (kind = 'free') DESC,
        CASE category WHEN 'plaj' THEN 0 WHEN 'patrimwan' THEN 1 WHEN 'lanati' THEN 2 WHEN 'kilti' THEN 3 ELSE 4 END,
        width DESC NULLS LAST, id DESC
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `
    const [c] = await sql`SELECT COUNT(*)::int AS n FROM catalog_images WHERE (${cat}::text IS NULL OR category = ${cat})`
    total = c.n
  } catch {
    rows = []
  }
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const href = (k: string | null, p = 1) => {
    const q = new URLSearchParams()
    if (k) q.set("kategori", k)
    if (p > 1) q.set("paj", String(p))
    const s = q.toString()
    return s ? `/katalog?${s}` : "/katalog"
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-4">Katalòg · {total} foto</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-none mb-4">
          Beautiful Haiti.
          <br />
          <span style={{ color: "#003F87" }}>Bèl Ayiti.</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
          Plaj, patrimwàn, lanati, kilti, lavil ak manje : sèlman bèl imaj, ak non fotograf la ak lisans lan. Chak foto
          gen paj pa l pou Google jwenn li lè yon moun tape « Haiti ».
        </p>

        <nav aria-label="Kategori" className="flex flex-wrap gap-2 mb-10">
          {[{ id: null as string | null, label: "Tout" }, ...TABS].map((t) => (
            <Link
              key={t.id ?? "all"}
              href={href(t.id)}
              aria-current={cat === t.id ? "page" : undefined}
              className={`min-h-[44px] inline-flex items-center px-4 text-sm font-bold border ${
                cat === t.id
                  ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900"
                  : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {rows.length === 0 ? (
          <p className="text-gray-500 py-20 text-center">Katalòg la ap plen — premye scan an ap vini.</p>
        ) : (
          <ul className="columns-2 md:columns-3 lg:columns-4 gap-3 [&>li]:mb-3">
            {rows.map((r) => (
              <li key={r.id} className="break-inside-avoid">
                <Link href={`/katalog/${r.id}`} className="block group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={String(r.thumb_url)}
                    alt={`Haiti — ${r.title}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto bg-gray-100 dark:bg-gray-900 group-hover:opacity-90 transition-opacity"
                  />
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-1 font-semibold">{r.title}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-1">© {r.credit}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {pages > 1 && (
          <nav aria-label="Paj" className="flex justify-center gap-4 mt-10 text-sm font-bold">
            {page > 1 && <Link href={href(cat, page - 1)} className="underline">← Avan</Link>}
            <span className="text-gray-500">{page} / {pages}</span>
            {page < pages && <Link href={href(cat, page + 1)} className="underline">Apre →</Link>}
          </nav>
        )}
      </div>
    </div>
  )
}
