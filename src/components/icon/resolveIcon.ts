/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { getAssetPath } from '@stencil/core';

export const isSvgDataUrl = (url: string) => {
  if (!url) {
    return false;
  }

  if (typeof url !== 'string') {
    return false;
  }

  return url.startsWith('data:image/svg+xml');
};

let parser = null;

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
  const response = await fetch(url);
  const responseText = await response.text();

  if (!response.ok) {
    console.error(responseText);
    throw Error(responseText);
  }

  return parseSVGDataContent(responseText);
}
const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:www\.)?(?:\S+\.\S+)(?:\S*)$/i;

function isValidUrl(url: string) {
  return urlRegex.test(url);
}

function getAssetUrl(name: string) {
  return getAssetPath(`svg/${name}.svg`);
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

  try {
    return fetchSVG(getAssetUrl(iconName));
  } catch (error) {
    throw Error('Cannot resolve any icon');
  }
}
