# GreenWatch — Sprint 4

**2º ano de Ciência da Computação · Application Development**<br>
**Professor:** Allan Roberto Molto · **2º semestre**<br>
**Valor total:** 10 pontos

## Sobre o projeto

O GreenWatch apoia equipes responsáveis pela manutenção da vegetação ao longo de rodovias. A aplicação processa os pontos monitorados, classifica automaticamente a altura da vegetação, recomenda uma ação e organiza os locais por prioridade de atendimento.

**Objetivo da Sprint:** evoluir a solução da Sprint 3 para transformar dados de vegetação coletados ao longo das rodovias em informações que apoiem a tomada de decisão das equipes de manutenção. O dashboard destaca as localidades que precisam de maior atenção ou intervenção.

**[Acessar a aplicação](https://joaovictoraabreu-dev.github.io/Fiap-sprint03--application-development/)**

## Requisitos atendidos

- Armazenamento dos pontos monitorados em uma coleção de objetos.
- Análise automática da altura com regras condicionais centralizadas.
- Processamento de vários pontos usando `forEach()`.
- Dashboard com condições, indicadores, localidades e ações recomendadas.
- Identificação visual das condições com cores e estilos próprios.
- Filtros por condição e rodovia.
- Ordenação por prioridade e fila de intervenção.
- Registro de nova leitura, com atualização e reclassificação imediatas do painel.

## Regras de classificação

As faixas foram definidas pelo grupo para este protótipo e estão centralizadas em `src/shared/constants/vegetation-height-bands.ts`. Elas não representam uma norma oficial de concessionária.

| Altura da vegetação | Condição | Prioridade | Ação recomendada |
| --- | --- | ---: | --- |
| De 0 a 30 cm | Monitorado | 1 | Manter o monitoramento de rotina. |
| Acima de 30 até 50 cm | Atenção | 2 | Aumentar a frequência de inspeção. |
| Acima de 50 até 80 cm | Intervenção Programada | 3 | Programar o serviço de roçada. |
| Acima de 80 cm | Intervenção Prioritária | 4 | Realizar intervenção imediata e sinalizar a área. |
| Sem leitura ou valor inválido | Leitura inválida | — | Verificar o sensor ou reinspecionar o ponto. |

Os limites de 30, 50 e 80 cm pertencem à faixa que encerram. A fila de intervenção inclui os níveis 3 e 4 e apresenta primeiro a maior prioridade; em caso de empate, considera a altura e o identificador do ponto. Leituras ausentes, negativas, `NaN` ou infinitas são destacadas, mas não entram na média nem na fila de intervenção.

Os pontos em `src/shared/constants/monitored-points.ts` são dados demonstrativos, não medições reais. O ponto `PT-015` simula uma leitura inválida.

## Como funciona

1. A aplicação carrega os pontos demonstrativos, cada um com identificador, rodovia, quilômetro, trecho, altura e data da leitura.
2. `classifyMonitoredPoints()` percorre os pontos e aplica a classificação definida em `classifyVegetationHeight()`.
3. Funções utilitárias calculam o resumo por condição, filtram e ordenam os pontos e montam a fila de intervenção.
4. Ao registrar uma nova leitura, o estado compartilhado é atualizado e o dashboard reflete a nova classificação sem recarregar a página.

## Critérios da atividade

| Critério | Peso | Onde está implementado |
| --- | ---: | --- |
| Lógica de classificação da vegetação | 3,0 | `vegetation-height-bands.ts` e `vegetation-classification.util.ts` |
| Processamento dos dados e atualização dinâmica do dashboard | 2,5 | `monitored-points.util.ts`, provider e componentes de vegetação |
| Localidades, condições e ações recomendadas | 2,5 | `VegetationMonitoringTable`, `InterventionQueue` e `ConditionSummary` |
| Vídeo pitch de 1 minuto no YouTube | 2,0 | Link na seção [Vídeo pitch](#vídeo-pitch) |

## Tecnologias

React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, Axios, Leaflet, Day.js e Vitest. O projeto não possui back-end: as regras de classificação e processamento ficam no front-end. A aplicação também mantém o mapa e os dados climáticos da Sprint 3, com integrações OpenStreetMap Nominatim e Open-Meteo.

## Executar localmente

**Pré-requisitos:** Node.js 22.12 ou superior (ou 20.19 ou superior) e npm 10 ou superior.

```bash
git clone https://github.com/JoaoVictorAAbreu-Dev/Fiap-sprint03--application-development.git
cd Fiap-sprint03--application-development
npm ci
cp .env.example .env
npm run dev
```

No PowerShell, use `Copy-Item .env.example .env` no lugar de `cp`. O Vite exibirá o endereço local, geralmente `http://localhost:5173`.

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run test` | Executa os testes unitários. |
| `npm run typecheck` | Verifica os tipos TypeScript. |
| `npm run lint` | Executa o ESLint. |
| `npm run build` | Gera a versão de produção. |
| `npm run preview` | Serve localmente a versão de produção. |

## Organização do código

```text
src/
├── app/             # Rotas e providers
├── application/     # DTOs e mapeadores
├── domain/          # Entidades e tipos de domínio
├── infrastructure/  # Clientes HTTP e integrações
├── presentation/    # Páginas, componentes, hooks e layouts
├── shared/          # Constantes e funções utilitárias
└── styles/          # Estilos globais
tests/unit/           # Testes unitários
```

## Equipe

| Integrante | RM |
| --- | ---: |
| João Victor Alves de Abreu | 564946 |
| Luiz Henrique Barbosa Dias | 562399 |
| Rodrigo Kenshin Viana Matayoshi | 564026 |

## Vídeo pitch

**Vídeo da Sprint 4 (YouTube):** _adicionar o link após a gravação._

Vídeo da Sprint 3: [https://youtu.be/VlhCzEI9VtM](https://youtu.be/VlhCzEI9VtM)
