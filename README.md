# Arcos Online Website

Standalone static website for `arcosonline.com.br`.

## What is included

- Homepage in English and Brazilian Portuguese.
- SEO clone-script pages in English and Brazilian Portuguese under `/en/clone-scripts/` and `/clone-scripts/`:
  - Deriv
  - IQ Option
  - Olymp Trade
  - Quotex
  - Pocket Option
  - Binomo
  - ExpertOption
  - Binarium
  - IQCent
  - RaceOption
- Shared CSS, JavaScript and local visual assets.
- `sitemap.xml` and `robots.txt`.
- JSON-LD for organization and software pages.
- Compliance disclaimer: Arcos Online is independent and not affiliated with referenced platforms.

## Run locally

```bash
npm run build
npm run serve
```

Open `http://localhost:4173`.

## Deploy

Deploy the generated `dist/` folder to any static host.

Recommended static host settings:

- Build command: `npm run build`
- Output directory: `dist`

The current static lead form opens a prefilled email to `contato@arcosonline.com.br`. Replace this with a CRM endpoint or form service when the final lead destination is available.

## Notes

Referenced broker names are used only to describe product scope and functional reference flows. Arcos Online does not copy broker brands, logos or protected assets, and each launch should use the client's own brand, domain, legal setup, terms and compliance review.
