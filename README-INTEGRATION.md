# Guide d'intégration — RebrandAyiti v1.0

## Vue d'ensemble

RebrandAyiti est une plateforme **Next.js 15** fonctionnelle avec :

- Galerie RebrandStock — upload vers Vercel Blob + Neon PostgreSQL
- Auth JWT maison (signup / login avec bcryptjs)
- Pages photos SEO-optimisées (`/photos/[id]`) avec JSON-LD
- Sitemap dynamique + robots.txt
- Page de signalement + API crawler d'images négatives

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 15, TypeScript, App Router |
| UI | Tailwind CSS, shadcn/ui |
| Base de données | Neon PostgreSQL (serverless) |
| Storage | Vercel Blob |
| Auth | JWT maison (jose + bcryptjs) |
| Hosting | Vercel |

---

## Variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# Neon PostgreSQL
DATABASE_URL=postgres://user:password@ep-xxxx.neon.tech/neondb?sslmode=require

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxx

# JWT (générez une clé aléatoire forte)
JWT_SECRET=votre_secret_jwt_min_32_chars
```

### Sur Vercel

Ajoutez ces 3 variables dans **Settings > Environment Variables** de votre projet Vercel.

---

## Initialisation de la base de données

Après déploiement (ou en dev), appelez l'endpoint de setup une seule fois :

```bash
curl -X POST https://votre-domaine.vercel.app/api/setup
```

Cela crée les tables automatiquement :
- `users` — comptes utilisateurs
- `photos` — galerie RebrandStock
- `likes` — système de likes
- `negative_images` — images négatives détectées par le crawler
- `image_reports` — signalements communautaires

---

## Routes disponibles

### Pages

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/gallery` | Galerie RebrandStock |
| `/photos/[id]` | Page photo individuelle (SEO + JSON-LD) |
| `/community` | Page communauté |
| `/report` | Page de signalement |
| `/about` | À propos |
| `/contact` | Contact |

### API

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/signup` | Créer un compte |
| `POST` | `/api/auth/login` | Connexion (retourne JWT) |
| `GET` | `/api/photos` | Lister les photos |
| `POST` | `/api/photos` | Uploader une photo (multipart) |
| `POST` | `/api/photos/[id]/like` | Liker une photo |
| `GET` | `/api/crawler/results` | Résultats du crawler |
| `POST` | `/api/crawler` | Lancer une analyse |
| `POST` | `/api/crawler/[id]/report` | Signaler une image |
| `POST` | `/api/setup` | Initialiser la DB |

---

## Déploiement Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel

# Configurer les variables d'env
vercel env add DATABASE_URL
vercel env add BLOB_READ_WRITE_TOKEN
vercel env add JWT_SECRET
```

Ou connectez directement le repo GitHub depuis le dashboard Vercel.

---

## Développement local

```bash
# Installer les dépendances
npm install

# Lancer en dev
npm run dev

# Build de production
npm run build
```

---

## Structure des fichiers clés

```
app/
├── api/
│   ├── auth/login/route.ts     — POST login
│   ├── auth/signup/route.ts    — POST signup
│   ├── photos/route.ts         — GET/POST photos
│   ├── photos/[id]/like/       — POST like
│   ├── crawler/route.ts        — POST crawler
│   ├── crawler/results/        — GET résultats
│   ├── crawler/[id]/report/    — POST signalement
│   └── setup/route.ts          — POST init DB
├── gallery/page.tsx
├── photos/[id]/page.tsx        — SEO + JSON-LD
├── report/page.tsx
└── community/page.tsx
lib/
├── db.ts                       — Neon client + initDB()
├── jwt.ts                      — helpers JWT
├── auth-context.tsx            — contexte auth React
└── classifier.ts               — classifieur IA (labels)
scripts/
├── init-database.sql           — SQL schema complet
└── update-categories.sql       — migration catégories
```

---

## Prochaines étapes

- [ ] Signalement automatisé vers Google/plateformes
- [ ] Dashboard de modération communautaire
- [ ] API publique avec documentation Swagger
- [ ] Plugin CMS (WordPress, Wix, Ghost)
- [ ] AI Crawler complet (HuggingFace CLIP)

---

**Contact :** [GitHub Issues](https://github.com/FalandyJEAN/RebrandAyiti/issues)
**GitHub :** https://github.com/FalandyJEAN/RebrandAyiti

*Fait pour Haïti, par la communauté RebrandAyiti.*
