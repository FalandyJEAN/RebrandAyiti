# 🌟 RebrandAyiti

**RebrandAyiti** se yon pwojè open-source kominotè ki vize **chanje reprezantasyon vizyèl Ayiti sou Entènèt**, espesyalman sou motè rechèch tankou Google. Nou itilize entelijans atifisyèl, teknik SEO, ak travay kolektif pou ranplase imaj negatif oswa stigmatizan pa bèl imaj ki montre richès kiltirèl, kapasite, ak bèlte peyi a.

---

## 🎯 Objektif

- 📸 Detekte ak klasifye imaj sou Ayiti ki bay reprezantasyon negatif
- 🚨 Signalman etik sou imaj difamatwa oswa dekontextualize
- 🖼️ Kreye yon bibliyotèk imaj pozitif, gratis epi ouvè pou tout moun
- 🌍 Fè bèl imaj Ayiti yo monte sou rezilta rechèch yo atravè SEO ak distribisyon
- 🛠️ Fòme yon kominote devlopè Ayisyen ki kontribye nan teknoloji pou chanje naratif dijital la

---

## 🧩 Konpozan Pwojè a

- **AI Image Crawler**: Detekte imaj sou Google ak lòt platfòm epi klasifye yo.
- **Signalman Entelijan**: Otomatikman oswa semi-otomatikman rapòte imaj difamatwa (etikman).
- **RebrandStock**: Bank imaj pozitif sou Ayiti (Creative Commons), ouvè pou tout moun.
- **API & Plugin**: Distribisyon imaj yo sou blog, CMS, medya, elatriye.
- **Dashboard Kominotè**: Patisipan ka vote, rapòte, upload ak ede ak moderasyon.

---

## ⚙️ Teknoloji

- **Frontend**: Next.js 15 (App Router, TypeScript)
- **UI**: Tailwind CSS + shadcn/ui
- **AI/ML**: HuggingFace CLIP + custom classifiers
- **Automation**: Puppeteer (signalman etik)
- **DB**: Neon PostgreSQL (serverless)
- **Storage**: Vercel Blob (upload imaj)
- **Auth**: JWT maison (bcryptjs + jose)
- **Hosting**: Vercel

---

## 🛡️ Lisans

MIT License – Ou ka itilize, modifye, distribye, e menm vann aplikasyon ki itilize kòd sa a, **men ou dwe mete kredi ak lisans orijinal la**.  
👉 Gade fichye [`LICENSE`](./LICENSE) pou plis detay.

```
MIT License

Copyright (c) 2026 RebrandAyiti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📌 Kijan pou w patisipe

Nou envite tout **devlopè, designer, fotogwaf, blogger, aktivis ak volontè Ayisyen** pou mete men:

1. **Fork repo a**
2. Kreye yon branch: `git checkout -b feat/misyon-ou`
3. Fè chanjman ou, verifye
4. Voye PR: `git push origin feat/misyon-ou`
5. Nou ap revize l, epi mete w kòm kontribitè!

📩 Kontakte: [GitHub Issues](https://github.com/FalandyJEAN/RebrandAyiti/issues)  
📢 Diskisyon: [Discord RebrandAyiti (byen vit!)](https://discord.gg/rebrandayiti)

---

## 👥 Kòd Konduit

Nou kwè nan respè, enklizyon, ak kolaborasyon. Chak moun ki patisipe dwe:
- Trete lòt moun ak respè, san diskriminasyon
- Pa pataje kontni k ap fè mal, ofansif oswa ilegal
- Fè efò pou kontribye avèk respè pou kominote a

🔗 Plis detay sou kòd konduit la: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)


---

## 🧭 Gid Kontribisyon

Nou akeyi kontribitè nouvo ak eksperimante. Ou ka ede pa:
- Kòd: amelyore fonksyonalite oswa korije erè
- Design: UI/UX, logo, ikon, elatriye
- Imaj: Upload imaj pozitif sou Ayiti
- Dokimantasyon: Tradiksyon, ekriti, gid, SEO

🔗 Plis detay sou kijan pou kontribye: [`CONTRIBUTING.md`](./CONTRIBUTING.md)


---

## 🌱 Roadmap (v1.0)

- [x] RebrandStock — galerie imaj ak upload (Vercel Blob + Neon)
- [x] Sistèm otantifikasyon (JWT + bcrypt)
- [x] Paj foto SEO-optimizé (`/photos/[id]`) ak JSON-LD
- [x] Sitemap dinamik + robots.txt
- [x] Paj signalman (UI) + crawler API
- [ ] Signalman otomatik pou Google/plateòm yo
- [ ] Dashboard kontribitè (vote, moderation)
- [ ] API piblik + Plugin CMS (WordPress, Wix...)
- [ ] AI crawler konplè (HuggingFace CLIP)

---

## 🚀 Lanse pwototip la lokalman

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:3000
```

Pa bezwen okenn konfigirasyon : baz done a (PGlite) ak foto yo estoke nan `.data/`.
Pou pwodiksyon, gade `.env.example` (`JWT_SECRET` obligatwa, `DATABASE_URL` Neon, `BLOB_READ_WRITE_TOKEN`).

## ✨ RebrandAyiti

**"Nou pap efase reyalite — men n ap mete limyè sou bèlte nou yo."**

🇭🇹 *Kòd sa se pou Ayiti, pa Ayisyen.*
