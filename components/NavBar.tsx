"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera, Flag, Home, LogOut, User, Sun, Moon, Plus, Share2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import AuthModal from "@/components/auth/AuthModal"
import UploadModal from "@/components/upload/UploadModal"

export default function NavBar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleOpenAuth = () => setShowAuthModal(true)
    const handleOpenUpload = () => setShowUploadModal(true)
    window.addEventListener("openAuthModal", handleOpenAuth)
    window.addEventListener("openUploadModal", handleOpenUpload)
    return () => {
      window.removeEventListener("openAuthModal", handleOpenAuth)
      window.removeEventListener("openUploadModal", handleOpenUpload)
    }
  }, [])

  const toggleDarkMode = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")

  // Lyen aktif: bleu haïtien clair en light, blanc en dark
  const navLink = (href: string, activeColor = "text-[#003F87] dark:text-white font-bold") =>
    `font-medium transition-colors text-sm ${
      pathname === href
        ? activeColor
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    }`

  const mobileNavLink = (href: string, activeColor = "text-[#003F87] dark:text-white") =>
    `flex flex-col items-center gap-1 p-2 transition-colors text-xs ${
      pathname === href ? activeColor : "text-gray-500 dark:text-gray-500"
    }`

  return (
    <>
      {/* Nav mobile bas */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-30 md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className={mobileNavLink("/")}>
            <Home className="w-5 h-5" />
            <span>Akèy</span>
          </Link>
          <Link href="/gallery" className={mobileNavLink("/gallery")}>
            <Camera className="w-5 h-5" />
            <span>Galri</span>
          </Link>
          <button
            onClick={() => user ? setShowUploadModal(true) : setShowAuthModal(true)}
            className="flex flex-col items-center gap-1 p-2 text-white"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center -mt-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #003F87, #D21034)' }}
            >
              <Plus className="w-5 h-5" />
            </div>
          </button>
          <Link href="/report" className={mobileNavLink("/report", "text-[#D21034] dark:text-[#ff6b7a]")}>
            <Flag className="w-5 h-5" />
            <span>Sinyale</span>
          </Link>
          <Link href="/pataje" className={mobileNavLink("/pataje", "text-[#003F87] dark:text-white")}>
            <Share2 className="w-5 h-5" />
            <span>Gid blog</span>
          </Link>
        </div>
      </nav>

      {/* Nav desktop haut */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shadow-md"
                style={{ background: 'linear-gradient(135deg, #003F87 50%, #D21034 50%)' }}
              >
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                  RebrandAyiti
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/" className={navLink("/")}>Akèy</Link>
              <Link href="/gallery" className={navLink("/gallery")}>Galri</Link>
              <Link href="/report" className={navLink("/report", "text-[#D21034] dark:text-[#ff6b7a] font-bold")}>
                Sinyale
              </Link>
              <Link href="/pataje" className={navLink("/pataje")}>Gid blog</Link>
              <Link href="/community" className={navLink("/community")}>Kominote</Link>

              {/* Bascule dark mode */}
              {mounted && (
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Chanje mòd"
                >
                  {resolvedTheme === "dark"
                    ? <Sun className="w-4 h-4 text-yellow-400" />
                    : <Moon className="w-4 h-4 text-gray-600" />
                  }
                </button>
              )}

              {/* Bouton pataje */}
              <button
                onClick={() => user ? setShowUploadModal(true) : setShowAuthModal(true)}
                className="btn-haiti flex items-center gap-2 px-4 py-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Pataje
              </button>

              {/* Eta otantifikasyon */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #003F87, #D21034)' }}
                    >
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#D21034] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Konekte
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} />}
    </>
  )
}
