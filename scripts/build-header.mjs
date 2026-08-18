// Generates the profile header as a self-contained SVG, one file per colour scheme.
// The tick comb is not decoration: it draws one tick per record in lien-quan-data,
// so the artwork stays honest to the dataset it describes.
// Run: node scripts/build-header.mjs

import { writeFileSync } from 'node:fs'

const W = 880
const H = 326
const PAD = 40

// Cool-tinted concrete neutrals with a single safety-amber accent.
const THEMES = {
  light: { ink: '#15181D', muted: '#59626E', rule: '#D5D9DE', accent: '#8F5B0E' },
  dark: { ink: '#E9E4DA', muted: '#8D96A0', rule: '#242A33', accent: '#E0A458' },
}

// Record counts published by lien-quan-data.
const GROUPS = [
  { n: 129, label: 'HEROES' },
  { n: 112, label: 'ITEMS' },
  { n: 88, label: 'ARCANA' },
]

const SERIF = "Georgia, 'Iowan Old Style', 'Noto Serif', 'Times New Roman', serif"
const MONO = "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"

const TECH = ['JAVASCRIPT', 'TYPESCRIPT', 'C#', 'REACT', 'NEXT.JS', 'NODE', 'TAILWIND']

const COMB_W = W - PAD * 2
const GROUP_GAP = 14
const TICKS = GROUPS.reduce((sum, g) => sum + g.n, 0)
const TICK_PITCH = (COMB_W - GROUP_GAP * (GROUPS.length - 1)) / TICKS

const COMB_TOP = 244
const COMB_H = 15
const COMB_TALL = 22

/** Lays out each group left to right and returns its x offset and pixel width. */
function placeGroups() {
  let x = PAD
  return GROUPS.map((group) => {
    const width = group.n * TICK_PITCH
    const placed = { ...group, x, width }
    x += width + GROUP_GAP
    return placed
  })
}

/** One tick per record, with every tenth tick extended into a ruler mark. */
function comb(groups, accent) {
  return groups
    .map((group, groupIndex) => {
      const opacity = [1, 0.7, 0.46][groupIndex]
      const ticks = Array.from({ length: group.n }, (_, i) => {
        const tall = (i + 1) % 10 === 0
        const h = tall ? COMB_TALL : COMB_H
        const x = (group.x + i * TICK_PITCH).toFixed(2)
        const y = COMB_TOP + COMB_TALL - h
        return `<rect x="${x}" y="${y}" width="1.15" height="${h}" />`
      }).join('')
      return `<g fill="${accent}" opacity="${opacity}">${ticks}</g>`
    })
    .join('')
}

/** Tabular count plus its label, sitting above the group it measures. */
function readout(groups, ink, muted) {
  return groups
    .map((group) => {
      const labelX = group.x + String(group.n).length * 13.2 + 9
      return (
        `<text class="num" x="${group.x}" y="228" fill="${ink}">${group.n}</text>` +
        `<text class="unit" x="${labelX.toFixed(1)}" y="228" fill="${muted}">${group.label}</text>`
      )
    })
    .join('')
}

function svg(theme) {
  const t = THEMES[theme]
  const groups = placeGroups()

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Pham Manh Luc, web developer in Vietnam. Open data for Arena of Valor: 129 heroes, 112 items, 88 arcana.">
  <style>
    .kicker { font: 500 11px ${MONO}; letter-spacing: 0.16em; }
    .lede { font: 400 45px ${SERIF}; letter-spacing: -0.015em; }
    .num { font: 600 21px ${MONO}; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
    .unit { font: 500 10px ${MONO}; letter-spacing: 0.14em; }
    .foot { font: 500 10px ${MONO}; letter-spacing: 0.13em; }
    .rise { animation: rise 620ms cubic-bezier(0.25, 1, 0.5, 1) both; }
    .d1 { animation-delay: 60ms; }
    .d2 { animation-delay: 120ms; }
    .d3 { animation-delay: 260ms; }
    .d4 { animation-delay: 360ms; }
    .sweep { transform-box: fill-box; transform-origin: left center; animation: sweep 880ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both; }
    @keyframes rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
    @keyframes sweep { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @media (prefers-reduced-motion: reduce) {
      .rise, .sweep { animation: none; }
    }
  </style>

  <text class="kicker rise" x="${PAD}" y="46" fill="${t.muted}">MLUC24 &#183; WEB DEVELOPER &#183; VIETNAM</text>

  <g class="rise d1">
    <text class="lede" x="${PAD}" y="116" fill="${t.ink}">Small projects</text>
  </g>
  <g class="rise d2">
    <text class="lede" x="${PAD}" y="164" fill="${t.ink}">that actually run.</text>
  </g>

  <rect class="sweep" x="${PAD}" y="196" width="${COMB_W}" height="1" fill="${t.rule}" />

  <g class="rise d3">${readout(groups, t.ink, t.muted)}</g>
  <g class="sweep">${comb(groups, t.accent)}</g>

  <g class="rise d4">
    <text class="foot" x="${PAD}" y="300" fill="${t.muted}">${TECH.join(' &#183; ')}</text>
  </g>
</svg>
`
}

for (const theme of Object.keys(THEMES)) {
  writeFileSync(`assets/header-${theme}.svg`, svg(theme))
  console.log(`assets/header-${theme}.svg`)
}
