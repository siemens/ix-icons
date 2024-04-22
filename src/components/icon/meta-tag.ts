/*
 * COPYRIGHT (c) Siemens AG 2018-2024 ALL RIGHTS RESERVED.
 */

function getV3PreviewMetaElement() {
  return document.querySelector("meta[name='ix-icons:v3-preview']");
}

function getV3PreviewMetaContent() {
  const v3PreviewMetaElement = getV3PreviewMetaElement();
  if (v3PreviewMetaElement) {
    return v3PreviewMetaElement.getAttribute('content').split(';');
  }

  return null;
}

/**
 * Provide meta tag with custom path to the svg assets
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

/**
 * Provide meta tag with custom preview features enabled
 *
 * <meta name="ix-icons:path" content="/build/svg" />
 */
export function isV3PreviewEnabled() {
  const features = getV3PreviewMetaContent();

  if (!features) {
    return false;
  }

  if (features.includes('svg-path-loading')) {
    return true;
  }

  return false;
}
