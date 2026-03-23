# Organization Balance — SortUI

Interface de gestion des finances d'organisation, reproduite fidèlement depuis les maquettes Figma.

---

## 🚀 Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev
# → http://localhost:3000

# Build de production
npm run build && npm start
```

---

## 📁 Architecture du projet

```
src/app/
├── page.tsx                              ← Orchestrateur principal (tabs, routing)
├── layout.tsx                            ← Layout global (Inter font)
├── globals.css                           ← TailwindCSS + reset
├── types/
│   └── index.ts                          ← Interfaces TypeScript (AppData, Transaction, etc.)
├── lib/
│   ├── datas.json                        ← Données JSON fournies
│   ├── dataService.ts                    ← Logique métier + formules de calcul
│   └── icons.tsx                         ← Bibliothèque d'icônes SVG centralisée
└── components/
    ├── shared/
    │   ├── Sidebar.tsx                   ← Navigation latérale (partagée entre tous les tabs)
    │   ├── Topbar.tsx                    ← Barre supérieure (adapte le CTA selon le tab actif)
    │   └── StatCard.tsx                  ← Composant carte de statistique réutilisable
    ├── overview/
    │   └── OverviewTab.tsx               ← Interface 1 : Vue d'ensemble avec graphique
    └── transactions/
        ├── TransactionsTab.tsx           ← Interface 2 : Table filtrée + pagination + dropdown
        └── TeamWalletsTab.tsx            ← Interface 3 : Portefeuilles des équipes
```

---

## 🧮 Formules implémentées (dataService.ts)

| Formule | Description | Résultat |
|---------|-------------|---------|
| `calcTotalSpent` | ad_spending + completed, 30 derniers jours | ~$1,152.49 |
| `calcPendingDeposit` | deposit + pending, 30 derniers jours | $5,000.00 |
| `calcTotalAllocated` | allocation + completed, 30 derniers jours | $4,300.00 |
| `calcPendingWithdrawal` | withdrawal + pending, 30 derniers jours | $3,200.00 |
| `calcOrgSpending` | période courante vs précédente + % de changement | — |
| `calcChartData` | ad_spending groupés par jour, triés chronologiquement | 7 points |
| `calcCurrentBalance` | Solde du wallet_001 | $12,580.75 |

---

## 🎨 Choix techniques

### Framework : Next.js 15 + TypeScript
- App Router pour la navigation future
- TypeScript pour la robustesse et la maintenabilité

### Styling : TailwindCSS
- Design tokens extraits directement depuis Figma (couleurs, typographie, espacements)
- Classes utilitaires pour une cohérence maximale

### Graphique : Recharts
- BarChart pour les dépenses publicitaires
- Tooltip personnalisé
- Responsive avec ResponsiveContainer

### Architecture
- **Séparation logique/présentation** : toute la logique métier est dans `dataService.ts`
- **Composants réutilisables** : `StatCard` accepte props pour label, valeur, icône, trend
- **Icônes centralisées** : bibliothèque `Icons` en SVG pour éviter les dépendances externes

---

## ✅ Fonctionnalités implémentées

- [x] Interface 1 — Overview : balance card, 4 stat cards, graphique bar chart, table récente
- [x] Interface 2 — Transactions : filtres, table complète, dropdown par ligne, pagination
- [x] Interface 3 — Team wallets : cartes par équipe avec statuts
- [x] Navigation par tabs avec état partagé
- [x] Hover states sur tous les éléments interactifs
- [x] Données réelles calculées depuis datas.json
- [x] Sidebar et Topbar partagés entre les interfaces
- [x] Support chat button fixe (bottom-right)

---

## 🔧 Ce qui pourrait être amélioré

- Ajouter de vrais filtres Date/Type/Sources fonctionnels avec dropdowns
- Implémenter la pagination côté serveur pour de grands datasets
- Ajouter des animations de transitions entre les tabs
- Implémenter la 3ème interface Team wallets avec toutes les données réelles
- Ajouter des tests unitaires pour les fonctions de calcul
