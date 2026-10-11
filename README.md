# MINTFLOW — Your Money. Your Moves. 🚀

> **"Every financial decision has a consequence. Understand it before you make it."**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Evaluation Score](https://img.shields.io/badge/Evaluation_Score-92.6%2F100-65F5B4?style=flat-square&logo=checkmarx&logoColor=black)](https://github.com/RahulBansal-24/MintFlow)

**MINTFLOW** is a high-polish, consumer-facing personal finance simulator and decision laboratory built specifically for Indian Gen Z college students, first-time earners, and young adults. Designed around a foundational ₹10,000 monthly budget over a 30-day financial cycle, MINTFLOW solves the pervasive problem of mid-month cash depletion through predictive consequence modeling, ring-fenced commitments, and real-time decision simulation.

Unlike conventional expense trackers that merely record past spending, MINTFLOW operates as a forward-looking financial flight simulator: users can test purchases, emergencies, subscription cancellations, and savings goals in an isolated mathematical sandbox to see their exact impact on daily flexible allowances, commitment coverage, and month-end cash reserves **before spending a single rupee**.

> [!NOTE]  
> **Educational Simulation Tool:** MINTFLOW is an interactive personal finance simulation and educational decision-support tool. It does not connect to real banking APIs, require bank credentials, or provide certified financial advisory services. All financial calculations run deterministically in the local browser environment.

---

## 🧭 Table of Contents

- [🚀 Project Title and Introduction](#mintflow--your-money-your-moves-)
- [💡 Project Overview](#-project-overview)
- [✨ Features in Detail](#-features-in-detail)
- [🚦 Startup Modes & Testing Environment](#-startup-modes--testing-environment)
  - [🎮 1. Seeded Demo Mode — Hackathon Experience](#-1-seeded-demo-mode--hackathon-experience)
  - [🧪 Hackathon Test Lab — Inside Seeded Demo Mode](#-hackathon-test-lab--inside-seeded-demo-mode)
  - [🌱 2. Clean State Mode — Start Fresh](#-2-clean-state-mode--start-fresh)
  - [📊 3. Mode Comparison](#-3-mode-comparison)
  - [🧭 4. Getting Started With Each Mode](#-4-getting-started-with-each-mode)
- [🧮 Finance Engine: Mathematics and Logic](#-finance-engine-mathematics-and-logic)
  - [Core Balance Equations](#core-balance-equations)
  - [Daily Allowance Calculations](#daily-allowance-calculations)
  - [Deterministic Forecast Model](#deterministic-forecast-model)
  - [Financial Health Score Heuristic (0–100)](#financial-health-score-heuristic-0100)
  - [Risk Classification Tiers](#risk-classification-tiers)
  - [Accounting Rules & Invariants](#accounting-rules--invariants)
- [🎮 Interactive Simulations & Decision Lab](#-interactive-simulations--decision-lab)
- [🛠️ Technology Stack](#️-technology-stack)
- [🏗️ Architecture and Code Organization](#️-architecture-and-code-organization)
- [💻 Installation and Local Setup](#-installation-and-local-setup)
- [🧑‍💻 How to Use MINTFLOW](#-how-to-use-mintflow)
- [📸 Screenshots and Visual Walkthrough](#-screenshots-and-visual-walkthrough)
- [📊 Example Financial Scenario](#-example-financial-scenario)
- [🔐 Data Persistence and Privacy](#-data-persistence-and-privacy)
- [🌐 Deployment](#-deployment)
- [🎯 Use Cases](#-use-cases)
- [⚖️ Limitations and Assumptions](#️-limitations-and-assumptions)
- [🔮 Future Scope](#-future-scope)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author](#-author)
- [🙌 Acknowledgements and License](#-acknowledgements-and-license)
- [✨ Closing](#-closing)

---

## 💡 Project Overview

For millions of Gen Z students and young adults living on pocket money, stipends, or entry-level salaries in India, managing a finite budget (typically ₹10,000/month) is an uphill battle. The core failure mode is rarely intentional overspending; rather, it is **decision blindness**:
- Not realizing that spending ₹1,500 on Day 8 leaves upcoming hostel bills on Day 12 at risk.
- Treating cash in hand as spendable cash without earmarking recurring subscriptions or savings goals.
- Experiencing unexpected emergencies (laptop repairs, medical bills) without a predefined recovery plan.

**MINTFLOW's Core Philosophy:**  
> *"Every financial decision has a consequence. Understand it before you make it."*

MINTFLOW bridges this gap by decoupling **Available Cash** (money physically in hand) from **Uncommitted Cash** (money truly safe to spend after ring-fencing upcoming bills and locked savings). It provides a real-time, responsive web interface styled with a premium dark fintech aesthetic (#080B12 midnight, #65F5B4 mint green, #55DDF5 cyan, and #A89BFA lavender) designed to make money management visual, intuitive, and stress-free.

---

## ✨ Features in Detail

### 📊 1. Financial Command Center Dashboard
- **Central Overview:** Consolidates live balances, spending velocity, daily allowances, health indicators, and pending obligations into a single view.
- **Cycle Indicator:** Tracks the 30-day timeline with an interactive day stepper (`Day 8 of 30`) that lets users simulate time progression across the month.
- **Contextual Insights:** Dynamically updates recommendations based on observed spending pace, commitment dates, and goal funding levels.

### 🌌 2. Signature Visual Element: The Money Orbit
- **Celestial Cash Flow Model:** Visualizes financial assets as an interactive solar system:
  - **Core Sun:** Represents central available cash (e.g., ₹8,561) and daily safe allowance (₹218/day).
  - **Inner Orbit (95px):** Houses daily spending and today's burn satellites.
  - **Middle Orbit (145px):** Houses fixed commitments and subscriptions (Hostel Wi-Fi, YouTube Premium).
  - **Outer Orbit (195px):** Houses long-term savings satellites (Emergency Cushion, Sony Headphones).
- **Interactive Inspection:** Hovering over any orbital satellite surfaces a glassmorphism pill showing exact rupee amounts, due dates, and necessity tags.

### 🎮 3. Spend Simulator & Decision Lab
- **Split-Screen Sandbox:** Decision builder on the left with continuous numeric slider, preset chips (₹100, ₹250, ₹500, ₹1,000, ₹2,000, ₹3,500), necessity toggles, and category pickers.
- **Before-vs-After Consequence Matrix:** Real-time side-by-side delta metrics for Available Cash, Daily Allowance, Month-End Balance, and Health Score.
- **Contextual Verdict Banner:** Explains whether the proposed action is safe, causes a daily allowance pinch, endangers upcoming bills, or triggers a month-end deficit.
- **Consequence Timeline:** Maps out consequences for Today, the next 7 days, upcoming bill dates, and Day 30 close.
- **Smart Alternatives Engine:** Generates lower-cost value alternatives (e.g., saving 40% upfront), post-bill delayed execution, or subscription offsets.
- **Strict Sandbox Isolation:** Simulations do not mutate committed financial data until explicitly confirmed by the user.

### 🧾 4. Fixed Commitments & Subscription Leakage Engine
- **Upcoming Bill Timeline:** Schedules obligations (Hostel Wi-Fi, Jio 5G, YouTube Premium) chronologically with due-date countdowns.
- **Subscription Leakage Calculator:** Isolates discretionary recurring plans and shows how much daily spending allowance would increase if cancelled.
- **One-Click Bill Settlement:** Marking a reserved bill as paid converts the reservation into an actual expense without double-deduction.

### 🎯 5. Savings Goals & Milestone Progress
- **Earmarked Asset Protection:** Goal contributions transfer funds from uncommitted cash into goal locks without inflating expense analytics.
- **Milestone Celebration:** Visual progress bars with 25%, 50%, 75%, and 100% milestone flags and celebratory confetti effects.
- **Pacing Calculator:** Computes the exact daily contribution required across remaining days to meet target dates.

### 📈 6. Multi-Scenario Forecasting & Strategy Comparison
- **30-Day Cash Trajectory Area Chart:** Visualizes historical spending from Days 1–7 transitioning smoothly into Day 8–30 projections.
- **Three Strategic Models:**
  - **Strategy A (Baseline Pace):** Continues current average daily burn + scheduled bills.
  - **Strategy B (Lean Discipline):** Reduces discretionary variable spend by 35% to maximize surplus.
  - **Strategy C (Goal Booster):** Funnels additional funds into target savings goals.

### 🩺 7. Financial Health Score & Rule-Based Risk Engine
- **Explainable 0–100 Index:** Transparent weighted heuristic scoring discipline, coverage, savings, runway, and resilience.
- **Categorical Risk Tiers:** Grades finances as `Stable`, `Watchful`, `Elevated`, or `Critical`.
- **Top 3 Contributors:** Highlights exact positive or negative drivers with actionable recovery advice.

### 💸 8. Budget Allocation & Transactions Ledger
- **4-Tier Macro Bar:** Compares *Paid Expenses* vs. *Reserved Bills* vs. *Goals Locked* vs. *Free Runway*.
- **Full Ledger:** Search, filter by category/type, add new income or expenses, and delete records with instant recalculation.

---

## 🚦 Startup Modes & Testing Environment

MINTFLOW features **exactly two startup modes** to provide both an immediate demonstration experience for hackathon evaluators and a personalized blank canvas for regular users.

```
                         ┌────────────────────────────────────┐
                         │   MINTFLOW Startup Mode Selector   │
                         └─────────────────┬──────────────────┘
                                           │
                  ┌────────────────────────┴────────────────────────┐
                  ▼                                                 ▼
     🎮 Seeded Demo Mode (Recommended)                    🌱 Clean State Mode
  • Preloaded Day 8 of 30 scenario                   • Day 1 of 30 clean slate
  • ₹1,439 in past student records                   • Full ₹10,000 available & free
  • ₹1,338 reserved upcoming bills                   • ₹333/day baseline allowance
  • ₹2,200 locked in savings goals                   • Empty ledger ready for input
  • Live Money Orbit & Allowance                     • Persistent localStorage
                  │
                  ▼
   🧪 Hackathon Test Lab (Inside Demo)
  • Scenario 1: The Impulse Purchase (₹1,500)
  • Scenario 2: The Unexpected Expense (₹2,000)
  • Scenario 3: The Subscription Cut (₹189)
  • Scenario 4: Future Purchase Planning (₹2,500)
  • Scenario 5: Savings Cushion Allocation (₹2,000)
  • 1-Click Reset to Benchmark State
```

### 🎮 1. Seeded Demo Mode — Hackathon Experience

Seeded Demo Mode is the **recommended experience for hackathons and presentations**. It initializes the user at **Day 8 of 30** in an active financial cycle, simulating a realistic Indian college student's financial life:
- **Starting Budget:** ₹10,000.
- **Days Elapsed:** Days 1–7 with ₹1,439 in recorded transactions (canteen breakfast, Delhi Metro smart card recharge, semester notes photocopy, Swiggy dinner split, Blinkit groceries, Spotify student plan, and movie ticket).
- **Available Cash:** ₹8,561 in hand.
- **Reserved Bills:** ₹1,338 earmarked for upcoming bills (Hostel Wi-Fi ₹800 on Day 12, YouTube Premium ₹189 on Day 18, Jio 5G Split ₹349 on Day 24).
- **Locked Savings:** ₹2,200 saved across 3 goals (Emergency Cushion ₹600, Sony ANC Headphones ₹1,200, Kasol Trek ₹400).
- **Uncommitted Cash:** ₹5,023.
- **Safe Daily Allowance:** **₹218/day** across the remaining 23 days.
- **Initial Health Score:** 78/100 (`Stable`).

Judges do not need to manually input test data; every chart, orbit, timeline, and metric is immediately populated, verified, and interconnected. Seeded data is prominently badged with a **"Demo Profile • Sample Records"** advisory banner to maintain clear educational transparency.

#### 🧪 Hackathon Test Lab — Inside Seeded Demo Mode

Embedded directly within Seeded Demo Mode is the **Hackathon Test Lab**, accessible via the **"Demo Scenarios"** button in the top navigation bar or sidebar. It provides five pre-configured, one-click stress-test scenarios:

| # | Scenario Name | Decision Type | Test Amount | Key Educational Takeaway Tested |
|---|---|---|---|---|
| **1** | **The Impulse Purchase** | Buy Now (Shopping) | ₹1,500 | Demonstrates flexible allowance dropping from ₹218/d to ₹153/d. Generates a 60% value alternative (saving ₹600). |
| **2** | **The Unexpected Expense** | Emergency (Health/Bills) | ₹2,000 | Stress-tests cash runway against cracked laptop repair; verifies available cash still covers the Day 12 hostel bill. |
| **3** | **The Subscription Cut** | Cancel Subscription | ₹189 | Cancels recurring YouTube plan; frees up ₹189 from upcoming bill reservations and boosts daily allowance by +₹8/d. |
| **4** | **Future Purchase Planning** | Buy Now (Education) | ₹2,500 | Tests a planned gear buy when an ₹800 hostel bill is due in 4 days; compares immediate purchase vs. delaying to Day 14. |
| **5** | **Savings Cushion Allocation** | Save for Goal | ₹2,000 | Tests transferring ₹2,000 to Emergency Cushion; confirms remaining uncommitted cash (₹3,023) leaves a safe ₹131/d runway. |

Each scenario opens inside the isolated Spend Simulator where evaluators can tweak amounts, inspect timelines, compare alternatives, test-confirm changes, or reset back to the baseline benchmark in one click.

---

### 🌱 2. Clean State Mode — Start Fresh

Clean State Mode starts the user at **Day 1 of 30** with an empty slate:
- **Starting Budget:** Full ₹10,000 available and uncommitted.
- **Days Elapsed:** Day 1 of 30 (30 days remaining).
- **Transactions:** 0 previous records.
- **Commitments:** 0 scheduled bills.
- **Savings Goals:** 1 default empty goal (Emergency Buffer target ₹2,000, ₹0 saved).
- **Daily Allowance:** **₹333/day** ($\frac{₹10,000}{30}$).
- **Initial Health Score:** 68/100 (`Watchful` — reflects an unfunded emergency buffer on Day 1).

Users can record their own real or hypothetical expenses, create custom recurring bills, set personal savings goals, and track their budget from scratch.

---

### 📊 3. Mode Comparison

| Aspect | 🎮 Seeded Demo Mode | 🌱 Clean State Mode |
|---|---|---|
| **Initial Cycle Day** | Day 8 of 30 (23 days remaining) | Day 1 of 30 (30 days remaining) |
| **Initial Available Cash** | ₹8,561 (after ₹1,439 in past expenses) | Full ₹10,000 starting cash |
| **Uncommitted Spendable Cash** | ₹5,023 (after reserving bills & goals) | Full ₹10,000 uncommitted |
| **Daily Flexible Allowance** | ₹218/day | ₹333/day |
| **Preloaded Transactions** | 7 realistic student expenses (Days 1–7) | 0 (empty ledger) |
| **Preloaded Commitments** | 3 bills (Hostel Wi-Fi, YouTube, Jio 5G) | 0 (user-defined) |
| **Preloaded Goals** | 3 goals with ₹2,200 already funded | 1 goal with ₹0 funded |
| **Hackathon Test Lab** | ✅ 5 one-click guided scenario shortcuts | Available via simulator slider |
| **Primary Audience** | Hackathon evaluators & product judges | Users building their own budget |
| **UI Badge** | Amber "Demo Profile (Seeded)" pill | Mint "Clean Slate (Day 1)" pill |
| **Reset Behavior** | Restores Day 8 seed benchmark | Restores Day 1 clean ₹10,000 state |

---

### 🧭 4. Getting Started With Each Mode

1. **First-Run Modal:** Upon first visiting MINTFLOW, an interactive **"Choose Your Starting Mode"** dialog appears:
   - Click **"Explore Demo"** for the pre-populated Day 8 scenario.
   - Click **"Start Fresh"** for the Day 1 clean slate.
2. **Persistence:** The chosen mode is saved to browser `localStorage` under `MINTFLOW_PROFILE_MODE` and `MINTFLOW_EXPERIENCE_CHOSEN`. Refreshing the page preserves all changes and does not re-prompt.
3. **Switching Modes Anytime:** Users can switch modes at any time by clicking the **"Switch"** button in the sidebar profile card or top navbar.
4. **Mode-Aware Reset:**
   - In Demo Mode: Clicking **"Reset Day 8 Demo"** restores the exact initial Day 8 state.
   - In Clean State Mode: Clicking **"Reset Clean Slate"** restores the pristine Day 1 state.

---

## 🧮 Finance Engine: Mathematics and Logic

The entire application relies on a unified, deterministic mathematical state engine located in [`src/engine/`](file:///c:/my%20files/projects/mintflow/src/engine/). Every card, chart, allowance pill, and forecast derives from this single source of truth.

### Core Balance Equations

#### 1. Total Funds ($F_{total}$)
Total capital available across the cycle:
$$F_{total} = F_{start} + I_{additional}$$
- $F_{start}$: Starting monthly budget (₹10,000).
- $I_{additional}$: Sum of any extra income transactions recorded during the cycle.

#### 2. Available Cash ($C_{avail}$)
Money physically held in accounts or cash in hand:
$$C_{avail} = F_{total} - \sum E_{actual}$$
- $E_{actual}$: Sum of all recorded expense transactions paid to date.
- *Demo Example (Day 8):* $10,000 - 1,439 = \mathbf{₹8,561}$.

#### 3. Unpaid Reserved Commitments ($B_{reserved}$)
Upcoming bills and subscriptions due in the remaining cycle days:
$$B_{reserved} = \sum_{c \in \text{commitments}, \text{status} = \text{'upcoming'}} A_c$$
- *Demo Example (Day 8):* $800 \text{ (Hostel)} + 189 \text{ (YouTube)} + 349 \text{ (Jio)} = \mathbf{₹1,338}$.

#### 4. Unspent Goal Allocations ($G_{locked}$)
Money transferred into savings goals:
$$G_{locked} = \sum_{g \in \text{goals}} S_g$$
- *Demo Example (Day 8):* $600 \text{ (Cushion)} + 1,200 \text{ (Headphones)} + 400 \text{ (Trek)} = \mathbf{₹2,200}$.

#### 5. Uncommitted Cash ($C_{uncommitted}$)
The true flexible spending cushion that is safe to spend:
$$C_{uncommitted} = C_{avail} - B_{reserved} - G_{locked}$$
- *Demo Example (Day 8):* $8,561 - 1,338 - 2,200 = \mathbf{₹5,023}$.

---

### Daily Allowance Calculations

#### Remaining Days in Cycle ($D_{rem}$)
By convention, Day $N$ of a 30-day cycle includes the current day:
$$D_{rem} = \max(30 - D_{current} + 1, 0)$$
- *Demo Example (Day 8):* $30 - 8 + 1 = \mathbf{23\text{ days}}$.

#### Suggested Daily Flexible Allowance ($A_{daily}$)
The maximum amount a user can spend each day without risking bills or goal progress:
$$A_{daily} = \frac{\max(C_{uncommitted}, 0)}{D_{rem}}$$
- *Demo Example (Day 8):* $\frac{5,023}{23} = \mathbf{₹218.39\text{/day}} \approx \mathbf{₹218\text{/day}}$.

#### Alternative Allowance with Goals Paused ($A_{goals\_paused}$)
Daily allowance if the user temporarily pauses goal contributions:
$$A_{goals\_paused} = \frac{\max(C_{avail} - B_{reserved}, 0)}{D_{rem}}$$
- *Demo Example (Day 8):* $\frac{8,561 - 1,338}{23} = \frac{7,223}{23} = \mathbf{₹314\text{/day}}$.

---

### Deterministic Forecast Model

#### Average Observed Daily Spend ($\overline{E}_{daily}$)
$$\overline{E}_{daily} = \frac{\sum E_{actual}}{\max(D_{current} - 1, 1)}$$
- *Demo Example (Day 8):* $\frac{1,439}{7} = \mathbf{₹205.57\text{/day}}$.

#### Projected Month-End Balance ($P_{balance}$)
$$P_{balance} = \text{round}\left(C_{avail} - B_{reserved} - (\overline{E}_{daily} \times D_{rem})\right)$$
- *Demo Example (Day 8):* $8,561 - 1,338 - (205.57 \times 23) = 7,223 - 4,728.11 = \mathbf{+₹2,495}$ (safe surplus).

---

### Financial Health Score Heuristic (0–100)

The Financial Health Score is a transparent heuristic composite (not an official credit bureau score) combining five weighted factors:

$$Score_{raw} = (S_{budget} \times 0.30) + (S_{commit} \times 0.25) + (S_{goals} \times 0.20) + (S_{runway} \times 0.15) + (S_{resilience} \times 0.10)$$

1. **Budget Discipline (30% weight):**  
   Compares $\overline{E}_{daily}$ against the sustainable daily budget pace ($\frac{F_{start}}{30} = ₹333.33/\text{day}$).
   - If $\overline{E}_{daily} \le ₹333.33$: $S_{budget} = 95$.
   - If spending exceeds sustainable pace by $> 50\%$: score penalizes down to 20.
2. **Commitment Coverage (25% weight):**  
   Measures coverage ratio $\frac{C_{avail}}{B_{reserved}}$.
   - If ratio $\ge 1.5$: $S_{commit} = 100$.
   - If ratio $< 1.0$ (bills exceed cash): $S_{commit} = \max(0, \text{ratio} \times 60)$.
3. **Savings Progress (20% weight):**  
   Measures ratio of total saved vs. total targets: $\frac{G_{locked}}{G_{targets}} \times 100$.
4. **Cash Runway (15% weight):**  
   Measures runway days $R = \lfloor \frac{C_{avail}}{\overline{E}_{daily}} \rfloor$ against $D_{rem}$.
   - If $R \ge D_{rem}$: $S_{runway} = 95$.
5. **Emergency Resilience (10% weight):**  
   Measures emergency cushion vs. target: $\frac{S_{emergency}}{T_{emergency}} \times 100$.

> **Deficit Override:** If $P_{balance} < 0$, $Score_{raw}$ is clamped to a maximum of **42**, reflecting imminent cycle shortfall.

---

### Risk Classification Tiers

| Level | Condition Criteria | UI Styling | Meaning |
|---|---|---|---|
| **Critical** | $P_{balance} < 0$ OR $C_{avail} < B_{reserved}$ OR $Score < 45$ | Coral (`#FF777D`) | Imminent deficit; bills endangered |
| **Elevated** | $Score < 65$ OR $C_{uncommitted} < ₹1,000$ | Amber (`#FFC66D`) | Buffer eroded; high discretionary burn |
| **Watchful** | $Score < 78$ OR $A_{daily} < ₹150$ | Cyan (`#55DDF5`) | Pacing is tight; monitor daily buys |
| **Stable** | $Score \ge 78$ AND $P_{balance} > 0$ AND Coverage $\ge 100\%$ | Mint (`#65F5B4`) | In control; healthy runway and surplus |

---

### Accounting Rules & Invariants

1. **No Double Deduction on Commitments:** Reserved bills are *earmarked*, not subtracted from Available Cash. When marked as paid, the reservation converts into an actual expense. Cash decreases by the bill amount, reserved obligations decrease by the same amount, and **Uncommitted Cash remains unchanged**.
2. **Goal Transfers Are Not Consumption Debt:** Contributing to a savings goal transfers cash into a locked asset. Available Cash remains constant, Uncommitted Cash decreases, and spending analytics do not treat the transfer as an expense.
3. **Strict Simulation Isolation:** The simulator clones the state using `JSON.parse(JSON.stringify(state))`. No mutations occur until the user explicitly commits.

---

## 🎮 Interactive Simulations & Decision Lab

The Spend Simulator provides a sandbox environment for testing 10 distinct decision types:

```
Proposed Decision ──► [Deep Clone State] ──► [Recalculate Metrics] ──► [Synthesize Deltas]
                                                                               │
                 ┌─────────────────────────────────────────────────────────────┘
                 ▼
     ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
     │ Before vs After Delta │   │   Decision Verdict    │   │  Smart Alternatives   │
     │  • Cash: -₹1,500      │   │  • Safe / Pinch Alert │   │  • Pick 60% value     │
     │  • Allowance: -₹65/d  │   │  • Deficit Alert      │   │  • Delay post-bill    │
     │  • Score: -4 pts      │   │  • Sub Free-up        │   │  • Cancel offset sub  │
     └───────────────────────┘   └───────────────────────┘   └───────────────────────┘
                 │
                 ├────────► Keep Exploring (Discard Sandbox)
                 └────────► Confirm Decision (Commit to Real State + Confetti)
```

---

## 🛠️ Technology Stack

| Technology | Version | Purpose in MINTFLOW | Rationale |
|---|---|---|---|
| **React** | `^19.2.8` | Component architecture & reactive UI | Latest declarative component model |
| **TypeScript** | `~6.0.2` | Type-safe financial data contracts & engine | Prevents arithmetic & runtime schema errors |
| **Vite** | `^8.3.0` | Build tool, dev server, and bundler | Instant HMR and sub-second asset bundling |
| **Tailwind CSS** | `^3.4.17` | Utility-first styling & custom fintech palette | Custom tokens (#080B12, mint, cyan, lavender) |
| **Framer Motion** | `^14.1.0` | UI animations, orbital rotations & transitions | Fluid spring physics and smooth number changes |
| **Recharts** | `^3.10.1` | Financial area forecasts & donut charts | Responsive SVG rendering for financial curves |
| **Lucide React** | `^1.55.0` | Visual icon system | Consistent, lightweight iconography |
| **Canvas Confetti**| `^1.9.4` | Milestone and confirmation celebration | Dopamine feedback for positive financial moves |
| **Vitest** | `^5.0.3` | Unit testing framework | Sub-second testing of financial engine formulas |

---

## 🏗️ Architecture and Code Organization

```
mintflow/
├── public/
│   └── screenshots/               # 8 verified walkthrough screenshots
│       ├── 0) startup mode.png
│       ├── 1) overview  dashboard.png
│       ├── 2) spend simulator.png
│       ├── 3) budget allocation and records.png
│       ├── 4) savings goals.png
│       ├── 5) commitments and subscriptions.png
│       ├── 6) health and forecasts.png
│       └── 7) hackathon test lab.png
├── src/
│   ├── components/                # Reusable UI widgets and dialogs
│   │   ├── AddTransactionModal.tsx       # Record income or expense modal
│   │   ├── BalanceHeroCard.tsx           # Cash in hand vs. uncommitted card
│   │   ├── DailyAllowanceCard.tsx        # Daily allowance & 7-day velocity
│   │   ├── ExperienceSelectorModal.tsx   # Startup mode chooser (Demo vs. Fresh)
│   │   ├── GuidedDemoModal.tsx           # 5-scenario hackathon test lab
│   │   ├── HealthScoreCard.tsx           # Radial 0-100 health score widget
│   │   ├── MoneyOrbit.tsx                # Signature celestial cash orbit
│   │   ├── Navbar.tsx                    # Top bar with cycle & profile pills
│   │   ├── OnboardingModal.tsx           # 4-step skippable welcome tour
│   │   ├── RecentActivityWidget.tsx      # Filterable transaction feed
│   │   ├── SavingsGoalsWidget.tsx        # Goals milestone cards
│   │   ├── Sidebar.tsx                   # Collapsible desktop navigation
│   │   ├── SpendingDonutChart.tsx        # Category breakdown chart
│   │   ├── SpendSimulatorView.tsx        # Split-screen decision laboratory
│   │   └── UpcomingCommitmentsWidget.tsx # Chronological bill timeline
│   ├── context/
│   │   └── FinancialContext.tsx          # Central state, reducers & persistence
│   ├── engine/                    # Pure deterministic financial math
│   │   ├── currency.ts                   # INR formatting (Indian numbering system)
│   │   ├── financialEngine.test.ts       # Vitest suite (7 unit tests)
│   │   ├── financialEngine.ts            # Balance, allowance & category math
│   │   ├── forecastEngine.ts             # 30-day multi-scenario projections
│   │   ├── insightsEngine.ts             # Rule-based contextual insight alerts
│   │   ├── riskEngine.ts                 # 5-factor weighted health & risk tiers
│   │   ├── scenarioEngine.ts             # What-if simulation & alternatives
│   │   ├── seedData.ts                   # Day 8 Demo & Day 1 Fresh state seeds
│   │   ├── storage.ts                    # Versioned localStorage management
│   │   └── types.ts                      # Core TypeScript domain models
│   ├── pages/                     # Primary top-level route views
│   │   ├── BudgetActivityPage.tsx        # Budget anatomy bar & full ledger
│   │   ├── CommitmentsPage.tsx           # Subscriptions & leakage calculator
│   │   ├── FinancialHealthPage.tsx       # Risk diagnostics & scenario curves
│   │   ├── GoalsPage.tsx                 # Savings goals manager & pacing
│   │   ├── OverviewPage.tsx              # Command center hero view
│   │   └── SimulatorPage.tsx             # Full-page decision testing lab
│   ├── App.tsx                    # Root layout, routing & global modals
│   ├── index.css                  # Custom glassmorphism, scrollbars & tokens
│   └── main.tsx                   # React DOM entry point
├── package.json                   # Dependencies, scripts and metadata
├── tailwind.config.js             # Theme extensions, palettes & keyframes
├── tsconfig.app.json              # TypeScript application compiler config
└── vite.config.ts                 # Vite bundler configuration
```

---

## 💻 Installation and Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or later (v20+ or v24+ recommended).
- **npm:** v9.0.0 or later.

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/RahulBansal-24/MintFlow.git

# 2. Enter project directory
cd MintFlow

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will be available at **`http://localhost:5173/`**.

### Available Scripts

```bash
# Start local dev server with HMR
npm run dev

# Run Vitest financial engine unit test suite
npx vitest run

# Run production TypeScript compile and Vite build
npm run build

# Preview production build locally
npm run preview
```

---

## 🧑‍💻 How to Use MINTFLOW

1. **Select Your Mode:** When opening MINTFLOW, choose **"Explore Demo"** to evaluate the Day 8 scenario or **"Start Fresh"** to begin Day 1 with ₹10,000.
2. **Read the Command Center:**
   - Check **Total Available Cash** (in hand) vs. **Free Runway** (uncommitted).
   - Review your **Daily Safe Allowance** (e.g., ₹218/day).
3. **Inspect the Money Orbit:** Hover over satellites in the celestial model to view upcoming commitments and savings satellites.
4. **Test a Decision:** Click **"Simulate Move"** or open the **Spend Simulator**:
   - Drag the slider to test a purchase (e.g., ₹1,500).
   - Review the Before vs. After matrix, verdict, and smart alternatives.
   - Click **"Confirm Decision"** to commit it or **"Keep Exploring"** to discard.
5. **Manage Commitments & Subscriptions:** Navigate to **Commitments & Subs** to view upcoming due dates, inspect subscription leakage, or mark bills as paid.
6. **Track Goals:** Navigate to **Savings Goals** to add funds (+₹250) or create a new savings milestone.
7. **Evaluate Health & Forecasts:** Navigate to **Health & Forecasts** to inspect the 30-day projection curves across Optimistic, Expected, and Conservative models.
8. **Try Hackathon Demo Scenarios:** Click **"Demo Scenarios"** in the top navigation bar to test any of the 5 guided evaluation scenarios.

---

## 📸 Screenshots and Visual Walkthrough

### 1. Dual Startup Mode Selector

![Startup Mode Selection](<public/screenshots/0) startup mode.png>)

*Fig. 1: First-run experience selector offering the recommended Day 8 Seeded Demo Mode for hackathon evaluation and the Day 1 Clean Slate Mode for custom budgeting.*

### 2. Financial Command Center Overview

![Overview Dashboard](<public/screenshots/1) overview  dashboard.png>)

*Fig. 2: The primary command center displaying the active Day 8 cycle banner, central Money Orbit celestial visualization, Available Cash hero card, and Daily Safe Allowance.*

### 3. Spend Simulator & Decision Lab

![Spend Simulator](<public/screenshots/2) spend simulator.png>)

*Fig. 3: Interactive split-screen decision laboratory showing a ₹400 goal transfer simulation with before vs. after deltas, consequence timeline, and confirmed sandbox isolation.*

### 4. Budget Allocation Anatomy & Activity Records

![Budget Allocation and Records](<public/screenshots/3) budget allocation and records.png>)

*Fig. 4: 4-tier macro budget allocation bar comparing Paid Expenses (14%), Bills Reserved (13%), Goals Locked (22%), and Free Runway (51%), followed by the searchable transactions ledger.*

### 5. Savings Goals & Milestone Tracking

![Savings Goals](<public/screenshots/4) savings goals.png>)

*Fig. 5: Dedicated savings roadmaps for Emergency Cushion, Sony ANC Headphones, and Kasol Trek with milestone completion notches (25%, 50%, 75%, 100%) and daily pacing requirements.*

### 6. Fixed Commitments & Subscription Leakage

![Commitments and Subscriptions](<public/screenshots/5) commitments and subscriptions.png>)

*Fig. 6: Chronological bill schedule with due countdowns, one-click payment settlement, and the Subscription Leakage Engine calculating recurring savings opportunities.*

### 7. Financial Health Diagnostics & 30-Day Forecasts

![Health and Forecasts](<public/screenshots/6) health and forecasts.png>)

*Fig. 7: Multi-scenario 30-day cash balance area curves (Optimistic, Expected, Conservative) and comparative analysis across Baseline, Lean Discipline, and Goal Booster strategies.*

### 8. Hackathon Test Lab

![Hackathon Test Lab](<public/screenshots/7) hackathon test lab.png>)

*Fig. 8: The 5-scenario guided hackathon testing lab providing instant one-click simulations for impulse buys, emergencies, subscription cuts, gear planning, and cushion funding.*

---

## 📊 Example Financial Scenario

Consider a student in **Seeded Demo Mode (Day 8 of 30)**:
- **Available Cash:** ₹8,561
- **Reserved Bills:** ₹1,338 (due on Days 12, 18, 24)
- **Locked Savings:** ₹2,200
- **Uncommitted Cash:** ₹5,023
- **Remaining Days:** 23
- **Daily Safe Allowance:** **₹218/day** ($\frac{5,023}{23}$)

The student is tempted by an **impulse purchase of wireless earbuds for ₹1,500**:
1. **Simulation Execution:**
   - New Available Cash: $8,561 - 1,500 = \mathbf{₹7,061}$.
   - New Uncommitted Cash: $5,023 - 1,500 = \mathbf{₹3,523}$.
   - New Daily Allowance: $\frac{3,523}{23} = \mathbf{₹153/day}$ (a **-₹65/day** drop).
   - Month-End Projected Balance: drops by ₹1,500.
   - Health Score: drops from 78 to 74 pts (`Watchful`).
2. **Simulator Feedback:**
   - **Verdict:** *"Pinch Alert: Tight Daily Spending Allowance. Your flexible daily allowance drops from ₹218 to ₹153/day."*
   - **Smart Alternative:** *"Pick Value Edition (₹900 instead of ₹1,500). Saves ₹600 upfront and keeps your daily allowance at ₹179/day."*
3. **Outcome:** The student tests the value edition, sees that ₹179/day is manageable, and commits with full awareness rather than facing a week-three cash shortfall.

---

## 🔐 Data Persistence and Privacy

- **Local-First Architecture:** All data is persisted exclusively in the client's browser using versioned `localStorage` under keys `MINTFLOW_V1_FINANCIAL_STATE`, `MINTFLOW_PROFILE_MODE`, and `MINTFLOW_EXPERIENCE_CHOSEN`.
- **Zero Network Transmission:** No personal data, transaction entries, or simulation results are transmitted to external servers.
- **Privacy by Design:** MINTFLOW never requests, processes, or stores real bank credentials, account numbers, or PAN/Aadhaar data.
- **Device Limitations:** Data stored in `localStorage` does not sync between different browsers or devices. Clearing browser storage will reset the profile.

---

## 🌐 Deployment

MINTFLOW is configured as a single-page client-side application fully compatible with **Vercel**, **Netlify**, or **GitHub Pages**:

### Vercel Deployment Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Client routing and static assets are self-contained without requiring edge functions or server middleware.

---

## 🎯 Use Cases

1. **Student Monthly Budgeting:** Managing fixed monthly pocket money (₹10,000) across canteen food, metro travel, and study stationery.
2. **Impulse Purchase Check:** Previewing the long-term impact of a sale or weekend buy before committing.
3. **Subscription Auditing:** Identifying discretionary monthly subscriptions (OTT, streaming) and calculating their annualized drag.
4. **Emergency Preparedness:** Stress-testing sudden laptop, mobile, or medical repairs against upcoming bill deadlines.
5. **Goal Runway Planning:** Visualizing the daily sacrifice required to afford aspirational gadgets or travel.

---

## ⚖️ Limitations and Assumptions

- **Fixed 30-Day Cycle:** The current prototype models a fixed 30-day budget window. Custom multi-month or weekly cycles are not currently supported.
- **Heuristic Health Score:** The 0–100 Financial Health Score is an educational heuristic model designed for budget awareness, not an accredited credit rating or underwriting model.
- **Manual Input:** Transactions and commitments are recorded manually or generated from the seed data; automated bank feeds are intentionally omitted for privacy.

---

## 🔮 Future Scope

- **Exportable Reports:** One-click PDF/CSV monthly budget summaries and spending audits.
- **Multi-Cycle Support:** Rolling calendar budgeting across multiple consecutive months.
- **Custom Budget Limits:** Configurable baseline budgets (₹5,000, ₹15,000, ₹25,000) for different user segments.
- **Offline PWA Support:** Service worker caching for full offline accessibility on mobile devices.
- **SMS/UPI Receipt Parser:** Privacy-preserving on-device regex parser to auto-fill transaction amounts from local notification text.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository: `https://github.com/RahulBansal-24/MintFlow`
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Your Changes:**
   ```bash
   git commit -m "feat: add descriptive feature"
   ```
4. **Run Verification:** Ensure tests and builds pass:
   ```bash
   npm run build
   npx vitest run
   ```
5. **Push and Open a Pull Request:** Push to your fork and open a PR against the `main` branch.

---

## 👨‍💻 Author

**Rahul Bansal**  
- **GitHub:** [@RahulBansal-24](https://github.com/RahulBansal-24)  
- **Project Repository:** [https://github.com/RahulBansal-24/MintFlow](https://github.com/RahulBansal-24/MintFlow)

---

## 🙌 Acknowledgements and License

- Built with React, Vite, Tailwind CSS, Framer Motion, and Recharts.
- Developed for the vibe-coding fintech hackathon to pioneer intuitive personal finance modeling for Gen Z.
- **License:** This repository currently has no specified open-source license. All rights are reserved by the author.

---

## ✨ Closing

> **MINTFLOW — Your Money. Your Moves.**  
> *Make every rupee count. Model the future before you spend.* 🌟
