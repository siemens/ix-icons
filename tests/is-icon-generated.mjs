/*
 * SPDX-FileCopyrightText: 2022 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fse from 'fs-extra';
import path from 'path';

const __dirname = path.resolve();

async function main() {
  const allsvgs = fse.readdirSync(path.join(__dirname, 'svg'));
  const generatedCssFile = fse.readFileSync(
    path.join(__dirname, 'dist', 'css', 'ix-icons.css')
  );

  allsvgs
    .map((svg) => svg.replace('.svg', ''))
    .forEach((svg) => {
      if (generatedCssFile.includes(svg)) {
        return;
      }

      console.error(`${svg} is missing in dist/css/ix-icons.css`);
      process.exit(1);
    });

  console.log('All svg files generated as svg');
}

main();
