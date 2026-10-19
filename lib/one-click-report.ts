"use client"

import { NEWS_SOURCES } from "@/lib/news-sources"
import { SITE_URL } from "@/lib/site"

export interface ReportableImage {
  id: number
  title: string
  page_url: string
  source_id?: string
  source_name?: string
}

export function mediaMessage(img: ReportableImage) {
  return `Bonjour,

Je vous écris au sujet de votre article « ${img.title} » :
${img.page_url}

La photo qui l'illustre renforce une image uniquement négative d'Haïti, qui ressort ensuite pendant des années dans Google Images pour la recherche « Haiti ».

Sans remettre en cause votre travail d'information, pourriez-vous préciser la date et le lieu de la photo dans la légende, ou, si elle n'est pas liée directement aux faits, la remplacer par une image récente et digne ?

Des photos d'Haïti libres de droits (crédit inclus) sont disponibles ici : ${SITE_URL}/katalog

Merci pour votre attention.`
}

/**
 * Signalement en un clic. Tout est pré-rempli par la plateforme :
 * - média avec email vérifié → ouvre le mail prêt à envoyer (destinataire, objet, texte) ;
 * - sinon → copie le message et ouvre la page contact du média.
 * L'ouverture se fait AVANT tout await, sinon le navigateur bloque la fenêtre.
 */
export function oneClickReport(img: ReportableImage, token: string | null): "mail" | "contact" {
  const source = NEWS_SOURCES.find((s) => s.id === img.source_id)
  const body = mediaMessage(img)
  let mode: "mail" | "contact"

  if (source?.email) {
    const subject = `Photo de l'article « ${img.title.slice(0, 80)} »`
    window.location.href = `mailto:${source.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    mode = "mail"
  } else {
    navigator.clipboard?.writeText(body).catch(() => {})
    window.open(source?.contactUrl || img.page_url, "_blank", "noopener,noreferrer")
    mode = "contact"
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers.Authorization = `Bearer ${token}`
  fetch(`/api/crawler/${img.id}/report`, { method: "POST", headers, body: JSON.stringify({ reason: "Stéréotype négatif" }) }).catch(() => {})
  if (token) fetch(`/api/crawler/${img.id}/action`, { method: "POST", headers, body: JSON.stringify({ action: "media" }) }).catch(() => {})
  return mode
}
