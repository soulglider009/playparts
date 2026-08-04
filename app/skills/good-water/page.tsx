import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { WaterComparison } from "../../components/WaterComparison";

export default function GoodWaterPage() {
  return (
    <main>
      <SiteHeader />

      <section className="skill-detail-title">
        <Link className="back-link" href="/">← ALL SKILLS</Link>
        <div>
          <h1>good-water</h1>
          <div className="detail-tags">
            <span>VISUAL</span>
            <span>CANVAS 2D</span>
            <span>PROTOTYPE</span>
          </div>
        </div>
      </section>

      <WaterComparison />

      <section className="skill-information" aria-labelledby="about-heading">
        <div className="information-lead">
          <span className="eyebrow">ABOUT THIS PART</span>
          <h2 id="about-heading">Water with depth, motion, and response.</h2>
        </div>
        <div className="information-copy">
          <p>
            A reusable Canvas water recipe: layered wave scales, depth color,
            moving highlights, buoyancy cues, and wakes connected to moving objects.
          </p>
          <dl className="skill-facts">
            <div><dt>Status</dt><dd>Prototype</dd></div>
            <div><dt>Runtime</dt><dd>Canvas 2D</dd></div>
            <div><dt>Verification</dt><dd>Not yet claimed</dd></div>
          </dl>
        </div>
      </section>

      <section className="part-breakdown" aria-label="What is included">
        <article><span>01</span><h3>Layered motion</h3><p>Several wave scales move independently without turning into visual noise.</p></article>
        <article><span>02</span><h3>Object response</h3><p>Boats create directional wakes and sit inside the water instead of above it.</p></article>
        <article><span>03</span><h3>Reusable recipe</h3><p>The visual hierarchy and checks are packaged for use in another game.</p></article>
      </section>

      <section className="truth-note">
        <span>VERIFICATION NOTE</span>
        <p>This is a crafted prototype, not yet a verified model-vs-skill benchmark.</p>
        <a href="https://github.com/soulglider009/playparts/tree/main/skills/good-water">
          View the skill ↗
        </a>
      </section>

      <footer className="catalog-footer">
        <span>PLAYPARTS/</span>
        <Link href="/">Browse skills ↑</Link>
      </footer>
    </main>
  );
}
