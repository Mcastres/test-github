# Fimo project rules

This is a Fimo project. Fimo is a content + media + forms + analytics platform for React websites with a CMS dashboard.

## Working with this project

When generating or modifying code in this Fimo project, your AI tool's `fimo` skill should load these references up front (they define the load-bearing primitives):

- `content.md` — schemas + entries
- `forms.md` — forms
- `assets.md` — media + AI image generation
- `translations.md` — `t()` and i18n
- `ui.md` — `fimo/ui` components + JSX conventions

The `fimo` skill describes how to build inside this project; the `fimo-cli` skill covers the `fimo` CLI itself (create, account, agent setup).

**If your AI tool doesn't seem to know about Fimo, install the skills:**

```bash
fimo skills install
# or, without a global fimo install, copy skills out of the npx cache:
npx fimo@latest skills install --mode=copy
```

To add another AI tool to this project (e.g., a teammate joins on Cursor or Windsurf) — global skill + project skill + rule file in one shot:

```bash
fimo skills install --agents=cursor   # explicit
fimo skills install                   # interactive: pick agents to add
```

If you later edit this `AGENTS.md` and want the per-agent variants (`CLAUDE.md`, `.cursor/rules/fimo.mdc`, `.windsurfrules`, `GEMINI.md`) regenerated from it, delete the stale variant file and run `fimo rules sync`. Sync is purely additive — it never overwrites existing files, so project-specific edits are preserved unless you remove the file first.

## Development loop

Work with the developer locally, not through deploys:

1. Start the app with the project's package-manager `dev` script — `pnpm dev`, `npm run dev`, `yarn dev`, or `bun dev` (match the lockfile). Run it in the background; it serves the site on localhost with live reload.
2. Ask the developer what they want to build or change.
3. Make the edits — the running dev server shows them instantly. You do not need to deploy to see local changes.
4. Iterate until they are happy with it locally.
5. When a unit of work looks done, **offer** to deploy: `fimo deploy` for a hosted preview / shareable link, or `fimo deploy --publish` to go live. Run it only after they confirm (or when they ask). Never deploy on your own.

The local dev server is local (localhost). The Fimo dashboard preview and the shareable preview URL come from `fimo deploy` — so if the developer wants to see it in the dashboard or share a link, that needs a deploy.

## Critical project rules

- **Deploy is on-demand — not a save step and not a mandatory final step.** `fimo deploy` commits everything, pushes to the current env's branch, and round-trips the sandbox. Iterate locally with the dev server; deploy only when the developer wants a hosted preview, a shareable link, or to go live — and only after they confirm. Batch related edits into one deploy; never deploy after every change.
- **Run `fimo deploy --publish` only when the developer signals "ship it"** — an explicit "publish" / "go live" request. Plain `fimo deploy` (preview) is the default; `--publish` is the visible, externally-facing step.
- Do not add a second deploy tool (Vercel, Netlify, etc.).
- **Never edit `.fimo.settings.json`.** It is the link between this folder and the remote project — it is written once by `fimo create`.
- The scaffolded homepage is disposable starter content. On the first real generation, replace its copy, layout, and visual style instead of extending the Fimo-branded design. Keep only the technical shell and required legal pages unless the user explicitly asks to preserve the starter.
- **Secrets live in the Fimo dashboard**, not in `.env` committed to git.
- **Read before writing backend code.** Check the `fimo` skill's `references/<topic>.md` before calling the tenant API; the shape may have changed.
- **Always pass flags to `fimo` commands when scripting** — `fimo deploy -m "<msg>"`, `fimo create <dir> --org <id> --no-install --agents=<list>`, `fimo switch --org <id>`, `fimo delete -y`. Bare interactive forms hang in non-TTY shells.

## Design system (optional)

If a `design.md` file exists at the project root, treat it as the source of truth for all visual decisions:

- Use only the colors, fonts, spacing, and radius tokens defined there.
- Do not invent new values or fall back to framework defaults (Tailwind defaults, shadcn defaults, etc.).
- Match component states (hover, focus, active, disabled) to the patterns specified.
- Follow the typographic scale and weight assignments verbatim.

If `design.md` is absent, fall back to the `frontend-design` skill's guidance.
