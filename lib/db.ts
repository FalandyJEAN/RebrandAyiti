import { neon } from "@neondatabase/serverless"

let _sql: ReturnType<typeof neon<false, false>> | null = null

// Connexion paresseuse : le build ne plante pas si DATABASE_URL est absent
export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  (_sql ??= neon(process.env.DATABASE_URL!))(strings, ...values)) as ReturnType<typeof neon<false, false>>

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  await sql`
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
  await sql`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      photo_id INTEGER NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (user_id, photo_id)
    )
  `
  await sql`
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
  await sql`
    CREATE TABLE IF NOT EXISTS image_reports (
      id SERIAL PRIMARY KEY,
      image_id INTEGER REFERENCES negative_images(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      reason TEXT NOT NULL,
      reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
}
