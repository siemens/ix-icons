/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { getAssetPath } from '@stencil/core';
import { getCustomAssetUrl, isV3PreviewEnabled } from './meta-tag';

declare global {
  interface Window {
    IxIcons: any;
  }
}

let fetchCatch: Map<string, string>;
const requests = new Map<string, Promise<string>>();
let parser = null;

function toCamelCase(value: string) {
  value = value.replace(/[\(\)\[\]\{\}\=\?\!\.\:,\-_\+\\\"#~\/]/g, ' ');
  let returnValue = '';
  let makeNextUppercase = true;
  value = value.toLowerCase();
  for (let i = 0; value.length > i; i++) {
    let c = value.charAt(i);
    if (c.match(/^\s+$/g) || c.match(/[\(\)\[\]\{\}\\\/]/g)) {
      makeNextUppercase = true;
    } else if (makeNextUppercase) {
      c = c.toUpperCase();
      makeNextUppercase = false;
    }
    returnValue += c;
  }
  const normalized = returnValue.replace(/\s+/g, '');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export const getIconCacheMap = (): Map<string, string> => {
  if (typeof window === 'undefined') {
    return new Map();
  }

  if (!fetchCatch) {
    window.IxIcons = window.IxIcons || {};
    fetchCatch = window.IxIcons.map = window.IxIcons.map || new Map();
  }
  return fetchCatch;
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
  const request = requests.get(url);

  if (request) {
    return request;
  }

  const cache = getIconCacheMap();

  if (cache.has(url)) {
    return cache.get(url);
  }

  const fetching = fetch(url).then(async response => {
    const responseText = await response.text();

    if (!response.ok) {
      console.error(responseText);
      throw Error(responseText);
    }

    const svgContent = parseSVGDataContent(responseText);
    cache.set(url, svgContent);

    return svgContent;
  });

  requests.set(url, fetching);
  return fetching;
}
const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:www\.)?(?:\S+\.\S+)(?:\S*)$/i;

function isValidUrl(url: string) {
  return urlRegex.test(url);
}

function getAssetUrl(name: string) {
  const customAssetUrl = getCustomAssetUrl();
  if (customAssetUrl) {
    return `${customAssetUrl}/${name}.svg`;
  }

  return getAssetPath(`svg/${name}.svg`);
}

async function getESMIcon(name: string) {
  const esmIcon = await import('./icons');
  let iconName = toCamelCase(name);
  iconName = `icon${iconName}`;

  return parseSVGDataContent(esmIcon[iconName]);
}

export async function resolveIcon(iconName: string) {
  if (!iconName) {
    throw Error('No icon name provided');
  }

  if (isSvgDataUrl(iconName)) {
    return parseSVGDataContent(iconName);
  }

  if (isValidUrl(iconName)) {
    try {
      return fetchSVG(iconName);
    } catch (error) {
      throw error;
    }
  }

  if (isV3PreviewEnabled()) {
    console.warn('Using V3 preview feature for loading icons.');
    try {
      return fetchSVG(getAssetUrl(iconName));
    } catch (error) {
      throw Error('Cannot resolve any icon');
    }
  }

  return getESMIcon(iconName);
}
