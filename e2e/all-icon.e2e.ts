/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, test } from '@playwright/test';
import * as iconsFile from './../dist/sample.json';

iconsFile.icons.forEach(iconName => {
  test(`should show ${iconName}`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:8080/e2e/icon-by-name.html?icon=${iconName}`);
    expect(await page.locator('ix-icon').screenshot()).toMatchSnapshot();
  });
});
