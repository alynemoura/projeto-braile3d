# Braille3D 2.0 — Login, pré-visualização 3D e painel com e-mails

Observação: o arquivo enviado termina no meio da seção de pré-visualização. Os itens marcados como (suposição) seguem a versão anterior.

## O que muda para você
- **`/` vira Login/Cadastro:** e-mail e senha, alternando entre "Entrar" e "Criar conta". Sem confirmação por e-mail (conta já entra direto). Quem já está logado vai direto para `/gerador`.
- **`/gerador` (só logado):** o gerador atual mudou para cá, com botão "Sair" discreto no canto superior direito. O botão passa a se chamar "Gerar e Visualizar".
- **Pré-visualização 3D:** depois de gerar aparece "Pré-visualização da plaqueta", com a placa girando numa área de 300px de altura. Logo abaixo, "Baixar arquivo STL" e a dica de impressão 0.2mm (suposição).
- **Painel `/admin` (só logado):** tabela com E-mail | Texto | Data, mais recentes primeiro (suposição). Qualquer usuário logado consegue ver o painel, o que inclui os e-mails de todos os usuários. Separar administradores dá para fazer depois.
- O texto é salvo junto com o seu e-mail e a sua conta quando a plaqueta é gerada.
- As regras do Braille, as medidas e o limite de 100×100mm continuam como estão.

## Detalhes técnicos
- Auth: `enable_email_auth` + `configure_auth(auto_confirm_email: true)`.
- Migration: adicionar `user_id uuid` e `email text` (nullable, para manter as linhas antigas) em `braille_texts`. Remover as policies públicas e o grant para anon. Novas policies para authenticated: INSERT com `user_id = auth.uid()`, SELECT liberado para authenticated.
- Rotas: `index.tsx` (auth), `_authenticated/route.tsx` (gate gerenciado), `_authenticated/gerador.tsx` e `_authenticated/admin.tsx`. Remover o `admin.tsx` de nível superior. Listener `onAuthStateChange` no `__root`. Sign-out cancelando/limpando queries.
- Viewer: `bun add @botanicastudios/stl-viewer`, importado dinamicamente no `useEffect` (só no navegador), web component `<stl-viewer model={blobUrl} autorotate="initial">`, com declaração JSX de tipo. Blob URL revogado ao regenerar.
- Atualizar o teste de rotas existente para os novos caminhos. Testes do braille continuam iguais.
