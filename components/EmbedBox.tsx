"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

// Bloc de code copiable (codes d'intégration, messages pré-rédigés)
export default function EmbedBox({ code, label = "Kopye kòd la", rows = 6 }: { code: string; label?: string; rows?: number }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div>
      <textarea
        readOnly
        value={code}
        rows={rows}
        aria-label={label}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full font-mono text-xs border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-3"
      />
      <button
        type="button"
        onClick={copy}
        className="mt-2 inline-flex items-center gap-2 min-h-[44px] px-4 text-sm font-bold text-white"
        style={{ backgroundColor: "#003F87" }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Kopye!" : label}
      </button>
    </div>
  )
}
