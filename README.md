# Atualizacoes
Melhorias, correções de layout ou novas funcionalidades para a pagina.

## 📦 Estrutura do Projeto — Velko Compressores
Este repositório contém o código‑fonte do site da Velko Compressores, estruturado em módulos independentes para as categorias: Alternativo, Peças, Parafuso e Remanufaturado.
Cada categoria é organizada como um mini‑site autônomo, com suas próprias páginas e arquivos de assets.

## 🗂️ Estrutura Geral do Projeto
```md
/
├── index.html                          ← Página inicial do site
│
├── alternativo.html                    ← Página inicial da seção Alternativo
├── pecas.html                          ← Página inicial da seção Peças
├── parafuso.html                       ← Página inicial da seção Parafuso
├── remanufaturado.html                 ← Página inicial da seção Remanufaturado
│
├── alternativo/
│   ├── pages/                          ← Páginas específicas para Alternativo
│   └── assets/
│       ├── css/
│       ├── js/
│       └── img/
│
├── pecas/                              ← MODELO DEFINIDO
│   ├── pages/
│   │   ├── c3-4ces-4cc.html
│   │   ├── c3-4des-4dc.html
│   │   ├── c3-4ees-4ec.html
│   │   └── c3-4fes-4fc.html
│   │
│   └── assets/
│       ├── css/                        ← Não será utilizado local, será utilizado arquivos globais
│       │   ├── base.css
│       │   ├── layout.css
│       │   ├── components.css
│       │   └── pages.css
│       │
│       ├── js/
│       │   ├── addItem/
│       │   │   ├── c3-4ces-4cc.js
│       │   │   ├── c3-4des-4dc.js
│       │   │   ├── c3-4ees-4ec.js
│       │   │   └── c3-4fes-4fc.js
│       │   │
│       │   ├── auth/
│       │   │   └── modaLogin.js
│       │   │
│       │   └── cart/                  ← MÓDULOS COMPARTILHADOS DO CARRINHO
│       │       ├── a11y.js
│       │       ├── api.js
│       │       ├── badge.js
│       │       ├── bindings.js
│       │       ├── catalog.js
│       │       ├── config.js
│       │       ├── main.js
│       │       ├── ops.js
│       │       ├── render.js
│       │       ├── sku.js
│       │       ├── store.js
│       │       └── ui.js
│       │
│       └── img/
│           ├── pecas-c3-4ces-4cc/
│           ├── pecas-c3-4des-4dc/
│           ├── pecas-c3-4ees-4ec/
│           └── pecas-c3-4fes-4fc/
│
├── parafuso/
│   ├── pages/
│   └── assets/
│       ├── css/
│       ├── js/
│       └── img/
│
└── remanufaturado/
    ├── pages/
    └── assets/
        ├── css/
        ├── js/
        └── img/
```

## 🧩 Organização por Categoria
Cada categoria segue a mesma estrutura:

### pages/
Contém páginas internas relacionadas à categoria.

### assets/css/
Organização recomendada:
- base.css – reset, variáveis, tokens globais
- layout.css – grids, containers, área principal
- components.css – botões, cards, tabelas, badges
- pages.css – estilos exclusivos de páginas específicas

### assets/js/
Organizado em subpastas por função:

addItem/ → scripts de adicionar produtos ao carrinho
auth/ → sistemas de autenticação
cart/ → núcleo de carrinho, compartilhado entre todas as páginas

### assets/img/
Pastas separadas por linha de produto ou categoria.

## 🛒 Módulo do Carrinho
Todos os módulos essenciais do carrinho ficam em:
> pecas/assets/js/cart/

Esses arquivos são usados pelos scripts:
- addItem‑*.js
- modaLogin.js
- páginas internas da categoria Peças

Estrutura modular melhora:
- reaproveitamento de código
- organização
- manutenção
- escalabilidade


## 🧭 Portais das Categorias
As páginas:
> alternativo.html  
> pecas.html  
> parafuso.html  
> remanufaturado.html

Servem como páginas de entrada para cada categoria, organizando links para suas páginas internas.

## 🧱 Padrões de Nomeação
Para clareza e consistência:
- utilizar kebab-case
- evitar acentos e espaços
- manter nomes descritivos

Exemplos:
> addItem-c3-4ees-4ec.js
> rolamento-c3-4ces-4cc-001.webp
> pecas-c3-4fes-4fc/


## 🎯 Objetivo da Arquitetura
A estrutura deste projeto foi planejada para:
- facilitar manutenção
- permitir crescimento organizado
- padronizar todas as categorias
- centralizar módulos importantes
- melhorar clareza e escalabilidade
- evitar duplicação de códigos


## 📌 Licença
Projeto de propriedade da Velko Compressores.
