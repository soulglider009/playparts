import { WaterComparison } from "./components/WaterComparison";

const proofPoints = [
  {
    number: "01",
    title: "Depth before detail",
    body: "The skilled version builds a readable body of water from depth bands, moving light, and overlapping wave scales—not a blue fill with lines on top.",
  },
  {
    number: "02",
    title: "The boat belongs there",
    body: "Speed and heading shape a persistent wake. The water reacts to the object instead of behaving like an animated background.",
  },
  {
    number: "03",
    title: "Variation without noise",
    body: "Highlights, foam, and swell patterns repeat slowly enough to feel natural while staying legible at game scale.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Playparts home">
          PLAYPARTS<span className="wordmark-mark">/</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#proof">Why it works</a>
          <a href="#skill">The skill</a>
          <a
            className="github-link"
            href="https://github.com/soulglider009/playparts"
          >
            GitHub ↗
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">
          <span>DEMO 001</span>
          <span>GOOD WATER</span>
          <span>WEB / CANVAS</span>
        </div>
        <div className="hero-copy">
          <h1>
            THE HARD PARTS,
            <br />
            <em>ALREADY SOLVED.</em>
          </h1>
          <p>
            Playparts is an open toolbox of AI game skills that have to prove
            they are useful. First test: can a skill turn generic one-shot
            water into something you actually want in your game?
          </p>
        </div>
      </section>

      <WaterComparison />

      <section className="proof-section" id="proof">
        <div className="section-heading">
          <span className="eyebrow">THE USEFULNESS TEST</span>
          <h2>Working once isn&apos;t enough.</h2>
          <p>
            Same scene. Same boat. Same controls. Only the water system
            changes. A Playpart earns its place by making a result more
            reliable, less expensive, or meaningfully better to look at and
            play.
          </p>
        </div>

        <div className="proof-grid">
          {proofPoints.map((point) => (
            <article className="proof-card" key={point.number}>
              <span className="proof-number">{point.number}</span>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="skill-section" id="skill">
        <div className="skill-copy">
          <span className="eyebrow">FIRST PLAYPART</span>
          <h2>good-water</h2>
          <p>
            A focused Agent Skill for building stylized, responsive water in
            2D web games. It packages the visual hierarchy, motion model,
            interaction rules, and verification checklist that normally take
            repeated prompting to discover.
          </p>
          <div className="skill-meta">
            <span>CANVAS 2D</span>
            <span>INTERACTIVE</span>
            <span>OPEN SOURCE</span>
          </div>
          <a
            className="primary-link"
            href="https://github.com/soulglider009/playparts/tree/main/skills/good-water"
          >
            Read the skill on GitHub <span>↗</span>
          </a>
        </div>

        <div className="skill-terminal" aria-label="Example skill invocation">
          <div className="terminal-bar">
            <span>SKILL.md</span>
            <span>GOOD-WATER</span>
          </div>
          <pre>
            <code>{`$ use good-water to improve this lake

→ inspects the existing renderer
→ preserves the game's visual language
→ builds layered motion and depth
→ connects wakes to moving objects
→ verifies at game scale

result: a reusable water component,
        not another blue rectangle`}</code>
          </pre>
        </div>
      </section>

      <footer>
        <div className="footer-statement">
          <span>PLAYPARTS</span>
          <strong>Every skill has to earn its place.</strong>
        </div>
        <p>Open source experiments in useful AI game-making skills.</p>
      </footer>
    </main>
  );
}
