import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateSTL, layout, MAX_CHARS } from "@/lib/braille";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Braille3D — Gerador de plaquetas táteis" },
      { name: "description", content: "Gere plaquetas táteis em Braille para impressão 3D em arquivo STL." },
      { property: "og:title", content: "Braille3D — Gerador de plaquetas táteis" },
      { property: "og:description", content: "Digite um texto e baixe uma plaqueta Braille pronta para imprimir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [stl, setStl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const len = text.length;
  const valid = text.trim().length > 0 && len <= MAX_CHARS;

  async function handleGenerate() {
    setError(null);
    setStl(null);
    if (!layout(text).fits) {
      setError("Texto muito longo para 100x100mm. Reduza o número de caracteres.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 50));
    const out = generateSTL(text);
    await supabase.from("braille_texts").insert({ texto: text });
    setStl(out);
    setLoading(false);
  }

  function handleDownload() {
    if (!stl) return;
    const url = URL.createObjectURL(new Blob([stl], { type: "model/stl" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "plaqueta-braille.stl";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-12">
      <header className="mb-10 text-center">
        <p aria-hidden className="mb-3 text-3xl tracking-[0.3em] text-primary">⠃⠗⠇</p>
        <h1 className="text-[2rem] font-bold text-foreground">Braille3D</h1>
        <p className="mt-1 text-base text-muted-foreground">Gere plaquetas táteis em Braille para impressão 3D</p>
      </header>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <label htmlFor="texto" className="mb-2 block font-semibold">Digite o texto para a plaqueta</label>
        <textarea
          id="texto"
          rows={4}
          maxLength={MAX_CHARS}
          value={text}
          onChange={(e) => { setText(e.target.value); setStl(null); setError(null); }}
          placeholder="Ex: BANHEIRO"
          className="w-full resize-none rounded-md border border-input bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className={`mt-1 text-right text-sm ${len > 120 ? "text-destructive" : "text-muted-foreground"}`}>{len}/{MAX_CHARS}</p>

        <button
          onClick={handleGenerate}
          disabled={!valid || loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />}
          {loading ? "Gerando..." : "Gerar Arquivo 3D"}
        </button>

        {error && <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

        {stl && (
          <div className="mt-6 rounded-md bg-muted p-4 text-center">
            <p className="font-semibold">Arquivo pronto para download</p>
            <button onClick={handleDownload} className="mt-3 w-full rounded-md bg-ink px-4 py-3 font-semibold text-ink-foreground hover:bg-ink/90">
              Baixar arquivo STL
            </button>
            <p className="mt-2 text-sm text-muted-foreground">Imprima em impressora 3D FDM com altura de camada de 0.2mm</p>
          </div>
        )}
      </section>

      <footer className="mt-auto pt-12 text-center text-xs text-muted-foreground">
        Braille3D — Acessibilidade tátil para todos ·{" "}
        <Link to="/admin" className="underline hover:text-foreground">Painel</Link>
      </footer>
    </main>
  );
}
