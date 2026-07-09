# Design

Distinctive, production-grade frontend interfaces with high design quality. Avoid generic AI aesthetics. Read this before any non-trivial visual work — first generation of a site, redesigns, visual overhauls, or vague requests like "make this look better."

Skip for: bug fixes, refactors, copy changes, or tasks where the user has already specified visual details (exact fonts, colors, layout).

For React / Tailwind / `fimo/ui` code conventions (component sizing, routing, loading states, etc.), see `references/ui.md`. This file is about the aesthetic and creative direction.

## Brief first, code second

For non-trivial visual work, produce a short design brief before writing code, using the brief template below. Then implement against the brief.

## Design thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**Choose a clear conceptual direction and execute it with precision.** Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

## Frontend aesthetics guidelines

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt for distinctive choices. Pair a distinctive display font with a refined body font. Limit to 2 font families total.
- **Color & Theme**: Commit to a cohesive aesthetic. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Reserve high-saturation colors for small actionable elements (icons, charts, buttons). Maintain WCAG AA contrast (4.5:1 body, 3:1 large text). Write palette values into the shadcn CSS variables in `src/index.css` — see `references/ui.md` for the Tailwind integration.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions; use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density. Dramatic whitespace contrast: tight clusters + generous breathing room.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors — gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, grain overlays.

NEVER use generic AI-generated aesthetics: overused font families (Inter, Roboto, Arial, system fonts), clichéd color schemes (especially purple gradients on white backgrounds), predictable layouts, cookie-cutter design.

Interpret creatively and make unexpected choices. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**Match implementation complexity to the aesthetic vision.** Maximalist designs need elaborate code with extensive animations. Minimalist designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

---

## Reference anchors

Reference sites to anchor the aesthetic direction. Pull any well-known site, brand, or design studio that fits the project.

| Category                 | Example Anchors                                                                                           | Quality Bar                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Creative / Agency**    | Awwwards, FWA, CSS Design Awards, Pentagram, Sagmeister & Walsh, Active Theory, Fantasy Interactive, Resn | Would it win Awwwards SOTD? Would Pentagram put this in their portfolio?   |
| **SaaS / Product**       | Linear, Vercel, Stripe, Notion, Figma, Raycast, Arc Browser, Supabase, Mercury, Clerk, Loom, Pitch        | Is it Linear-polished? Would a developer tweet "their site is so clean"?   |
| **Editorial / Blog**     | Medium, Substack, The Verge, NYT, The Atlantic, Monocle, It's Nice That, Eye on Design, Wired             | Would The Verge's design team respect this? Is it magazine-worthy?         |
| **E-commerce**           | Apple Store, Shopify Dawn, Gumroad, Everlane, Glossier, SSENSE, Mr Porter, Mejuri, Allbirds               | Does it feel Apple Store premium? Would you trust buying from this?        |
| **Documentation**        | Stripe Docs, Tailwind Docs, Vercel Docs, Supabase Docs, Prisma Docs, Algolia Docs, Clerk Docs             | Is it Stripe Docs clear? Can a developer find what they need in 3 seconds? |
| **Personal / Portfolio** | Read.cv, Paco Coursey, Josh Comeau, Rauno Freiberg, Brian Lovin, Lee Robinson, Linus Rogge                | Would Read.cv feature this? Is it memorable and distinctly personal?       |
| **Corporate**            | Apple, Stripe, Airbnb, Slack, Square, Intercom, Dropbox, Zendesk                                          | Does it feel Airbnb-trustworthy? Premium but not flashy?                   |
| **Dashboard**            | Linear, Figma, Raycast, Retool, Rows, Height, Airtable, Coda                                              | Is it Linear-efficient? Dense but never cluttered?                         |
| **Landing Pages**        | Framer templates, Webflow Showcase, Lapa.ninja, One Page Love, SaaS Landing Page                          | Would this be featured on Lapa.ninja? Does it convert and delight?         |

---

## AI slop patterns to avoid

| Pattern to Avoid                  | Do This Instead                                                        |
| --------------------------------- | ---------------------------------------------------------------------- |
| Centered everything               | Asymmetry, left-alignment, off-center compositions                     |
| Purple gradients on white         | Unexpected colors: olive, terracotta, deep blue, warm neutrals         |
| Uniform card grids                | Varied sizes, bento layouts, overlapping elements, broken grids        |
| Static pages                      | Scroll reveals, hover states, page transitions, micro-interactions     |
| Inter / Roboto / Arial everywhere | Display fonts for headings, serif accents, personality in type         |
| Generic hero layout               | Editorial, asymmetric, full-bleed, split-screen, video backgrounds     |
| Gray dark mode (slate-900)        | True blacks, warm darks (#1A1A1A), tinted backgrounds                  |
| Emoji overuse (🚀✨🎉)            | Subtle iconography, typography-only, or strategic single emoji         |
| Safe blue pill buttons            | Contextual styling, ghost buttons, text links, unusual shapes          |
| Cookie-cutter 4-column footer     | Footer as a design moment: personality, newsletter CTAs, minimal       |
| Stock blob illustrations          | Photography, 3D renders, custom illustrations, or no illustrations     |
| Evenly distributed spacing        | Dramatic whitespace contrast: tight clusters + generous breathing room |
| Generic "Welcome to X" headlines  | Personality, questions, bold statements, single impactful words        |
| Converging on Space Grotesk       | Vary font choices across generations — never default to a "safe" pick  |

When you list "Avoid" items in a design brief, be specific to the project context. Don't paste these generic items — explain what would look bad for THIS site.

---

## Design brief template

Use this structure for the brief produced **before** writing code on a non-trivial visual task. Keep each section short — bullets, not paragraphs.

### Vibe

One sentence describing the aesthetic direction + 2–3 reference anchors.
Example: "**Linear meets Stripe** — polished SaaS with premium editorial touches"

- Reference 1 (what aspect)
- Reference 2 (what aspect)
- Reference 3 (what aspect)

### Typography

- **Like:** Reference site(s) for typography inspiration
- **Headings:** Font name (e.g., "Satoshi Bold", "Space Grotesk", "Fraunces")
- **Body:** Font name (e.g., "Geist", "Source Serif Pro", "IBM Plex Sans")
- **Hierarchy:** Size contrast notes, weight usage, letter-spacing

### Color & Theme

- **Like:** Reference site(s) for color inspiration
- **Background:** Primary background color (hex → `--background`)
- **Foreground:** Primary text color (hex → `--foreground`)
- **Accent:** Primary accent color (hex → `--primary`)
- **Secondary accents:** Additional colors if needed
- **Dark mode:** Direction for dark mode palette (if applicable)

Write into `src/index.css` as shadcn CSS variables, then use `bg-background` / `text-foreground` / `bg-primary` in components.

### Motion & Interaction

- **Like:** Reference site(s) for motion inspiration
- **Page load:** Stagger, fade, slide
- **Scroll:** Parallax, reveals, sticky elements
- **Hover:** Card lifts, color shifts, micro-animations
- **Transitions:** Page transitions, state changes

### Photography & Media

- **Like:** Reference site(s) for media direction
- **Style:** Cinematic, lifestyle, abstract, illustrated, minimal
- **Treatment:** Full-bleed, contained, overlays, filters
- **Hero:** Specific direction for hero imagery

If the user hasn't supplied images and one is needed, generate via `fimo generate <model> --prompt "..."` (run `fimo models list` to pick a model, `fimo models show <model>` for its flags) and reuse the returned `url` / `id`. See `references/assets.md`.

### Iconography

- **Like:** Reference site(s) for icon style
- **Style:** Line icons, filled, duotone, custom
- **Library:** Lucide (already in the template), Heroicons, custom, or none
- **Usage:** Sparse and meaningful vs. decorative

### Quality Bar

Pick the row from the Reference Anchors table that matches this project's category and quote its quality-bar question.

### Avoid

List 3–5 specific patterns to NOT use for this project. Be specific to this project's context — don't paste generic items from the AI Slop Patterns table.
