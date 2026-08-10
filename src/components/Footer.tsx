import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

function useKonamiCode() {
  const navigate = useNavigate();
  const pos = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[pos.current]) {
        pos.current++;
        if (pos.current === KONAMI.length) {
          pos.current = 0;
          navigate("/98");
        }
      } else {
        pos.current = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
}

export default function Footer() {
  useKonamiCode();

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-3">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <a
            href="https://github.com/grant-atl/Minerva-s-Tools"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Minerva Tools. Free, focused browser utilities.
          <Link
            to="/98"
            className="ml-1 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors text-[10px] no-underline"
            title=""
          >
            98
          </Link>
        </p>
      </div>
    </footer>
  );
}
