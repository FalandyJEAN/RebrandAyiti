import { Camera, Users, Globe, Heart, Zap, Shield } from "lucide-react"

export const realData = {
  hero: {
    title: "Chanje Imaj Ayiti",
    subtitle: "Nou pap kite Google defini nou",
    description:
      "Plateforme kominotè pou ranplase imaj negatif Ayiti ak bèl foto ki montre richès kiltirèl, kapasite ak bèlte peyi a. Chak foto ou pataje se yon aksyon pou chanje naratif dijital la.",
    ctaText: "Pataje yon foto",
    secondaryCTA: "Gade galri a",
    imageUrl: "/images/haiti-hero.jpg",
    imageAlt: "Bèl peyizaj Ayiti — Citadelle Laferrière",
  },

  features: {
    title: "Yon platfòm konplè",
    subtitle: "Tout zouti yo pou valorize ak pataje bèlte otantik Ayiti",
    features: [
      {
        icon: Camera,
        title: "Upload fasil",
        description: "Pataje foto ou yo an kèk klik ak jeolokalizasyon otomatik ak etikèt entèlijan.",
      },
      {
        icon: Users,
        title: "Kominote aktif",
        description: "Plis pase 3 400 kontribitè ap pataje pèspektiv inik yo sou Ayiti chak jou.",
      },
      {
        icon: Globe,
        title: "Enpak mondyal",
        description: "Foto ou yo wè nan 89 peyi. Swiv enpak kontribisyon ou yo ak analytics detaye.",
      },
      {
        icon: Heart,
        title: "Moderation kominotè",
        description: "Sistèm vòt ak moderation pa kominote a pou garanti kalite ak otantisitè kontni an.",
      },
      {
        icon: Zap,
        title: "Rechèch entèlijan",
        description: "Jwenn foto fasil pa kote, etikèt, otè oswa kontni grasa motè rechèch avanse nou an.",
      },
      {
        icon: Shield,
        title: "Dwa otè pwoteje",
        description: "Foto ou yo rete pwopriyete ou. Lisans Creative Commons disponib pou pataje responsab.",
      },
    ],
  },

  cta: {
    title: "Ou pare pou montre vrè Ayiti ?",
    subtitle: "Rejwenn milye kontribitè ki ap chanje pèsepsyon Ayiti yon foto alafwa. Gratis, ouvè, pou tout moun.",
    primaryCTA: "Kreye kont gratis",
    secondaryCTA: "Eksplore galri a",
  },

  footer: {
    quickLinks: [
      { label: "Galri",    href: "/gallery" },
      { label: "Kominote", href: "/community" },
      { label: "Sinyale",  href: "/report" },
      { label: "Sou nou",  href: "/about" },
      { label: "Kontakte", href: "/contact" },
    ],
    socialLinks: [
      { platform: "GitHub", href: "https://github.com/FalandyJEAN/RebrandAyiti" },
      { platform: "Twitter", href: "https://twitter.com/rebrandayiti" },
      { platform: "LinkedIn", href: "https://linkedin.com/company/rebrandayiti" },
      { platform: "Email", href: "https://github.com/FalandyJEAN/RebrandAyiti/issues" },
    ],
    copyright: "© {year} RebrandAyiti. MIT License. Fèt ak ❤️ pou Ayiti.",
  },
}
