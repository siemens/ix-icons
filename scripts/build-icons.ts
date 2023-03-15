/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import { optimize } from 'svgo';

const rootPath = path.join(__dirname, '..');
const svgSrcPath = path.join(rootPath, 'svg');

const iconsDestPath = path.join(__dirname, 'icons');
const iconsEsmPath = path.join(iconsDestPath, 'index.mjs');

interface BuildIconData {
  name: string;
  esm: string;
  cjs: string;
  dts: string;
}

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
  return normalized.charAt(0).toLowerCase() + normalized.slice(1);
}

function optimizeSvgData(svgData: string) {
  return optimize(svgData, {
    plugins: ['preset-default'],
  }).data;
}

async function buildIcons() {
  rimraf(iconsDestPath);
  fs.ensureDirSync(iconsDestPath);

  const svgIcons = fs.readdirSync(svgSrcPath);
  const iconCollection: BuildIconData[] = [];

  svgIcons.forEach(iconPath => {
    const svgData = fs.readFileSync(path.join(svgSrcPath, iconPath)).toString();
    const svgDataOptimized = optimizeSvgData(svgData);
    const iconName = convertToCamelCase(iconPath.substring(0, iconPath.lastIndexOf('.svg')));

    if (reservedKeywords.has(iconName)) {
      console.log(`Svg icon name ${iconName} is a reserved keyword.`);
      return;
      // throw new Error(`Svg icon name ${iconName} is a reserved keyword.`);
    }

    console.log(iconName);

    iconCollection.push({
      name: iconName,
      cjs: `exports.${iconName} = ${getDataUrl(svgDataOptimized)}`,
      esm: `export const ${iconName} = ${getDataUrl(svgDataOptimized)}`,
      dts: `export declare var ${iconName}: string;`,
    });
  });

  await Promise.all([writeESMIcons(iconCollection)]);
}

async function writeESMIcons(icons: BuildIconData[]) {
  const esmIcons = icons.map(icon => ({
    name: icon.name,
    esm: icon.esm,
  }));

  const headline = '/* Siemens iX ESM Icons */\n\n';
  const content: string[] = [];
  esmIcons.forEach(icon => {
    content.push(`${icon.esm}\n`);
  });

  return fs.writeFile(iconsEsmPath, [headline, content].join(''));
}

function getDataUrl(svgData: string) {
  let svg = svgData;
  if (svg.includes(`'`)) {
    throw new Error(`oh no! no single quotes allowed!`);
  }
  if (svg.includes(`\n`) || svg.includes(`\r`)) {
    throw new Error(`oh no! no new lines allowed!`);
  }
  svg = svg.replace(/"/g, "'");
  return `"data:image/svg+xml;utf8,${svg}"`;
}

// https://mathiasbynens.be/notes/reserved-keywords
const reservedKeywords = new Set([
  'do',
  'if',
  'in',
  'for',
  'let',
  'new',
  'try',
  'var',
  'case',
  'else',
  'enum',
  'eval',
  'null',
  'this',
  'true',
  'void',
  'with',
  'await',
  'break',
  'catch',
  'class',
  'const',
  'false',
  'super',
  'throw',
  'while',
  'yield',
  'delete',
  'export',
  'import',
  'public',
  'return',
  'static',
  'switch',
  'typeof',
  'default',
  'extends',
  'finally',
  'package',
  'private',
  'continue',
  'debugger',
  'function',
  'arguments',
  'interface',
  'protected',
  'implements',
  'instanceof',
  'constructor',
]);

buildIcons();
