import { AppWindow, Globe, SquareTerminal } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <main className="mx-auto flex min-h-screen flex-col items-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <img src="/fimo-logo-black.svg" alt="Fimo" className="pointer-events-none mb-8 h-6 w-auto" />
          <div className="flex flex-col gap-8 text-zinc-500">
            <p>Welcome to your new Fimo site!</p>
            <ul className="space-y-8 sm:space-y-4">
              <li className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SquareTerminal className="hidden size-4 shrink-0 text-zinc-500 sm:block" />
                <span>If you're working locally, you can edit it with your favorite coding agent or IDE.</span>
                <span className="flex items-center gap-3">
                  <img src="/claude-color.svg" alt="Claude" className="pointer-events-none h-5 w-auto" />
                  <img src="/codex.svg" alt="Codex" className="pointer-events-none h-5 w-auto" />
                  <img src="/copilot-color.svg" alt="Copilot" className="pointer-events-none h-5 w-auto" />
                  <img src="/cursor-light.svg" alt="Cursor" className="pointer-events-none h-5 w-auto" />
                </span>
              </li>
              <li className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Globe className="hidden size-4 shrink-0 text-zinc-500 sm:block" />
                <span>If you're on the web, you can edit it with the chat.</span>
              </li>
            </ul>
            <hr />
            <div className="flex flex-col gap-4 text-sm sm:flex-row">
              <a href="https://fimo.ai" target="_blank" rel="noreferrer">
                Fimo.ai
              </a>
              <a href="https://docs.fimo.ai" target="_blank" rel="noreferrer">
                Documentation
              </a>
              <a href="https://blog.fimo.ai" target="_blank" rel="noreferrer">
                Blog
              </a>
              <a href="https://fimo.canny.io" target="_blank" rel="noreferrer">
                Roadmap
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
