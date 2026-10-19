import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { sql } from "@/lib/db"
import { embedCode, photoAlt, type EmbeddablePhoto } from "@/lib/site"
import EmbedBox from "@/components/EmbedBox"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pataje bèl imaj Ayiti — Gid pou blogè ak medya | RebrandAyiti",
  description:
    "How to share photos of Haiti on a blog like professional newspapers: file names, alt text, captions, credit, license. Gid pou pataje imaj Ayiti san sal web la.",
  alternates: { canonical: "/pataje" },
}

const RULES = [
  {
    n: "01",
    title: "Ekri « Haiti » — pa sèlman « Ayiti »",
    body: "Google klase imaj yo selon tèks ki antoure yo. Mond lan tape « Haiti » : se la vye imaj negatif yo ye. Lè nou ekri sèlman « Ayiti », bèl foto nou yo rete nan yon ti bul. Mete « Haiti » (angle), « Haïti » (franse) ak « Ayiti » ansanm.",
  },
  {
    n: "02",
    title: "Non fichye a konte",
    body: "Pa voye « IMG_2041.jpg ». Rele l « haiti-citadelle-laferriere-milot.jpg » : peyi, kote, sijè, ak tirè ant mo yo. Se konsa jounal ameriken yo nonmen foto yo.",
  },
  {
    n: "03",
    title: "Tèks altènatif (alt) presi",
    body: "Dekri sa foto a montre vre : « Haiti — Masks at the Jacmel Carnival, Sud-Est ». Li sèvi moun ki pa wè yo, epi se premye siyal Google Images li.",
  },
  {
    n: "04",
    title: "Lejand ak kredi, toujou",
    body: "Anba chak foto : kote, dat, non fotograf la ak lisans lan (egz. « Photo : Marie D. / RebrandAyiti, CC BY 4.0 »). Done estriktire (ImageObject) yo bay Google kredi a epi l ka afiche badj « Licensable ».",
  },
  {
    n: "05",
    title: "Pa repibliye imaj negatif yo, menm pou denonse yo",
    body: "Chak fwa yon blog repoze yon vye foto negatif, li ba li plis fòs sou Google. Pou denonse yon atik, mete lyen an — pa imaj la. Sa se « pa sal web ayisyen an ».",
  },
  {
    n: "06",
    title: "Nouvèl difisil ? Foto resan ak diy",
    body: "Si w ap pale de yon kriz, pa pran yon foto 2010 nan yon bank imaj. Chwazi yon foto resan, ki respekte moun yo, ak yon lejand ki gen dat. Yon foto ki pa date ankouraje estereyotip.",
  },
]

const CHECKLIST = [
  "Non fichye a gen « haiti » + kote a",
  "Alt la kòmanse ak « Haiti — » epi li dekri foto a",
  "Gen yon lejand (kote, dat, kredi, lisans)",
  "Paj la gen yon lyen retou bò kote fotograf la",
  "Okenn imaj negatif pa repibliye — se lyen sèlman",
  "Tit atik la ak foto a pale de menm bagay",
]

async function getPhotos(): Promise<EmbeddablePhoto[]> {
  try {
    return (await sql`
      SELECT id, title, location, url, description, author_name FROM photos ORDER BY likes_count DESC, created_at DESC LIMIT 6
    `) as EmbeddablePhoto[]
  } catch {
    return []
  }
}

export default async function PatajePage() {
  const photos = await getPhotos()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="flex h-1">
        <div className="flex-1" style={{ backgroundColor: "#003F87" }} />
        <div className="flex-1" style={{ backgroundColor: "#D21034" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Entèt */}
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-4">
          Gid pou blogè, medya ak kreyatè
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-none mb-6">
          Pataje Ayiti
          <br />
          <span style={{ color: "#D21034" }}>jan jounal yo fè l.</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-10">
          Tape « Ayiti » sou Google : ou wè bèl imaj. Tape « Haiti » : ou wè vye foto kriz. Diferans lan se tèks ki antoure
          foto yo. Gid sa a montre kijan pou chak blog ede chanje rezilta « Haiti ».
        </p>

        {/* Konpare */}
        <div className="grid sm:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 mb-16">
          {[
            { q: "Ayiti", note: "Kominote a ekri an kreyòl : imaj pozitif", color: "#16a34a" },
            { q: "Haiti", note: "Mond lan ak gwo medya yo : vye imaj negatif", color: "#D21034" },
          ].map((c) => (
            <a
              key={c.q}
              href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(c.q)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-950 p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: c.color }}>
                Verifye sou Google Images ↗
              </p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">« {c.q} »</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.note}</p>
            </a>
          ))}
        </div>

        {/* Règ yo */}
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-6">6 règ jounalis yo</h2>
        <ol className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 mb-16">
          {RULES.map((r) => (
            <li key={r.n} className="bg-white dark:bg-gray-950 p-6">
              <p className="text-sm font-black mb-2" style={{ color: "#003F87" }}>{r.n}</p>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{r.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{r.body}</p>
            </li>
          ))}
        </ol>

        {/* Kòd pou kole */}
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Kòd pare pou kole</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Chak kòd gen deja alt, lejand, kredi, lisans CC BY 4.0 ak done estriktire pou Google. Kole l nan WordPress
          (blòk « HTML pèsonalize »), Wix, Blogger oswa nenpòt sit.
        </p>
        {photos.length === 0 ? (
          <p className="text-gray-500 mb-16">Pa gen foto ankò nan galri a.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {photos.map((p) => (
              <div key={p.id} className="border border-gray-200 dark:border-gray-800">
                <div className="relative h-48">
                  <Image src={p.url} alt={photoAlt(p)} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <Link href={`/photos/${p.id}`} className="font-bold text-gray-900 dark:text-white hover:underline">
                    {p.title}
                  </Link>
                  <p className="text-xs text-gray-500 mb-3">{p.location}</p>
                  <EmbedBox code={embedCode(p)} rows={5} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Checklist */}
        <div className="border border-gray-200 dark:border-gray-800 p-6 md:p-8 mb-12">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Anvan w pibliye</h2>
          <ul className="space-y-2">
            {CHECKLIST.map((c) => (
              <li key={c} className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span aria-hidden="true" style={{ color: "#16a34a" }}>✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/gallery" className="btn-haiti px-8 py-3 font-bold text-sm text-center">
            Chwazi yon foto nan galri a
          </Link>
          <Link
            href="/report"
            className="px-8 py-3 font-bold text-sm text-center border border-gray-900 dark:border-white text-gray-900 dark:text-white"
          >
            Siyale yon imaj negatif
          </Link>
        </div>
      </div>
    </div>
  )
}
