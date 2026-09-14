"use client";

import { useWallet } from "./WalletProvider";
import { shortAddress } from "@/lib/chains";

export function WalletButton() {
  const { address, connecting, connect, disconnect, error } = useWallet();
  if (address) {
    return (
      <button className="btn ghost" onClick={disconnect} title={error || address}>
        {shortAddress(address)}
      </button>
    );
  }
  return (
    <button className="btn" onClick={connect} disabled={connecting}>
      {connecting ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
