# Editor Braille 3D

Uma aplicação web que transforma texto comum em arquivos 3D (STL) prontos para impressão em Braille, eliminando a barreira técnica e o alto custo de produção de plaquetas táteis personalizadas.

## Demo

- **Aplicação publicada:** [https://screenshot-to-spark-4021.lovable.app/](https://screenshot-to-spark-4021.lovable.app/)
- **Evidências:** Veja a seção de capturas de tela abaixo para visualizar o funcionamento da ferramenta.

## A Dor e a Oportunidade

A Lei Brasileira de Inclusão (Lei nº 13.146/2015) garante a educação em igualdade de condições, mas a realidade das salas de aula brasileiras está distante do ideal quando o assunto é material didático tátil. Milhares de estudantes com deficiência visual dependem de materiais adaptados que chegam de forma artesanal, lenta ou simplesmente não chegam.

O Braille exige precisão dimensional absoluta (altura, diâmetro e espaçamento dos pontos). Hoje, quem precisa de uma plaqueta personalizada enfrenta três caminhos ruins:
1. **Serviços especializados:** alto custo por peça, prazo longo e zero flexibilidade para alterações.
2. **Softwares de modelagem 3D (CAD):** exigem curva de aprendizado altíssima. Um professor não deveria precisar se tornar um modelador 3D para criar um rótulo tátil.
3. **Produção manual:** cola quente e miçangas resultam em materiais imprecisos, ilegíveis ao tato e não duráveis.

**Por que vale um negócio?**
O público-alvo (professores de educação especial, bibliotecas, museus, clínicas) já existe e tem necessidade recorrente. Com o avanço da impressão 3D doméstica e escolar, o hardware já está disponível; o que falta é o arquivo pronto. O MVP resolve essa lacuna ao entregar o arquivo STL, transformando uma barreira técnica em um clique.

## Mercado e Business Model Canvas

### Tamanho de Mercado (estimativa)
- **TAM (Total Addressable Market):** Instituições de ensino, espaços culturais e órgãos públicos que demandam sinalização e materiais táteis em todo o Brasil.
- **SAM (Serviceable Available Market):** Escolas regulares com salas de recursos multifuncionais, instituições especializadas em deficiência visual e makerspaces/bibliotecas equipados com impressoras 3D.
- **SOM (Serviceable Obtainable Market):** Educadores e instituições que já possuem impressora 3D e buscam ativamente ferramentas gratuitas ou de baixo custo para gerar arquivos Braille.

### Business Model Canvas (resumo)
- **Proposta de valor:** Gerar arquivos 3D de Braille precisos, sem necessidade de conhecimento em modelagem ou softwares complexos.
- **Segmentos de clientes:** Professores, bibliotecários, gestores escolares, familiares de pessoas cegas e instituições de reabilitação.
- **Canais:** Landing page, grupos de educadores e redes sociais voltadas à inclusão.
- **Fontes de receita:** (Futuro) Assinatura freemium para geração de arquivos maiores ou salvá-los na nuvem.
- **Estrutura de custos:** Hospedagem (Lovable Cloud), domínio e manutenção da ferramenta.
- **Parceiros principais:** Escolas com laboratórios de impressão 3D, associações de apoio a cegos.
- **Atividades principais:** Desenvolvimento da lógica geométrica do Braille, melhoria da interface e suporte ao usuário.
- **Recursos principais:** Algoritmo de conversão de texto para Braille, plataforma de geração de arquivos.
- **Relacionamento com clientes:** Autoatendimento (self-service) com suporte assíncrono.

## Tese do MVP e Escopo Manual

**Hipótese central**: É possível automatizar a geometria do Braille de forma que um educador consiga gerar um arquivo STL legível apenas digitando texto na interface, sem precisar de um especialista em CAD.

**O que está incluído no MVP**:
- Interface web (landing page e editor) onde o usuário digita o texto.
- Conversão automática para o alfabeto Braille básico (com suporte a espaço).
- Geração e download do arquivo `.stl` pronto para fatiamento e impressão 3D.
- Validação de tamanho (limitado a plaquetas de até 144 caracteres e 100x100mm).

**O que é intencionalmente manual (e o que o MVP não faz)**:
- **A impressão não é feita pelo app:** o usuário faz o download do arquivo e imprime em sua própria impressora 3D ou em um serviço terceirizado.
- **Sem curadoria humana:** o sistema não substitui a revisão de um especialista em Braille (acentuação complexa, contrações e símbolos matemáticos não estão no escopo inicial).
- **Sem transação financeira:** nesta fase, não há gateway de pagamento ou carrinho de compras; o foco é validar o uso da ferramenta.

## Mega Prompt e Iterações

### Mega Prompt (instruções iniciais)
O projeto foi construído com o auxílio do Lovable. O prompt base inicial consistia em: *"Crie uma aplicação web chamada Editor Braille 3D. O usuário deve digitar um texto em português e a aplicação deve converter esse texto para a célula Braille padrão (6 pontos). A aplicação deve gerar um arquivo STL para download, com os pontos em relevo na geometria correta para impressão 3D. A interface deve ser limpa, acessível e intuitiva, voltada para professores e educadores."*

### Principais correções após testes
Durante o desenvolvimento e testes da interface, foram solicitados os seguintes ajustes:
- Correção da proporção e espaçamento das células Braille na geometria gerada, para garantir que os pontos fiquem legíveis ao tato e não se fundam na impressão.
- Ajuste no layout do editor para telas menores (responsividade), facilitando o uso em celulares por professores em sala de aula.
- Adição de feedback visual (estado de carregamento) enquanto o arquivo STL é processado para download.

## Evidências (capturas de tela)
<img width="1132" height="923" alt="image" src="https://github.com/user-attachments/assets/0d853518-eb6e-49c8-b77a-d256150fddc2" />


### Interface do Usuário
![Tela inicial do Editor Braille 3D](docs/tela-inicial.png)
*Legenda: Landing page explicando a proposta e campo para digitação do texto.*

![Resultado da geração e download](docs/download-stl.png)
*Legenda: Texto convertido e botão para baixar o arquivo STL.*

### Visualização do Modelo 3D (Opcional, mas recomendado)
![Imagem do STL fatiado ou impresso](docs/impressao-braille.jpg)
*Legenda: Resultado físico (ou preview no software de impressão) gerado a partir do arquivo baixado no app.*

## Tecnologias e Créditos

- **Construído com:** [Lovable](https://lovable.dev) (Vibe Coding)
- **Auxílio de IA:** ChatGPT (refinamento de prompts e estruturação do projeto)
- **Design/Backend:** Lovable Cloud

## Verificação de Segurança

- [x] Nenhuma chave, token ou senha foi commitada no repositório.
- [x] O repositório está público e todos os arquivos/pastas mencionados neste README existem.
