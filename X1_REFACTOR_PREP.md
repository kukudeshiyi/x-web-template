# X1 Website Rebuild Preparation (Do Not Refactor Yet)

## 1) Current Site Snapshot
- Project path: `x1/` (git submodule, currently on branch `new-style`)
- Product intent: multilingual practical guide site for foreigners living/traveling in China
- Current content volume:
- `11` English posts (`content/en/posts/*.mdx`)
- `11` Chinese posts (`content/zh/posts/*.mdx`)
- Locale parity: post slugs are 1:1 aligned between `en` and `zh`

## 2) Tech Stack (Actual, from code)
- Framework: Next.js App Router (`next@16`)
- Rendering target: static export (`output: "export"` in `next.config.mjs`)
- i18n: `next-intl`
- Content pipeline: `@content-collections/*` + MDX + `remark-gfm`
- UI styling: Tailwind CSS + CSS variables + shadcn-style primitives
- Theme: `next-themes` (class-based dark mode)
- Analytics: `@next/third-parties/google` (gated by env)
- SEO: per-page metadata, OpenGraph/Twitter tags, JSON-LD, `sitemap`, `robots`

## 3) Runtime Architecture

### 3.1 Route Structure
- `app/[lang]/page.jsx`: localized homepage (article list)
- `app/[lang]/posts/[id]/page.jsx`: post detail page
- `app/[lang]/about/page.jsx`: author/about page
- `app/[lang]/layout.jsx`: locale validation + intl provider + shell/header/footer
- `app/layout.jsx`: global html/body theme + GA + root metadata icons

### 3.2 Locale Bootstrapping
- Source of truth for locales is **directory scan** of `content/*`:
- script: `scripts/sync-locales.mjs`
- output: `app/lib/locales.generated.json`
- runtime config: `app/lib/i18n.js`
- Build lifecycle hooks already depend on this script:
- `predev`, `prebuild`, `postinstall`

### 3.3 Content Loading
- Content schema in `content-collections.ts` (title/date/lang required, others optional)
- MDX compiled in transform stage (`compileMDX` + GFM)
- App reads from generated `allPosts` collection
- Homepage flow:
- filter by locale
- map to card model
- sort by `date desc`
- show latest `20`

## 4) SEO & Discoverability Logic
- Domain constant centralized in `app/lib/seo.js`:
- `BASE_URL = "https://chinaguidelines.com"`
- Canonical + hreflang generation from helper functions:
- `buildCanonicalUrl(lang, path)`
- `getAlternateLanguages(lang, path)`
- Home and post pages both emit JSON-LD
- Home: `WebSite` + `BreadcrumbList`
- Post: `Article` + `BreadcrumbList`
- Static `app/sitemap.js` includes:
- locale homepages
- every post URL
- `app/robots.js` points to `https://chinaguidelines.com/sitemap.xml`

## 5) UI / Feature Inventory
- Sticky header with site title, theme toggle, language switcher
- Hero section (localized title/subtitle/description/3 badges)
- Article cards with image/date/description/read-more label
- Post page with:
- hero image
- breadcrumb
- publish date
- author link to `/${lang}/about`
- MDX prose rendering
- back-to-home link
- About page with avatar/name/bio/email
- Dark mode support via `ThemeProvider` + CSS variables

## 6) Deployment-Related Behavior
- Static export mode enabled (`output: export`)
- `public/_redirects` contains root redirect:
- `/  /en  301`
- `public/_headers` has cache headers for `/en/*`, `/zh/*`, `/images/*`, `/_next/static/*`
- Google verification file present:
- `public/google79bd52052704b5f4.html`

## 7) Important Logic That Must Not Be Lost During Refactor

### 7.1 URL/Content Contract
- Locale-prefixed URL model is core contract:
- homepage: `/{lang}`
- post: `/{lang}/posts/{slug}`
- about: `/{lang}/about`
- Slug derivation currently depends on `allPosts[i]._meta.path` last segment (`getPostSlug`)
- MDX internal cross-links are heavily using relative links like `./alipay`, `./wechat-pay`, etc.
- Refactor must keep these links resolvable (or provide migration rewrite rules)

### 7.2 i18n Contract
- `locales/en.json` and `locales/zh.json` currently have matching key sets
- Language switcher behavior depends on first path segment replacement
- Locale validation in `[lang]/layout.jsx` currently hard-fails with `notFound()` for invalid locale

### 7.3 SEO Contract
- Canonical/hreflang generation must remain consistent and deterministic
- Structured data blocks must remain on homepage and post pages
- `sitemap` must continue to include all localized post URLs

### 7.4 Build Contract
- `scripts/sync-locales.mjs` is part of build correctness
- Do not remove without replacing locale generation workflow

## 8) Known Issues / Existing Inconsistencies (Baseline Before Refactor)
- Post detail page uses `post.postImage` (not defined in schema/frontmatter), so cover falls back to `/x1-post-page-fallback.webp` even when `image` exists.
- `README.md` / `PROJECT_GUIDE.md` mention items not aligned with actual codebase (e.g. Pagefind, middleware, some file paths).
- Several UI primitives exist but are currently unused (`button`, `sheet`, `navigation-menu`).
- Root redirect relies on `_redirects` (host-specific behavior).
- `app/lib/i18n.js` imports `useTranslations` but does not use it.

## 9) Refactor Risk Checklist (Must Verify During Migration)
- Keep current route shape or provide complete redirect matrix.
- Preserve locale parity and locale file key parity checks.
- Preserve MDX relative link resolution semantics.
- Keep canonical/hreflang/JSON-LD/sitemap behavior equivalent.
- Keep root redirect strategy (`/ -> /en`) for chosen hosting platform.
- Preserve GA conditional loading behavior (`NODE_ENV=production` + `NEXT_PUBLIC_GA_ID`).
- Preserve static asset references in MDX (`/images/...`, `/wechatMain.png`, `/alipayMain.jpg`, etc.).
- Validate article ordering remains `date desc` and homepage cap remains intentional (`20`).

## 10) Suggested Pre-Refactor Freeze Checklist
- Take screenshots for baseline:
- `/{lang}` for `en` and `zh`
- representative posts (payment, transport, sim)
- about page
- Snapshot generated metadata for one home page + one post page.
- Record URL inventory from current sitemap.
- Confirm deploy target (Netlify/Cloudflare Pages/Vercel) before changing redirect strategy.

---
Status: preparation-only document. No refactor implementation started.
