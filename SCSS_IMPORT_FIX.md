# SCSS import fix

## Problem

Nuxt could not resolve the global stylesheet configured as:

```ts
css: ["~/app/assets/scss/main.scss"]
```

This project uses Nuxt 4's `app/` source directory. In this layout, the `~`
alias already points to `app/`, so the old path effectively asked Nuxt to find:

```text
app/app/assets/scss/main.scss
```

That path does not exist.

## Change

Updated `nuxt.config.ts` to use the stylesheet path relative to the Nuxt app
source directory:

```ts
css: ["~/assets/scss/main.scss"]
```

The stylesheet remains at `app/assets/scss/main.scss`. No
`vite-tsconfig-paths` plugin or custom Vite alias is required.

## Verification

Ran:

```powershell
npm.cmd run build
```

Nuxt successfully resolved the SCSS file and completed both the client and SSR
Vite compilation stages. This confirms that the reported
`Cannot find module '~/app/assets/scss/main.scss'` error is fixed.

The final Nitro packaging stage subsequently stopped on a separate Windows
filesystem error from `@vercel/nft` while reading
`node_modules/vue-bundle-renderer/dist/runtime.mjs`. That later error is
unrelated to the SCSS import.
