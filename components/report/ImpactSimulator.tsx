"use client"

import { useState } from "react"

function Slider({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) {
  return (
    <label className="block text-sm text-gray-700 dark:text-gray-300">
      <span className="flex justify-between font-semibold">
        {label} <span className="font-black text-gray-900 dark:text-white">{value}</span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full mt-1 accent-[#003F87]" />
    </label>
  )
}

// Simulation transparente : uniquement des multiplications affichées, aucune promesse sur l'algorithme de Google
export default function ImpactSimulator({ imagesCount }: { imagesCount: number }) {
  const [members, setMembers] = useState(20)
  const [actionsPerWeek, setActionsPerWeek] = useState(3)
  const [sharesPerWeek, setSharesPerWeek] = useState(1)
  const weeks = 4

  const actions = members * actionsPerWeek * weeks
  const focused = 5
  const perImageFocused = Math.round(actions / focused)
  const perImageSpread = imagesCount > 0 ? (actions / imagesCount).toFixed(1) : "—"
  const positivePages = members * sharesPerWeek * weeks

  return (
    <section className="border border-gray-200 dark:border-gray-800 p-5 md:p-8 mb-10" aria-labelledby="sim-titre">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600 mb-1">Similasyon</p>
      <h2 id="sim-titre" className="text-2xl font-black text-gray-900 dark:text-white mb-6">Ki sa yon ti gwoup ka fè an 4 semèn ?</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <Slider label="Manm aktif" value={members} set={setMembers} min={3} max={500} />
          <Slider label="Aksyon pa manm / semèn" value={actionsPerWeek} set={setActionsPerWeek} min={1} max={10} />
          <Slider label="Bèl foto pataje pa manm / semèn" value={sharesPerWeek} set={setSharesPerWeek} min={0} max={7} />
        </div>

        <dl className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
          <div className="bg-white dark:bg-gray-950 p-4">
            <dt className="text-xs text-gray-500">Aksyon total</dt>
            <dd className="text-3xl font-black" style={{ color: "#003F87" }}>{actions}</dd>
          </div>
          <div className="bg-white dark:bg-gray-950 p-4">
            <dt className="text-xs text-gray-500">Paj ak foto pozitif « Haiti »</dt>
            <dd className="text-3xl font-black" style={{ color: "#16a34a" }}>{positivePages}</dd>
          </div>
          <div className="bg-white dark:bg-gray-950 p-4">
            <dt className="text-xs text-gray-500">Aksyon pa imaj — konsantre ({focused})</dt>
            <dd className="text-3xl font-black" style={{ color: "#D21034" }}>{perImageFocused}</dd>
          </div>
          <div className="bg-white dark:bg-gray-950 p-4">
            <dt className="text-xs text-gray-500">Aksyon pa imaj — gaye ({imagesCount})</dt>
            <dd className="text-3xl font-black text-gray-400">{perImageSpread}</dd>
          </div>
        </dl>
      </div>

      <p className="text-xs text-gray-500 mt-6 max-w-3xl">
        Kalkil la senp : manm × aksyon × 4 semèn. Li montre poukisa nou konsantre sou 5 imaj : {members} moun ka voye{" "}
        {perImageFocused} mesaj sou chak atik olye de {perImageSpread}. Se yon estimasyon, pa yon garanti — Google pa
        pibliye kijan li klase imaj yo, epi yon medya ka refize chanje yon foto.
      </p>
    </section>
  )
}
