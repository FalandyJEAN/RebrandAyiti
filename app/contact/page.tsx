"use client"

import type React from "react"
import { useState } from "react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const messages = JSON.parse(localStorage.getItem("rebrand_messages") || "[]")
    messages.push({ ...form, sentAt: new Date().toISOString() })
    localStorage.setItem("rebrand_messages", JSON.stringify(messages))
    setSent(true)
  }

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#003F87] dark:focus:border-white transition-colors"

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">

      {/* Bande drapeau */}
      <div className="flex h-1">
        <div className="flex-1" style={{ backgroundColor: "#003F87" }} />
        <div className="flex-1" style={{ backgroundColor: "#D21034" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 md:py-24">

        {/* En-tête */}
        <div className="mb-12 md:mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-4">
            Mouvman Ayisyen
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-none">
            Kontakte nou.
            <br />
            <span style={{ color: "#003F87" }}>Nou koute.</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">

          {/* Informasyon */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-8">
              Jwenn nou
            </p>

            <div className="space-y-0 border border-gray-200 dark:border-gray-800">
              <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600 mb-1">Email</p>
                <a
                  href="https://github.com/FalandyJEAN/RebrandAyiti/issues"
                  className="font-semibold text-gray-900 dark:text-white hover:underline"
                >
                  GitHub Issues
                </a>
              </div>
              <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600 mb-1">Kote nou ye</p>
                <p className="font-semibold text-gray-900 dark:text-white">Pòtoprens, Ayiti</p>
              </div>
              <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600 mb-1">GitHub</p>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  github.com/FalandyJEAN/RebrandAyiti
                </span>
              </div>
              <div className="px-5 py-5">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600 mb-1">Twitter / X</p>
                <span className="font-semibold text-gray-900 dark:text-white">@rebrandayiti</span>
              </div>
            </div>

            {/* Quote */}
            <div
              className="mt-8 p-5 border-l-4"
              style={{ borderColor: "#D21034", backgroundColor: "rgba(210,16,52,0.06)" }}
            >
              <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                &ldquo;Pwojè open-source pou chanje reprezantasyon vizyèl
                Ayiti sou Entènèt. Gratis. Ouvè. Pou tout moun.&rdquo;
              </p>
            </div>
          </div>

          {/* Fòmilè */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-8">
              Voye yon mesaj
            </p>

            {sent ? (
              <div className="border border-gray-200 dark:border-gray-800 p-8 text-center">
                <div className="w-1.5 h-8 mx-auto mb-4" style={{ backgroundColor: "#003F87" }} />
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Mesaj voye!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Nou pral reponn ou nan 48 èdtan.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white underline transition-colors"
                >
                  Voye yon lòt mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-0 border border-gray-200 dark:border-gray-800">
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600 px-4 pt-4 pb-1">
                    Non
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass + " border-0 border-none focus:ring-0 px-4 pb-4"}
                    placeholder="Non ou"
                    required
                  />
                </div>

                <div className="border-b border-gray-200 dark:border-gray-800">
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600 px-4 pt-4 pb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass + " border-0 border-none focus:ring-0 px-4 pb-4"}
                    placeholder="ou@email.com"
                    required
                  />
                </div>

                <div className="border-b border-gray-200 dark:border-gray-800">
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600 px-4 pt-4 pb-1">
                    Sijè
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={inputClass + " border-0 border-none focus:ring-0 px-4 pb-4"}
                    placeholder="Sou kisa?"
                    required
                  />
                </div>

                <div className="border-b border-gray-200 dark:border-gray-800">
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600 px-4 pt-4 pb-1">
                    Mesaj
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className={inputClass + " border-0 border-none focus:ring-0 px-4 pb-4 resize-none"}
                    placeholder="Mesaj ou..."
                    required
                  />
                </div>

                <div className="p-4">
                  <button
                    type="submit"
                    className="btn-haiti w-full py-3 font-bold text-sm"
                  >
                    Voye mesaj la
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
