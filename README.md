# Projeto-BulbeShop-Grupo4
Componentes: Bernardo Cerqueira, Emanuel Brandão, Gabriel Fonseca, Gabriel Montandon, Henrique Araujo, Joao Pedro Lodi

Baixa fidelidade:
https://www.figma.com/board/9uS1PVsxe0UWDNwACcwJUl/Sprint-1-Projeto-Bulbe?node-id=0-1&p=f&t=KWe3uVxchUap200Y-0

Alta fidelidade:
https://www.figma.com/design/Wm941FxEwAeAn90FL0YhGk/Bulbe----IBMEC--cópia-?node-id=4066-2&p=f&t=xwrLEWbcLh2LOJ0b-0

Backlog:
https://docs.google.com/document/d/1CZ5wrlA9mjkTnp5wFri8biepWON3zQm5Nf5Cw_A-dfY/edit?usp=sharing

Dailies:
https://docs.google.com/document/d/1lAfZxk55VSfGjrQLFiPmjG53WF4UnVGLaShb2RjSL2o/edit?tab=t.0

Jira: 
https://gabriel0doornik.atlassian.net/jira/software/projects/SCRUM/summary

Abertura e Fechamento - Sprint 2:
https://docs.google.com/document/d/1oULzIb3oUTXKz7ZAGv0vZh9q03j-VCKPkvTHfUQhytI/edit?usp=sharing

Abertura e Fechamento - Sprint 3:
https://docs.google.com/document/d/1WsS5ksCjawITx_RwvUQc6hTmOEgiK3yFhFBhE6vqKBE/edit?tab=t.0

Abertura e Fechamento - Sprint 4:
https://docs.google.com/document/d/1Fmg5Ln2DAluoDZpmRASaIXDqpqLC7WLg0mWnCKVSKyE/edit?usp=sharing

Apresentação:
https://www.canva.com/design/DAG2bZnejdI/0p1UnJkcdNMPg1tQbxC2lw/edit?utm_content=DAG2bZnejdI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

Link do site (atualizado — novo repo com as integrações da Sprint 4):
https://emanuelrbrandao1.github.io/bulbe-energia-front-grupo4/HOME/home.html

Link antigo (Sprint 1-3, sem integração com a API):
https://ibmec-tech-2-periodo-2025-2.github.io/Projeto-BulbeShop-Grupo4/HOME/home.html


Bulbe — Backlog do Produto (do Sprint 1 até o fim do semestre)
Este documento consolida o backlog do aplicativo Bulbe com base nos protótipos de baixa fidelidade (login → catálogo/home → detalhe do produto → endereço → entrega/pagamento → confirmação). O formato prioriza narrativa/descrição em vez de tabelas.

1) Visão do Produto
Um aplicativo mobile de e‑commerce focado em produtos de iluminação inteligente, com experiência simples de descoberta, compra e acompanhamento do pedido.
Objetivos da Sprint 1
Entregar o fluxo navegável ponta a ponta (páginas estáticas, links funcionais) do login à confirmação.

Documentar organização do repositório, padrões de código e requisitos funcionais.

Estabelecer design tokens e componentes básicos reutilizáveis.


2) Como vamos organizar o backlog (bem simples)
Prioridade: Tem que ter / Bom ter / Pode ter / Não agora.

Tamanho (pontos): 1, 2, 3, 5, 8. É só uma noção de esforço.

Pronto quando (Sprint 1):

Páginas principais funcionam em mobile e navegam entre si.

Itens básicos de acessibilidade (texto alternativo, rótulos e foco visível).

Repositório com README, organização de pastas e prints das telas + link do Figma.

Paleta de cores e estilos básicos definidos.


Plano do semestre (sprints e entregas)
Tecnologia-alvo do curso: HTML + CSS + JavaScript básico (sem frameworks). Deploy simples no GitHub Pages.
Sprint 1 (agora) — Telas estáticas e navegação: Login, Home, Produto, Endereço, Entrega/Pagamento e Confirmação. Documentação do projeto.

Sprint 2 — JS básico: buscar por nome (filtro simples), lista de produtos vinda de um products.json, clique no card abre a página do produto preenchida pelos dados. Favoritos e Carrinho salvos no navegador (localStorage).

Sprint 3 — Checkout de verdade (simulado): cálculo de preço com desconto Pix (−10%), escolha de frete (padrão/expresso) afetando o valor e a previsão. Validação de formulário (campos obrigatórios) e código de pedido gerado na confirmação.

Sprint 4 — Melhorias de UX: carrossel simples em JS, banner rotativo, botão “ver mais” na Home, dark mode opcional, refino de responsividade e acessibilidade.

Sprint 5 (final) — Dados e entrega: contagem de cliques/visualizações (salvar em localStorage) e seção “Recomendados” baseada no que foi mais visto. Revisão geral, documentação final, vídeo curto de demonstração e deploy.

O que vamos mostrar na banca final
Fluxo completo funcionando, carrinho e checkout com desconto Pix, busca simples, favoritos, recomendados por visualizações e deploy público.

Repositório organizado, README claro, prints e curta apresentação do que cada pessoa fez.


3) Requisitos Funcionais (Sprint 1)

Exibir Home com busca, banner de promo e grade de produtos

Documentação essencial publicada no repositório.

Variáveis para cor declaradas e básicos documentados (qual o objetivo de cada variável? ).

Se der tempo:

.Exibir tela de Login, Produto, Endereço, Checkout e confirmação com inputs e ícones de ação.

Permitir navegação da Home para Detalhe do Produto e vice‑versa.

Ícones de Favoritos e Carrinho visíveis (placeholders com contagem simulada, se desejado).

Acessibilidade: semântica, contraste, foco etc.

4) Requisitos Funcionais (Sprint 2)
Pendências da Sprint 1 (fundo amarelo, prioridade).

.Exibir tela de Login , Produto, Endereço, Checkout e confirmação com inputs e ícones de ação.

Permitir navegação da Home para Detalhe do Produto e vice‑versa.

Ícones de Favoritos e Carrinho visíveis (placeholders com contagem simulada, se desejado).

Acessibilidade: semântica, contraste, foco etc... 	

Header e Navegação:
 Implementar barra superior com logo, ícones de carrinho e favoritos (com contagem simulada), além do campo de busca.

Home / Catálogo:
 Exibir lista de produtos a partir de dados “fakes” (products.json), com grid responsivo e cards clicáveis.

Detalhe de Produto:
 Criar uma página que exibe imagem, preço, descrição e botão de compra.
 Permitir voltar para a Home.

Carrinho (simples):
 Exibir itens adicionados, com preço unitário e subtotal.
 Permitir remover item do carrinho.

Checkout — Endereço:
 Tela com formulário de CEP, número e complemento (validação simples via HTML).
 Dados devem ser armazenados em localStorage.

Documentação:
 Atualizar README com instruções de execução do projeto e screenshots das telas.

5) Épicos e Histórias (com critérios de pronto e tarefas) (com critérios de aceite e tarefas)
E1 — Onboarding & Login (Tem que ter, 8 pts)
História: Como pessoa usuária, quero acessar a conta via login/senha e visualizar opção de login social para entrar rapidamente.
Quando consideramos pronto
Página de Login com campos de usuário e senha, estados de foco/erro/desabilitado.

Ícone para mostrar/ocultar senha.

Links para Criar conta e Esqueci minha senha (placeholders).

Botões/ícones sociais visíveis (sem integração nesta sprint).

Tarefas essenciais
Criar login.html e componentes de input + ícones.

Validar rótulos; mensagens de erro simuladas via HTML/CSS.


E2 — Header/Toolbar & Navegação (Tem que ter, 5 pts)
História: Como pessoa usuária, desejo um cabeçalho fixo com logo e ícones (voltar, favoritos, carrinho, conta) e uma barra inferior (quando aplicável) para navegar com facilidade.
Quando consideramos pronto
Header responsivo com logo Bulbe e ícones.

Bottom bar (home, contato, preço) na variação indicada nos mocks.

Links entre páginas funcionando: Home ⇄ Produto ⇄ Checkout ⇄ Confirmação.

Tarefas essenciais
Componentizar header/navbar/footer.

Inserir SVGs e estados de foco/hover.


E3 — Busca & Catálogo (Home) (Tem que ter, 8 pts)
História: Como pessoa usuária, quero buscar itens e ver uma grade de produtos com preço e imagem, além de chamadas de promoção.
Quando consideramos pronto
Campo de busca com ícone (placeholder, sem lógica de filtragem nesta sprint).

Banner de promoções destacado.

Grade de produtos (2–3 colunas) com imagem, título curto e preço.

Carrossel/banners com setas estáticas (sem JS obrigatório).

Tarefas essenciais
Criar home.html e o card de produto reutilizável.

Seções de promo (badge/label) e lista de produtos mockados.


E4 — Detalhe do Produto (Tem que ter, 5 pts)
História: Como pessoa usuária, quero visualizar o produto com foto grande, título, avaliação, preço e descrição curta, e um CTA para comprar.
Quando consideramos pronto
Imagem principal grande, título, estrelas, preço, descrição curta.

Botão Comprar destacado.

Link/âncora para Avaliações (conteúdo simples ou placeholder).

Tarefas essenciais
Criar produto.html; layout vertical com CTA fixo em mobile.


E5 — Endereço (Checkout – Etapa 1) (Tem que ter, 5 pts)
História: Como pessoa usuária, desejo informar CEP, número, logradouro e complemento para entrega.
Quando consideramos pronto
Campos: CEP, Número, Endereço/Logradouro, Complemento.


Teclado e tipos de input adequados no mobile.


Tarefas essenciais
Criar endereco.html com labels, placeholders e dicas de preenchimento.



E6 — Entrega & Pagamento (Checkout – Etapa 2) (Tem que ter, 5 pts)
História: Como pessoa usuária, quero escolher tipo de entrega (padrão/expressa) e forma de pagamento (Pix, crédito, débito) e seguir para confirmação.
Quando consideramos pronto
Seletores tipo rádio estilizados para entrega.


Formas de pagamento: Pix (com destaque de 10% de desconto), Crédito (parcelado até 6x, mínimo R$ 100/parcela), Débito.

Validação: avisos se o valor for insuficiente para parcelamento ou se o cupom for inválido.

Campo para aplicar cupom no carrinho e cálculo e visualização do novo preço

Mostrar cashback acumulado na tela de confirmação.

Resumo do pedido: subtotal, frete, desconto Pix, desconto cupom, total e valor das parcelas.


Botão Confirmar Compra habilita navegação para confirmação.


Tarefas essenciais
Criar checkout.html; badges/labels de preço/benefício visuais.



E7 — Confirmação & Rastreio (Tem que ter, 3 pts)
História: Como pessoa usuária, após comprar, desejo ver uma tela de obrigado com chamada para rastrear o pedido e instruções de e‑mail/nota fiscal.
Quando consideramos pronto
Mensagem de sucesso; CTA Rastrear (link placeholder/call to action).


Navegação Prev/Next simulada.
Tela de agradecimento.                                                                                                                                                            
Seção de avaliação: após confirmar o pedido, o usuário pode avaliar (1 a 5 estrelas) e deixar um comentário rápido.


Sugestão de novos produtos (mock simples) para continuar comprando.



Tarefas essenciais
Criar confirmacao.html e CTAs.



E8 — Cores e estilos básicos (Bom ter, 5 pts)
Objetivo: Definir paleta de cores, fontes e espaçamentos simples para tudo ficar consistente.
Quando consideramos pronto
Cores principais e secundárias definidas.


Tamanhos de título e texto padronizados.


Botões, inputs e cards mostram o mesmo estilo.


Tarefas essenciais
Criar uma página com exemplos visuais.


Centralizar as cores em um arquivo CSS para reaproveitar.



E9 — Acessibilidade básica (Bom ter, 3 pts)
Objetivo: Garantir que as telas possam ser usadas por todos.
Quando consideramos pronto
HTML com tags certas (header, main, footer).


label ligado em cada input, imagens com alt.


Contraste de cores suficiente e foco visível ao navegar com teclado.


Tarefas essenciais
Conferir com as ferramentas do navegador e ajustar o que faltar.



E10 — Repositório & Documentação (Tem que ter, 8 pts)
Objetivo: Estruturar o projeto e registrar práticas.
Quando consideramos pronto
GitHub com README (pitch, instalação, rotas, decisões de UI), organização de pastas, padrão de commits/branches.


Documentos: backlog, requisitos funcionais, cerimônias (planning, dailies, review/retro), screenshots e link do Figma.


Tarefas essenciais
Criar docs/ (backlog.md, requisitos.md, cerimonias.md), src/ (pages, assets, css, js), CONTRIBUTING.md.



E11 — Qualidade do Código (Bom ter, 3 pts)
Objetivo: Padronizar e evitar bagunças.
Quando consideramos pronto
Linters (checkers de erros básicos, como HTMLHint/Stylelint) e formatação (identador de código automático, Prettier) configurados.


Padrões BEM/utility-first documentados no README.



E12 — Telemetria (Plano/Stub) (Pode ter, 2 pts)
Objetivo: Desenhar plano de eventos analíticos para uso em sprints futuras.
Quando consideramos pronto
Eventos de uso: view_home, search_submit, view_product, add_to_cart, checkout_step, purchase_confirmed. (variáveis utilizadas para análise)
Análise de carrinho abandonado: salvar no localStorage e exibir mensagem quando o usuário voltar (“Você ainda tem itens no carrinho!”).

Mini dashboard (página simples para apresentação): mostra métricas de cliques, carrinhos iniciados, compras finalizadas e conversão (%).
Simulação de alerta: exibir aviso de “produto com estoque baixo” ou “promoção expirada” (mockado, sem backend real).




6) Riscos e Mitigações
Responsividade atrasada → mobile‑first desde o início e testes constantes.


Commits concentrados → regra de envios pequenos com descrição sobre o que foi feito vinculada.




7) Ideias para depois (se sobrar tempo)
Experiência & Catálogo
Filtros simples (preço e categoria) e ordenação por preço.


Mini‑carrinho lateral (abre/fecha) e carregamento com esqueleto.


Checkout & Pagamento
Máscara de CEP e preenchimento automático (ViaCEP) — se der tempo.


Cupom de desconto simples.


Conta & Engajamento
Perfil e histórico de pedidos (salvos no navegador) e avaliações básicas.



Tecnologias e o que vamos usar
Front-end: HTML, CSS e JavaScript puro.


Dados”fakes”: arquivo products.json armazenado no projeto.


Armazenamento local: localStorage para carrinho, favoritos e métricas simples.


“Lançamento”: GitHub Pages.




8) Checklist de Entrega da Sprint 1
Página 1 navegável: Login. Se der tempo Home, Produto, Endereço, Checkout, Confirmação também. 


Variáveis (:root) e componentes básicos publicados.


Acessibilidade mínima assegurada (mobile first).


Repositório com README, estrutura e documentos em docs/.


Screenshots das telas e link para o Figma no README.


Backlog atualizado.
