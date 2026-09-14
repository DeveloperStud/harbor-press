"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CollectionCard } from "@/components/CollectionCard";
import type { OpenSeaCollection } from "@/lib/types";

export default function ExplorePage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [timeframe, setTimeframe] = useState("one_day");
  const [collections, setCollections] = useState<OpenSeaCollection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadTrending(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/os/collections/trending?limit=24&timeframe=${timeframe}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "OpenSea request failed");
      setCollections(json.collections || json.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function goCollection(e: FormEvent) {
    e.preventDefault();
    if (!slug.trim()) return;
    router.push(`/collection/${encodeURIComponent(slug.trim())}`);
  }

  return (
    <main className="wrap section">
      <div className="kicker">Stacks</div>
      <h1>Explore OpenSea</h1>
      <p className="lede">Look up a collection slug or pull the live trending board from the OpenSea API.</p>

      <div className="split" style={{ marginTop: 20 }}>
        <form className="panel stack" onSubmit={goCollection}>
          <label>Collection slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="pudgypenguins" />
          <button className="btn sea" type="submit">
            Open collection
          </button>
        </form>
        <form className="panel stack" onSubmit={loadTrending}>
          <label>Trending window</label>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="one_hour">One hour</option>
            <option value="one_day">One day</option>
            <option value="seven_days">Seven days</option>
          </select>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Loading…" : "Load trending"}
          </button>
        </form>
      </div>

      {error ? <div className="banner warn">{error}</div> : null}
      <div className="grid" style={{ marginTop: 22 }}>
        {collections.map((c) => (
          <CollectionCard key={c.collection || c.name} collection={c} />
        ))}
      </div>
    </main>
  );
}
