// Flux RSS publics, vérifiés le 2026-10-19. Aucun n'exige de clé API.
// `haitiOnly: false` = média généraliste : on ne garde que les articles qui parlent d'Haïti.
export interface NewsSource {
  id: string
  name: string
  feed: string
  contactUrl: string
  // Adresse vérifiée sur le site du média le 2026-10-19 ; absente = page contact seulement
  email?: string
  haitiOnly: boolean
}

export const NEWS_SOURCES: NewsSource[] = [
  { id: "nouvelliste", name: "Le Nouvelliste", feed: "https://lenouvelliste.com/rss", contactUrl: "https://lenouvelliste.com/contact", email: "administration@lenouvelliste.com", haitiOnly: true },
  { id: "haitilibre", name: "HaïtiLibre", feed: "https://www.haitilibre.com/rss-flash.xml", contactUrl: "https://www.haitilibre.com/contact.php", haitiOnly: true },
  { id: "rezonodwes", name: "Rezo Nòdwès", feed: "https://rezonodwes.com/?feed=rss2", contactUrl: "https://rezonodwes.com/", email: "rezonodwes@gmail.com", haitiOnly: true },
  { id: "juno7", name: "Juno7", feed: "https://www.juno7.ht/feed/", contactUrl: "https://www.juno7.ht/contact/", email: "redaction@juno7.ht", haitiOnly: true },
  { id: "gazette", name: "Gazette Haïti", feed: "https://www.gazettehaiti.com/rss.xml", contactUrl: "https://www.gazettehaiti.com/", haitiOnly: true },
  { id: "rtvc", name: "Radio Télévision Caraïbes", feed: "https://www.radiotelevisioncaraibes.com/feed/", contactUrl: "https://www.radiotelevisioncaraibes.com/", haitiOnly: true },
  { id: "vantbefinfo", name: "Vant Bèf Info", feed: "https://www.vantbefinfo.com/feed/", contactUrl: "https://www.vantbefinfo.com/", haitiOnly: true },
  { id: "guardian", name: "The Guardian", feed: "https://www.theguardian.com/world/haiti/rss", contactUrl: "https://www.theguardian.com/info/2013/sep/12/contact-the-guardian", haitiOnly: true },
  { id: "france24", name: "France 24", feed: "https://www.france24.com/fr/tag/haiti/rss", contactUrl: "https://www.france24.com/fr/contact", haitiOnly: true },
  { id: "lemonde", name: "Le Monde", feed: "https://www.lemonde.fr/haiti/rss_full.xml", contactUrl: "https://www.lemonde.fr/le-monde/contact/", haitiOnly: true },
]
