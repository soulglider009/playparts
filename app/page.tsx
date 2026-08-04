import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";

const wantedParts = [
  { name: "3d-water", type: "NEXT BUILD", look: "wanted-water" },
  { name: "2d-grass", type: "OPEN SLOT", look: "wanted-grass" },
  { name: "boxy-character", type: "OPEN SLOT", look: "wanted-character" },
  { name: "great-pathing", type: "OPEN SLOT", look: "wanted-pathing" },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="browser catalog-browser" aria-labelledby="skills-heading">
        <div className="browser-bar catalog-titlebar">
          <h1 id="skills-heading">Skills for making AI web games more easily</h1>
          <div className="filter-row" aria-label="Skill filters">
            <span className="filter-active">All</span>
            <span>Visual</span>
            <span>Systems</span>
          </div>
        </div>

        <div className="catalog-grid">
          <Link className="skill-card skill-card-water" href="/skills/good-water">
            <div className="card-visual water-card-visual" aria-hidden="true">
              <span className="water-line water-line-one" />
              <span className="water-line water-line-two" />
              <span className="water-line water-line-three" />
              <span className="mini-boat"><i /></span>
              <span className="live-pill">LIVE DEMO</span>
            </div>
            <div className="card-caption">
              <div>
                <span className="card-type">VISUAL · CANVAS 2D</span>
                <h3>good-water</h3>
              </div>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </div>
          </Link>

          {wantedParts.map((part) => (
            <article className="skill-card wanted-card" key={part.name}>
              <div className={`card-visual wanted-visual ${part.look}`} aria-hidden="true">
                <span />
                <i />
              </div>
              <div className="card-caption">
                <div>
                  <span className="card-type">{part.type}</span>
                  <h3>{part.name}</h3>
                </div>
              </div>
            </article>
          ))}

          <a
            className="skill-card submit-card"
            href="https://github.com/soulglider009/playparts"
          >
            <div className="card-visual submit-mark" aria-hidden="true">+</div>
            <div className="card-caption">
              <div>
                <span className="card-type">OPEN SOURCE</span>
                <h3>Submit a part</h3>
              </div>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </div>
          </a>
        </div>
      </section>

      <footer className="catalog-footer">
        <span>PLAYPARTS/</span>
        <a href="https://github.com/soulglider009/playparts">GitHub ↗</a>
      </footer>
    </main>
  );
}
