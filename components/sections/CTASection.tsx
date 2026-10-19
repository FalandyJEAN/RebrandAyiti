"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { openAuthModal } from "@/lib/modal-events"

interface CTASectionProps {
  data: {
    title: string
    subtitle: string
    primaryCTA: string
    secondaryCTA: string
  }
  onGetStarted?: () => void
}

export default function CTASection({ data }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950">

      {/* Drapeau haïtien horizontal en haut de section */}
      <div className="flex h-2">
        <div className="flex-1" style={{ backgroundColor: '#003F87' }} />
        <div className="flex-1" style={{ backgroundColor: '#D21034' }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 md:py-28 text-center">

        {/* Headline éditorial */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight text-gray-900 dark:text-white mb-8">
          {data.title}
        </h2>

        <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
          {data.subtitle}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={openAuthModal}
            className="btn-haiti inline-flex items-center gap-2 px-6 py-3 md:px-10 md:py-4 text-base md:text-lg font-bold"
          >
            {data.primaryCTA}
            <ArrowRight className="w-5 h-5" />
          </button>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-6 py-3 md:px-10 md:py-4 text-base md:text-lg font-bold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
          >
            {data.secondaryCTA}
          </Link>
        </div>

        {/* Open source badge */}
        <div className="mt-14 inline-flex items-center gap-2 text-gray-400 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Open-source — MIT License —&nbsp;
          <a
            href="https://github.com/FalandyJEAN/RebrandAyiti"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            github.com/FalandyJEAN
          </a>
        </div>
      </div>

      {/* Drapeau haïtien horizontal en bas */}
      <div className="flex h-2">
        <div className="flex-1" style={{ backgroundColor: '#D21034' }} />
        <div className="flex-1" style={{ backgroundColor: '#003F87' }} />
      </div>

    </section>
  )
}
