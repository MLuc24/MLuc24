// Builds the profile header as a standalone HTML page, then screenshots it to PNG.
//
// PNG rather than SVG on purpose: GitHub does not reliably display an SVG pulled from
// raw.githubusercontent.com, and a header that silently fails to load is the worst outcome.
// A single image serves both GitHub themes, since the artwork carries its own dark ground.
//
// Run from the repository root:
//   npm i -D playwright && node scripts/build-header.mjs

import { writeFileSync, unlinkSync } from 'node:fs'
import { chromium } from 'playwright'

const W = 880
const H = 290
const OUT = 'assets/header.png'
const TMP = 'assets/.header.html'

const SANS = '"Segoe UI Variable Display","Segoe UI",system-ui,-apple-system,sans-serif'
const MONO = '"Cascadia Mono",Consolas,ui-monospace,monospace'

const NAME = 'Phạm Mạnh Lực'
const EYEBROW = 'Web Developer &nbsp;·&nbsp; Vietnam'
const TAGLINE = 'Small projects that actually run.'
const STACK = ['TypeScript', 'React', 'Next.js', 'Node.js', 'C# / .NET', 'Tailwind']

const html = `<!doctype html><meta charset="utf-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px}
  body{
    position:relative;overflow:hidden;color:#F8FAFC;font-family:${SANS};
    /* Four saturated light sources over a near-black ground. The violet sits low and tight
       so it does not wash over the chips, and the cyan rides high enough to keep the top
       right corner from going dead. */
    background:
      radial-gradient(680px 340px at 2% -14%, #4F46E5 0%, transparent 60%),
      radial-gradient(380px 200px at 46% 132%, #7C3AED 0%, transparent 68%),
      radial-gradient(560px 420px at 104% 76%, #0891B2 0%, transparent 58%),
      radial-gradient(420px 260px at 88% -18%, #3730A3 0%, transparent 64%),
      #080C1A;
  }
  /* Faint grid gives the flat gradient some tooth without reading as noise. */
  .grid{
    position:absolute;inset:0;
    background-image:linear-gradient(#ffffff0a 1px,transparent 1px),
                     linear-gradient(90deg,#ffffff0a 1px,transparent 1px);
    background-size:48px 48px;
    -webkit-mask-image:linear-gradient(115deg,#000 0%,transparent 72%);
    mask-image:linear-gradient(115deg,#000 0%,transparent 72%);
  }
  .wrap{position:relative;padding:44px 52px}
  .eyebrow{font:600 12px ${MONO};letter-spacing:.2em;text-transform:uppercase;color:#A5B4FC}
  h1{margin-top:13px;font-size:56px;font-weight:700;letter-spacing:-.03em;line-height:1}
  .tag{margin-top:15px;font-size:18px;color:#C3CBDC}
  .chips{margin-top:28px;display:flex;gap:9px;flex-wrap:wrap}
  .chip{
    font:600 12.5px ${SANS};padding:7px 15px;border-radius:999px;color:#DDE3FF;
    background:rgba(129,140,248,.16);border:1px solid rgba(165,180,252,.34);
  }
</style>
<div class="grid"></div>
<div class="wrap">
  <div class="eyebrow">${EYEBROW}</div>
  <h1>${NAME}</h1>
  <p class="tag">${TAGLINE}</p>
  <div class="chips">${STACK.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
</div>`

writeFileSync(TMP, html)

const browser = await chromium.launch({ channel: 'chrome' })
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/${TMP}`)
await page.waitForTimeout(600)
await page.screenshot({ path: OUT })
await browser.close()

unlinkSync(TMP)
console.log(OUT)
