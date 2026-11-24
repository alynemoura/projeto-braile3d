import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar — Braille3D" },
      { name: "description", content: "Entre ou crie sua conta para gerar plaquetas Braille para impressão 3D." },
      { property: "og:title", content: "Entrar — Braille3D" },
      { property: "og:description", content: "Gere plaquetas táteis em Braille para impressão 3D." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/gerador", replace: true }); });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    setLoading(false);
    if (error) { setError(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.code === "weak_password" ? "Essa senha é fraca ou conhecida. Escolha outra." : error.code === "user_already_exists" ? "Esse e-mail já tem conta. Use Entrar." : error.message); return; }
    navigate({ to: "/gerador", replace: true });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-12">
      <header className="mb-8 text-center">
        <p aria-hidden className="mb-3 text-3xl tracking-[0.3em] text-primary">⠃⠗⠇</p>
        <h1 className="text-[2rem] font-bold">Braille3D</h1>
        <p className="mt-1 text-muted-foreground">Gere plaquetas táteis em Braille para impressão 3D</p>
      </header>
      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{mode === "login" ? "Entrar" : "Criar conta"}</h2>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">E-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="senha" className="mb-1 block text-sm font-semibold">Senha</label>
          <input id="senha" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <button disabled={loading} className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
        <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }} className="w-full text-sm text-muted-foreground underline hover:text-foreground">
          {mode === "login" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
        </button>
      </form>
    </main>
  );
}
