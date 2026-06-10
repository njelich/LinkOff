#!/usr/bin/env node
// Reads reports/mutation/mutation.json and writes a compact markdown summary
// that can be read directly by Claude for test-gap analysis.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const INPUT = join(ROOT, 'reports/mutation/mutation.json')
const OUTPUT = join(ROOT, 'reports/mutation/mutation-summary.md')

// Mutations that are structurally equivalent and cannot be killed
const EQUIVALENT_PATTERNS = [
  (m) => m.mutatorName === 'StringLiteral' && m.replacement === '""',
  (m) => m.mutatorName === 'StringLiteral' && m.replacement === '``',
  (m) => m.status === 'NoCoverage',
]

const isEquivalent = (m) => EQUIVALENT_PATTERNS.some((fn) => fn(m))

const data = JSON.parse(readFileSync(INPUT, 'utf8'))

const lines = []

// Overall score table
lines.push('# Mutation Test Summary\n')
lines.push('| File | Score | Killed | Survived | No-cov |')
lines.push('|------|-------|--------|----------|--------|')

let totalKilled = 0, totalSurvived = 0, totalNoCov = 0, totalAll = 0

for (const [filepath, file] of Object.entries(data.files)) {
  const filename = filepath.split('/').slice(-2).join('/')
  const mutants = file.mutants
  const killed   = mutants.filter((m) => m.status === 'Killed' || m.status === 'Timeout').length
  const survived = mutants.filter((m) => m.status === 'Survived').length
  const noCov    = mutants.filter((m) => m.status === 'NoCoverage').length
  const total    = mutants.length
  const score    = total ? ((killed / total) * 100).toFixed(1) : '—'
  totalKilled += killed; totalSurvived += survived; totalNoCov += noCov; totalAll += total
  lines.push(`| \`${filename}\` | **${score}%** | ${killed} | ${survived} | ${noCov} |`)
}

const overallScore = totalAll ? ((totalKilled / totalAll) * 100).toFixed(1) : '—'
lines.push(`| **All files** | **${overallScore}%** | ${totalKilled} | ${totalSurvived} | ${totalNoCov} |`)

// Per-file survived mutant details (skip equivalents)
for (const [filepath, file] of Object.entries(data.files)) {
  const filename = filepath.split('/').slice(-2).join('/')
  const survivors = file.mutants.filter(
    (m) => m.status === 'Survived' && !isEquivalent(m)
  )

  if (survivors.length === 0) continue

  lines.push(`\n## \`${filename}\` — ${survivors.length} actionable survivors\n`)

  const sourceLines = file.source.split('\n')

  for (const m of survivors) {
    const line  = m.location.start.line
    const src   = (sourceLines[line - 1] || '').trim()
    const repl  = m.replacement.replace(/\n/g, ' ').trim()
    lines.push(`**L${line}** \`${m.mutatorName}\``)
    lines.push(`- original: \`${src}\``)
    lines.push(`- mutant:   \`${repl}\``)
    lines.push('')
  }
}

mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, lines.join('\n'))

console.log(`\nMutation summary written to: ${OUTPUT}`)
console.log(`Overall score: ${overallScore}% (${totalKilled}/${totalAll} killed)\n`)

// Print score table to stdout too
for (const [filepath, file] of Object.entries(data.files)) {
  const filename = filepath.split('/').slice(-2).join('/')
  const mutants  = file.mutants
  const killed   = mutants.filter((m) => m.status === 'Killed' || m.status === 'Timeout').length
  const survived = mutants.filter((m) => m.status === 'Survived').length
  const total    = mutants.length
  const score    = total ? ((killed / total) * 100).toFixed(1) : '—'
  console.log(`  ${score.padStart(5)}%  ${filename}  (${survived} survived)`)
}
