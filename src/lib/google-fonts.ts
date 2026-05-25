export interface GoogleFont {
  name: string;
  category: "Sans Serif" | "Serif" | "Monospace" | "Display";
}

export const GOOGLE_FONTS: GoogleFont[] = [
  // Sans-serif
  { name: "Inter", category: "Sans Serif" },
  { name: "Roboto", category: "Sans Serif" },
  { name: "Open Sans", category: "Sans Serif" },
  { name: "Montserrat", category: "Sans Serif" },
  { name: "Poppins", category: "Sans Serif" },
  { name: "Lato", category: "Sans Serif" },
  { name: "Nunito", category: "Sans Serif" },
  { name: "Raleway", category: "Sans Serif" },
  { name: "Work Sans", category: "Sans Serif" },
  { name: "DM Sans", category: "Sans Serif" },
  { name: "Space Grotesk", category: "Sans Serif" },
  { name: "Plus Jakarta Sans", category: "Sans Serif" },
  { name: "Manrope", category: "Sans Serif" },
  { name: "Outfit", category: "Sans Serif" },
  { name: "Sora", category: "Sans Serif" },
  // Serif
  { name: "Playfair Display", category: "Serif" },
  { name: "Merriweather", category: "Serif" },
  { name: "Lora", category: "Serif" },
  { name: "Source Serif 4", category: "Serif" },
  { name: "Libre Baskerville", category: "Serif" },
  { name: "Crimson Text", category: "Serif" },
  { name: "EB Garamond", category: "Serif" },
  { name: "Cormorant Garamond", category: "Serif" },
  { name: "DM Serif Display", category: "Serif" },
  { name: "Fraunces", category: "Serif" },
  // Mono
  { name: "JetBrains Mono", category: "Monospace" },
  { name: "Fira Code", category: "Monospace" },
  { name: "Source Code Pro", category: "Monospace" },
  { name: "IBM Plex Mono", category: "Monospace" },
  // Display
  { name: "Bebas Neue", category: "Display" },
  { name: "Oswald", category: "Display" },
  { name: "Archivo Black", category: "Display" },
  { name: "Anton", category: "Display" },
  { name: "Righteous", category: "Display" },
];

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string) {
  if (loadedFonts.has(fontName)) return;
  loadedFonts.add(fontName);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
