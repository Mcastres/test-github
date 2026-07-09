import { FimoLink } from 'fimo/react-router';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  html: string;
}

export function LegalPage({ title, lastUpdated, html }: LegalPageProps) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_45%_at_50%_0%,rgba(56,189,248,0.15),transparent_70%)]" />

      <main className="relative mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
        <header className="border-border mb-10 border-b pb-6">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="text-muted-foreground mt-3 text-sm">Last updated: {lastUpdated}</p>
        </header>

        <article
          className="prose prose-neutral dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-foreground max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      <footer className="border-border relative border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4 text-sm">
          <span>Legal documents</span>
          <nav className="flex items-center gap-4">
            <FimoLink to="/privacy" className="hover:text-foreground">
              Privacy
            </FimoLink>
            <FimoLink to="/terms" className="hover:text-foreground">
              Terms
            </FimoLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}
