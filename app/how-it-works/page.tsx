import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="wrap section">
      <div className="kicker">Architecture</div>
      <h1>How Harbor Press uses OpenSea</h1>
      <p className="lede">
        OpenSea does not mint an image for you through the public REST API. Publishing is a three-layer pipeline:
        metadata, contract, listing.
      </p>

      <div className="split" style={{ marginTop: 28 }}>
        <article className="panel stack">
          <h2>What this site does</h2>
          <p>
            Builds OpenSea-standard token metadata (<code>name</code>, <code>description</code>, <code>image</code>,
            <code>attributes</code>, optional <code>animation_url</code>).
          </p>
          <p>
            Proxies the OpenSea API from the server so the API key never reaches the browser. Endpoints used:
          </p>
          <ul>
            <li>
              <code>GET /api/v2/collections/trending</code>
            </li>
            <li>
              <code>GET /api/v2/collections/{"{"}slug{"}"}</code>
            </li>
            <li>
              <code>GET /api/v2/collection/{"{"}slug{"}"}/nfts</code>
            </li>
            <li>
              <code>GET /api/v2/chain/{"{"}chain{"}"}/account/{"{"}address{"}"}/nfts</code>
            </li>
            <li>
              <code>GET /api/v2/chain/{"{"}chain{"}"}/contract/{"{"}address{"}"}/nfts/{"{"}id{"}"}</code>
            </li>
            <li>
              <code>POST /api/v2/listings/actions</code> — approvals + Seaport signing payload
            </li>
          </ul>
          <p>
            After mint, Studio loads your wallet NFTs and asks OpenSea for listing actions. Your wallet signs. The
            order lands on the OpenSea orderbook.
          </p>
        </article>
        <article className="panel stack">
          <h2>What OpenSea Studio does</h2>
          <p>
            Collection deploy and item mint still happen in{" "}
            <a href="https://opensea.io/studio" target="_blank" rel="noreferrer">
              OpenSea Studio
            </a>
            : you publish an ERC-721 or ERC-1155 contract, then create items. Harbor Press cannot skip that step
            without a contract you already own.
          </p>
          <p>
            Official references:{" "}
            <a href="https://docs.opensea.io" target="_blank" rel="noreferrer">
              docs.opensea.io
            </a>
            ,{" "}
            <a href="https://docs.opensea.io/reference/opensea-sdk" target="_blank" rel="noreferrer">
              @opensea/sdk
            </a>
            ,{" "}
            <a href="https://support.opensea.io/en/articles/8867023-how-do-i-create-an-nft" target="_blank" rel="noreferrer">
              How do I create an NFT?
            </a>
          </p>
          <Link className="btn sea" href="/publish">
            Open the compositor
          </Link>
        </article>
      </div>
    </main>
  );
}
