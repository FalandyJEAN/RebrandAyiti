"use client"

import { openAuthModal } from "@/lib/modal-events"

const CITIES = [
  "Pòtoprens", "Okap", "Jakmel", "Gonayiv",
  "Okay", "Jeremi", "Sen-Mak", "Ench",
  "Petyonvil", "Kenscoff", "Leyogàn", "Miragwàn",
]

const IMPACTS = [
  { value: "12 847", label: "Imaj patajé", sub: "depi lansмan an" },
  { value: "89",     label: "Peyi touche",  sub: "Google ap montre yo" },
  { value: "2 341",  label: "Imaj sinyalé", sub: "rapòte sou Google" },
  { value: "100%",   label: "Gratis, ouvè", sub: "MIT License" },
]

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

const CONTRIBUTORS = [
  { name: "Falandy Jean",  city: "Pòtoprens", photos: 47, color: "#003F87" },
  { name: "Marie Estimé",  city: "Jakmel",    photos: 34, color: "#D21034" },
  { name: "Kerby Lubin",   city: "Okap",      photos: 28, color: "#1a5fa8" },
  { name: "Sophia Pierre", city: "Okay",      photos: 21, color: "#e63350" },
]

export default function CommunitySection() {
  return (
    <section className="py-14 md:py-24 bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Titre */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start mb-10 md:mb-20">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-4">
              Mouvman an vivan
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Ayisyen{" "}
              <span style={{ color: '#003F87' }}>ak zanmi</span>{" "}
              Ayiti
              <br />
              <span style={{ color: '#D21034' }}>travay ansanm.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Nenpòt moun ki gen foto bèl Ayiti ka kontribye.
              Ou pa bezwen kòd — jis yon foto, yon koub, yon vi ou vle pataje.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-300 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 mb-10 md:mb-20">
          {IMPACTS.map((stat, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-950 px-4 py-6 md:px-8 md:py-10">
              <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-gray-900 dark:text-white font-semibold text-sm mb-1">{stat.label}</div>
              <div className="text-gray-500 text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* 2 colonnes */}
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Kontribitè */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-6">
              Kèk kontribitè
            </h3>
            <div className="space-y-3">
              {CONTRIBUTORS.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <Avatar name={c.name} color={c.color} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">{c.name}</div>
                    <div className="text-gray-500 text-sm">{c.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white font-bold">{c.photos}</div>
                    <div className="text-gray-400 text-xs">foto</div>
                  </div>
                </div>
              ))}
              <button
                onClick={openAuthModal}
                className="w-full mt-2 p-4 border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-500 dark:hover:border-gray-400 transition-colors text-sm font-medium"
              >
                + Vin kontribye tou
              </button>
            </div>
          </div>

          {/* Vil + Manifès */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-6">
              Vil nan Ayiti ki reprezante
            </h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {CITIES.map((city, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-default"
                >
                  {city}
                </span>
              ))}
              <span className="px-3 py-1.5 text-sm border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600">
                + ou menm…
              </span>
            </div>

            {/* Manifès */}
            <div
              className="p-5 md:p-8 border-l-4"
              style={{ borderColor: '#D21034', backgroundColor: 'rgba(210,16,52,0.06)' }}
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed mb-4">
                &ldquo;Ayiti pa sèlman tranblemantè ak povrete. Se art, se mizik, se rezistans,
                se bèlte ki pa janm fini.&rdquo;
              </p>
              <p className="text-gray-500 text-sm">— Misyon RebrandAyiti</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
