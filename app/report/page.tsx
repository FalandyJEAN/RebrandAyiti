"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  AlertTriangle, Search, Flag, ExternalLink, CheckCircle,
  X, RefreshCw, Brain, TrendingUp
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { openAuthModal, openUploadModal } from "@/lib/modal-events"
import { NEWS_SOURCES } from "@/lib/news-sources"

// Formulaire officiel de Google pour signaler un contenu dans la recherche
const GOOGLE_REPORT_URL = "https://support.google.com/legal/answer/3110420"

interface NegativeImage {
  id: number
  image_url: string
  page_url: string
  search_query: string
  title: string
  negativity_score: number
  ai_labels: { labels: string[]; method: string }
  report_count: number
  status: "pending" | "reported" | "resolved"
  found_at: string
  source_id?: string
  source_name?: string
  published_at?: string | null
  media_contacts?: number
  google_reports?: number
}

interface Stats {
  pending: string
  reported: string
  resolved: string
  total_reports: string
}

const REPORT_REASONS = [
  "Imaj date (plis pase 5 an)",
  "Kontèks fò / manipilasyon",
  "Esteyreotip negatif",
  "Foto ki pa reprezantatif",
  "Imaj ki stigmatize",
  "Kontni ki ofanse Ayiti",
  "Lòt",
]

export default function ReportPage() {
  const { token } = useAuth()
  const [images, setImages] = useState<NegativeImage[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())
  const [reportReason, setReportReason] = useState("")
  const [reporting, setReporting] = useState<number | null>(null)
  const [reportedIds, setReportedIds] = useState<Set<number>>(new Set())
  const [isRunningCrawler, setIsRunningCrawler] = useState(false)
  const [crawlerResult, setCrawlerResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/crawler/results?limit=60")
      const data = await res.json()
      setImages(data.images || [])
      setStats(data.stats || null)
    } catch {
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleReport = async (imageId: number, reason: string) => {
    setReporting(imageId)
    try {
      const res = await fetch(`/api/crawler/${imageId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason }),
      })
      const data = await res.json()
      if (res.ok) {
        setReportedIds((prev) => new Set([...prev, imageId]))
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, report_count: data.report_count } : img
          )
        )
      }
    } finally {
      setReporting(null)
      setSelectedImages(new Set())
      setReportReason("")
    }
  }

  const handleAction = async (image: NegativeImage, action: "media" | "google") => {
    if (!token) { openAuthModal(); return }
    const res = await fetch(`/api/crawler/${image.id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    })
    if (res.ok) {
      const data = await res.json()
      setImages((prev) => prev.map((img) => (img.id === image.id ? { ...img, ...data } : img)))
    }
  }

  const handleBulkReport = async () => {
    if (!reportReason || selectedImages.size === 0) return
    if (!token) { openAuthModal(); return }
    for (const id of selectedImages) await handleReport(id, reportReason)
  }

  const runCrawler = async () => {
    setIsRunningCrawler(true)
    setCrawlerResult(null)
    try {
      const res = await fetch("/api/crawler", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.status === 401) { openAuthModal(); return }
      const data = await res.json()
      setCrawlerResult(
        `Scan fini: ${data.scanned} atik li nan ${data.sources?.length ?? 0} jounal, ${data.stored} nouvo imaj negatif jwenn.`
      )
      await loadData()
    } catch {
      setCrawlerResult("Erè pandan scan la. Verifye kle API nan .env.local")
    } finally {
      setIsRunningCrawler(false)
    }
  }

  const [submitUrl, setSubmitUrl] = useState("")
  const [submitQuery, setSubmitQuery] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<string | null>(null)

  const submitImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) { openAuthModal(); return }
    setSubmitting(true)
    setSubmitMsg(null)
    try {
      const res = await fetch("/api/crawler/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image_url: submitUrl, search_query: submitQuery }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitMsg("Mèsi! Imaj la ajoute nan lis la.")
        setSubmitUrl("")
        setSubmitQuery("")
        await loadData()
      } else {
        setSubmitMsg(data.error || "Erè")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const filteredImages = images.filter(
    (img) =>
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.search_query.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const scoreColor = (score: number) => {
    if (score >= 0.7) return "text-[#D21034] bg-red-50 dark:bg-red-900/20"
    if (score >= 0.4) return "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
    return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
  }

  const STATS_DISPLAY = [
    { value: stats?.pending ?? "—",       label: "Imaj detekte",      color: "#D21034" },
    { value: stats?.reported ?? "—",      label: "An kous",           color: "#f97316" },
    { value: stats?.resolved ?? "—",      label: "Rezoud",            color: "#16a34a" },
    { value: stats?.total_reports ?? "—", label: "Total sinyalman",   color: "#003F87" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">

      {/* Bande drapeau */}
      <div className="flex h-1">
        <div className="flex-1" style={{ backgroundColor: "#003F87" }} />
        <div className="flex-1" style={{ backgroundColor: "#D21034" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-3">
              Pwoteksyon imaj
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-none">
              Sinyale imaj
              <br />
              <span style={{ color: "#D21034" }}>negatif.</span>
            </h1>
          </div>
          <button
            onClick={runCrawler}
            disabled={isRunningCrawler}
            className="btn-haiti inline-flex items-center gap-2 px-6 py-3 font-bold text-sm self-start md:self-auto disabled:opacity-60"
          >
            {isRunningCrawler ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Scan ap mache...</>
            ) : (
              <><Brain className="w-4 h-4" /> Lanse scan IA</>
            )}
          </button>
        </div>

        {crawlerResult && (
          <div className="mb-8 border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            {crawlerResult}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 mb-10">
          {STATS_DISPLAY.map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-950 px-4 py-6 md:px-6 md:py-8">
              <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Kijan li mache */}
        <div className="border border-gray-200 dark:border-gray-800 p-5 md:p-8 mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-6">
            Kijan IA nou an travay
          </p>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {[
              {
                num: "01",
                title: "Scan Google Imaj",
                body: "Nou chèche «Haiti poverty», «Haiti earthquake»... — rechèch ki pi danjere yo",
                color: "#003F87",
              },
              {
                num: "02",
                title: "Klasifikasyon IA",
                body: "Chak imaj analize (skor 0→1) pa HuggingFace BART pou mezire toksisité li",
                color: "#003F87",
              },
              {
                num: "03",
                title: "Sinyalman kominotè",
                body: "Kominote a konfime epi sinyale Google — algoritm la fini pa retire yo",
                color: "#D21034",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <div
                  className="w-8 h-8 flex items-center justify-center text-white text-xs font-black shrink-0"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-1">{step.title}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rechèch + action gwoup */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Chèche nan imaj yo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#003F87] dark:focus:border-white transition-colors"
            />
          </div>
        </div>

        {selectedImages.size > 0 && (
          <div className="mb-6 border border-gray-200 dark:border-gray-800 p-4 flex flex-col md:flex-row md:items-center gap-4">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {selectedImages.size} imaj chwazi
            </span>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="flex-1 md:max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none"
            >
              <option value="">Chwazi yon rezon...</option>
              {REPORT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleBulkReport}
                disabled={!reportReason}
                className="flex items-center gap-2 px-4 py-2 font-bold text-sm text-white disabled:opacity-50"
                style={{ backgroundColor: "#D21034" }}
              >
                <Flag className="w-4 h-4" />
                Sinyale Google
              </button>
              <button
                onClick={() => setSelectedImages(new Set())}
                className="p-2 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Grille */}
        {isLoading ? (
          <div className="text-center py-20">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Chajman done...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="py-20 text-center border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-3">
              Okenn imaj
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white mb-6">
              Pa gen imaj detekte.
            </p>
            <button
              onClick={runCrawler}
              disabled={isRunningCrawler}
              className="btn-haiti px-6 py-3 font-bold text-sm disabled:opacity-60"
            >
              <Brain className="w-4 h-4 inline mr-2" />
              Li jounal yo kounye a
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 mb-12">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`bg-white dark:bg-gray-950 overflow-hidden group ${
                  selectedImages.has(image.id) ? "ring-2 ring-inset ring-[#003F87]" : ""
                }`}
              >
                {/* Imaj */}
                <div
                  className="relative h-48 cursor-pointer"
                  onClick={() =>
                    setSelectedImages((prev) => {
                      const next = new Set(prev)
                      next.has(image.id) ? next.delete(image.id) : next.add(image.id)
                      return next
                    })
                  }
                >
                  <Image
                    src={image.image_url || "/images/haiti-hero.jpg"}
                    alt={image.title || "Imaj negatif detekte"}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement
                      t.src = "/images/haiti-hero.jpg"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Checkbox */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                      selectedImages.has(image.id)
                        ? "bg-[#003F87] border-[#003F87]"
                        : "bg-white/80 border-white"
                    }`}>
                      {selectedImages.has(image.id) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-0.5 text-xs font-bold ${scoreColor(image.negativity_score)}`}>
                      Toksisité {Math.round(image.negativity_score * 100)}%
                      {image.ai_labels?.method === "ai" && " IA"}
                    </span>
                  </div>

                  {/* Alète */}
                  <div className="absolute top-2 left-2 p-1.5" style={{ backgroundColor: "#D21034" }}>
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Kontni */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {image.title || "San tit"}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="font-semibold" style={{ color: "#D21034" }}>{image.source_name || image.search_query}</span>
                    {(image.published_at || image.found_at) && (
                      <> · {new Date(image.published_at || image.found_at).toLocaleDateString("fr-FR")}</>
                    )}
                    {image.ai_labels?.labels?.length > 0 && <> · {image.ai_labels.labels.join(", ")}</>}
                  </div>
                  <div className={`inline-block px-2 py-0.5 text-xs font-semibold mb-3 ${
                    image.status === "resolved"
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700"
                      : image.status === "reported"
                      ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700"
                      : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700"
                  }`}>
                    {image.status === "pending" ? "An atant" : image.status === "reported" ? "Sinyale" : "Rezoud"}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3" />
                      <span className="font-bold" style={{ color: "#D21034" }}>{image.report_count}</span>
                      <span>sinyalman</span>
                    </div>
                    <div className="flex gap-1.5">
                      {image.page_url && (
                        <a
                          href={image.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {reportedIds.has(image.id) ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <CheckCircle className="w-4 h-4" /> Sinyale
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (!token) { openAuthModal(); return }
                            handleReport(image.id, "Esteyreotip negatif")
                          }}
                          disabled={reporting === image.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-white text-xs font-bold disabled:opacity-50"
                          style={{ backgroundColor: "#D21034" }}
                        >
                          {reporting === image.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Flag className="w-3 h-3" />
                          )}
                          Sinyale
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Aksyon konkrè */}
                  <div className="grid grid-cols-3 gap-1 mt-3 text-[11px] font-semibold">
                    <a
                      href={NEWS_SOURCES.find((s) => s.id === image.source_id)?.contactUrl || image.page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleAction(image, "media")}
                      className="border border-gray-200 dark:border-gray-800 px-2 py-1.5 text-center text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white"
                      title="Mande jounal la chanje foto a oswa lejand lan"
                    >
                      Ekri jounal la ({image.media_contacts ?? 0})
                    </a>
                    <a
                      href={GOOGLE_REPORT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleAction(image, "google")}
                      className="border border-gray-200 dark:border-gray-800 px-2 py-1.5 text-center text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white"
                      title="Fòmilè ofisyèl Google pou siyale yon kontni"
                    >
                      Siyale Google ({image.google_reports ?? 0})
                    </a>
                    <button
                      onClick={() => (token ? openUploadModal() : openAuthModal())}
                      className="border border-gray-200 dark:border-gray-800 px-2 py-1.5 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white"
                      title="Ajoute yon foto pozitif sou menm sijè a"
                    >
                      Kontre l ak bèl foto
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Soumisyon manyèl */}
        <form
          onSubmit={submitImage}
          className="border border-gray-200 dark:border-gray-800 p-5 md:p-8 mb-8 grid gap-3 md:grid-cols-[2fr_1fr_auto] items-end"
        >
          <div className="md:col-span-3">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-1">
              Ou jwenn yon imaj negatif?
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">Soumèt li pou kominote a siyale l.</p>
          </div>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Lyen imaj la (URL)
            <input
              type="url" required value={submitUrl} onChange={(e) => setSubmitUrl(e.target.value)}
              placeholder="https://..." className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
            />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Rechèch Google
            <input
              value={submitQuery} onChange={(e) => setSubmitQuery(e.target.value)}
              placeholder="Haiti poverty" className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
            />
          </label>
          <button type="submit" disabled={submitting} className="btn-haiti px-6 py-2.5 font-bold text-sm disabled:opacity-60">
            {submitting ? "Ap voye..." : "Soumèt"}
          </button>
          {submitMsg && <p role="status" className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">{submitMsg}</p>}
        </form>

        {/* CTA */}
        <div className="border border-gray-200 dark:border-gray-800 p-5 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-1">
              Defans pi bon: atak
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              Chak bèl foto ou ajoute kreye yon altènativ pozitif.
            </p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("openUploadModal"))}
            className="btn-haiti px-8 py-3 font-bold text-sm whitespace-nowrap"
          >
            Ajoute yon foto pozitif
          </button>
        </div>

      </div>
    </div>
  )
}
