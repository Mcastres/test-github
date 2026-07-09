# Assets — package surface

> For the CLI commands (`fimo assets upload`, `fimo generate`, folder management) and the "when to generate AI images" workflow rules, see **`fimo-cli/references/assets.md`**.

This file covers the **package surface** for working with assets in code: the `media` field value shape, how to render assets with `fimo/ui` components, the URL format.

## `media` field value (stored/wire shape)

Asset values returned from `fimo assets upload` or `fimo generate`, and stored in `media` content-type fields:

```json
{
  "source": "local",
  "url": "https://assets.fimo.ai/<project-id>/<asset-id>.jpg",
  "alt": "..."
}
```

- `source`: `"local"` for uploaded/generated assets in the Fimo media library. `"external"` for hard-coded third-party URLs (avoid when possible — editors can't manage these).
- `url`: stable HTTPS URL, no auth required, safe to embed.
- `alt`: optional alt text.

In a generated schema hook this stored value is wrapped in a runtime `FimoMedia` object (from `fimo/ui`) that exposes `url`, `alt`, `name`, `mime`, and optional `width`/`height` — it does **not** carry the `source` key (that's tracked internally for inline editing). Pass the whole entry value to `<Image>` / `<Video>`; don't read `source` off it in app code.

## Rendering in JSX

Always use the `fimo/ui` primitives — never raw HTML:

| Asset source                                        | Component             | Pass via                  |
| --------------------------------------------------- | --------------------- | ------------------------- |
| Schema `media` field on an entry                    | `<Image>` / `<Video>` | `value={post.coverImage}` |
| Hard-coded URL or generated asset referenced inline | `<StaticImage>`       | `src="https://..."`       |

```tsx
import { Image, StaticImage, Video } from 'fimo/ui';

// from a schema entry:
<Image value={post.coverImage} width={1200} height={630} fit="cover" />

// hard-coded decorative image:
<StaticImage src="https://assets.fimo.ai/<project>/<id>.jpg" alt="Hero" width={1200} height={630} />
```

**Provide `width` and `height` when known** so Fimo can optimize the asset and reserve layout space (prevents CLS).

**Never hand-construct a `FimoMedia` object** to pass into `<Image>` — that bypasses inline-editing metadata. If you have a raw URL, use `<StaticImage>` instead.

See `references/ui.md` for the full component table and rules.

## Attaching generated/uploaded assets to entries

When seeding entries via `fimo entries create`, embed the asset as a `media` field value:

```bash
fimo entries create BlogPost --body '{"data": {"slug": "post-1", "title": "...", "coverImage": {"source": "local", "url": "https://...", "alt": "..."}}}'
```

The `url` comes from the upload/generate response. See `fimo-cli/references/assets.md` for the upload + generate commands.

## Raw read path (no SDK)

The published site can also read assets directly via HTTPS:

```html
<img src="https://assets.fimo.ai/<project-id>/<asset-id>.jpg" />
```

But prefer `<StaticImage>` even for hard-coded URLs so Fimo can optimize and inline-edit.
