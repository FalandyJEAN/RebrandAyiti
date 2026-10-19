"use client"

import { useMemo, useState } from "react"
import { Flag, Check } from "lucide-react"
import { oneClickReport, type ReportableImage } from "@/lib/one-click-report"

export interface CampaignImage extends ReportableImage {
  image_url: string
  negativity_score: number
  report_count: number
  media_contacts?: number
}

// Objectif volontairement bas : un petit groupe concentré sur 5 images pèse plus que 100 personnes dispersées
const TARGET_PER_IMAGE = 10
const CAMPAIGN_SIZE = 5

export default function Campaign({ images, token }: { images: CampaignImage[]; token: string | null }) {
  const campaign = useMemo(
    () => [...images].sort((a, b) => b.negativity_score - a.negativity_score || b.report_count - a.report_count).slice(0, CAMPAIGN_SIZE),
    [images]
  )
  const [done, setDone] = useState<Record<number, "mail" | "contact">>({})

  if (campaign.length === 0) return null

  return (
    <section className="border-2 mb-10" style={{ borderColor: "#003F87" }} aria-labelledby="kanpay-titre">
      <div className="p-5 md:p-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#003F87" }}>Kanpay semèn nan</p>
        <h2 id="kanpay-titre" className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {CAMPAIGN_SIZE} imaj. Yon sèl klik chak.
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
          Klike « Sinyale » : platfòm nan ekri mesaj la pou ou epi li louvri l pou jounal la. Ou jis peze « Voye ».
          Si tout moun konsantre sou menm 5 imaj yo, chak jounal resevwa plizyè mesaj sou menm atik la.
        </p>
      </div>

      <ol className="divide-y divide-gray-200 dark:divide-gray-800">
        {campaign.map((img, i) => {
          const count = img.report_count + (done[img.id] ? 1 : 0)
          const pct = Math.min(100, Math.round((count / TARGET_PER_IMAGE) * 100))
          return (
            <li key={img.id} className="p-5 md:px-8 flex gap-4 items-center">
              <span className="text-2xl font-black text-gray-300 dark:text-gray-700 w-6 shrink-0">{i + 1}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-16 h-16 md:w-20 md:h-20 object-cover shrink-0 bg-gray-100 dark:bg-gray-900" />
              <div className="min-w-0 flex-1">
                <a href={img.page_url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 dark:text-white hover:underline line-clamp-2">
                  {img.title}
                </a>
                <p className="text-xs text-gray-500 mb-2">{img.source_name}</p>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={TARGET_PER_IMAGE} aria-label="Pwogrè">
                  <div className="h-1.5" style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "#16a34a" : "#D21034" }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{count} / {TARGET_PER_IMAGE} siyalman</p>
                {done[img.id] === "contact" && (
                  <p role="status" className="text-xs mt-1 text-gray-700 dark:text-gray-300">Mesaj la kopye — kole l nan fòmilè kontak la.</p>
                )}
              </div>
              <button
                type="button"
                disabled={!!done[img.id]}
                onClick={() => setDone((d) => ({ ...d, [img.id]: oneClickReport(img, token) }))}
                className="shrink-0 min-h-[44px] px-4 md:px-6 inline-flex items-center gap-2 text-sm font-bold text-white disabled:opacity-70"
                style={{ backgroundColor: done[img.id] ? "#16a34a" : "#D21034" }}
              >
                {done[img.id] ? <Check className="w-4 h-4" /> : <Flag className="w-4 h-4" />}
                {done[img.id] ? "Fèt" : "Sinyale"}
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
