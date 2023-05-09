/*
 * COPYRIGHT (c) Siemens AG 2018-2023 ALL RIGHTS RESERVED.
 */

import { Icon } from './icon';

export const isSvgDataUrl = (url: string) => url.startsWith('data:image/svg+xml');

const parser = new DOMParser();

function parseSVGDataContent(content: string) {
  const svgDocument = parser.parseFromString(content, 'text/html');
  const svgElement = svgDocument.querySelector('svg');

  if (!svgElement) {
    throw Error('No valid svg data provided');
  }

  return svgElement.outerHTML;
}

async function fetchSVG(url: string) {
  const response = await fetch(url);
  const svgContent = await response.text();

  return svgContent;
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

  if (isSvgDataUrl(src)) {
    return parseSVGDataContent(src);
  }

  return fetchSVG(src);
}
