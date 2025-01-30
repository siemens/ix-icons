/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { getAssetPath, setAssetPath } from '@stencil/core';
import { getCustomAssetUrl } from './meta-tag';

declare global {
  interface Window {
    IxIcons: any;
  }
}

let fetchCache: Map<string, string>;
const requests = new Map<string, Promise<string>>();
let parser = null;

export const getIconCacheMap = (): Map<string, string> => {
  if (typeof window === 'undefined') {
    return new Map();
  }

  if (!fetchCache) {
    window.IxIcons = window.IxIcons || {};
    fetchCache = window.IxIcons.map = window.IxIcons.map || new Map();
  }

  return fetchCache;
};

export const isSvgDataUrl = (url: string) => {
  if (!url) {
    return false;
  }

  if (typeof url !== 'string') {
    return false;
  }

  return url.startsWith('data:image/svg+xml');
};

export function parseSVGDataContent(content: string) {
  if (typeof window['DOMParser'] === 'undefined') {
    console.warn('DOMParser not supported by your browser.');
    return;
  }

  if (parser === null) {
    parser = new window['DOMParser']();
  }

  const svgDocument = parser.parseFromString(content, 'text/html');
  const svgElement = svgDocument.querySelector('svg') as HTMLElement;

  if (!svgElement) {
    throw Error('No valid svg data provided');
  }

  return svgElement.outerHTML;
}

async function fetchSVG(url: string) {
  const cache = getIconCacheMap();

  if (cache.has(url)) {
    return cache.get(url);
  }

  if (requests.has(url)) {
    return requests.get(url);
  }

  const fetching = fetch(url).then(async response => {
    const responseText = await response.text();

    if (!response.ok) {
      console.error(responseText);
      throw Error(responseText);
    }

    const svgContent = parseSVGDataContent(responseText);
    cache.set(url, svgContent);

    requests.delete(url);

    return svgContent;
  });

  requests.set(url, fetching);
  return fetching;
}

const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:www\.)?(?:\S+\.\S+)(?:\S*)$/i;

function isValidUrl(url: string) {
  return urlRegex.test(url);
}

export function getIconUrl(name: string) {
  const customAssetUrl = getCustomAssetUrl();

  if (customAssetUrl) {
    return `${customAssetUrl}/${name}.svg`;
  }

  let url: string = `svg/${name}.svg`;

  try {
    url = getAssetPath(url);
  } catch (error) {
    console.warn(error);
    setAssetPath(`${window.location.origin}/`);
    url = getAssetPath(url);
  }

  return url;
}

export async function resolveIcon(iconName: string) {
  if (!iconName) {
    throw Error('No icon name provided');
  }

  if (isSvgDataUrl(iconName)) {
    return parseSVGDataContent(iconName);
  }

  return await loadIcon(iconName);
}

async function loadIcon(iconName: string) {
  const cache = getIconCacheMap();

  if (cache.has(iconName)) {
    return cache.get(iconName);
  }

  if (isValidUrl(iconName)) {
    try {
      return fetchSVG(iconName);
    } catch (error) {
      throw error;
    }
  }

  try {
    return fetchSVG(getIconUrl(iconName));
  } catch (error) {
    throw Error(`Could not resolve ${iconName}`);
  }
}

function removePrefix(name: string, prefix: string) {
 if (name.startsWith(prefix)) {
    name = name.slice(prefix.length);
    return name.replace(/^(\w)/, (_match, p1) => p1.toLowerCase());
  }

  return name;
}

export function addIcons(icons: { [name: string]: any }) {
  Object.keys(icons).forEach(name => {
    const icon = icons[name];
    name = removePrefix(name, 'icon');

    addIconToCache(name, icon);
  });
}

export function addIconToCache(name: string, icon: string) {
  const cache = getIconCacheMap();

  if (cache.has(name)) {
    console.warn(`Icon name '${name}' already in cache. Overwritting with new icon data.`);
  }

  const svg = parseSVGDataContent(icon);

  cache.set(name, svg);

  const toKebabCase = name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z0-9])/g, '$1-$2').toLowerCase();

  if (name != toKebabCase) {
    cache.set(toKebabCase, svg);
  }
}
