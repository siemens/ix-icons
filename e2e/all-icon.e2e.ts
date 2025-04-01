/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, test } from '@playwright/test';
import * as icons from './../icons/index';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';

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

function groupByStartingLetter(arr: string[]): { [key: string]: string[] } {
  const result: { [key: string]: string[] } = {};

  arr.forEach(item => {
    const startingLetter = item.charAt(0).toLowerCase();
    if (!result[startingLetter]) {
      result[startingLetter] = [];
    }
    result[startingLetter].push(item);
  });

  return result;
}

const __dirname = path.resolve();
const rawSamples = readFileSync(path.join(__dirname, 'e2e', 'sample.json')).toString();
const iconsSamples = JSON.parse(rawSamples);

const groupedItems = groupByStartingLetter(iconsSamples.icons);

test.describe.configure({ mode: 'serial' });

Object.keys(groupedItems).forEach(key => {
  test(`should match all icons starting with ${key}`, async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/e2e/all-icons.html');

    const iconContentPage: string[] = [];

    groupedItems[key].forEach(iconName => {
      iconContentPage.push(`<p>${iconName}</p>`);
      iconContentPage.push(`<ix-icon id="${iconName}-by-name" name="${iconName}"></ix-icon>`);
      iconContentPage.push(`<ix-icon id="${iconName}-by-url" name="/www/build/svg/${iconName}.svg"></ix-icon>`);
      iconContentPage.push(`<ix-icon id="${iconName}-by-data" name="${icons[`icon${convertToCamelCase(iconName)}`]}"></ix-icon>`);
    });

    await page.setContent(iconContentPage.join('\n'));

    await Promise.all(
      groupedItems[key].map(async iconName => {
        const iconByName = page.locator(`#${iconName}-by-name`);
        const iconByUrl = page.locator(`#${iconName}-by-url`);
        const iconByData = page.locator(`#${iconName}-by-data`);

        const svgByName = iconByName.locator('.svg-container svg');
        const svgByUrl = iconByUrl.locator('.svg-container svg');
        const svgByData = iconByData.locator('.svg-container svg');

        await expect(svgByName).toBeVisible();
        await expect(svgByUrl).toBeVisible();
        await expect(svgByData).toBeVisible();
      }),
    );

    await expect(page).toHaveScreenshot({
      fullPage: true,
    });
  });
});
