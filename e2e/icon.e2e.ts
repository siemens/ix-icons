/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, test } from '@playwright/test';

test('should show light themed icons', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/e2e/icon.html?theme=theme-classic-dark');
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
});

test('should show dark themed icons', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/e2e/icon.html?theme=theme-classic-light');
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
});
