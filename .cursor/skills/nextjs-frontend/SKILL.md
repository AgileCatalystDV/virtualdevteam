---
name: nextjs-frontend
description: 'Fede: Next.js 16 + React 19 frontend patterns. Use when building or optimizing Next.js app.'
---

# Next.js Frontend Skill

## Wanneer te gebruiken
- Next.js app bouwen of refactoren
- Performance optimalisatie
- Configuratie (next.config)

## Next.js 16 (2025) — Key Features

### Turbopack (default)
- Nu stable en default — geen `--turbopack` flag meer
- 10× snellere Fast Refresh, 2–5× snellere production builds
- **Filesystem cache** (beta): `experimental: { turbopackFileSystemCacheForDev: true }`

### Caching
- `"use cache"` directive — expliciete cache control voor pages/components
- `revalidateTag()`, `updateTag()`, `refresh()` — nieuwe APIs
- PPR (Partial Pre-Rendering) — mix cached + dynamic content

### Webpack vs Turbopack
- Next.js 16 gebruikt Turbopack by default
- Custom `webpack` config wordt niet toegepast op Turbopack
- Gebruik `turbopack: {}` in config of `--webpack` flag als je webpack nodig hebt

### Node.js
- **Node.js 20.9+** vereist — Node 18 niet meer ondersteund

## Upgrade
```bash
npx @next/codemod@canary upgrade latest
npm install next@latest react@latest react-dom@latest
```

## References
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
