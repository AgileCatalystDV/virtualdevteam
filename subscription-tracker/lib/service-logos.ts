/**
 * Service logo mapping — bekende diensten krijgen een logo (40–80px)
 * @Fede + @Alex — Fallback: category icon (🎬) blijft voor onbekende diensten
 *
 * Gebruikt Google Favicon API (gratis, geen key): favicons van domeinen
 */

/** Mapping: genormaliseerde naam → domein voor favicon */
const SERVICE_DOMAINS: Record<string, string> = {
  netflix: "netflix.com",
  "disney+": "disneyplus.com",
  disneyplus: "disneyplus.com",
  "amazon prime": "primevideo.com",
  "prime video": "primevideo.com",
  primevideo: "primevideo.com",
  spotify: "spotify.com",
  "apple music": "music.apple.com",
  "apple tv+": "tv.apple.com",
  "apple tv": "tv.apple.com",
  "hbo max": "hbomax.com",
  hbomax: "hbomax.com",
  "youtube premium": "youtube.com",
  youtube: "youtube.com",
  deezer: "deezer.com",
  "google one": "one.google.com",
  "microsoft 365": "microsoft.com",
  "office 365": "microsoft.com",
  dropbox: "dropbox.com",
  icloud: "icloud.com",
  "adobe creative cloud": "adobe.com",
  adobe: "adobe.com",
  "linkedin premium": "linkedin.com",
  linkedin: "linkedin.com",
  "canva pro": "canva.com",
  canva: "canva.com",
  notion: "notion.so",
  "chatgpt plus": "openai.com",
  chatgpt: "openai.com",
  openai: "openai.com",
  github: "github.com",
  "github copilot": "github.com",
  figma: "figma.com",
  slack: "slack.com",
  zoom: "zoom.us",
  "google workspace": "workspace.google.com",
  "audible": "audible.com",
  "kindle unlimited": "amazon.com",
  "crunchyroll": "crunchyroll.com",
  "paramount+": "paramountplus.com",
  paramountplus: "paramountplus.com",
  "max": "max.com",
  "peacock": "peacocktv.com",
  "fubo": "fubo.tv",
  "sling": "sling.com",
  "hulu": "hulu.com",
  "apple fitness+": "apple.com",
  "peloton": "onepeloton.com",
  "strava": "strava.com",
  "nordvpn": "nordvpn.com",
  "expressvpn": "expressvpn.com",
  "surfshark": "surfshark.com",
};

function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Geeft de favicon URL voor een bekende dienst, of null.
 * Gebruik category icon als fallback.
 */
export function getServiceLogoUrl(subscriptionName: string): string | null {
  const normalized = normalizeName(subscriptionName);

  // Exacte match
  if (SERVICE_DOMAINS[normalized]) {
    return `https://www.google.com/s2/favicons?domain=${SERVICE_DOMAINS[normalized]}&sz=64`;
  }

  // Prefix match (bijv. "Netflix Premium" -> netflix)
  for (const [key, domain] of Object.entries(SERVICE_DOMAINS)) {
    if (normalized.startsWith(key) || normalized.includes(` ${key}`)) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    }
  }

  return null;
}
