import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FimoProviders, FimoScripts, loadFimoMetaData, buildFimoMeta, fimoHtmlProps } from 'fimo/react-router';
import React from 'react';
import type { MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

// Root loader: fetches entry data for SEO meta resolution.
// Can be extended: return { ...await loadFimoMetaData(args), customData }
export async function loader(args: { request: Request }) {
  return loadFimoMetaData(args);
}

// Default meta for all routes. Pages can override by exporting their own `meta`.
export const meta: MetaFunction = (args) => buildFimoMeta(args);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html {...fimoHtmlProps()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <FimoScripts />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <FimoProviders>
        <Outlet />
      </FimoProviders>
    </QueryClientProvider>
  );
}
