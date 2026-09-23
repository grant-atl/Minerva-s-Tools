import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code, MagnifyingGlass, X } from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import HomeNav from "@/components/HomeNav";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { tools, categories, type Tool } from "@/lib/tools-data";

const availableTools = tools.filter((tool) => tool.tier === 1);
const swatches = ["#dceacb", "#baff66", "#83ac59", "#4d6838", "#273920"];
const categoryAnchor = (category: string) => `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export default function Index() {
  const [query, setQuery] = useState("");
  const { hash } = useLocation();
  const category = categories.find((item) => hash === `#${categoryAnchor(item)}`);
  const shownTools = availableTools.filter((tool) =>
    (!category || tool.category === category) &&
    `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Minerva's Tools — Free Utilities for Designers & Developers"
        description={`${availableTools.length} free, focused browser utilities for designers and developers. No account required.`}
        canonical="/"
      />
      <HomeNav />
      <main className="lab-container">
        <section className="lab-hero" aria-labelledby="home-heading">
          <div className="lab-hero-copy ease-up">
            <h1 id="home-heading">Tools for designers<br />and developers.</h1>
            <p>45 free tools for color, CSS, images, and code.</p>
            <div className="lab-hero-actions">
              <a href="#tools" className="lab-button lab-button-primary">Browse tools <ArrowDown size={16} aria-hidden="true" /></a>
              <Link to="/about" className="lab-text-link">About <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="lab-facts">
              <span><Check size={12} aria-hidden="true" /> {availableTools.length} free tools</span>
              <span><Check size={12} aria-hidden="true" /> No sign-up</span>
              <span><Check size={12} aria-hidden="true" /> Runs in your browser</span>
            </div>
          </div>
          <div className="lab-hero-art ease-up ease-up-delay-1" aria-label="Try a tool">
            <div className="lab-dot-field" aria-hidden="true" />
            <Link to="/tools/typography-scale" className="lab-art-type lab-art-card" aria-label="Open Typography Scale">
              <span className="lab-art-label">Typography <ArrowUpRight size={13} aria-hidden="true" /></span>
              <span className="lab-type-sample" aria-hidden="true">Aa<span>Bb</span></span>
              <span className="lab-art-detail">Typography Scale</span>
            </Link>
            <Link to="/tools/palette" className="lab-art-palette lab-art-card" aria-label="Open Color Palette Generator">
              <span className="lab-art-label">Color palette <ArrowUpRight size={13} aria-hidden="true" /></span>
              <span className="lab-swatches" aria-hidden="true">{swatches.map((color) => <i key={color} style={{ background: color }} />)}</span>
              <span className="lab-art-detail"><span className="lab-status-dot" /> Color Palette Generator <span>#BAFF66</span></span>
            </Link>
            <Link to="/tools/json-formatter" className="lab-art-code lab-art-card" aria-label="Open JSON Formatter">
              <span className="lab-art-label"><Code size={15} aria-hidden="true" /> JSON Formatter <ArrowUpRight size={13} aria-hidden="true" /></span>
              <code aria-hidden="true"><span>{"{"}</span><br />&nbsp;&nbsp;"name": <b>"Minerva"</b>,<br />&nbsp;&nbsp;"tools": <b>45</b><br /><span>{"}"}</span></code>
            </Link>
          </div>
        </section>

        <section id="tools" className="lab-collection" aria-labelledby="tools-heading">
          <div className="lab-collection-heading">
            <div><h2 id="tools-heading">Tools</h2></div>
            <span className="lab-collection-count" role="status">{shownTools.length} {shownTools.length === 1 ? "tool" : "tools"}{category ? ` in ${category}` : " available"}</span>
          </div>
          <div className="lab-toolbar">
            <nav className="lab-filters" aria-label="Filter tools by category">
              <Link to="#tools" preventScrollReset aria-current={!category ? "true" : undefined} className={!category ? "active" : ""}>All tools <span>{availableTools.length}</span></Link>
              {categories.map((item) => (
                <Link key={item} id={categoryAnchor(item)} to={`#${categoryAnchor(item)}`} preventScrollReset aria-current={category === item ? "true" : undefined} className={category === item ? "active" : ""}>{item === "Data/Dev" ? "Data & code" : item}</Link>
              ))}
            </nav>
            <div className="lab-search">
              <MagnifyingGlass size={16} aria-hidden="true" />
              <input type="search" aria-label="Search tools" placeholder="Search tools…" value={query} onChange={(event) => setQuery(event.target.value)} />
              {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={14} aria-hidden="true" /></button>}
            </div>
          </div>
          {shownTools.length ? (
            <div className="lab-tool-grid">
              {shownTools.map((tool) => <ToolCard key={tool.route} tool={tool} index={availableTools.indexOf(tool)} />)}
            </div>
          ) : (
            <div className="lab-empty">
              <MagnifyingGlass size={28} aria-hidden="true" />
              <h3>No tools found.</h3>
              <p>Try another search or explore the full collection.</p>
              <Link to="#tools" className="lab-button lab-button-secondary" onClick={() => setQuery("")}>Show all tools <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <Link to={tool.route} className="lab-tool-card">
      <div className="lab-card-stage" aria-hidden="true">
        <span className="lab-card-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="lab-card-category"><span className="lab-status-dot" /> {tool.category}</span>
        <ToolPreview tool={tool} />
        <span className="lab-card-open">Open tool <ArrowUpRight size={13} /></span>
      </div>
      <div className="lab-card-info"><div><h3>{tool.name}</h3><p>{tool.description}</p></div><ArrowUpRight size={16} aria-hidden="true" /></div>
    </Link>
  );
}

function ToolPreview({ tool }: { tool: Tool }) {
  if (tool.route === "/tools/qr-code") return <QRCodeSVG value="https://minervas.tools" size={100} bgColor="transparent" fgColor="#baff66" />;
  if (tool.route === "/tools/gradient") return <div className="lab-preview-gradient" />;
  if (tool.route === "/tools/contrast") return <div className="lab-preview-contrast"><span>Aa</span><span>Aa</span></div>;
  if (tool.route === "/tools/box-shadow") return <div className="lab-preview-shadow" />;
  if (/typography|font-pairing|lorem|text-utilities/.test(tool.route)) return <div className="lab-preview-type">Aa<span>Bb</span><small>Font preview</small></div>;
  if (tool.category === "Colors") return <div className="lab-preview-swatches">{swatches.map((color) => <i key={color} style={{ background: color }} />)}</div>;
  if (tool.category === "Layout") return <div className="lab-preview-grid">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>;
  if (tool.category === "Data/Dev") return <div className="lab-preview-code"><span>{"{ "}</span><br />&nbsp;&nbsp;"name": <b>"Minerva"</b>,<br />&nbsp;&nbsp;"tools": <b>45</b><br /><span>{"}"}</span></div>;
  if (tool.category === "Image") return <div className="lab-preview-image"><span /><i /></div>;
  const Icon = tool.icon;
  return <div className="lab-preview-icon"><Icon size={58} weight="thin" /></div>;
}
