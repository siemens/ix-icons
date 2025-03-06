/**
 * Provide custom SVG path for icons
 *
 * <meta name="ix-icons:path" content="/build/svg" />
 */
export function getCustomAssetUrl() {
  const assetPath = document.querySelector("meta[name='ix-icons:path']");
  if (assetPath) {
    const path = assetPath.getAttribute('content');
    return path;
  }

  return false;
}
