import Image from "next/image"
import Link from "next/link"

const TEAM = [
  { name: "Falandy Jean",       role: "Fondatè & Dev",   city: "Pòtoprens" },
  { name: "Marie Beaubrun",     role: "Dezay & UX",      city: "Jakmel" },
  { name: "Réginald François",  role: "Kominote",        city: "Okap" },
  { name: "Sabrina Désir",      role: "Kontni & SEO",    city: "Miami, USA" },
]

const VALUES = [
  {
    num: "01",
    title: "Otantisite",
    body: "Chak foto dwe reprezante vrè Ayiti — san filtre, san manipilasyon.",
    color: "#003F87",
  },
  {
    num: "02",
    title: "Kominote",
    body: "Pwojè sa pou tout Ayisyen ak tout moun ki renmen Ayiti.",
    color: "#D21034",
  },
  {
    num: "03",
    title: "Open-Source",
    body: "Kòd ak done ouvè pou yon enpak maksimòm, transparan.",
    color: "#003F87",
  },
  {
    num: "04",
    title: "Diyite",
    body: "Ayiti merite reprezantasyon ki bay respè ak fyète.",
    color: "#D21034",
  },
]

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black mx-auto mb-4"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

const COLORS = ["#003F87", "#D21034", "#1a5fa8", "#e63350"]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">

      {/* Bande drapeau */}
      <div className="flex h-1">
        <div className="flex-1" style={{ backgroundColor: "#003F87" }} />
        <div className="flex-1" style={{ backgroundColor: "#D21034" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Hero éditorial */}
        <div className="py-14 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-4">
              Mouvman Ayisyen
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-none mb-6">
              Misyon nou.
              <br />
              <span style={{ color: "#D21034" }}>Chanje imaj.</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              RebrandAyiti se yon mouvman sitwayan pou chanje pèsepsyon mondyal Ayiti —
              yon foto otantik alafwa.
            </p>
          </div>
          <div className="relative h-64 md:h-80 overflow-hidden border border-gray-200 dark:border-gray-800">
            <Image src="/images/haiti-hero.jpg" alt="Ayiti" fill className="object-cover" />
          </div>
        </div>

        {/* Pou ki sa */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-14 md:py-20">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-6">
            Pou ki sa nou fè sa
          </p>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-6">
                Poukisa RebrandAyiti?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Lè ou tape «Haïti» sou Google Imaj, ou wè prensipalman imaj povrete,
                  katastwòf ak vyolans. Imaj sa yo pa reprezante richès kiltirèl, bèlte natirèl
                  ak rezistans pèp ayisyen an.
                </p>
                <p>
                  RebrandAyiti soti nan yon konviksyon senp: si nou ranpli Entènèt ak bèl imaj
                  otantik Ayiti, algoritm Google ap natirèlman mete yo devan.
                </p>
                <p>
                  Chak foto ou pataje se yon aksyon konkrèt pou chanje naratif la.
                </p>
              </div>
            </div>
            <div
              className="p-5 md:p-8 border-l-4"
              style={{ borderColor: "#003F87", backgroundColor: "rgba(0,63,135,0.05)" }}
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed mb-4">
                &ldquo;Ayiti pa sèlman tranblemantè ak povrete. Se art, se mizik,
                se rezistans, se bèlte ki pa janm fini.&rdquo;
              </p>
              <p className="text-gray-500 text-sm">— Misyon RebrandAyiti</p>
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-14 md:py-20">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-10">
            Valè nou
          </p>
          <div className="grid sm:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
            {VALUES.map((v) => (
              <div key={v.num} className="bg-white dark:bg-gray-950 p-6 md:p-8 group relative overflow-hidden">
                <p className="text-5xl font-black text-gray-100 dark:text-gray-800 mb-4 select-none">{v.num}</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{v.body}</p>
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: v.color }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Équipe */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-14 md:py-20">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-10">
            Ekip la
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
            {TEAM.map((m, i) => (
              <div key={m.name} className="bg-white dark:bg-gray-950 p-6 text-center">
                <Avatar name={m.name} color={COLORS[i % COLORS.length]} />
                <h3 className="font-black text-gray-900 dark:text-white text-sm">{m.name}</h3>
                <p className="text-sm font-semibold mt-1" style={{ color: COLORS[i % COLORS.length] }}>{m.role}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{m.city}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-1">
              Rantre nan mouvman an
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              Chak kontribitè konte.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/gallery" className="btn-haiti px-6 py-3 font-bold text-sm">
              Wè galri a
            </Link>
            <Link
              href="/contact"
              className="border border-gray-900 dark:border-white text-gray-900 dark:text-white px-6 py-3 font-bold text-sm hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
            >
              Kontakte nou
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
