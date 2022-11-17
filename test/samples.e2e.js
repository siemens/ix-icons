/*
 * SPDX-FileCopyrightText: 2022 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const { test, expect } = require('@playwright/test');

test('example test', async ({ page }) => {
  await page.goto('http://localhost:8080/sample.html');
  await expect(page).toHaveScreenshot({
    fullPage: true,
  });
});
