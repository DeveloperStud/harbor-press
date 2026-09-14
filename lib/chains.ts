export type ChainId = "ethereum" | "base" | "polygon" | "arbitrum" | "optimism" | "sepolia" | "base_sepolia";

export const CHAINS: {
  id: ChainId;
  label: string;
  hex: string;
  eip155: number;
  native: string;
  explorer: string;
  studio: string;
  testnet?: boolean;
}[] = [
  { id: "ethereum", label: "Ethereum", hex: "0x1", eip155: 1, native: "ETH", explorer: "https://etherscan.io", studio: "ethereum" },
  { id: "base", label: "Base", hex: "0x2105", eip155: 8453, native: "ETH", explorer: "https://basescan.org", studio: "base" },
  { id: "polygon", label: "Polygon", hex: "0x89", eip155: 137, native: "POL", explorer: "https://polygonscan.com", studio: "matic" },
  { id: "arbitrum", label: "Arbitrum", hex: "0xa4b1", eip155: 42161, native: "ETH", explorer: "https://arbiscan.io", studio: "arbitrum" },
  { id: "optimism", label: "Optimism", hex: "0xa", eip155: 10, native: "ETH", explorer: "https://optimistic.etherscan.io", studio: "optimism" },
  { id: "sepolia", label: "Sepolia", hex: "0xaa36a7", eip155: 11155111, native: "ETH", explorer: "https://sepolia.etherscan.io", studio: "sepolia", testnet: true },
  { id: "base_sepolia", label: "Base Sepolia", hex: "0x14a34", eip155: 84532, native: "ETH", explorer: "https://sepolia.basescan.org", studio: "base_sepolia", testnet: true },
];

export function chainById(id: string) {
  return CHAINS.find((c) => c.id === id) ?? CHAINS[0];
}

export function openseaAssetUrl(chain: string, address: string, tokenId: string) {
  return `https://opensea.io/item/${chain}/${address}/${tokenId}`;
}

export function openseaCollectionUrl(slug: string) {
  return `https://opensea.io/collection/${slug}`;
}

export function openseaStudioUrl() {
  return "https://opensea.io/studio";
}

export function shortAddress(addr?: string | null) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
