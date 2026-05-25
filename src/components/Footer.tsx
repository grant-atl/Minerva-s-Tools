import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, never>>;
  }
}

function AdBanner() {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (adRef.current && !pushed.current) {
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // ad blocked
      }
    }
  }, []);

  return (
    <div className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground mb-4">Ads keep us free</p>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-1374116607755732"
          data-ad-slot="8015698376"
        />
      </div>
    </div>
  );
}

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
    <>
      <AdBanner />
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-3">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Minerva Tools. Free & open design utilities.
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
    </>
  );
}
