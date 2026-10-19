"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Heart, MapPin } from "lucide-react"
import { openUploadModal, openAuthModal } from "@/lib/modal-events"
import { categories } from "@/data/categories"
import { useAuth } from "@/lib/auth-context"

interface Photo {
  id: string
  url: string
  title: string
  description: string
  location: string
  author: string
  likes: number
  comments: number
  timestamp: string
  tags: string[]
  category: string
  likes_count?: number
  created_at?: string
}

export default function GalleryPage() {
  const { token } = useAuth()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set())

  const loadPhotos = async () => {
    try {
      const res = await fetch("/api/photos?limit=50")
      const data = await res.json()
      const apiPhotos = (data.photos || []).map((p: Photo) => ({
        ...p,
        likes: p.likes_count ?? p.likes ?? 0,
        author: (p as Photo & { author_name?: string }).author_name ?? p.author ?? "",
        timestamp: p.created_at ? new Date(p.created_at).toLocaleDateString("fr-FR") : "Récent",
        tags: p.tags || [],
        description: p.description || "",
      }))
      setPhotos(apiPhotos)
    } catch {
      setPhotos([])
    }
  }

  useEffect(() => {
    loadPhotos()
    window.addEventListener("photosUpdated", loadPhotos)
    return () => window.removeEventListener("photosUpdated", loadPhotos)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLike = async (photoId: string) => {
    if (!token) { openAuthModal(); return }
    if (!isNaN(Number(photoId))) {
      try {
        await fetch(`/api/photos/${photoId}/like`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {}
    }
    setLikedPhotos((prev) => {
      const next = new Set(prev)
      next.has(photoId) ? next.delete(photoId) : next.add(photoId)
      return next
    })
  }

  const NAV_CATS = [{ id: "all", label: "Tout" }, ...categories.slice(0, 8).map(c => ({ id: c.id, label: c.label }))]

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">

      {/* Bande drapeau */}
      <div className="flex h-1">
        <div className="flex-1" style={{ backgroundColor: "#003F87" }} />
        <div className="flex-1" style={{ backgroundColor: "#D21034" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-3">
              RebrandStock
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-none">
              Galri foto.
              <br />
              <span style={{ color: "#D21034" }}>Ayiti reyèl.</span>
            </h1>
          </div>
          <button
            onClick={openUploadModal}
            className="btn-haiti inline-flex items-center gap-2 px-6 py-3 font-bold text-sm self-start sm:self-auto"
          >
            + Ajoute yon foto
          </button>
        </div>

        {/* Recherche */}
        <div className="relative max-w-sm mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Chèche yon foto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#003F87] dark:focus:border-white transition-colors"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-0 border-b border-gray-200 dark:border-gray-800 mb-10 overflow-x-auto">
          {NAV_CATS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                selectedCategory === cat.id
                  ? "border-[#003F87] text-[#003F87] dark:text-white dark:border-white"
                  : "border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grille */}
        {filteredPhotos.length === 0 ? (
          <div className="py-20 text-center border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-3">
              Okenn foto
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white mb-6">
              Pa gen foto ki koresponn.
            </p>
            <button onClick={openUploadModal} className="btn-haiti px-6 py-3 font-bold text-sm">
              Ajoute premye foto a
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 mb-12">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="group bg-white dark:bg-gray-950 overflow-hidden">
                <Link href={!isNaN(Number(photo.id)) ? `/photos/${photo.id}` : "#"}>
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image
                      src={photo.url || "/images/haiti-hero.jpg"}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={photo.url?.startsWith("data:")}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs font-medium truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {photo.location}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 mb-2">
                    {photo.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {photo.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleLike(photo.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        likedPhotos.has(photo.id)
                          ? "text-[#D21034]"
                          : "text-gray-400 hover:text-[#D21034]"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPhotos.has(photo.id) ? "fill-current" : ""}`} />
                      <span>{photo.likes + (likedPhotos.has(photo.id) ? 1 : 0)}</span>
                    </button>
                    <span className="text-xs text-gray-400 dark:text-gray-600 truncate max-w-[8rem]">
                      {photo.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="border border-gray-200 dark:border-gray-800 p-5 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-1">
              Tu gen yon foto?
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              Chak foto ou ajoute se yon vwa pou Ayiti.
            </p>
          </div>
          <button
            onClick={openUploadModal}
            className="btn-haiti px-8 py-3 font-bold text-sm whitespace-nowrap"
          >
            Pataje kounye a
          </button>
        </div>

      </div>
    </div>
  )
}
