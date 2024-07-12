/*
 * COPYRIGHT (c) Siemens AG 2018-2024 ALL RIGHTS RESERVED.
 */
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
