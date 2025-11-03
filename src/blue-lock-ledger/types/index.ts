/**
 * Blue Lock Ledger Type Definitions
 * Economic layer types for the EVOLVERSE multi-tier economic simulation
 */

/**
 * Axis system from EVOL X/Y Tachometer
 * X = Seal, Y = Reveal, Z = Depth, W = Will
 */
export interface TachometerAxes {
  X: number // Seal
  Y: number // Reveal
  Z: number // Depth
  W: number // Will
}

/**
 * Vowel weights that modulate state (A-E-I-O-U-Y)
 */
export interface VowelWeights {
  A: number
  E: number
  I: number
  O: number
  U: number
  Y: number
}

/**
 * Tachometer state combining axes and vowel modulation
 */
export interface TachometerState {
  axes: TachometerAxes
  vowels: VowelWeights
  rpm: number
  phiBoost: number // φ-Boost value
  timestamp: number
}

/**
 * Rain Yield temporal trading gates (quarter checkpoints)
 */
export interface YieldWindow {
  quarterCheckpoint: number // e.g., 225, 504
  isHalfYield: boolean
  startTime: number
  endTime: number
}

/**
 * Reciprocal yield pricing curve
 * Time fractions vs. decibel yields for dynamic pricing
 */
export interface ReciprocalYieldCurve {
  timeFraction: number
  decibelYield: number
  coinValue: number
}

/**
 * PPPPI Economic Sector definitions
 */
export enum EconomicSector {
  ENERGY = 'Energy',
  TRANSPORT = 'Transport',
  MEDS = 'Meds',
  WEAPONS = 'Weapons',
  PUZZLE = 'Puzzle',
  KNOWLEDGE = 'Knowledge',
}

/**
 * Sector ticker with ritual-law statement
 */
export interface SectorTicker {
  sector: EconomicSector
  ritualLaw: string
  currentPrice: number
  volume: number
  lastUpdate: number
}

/**
 * E-Soil lot: tokenized real-estate analog
 * Denominated in reciprocal yield units
 */
export interface ESoilLot {
  id: string
  region: number // 1-4 (Four Regions)
  conference: number // 1-12 per region (48 total conferences)
  yieldUnits: number
  owner: string
  transactionHistory: Transaction[]
}

/**
 * Transaction on the Blue Lock Ledger
 */
export interface Transaction {
  id: string
  timestamp: number
  type: 'yield' | 'trade' | 'harvest' | 'ritual'
  sector: EconomicSector
  amount: number
  reciprocalYield: number
  from?: string
  to?: string
  metadata?: Record<string, unknown>
}

/**
 * FlameCard/Relic: Authentication token and node key
 */
export interface FlameCard {
  id: string
  heroName: string
  relicType: string
  nodeKey: string
  ledgerAddress: string
  authority: number
}

/**
 * Complete Blue Lock Ledger entry
 */
export interface LedgerEntry {
  id: string
  timestamp: number
  tachometerState: TachometerState
  yieldWindow: YieldWindow
  sector: EconomicSector
  transaction: Transaction
  priceSignal: number
  quarterLattice: number // 0-47 for 48-tick Quarter Lattice
}

/**
 * Meta-stock dashboard data
 */
export interface DashboardData {
  currentAxes: TachometerAxes
  currentVowels: VowelWeights
  activeSectors: SectorTicker[]
  recentTransactions: Transaction[]
  yieldCurve: ReciprocalYieldCurve[]
  quarterCheckpoint: number
  totalYieldUnits: number
  activeESoilLots: number
}

/**
 * Quadrant structure from "Gathering of the Four"
 */
export interface Quadrant {
  id: number // 1-4
  name: string
  conferences: number[] // 12 conferences per quadrant
  heroRelic: FlameCard
  dominantSector: EconomicSector
}

/**
 * Complete Blue Lock Ledger System state
 */
export interface BlueLockLedgerState {
  quadrants: Quadrant[]
  ledgerEntries: LedgerEntry[]
  eSoilLots: ESoilLot[]
  flameCards: FlameCard[]
  currentDashboard: DashboardData
  yieldLaw: {
    antiInflationRule: string
    reciprocalYieldCredits: boolean
    harvestDestination: boolean
  }
}
