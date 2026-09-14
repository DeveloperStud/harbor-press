import Link from "next/link";
import { osFetch, hasApiKey } from "@/lib/opensea";
import { openseaAssetUrl, shortAddress } from "@/lib/chains";
import type { OpenSeaNft } from "@/lib/types";

async function load(chain: string, address: string, tokenId: string) {
  if (!hasApiKey()) {
    return { nft: { identifier: tokenId, contract: address, name: `#${tokenId}` } as OpenSeaNft, error: "OPENSEA_API_KEY is not set." };
  }
  try {
    const data = (await osFetch(`/chain/${chain}/contract/${address}/nfts/${tokenId}`)) as {
      nft?: OpenSeaNft;
    };
    return { nft: data.nft ?? { identifier: tokenId, contract: address } };
  } catch (err) {
    return {
      nft: { identifier: tokenId, contract: address } as OpenSeaNft,
      error: err instanceof Error ? err.message : "NFT lookup failed",
    };
  }
}

export default async function NftPage({
  params,
}: {
  params: Promise<{ chain: string; address: string; tokenId: string }>;
}) {
  const { chain, address, tokenId } = await params;
  const { nft, error } = await load(chain, address, tokenId);
  const img = nft.display_image_url || nft.image_url;
  const sea = nft.opensea_url || openseaAssetUrl(chain, address, tokenId);
  return (
    <main className="wrap section">
      <div className="split">
        <div className="panel">
          {img ? <img src={img} alt={nft.name || tokenId} /> : <p>No image from OpenSea.</p>}
        </div>
        <div className="stack">
          <div className="kicker">{nft.collection || chain}</div>
          <h1>{nft.name || `#${tokenId}`}</h1>
          <p className="lede">{nft.description || "Token metadata as indexed by OpenSea."}</p>
          <p className="muted">
            {shortAddress(address)} · token {tokenId} · {chain}
          </p>
          {error ? <div className="banner warn">{error}</div> : null}
          <div className="actions">
            <a className="btn sea" href={sea} target="_blank" rel="noreferrer">
              View / buy on OpenSea
            </a>
            <Link className="btn ghost" href="/studio">
              List from Studio
            </Link>
          </div>
          {nft.traits?.length ? (
            <div className="grid" style={{ marginTop: 12 }}>
              {nft.traits.map((t, i) => (
                <div className="panel" key={`${t.trait_type}-${i}`}>
                  <div className="muted">{t.trait_type}</div>
                  <strong>{String(t.value)}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
