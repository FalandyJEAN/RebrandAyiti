import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import NavBar from "@/components/NavBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RebrandAyiti",
  description:
    "Plateforme kominotè pou chanje reprezantasyon vizyèl Ayiti sou Entènèt. Nou itilize IA, SEO ak travay kolektif pou ranplase imaj negatif ak bèl imaj ki montre richès peyi a. Rejoignez le mouvement !",
  keywords: [
    "Haïti", "Haiti", "RebrandAyiti",
    "culture haïtienne", "beauté Haïti", "photographie Haïti",
    "Citadelle Laferrière", "Labadee", "art haïtien",
    "open-source", "communauté", "patrimoine", "SEO Haiti",
    "imaj Ayiti", "reprezantasyon pozitif",
  ],
  authors: [{ name: "RebrandAyiti" }],
  openGraph: {
    title: "RebrandAyiti",
    description:
      "Chanje reprezantasyon vizyèl Ayiti sou Google. Bank imaj pozitif, IA crawler, kominote kontribitè.",
    type: "website",
    locale: "fr_HT",
    siteName: "RebrandAyiti",
  },
  twitter: {
    card: "summary_large_image",
    title: "RebrandAyiti",
    description:
      "Chanje reprezantasyon vizyèl Ayiti sou Google. Bank imaj pozitif, IA crawler, kominote kontribitè.",
    site: "@rebrandayiti",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NavBar />
            <main className="pt-0 md:pt-16 pb-16 md:pb-0">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
