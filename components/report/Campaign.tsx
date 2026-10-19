"use client"

import { useMemo, useState } from "react"
import { NEWS_SOURCES } from "@/lib/news-sources"
import EmbedBox from "@/components/EmbedBox"

export interface CampaignImage {
  id: number
  image_url: string
  page_url: string
  title: string
  negativity_score: number
  report_count: number
  source_id?: string
  source_name?: string
  published_at?: string | null
  found_at: string
  media_contacts?: number
  google_reports?: number
}

// Objectif volontairement bas : un petit groupe concentré sur 5 images pèse plus que 100 personnes dispersées
const TARGET_PER_IMAGE = 10
const CAMPAIGN_SIZE = 5

export function mediaMessage(img: CampaignImage, siteUrl: string) {
  return `Bonjour,

Je vous écris au sujet de votre article « ${img.title} » :
${img.page_url}

La photo qui l'illustre renforce une image uniquement négative d'Haïti, qui ressort ensuite pendant des années dans Google Images pour la recherche « Haiti ».

Sans remettre en cause votre travail d'information, pourriez-vous :
- préciser la date et le lieu de la photo dans la légende,
- ou, si elle n'est pas liée directement aux faits, la remplacer par une image récente et digne ?

Des photos d'Haïti libres de droits (CC BY 4.0, crédit inclus) sont disponibles ici : ${siteUrl}/pataje

Merci pour votre attention,`
}

export function googleSteps(img: CampaignImage) {
  return `1. Ouvri Google Images : https://www.google.com/search?tbm=isch&q=${encodeURIComponent("Haiti " + img.title.slice(0, 60))}
2. Klike sou imaj la, epi sou ⋮ (twa pwen) → « Envoyer des commentaires / Send feedback ».
3. Chwazi « Le contenu est trompeur ou obsolète » epi ekri : « Photo ancienne présentée sans date, non représentative d'Haïti aujourd'hui ».
4. Si foto a montre yon moun ou konnen san konsantman l, itilize fòmilè ofisyèl la : https://support.google.com/legal/answer/3110420`
}

export default function Campaign({
  images,
  siteUrl,
  onAction,
}: {
  images: CampaignImage[]
  siteUrl: string
  onAction: (img: CampaignImage, action: "media" | "google") => void
}) {
  const campaign = useMemo(
    () => [...images].sort((a, b) => b.negativity_score - a.negativity_score || b.report_count - a.report_count).slice(0, CAMPAIGN_SIZE),
    [images]
  )
  const [open, setOpen] = useState<number | null>(null)

  if (campaign.length === 0) return null

  return (
    <section className="border-2 mb-10" style={{ borderColor: "#003F87" }} aria-labelledby="kanpay-titre">
      <div className="p-5 md:p-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#003F87" }}>
          Kanpay semèn nan
        </p>
        <h2 id="kanpay-titre" className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {CAMPAIGN_SIZE} imaj. Tout moun ansanm. {TARGET_PER_IMAGE} aksyon chak.
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
          Menm ak yon ti gwoup, si tout moun konsantre sou menm imaj yo, chak jounal resevwa plizyè mesaj sou menm atik
          la — se sa ki fè yo reyaji. Chak aksyon pran 2 minit : mesaj yo deja ekri.
        </p>
      </div>

      <ol className="divide-y divide-gray-200 dark:divide-gray-800">
        {campaign.map((img, i) => {
          const done = img.report_count + (img.media_contacts ?? 0) + (img.google_reports ?? 0)
          const pct = Math.min(100, Math.round((done / TARGET_PER_IMAGE) * 100))
          const contact = NEWS_SOURCES.find((s) => s.id === img.source_id)?.contactUrl || img.page_url
          return (
            <li key={img.id} className="p-5 md:px-8">
              <div className="flex gap-4 items-start">
                <span className="text-2xl font-black text-gray-300 dark:text-gray-700 w-8 shrink-0">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-20 h-20 object-cover shrink-0 bg-gray-100 dark:bg-gray-900"
                />
                <div className="min-w-0 flex-1">
                  <a href={img.page_url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 dark:text-white hover:underline line-clamp-2">
                    {img.title}
                  </a>
                  <p className="text-xs text-gray-500 mb-2">{img.source_name}</p>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={TARGET_PER_IMAGE} aria-label="Pwogrè kanpay la">
                    <div className="h-2" style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "#16a34a" : "#D21034" }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {done} / {TARGET_PER_IMAGE} aksyon · {img.media_contacts ?? 0} mesaj bay jounal · {img.google_reports ?? 0} siyalman Google
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(open === img.id ? null : img.id)}
                    aria-expanded={open === img.id}
                    className="mt-2 min-h-[44px] px-4 text-sm font-bold text-white"
                    style={{ backgroundColor: "#D21034" }}
                  >
                    {open === img.id ? "Fèmen" : "Aji sou imaj sa a"}
                  </button>
                </div>
              </div>

              {open === img.id && (
                <div className="mt-4 grid md:grid-cols-2 gap-6 md:pl-12">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white mb-1">1. Ekri jounal la</p>
                    <p className="text-xs text-gray-500 mb-2">Kopye mesaj la, epi voye l sou paj kontak la.</p>
                    <EmbedBox code={mediaMessage(img, siteUrl)} label="Kopye mesaj la" rows={7} />
                    <a
                      href={contact}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onAction(img, "media")}
                      className="inline-block mt-2 underline text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                      Ouvri paj kontak {img.source_name} ↗
                    </a>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white mb-1">2. Siyale bay Google</p>
                    <p className="text-xs text-gray-500 mb-2">Swiv etap yo ; make l fèt apre.</p>
                    <EmbedBox code={googleSteps(img)} label="Kopye etap yo" rows={7} />
                    <button
                      type="button"
                      onClick={() => onAction(img, "google")}
                      className="mt-2 min-h-[44px] px-4 text-sm font-bold border border-gray-900 dark:border-white text-gray-900 dark:text-white"
                    >
                      Mwen fè l ✓
                    </button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
