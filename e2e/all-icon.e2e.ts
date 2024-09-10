/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ConsoleMessage, expect, test } from '@playwright/test';
import * as iconsFile from './sample.json';
import * as icons from './../icons';

function convertToCamelCase(value: string) {
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

iconsFile.icons.forEach(iconName => {
  test(`should show ${iconName}`, async ({ page }) => {
    const dataUrlSvg = icons[`icon${convertToCamelCase(iconName)}`];
    await page.goto(`http://127.0.0.1:8080/e2e/icon-by-name.html?icon=${iconName}`);

    await page.evaluate(
      ([url]) => {
        (window as any).__SVG_DATA__ = url;
      },
      [dataUrlSvg],
    );

    await page.waitForEvent('console', {
      predicate: (message: ConsoleMessage) => {
        return message.text() === 'icon-loaded-success';
      },
    });

    expect(await page.locator('#mount').screenshot()).toMatchSnapshot();
  });
});
