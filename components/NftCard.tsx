import Link from "next/link";
import type { OpenSeaNft } from "@/lib/types";

export function NftCard({
  nft,
  chain,
  href,
  linked = true,
}: {
  nft: OpenSeaNft;
  chain?: string;
  href?: string;
  linked?: boolean;
}) {
  const img = nft.display_image_url || nft.image_url;
  const tokenId = nft.identifier || "0";
  const contract = nft.contract || "";
  const to = href || (chain && contract ? `/nft/${chain}/${contract}/${tokenId}` : nft.opensea_url || "#");
  const inner = (
    <>
      <div className="media">
        {img ? <img src={img} alt={nft.name || `Token ${tokenId}`} /> : <div style={{ padding: 16 }}>No image</div>}
      </div>
      <div className="body">
        <div className="name">{nft.name || `#${tokenId}`}</div>
        <div className="meta">{nft.collection || nft.token_standard || "NFT"}</div>
      </div>
    </>
  );
  if (!linked || href === "#") {
    return <div className="card">{inner}</div>;
  }
  return (
    <Link href={to} className="card">
      {inner}
    </Link>
  );
}
