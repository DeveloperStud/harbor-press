"use client";

import { useState } from "react";
import { CHAINS, chainById, shortAddress } from "@/lib/chains";
import { useWallet } from "@/components/WalletProvider";
import { NftCard } from "@/components/NftCard";
import type { OpenSeaNft } from "@/lib/types";

type Owned = OpenSeaNft & { chain?: string };

export default function StudioPage() {
  const wallet = useWallet();
  const [chain, setChain] = useState("base");
  const [nfts, setNfts] = useState<Owned[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Owned | null>(null);
  const [price, setPrice] = useState("0.05");
  const [currency, setCurrency] = useState("native");
  const [actions, setActions] = useState<unknown>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function loadOwned() {
    if (!wallet.address) {
      await wallet.connect();
    }
    const address = wallet.address;
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/os/chain/${chain}/account/${address}/nfts?limit=50`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not load wallet NFTs");
      const list = (json.nfts || []) as OpenSeaNft[];
      setNfts(list.map((n) => ({ ...n, chain })));
      if (!list.length) setError("No NFTs returned for this wallet on this chain.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  async function requestListing() {
    if (!wallet.address || !selected) return;
    setError(null);
    setActions(null);
    setTxHash(null);
    const item = {
      chain: selected.chain || chain,
      contract: selected.contract,
      token_address: selected.contract,
      identifier: selected.identifier,
      token_id: selected.identifier,
      quantity: 1,
      price: {
        value: price,
        currency,
      },
    };
    try {
      const res = await fetch("/api/listings/actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          maker: wallet.address,
          includeCreatorFees: true,
          items: [item],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || JSON.stringify(json.detail || json));
      setActions(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Listing actions failed");
    }
  }

  async function runFirstAction() {
    if (!actions || typeof actions !== "object") return;
    const record = actions as Record<string, unknown>;
    const list =
      (record.actions as unknown[]) ||
      (record.transactions as unknown[]) ||
      (record.data ? [record.data] : [actions]);
    const first = list[0] as Record<string, unknown> | undefined;
    if (!first) {
      setError("OpenSea returned no executable action.");
      return;
    }
    try {
      if (first.to || first.data || first.transaction) {
        const tx = (first.transaction as Record<string, unknown>) || first;
        const hash = await wallet.sendTransaction({
          to: tx.to,
          data: tx.data,
          value: tx.value || "0x0",
        });
        setTxHash(hash);
        return;
      }
      if (first.typedData || first.domain || first.message) {
        const sig = await wallet.signTypedData(first);
        setTxHash(`signed:${sig.slice(0, 18)}…`);
        return;
      }
      setError("Action shape is not a raw transaction or typed-data payload. Inspect the JSON and sign in OpenSea if needed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet rejected the action");
    }
  }

  const explorer = chainById(chain).explorer;

  return (
    <main className="wrap section">
      <div className="kicker">Press studio</div>
      <h1>List on OpenSea</h1>
      <p className="lede">
        Connect the wallet that holds the minted token. Harbor asks OpenSea for Seaport listing actions, then your
        wallet signs.
      </p>

      <div className="panel stack" style={{ marginTop: 18 }}>
        <div className="row">
          <div>
            <label>Chain</label>
            <select value={chain} onChange={(e) => setChain(e.target.value)}>
              {CHAINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Wallet</label>
            <input readOnly value={wallet.address || "Not connected"} />
          </div>
        </div>
        <div className="actions">
          <button className="btn" onClick={loadOwned} disabled={loading}>
            {loading ? "Reading OpenSea…" : "Load my NFTs"}
          </button>
          {!wallet.address ? (
            <button className="btn ghost" onClick={wallet.connect}>
              Connect wallet
            </button>
          ) : null}
        </div>
        {wallet.error ? <div className="banner warn">{wallet.error}</div> : null}
        {error ? <div className="banner warn">{error}</div> : null}
      </div>

      <div className="grid" style={{ marginTop: 20 }}>
        {nfts.map((nft) => (
          <button
            key={`${nft.contract}-${nft.identifier}`}
            className="card"
            style={{ textAlign: "left", padding: 0, borderColor: selected === nft ? "var(--sea)" : undefined }}
            onClick={() => setSelected(nft)}
          >
            <NftCard nft={nft} chain={chain} linked={false} />
          </button>
        ))}
      </div>

      {selected ? (
        <div className="panel stack" style={{ marginTop: 22 }}>
          <h2>List {selected.name || `#${selected.identifier}`}</h2>
          <p className="muted">
            {shortAddress(selected.contract)} / {selected.identifier} on {chain}
          </p>
          <div className="row">
            <div>
              <label>Price</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="native">Native ({chainById(chain).native})</option>
                <option value="WETH">WETH</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>
          <div className="actions">
            <button className="btn sea" onClick={requestListing}>
              Request OpenSea listing actions
            </button>
            <button className="btn" onClick={runFirstAction} disabled={!actions}>
              Sign / send first action
            </button>
            {selected.opensea_url ? (
              <a className="btn ghost" href={selected.opensea_url} target="_blank" rel="noreferrer">
                View on OpenSea
              </a>
            ) : null}
          </div>
          {txHash ? (
            <div className="banner ok">
              Wallet result:{" "}
              {txHash.startsWith("0x") ? (
                <a href={`${explorer}/tx/${txHash}`} target="_blank" rel="noreferrer">
                  {txHash}
                </a>
              ) : (
                txHash
              )}
            </div>
          ) : null}
          {actions ? <pre>{JSON.stringify(actions, null, 2)}</pre> : null}
        </div>
      ) : null}
    </main>
  );
}
