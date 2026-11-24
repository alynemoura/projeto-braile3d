import { createElement, useEffect, useState } from "react";

export function StlPreview({ url }: { url: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { import("@botanicastudios/stl-viewer").then((m) => { if (!customElements.get("stl-viewer")) customElements.define("stl-viewer", m.STLViewer); setReady(true); }); }, []);
  if (!ready) return <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Carregando visualização...</div>;
  return createElement("stl-viewer", { key: url, model: url, autorotate: "initial", style: { width: "100%", height: "300px", display: "block" } });
}
