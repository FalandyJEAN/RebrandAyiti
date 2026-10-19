/**
 * Classe un article (titre + résumé) comme stigmatisant ou non pour Haïti.
 * 100 % local : mots-clés FR / EN / Kreyòl, aucune API externe.
 */

// Racines en début de mot : "pauvr" couvre pauvre, pauvreté… Un "$" final impose le mot entier.
// Le texte est normalisé sans accents.
const NEGATIVE_KEYWORDS: Record<string, string[]> = {
  violence: ["violence", "violent", "gang", "bandit", "bandi", "armes$", "armee", "armed", "fusillade", "shooting", "balles?$", "massacre", "morts$", "tue(e|s|es)?$", "killed", "kill", "meurtre", "murder", "assassin", "cadavre", "lynch", "kidnap", "enleve", "otage", "hostage", "insecurite", "terreur", "terror", "viols?$", "rape$", "pillage", "loot", "incendi", "brul", "burn", "chimere", "viv ansanm", "barbecue"],
  crise: ["crise", "crisis", "chaos", "instabilit", "effondr", "collapse", "failed state", "etat failli", "manifestation", "protest", "barricade", "emeute", "riot", "coup d'etat"],
  misere: ["pauvr", "poverty", "poor", "misere", "bidonville", "slum", "famine", "faim", "hunger", "starv", "malnutri", "grangou", "mendiant"],
  catastrophe: ["seisme", "tremblement", "earthquake", "ouragan", "hurricane", "cyclone", "inondation", "flood", "catastrophe", "disaster", "decombre", "rubble", "ruine", "destruction", "glissement"],
  sante: ["cholera", "epidemi", "outbreak", "maladie", "disease"],
  deplacement: ["deplace", "displaced", "refugi", "refugee", "migrant", "deport", "expuls", "boat people"],
}

const POSITIVE_KEYWORDS = [
  "culture", "festival", "art", "artiste", "plage", "beach", "montagne", "citadelle", "patrimoine", "heritage",
  "carnaval", "carnival", "musique", "music", "danse", "cuisine", "gastronomi", "tourisme", "tourism",
  "espoir", "hope", "reussite", "success", "innovation", "startup", "laureat", "champion", "medaille",
  "victoire", "football", "sport", "ecole", "education", "inaugur", "celebr", "fete", "konpa", "litterature",
]

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
}

const toRegex = (w: string) => new RegExp("\\b" + (w.endsWith("$") ? `(?:${w.slice(0, -1)})\\b` : w))
const NEGATIVE_REGEX = Object.entries(NEGATIVE_KEYWORDS).map(([label, words]) => [label, words.map(toRegex)] as const)
const POSITIVE_REGEX = POSITIVE_KEYWORDS.map(toRegex)

export function classifyText(text: string): { score: number; labels: string[] } {
  const t = normalize(text)
  const labels: string[] = []
  let hits = 0
  for (const [label, words] of NEGATIVE_REGEX) {
    const n = words.filter((w) => w.test(t)).length
    if (n > 0) { labels.push(label); hits += n }
  }
  const positives = POSITIVE_REGEX.filter((w) => w.test(t)).length
  const score = hits === 0 ? 0 : Math.min(1, 0.3 + hits * 0.15 - positives * 0.1)
  return { score: Math.max(0, Math.round(score * 100) / 100), labels }
}

// Compatibilité avec les routes existantes
export async function classifyImage(title: string, context: string) {
  const { score, labels } = classifyText(`${title} ${context}`)
  return { score, labels, method: "keyword" as const }
}
