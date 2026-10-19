import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import { MapPin, Calendar, User, ArrowLeft, Tag } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

async function getPhoto(id: string) {
  try {
    const result = await sql`
      SELECT p.*, u.name as author_name
      FROM photos p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ${parseInt(id)}
    `
    return result[0] || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const photo = await getPhoto(id)

  if (!photo) return { title: "Photo introuvable — RebrandAyiti" }

  const tags = photo.tags?.join(", ") || "Haïti, photographie"

  return {
    title: `${photo.title} — RebrandAyiti`,
    description: photo.description
      ? `${photo.description} | Photo d'Haïti prise à ${photo.location}.`
      : `Photo authentique d'Haïti : ${photo.title}, prise à ${photo.location} par ${photo.author_name}. Découvrez la beauté réelle d'Haïti.`,
    keywords: [
      "Haïti", "Haiti", "photographie Haïti", photo.location, photo.category,
      ...( photo.tags || []),
      "culture haïtienne", "beauté Haïti", "RebrandAyiti",
    ],
    openGraph: {
      title: `${photo.title} — RebrandAyiti`,
      description: `Photo d'Haïti : ${photo.location}. ${tags}`,
      images: [{ url: photo.url, width: 1200, height: 630, alt: photo.title }],
      type: "article",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: photo.title,
      description: `Photo authentique d'Haïti prise à ${photo.location}`,
      images: [photo.url],
    },
    alternates: {
      canonical: `/photos/${id}`,
    },
  }
}

export default async function PhotoPage({ params }: Props) {
  const { id } = await params
  const photo = await getPhoto(id)

  if (!photo) notFound()

  const formattedDate = new Date(photo.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* JSON-LD pou Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            name: photo.title,
            description: photo.description || `Foto otantik Ayiti pran nan ${photo.location}`,
            contentUrl: photo.url,
            author: { "@type": "Person", name: photo.author_name },
            locationCreated: { "@type": "Place", name: photo.location, addressCountry: "HT" },
            keywords: (photo.tags || []).join(", "),
            datePublished: photo.created_at,
            publisher: { "@type": "Organization", name: "RebrandAyiti" },
          }),
        }}
      />

      {/* Bande drapeau */}
      <div className="flex h-1">
        <div className="flex-1" style={{ backgroundColor: '#003F87' }} />
        <div className="flex-1" style={{ backgroundColor: '#D21034' }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-10">

        {/* Retour */}
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Tounen galri a
        </Link>

        {/* Photo */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
          <div className="relative w-full" style={{ paddingBottom: "60%" }}>
            <Image
              src={photo.url}
              alt={`${photo.title} — Foto Ayiti, ${photo.location}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6 md:p-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-3">
              RebrandAyiti
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-5">
              {photo.title}
            </h1>

            <div className="flex flex-wrap gap-5 text-sm text-gray-500 dark:text-gray-400 mb-6 border-t border-b border-gray-100 dark:border-gray-800 py-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" style={{ color: '#003F87' }} />
                <span>{photo.location}, <strong className="text-gray-700 dark:text-gray-300">Ayiti</strong></span>
              </div>
              {photo.author_name && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" style={{ color: '#D21034' }} />
                  <span>{photo.author_name}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {photo.description && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {photo.description}
              </p>
            )}

            {photo.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                {photo.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA éditorial */}
        <div className="border border-gray-200 dark:border-gray-800 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-1">
              Ou gen yon foto?
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              Chak foto se yon vwa pou Ayiti.
            </p>
          </div>
          <Link href="/" className="btn-haiti px-8 py-3 font-bold text-sm whitespace-nowrap">
            Rejwenn mouvman an
          </Link>
        </div>

      </div>
    </div>
  )
}
