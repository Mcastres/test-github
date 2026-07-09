import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'src',
  ssr: false,
  // Static-site generation is opt-in. By default this template builds as an
  // SPA (single index.html shell, client-side routing). To prerender routes at
  // build time — required for crawler-visible per-route SEO — add this line:
  //
  //   import { getFimoPaths } from 'fimo/paths';
  //   prerender: async () => (await getFimoPaths()).map((p) => p.path),
  //
  // `getFimoPaths()` expands dynamic routes (e.g. `/blog/:slug`) by fetching
  // schema entries from the content API. See `references/setup-react-router.md`
  // in the fimo skill for the full setup pattern.
  buildDirectory: 'dist',
} satisfies Config;
