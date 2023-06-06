/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ConsoleMessage, expect, test } from '@playwright/test';
import * as iconsFile from './../dist/sample.json';
import * as icons from './../icons';

import { reservedKeywords } from './../scripts/reserved-keywords';

function toCamel(snakeCaseString: string): string {
  const words = snakeCaseString.split('-');
  const camelCaseString =
    words[0] +
    words
      .slice(1)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  return camelCaseString;
}

iconsFile.icons
  .map(iconName => {
    if (reservedKeywords.has(iconName)) {
      return {
        iconName: iconName,
        esImportName: `_${iconName}`,
      };
    }

    return {
      iconName: iconName,
      esImportName: iconName,
    };
  })
  .forEach(({ iconName, esImportName }) => {
    test(`should show ${iconName}`, async ({ page }) => {
      const dataUrlSvg = icons[toCamel(esImportName)];
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
