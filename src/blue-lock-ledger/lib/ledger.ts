/**
 * Blue Lock Ledger - Core Implementation
 * Hybrid economic system combining ritual yield law, axis/vowel sensor system, and sectoral codex
 */

import type {
  BlueLockLedgerState,
  DashboardData,
  ESoilLot,
  LedgerEntry,
  Quadrant,
  ReciprocalYieldCurve,
  SectorTicker,
  TachometerState,
  Transaction,
  YieldWindow,
  EconomicSector,
} from '../types/index.js'

import rainYieldData from '../data/rain-yield.json'
import ppppiLayersData from '../data/ppppi-layers.json'
import quadrantsData from '../data/quadrants.json'

/**
 * Simple seeded random number generator for deterministic behavior
 * Uses mulberry32 algorithm
 */
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    let t = (this.seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Global seeded random instance (can be re-seeded for tests)
let seededRandom: SeededRandom | null = null

/**
 * Set seed for deterministic random generation (useful for testing)
 */
export function setRandomSeed(seed: number): void {
  seededRandom = new SeededRandom(seed)
}

/**
 * Get random number (uses seeded random if available, otherwise Math.random)
 */
function getRandom(): number {
  return seededRandom ? seededRandom.next() : Math.random()
}

/**
 * Calculate RPM from tachometer axes
 */
export function calculateRPM(axes: { X: number; Y: number; Z: number; W: number }): number {
  return (axes.X + axes.Y + axes.Z + axes.W) / 4
}

/**
 * Calculate φ-Boost (Phi-Boost) using golden ratio
 */
export function calculatePhiBoost(
  rpm: number,
  vowels: { A: number; E: number; I: number; O: number; U: number; Y: number },
): number {
  const vowelSum = vowels.A + vowels.E + vowels.I + vowels.O + vowels.U + vowels.Y
  const goldenRatio = 0.618
  return rpm * (1 + (vowelSum / 6) * goldenRatio)
}

/**
 * Get reciprocal yield curve for dynamic pricing
 */
export function getReciprocalYieldCurve(): ReciprocalYieldCurve[] {
  return rainYieldData.reciprocalYieldCurve.map((entry) => ({
    timeFraction: entry.timeFraction,
    decibelYield: entry.decibelYield,
    coinValue: entry.coinValue,
  }))
}

/**
 * Calculate coin value based on time fraction
 */
export function calculateCoinValue(timeFraction: number): number {
  const curve = getReciprocalYieldCurve()
  // Find closest match or interpolate
  for (let i = 0; i < curve.length - 1; i++) {
    if (timeFraction <= curve[i].timeFraction) {
      return curve[i].coinValue
    }
    if (timeFraction > curve[i].timeFraction && timeFraction <= curve[i + 1].timeFraction) {
      // Linear interpolation
      const ratio =
        (timeFraction - curve[i].timeFraction) / (curve[i + 1].timeFraction - curve[i].timeFraction)
      return curve[i].coinValue + ratio * (curve[i + 1].coinValue - curve[i].coinValue)
    }
  }
  return curve[curve.length - 1].coinValue
}

/**
 * Get current yield window based on quarter lattice tick
 */
export function getCurrentYieldWindow(tick: number): YieldWindow {
  const now = Date.now()
  const isHalfYield = tick >= 23 && tick <= 35 // Around checkpoint 504

  return {
    quarterCheckpoint: tick < 12 ? 225 : 504,
    isHalfYield,
    startTime: now - 3600000, // 1 hour ago
    endTime: now + 3600000, // 1 hour from now
  }
}

/**
 * Get all sector tickers with current prices
 */
export function getSectorTickers(): SectorTicker[] {
  return ppppiLayersData.sectors.map((sector) => ({
    sector: sector.id as EconomicSector,
    ritualLaw: sector.ritualLaw,
    currentPrice: sector.baseValue * (1 + (getRandom() - 0.5) * sector.volatility),
    volume: Math.floor(getRandom() * 10000),
    lastUpdate: Date.now(),
  }))
}

/**
 * Create a new transaction on the ledger
 */
export function createTransaction(
  type: Transaction['type'],
  sector: EconomicSector,
  amount: number,
  timeFraction: number,
  from?: string,
  to?: string,
): Transaction {
  const reciprocalYield = calculateCoinValue(timeFraction)

  return {
    id: `TX-${Date.now()}-${getRandom().toString(36).substring(2, 11)}`,
    timestamp: Date.now(),
    type,
    sector,
    amount,
    reciprocalYield,
    from,
    to,
    metadata: {
      timeFraction,
      yieldLaw: rainYieldData.yieldLaw.antiInflationRule,
    },
  }
}

/**
 * Create a ledger entry combining all systems
 */
export function createLedgerEntry(
  tachometerState: TachometerState,
  transaction: Transaction,
  quarterLattice: number,
): LedgerEntry {
  const yieldWindow = getCurrentYieldWindow(quarterLattice)
  const priceSignal = calculateCoinValue(1 / (tachometerState.rpm / 100 + 0.01))

  return {
    id: `LE-${Date.now()}-${getRandom().toString(36).substring(2, 11)}`,
    timestamp: Date.now(),
    tachometerState,
    yieldWindow,
    sector: transaction.sector,
    transaction,
    priceSignal,
    quarterLattice,
  }
}

/**
 * Initialize E-Soil lot
 */
export function createESoilLot(
  region: number,
  conference: number,
  owner: string,
  initialYield: number,
): ESoilLot {
  const quadrant = quadrantsData.quadrants.find((q) => q.id === region)
  const prefix = quadrant?.eSoilPrefix || 'UNK'

  return {
    id: `${prefix}-${region}-${conference.toString().padStart(2, '0')}`,
    region,
    conference,
    yieldUnits: initialYield,
    owner,
    transactionHistory: [],
  }
}

/**
 * Generate dashboard data
 */
export function generateDashboardData(
  tachometerState: TachometerState,
  recentTransactions: Transaction[],
  eSoilLots: ESoilLot[],
): DashboardData {
  const activeSectors = getSectorTickers()
  const yieldCurve = getReciprocalYieldCurve()
  const totalYieldUnits = eSoilLots.reduce((sum, lot) => sum + lot.yieldUnits, 0)

  return {
    currentAxes: tachometerState.axes,
    currentVowels: tachometerState.vowels,
    activeSectors,
    recentTransactions: recentTransactions.slice(0, 10),
    yieldCurve,
    quarterCheckpoint: Math.floor((Date.now() / 1000) % 48),
    totalYieldUnits,
    activeESoilLots: eSoilLots.length,
  }
}

/**
 * Initialize complete Blue Lock Ledger state
 */
export function initializeBlueLockLedger(): BlueLockLedgerState {
  const quadrants: Quadrant[] = quadrantsData.quadrants.map((q) => ({
    id: q.id,
    name: q.name,
    conferences: q.conferences,
    heroRelic: {
      id: q.flameCard.id,
      heroName: q.heroName,
      relicType: q.flameCard.relicType,
      nodeKey: q.flameCard.nodeKey,
      ledgerAddress: q.flameCard.ledgerAddress,
      authority: q.flameCard.authority,
    },
    dominantSector: q.dominantSector as EconomicSector,
  }))

  const initialTachometer: TachometerState = {
    axes: { X: 50, Y: 50, Z: 50, W: 50 },
    vowels: { A: 1.0, E: 0.9, I: 0.85, O: 1.1, U: 0.95, Y: 1.05 },
    rpm: 50,
    phiBoost: 50,
    timestamp: Date.now(),
  }

  const currentDashboard = generateDashboardData(initialTachometer, [], [])

  return {
    quadrants,
    ledgerEntries: [],
    eSoilLots: [],
    flameCards: quadrants.map((q) => q.heroRelic),
    currentDashboard,
    yieldLaw: {
      antiInflationRule: rainYieldData.yieldLaw.antiInflationRule,
      reciprocalYieldCredits: rainYieldData.yieldLaw.reciprocalYieldCredits,
      harvestDestination: rainYieldData.yieldLaw.harvestDestination,
    },
  }
}

/**
 * Export ledger to CSV format
 */
export function exportLedgerToCSV(ledgerEntries: LedgerEntry[]): string {
  const headers = [
    'ID',
    'Timestamp',
    'Quarter Lattice',
    'Sector',
    'Transaction Type',
    'Amount',
    'Reciprocal Yield',
    'Price Signal',
    'RPM',
    'Phi Boost',
  ]

  const rows = ledgerEntries.map((entry) => [
    entry.id,
    new Date(entry.timestamp).toISOString(),
    entry.quarterLattice,
    entry.sector,
    entry.transaction.type,
    entry.transaction.amount,
    entry.transaction.reciprocalYield,
    entry.priceSignal,
    entry.tachometerState.rpm,
    entry.tachometerState.phiBoost,
  ])

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
}
