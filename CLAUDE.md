# CLAUDE.md — Ferramenta de Precificação para Café & Restaurante

> Este arquivo é o briefing completo do projeto. Leia antes de qualquer coisa.

## Contexto do negócio

Dono de um café/restaurante em operação, faturamento entre R$ 10–30 mil/mês, com 3–5 funcionários. Atualmente não tem controle formal de custos — precificação feita no feeling. O objetivo é construir uma ferramenta web completa para:

1. Registrar e visualizar todos os custos operacionais
2. Criar fichas técnicas por produto (ingredientes + mão de obra)
3. Calcular o preço ideal de venda com margem desejada de **40%**
4. Simular cenários de precificação
5. Monitorar a saúde financeira do negócio

---

## Dados reais do estabelecimento (usar como valores padrão)

### Custos fixos mensais
| Item | Valor estimado |
|------|---------------|
| Aluguel | R$ 4.500 |
| Folha de pagamento + encargos | R$ 5.000 |
| Energia elétrica | R$ 600 |
| Água & gás | R$ 350 |
| Internet & telefone | R$ 150 |
| Taxas de delivery (iFood etc.) | R$ 800 |
| Outros | R$ 300 |
| **Total fixos** | **R$ 11.700** |

### Custos variáveis
| Item | Valor estimado |
|------|---------------|
| Matéria-prima mensal | R$ 8.000 |
| Taxa de cartão | ~2% |
| **Total variável** | **~R$ 8.000 + 2% vendas** |

### Operação
- Faturamento atual: ~R$ 20.000/mês
- Dias trabalhados: 26/mês (~10h/dia)
- Margem de lucro desejada: **40%**
- Funcionários: 3–5

### Categorias do cardápio
- Bebidas quentes
- Bebidas frias
- Lanches / Sanduíches
- Refeições (almoço/jantar)
- Doces / Sobremesas
- Pães / Salgados

---

## Produto de exemplo — Prato Filé de Frango

Use este produto para testes e demonstração:

| Ingrediente | Quantidade | Preço referência |
|-------------|-----------|-----------------|
| Arroz | 100g | R$ 6,00/kg |
| Feijão | 80g | R$ 9,00/kg |
| Filé de frango | 200g | R$ 26,00/kg |
| Batata frita | 80g | R$ 8,00/kg |
| Farofa | 20g | R$ 12,00/kg |

- Tempo de preparo: ~20 min
- Embalagem: R$ 0,50
- Custo estimado de ingredientes: ~R$ 4,82
- Custo com mão de obra (~20min): ~R$ 1,50
- **Custo total: ~R$ 6,82**
- **Preço sugerido (40% margem): ~R$ 11,37**

---

## Funcionalidades da ferramenta

### 1. Painel Geral (Dashboard)
- Cards com: lucro estimado/mês, custo total, ponto de equilíbrio, taxa de cartão
- Composição dos custos (gráfico de barras de progresso)
- Indicadores de saúde:
  - CMV — Custo de Mercadoria Vendida (ideal < 35%)
  - Folha sobre faturamento (ideal 25–30%)
  - Margem de lucro real vs. meta
  - Faturamento vs. ponto de equilíbrio
- Alertas automáticos baseados nos indicadores

### 2. Custos Fixos
- Formulário editável com todos os custos mensais
- Cálculo automático de custo por hora e por minuto de operação
- Resumo visual em tempo real

### 3. Ficha Técnica
- Cadastro de produto com: nome, categoria, porções, tempo de preparo, embalagem
- Lista dinâmica de ingredientes (nome, quantidade, unidade, preço)
- Suporte a unidades: g, kg, ml, L, un
- Cálculo automático de: custo de ingredientes, custo de mão de obra (proporcional ao tempo), custo total por porção
- Slider de margem de lucro (10–80%)
- Resultado: preço sugerido, preço mínimo, markup, lucro por venda
- Botão para salvar no cardápio

### 4. Cardápio
- Tabela com todos os produtos cadastrados
- Colunas: nome, categoria, custo, preço sugerido, margem, status (semáforo)
- Status: Ótimo (≥40%), Aceitável (25–39%), Baixo (<25%)

### 5. Simulador de Preço
- **Modo 1** — "Me diz o preço ideal": informa custo + margem desejada → retorna preço
- **Modo 2** — "Tenho um preço, está bom?": informa preço atual → retorna análise de margem + sugestão
- Tabela de markup rápido (referência cruzada custo × margem)

---

## Fórmulas de precificação

```
Custo por minuto = Custo total mensal / (dias × horas/dia × 60)
Custo mão de obra = Custo por minuto × tempo de preparo (min)
Custo total item = Custo ingredientes + Embalagem + Custo mão de obra
Preço de venda = Custo total / (1 - margem%)
Markup = 1 / (1 - margem%)
Ponto de equilíbrio = Custos fixos / (1 - CMV% - taxa cartão%)
CMV% = Custo matéria-prima / Faturamento
```

---

## Stack técnica sugerida

```
Frontend:   React + Vite  (ou Next.js se quiser SSR)
Estilização: Tailwind CSS
Persistência: localStorage (MVP) → depois Supabase ou Firebase
Gráficos:   Recharts ou Chart.js
Deploy:     Vercel ou Netlify
```

### Estrutura de arquivos sugerida

```
src/
  components/
    layout/
      Sidebar.jsx
      PageHeader.jsx
    painel/
      StatCard.jsx
      CostBreakdown.jsx
      HealthIndicators.jsx
      AlertBox.jsx
    custos/
      CostForm.jsx
      CostSummary.jsx
    ficha/
      ProductForm.jsx
      IngredientRow.jsx
      PricingResult.jsx
    cardapio/
      ProductTable.jsx
      ProductRow.jsx
    simulador/
      ModoSugestao.jsx
      ModoValidacao.jsx
      MarkupTable.jsx
  pages/
    Painel.jsx
    Custos.jsx
    FichaTecnica.jsx
    Cardapio.jsx
    Simulador.jsx
  hooks/
    useCosts.js       ← lê/salva custos fixos
    useProducts.js    ← CRUD de produtos no cardápio
    usePricing.js     ← funções de cálculo de precificação
  utils/
    pricing.js        ← fórmulas puras (testáveis)
    formatters.js     ← R$, %, etc.
  store/
    costsStore.js     ← estado global de custos
    productsStore.js  ← estado global do cardápio
  App.jsx
  main.jsx
```

---

## Prioridade de desenvolvimento

1. **Setup** — Vite + React + Tailwind + roteamento
2. **Layout base** — Sidebar + estrutura de páginas
3. **Hook `useCosts`** + página de Custos Fixos (com valores padrão do negócio)
4. **Utilitários de pricing** (`pricing.js`) com testes
5. **Painel Geral** — consumindo os dados de custos
6. **Ficha Técnica** — cadastro de produto + cálculo
7. **Cardápio** — listagem dos produtos salvos
8. **Simulador** — os dois modos
9. **Persistência** — localStorage primeiro, Supabase depois
10. **Refinamento visual** e responsividade mobile

---

## Observações importantes

- Todos os valores monetários em BRL (R$), formatados com vírgula decimal
- O custo de mão de obra **deve ser embutido** automaticamente na ficha técnica com base no tempo de preparo
- A taxa de cartão deve ser descontada do lucro, não somada ao custo
- O ponto de equilíbrio é o faturamento mínimo para não operar no prejuízo
- Indicadores de saúde devem ter alertas visuais claros (verde/amarelo/vermelho)
- O protótipo HTML completo está em `public/precificacao-restaurante.html` — use como referência visual

---

## Arquivo de referência

`public/precificacao-restaurante.html` — protótipo funcional completo em HTML/CSS/JS vanilla, sem dependências. Contém toda a lógica de negócio implementada e pode ser usado como base para migrar para React.
