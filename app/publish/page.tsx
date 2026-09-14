"use client";

import { useMemo, useState } from "react";
import { CHAINS } from "@/lib/chains";
import { buildMetadata, metadataFilename } from "@/lib/metadata";
import type { TraitDraft } from "@/lib/types";

export default function PublishPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [animationUrl, setAnimationUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [chain, setChain] = useState("base");
  const [traits, setTraits] = useState<TraitDraft[]>([{ trait_type: "Medium", value: "Digital" }]);

  function onFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setPreview(result);
      if (!imageUrl) setImageUrl(`ipfs://REPLACE_WITH_CID/${file.name}`);
    };
    reader.readAsDataURL(file);
  }

  const metadata = useMemo(
    () =>
      buildMetadata({
        name: name || "Untitled work",
        description,
        image: imageUrl || (fileName ? `ipfs://REPLACE_WITH_CID/${fileName}` : ""),
        external_url: externalUrl,
        animation_url: animationUrl,
        attributes: traits,
      }),
    [name, description, imageUrl, fileName, externalUrl, animationUrl, traits],
  );

  function downloadMetadata() {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = metadataFilename(name || "untitled");
    a.click();
    URL.revokeObjectURL(url);
  }

  const studio = "https://opensea.io/studio";

  return (
    <main className="wrap section">
      <div className="kicker">Compositor</div>
      <h1>Publish a work</h1>
      <p className="lede">
        Compose OpenSea-ready metadata here. Pin the image to IPFS, mint the item in OpenSea Studio on {chain}, then
        list it from Studio in this app.
      </p>

      <div className="split" style={{ marginTop: 24 }}>
        <form className="stack panel" onSubmit={(e) => e.preventDefault()}>
          <label>Artwork</label>
          <label className="drop">
            <input
              type="file"
              accept="image/*,video/mp4"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {preview ? <img className="preview" src={preview} alt="Preview" /> : "Drop image or click to upload"}
            {fileName ? <div className="muted">{fileName}</div> : null}
          </label>

          <label>Title</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Night Harbor #01" />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should a collector read on OpenSea?"
          />

          <div className="row">
            <div>
              <label>Chain</label>
              <select value={chain} onChange={(e) => setChain(e.target.value)}>
                {CHAINS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                    {c.testnet ? " (testnet)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>External URL</label>
              <input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://" />
            </div>
          </div>

          <label>Image URI after pin (ipfs:// or https://)</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="ipfs://bafy…/art.png"
          />

          <label>Animation URI (optional)</label>
          <input
            value={animationUrl}
            onChange={(e) => setAnimationUrl(e.target.value)}
            placeholder="ipfs://…/loop.mp4"
          />

          <label>Traits</label>
          {traits.map((t, i) => (
            <div className="row" key={i}>
              <input
                value={t.trait_type}
                placeholder="trait_type"
                onChange={(e) => {
                  const next = [...traits];
                  next[i] = { ...next[i], trait_type: e.target.value };
                  setTraits(next);
                }}
              />
              <input
                value={t.value}
                placeholder="value"
                onChange={(e) => {
                  const next = [...traits];
                  next[i] = { ...next[i], value: e.target.value };
                  setTraits(next);
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn ghost"
            onClick={() => setTraits([...traits, { trait_type: "", value: "" }])}
          >
            Add trait
          </button>
        </form>

        <aside className="stack">
          <div className="panel stack">
            <div className="kicker">Token metadata</div>
            <pre>{JSON.stringify(metadata, null, 2)}</pre>
            <button className="btn" onClick={downloadMetadata}>
              Download metadata.json
            </button>
          </div>
          <div className="panel stack">
            <div className="kicker">Mint on OpenSea</div>
            <ol>
              <li>Pin the artwork and this JSON to IPFS (Pinata, NFT.Storage, or web3.storage).</li>
              <li>
                Open Studio and deploy a collection on <strong>{chain}</strong> if you do not already have a contract.
              </li>
              <li>Create the item with the pinned image and metadata.</li>
              <li>
                Come back to <a href="/studio">Harbor Studio</a> and list the minted token.
              </li>
            </ol>
            <a className="btn sea" href={studio} target="_blank" rel="noreferrer">
              Open OpenSea Studio
            </a>
            <a className="btn ghost" href="/studio">
              List after mint
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
