/**
 * Blue Lock Ledger Schema
 * JSON structure uniting quadrant structure, Rain Yield, and PPPPI layer fields
 * into tradeable yield objects
 */

import type { BlueLockLedgerState, ESoilLot, LedgerEntry, EconomicSector } from '../types/index.js'

/**
 * Complete ledger schema for JSON export/import
 */
export interface LedgerSchema {
  version: string
  timestamp: number
  metadata: {
    system: string
    description: string
    economicModel: string
  }
  yieldLaw: {
    name: string
    antiInflationRule: string
    reciprocalYieldCredits: boolean
    harvestDestination: boolean
  }
  quadrants: Array<{
    id: number
    name: string
    heroName: string
    conferences: number[]
    dominantSector: EconomicSector
    regionalLaw: string
  }>
  sectors: Array<{
    id: EconomicSector
    name: string
    ritualLaw: string
    ticker: string
    baseValue: number
    volatility: number
  }>
  tachometer: {
    axes: {
      X: { name: string; description: string }
      Y: { name: string; description: string }
      Z: { name: string; description: string }
      W: { name: string; description: string }
    }
    vowels: {
      A: { weight: number; affinity: string }
      E: { weight: number; affinity: string }
      I: { weight: number; affinity: string }
      O: { weight: number; affinity: string }
      U: { weight: number; affinity: string }
      Y: { weight: number; affinity: string }
    }
    rpmFormula: string
    phiBoostFormula: string
  }
  reciprocalYieldCurve: Array<{
    timeFraction: number
    decibelYield: number
    coinValue: number
    intervalName: string
  }>
  ledgerEntries: LedgerEntry[]
  eSoilLots: ESoilLot[]
}

/**
 * Tradeable yield object schema
 */
export interface TradeableYieldObject {
  id: string
  type: 'e-soil' | 'sector-token' | 'yield-credit'
  name: string
  symbol: string
  value: number
  yieldUnits: number
  metadata: {
    sector?: EconomicSector
    region?: number
    conference?: number
    quadrant?: string
    ritualLaw?: string
    lastYield?: number
    nextYieldWindow?: number
  }
  transferable: boolean
  owner: string
  created: number
  lastTransaction: number
}

/**
 * Generate complete schema from ledger state
 */
export function generateLedgerSchema(state: BlueLockLedgerState): LedgerSchema {
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    metadata: {
      system: 'Blue Lock Ledger',
      description:
        'Multi-tier economic simulation for EVOLVERSE - Mythic Wall Street running on rhythm, reciprocity, and ritual law',
      economicModel: 'Reciprocal Yield + Tachometer Sensor + PPPPI Sectoral Codex',
    },
    yieldLaw: {
      name: 'Rain Yield — Anchor One-Pager',
      antiInflationRule: state.yieldLaw.antiInflationRule,
      reciprocalYieldCredits: state.yieldLaw.reciprocalYieldCredits,
      harvestDestination: state.yieldLaw.harvestDestination,
    },
    quadrants: state.quadrants.map((q) => ({
      id: q.id,
      name: q.name,
      heroName: q.heroRelic.heroName,
      conferences: q.conferences,
      dominantSector: q.dominantSector,
      regionalLaw: `${q.dominantSector} dominates in ${q.name}`,
    })),
    sectors: [
      {
        id: 'ENERGY' as EconomicSector,
        name: 'Energy',
        ritualLaw: 'All energy converted into coin',
        ticker: 'ENRG',
        baseValue: 100,
        volatility: 0.15,
      },
      {
        id: 'TRANSPORT' as EconomicSector,
        name: 'Transport',
        ritualLaw: 'Movement is commerce',
        ticker: 'TRNS',
        baseValue: 85,
        volatility: 0.12,
      },
      {
        id: 'MEDS' as EconomicSector,
        name: 'Meds',
        ritualLaw: 'Healing is wealth',
        ticker: 'MEDS',
        baseValue: 120,
        volatility: 0.08,
      },
      {
        id: 'WEAPONS' as EconomicSector,
        name: 'Weapons',
        ritualLaw: 'Force yields value',
        ticker: 'WPNS',
        baseValue: 150,
        volatility: 0.25,
      },
      {
        id: 'PUZZLE' as EconomicSector,
        name: 'Puzzle',
        ritualLaw: 'Solutions unlock capital',
        ticker: 'PZLE',
        baseValue: 95,
        volatility: 0.18,
      },
      {
        id: 'KNOWLEDGE' as EconomicSector,
        name: 'Knowledge',
        ritualLaw: 'Information is the prime currency',
        ticker: 'KNWL',
        baseValue: 110,
        volatility: 0.1,
      },
    ],
    tachometer: {
      axes: {
        X: { name: 'Seal', description: 'Containment and binding force' },
        Y: { name: 'Reveal', description: 'Disclosure and manifestation power' },
        Z: { name: 'Depth', description: 'Penetration and understanding level' },
        W: { name: 'Will', description: 'Intentional force and determination' },
      },
      vowels: {
        A: { weight: 1.0, affinity: 'Energy' },
        E: { weight: 0.9, affinity: 'Knowledge' },
        I: { weight: 0.85, affinity: 'Puzzle' },
        O: { weight: 1.1, affinity: 'Meds' },
        U: { weight: 0.95, affinity: 'Transport' },
        Y: { weight: 1.05, affinity: 'Weapons' },
      },
      rpmFormula: '(X + Y + Z + W) / 4',
      phiBoostFormula: 'rpm * (1 + (vowelSum / 6) * 0.618)',
    },
    reciprocalYieldCurve: [
      { timeFraction: 0.125, decibelYield: 18.0, coinValue: 180, intervalName: '1/8 cycle' },
      { timeFraction: 0.25, decibelYield: 12.0, coinValue: 120, intervalName: '1/4 cycle' },
      { timeFraction: 0.5, decibelYield: 6.0, coinValue: 60, intervalName: '1/2 cycle' },
      { timeFraction: 1.0, decibelYield: 0.0, coinValue: 10, intervalName: 'Full cycle' },
    ],
    ledgerEntries: state.ledgerEntries,
    eSoilLots: state.eSoilLots,
  }
}

/**
 * Create a tradeable yield object from E-Soil lot
 */
export function createTradeableFromESoil(
  lot: ESoilLot,
  quadrantName: string,
): TradeableYieldObject {
  return {
    id: lot.id,
    type: 'e-soil',
    name: `E-Soil Lot ${lot.id}`,
    symbol: lot.id,
    value: lot.yieldUnits * 10,
    yieldUnits: lot.yieldUnits,
    metadata: {
      region: lot.region,
      conference: lot.conference,
      quadrant: quadrantName,
      lastYield:
        lot.transactionHistory.length > 0
          ? lot.transactionHistory[lot.transactionHistory.length - 1].timestamp
          : 0,
    },
    transferable: true,
    owner: lot.owner,
    created: lot.transactionHistory[0]?.timestamp || Date.now(),
    lastTransaction:
      lot.transactionHistory.length > 0
        ? lot.transactionHistory[lot.transactionHistory.length - 1].timestamp
        : Date.now(),
  }
}

/**
 * Create a tradeable yield object from sector position
 */
export function createTradeableFromSector(
  sector: EconomicSector,
  yieldUnits: number,
  owner: string,
  ritualLaw: string,
): TradeableYieldObject {
  return {
    id: `SECTOR-${sector}-${Date.now()}`,
    type: 'sector-token',
    name: `${sector} Sector Token`,
    symbol: `${sector.substring(0, 4).toUpperCase()}`,
    value: yieldUnits * 5,
    yieldUnits,
    metadata: {
      sector,
      ritualLaw,
    },
    transferable: true,
    owner,
    created: Date.now(),
    lastTransaction: Date.now(),
  }
}

/**
 * Export schema to JSON string
 */
export function exportSchemaToJSON(schema: LedgerSchema): string {
  return JSON.stringify(schema, null, 2)
}

/**
 * Validate ledger schema structure
 */
export function validateSchema(data: unknown): data is LedgerSchema {
  if (typeof data !== 'object' || data === null) return false

  const schema = data as Partial<LedgerSchema>

  return (
    typeof schema.version === 'string' &&
    typeof schema.timestamp === 'number' &&
    schema.metadata !== undefined &&
    schema.yieldLaw !== undefined &&
    Array.isArray(schema.quadrants) &&
    Array.isArray(schema.sectors) &&
    schema.tachometer !== undefined &&
    Array.isArray(schema.reciprocalYieldCurve) &&
    Array.isArray(schema.ledgerEntries) &&
    Array.isArray(schema.eSoilLots)
  )
}
