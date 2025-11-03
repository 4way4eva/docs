#!/usr/bin/env tsx
/**
 * Generate Blue Lock Ledger Meta-Stock Dashboard
 * Pulls from all three data sources: Tachometer, Rain Yield, PPPPI Sectors
 */

import {
  initializeBlueLockLedger,
  createTransaction,
  createLedgerEntry,
  createESoilLot,
  generateDashboardData,
  exportLedgerToCSV,
  calculateRPM,
  calculatePhiBoost,
  setRandomSeed,
} from '../lib/ledger.js'
import { generateLedgerSchema, exportSchemaToJSON } from '../lib/schema.js'
import type { TachometerState, EconomicSector } from '../types/index.js'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

/**
 * Generate sample dashboard data
 */
function generateSampleDashboard() {
  console.log('🔵 Initializing Blue Lock Ledger...\n')

  // Set seed for deterministic generation in dashboard (use timestamp for variety)
  setRandomSeed(Date.now())

  // Initialize the ledger system
  const ledgerState = initializeBlueLockLedger()

  // Create sample tachometer state
  const tachometerState: TachometerState = {
    axes: { X: 75, Y: 65, Z: 80, W: 70 },
    vowels: { A: 1.0, E: 0.9, I: 0.85, O: 1.1, U: 0.95, Y: 1.05 },
    rpm: calculateRPM({ X: 75, Y: 65, Z: 80, W: 70 }),
    phiBoost: 0,
    timestamp: Date.now(),
  }
  tachometerState.phiBoost = calculatePhiBoost(tachometerState.rpm, tachometerState.vowels)

  console.log('📊 Tachometer State:')
  console.log(`  RPM: ${tachometerState.rpm.toFixed(2)}`)
  console.log(`  φ-Boost: ${tachometerState.phiBoost.toFixed(2)}`)
  console.log(
    `  Axes: X=${tachometerState.axes.X}, Y=${tachometerState.axes.Y}, Z=${tachometerState.axes.Z}, W=${tachometerState.axes.W}\n`,
  )

  // Create sample transactions
  const transactions = [
    createTransaction('yield', 'ENERGY' as EconomicSector, 100, 0.25, 'Jetah', 'Ledger'),
    createTransaction('trade', 'MEDS' as EconomicSector, 50, 0.5, 'Aquila', 'Gaia'),
    createTransaction('ritual', 'WEAPONS' as EconomicSector, 75, 0.125, 'Zephyr', 'Ledger'),
    createTransaction('harvest', 'KNOWLEDGE' as EconomicSector, 120, 1.0, 'Ledger', 'Jetah'),
  ]

  console.log(`💰 Created ${transactions.length} sample transactions\n`)

  // Create ledger entries
  transactions.forEach((tx, idx) => {
    const entry = createLedgerEntry(tachometerState, tx, idx * 12)
    ledgerState.ledgerEntries.push(entry)
  })

  // Create sample E-Soil lots
  console.log('🌱 Creating E-Soil lots...')
  for (let region = 1; region <= 4; region++) {
    for (let conf = 1; conf <= 3; conf++) {
      const lot = createESoilLot(
        region,
        (region - 1) * 12 + conf,
        ledgerState.quadrants[region - 1].heroRelic.heroName,
        Math.floor(Math.random() * 500) + 100,
      )
      ledgerState.eSoilLots.push(lot)
    }
  }
  console.log(`  Created ${ledgerState.eSoilLots.length} E-Soil lots\n`)

  // Generate dashboard
  ledgerState.currentDashboard = generateDashboardData(
    tachometerState,
    transactions,
    ledgerState.eSoilLots,
  )

  // Display dashboard summary
  console.log('📈 Dashboard Summary:')
  console.log(`  Quarter Checkpoint: ${ledgerState.currentDashboard.quarterCheckpoint}`)
  console.log(`  Total Yield Units: ${ledgerState.currentDashboard.totalYieldUnits}`)
  console.log(`  Active E-Soil Lots: ${ledgerState.currentDashboard.activeESoilLots}`)
  console.log(`  Recent Transactions: ${ledgerState.currentDashboard.recentTransactions.length}\n`)

  console.log('💹 Active Sectors:')
  ledgerState.currentDashboard.activeSectors.forEach((sector) => {
    console.log(`  ${sector.sector}: $${sector.currentPrice.toFixed(2)} | "${sector.ritualLaw}"`)
  })
  console.log()

  return ledgerState
}

/**
 * Export dashboard data to files
 */
function exportDashboard(ledgerState: ReturnType<typeof initializeBlueLockLedger>) {
  const outputDir = join(process.cwd(), 'src', 'blue-lock-ledger', 'output')

  // Create output directory if it doesn't exist
  try {
    mkdirSync(outputDir, { recursive: true })
  } catch {
    // Directory might already exist
  }

  // Export full schema to JSON
  const schema = generateLedgerSchema(ledgerState)
  const schemaJSON = exportSchemaToJSON(schema)
  const schemaPath = join(outputDir, 'blue-lock-ledger-schema.json')
  writeFileSync(schemaPath, schemaJSON)
  console.log(`✅ Exported schema to: ${schemaPath}`)

  // Export ledger entries to CSV
  const csv = exportLedgerToCSV(ledgerState.ledgerEntries)
  const csvPath = join(outputDir, 'ledger-entries.csv')
  writeFileSync(csvPath, csv)
  console.log(`✅ Exported ledger entries to: ${csvPath}`)

  // Export dashboard summary
  const dashboardSummary = {
    generated: new Date().toISOString(),
    system: 'Blue Lock Ledger',
    version: '1.0.0',
    summary: {
      totalQuadrants: ledgerState.quadrants.length,
      totalLedgerEntries: ledgerState.ledgerEntries.length,
      totalESoilLots: ledgerState.eSoilLots.length,
      totalYieldUnits: ledgerState.currentDashboard.totalYieldUnits,
      currentQuarterCheckpoint: ledgerState.currentDashboard.quarterCheckpoint,
    },
    quadrants: ledgerState.quadrants.map((q) => ({
      id: q.id,
      name: q.name,
      hero: q.heroRelic.heroName,
      dominantSector: q.dominantSector,
    })),
    activeSectors: ledgerState.currentDashboard.activeSectors,
    yieldLaw: ledgerState.yieldLaw,
  }
  const dashboardPath = join(outputDir, 'dashboard-summary.json')
  writeFileSync(dashboardPath, JSON.stringify(dashboardSummary, null, 2))
  console.log(`✅ Exported dashboard summary to: ${dashboardPath}`)
}

// Main execution
console.log('═══════════════════════════════════════════════════════')
console.log('   BLUE LOCK LEDGER - Meta-Stock Dashboard Generator   ')
console.log('═══════════════════════════════════════════════════════\n')

const ledgerState = generateSampleDashboard()

console.log('📦 Exporting data...\n')
exportDashboard(ledgerState)

console.log('\n═══════════════════════════════════════════════════════')
console.log('   Dashboard generation complete!                       ')
console.log('═══════════════════════════════════════════════════════\n')
