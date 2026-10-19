// URL publique du site (sitemap, robots, codes d'intégration). À changer via NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://group-mackandal-rebrand-ayiti.vercel.app").replace(/\/$/, "")

export const PHOTO_LICENSE = "https://creativecommons.org/licenses/by/4.0/"

export interface EmbeddablePhoto {
  id: number | string
  title: string
  location: string
  url: string
  author_name?: string
  description?: string
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export const absoluteUrl = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u}`)

// Texte alternatif : "Haiti" en anglais d'abord, c'est le mot que tape le monde entier sur Google Images
export const photoAlt = (p: EmbeddablePhoto) => `Haiti — ${p.title}, ${p.location} (Haïti / Ayiti)`

// Données structurées ImageObject (Google Images : crédit + licence)
export function photoJsonLd(p: EmbeddablePhoto & { created_at?: string; tags?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: `Haiti — ${p.title}`,
    description: p.description || `Photo of Haiti taken in ${p.location}. Foto Ayiti.`,
    contentUrl: absoluteUrl(p.url),
    url: `${SITE_URL}/photos/${p.id}`,
    creator: { "@type": "Person", name: p.author_name || "RebrandAyiti" },
    creditText: `${p.author_name || "RebrandAyiti"} / RebrandAyiti`,
    copyrightNotice: `© ${p.author_name || "RebrandAyiti"} — CC BY 4.0`,
    license: PHOTO_LICENSE,
    acquireLicensePage: `${SITE_URL}/pataje`,
    locationCreated: { "@type": "Place", name: p.location, addressCountry: "HT" },
    keywords: ["Haiti", "Haïti", "Ayiti", ...(p.tags || [])].join(", "),
    datePublished: p.created_at,
  }
}

// Sérialisation sûre dans une balise <script> (évite la sortie "</script>" — OWASP-028)
export const safeJson = (o: unknown) => JSON.stringify(o).replace(/</g, "\u003c")

// Code d'intégration à coller dans un blog : figure + crédit + lien + JSON-LD
export function embedCode(p: EmbeddablePhoto) {
  const page = `${SITE_URL}/photos/${p.id}`
  const credit = `${esc(p.author_name || "RebrandAyiti")} / RebrandAyiti`
  return `<figure style="margin:0 0 1.5em">
  <img src="${esc(absoluteUrl(p.url))}" alt="${esc(photoAlt(p))}" loading="lazy" style="width:100%;height:auto" />
  <figcaption style="font-size:0.85em;color:#555">
    ${esc(p.title)} — ${esc(p.location)}, Haiti. Photo : <a href="${esc(page)}">${credit}</a> (CC BY 4.0)
  </figcaption>
</figure>
<script type="application/ld+json">${safeJson(photoJsonLd(p))}</script>`
}
