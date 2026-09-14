# Harbor Press

NFT publishing website that uses the [OpenSea API](https://docs.opensea.io/) and [OpenSea Studio](https://opensea.io/studio).

## What it is

A Next.js publisher desk:

1. **Publish** — compose OpenSea-standard ERC-721 metadata (`name`, `description`, `image`, `attributes`).
2. **Mint** — hand off contract deploy + item creation to OpenSea Studio (required; OpenSea has no public “upload image → mint” API).
3. **Studio** — load wallet NFTs from `GET /api/v2/chain/{chain}/account/{address}/nfts` and request Seaport listing actions from `POST /api/v2/listings/actions`.
4. **Explore** — trending collections and collection/item pages proxied through the OpenSea API.

The OpenSea API key stays on the server. The browser only talks to `/api/os/*` and `/api/listings/actions`.

## Setup

```bash
npm install
cp .env.example .env.local
```

Create a key at [opensea.io/settings/developer](https://opensea.io/settings/developer) or try the instant free-tier endpoint:

```bash
curl -X POST https://api.opensea.io/api/v2/auth/keys
```

Put it in `.env.local`:

```
OPENSEA_API_KEY=your_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Vercel: set `OPENSEA_API_KEY` in project environment variables.

## Sources

- OpenSea API overview: https://docs.opensea.io/reference/api-overview
- API keys: https://docs.opensea.io/reference/api-keys
- Listing actions: https://docs.opensea.io/reference/create_listing_actions
- TypeScript SDK: https://docs.opensea.io/reference/opensea-sdk
- Create an NFT (Studio): https://support.opensea.io/en/articles/8867023-how-do-i-create-an-nft
- Attribution: link back to OpenSea when displaying their catalog data.
