import Link from "next/link";
import type { OpenSeaCollection } from "@/lib/types";

export function CollectionCard({ collection }: { collection: OpenSeaCollection }) {
  const slug = collection.collection || "";
  return (
    <Link href={slug ? `/collection/${slug}` : "#"} className="card">
      <div className="media">
        {collection.image_url ? (
          <img src={collection.image_url} alt={collection.name || slug} />
        ) : (
          <div style={{ padding: 16 }}>No artwork</div>
        )}
      </div>
      <div className="body">
        <div className="name">{collection.name || slug}</div>
        <div className="meta">
          {collection.contracts?.[0]?.chain || "multichain"}
          {collection.total_supply ? ` · ${collection.total_supply} items` : ""}
        </div>
      </div>
    </Link>
  );
}
