/**
 * Tests for Blue Lock Ledger core functionality
 */

import { describe, it, expect } from 'vitest'
import {
  calculateRPM,
  calculatePhiBoost,
  calculateCoinValue,
  createTransaction,
  createLedgerEntry,
  createESoilLot,
  initializeBlueLockLedger,
  exportLedgerToCSV,
} from '../lib/ledger.js'
import type { TachometerState, EconomicSector } from '../types/index.js'

describe('Blue Lock Ledger', () => {
  describe('Tachometer calculations', () => {
    it('should calculate RPM correctly', () => {
      const axes = { X: 50, Y: 60, Z: 70, W: 80 }
      const rpm = calculateRPM(axes)
      expect(rpm).toBe(65) // (50 + 60 + 70 + 80) / 4
    })

    it('should calculate Phi-Boost with golden ratio', () => {
      const rpm = 50
      const vowels = { A: 1.0, E: 0.9, I: 0.85, O: 1.1, U: 0.95, Y: 1.05 }
      const phiBoost = calculatePhiBoost(rpm, vowels)

      // Expected: 50 * (1 + (5.85 / 6) * 0.618)
      // = 50 * (1 + 0.975 * 0.618) = 50 * 1.60245 ≈ 80.1225
      expect(phiBoost).toBeCloseTo(80.12, 1)
    })
  })

  describe('Reciprocal yield curve', () => {
    it('should calculate coin value for shortest interval', () => {
      const coinValue = calculateCoinValue(0.125)
      expect(coinValue).toBe(180) // Highest gain for 1/8 cycle
    })

    it('should calculate coin value for full cycle', () => {
      const coinValue = calculateCoinValue(1.0)
      expect(coinValue).toBe(10) // Base value for full cycle
    })

    it('should interpolate coin values between checkpoints', () => {
      const coinValue = calculateCoinValue(0.375) // Between 0.25 and 0.5
      expect(coinValue).toBeGreaterThan(60) // Above 1/2 cycle value
      expect(coinValue).toBeLessThan(120) // Below 1/4 cycle value
    })
  })

  describe('Transaction creation', () => {
    it('should create a valid transaction', () => {
      const transaction = createTransaction(
        'yield',
        'ENERGY' as EconomicSector,
        100,
        0.25,
        'Jetah',
        'Ledger',
      )

      expect(transaction.id).toMatch(/^TX-/)
      expect(transaction.type).toBe('yield')
      expect(transaction.sector).toBe('ENERGY')
      expect(transaction.amount).toBe(100)
      expect(transaction.reciprocalYield).toBe(120) // 0.25 time fraction = 120 coins
      expect(transaction.from).toBe('Jetah')
      expect(transaction.to).toBe('Ledger')
    })

    it('should include metadata with time fraction', () => {
      const transaction = createTransaction('trade', 'MEDS' as EconomicSector, 50, 0.5)

      expect(transaction.metadata).toBeDefined()
      expect(transaction.metadata?.timeFraction).toBe(0.5)
      expect(transaction.metadata?.yieldLaw).toBeDefined()
    })
  })

  describe('Ledger entry creation', () => {
    it('should create complete ledger entry', () => {
      const tachometerState: TachometerState = {
        axes: { X: 75, Y: 65, Z: 80, W: 70 },
        vowels: { A: 1.0, E: 0.9, I: 0.85, O: 1.1, U: 0.95, Y: 1.05 },
        rpm: 72.5,
        phiBoost: 100,
        timestamp: Date.now(),
      }

      const transaction = createTransaction('ritual', 'WEAPONS' as EconomicSector, 75, 0.125)
      const entry = createLedgerEntry(tachometerState, transaction, 12)

      expect(entry.id).toMatch(/^LE-/)
      expect(entry.tachometerState).toBe(tachometerState)
      expect(entry.transaction).toBe(transaction)
      expect(entry.quarterLattice).toBe(12)
      expect(entry.yieldWindow).toBeDefined()
      expect(entry.priceSignal).toBeGreaterThan(0)
    })
  })

  describe('E-Soil lot creation', () => {
    it('should create E-Soil lot with correct ID format', () => {
      const lot = createESoilLot(1, 5, 'Jetah', 250)

      expect(lot.id).toBe('EMB-1-05') // Ember quadrant prefix
      expect(lot.region).toBe(1)
      expect(lot.conference).toBe(5)
      expect(lot.owner).toBe('Jetah')
      expect(lot.yieldUnits).toBe(250)
      expect(lot.transactionHistory).toEqual([])
    })

    it('should create lots for different quadrants', () => {
      const lot1 = createESoilLot(1, 1, 'Jetah', 100) // Ember
      const lot2 = createESoilLot(2, 13, 'Aquila', 150) // Tide
      const lot3 = createESoilLot(3, 25, 'Gaia', 200) // Terra
      const lot4 = createESoilLot(4, 37, 'Zephyr', 250) // Aether

      expect(lot1.id).toMatch(/^EMB-/)
      expect(lot2.id).toMatch(/^TID-/)
      expect(lot3.id).toMatch(/^TER-/)
      expect(lot4.id).toMatch(/^AET-/)
    })
  })

  describe('System initialization', () => {
    it('should initialize Blue Lock Ledger with all components', () => {
      const state = initializeBlueLockLedger()

      expect(state.quadrants).toHaveLength(4)
      expect(state.flameCards).toHaveLength(4)
      expect(state.ledgerEntries).toEqual([])
      expect(state.eSoilLots).toEqual([])
      expect(state.yieldLaw).toBeDefined()
      expect(state.yieldLaw.antiInflationRule).toBeDefined()
      expect(state.currentDashboard).toBeDefined()
    })

    it('should have correct quadrant structure', () => {
      const state = initializeBlueLockLedger()

      const emberQuadrant = state.quadrants.find((q) => q.id === 1)
      expect(emberQuadrant).toBeDefined()
      expect(emberQuadrant?.name).toBe('Ember Quadrant')
      expect(emberQuadrant?.heroRelic.heroName).toBe('Jetah')
      expect(emberQuadrant?.dominantSector).toBe('ENERGY')
      expect(emberQuadrant?.conferences).toHaveLength(12)
    })
  })

  describe('CSV export', () => {
    it('should export ledger entries to CSV format', () => {
      const tachometerState: TachometerState = {
        axes: { X: 50, Y: 50, Z: 50, W: 50 },
        vowels: { A: 1.0, E: 0.9, I: 0.85, O: 1.1, U: 0.95, Y: 1.05 },
        rpm: 50,
        phiBoost: 80,
        timestamp: Date.now(),
      }

      const transaction = createTransaction('yield', 'ENERGY' as EconomicSector, 100, 0.25)
      const entry = createLedgerEntry(tachometerState, transaction, 0)

      const csv = exportLedgerToCSV([entry])

      expect(csv).toContain('ID,Timestamp,Quarter Lattice')
      expect(csv).toContain('ENERGY')
      expect(csv).toContain('yield')
      expect(csv).toContain('100')
      expect(csv.split('\n')).toHaveLength(2) // Header + 1 entry
    })
  })
})
