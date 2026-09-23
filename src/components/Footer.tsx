import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="lab-container">
      <div className="lab-footer">
        <div><Link to="/" className="lab-footer-brand">Minerva’s Tools<span>.</span></Link><p>Free design and development tools.</p></div>
        <nav aria-label="Footer navigation">
          <Link to="/about">About</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link>
          <a href="https://github.com/grant-atl/Minerva-s-Tools" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </nav>
        <p className="lab-copyright">© {new Date().getFullYear()} Minerva&apos;s Tools.</p>
      </div>
    </footer>
  );
}
