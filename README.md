<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/MLuc24/MLuc24/main/assets/header-dark.png">
  <img src="https://raw.githubusercontent.com/MLuc24/MLuc24/main/assets/header-light.png" width="880" alt="Phạm Mạnh Lực (MLuc24), web developer in Vietnam. Small projects that actually run. 129 heroes, 112 items, 88 arcana.">
</picture>

Most of what is here started because I wanted to use it myself. Right now that means Arena of Valor tooling: crawling the official and community sources, normalising them into one open dataset, and serving it from a static site that needs no backend.

The ticks above are not decoration. There is one for every record in that dataset.

<br />

## Open data for Arena of Valor

**[lien-quan-data](https://github.com/MLuc24/lien-quan-data)** &nbsp; [![stars](https://img.shields.io/github/stars/MLuc24/lien-quan-data?style=flat-square&label=stars&color=E0A458&labelColor=1c2128)](https://github.com/MLuc24/lien-quan-data) [![updated](https://img.shields.io/github/last-commit/MLuc24/lien-quan-data?style=flat-square&label=updated&color=59626E&labelColor=1c2128)](https://github.com/MLuc24/lien-quan-data/commits/main)

Heroes, items, arcana, summoner spells, badges and game modes as plain JSON — no API key, no rate limit, and no scraping on your side. Rebuilt weekly from the official Garena site and the Arena of Valor Fandom wiki by the crawlers in the repo.

```js
const heroes = await fetch(
  'https://cdn.jsdelivr.net/gh/MLuc24/lien-quan-data@main/data/heroes.json'
).then((r) => r.json())

const airi = heroes.find((h) => h.slug === 'airi')
// stats, skills, skins, prices, lore, suggested builds, balance history
```

Every record traces back to a published source. Where a source has nothing, the field is left out rather than guessed — the gaps are part of the data. A static wiki reading from this dataset is the next piece; it is still private while the interface settles.

<br />

## Also here

| Project | What it is | Stack |
|---|---|---|
| [Repix.art](https://github.com/MLuc24/Repix.art) | NanoEdit image editor | TypeScript |
| [AppTet](https://github.com/MLuc24/AppTet) | Seasonal e-commerce app built for Tết | TypeScript |
| [Social-media-app](https://github.com/MLuc24/Social-media-app) | Full-stack social app, .NET Core API + JS client | C# · .NET |
| [Warehouse-backend](https://github.com/MLuc24/Warehouse-backend) · [frontend](https://github.com/MLuc24/Warehouse-frontend) | Warehouse management, split API and UI | C# · TypeScript |
| [Train_Ticket_Be](https://github.com/MLuc24/Train_Ticket_Be) · [FE](https://github.com/MLuc24/Train_Ticket_FE) | Online train ticket booking | TypeScript |

I work across JavaScript and TypeScript on the web side and C# / .NET on the service side, so most of these exist as a matching pair of repositories rather than one monolith.
