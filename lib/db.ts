import { neon } from "@neondatabase/serverless"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>
type Query = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Row[]>

// Production : Neon (DATABASE_URL). Prototype local : PGlite (Postgres embarqué dans .data/)
// Partagé via globalThis : chaque route Next a son propre module, mais PGlite n'accepte qu'une instance
const g = globalThis as unknown as { __rbDb?: { query?: Promise<Query>; ready?: Promise<void> } }
const state = (g.__rbDb ??= {})

function getQuery(): Promise<Query> {
  return (state.query ??= createQuery())
}

async function createQuery(): Promise<Query> {
  if (process.env.DATABASE_URL) {
    const n = neon(process.env.DATABASE_URL)
    return (strings, ...values) => n(strings, ...values) as Promise<Row[]>
  } else {
    const { PGlite } = await import("@electric-sql/pglite")
    const dir = process.env.PGLITE_DIR || "./.data/pglite"
    await (await import("fs/promises")).mkdir(dir, { recursive: true })
    const db = new PGlite(dir)
    return async (strings, ...values) => {
      const text = strings.reduce((acc, s, i) => acc + (i > 0 ? `$${i}` : "") + s, "")
      const res = await db.query<Row>(text, values)
      return res.rows
    }
  }
}

async function raw(strings: TemplateStringsArray, ...values: unknown[]) {
  return (await getQuery())(strings, ...values)
}

// Le schéma est créé (et la galerie amorcée) automatiquement au premier appel
export async function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<Row[]> {
  state.ready ??= initDB().catch((e) => { state.ready = undefined; throw e })
  await state.ready
  return raw(strings, ...values)
}

const SEED_PHOTOS = [
  ["Citadelle Laferrière au lever du soleil", "Milot, Nord", "patrimoine", "citadelle", ["citadelle", "patrimoine", "unesco"], "/images/citadelle-sunrise.jpg"],
  ["Masques colorés du Carnaval de Jacmel", "Jacmel, Sud-Est", "culture", "carnaval", ["carnaval", "jacmel", "masques"], "/images/jacmel-carnival.jpg"],
  ["Plage de Labadee", "Labadee, Nord", "nature", "plages", ["plage", "labadee", "turquoise"], "/images/labadee-beach.jpg"],
  ["Marché en Fer de Port-au-Prince", "Port-au-Prince, Ouest", "architecture", "coloniale", ["marché", "architecture", "fer"], "/images/iron-market.jpg"],
  ["Peinture naïve haïtienne", "Pétion-Ville, Ouest", "art", "peinture", ["peinture", "art-naïf", "couleurs"], "/images/haitian-art.jpg"],
  ["Griot ak banann boukannen", "Cap-Haïtien, Nord", "gastronomie", "plats-traditionnels", ["griot", "cuisine", "tradisyon"], "/images/haiti-culture.jpg"],
  ["Tap-tap coloré dans les rues", "Port-au-Prince, Ouest", "vie-quotidienne", "transport", ["tap-tap", "couleurs", "art"], "/images/tap-tap.jpg"],
  ["Bassin Bleu — Piscine naturelle", "Jacmel, Sud-Est", "nature", "rivières", ["bassin-bleu", "nature", "turquoise"], "/images/bassin-bleu.jpg"],
] as const

export async function initDB() {
  await raw`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  await raw`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT DEFAULT '',
      tags TEXT[] DEFAULT '{}',
      url TEXT NOT NULL,
      author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      author_name TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  await raw`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      photo_id INTEGER NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (user_id, photo_id)
    )
  `
  await raw`
    CREATE TABLE IF NOT EXISTS negative_images (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL UNIQUE,
      page_url TEXT DEFAULT '',
      search_query TEXT NOT NULL,
      title TEXT DEFAULT '',
      context TEXT DEFAULT '',
      negativity_score FLOAT DEFAULT 0,
      ai_labels JSONB DEFAULT '[]',
      report_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  await raw`
    CREATE TABLE IF NOT EXISTS image_reports (
      id SERIAL PRIMARY KEY,
      image_id INTEGER REFERENCES negative_images(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      reason TEXT NOT NULL,
      reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  const [{ count }] = await raw`SELECT COUNT(*)::int AS count FROM photos`
  if (count === 0) {
    for (const [title, location, category, subcategory, tags, url] of SEED_PHOTOS) {
      await raw`
        INSERT INTO photos (title, location, category, subcategory, tags, url, author_name)
        VALUES (${title}, ${location}, ${category}, ${subcategory}, ${[...tags]}, ${url}, ${"Kominote RebrandAyiti"})
      `
    }
  }
}
