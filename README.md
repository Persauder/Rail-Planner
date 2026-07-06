# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

Copy `.env.example` to `.env` and set `NUXT_PKP_API_KEY` to your key from
[PKP PLK Open Data](https://pdp-api.plk-sa.pl/). During local development, the
server can also read the ignored `api-key-*.txt` credential file downloaded
from that site.

The key is used only by Nuxt server routes and is never sent to the browser.
Journey searches return direct, planned trains for the selected date, with
optional earliest-departure and latest-arrival filters. Search criteria are
stored in the URL and locally so they survive navigation. Station fields accept
Polish station names and provide suggestions for major cities.
The PKP PLK API does not provide ticket fares, so the interface labels fares as
unavailable.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
