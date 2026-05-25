import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tools, type Tool } from "@/lib/tools-data";
import "@/styles/win98.css";

interface WindowState {
  id: string;
  title: string;
  route: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  visible: boolean;
  minimized: boolean;
  maximized: boolean;
  originalBounds?: { x: number; y: number; width: number; height: number };
}

const TASKBAR_H = 28;
let zCounter = 1000;

// Map Phosphor icon names to simple emoji/text for Win98 aesthetic
function getToolEmoji(route: string): string {
  const map: Record<string, string> = {
    "/tools/palette": "🎨",
    "/tools/qr-code": "📱",
    "/tools/gradient": "🌈",
    "/tools/contrast": "👁️",
    "/tools/box-shadow": "🔲",
    "/tools/typography-scale": "🔤",
    "/tools/favicon": "⭐",
    "/tools/svg-to-css": "💻",
    "/tools/color-blindness": "👓",
    "/tools/font-pairing": "✒️",
    "/tools/spacing": "📏",
    "/tools/glassmorphism": "🧊",
    "/tools/neumorphism": "⚪",
    "/tools/tailwind-color": "🔍",
    "/tools/aspect-ratio": "📐",
    "/tools/px-rem": "↔️",
    "/tools/meta-preview": "🌐",
    "/tools/lorem-ipsum": "📝",
  };
  return map[route] || "📄";
}

export default function Win98Desktop() {
  const navigate = useNavigate();
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const availableTools = tools.filter((t) => t.tier === 1);
  const comingSoonTools = tools.filter((t) => t.tier !== 1);

  // Show ad popup after 3 seconds
  useEffect(() => {
    if (adDismissed) return;
    const timer = setTimeout(() => {
      openAdWindow();
    }, 3000);
    return () => clearTimeout(timer);
  }, [adDismissed]);

  const openAdWindow = () => {
    const existing = windows.find((w) => w.id === "ad-popup");
    if (existing) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === "ad-popup"
            ? { ...w, visible: true, minimized: false, zIndex: ++zCounter }
            : w
        )
      );
      setActiveWindowId("ad-popup");
      return;
    }
    const newWin: WindowState = {
      id: "ad-popup",
      title: "⚠️ Special Offer!!!",
      route: "",
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 50,
      width: 340,
      height: 220,
      zIndex: ++zCounter,
      visible: true,
      minimized: false,
      maximized: false,
    };
    setWindows((prev) => [...prev, newWin]);
    setActiveWindowId("ad-popup");
  };

  const openWindow = useCallback(
    (tool: Tool) => {
      const existing = windows.find((w) => w.id === tool.route);
      if (existing) {
        setWindows((prev) =>
          prev.map((w) =>
            w.id === tool.route
              ? { ...w, visible: true, minimized: false, zIndex: ++zCounter }
              : w
          )
        );
        setActiveWindowId(tool.route);
        return;
      }

      const newWin: WindowState = {
        id: tool.route,
        title: tool.name,
        route: tool.route,
        x: 60 + Math.random() * 200,
        y: 30 + Math.random() * 100,
        width: Math.min(800, window.innerWidth - 40),
        height: Math.min(550, window.innerHeight - 80),
        zIndex: ++zCounter,
        visible: true,
        minimized: false,
        maximized: false,
      };
      setWindows((prev) => [...prev, newWin]);
      setActiveWindowId(tool.route);
      setStartMenuOpen(false);
    },
    [windows]
  );

  const closeWindow = (id: string) => {
    if (id === "ad-popup") setAdDismissed(true);
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true, visible: false } : w))
    );
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            x: w.originalBounds?.x ?? 60,
            y: w.originalBounds?.y ?? 30,
            width: w.originalBounds?.width ?? 600,
            height: w.originalBounds?.height ?? 400,
          };
        }
        return {
          ...w,
          maximized: true,
          originalBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - TASKBAR_H,
        };
      })
    );
  };

  const focusWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: ++zCounter } : w))
    );
    setActiveWindowId(id);
  };

  const toggleTaskbarWindow = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;
    if (win.minimized || !win.visible) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, visible: true, minimized: false, zIndex: ++zCounter }
            : w
        )
      );
      setActiveWindowId(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent, id: string) => {
    if ((e.target as HTMLElement).closest(".win98-controls")) return;
    const win = windows.find((w) => w.id === id);
    if (!win || win.maximized) return;
    dragRef.current = { id, offsetX: e.clientX - win.x, offsetY: e.clientY - win.y };
    focusWindow(id);
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { id, offsetX, offsetY } = dragRef.current;
      const x = Math.max(0, e.clientX - offsetX);
      const y = Math.max(0, e.clientY - offsetY);
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
    };
    const onUp = () => {
      dragRef.current = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const timeStr = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="win98-root">
      {/* Desktop */}
      <div ref={desktopRef} className="win98-desktop" onClick={() => setStartMenuOpen(false)}>
        {/* Desktop Icons */}
        <div className="win98-icons">
          {/* Back to Minerva icon */}
          <div className="win98-icon" onDoubleClick={() => navigate("/")}>
            <div className="win98-icon-img">🏠</div>
            <span className="win98-icon-text">Minerva Home</span>
          </div>

          {availableTools.map((tool) => (
            <div
              key={tool.route}
              className="win98-icon"
              onDoubleClick={() => openWindow(tool)}
            >
              <div className="win98-icon-img">{getToolEmoji(tool.route)}</div>
              <span className="win98-icon-text">{tool.name}</span>
            </div>
          ))}

          {comingSoonTools.slice(0, 4).map((tool) => (
            <div key={tool.route} className="win98-icon win98-icon-disabled">
              <div className="win98-icon-img">{getToolEmoji(tool.route)}</div>
              <span className="win98-icon-text">{tool.name} (Soon)</span>
            </div>
          ))}
        </div>

        {/* Windows */}
        {windows.map((win) => {
          if (!win.visible) return null;
          const isActive = activeWindowId === win.id;

          return (
            <div
              key={win.id}
              className={`win98-window ${isActive ? "active" : "inactive"}`}
              style={{
                left: win.x,
                top: win.y,
                width: win.width,
                height: win.height,
                zIndex: win.zIndex,
              }}
              onClick={(e) => {
                e.stopPropagation();
                focusWindow(win.id);
              }}
            >
              <div
                className="win98-titlebar"
                onMouseDown={(e) => onMouseDown(e, win.id)}
              >
                <span className="win98-titlebar-text">{win.title}</span>
                <div className="win98-controls">
                  <button
                    className="win98-btn-ctrl"
                    onClick={() => minimizeWindow(win.id)}
                  >
                    _
                  </button>
                  <button
                    className="win98-btn-ctrl"
                    onClick={() => maximizeWindow(win.id)}
                  >
                    □
                  </button>
                  <button
                    className="win98-btn-ctrl win98-btn-close"
                    onClick={() => closeWindow(win.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="win98-content">
                {win.id === "ad-popup" ? (
                  <AdWindowContent onClose={() => closeWindow("ad-popup")} />
                ) : (
                  <iframe
                    src={win.route}
                    title={win.title}
                    className="win98-iframe"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Taskbar */}
      <div className="win98-taskbar">
        <button
          className={`win98-start-btn ${startMenuOpen ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setStartMenuOpen(!startMenuOpen);
          }}
        >
          <span className="win98-start-logo">🪟</span>
          Start
        </button>

        <div className="win98-taskbar-items">
          {windows.map((win) => (
            <button
              key={win.id}
              className={`win98-taskbar-item ${activeWindowId === win.id && win.visible ? "active" : ""}`}
              onClick={() => toggleTaskbarWindow(win.id)}
            >
              {win.title.length > 18 ? win.title.slice(0, 18) + "…" : win.title}
            </button>
          ))}
        </div>

        <div className="win98-clock">{timeStr}</div>
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="win98-start-menu" onClick={(e) => e.stopPropagation()}>
          <div className="win98-start-header">
            <span className="win98-start-header-text">Minerva 98</span>
          </div>
          <div className="win98-start-items">
            <div className="win98-start-item" onClick={() => { navigate("/"); setStartMenuOpen(false); }}>
              🏠 Back to Minerva
            </div>
            <div className="win98-start-separator" />
            {availableTools.map((tool) => (
              <div
                key={tool.route}
                className="win98-start-item"
                onClick={() => {
                  openWindow(tool);
                  setStartMenuOpen(false);
                }}
              >
                {getToolEmoji(tool.route)} {tool.name}
              </div>
            ))}
            <div className="win98-start-separator" />
            <div
              className="win98-start-item"
              onClick={() => { navigate("/"); setStartMenuOpen(false); }}
            >
              ⏻ Shut Down...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdWindowContent({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ padding: 12, fontFamily: "'MS Sans Serif', sans-serif", fontSize: 11, textAlign: "center" }}>
      <h3 style={{ fontSize: 14, marginBottom: 8, color: "#ff0000" }}>
        🎉 CONGRATULATIONS!!! 🎉
      </h3>
      <p style={{ marginBottom: 6 }}>
        You are the 1,000,000th visitor!
      </p>
      <p style={{ marginBottom: 12, fontSize: 10 }}>
        Just kidding. But Minerva's tools are actually free. No catch.
      </p>
      <div className="win98-marquee" style={{ fontSize: 10, color: "#0000ff", marginBottom: 12, overflow: "hidden", whiteSpace: "nowrap" }}>
        <span className="win98-marquee-text">★ Free design tools ★ No sign-up ★ 100% client-side ★ Privacy first ★</span>
      </div>
      <button
        style={{
          background: "#c0c0c0",
          border: "1px outset #c0c0c0",
          padding: "4px 16px",
          cursor: "pointer",
          fontSize: 11,
        }}
        onClick={onClose}
      >
        OK, I get it
      </button>
    </div>
  );
}
