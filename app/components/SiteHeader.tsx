import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Playparts home">
        PLAYPARTS<span className="wordmark-mark">/</span>
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        <Link href="/#skills-heading">Browse</Link>
        <a className="github-link" href="https://github.com/soulglider009/playparts">
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}
