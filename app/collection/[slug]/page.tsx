import Link from "next/link";
import { NftCard } from "@/components/NftCard";
import { osFetch, hasApiKey } from "@/lib/opensea";
import { openseaCollectionUrl } from "@/lib/chains";
import type { OpenSeaCollection, OpenSeaNft } from "@/lib/types";

async function load(slug: string) {
  if (!hasApiKey()) {
    return { collection: { collection: slug, name: slug } as OpenSeaCollection, nfts: [] as OpenSeaNft[], error: "OPENSEA_API_KEY is not set." };
  }
  try {
    const collection = (await osFetch(`/collections/${slug}`)) as OpenSeaCollection;
    let nfts: OpenSeaNft[] = [];
    try {
      const listed = (await osFetch(`/collection/${slug}/nfts?limit=24`)) as { nfts?: OpenSeaNft[] };
      nfts = listed.nfts ?? [];
    } catch {
      nfts = [];
    }
    return { collection, nfts };
  } catch (err) {
    return {
      collection: { collection: slug, name: slug } as OpenSeaCollection,
      nfts: [] as OpenSeaNft[],
      error: err instanceof Error ? err.message : "Collection lookup failed",
    };
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { collection, nfts, error } = await load(slug);
  const chain = collection.contracts?.[0]?.chain || "ethereum";
  return (
    <main className="wrap section">
      <div className="kicker">Collection</div>
      <h1>{collection.name || slug}</h1>
      <p className="lede">{collection.description || "OpenSea collection."}</p>
      <div className="actions">
        <a className="btn sea" href={collection.opensea_url || openseaCollectionUrl(slug)} target="_blank" rel="noreferrer">
          Open on OpenSea
        </a>
        <Link className="btn ghost" href="/explore">
          Back to explore
        </Link>
      </div>
      {error ? <div className="banner warn">{error}</div> : null}
      <div className="grid" style={{ marginTop: 24 }}>
        {nfts.map((nft) => (
          <NftCard key={`${nft.contract}-${nft.identifier}`} nft={nft} chain={chain} />
        ))}
      </div>
    </main>
  );
}
