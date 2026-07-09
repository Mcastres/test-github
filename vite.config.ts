import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

import { fimo } from 'fimo/vite';

function resolveApiUrl({
  command,
  isSsrBuild,
  env,
}: {
  command: 'build' | 'serve';
  isSsrBuild?: boolean;
  env: Record<string, string>;
}) {
  const devApiUrl = env.VITE_API_URL;

  if (!devApiUrl) {
    return undefined;
  }

  const prodApiUrl = (() => {
    try {
      const url = new URL(devApiUrl);
      url.hostname = url.hostname.replace(/-dev(?=\.)/, '-prod');
      return url.toString().replace(/\/$/, '');
    } catch {
      return devApiUrl.replace(/-dev(?=\.)/, '-prod');
    }
  })();

  if (command === 'serve') {
    return devApiUrl;
  }

  // SSR builds need the dev API URL (preview/iframe runs against dev tenant)
  // while client builds get rewired to prod.
  return isSsrBuild ? devApiUrl : prodApiUrl;
}

export default defineConfig(({ command, isSsrBuild, mode }) => {
  const env = loadEnv(mode, __dirname, '');

  const resolvedApiUrl = resolveApiUrl({ command, isSsrBuild, env });

  return {
    plugins: [reactRouter(), tailwindcss(), fimo({ sitemap: true })],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(resolvedApiUrl),
      'import.meta.env.VITE_FIMO_BRANCH': JSON.stringify(env.VITE_FIMO_BRANCH || ''),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src/'),
        '@/components': resolve(__dirname, './src/components'),
        '@/pages': resolve(__dirname, './src/pages'),
        '@/schemas': resolve(__dirname, './src/schemas'),
        '@/lib': resolve(__dirname, './src/lib'),
      },
    },
  };
});
