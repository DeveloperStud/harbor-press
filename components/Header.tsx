"use client";

import Link from "next/link";
import { WalletButton } from "./WalletButton";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href="/" className="brand">
          <span className="mark">∿</span>
          Harbor Press
        </Link>
        <nav className="nav-links">
          <Link href="/publish">Publish</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/explore">Explore OpenSea</Link>
          <Link href="/how-it-works">How it works</Link>
        </nav>
        <WalletButton />
      </div>
    </header>
  );
}
