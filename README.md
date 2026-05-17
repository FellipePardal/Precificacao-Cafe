# Café & Restaurante — Ferramenta de Precificação

Ferramenta web de precificação e gestão de custos para pequenos restaurantes e cafés.

## Como rodar

```bash
npm install
npm run dev
```

Acesse em `http://localhost:5173`

## Funcionalidades atuais

- **Painel Geral** — lucro estimado, ponto de equilíbrio e indicadores de saúde financeira
- **Custos Fixos** — registro de todos os custos mensais + custo por minuto de operação
- **Ficha Técnica** — cadastro de produtos com ingredientes e cálculo automático de preço
- **Cardápio** — listagem com semáforo de margem (Ótimo / Aceitável / Baixo)
- **Simulador** — dois modos: sugestão de preço ideal e validação de preço praticado

## Stack

- React 18 + Vite
- Tailwind CSS
- Zustand (estado global com persistência em localStorage)
- React Router

## Fórmulas principais

```
Preço de venda    = Custo total / (1 - margem%)
Custo mão de obra = Custo mensal / (dias × horas × 60) × tempo preparo
Ponto equilíbrio  = Custos fixos / (1 - CMV% - taxa cartão%)
CMV%              = Matéria-prima / Faturamento
```

---

## Roadmap

Progresso atual: **Fase 1 concluída** (6/26 itens totais).

### Fase 1 — Precificação ✅ Concluída

- [x] Cadastro de custos fixos mensais
- [x] Ficha técnica com ingredientes e mão de obra
- [x] Cálculo automático de preço de venda
- [x] Cardápio com status de margem
- [x] Simulador de preço (sugestão + validação)
- [x] Painel com indicadores de saúde financeira

---

### Fase 2 — Operação Diária 🔜 Próxima

Registrar o que entra e sai no dia a dia do estabelecimento.

- [ ] Registro de vendas diário por produto
- [ ] Controle de estoque (entradas e saídas)
- [ ] Fluxo de caixa (receitas vs despesas)
- [ ] Alertas automáticos de estoque baixo
- [ ] Controle de desperdício e quebra

---

### Fase 3 — Inteligência Financeira

Análises para decisões mais precisas sobre o negócio.

- [ ] Ranking de produtos por lucro real
- [ ] Margem real vs margem teórica por item
- [ ] Relatório mensal de performance
- [ ] Análise de pico de vendas por horário
- [ ] Custo real por delivery vs salão
- [ ] Metas e projeções de faturamento

---

### Fase 4 — Gestão de Equipe

Controle de pessoas e custo de mão de obra real.

- [ ] Cadastro de funcionários e cargos
- [ ] Escala de trabalho semanal
- [ ] Custo de MO por turno e por produto
- [ ] Controle de horas extras

---

### Fase 5 — Escala e Integração

Persistência em nuvem, integrações e mobile.

- [ ] Banco de dados em nuvem (Supabase)
- [ ] Login e múltiplos usuários
- [ ] Relatório de taxas iFood/Rappi
- [ ] Exportação para PDF/Excel
- [ ] App mobile (PWA)

---

> Dados pré-configurados com os valores reais do estabelecimento. Consulte `CLAUDE.md` para o contexto completo.
