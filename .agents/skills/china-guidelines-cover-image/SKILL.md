---
name: china-guidelines-cover-image
description: Generate China Guidelines article detail cover images using the project's fixed responsive-cover rules, native image generation, archived prompts/source files, WebP compression via baoyu-compress-image, and post frontmatter updates. Use when asked to generate or replace an article cover image for this site.
version: 1.0.0
---

# China Guidelines Cover Image

Use this skill for article detail cover images in the `x1` site.

## Fixed Output Contract

- Aspect ratio: `16:9`
- Final public asset size: `1600x900`
- Final format: WebP
- Final public path: `x1/public/images/{post-slug}-cover.webp`
- Frontmatter field: `coverImage: /images/{post-slug}-cover.webp`
- List/card images stay separate in `listImage`; do not change them unless explicitly requested.
- Generate images with the current agent/runtime native image generation tool only.
- This skill is self-contained for cover planning and generation. Do not rely on any external cover-image skill.
- Use `baoyu-compress-image` only for final compression.

## Visual Principles

Use these project-specific display rules:

- Design for responsive cropping, not a single static viewport.
- PC article cover is a wide hero with vertical cropping; the bottom of the image is preserved.
- Mobile article cover uses a contained card around `1.45:1`.
- Compose the image around the lower half. The primary subject must sit fully inside the bottom `55%` of the image.
- Put the main subject in the lower safe zone: roughly `x 12%-88%`, `y 45%-92%`.
- Keep the top `35%-40%` calm and expendable: background, atmosphere, soft context only.
- The image must still make sense if the top `35%` is cropped away.
- Keep critical details away from extreme left, right, and top edges.
- Avoid embedded text, labels, readable UI, real brand logos, real bank logos, and exact payment app logos.
- Prefer practical editorial scenes over generic fintech decoration.
- Use a polished, trustworthy travel/payment-guide mood.

Recommended style for this site:

- Type: editorial scene or practical conceptual hero
- Palette: warm, trustworthy, restrained red/gold/white/charcoal with small green accents
- Rendering: photorealistic editorial still life or documentary travel photography
- Text level: none
- Mood: balanced, clear, useful

## Cover Planning Dimensions

Use these five dimensions to convert content into an image plan.

### Type

| Type | Use when content is about | Composition |
| --- | --- | --- |
| `hero` | product, launch, announcement, major guide | large focal object or scene, strong immediate read |
| `conceptual` | framework, system, policy, API, how something works | clean symbolic elements with clear hierarchy |
| `scene` | travel, lifestyle, daily-life usage, narrative | real-world environment, practical action, atmospheric context |
| `metaphor` | abstract idea, risk, decision, friction | concrete object or scene expressing the abstract point |
| `minimal` | simple core concept, focused explainer | one focal object, generous calm space |

Default for China Guidelines articles: `scene` for practical usage guides, `conceptual` for explainers and comparisons.

### Palette

| Palette | Use when content feels | Project notes |
| --- | --- | --- |
| `warm` | human, travel, daily life, practical | soft red, warm white, paper beige, muted gold |
| `elegant` | official, professional, documentation-like | charcoal, warm white, restrained gold |
| `cool` | systems, apps, technical setup | pale blue/green accents with neutral base |
| `earth` | travel, local life, culture | muted natural colors with restrained warmth |
| `mono` | focused, simple, essential | neutral base with one accent |

Default for this site: warm/elegant hybrid with restrained red, muted gold, warm white, charcoal, and small green accents.

### Rendering

| Rendering | Use when content needs | Project notes |
| --- | --- | --- |
| `photorealistic editorial still life` | practical objects, payment, setup, documents, guides | preferred default |
| `documentary travel photography` | transport, city logistics, daily-life scenes | preferred when place/context matters |
| `digital editorial` | polished guide/article feel where photography would be unclear | fallback |
| `flat-vector` | app flow, rules, checklist, comparison | use sparingly, avoid generic icon collage |
| `painterly` | culture, narrative, softer travel mood | only when article is story-like |

Default for this site: photorealistic editorial still life for object-led guides, documentary travel photography for place-led guides.

Photography rules:

- Prefer realistic camera perspective, natural lighting, believable materials, and shallow depth of field.
- Use real-world objects and locations as the main signal.
- Avoid visible faces unless the article needs a human subject.
- Avoid readable passports, IDs, tickets, QR codes, bank cards, app screens, document numbers, and brand marks.
- Keep phone screens abstract and non-readable.
- Avoid illustration, vector art, 3D render, cartoon, anime, clay, and toy-like styling unless explicitly requested.

### Text

Use `none` for generated images. Article title and metadata already render in the page UI. Avoid visible title text, captions, labels, UI copy, brand names, logos, and readable document text inside the image.

### Mood

| Mood | Use when content needs | Project notes |
| --- | --- | --- |
| `subtle` | official, policy, sensitive, risk-aware | calm, low contrast |
| `balanced` | standard practical guide | default |
| `bold` | major launch or high-impact article | rare for this site |

Default for this site: balanced.

## Content-to-Image Method

This is the core generation step. The article content drives the image meaning; style only controls how that meaning is rendered.

Read these inputs before writing the prompt:

- Frontmatter: `title`, `description`, `keywords`, `tags`
- First 2-4 paragraphs
- Main H2/H3 headings
- Any warning, recommendation, checklist, or requirements section

Extract a compact visual brief:

- User task: what the reader is trying to do
- Situation: where and when this task happens
- Actor: who is performing the task, if visible
- Action: the concrete behavior to show
- Objects: 2-4 real objects that carry the meaning
- Constraint: the important rule, limitation, risk, or decision in the article
- China context: place, infrastructure, document, map, payment, travel, or daily-life cue

Turn the brief into one main image:

- Pick one dominant scene or metaphor that represents the article's actual job.
- Use one main visual anchor plus 2-3 supporting cues.
- Prefer lived scenes and practical objects over abstract keyword collages.
- Show the article's recommended path when the article makes a recommendation.
- Show the key constraint visually when the article is about rules, limits, eligibility, fees, timing, or setup friction.
- Use supporting objects from headings only when they clarify the main task.

Avoid weak content mapping:

- Do not simply combine all keywords as separate objects.
- Do not use generic fintech imagery for every payment article.
- Do not make QR codes, bank cards, phones, or maps dominate by default.
- Do not include readable UI, visible brand names, or exact product logos.
- Do not visualize sections that are minor details at the expense of the article's core task.

Use this article-type mapping when choosing the image concept:

| Content signal | Preferred visual approach |
| --- | --- |
| Step-by-step guide, setup, onboarding | Practical scene with the main action underway |
| Rules, eligibility, limits, fees | Main action plus visible constraint cue, such as document/check/limit metaphor |
| Comparison or decision guide | Two or three options arranged around a clear decision point |
| Travel logistics | Traveler, route, ticket, map, station, airport, or transit context |
| Daily-life usage | Real-world counter, street, store, home, or app-use moment |
| Culture or narrative | Atmospheric scene anchored in place and human experience |
| Safety, risk, mistakes | Calm warning cue plus correct action, avoiding alarmist visuals |

Before generating, write a 3-line internal brief inside the prompt file:

```text
Content meaning: [one sentence]
Main visual: [one scene/metaphor]
Supporting cues: [2-3 objects or contextual details]
```

## Directory Layout

For each article, keep reproducibility artifacts under:

```text
.agents/generated/cover-image/{post-slug}/
├── prompts/
│   └── NN-cover-{post-slug}.md
├── {post-slug}-cover-source.png
├── {post-slug}-cover-1600x900.png
├── {post-slug}-desktop-check.png
└── {post-slug}-mobile-check.png
```

If regenerating, increment `NN` and use a versioned source filename when useful, for example:

```text
02-cover-tour-card-scene.md
tour-card-cover-v2-source.png
tour-card-cover-v2-1600x900.png
```

Never delete original generated images from the runtime image folder.

## Workflow

1. Identify the article slug.
2. Read the article and create the Content-to-Image brief.
3. Create `.agents/generated/cover-image/{post-slug}/prompts/NN-cover-{post-slug}.md` before image generation.
4. Prompt the current agent/runtime native image generation tool with the exact prompt content.
5. Do not call any external cover-image skill as a generation backend.
6. Copy the generated PNG into `.agents/generated/cover-image/{post-slug}/`.
7. Resize/crop to exact `1600x900`.
8. Compress to `x1/public/images/{post-slug}-cover.webp` using `baoyu-compress-image`.
9. Update all localized MDX files for that article to use `coverImage: /images/{post-slug}-cover.webp`.
10. Verify with Playwright on desktop and mobile.
11. Run `yarn test` in `x1`.

## Prompt Template

Use this shape and tailor the subject to the article:

```text
Create a polished 16:9 editorial cover image for an article titled "{title}".

Final image requirements:
- Exact target composition for a 1600x900 article hero image.
- No embedded text, no title text, no captions, no UI labels.
- No real brand logos, no real bank logos, no exact Alipay or WeChat logos.
- Clean modern visual style suitable for a practical China travel/payment guide website.
- Web article hero image, not an advertisement.

Subject:
{Concrete visual scene based on the article. Include practical real-world objects and China context.}

Content-to-image brief:
- Content meaning: {one sentence}
- Main visual: {one scene or metaphor}
- Supporting cues: {2-3 objects or contextual details}

Composition for responsive website cropping:
- The website displays this image in a wide PC hero that crops from the top while preserving the bottom, and in a mobile card around 1.45:1.
- Compose the image around the lower half. The primary subject must sit fully inside the bottom 55% of the image.
- Place the most important subject matter in the lower safe zone, roughly x 12%-88% and y 45%-92%.
- Keep the top 35%-40% visually calm and expendable.
- Main visual anchor in the lower center or lower center-left, with no critical part extending into the top 40%.
- Supporting context in the lower right or background.
- Keep all critical details away from the extreme left, right, and top edges.
- The image must still make sense if the top 35% is cropped away.

Style:
- Photorealistic editorial still life or documentary travel photography.
- Natural camera perspective, realistic lighting, believable materials, and shallow depth of field.
- Warm, trustworthy palette: soft red, warm white, muted gold, charcoal, paper beige, and restrained green.
- Crisp primary objects, subtle China travel atmosphere.
- No illustration, no vector art, no 3D render, no cartoon styling.
- No decorative blobs, no bokeh blobs, no UI text, no brand marks.
- Premium practical guide feel, realistic and trustworthy.

Mood:
Clear, useful, trustworthy, lightweight, international, practical.
```

## Compression

Use the project-local compressor when available:

```bash
bun .agents/skills/baoyu-compress-image/scripts/main.ts \
  .agents/generated/cover-image/{post-slug}/{post-slug}-cover-1600x900.png \
  --output x1/public/images/{post-slug}-cover.webp \
  --format webp \
  --quality 82 \
  --keep \
  --json
```

If `bun` is unavailable, use `npx -y bun` with the same script and arguments.

## Exact Size

Use `sips` when available:

```bash
sips -z 900 1600 \
  .agents/generated/cover-image/{post-slug}/{post-slug}-cover-source.png \
  --out .agents/generated/cover-image/{post-slug}/{post-slug}-cover-1600x900.png
```

If source aspect differs materially from 16:9, crop or regenerate instead of distorting the image.

## Frontmatter Update

Update every locale variant for the same article:

```yaml
coverImage: /images/{post-slug}-cover.webp
```

Keep `listImage` unchanged.

## Verification

Use Playwright against the local dev server or built app:

- Desktop: `2048x1152`
- Mobile: `390x844`

Confirm:

- The rendered image `src` is `/images/{post-slug}-cover.webp`.
- Desktop figure bottom-aligns the image and crops the top when image height exceeds container height.
- Mobile image remains in the content card layout.
- No important subject is lost in either viewport.

Then run:

```bash
cd x1 && yarn test
```
