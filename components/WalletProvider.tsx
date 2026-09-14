"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type WalletState = {
  address: string | null;
  chainId: string | null;
  connecting: boolean;
  error: string | null;
  ethereum?: EthereumProvider;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (hexChainId: string) => Promise<void>;
  sendTransaction: (tx: Record<string, unknown>) => Promise<string>;
  signTypedData: (payload: Record<string, unknown>) => Promise<string>;
};

const Ctx = createContext<WalletState | null>(null);

function getEth(): EthereumProvider | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: EthereumProvider }).ethereum;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eth = getEth();
    if (!eth?.on) return;
    const onAccounts = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setAddress(accounts?.[0] ?? null);
    };
    const onChain = (...args: unknown[]) => setChainId(String(args[0] ?? ""));
    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    eth.request({ method: "eth_accounts" }).then((accs) => {
      const list = accs as string[];
      if (list?.[0]) setAddress(list[0]);
    }).catch(() => {});
    eth.request({ method: "eth_chainId" }).then((id) => setChainId(String(id))).catch(() => {});
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const connect = useCallback(async () => {
    const eth = getEth();
    if (!eth) {
      setError("No injected wallet found. Install MetaMask, Rabby, or Coinbase Wallet.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      setAddress(accounts[0] ?? null);
      const id = await eth.request({ method: "eth_chainId" });
      setChainId(String(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection rejected");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const switchChain = useCallback(async (hexChainId: string) => {
    const eth = getEth();
    if (!eth) throw new Error("No wallet");
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  }, []);

  const sendTransaction = useCallback(async (tx: Record<string, unknown>) => {
    const eth = getEth();
    if (!eth || !address) throw new Error("Connect a wallet first");
    return (await eth.request({ method: "eth_sendTransaction", params: [{ from: address, ...tx }] })) as string;
  }, [address]);

  const signTypedData = useCallback(async (payload: Record<string, unknown>) => {
    const eth = getEth();
    if (!eth || !address) throw new Error("Connect a wallet first");
    const typed = payload.typedData ?? payload;
    return (await eth.request({
      method: "eth_signTypedData_v4",
      params: [address, typeof typed === "string" ? typed : JSON.stringify(typed)],
    })) as string;
  }, [address]);

  const value = useMemo(
    () => ({
      address,
      chainId,
      connecting,
      error,
      ethereum: getEth(),
      connect,
      disconnect,
      switchChain,
      sendTransaction,
      signTypedData,
    }),
    [address, chainId, connecting, error, connect, disconnect, switchChain, sendTransaction, signTypedData],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWallet() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
