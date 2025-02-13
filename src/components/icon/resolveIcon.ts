/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { getAssetPath } from '@stencil/core';
import { getCustomAssetUrl } from './meta-tag';
import { parseSVGDataContent } from './parser';

declare global {
  interface Window {
    IxIcons: any;
  }
}

let fetchCache: Map<string, string>;
const requests = new Map<string, Promise<string>>();

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

async function fetchSVG(url: string) {
  const cache = getIconCacheMap();

  if (cache.has(url)) {
    return cache.get(url)!;
  }

  if (requests.has(url)) {
    return requests.get(url)!;
  }

  const fetching = fetch(url)
    .then(async response => {
      const responseText = await response.text();

      let svgContent = '';
      if (response.ok) {
        svgContent = parseSVGDataContent(responseText);
        cache.set(url, svgContent);
      } else {
        console.error('Failed to request svg data from', url, 'with status code', response.status);
      }

      return svgContent;
    })
    .catch(() => {
      console.error('Failed to fetch svg data:', url);
      cache.set(url, '');
      return '';
    })
    .finally(() => {
      requests.delete(url);
    });

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
    console.warn(`Could not load icon with name "${name}". Ensure that the icon is registered using addIcons or that the icon SVG data is passed directly to the property.`);
  }

  return url;
}

export async function resolveIcon(element: HTMLIxIconElement, iconName?: string): Promise<string> {
  if (!iconName) {
    console.warn('No icon was provided', element);
    return '';
  }

  if (isSvgDataUrl(iconName)) {
    return parseSVGDataContent(iconName);
  }

  return loadIcon(iconName);
}

async function loadIcon(iconName: string): Promise<string> {
  const cache = getIconCacheMap();

  if (cache.has(iconName)) {
    return cache.get(iconName)!;
  }

  if (isValidUrl(iconName)) {
    return fetchSVG(iconName);
  }

  const iconUrl = getIconUrl(iconName);

  if (!iconUrl) {
    return '';
  }

  return fetchSVG(iconUrl);
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
