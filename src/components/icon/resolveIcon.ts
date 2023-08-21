/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Icon } from './icon';

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

function parseSVGDataContent(content: string) {
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
    return '';
  }

  return parseSVGDataContent(responseText);
}

export async function resolveIcon(icon: Icon) {
  const { src, name } = icon;

  if (name) {
    if (isSvgDataUrl(name)) {
      return parseSVGDataContent(name);
    }

    //Fallback return undefined to render web font icon
    return;
  }

  if (!src) {
    return '';
  }

  if (isSvgDataUrl(src)) {
    return parseSVGDataContent(src);
  }

  return fetchSVG(src);
}
