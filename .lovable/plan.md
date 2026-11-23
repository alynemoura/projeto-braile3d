# Braille3D — Gerador de Plaquetas Táteis

## O que será construído
- **Página `/` (Gerador):** título, subtítulo, campo de texto (máx. 144, contador X/144 cinza até 120 e vermelho acima), botão verde "Gerar Arquivo 3D" com spinner, área de resultado com "Baixar arquivo STL" e dica de impressão (0.2mm), rodapé com link "Painel".
- **Página `/admin`:** tabela Texto | Data (mais recentes primeiro), mensagem "Nenhum texto gerado ainda" e botão "Voltar para o gerador". Sem login.
- Sem imagens, sem login, sem serviços externos. Visual limpo, mobile-first, cores do briefing (#2D5A27 e #1A1A1A).

## Regras de geração
- Alfabeto a–z conforme o mapeamento enviado; maiúsculas viram minúsculas; espaço e outros caracteres = célula vazia.
- Célula 6×10mm, espaço 2mm, margem 5mm, até 10 caracteres por linha.
- Tamanho: largura = colunas×8+10, altura = linhas×12+10. Acima de 100×100mm, mostra o alerta "Texto muito longo para 100x100mm. Reduza o número de caracteres." e não gera.
- Observação: com essas medidas cabem no máximo 7 linhas (≈70 caracteres), então textos entre 71 e 144 caracteres mostrarão o alerta.
- STL ASCII: base de 2mm + um prisma de 8 lados (1.5mm de diâmetro, 0.5mm de altura) por ponto ativo. Posição dos pontos dentro da célula: colunas a 1.5mm e 4.5mm, linhas a 2.5/5/7.5mm.
- Cada texto gerado com sucesso é salvo (id, texto, data_criacao).

## Detalhes técnicos
- Ativar Lovable Cloud; tabela `braille_texts` (id uuid, texto text, data_criacao timestamptz default now()) com GRANTs e RLS permitindo inserir e ler publicamente (MVP aberto).
- `src/lib/braille.ts`: mapeamento, layout e gerador STL puros; testes vitest para mapeamento, cálculo de dimensões e limite 100mm.
- Download via Blob `model/stl` no clique.
- Rotas `index.tsx` e `admin.tsx` com head() próprio; fonte e tokens de cor em styles.css.
