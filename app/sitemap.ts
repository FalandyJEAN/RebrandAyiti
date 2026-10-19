import { type MetadataRoute } from "next"
import { sql } from "@/lib/db"
import { SITE_URL as baseUrl, absoluteUrl } from "@/lib/site"

// Généré à chaque demande : les nouvelles photos du catalogue y entrent sans redéploiement
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/katalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/pataje`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/report`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  try {
    const photos = await sql`SELECT id, url, created_at FROM photos ORDER BY created_at DESC LIMIT 1000`
    const photoRoutes: MetadataRoute.Sitemap = photos.map((photo) => ({
      url: `${baseUrl}/photos/${photo.id}`,
      lastModified: new Date(photo.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      // Sitemap d'images : Google Images découvre directement les photos
      images: [absoluteUrl(photo.url)],
    }))
    // Katalòg : chak bèl foto gen paj pa l ak imaj li nan sitemap la
    const catalog = await sql`SELECT id, image_url, created_at FROM catalog_images WHERE kind = 'free' ORDER BY id DESC LIMIT 5000`
    const catalogRoutes: MetadataRoute.Sitemap = catalog.map((c) => ({
      url: `${baseUrl}/katalog/${c.id}`,
      lastModified: new Date(c.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [c.image_url],
    }))
    return [...staticRoutes, ...photoRoutes, ...catalogRoutes]
  } catch {
    return staticRoutes
  }
}
