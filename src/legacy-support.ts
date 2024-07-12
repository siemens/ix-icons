/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { setAssetPath } from '@stencil/core';
import * as icons from './components/icon/icons';
import { getIconCacheMap, parseSVGDataContent, getAssetUrl } from './components/icon/resolveIcon';

function fromCamelToKebabCase(camelString: string): string {
  let kebabString = '';
  for (const char of camelString) {
    if (char.toUpperCase() === char) {
      kebabString += '-' + char.toLowerCase();
    } else {
      kebabString += char;
    }
  }
  if (kebabString.startsWith('-')) {
    kebabString = kebabString.slice(1);
  }
  return kebabString;
}

export function preloadIconMap() {
  const iconsCache = getIconCacheMap();
  Object.keys(icons).forEach(key => {
    const fileName = fromCamelToKebabCase(key.substring('icon'.length));
    const icon = icons[key];

    let url: string = '';
    try {
      url = getAssetUrl(fileName);
    } catch (error) {
      setAssetPath(`${window.location.origin}/`);
    } finally {
      url = getAssetUrl(fileName);
    }

    iconsCache.set(url, parseSVGDataContent(icon));
  });
}
