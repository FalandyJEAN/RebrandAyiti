"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface HeroData {
  title: string
  subtitle: string
  description: string
  ctaText: string
  secondaryCTA: string
  imageUrl: string
  imageAlt: string
}

interface HeroSectionProps {
  data: HeroData
  onGetStarted: () => void
}

export default function HeroSection({ data, onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col">

      {/* Barre drapeau en haut */}
      <div className="flex h-1.5 z-20 relative">
        <div className="flex-1" style={{ backgroundColor: '#003F87' }} />
        <div className="flex-1" style={{ backgroundColor: '#D21034' }} />
      </div>

      {/* Image de fond plein écran */}
      <div className="absolute inset-0">
        <Image
          src="/images/haiti-hero.jpg"
          alt={data.imageAlt}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay diagonal — bleu gauche, rouge droit */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(0,63,135,0.92) 0%, rgba(0,63,135,0.75) 45%, rgba(0,0,0,0.55) 60%, rgba(210,16,52,0.70) 100%)',
          }}
        />
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col justify-center flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl">

          {/* Label mouvement */}
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/60 mb-6">
            Mouvman RebrandAyiti
          </p>

          {/* Titre massif */}
          <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6">
            {data.title}
          </h1>

          {/* Sous-titre */}
          <p
            className="text-xl sm:text-2xl font-bold mb-6 leading-tight"
            style={{ color: '#ffcdd8' }}
          >
            {data.subtitle}
          </p>

          <p className="text-base md:text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
            {data.description}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-white font-bold text-base md:text-lg px-8 py-4 hover:bg-gray-100 transition-colors"
              style={{ color: '#003F87' }}
            >
              {data.ctaText}
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-bold text-base md:text-lg px-8 py-4 hover:border-white hover:bg-white/10 transition-colors"
            >
              {data.secondaryCTA}
            </a>
          </div>
        </div>
      </div>

      {/* Bande basse — stats typographiques sur fond noir */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { n: "12 847", label: "Foto patajé" },
              { n: "2 341", label: "Imaj negatif signalé" },
              { n: "89", label: "Peyi touche" },
            ].map((s, i) => (
              <div key={i} className="py-5 px-3 md:px-6 text-center">
                <div className="text-xl md:text-2xl font-black text-white">{s.n}</div>
                <div className="text-[10px] md:text-xs text-white/40 mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
