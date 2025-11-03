# Blue Lock Ledger

**A mythic Wall Street running on rhythm, reciprocity, and ritual law**

The Blue Lock Ledger is the economic layer of the EVOLVERSE — a multi-tier economic simulation system that combines:

1. **Rain Yield** — Economic doctrine with anti-inflation rules
2. **EVOL X/Y Tachometer** — Axis/vowel sensor system for player input
3. **PPPPI Sealed Layers** — Sectoral codex with ritual-law statements

## System Overview

### Three Pillars

#### 1. Rain Yield Economic Doctrine

- **Yield Law**: Only reciprocal yield credits the ledger unless destined for harvest
- **Quarter Checkpoints**: 225, 504 (with Half-Yield Window)
- **Temporal Trading Gates**: 48-tick Quarter Lattice
- **Dynamic Pricing**: Time fractions → dB yields → coin conversion

#### 2. EVOL X/Y Tachometer

Four axes define the sensor system:

- **X = Seal**: Containment and binding force
- **Y = Reveal**: Disclosure and manifestation power
- **Z = Depth**: Penetration and understanding level
- **W = Will**: Intentional force and determination

Vowel weights (A-E-I-O-U-Y) modulate state and connect to economic sectors.

**RPM Calculation**: `(X + Y + Z + W) / 4`  
**φ-Boost**: `rpm × (1 + (vowelSum / 6) × 0.618)` (golden ratio multiplier)

#### 3. PPPPI Sealed Layers

Six economic sectors with ritual-law statements:

| Sector    | Ticker | Ritual Law                          |
| --------- | ------ | ----------------------------------- |
| Energy    | ENRG   | "All energy converted into coin"    |
| Transport | TRNS   | "Movement is commerce"              |
| Meds      | MEDS   | "Healing is wealth"                 |
| Weapons   | WPNS   | "Force yields value"                |
| Puzzle    | PZLE   | "Solutions unlock capital"          |
| Knowledge | KNWL   | "Information is the prime currency" |

### Quadrant Structure

**Four Regions × 12 Conferences = 48 Conferences**

Aligns to the 48-tick Quarter Lattice from "Gathering of the Four":

1. **Ember Quadrant** (Jetah) — Energy dominant
2. **Tide Quadrant** (Aquila) — Meds dominant
3. **Terra Quadrant** (Gaia) — Transport dominant
4. **Aether Quadrant** (Zephyr) — Knowledge dominant

Each hero's FlameCard/Relic acts as an authentication token and node key for ledger access.

### E-Soil Lots

Tokenized real-estate analogs denominated in reciprocal yield units rather than static tokens. Each lot:

- Belongs to a specific region and conference
- Accumulates yield based on sector activity
- Can be traded between holders
- Has a transaction history on the ledger

## Data Flow

```
Player Input → Tachometer (Axes + Vowels) → RPM/φ-Boost
                    ↓
              Reciprocal Yield → Price Signal
                    ↓
              PPPPI Sector → Market Category
                    ↓
              Transaction → Ledger Entry
                    ↓
              Export to CSV / Chain Call
```

## Usage

### Initialize the Ledger

```typescript
import { initializeBlueLockLedger } from "./lib/ledger.js";

const ledgerState = initializeBlueLockLedger();
```

### Create a Transaction

```typescript
import { createTransaction } from "./lib/ledger.js";

const transaction = createTransaction(
  "yield", // type: 'yield' | 'trade' | 'harvest' | 'ritual'
  "ENERGY", // sector
  100, // amount
  0.25, // timeFraction for pricing
  "Jetah", // from
  "Ledger", // to
);
```

### Generate Dashboard

```typescript
import { generateDashboardData } from "./lib/ledger.js";

const dashboard = generateDashboardData(
  tachometerState,
  recentTransactions,
  eSoilLots,
);
```

### Export Data

```typescript
import { exportLedgerToCSV } from "./lib/ledger.js";
import { generateLedgerSchema, exportSchemaToJSON } from "./lib/schema.js";

// Export to CSV
const csv = exportLedgerToCSV(ledgerState.ledgerEntries);

// Export to JSON schema
const schema = generateLedgerSchema(ledgerState);
const json = exportSchemaToJSON(schema);
```

## Scripts

### Generate Dashboard

Generate a complete meta-stock dashboard with sample data:

```bash
npm run blue-lock-dashboard
```

This creates three output files in `src/blue-lock-ledger/output/`:

1. `blue-lock-ledger-schema.json` — Complete system schema
2. `ledger-entries.csv` — All ledger transactions
3. `dashboard-summary.json` — Dashboard metrics and summary

## Game Branch Integration

Each game branch runs on the same Blue Lock Ledger mechanics:

- **Gladiator School** → Fights become transactions (modulates W axis)
- **BlueBots** → Repairs become rituals (affects Z axis)
- **Dr. Sosa** → Healing becomes yield (boosts Y axis)

Every fight, ritual, or repair is a transaction on the Blue Lock Ledger.

## Types

See `types/index.ts` for complete TypeScript definitions including:

- `TachometerState` — Axes, vowels, RPM, φ-Boost
- `Transaction` — Ledger transactions
- `LedgerEntry` — Complete ledger record
- `ESoilLot` — Tokenized real-estate
- `SectorTicker` — Market sector data
- `BlueLockLedgerState` — Complete system state

## Data Files

- `data/rain-yield.json` — Yield law and reciprocal curve
- `data/ppppi-layers.json` — Sector definitions and ritual laws
- `data/tachometer.json` — Axes, vowels, and sensor configuration
- `data/quadrants.json` — Four Regions and FlameCard definitions

## Architecture

```
blue-lock-ledger/
├── lib/
│   ├── ledger.ts        # Core ledger logic
│   └── schema.ts        # JSON schema generation
├── types/
│   └── index.ts         # TypeScript type definitions
├── data/
│   ├── rain-yield.json  # Economic doctrine
│   ├── ppppi-layers.json# Sector definitions
│   ├── tachometer.json  # Sensor configuration
│   └── quadrants.json   # Four Regions structure
├── scripts/
│   └── generate-dashboard.ts  # Dashboard generator
└── output/              # Generated exports (CSV, JSON)
```

## Future Extensions

- Solidity smart contract version for on-chain deployment
- Real-time WebSocket updates for live trading
- Advanced sector interaction matrix calculations
- Player-vs-player E-Soil lot auctions
- Historical yield analysis and forecasting
- Multi-realm synchronization protocols

---

**Version**: 1.0.0  
**Status**: Initial Implementation  
**License**: MIT / CC-BY-4.0 (dual-licensed with parent repository)
