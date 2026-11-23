import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const textsQuery = queryOptions({
  queryKey: ["braille_texts"],
  queryFn: async () => {
    const { data, error } = await supabase.from("braille_texts").select("*").order("data_criacao", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Braille3D" },
      { name: "description", content: "Lista dos textos gerados no Braille3D." },
      { property: "og:title", content: "Painel — Braille3D" },
      { property: "og:description", content: "Lista dos textos gerados no Braille3D." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { data, isLoading } = useQuery(textsQuery);
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="mb-6 text-2xl font-bold">Painel de Administração</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : !data?.length ? (
        <p className="text-muted-foreground">Nenhum texto gerado ainda</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted"><tr><th className="p-3">Texto</th><th className="p-3">Data</th></tr></thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 break-all">{r.texto}</td>
                  <td className="whitespace-nowrap p-3 text-muted-foreground">{new Date(r.data_criacao).toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90">
        Voltar para o gerador
      </Link>
    </main>
  );
}
