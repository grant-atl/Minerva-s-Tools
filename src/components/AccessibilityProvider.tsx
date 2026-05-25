import {
  createContext,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { ArrowsClockwise, Eye, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "minerva.a11y.v1";
const MAIN_CONTENT_ID = "main-content";
const TEXT_SCALE_OPTIONS = [100, 110, 120, 130] as const;

type TextScale = (typeof TEXT_SCALE_OPTIONS)[number];

type AccessibilitySettings = {
  textScale: TextScale;
  reducedMotion: boolean;
  highContrast: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
  increasedSpacing: boolean;
};

type StoredAccessibilitySettings = {
  v: 1;
  settings: AccessibilitySettings;
};

type AccessibilityContextValue = {
  settings: AccessibilitySettings;
  updateSetting: (
    key: keyof AccessibilitySettings,
    value: AccessibilitySettings[keyof AccessibilitySettings],
  ) => void;
  resetSettings: () => void;
};

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textScale: 100,
  reducedMotion: false,
  highContrast: false,
  underlineLinks: false,
  readableFont: false,
  increasedSpacing: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  const storage = window.localStorage as Storage | undefined;
  if (!storage) return null;
  if (typeof storage.getItem !== "function") return null;
  if (typeof storage.setItem !== "function") return null;
  return storage;
}

function getSystemDefaultSettings(): AccessibilitySettings {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return DEFAULT_SETTINGS;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const highContrast =
    window.matchMedia("(forced-colors: active)").matches ||
    window.matchMedia("(prefers-contrast: more)").matches;

  return {
    ...DEFAULT_SETTINGS,
    reducedMotion,
    highContrast,
  };
}

function isTextScale(value: unknown): value is TextScale {
  return typeof value === "number" && TEXT_SCALE_OPTIONS.includes(value as TextScale);
}

function normalizeSettings(value: Partial<AccessibilitySettings> | null | undefined): AccessibilitySettings {
  return {
    textScale: isTextScale(value?.textScale) ? value.textScale : DEFAULT_SETTINGS.textScale,
    reducedMotion: value?.reducedMotion === true,
    highContrast: value?.highContrast === true,
    underlineLinks: value?.underlineLinks === true,
    readableFont: value?.readableFont === true,
    increasedSpacing: value?.increasedSpacing === true,
  };
}

function readStoredSettings(): AccessibilitySettings {
  const storage = getStorage();
  if (!storage) {
    return DEFAULT_SETTINGS;
  }

  const systemDefaults = getSystemDefaultSettings();

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return systemDefaults;
    }

    const parsed = JSON.parse(raw) as Partial<StoredAccessibilitySettings & AccessibilitySettings>;

    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.v === 1 &&
      parsed.settings &&
      typeof parsed.settings === "object"
    ) {
      return normalizeSettings(parsed.settings);
    }

    return normalizeSettings(parsed);
  } catch {
    return systemDefaults;
  }
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 p-2.5">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium leading-tight">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked === true)}
      />
    </div>
  );
}

function AccessibilityMenu({
  settings,
  updateSetting,
  resetSettings,
}: {
  settings: AccessibilitySettings;
  updateSetting: AccessibilityContextValue["updateSetting"];
  resetSettings: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const panelId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const triggerId = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const wasOpenRef = useRef(false);
  const announcementTimeoutRef = useRef<number | null>(null);

  const announce = useCallback((message: string) => {
    if (announcementTimeoutRef.current !== null) {
      window.clearTimeout(announcementTimeoutRef.current);
    }
    setAnnouncement("");
    announcementTimeoutRef.current = window.setTimeout(() => {
      setAnnouncement(message);
      announcementTimeoutRef.current = null;
    }, 10);
  }, []);

  useEffect(() => () => {
    if (announcementTimeoutRef.current !== null) {
      window.clearTimeout(announcementTimeoutRef.current);
    }
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = document.getElementById(panelId);
    if (panel instanceof HTMLElement) {
      panel.querySelector<HTMLElement>("[data-a11y-first-control]")?.focus();
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menuRef.current?.contains(target)) {
        closePanel();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
        return;
      }

      if (event.key !== "Tab") return;
      const panel = menuRef.current?.querySelector("[role='dialog']");
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closePanel, panelId]);

  useEffect(() => {
    if (!open && wasOpenRef.current) {
      const trigger = document.getElementById(triggerId);
      if (trigger instanceof HTMLElement) {
        trigger.focus();
      }
    }
    wasOpenRef.current = open;
  }, [open, triggerId]);

  const handleTextScaleChange = (size: TextScale) => {
    updateSetting("textScale", size);
    announce(`Text size set to ${size} percent.`);
  };

  const handleToggleChange = (
    key: keyof AccessibilitySettings,
    checked: boolean,
    label: string,
  ) => {
    updateSetting(key, checked);
    announce(`${label} ${checked ? "enabled" : "disabled"}.`);
  };

  const handleReset = () => {
    resetSettings();
    announce("Accessibility settings reset to system defaults.");
  };

  return (
    <div ref={menuRef} className="fixed bottom-4 right-4 z-[70]">
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="absolute bottom-14 right-0 z-[71] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-4 rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5 text-sm">
              <h2 id={titleId} className="font-heading text-base font-medium">Accessibility</h2>
              <p id={descriptionId} className="text-muted-foreground">Adjust readability and motion preferences.</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Close accessibility menu"
              onClick={closePanel}
            >
              <X size={14} weight="bold" />
            </Button>
          </div>

          <section>
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Text Size
            </p>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {TEXT_SCALE_OPTIONS.map((size) => (
                <Button
                  key={size}
                  type="button"
                  data-a11y-first-control={size === TEXT_SCALE_OPTIONS[0] ? "true" : undefined}
                  size="xs"
                  variant={settings.textScale === size ? "default" : "outline"}
                  onClick={() => handleTextScaleChange(size)}
                >
                  {size}%
                </Button>
              ))}
            </div>
          </section>

          <div className="space-y-2">
            <ToggleRow
              id="a11y-reduced-motion"
              label="Reduce motion"
              description="Minimizes animations and transitions."
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => handleToggleChange("reducedMotion", checked, "Reduce motion")}
            />
            <ToggleRow
              id="a11y-high-contrast"
              label="High contrast"
              description="Increases separation between text and surfaces."
              checked={settings.highContrast}
              onCheckedChange={(checked) => handleToggleChange("highContrast", checked, "High contrast")}
            />
            <ToggleRow
              id="a11y-underline-links"
              label="Underline links"
              description="Keeps link styling explicit across the UI."
              checked={settings.underlineLinks}
              onCheckedChange={(checked) => handleToggleChange("underlineLinks", checked, "Underline links")}
            />
            <ToggleRow
              id="a11y-readable-font"
              label="Readable font"
              description="Uses a legibility-focused system font stack."
              checked={settings.readableFont}
              onCheckedChange={(checked) => handleToggleChange("readableFont", checked, "Readable font")}
            />
            <ToggleRow
              id="a11y-increased-spacing"
              label="Increased spacing"
              description="Adds line and letter spacing for readability."
              checked={settings.increasedSpacing}
              onCheckedChange={(checked) => handleToggleChange("increasedSpacing", checked, "Increased spacing")}
            />
          </div>

          <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleReset}>
            <ArrowsClockwise size={14} weight="bold" />
            Reset Defaults
          </Button>
        </div>
      )}

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <Button
        id={triggerId}
        type="button"
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg ring-1 ring-border/60"
        aria-label={open ? "Close accessibility menu" : "Open accessibility menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Eye size={18} weight="duotone" />
      </Button>
    </div>
  );
}

export default function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(readStoredSettings);
  const { pathname, key } = useLocation();
  const isWin98Route = pathname === "/98";

  const updateSetting = useCallback(
    (
      key: keyof AccessibilitySettings,
      value: AccessibilitySettings[keyof AccessibilitySettings],
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(getSystemDefaultSettings());
  }, []);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const payload: StoredAccessibilitySettings = { v: 1, settings };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [settings]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const activeSettings = isWin98Route ? DEFAULT_SETTINGS : settings;

    root.dataset.a11yTextScale = String(activeSettings.textScale);
    root.classList.toggle("a11y-reduced-motion", activeSettings.reducedMotion);
    root.classList.toggle("a11y-high-contrast", activeSettings.highContrast);
    root.classList.toggle("a11y-underline-links", activeSettings.underlineLinks);
    root.classList.toggle("a11y-readable-font", activeSettings.readableFont);
    root.classList.toggle("a11y-increased-spacing", activeSettings.increasedSpacing);
  }, [settings, isWin98Route]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const frame = window.requestAnimationFrame(() => {
      const mains = document.querySelectorAll<HTMLElement>("main");

      const currentTargets = document.querySelectorAll<HTMLElement>(`#${MAIN_CONTENT_ID}`);
      currentTargets.forEach((target) => target.removeAttribute("id"));

      if (mains.length > 0) {
        mains[0].id = MAIN_CONTENT_ID;
        return;
      }

      const fallback = document.querySelector<HTMLElement>("#root > *");
      if (fallback) {
        fallback.id = MAIN_CONTENT_ID;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, key]);

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      resetSettings,
    }),
    [settings, updateSetting, resetSettings],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {!isWin98Route && (
        <AccessibilityMenu
          settings={settings}
          updateSetting={updateSetting}
          resetSettings={resetSettings}
        />
      )}
    </AccessibilityContext.Provider>
  );
}
