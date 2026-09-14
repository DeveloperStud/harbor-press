import Link from "next/link";
import { CollectionCard } from "@/components/CollectionCard";
import { osFetch, hasApiKey } from "@/lib/opensea";
import type { OpenSeaCollection } from "@/lib/types";

async function loadTrending(): Promise<{ collections: OpenSeaCollection[]; error?: string }> {
  if (!hasApiKey()) {
    return {
      collections: [],
      error: "Set OPENSEA_API_KEY to stream live OpenSea collections. Explore still works for known slugs.",
    };
  }
  try {
    const data = (await osFetch("/collections/trending?limit=8&timeframe=one_day")) as {
      collections?: OpenSeaCollection[];
    };
    return { collections: data.collections ?? [] };
  } catch (err) {
    return { collections: [], error: err instanceof Error ? err.message : "OpenSea trending unavailable" };
  }
}

export default async function HomePage() {
  const { collections, error } = await loadTrending();
  return (
    <main>
      <section className="wrap hero">
        <div>
          <div className="kicker">OpenSea publisher desk</div>
          <h1>Write the work. Ship it to the sea.</h1>
          <p className="lede">
            Harbor Press prepares OpenSea-compatible metadata, walks the Studio mint, then lists the token on
            OpenSea Seaport from your own wallet.
          </p>
          <div className="actions">
            <Link className="btn sea" href="/publish">
              Start a publication
            </Link>
            <Link className="btn ghost" href="/studio">
              List an owned NFT
            </Link>
          </div>
        </div>
        <aside className="panel">
          <div className="kicker">Press run</div>
          <div className="steps" style={{ marginTop: 12 }}>
            <div className="step">
              <div className="num">1</div>
              <div>Compose image, title, traits, and royalty notes into ERC-721 metadata.</div>
            </div>
            <div className="step">
              <div className="num">2</div>
              <div>
                Deploy or reuse a collection in{" "}
                <a href="https://opensea.io/studio" target="_blank" rel="noreferrer">
                  OpenSea Studio
                </a>
                . Gas is paid on the chain you choose.
              </div>
            </div>
            <div className="step">
              <div className="num">3</div>
              <div>Return here, connect the minting wallet, and create an OpenSea listing.</div>
            </div>
          </div>
        </aside>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">Live floor</div>
            <h2>Trending on OpenSea</h2>
          </div>
          <Link href="/explore">Open the stacks →</Link>
        </div>
        {error ? <div className="banner warn">{error}</div> : null}
        {collections.length ? (
          <div className="grid">
            {collections.map((c) => (
              <CollectionCard key={c.collection || c.name} collection={c} />
            ))}
          </div>
        ) : (
          <div className="panel">
            <p className="muted">
              Featured starting points while the API key is offline:{" "}
              <Link href="/collection/doodles-official">Doodles</Link>,{" "}
              <Link href="/collection/pudgypenguins">Pudgy Penguins</Link>,{" "}
              <Link href="/collection/azuki">Azuki</Link>.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
