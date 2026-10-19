import Link from "next/link"

interface FooterProps {
  data: {
    quickLinks: Array<{ label: string; href: string }>
    socialLinks: Array<{ platform: string; href: string }>
    copyright: string
  }
}

export default function Footer({ data }: FooterProps) {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white transition-colors">

      {/* Manifès */}
      <div className="border-b border-gray-800 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16 grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <div className="flex flex-col mb-6">
              <span className="text-2xl md:text-3xl font-black tracking-tight">RebrandAyiti</span>
              <span className="text-xs font-bold tracking-[0.25em] uppercase mt-1" style={{ color: '#D21034' }}>
                Mouvman Ayisyen
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Pwojè open-source pou chanje reprezantasyon vizyèl Ayiti sou Entènèt.
              Gratis. Ouvè. Pou tout moun.
            </p>
          </div>

          <div className="lg:text-right">
            <p className="text-xl md:text-2xl font-black text-gray-200 leading-snug">
              &ldquo;Kòd sa se pou Ayiti,<br />
              <span style={{ color: '#003F87' }}>pa</span>{" "}
              <span style={{ color: '#D21034' }}>Ayisyen.</span>&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Nav + réseaux */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <nav className="flex flex-wrap gap-6">
          {data.quickLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4">
          {data.socialLinks.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold tracking-widest uppercase text-gray-600 hover:text-white transition-colors border border-gray-800 hover:border-gray-500 px-3 py-1.5"
            >
              {s.platform}
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs">
            {data.copyright.replace("{year}", new Date().getFullYear().toString())}
          </p>
          <div className="flex gap-1 h-3">
            <div className="w-6 rounded-sm" style={{ backgroundColor: '#003F87' }} />
            <div className="w-6 rounded-sm" style={{ backgroundColor: '#D21034' }} />
          </div>
        </div>
      </div>
    </footer>
  )
}
