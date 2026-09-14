import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { WalletProvider } from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "Harbor Press — Publish NFTs to OpenSea",
  description:
    "Prepare ERC-721 metadata, mint through OpenSea Studio, and list items on the OpenSea marketplace from one desk.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Header />
          {children}
          <footer className="footer">
            <div className="wrap">
              Harbor Press is an independent publisher desk. NFT media and collection data come from the OpenSea API.
              Listings settle on OpenSea Seaport.{" "}
              <a href="https://opensea.io" target="_blank" rel="noreferrer">
                OpenSea
              </a>
              {" · "}
              <a href="https://docs.opensea.io" target="_blank" rel="noreferrer">
                API docs
              </a>
            </div>
          </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
