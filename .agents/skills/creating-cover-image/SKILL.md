---
name: creating-cover-image
description: Generate project article cover images using content-driven visual planning, the project's fixed responsive-cover rules, native image generation, archived prompts/source files, WebP compression via baoyu-compress-image, and post frontmatter updates. Use when asked to generate or replace an article cover image for this project.
version: 1.0.0
---

# Creating Cover Image

Use this skill for article detail cover images in this project.

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
- Avoid embedded text, labels, readable UI, real brand logos, payment app logos, and readable financial details.
- Prefer article-specific scenes over generic visual templates.
- Use a polished, trustworthy practical-guide mood.

Recommended baseline for this project:

- Type: choose from article meaning
- Palette: trustworthy and restrained, adjusted to article mood
- Rendering: choose from article meaning; realistic photography is preferred when it makes the subject feel credible
- Text level: none
- Mood: clear, useful, trustworthy

## Cover Planning Dimensions

Use these five dimensions to convert content into an image plan.

### Type

| Type | Use when content is about | Composition |
| --- | --- | --- |
| `hero` | product, launch, announcement, major guide | large focal object or scene, strong immediate read |
| `conceptual` | framework, system, policy, API, how something works | clean symbolic elements with clear hierarchy |
| `scene` | lifestyle, daily-life usage, real-world workflow, narrative | real-world environment, practical action, atmospheric context |
| `metaphor` | abstract idea, risk, decision, friction | concrete object or scene expressing the abstract point |
| `minimal` | simple core concept, focused explainer | one focal object, generous calm space |

Choose the type from the content brief. Do not hard-code type by tag or article category.

### Palette

| Palette | Use when content feels | Project notes |
| --- | --- | --- |
| `warm` | human, daily life, practical | warm white, paper beige, muted gold, soft article-derived accents |
| `elegant` | official, professional, documentation-like | charcoal, warm white, restrained accent color |
| `cool` | systems, apps, technical setup | pale blue/green accents with neutral base |
| `earth` | places, local life, culture | muted natural colors with restrained warmth |
| `mono` | focused, simple, essential | neutral base with one accent |

Choose the palette from the content brief. Keep it restrained and credible unless the article's subject clearly calls for a stronger palette.

### Rendering

| Rendering | Use when content needs | Project notes |
| --- | --- | --- |
| `photorealistic editorial still life` | the article's meaning is best carried by objects | use only when object relationships are central |
| `documentary photography` | the article's meaning is best carried by a real place or service moment | use when location/action matters |
| `digital editorial` | photography would be unclear or too literal | fallback |
| `flat-vector` | app flow, rules, checklist, comparison | use sparingly, avoid generic icon collage |
| `painterly` | culture, narrative, softer editorial mood | only when article is story-like |

Choose rendering from the content brief. Do not select a rendering before the brief identifies the image's main scene.

Photography rules:

- Prefer realistic camera perspective, natural lighting, believable materials, and shallow depth of field when using photography.
- Use the article-derived scene as the main signal.
- Vary the location, camera distance, and focal subject between articles.
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
| `bold` | major launch or high-impact article | rare for this project |

Default for this project: balanced.

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
- Project/article context: domain-specific place, object, interface, document, environment, workflow, or usage cue

Turn the brief into one main image:

- Pick one dominant scene or metaphor that represents the article's actual job.
- Let the article brief choose the visual elements. The skill should not preselect default props.
- Use one main visual anchor plus 2-3 supporting cues derived from the article.
- Prefer lived scenes and practical objects over abstract keyword collages.
- Show the article's recommended path when the article makes a recommendation.
- Show the key constraint visually when the article is about rules, limits, eligibility, fees, timing, or setup friction.
- Use supporting objects from headings only when they clarify the main task.
- Choose a different scene archetype from recent covers when the article topic allows it.
- Use common objects such as phones, documents, cards, maps, tickets, counters, screens, and tools only when the article brief makes them meaningful.

Avoid weak content mapping:

- Do not simply combine all keywords as separate objects.
- Do not use a default prop set for any article category.
- Do not make QR codes, cards, phones, passports, maps, counters, screens, or documents dominate by default.
- Do not include readable UI, visible brand names, or exact product logos.
- Do not visualize sections that are minor details at the expense of the article's core task.

## Diversity Check

Before generating, compare the planned concept against existing covers in this working session.

Reject or revise the prompt when it repeats the same composition formula from recent covers:

- same largest subject
- same camera angle
- same setting type
- same object cluster
- same left/center/right layout
- same color/mood pattern

Revise by changing at least two of:

- setting
- main subject
- camera distance
- camera angle
- action moment
- supporting cues
- palette emphasis

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
- No real brand logos, payment app logos, or readable financial details.
- Clean modern visual style suitable for a practical guide website.
- Editorial web article hero image.

Subject:
{Concrete visual scene based on the article. Include practical real-world objects and article-specific context.}

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
- Photorealistic editorial still life or documentary photography.
- Natural camera perspective, realistic lighting, believable materials, and shallow depth of field.
- Trustworthy restrained palette: warm white, charcoal, paper neutrals, muted natural tones, and one article-derived accent color.
- Crisp primary objects, subtle domain-specific atmosphere.
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
