# 🍽️ Café & Restaurante — Ferramenta de Precificação

Ferramenta web de precificação e gestão de custos para pequenos restaurantes e cafés.

## ✨ Funcionalidades

- **Painel Geral** — lucro estimado, ponto de equilíbrio e indicadores de saúde financeira
- **Custos Fixos** — registro de todos os custos mensais + custo por minuto de operação
- **Ficha Técnica** — cadastro de produtos com ingredientes e cálculo automático de preço
- **Cardápio** — listagem com semáforo de margem (Ótimo / Aceitável / Baixo)
- **Simulador** — dois modos: "qual o preço ideal?" e "meu preço está bom?"

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse em `http://localhost:5173`

## 📁 Estrutura

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── layout/        # Sidebar, PageHeader
│   ├── painel/        # StatCard, HealthIndicators, AlertBox
│   └── ficha/         # IngredientRow, PricingResult
├── pages/
│   ├── Painel.jsx
│   ├── Custos.jsx
│   ├── FichaTecnica.jsx
│   ├── Cardapio.jsx
│   └── Simulador.jsx
├── store/
│   ├── costsStore.js    # Zustand — custos fixos (persiste no localStorage)
│   └── productsStore.js # Zustand — cardápio (persiste no localStorage)
└── utils/
    └── pricing.js       # Todas as fórmulas de precificação
```

## 🛠️ Stack

- **React 18 + Vite** — frontend
- **Tailwind CSS** — estilização
- **Zustand** — estado global com persistência
- **React Router** — roteamento
- **localStorage** — persistência dos dados sem backend

## 🧮 Fórmulas principais

```
Preço de venda   = Custo total / (1 - margem%)
Custo mão de obra = Custo mensal total / (dias × horas × 60min) × tempo preparo
Ponto equilíbrio = Custos fixos / (1 - CMV% - taxa cartão%)
CMV%             = Matéria-prima / Faturamento
```

## 📊 Indicadores monitorados

| Indicador | Meta |
|-----------|------|
| CMV | < 35% |
| Folha / faturamento | 25–30% |
| Margem de lucro | ≥ 40% |

---

> Dados pré-configurados com os valores reais do estabelecimento. Consulte `CLAUDE.md` para o contexto completo do projeto.
