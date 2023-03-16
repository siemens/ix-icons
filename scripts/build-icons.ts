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

const __dirname = path.resolve();

const rootPath = path.join(__dirname);
const svgSrcPath = path.join(rootPath, 'svg');
const pkgPath = path.join(rootPath, 'package.json');

const iconsDestPath = path.join(__dirname, 'icons');
const iconsEsmPath = path.join(iconsDestPath, 'index.mjs');
const iconsCjsPath = path.join(iconsDestPath, 'index.js');
const iconsDtsPath = path.join(iconsDestPath, 'index.d.ts');
const iconsPkgPath = path.join(iconsDestPath, 'package.json');

interface BuildIconData {
  name: string;
  esm: string;
  cjs: string;
  dts: string;
}

interface JavaScriptBuildData {
  name: string;
  code: string;
}

function getPkgVersion() {
  const pkg = JSON.parse(fs.readFileSync(pkgPath).toString());

  return pkg.version;
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
    plugins: [],
  }).data;
}

async function buildIcons() {
  await rimraf(iconsDestPath);
  fs.ensureDirSync(iconsDestPath);

  const version = getPkgVersion();
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

    iconCollection.push({
      name: iconName,
      cjs: `exports.${iconName} = ${getDataUrl(svgDataOptimized)}`,
      esm: `export const ${iconName} = ${getDataUrl(svgDataOptimized)}`,
      dts: `export declare var ${iconName}: string;`,
    });
  });

  await Promise.all([
    writeJSFile(
      iconCollection.map(i => ({
        name: i.name,
        code: i.esm,
      })),
      iconsEsmPath,
      version,
    ),

    writeJSFile(
      iconCollection.map(i => ({
        name: i.name,
        code: i.cjs,
      })),
      iconsCjsPath,
      version,
    ),

    writeJSFile(
      iconCollection.map(i => ({
        name: i.name,
        code: i.dts,
      })),
      iconsDtsPath,
      version,
    ),

    fs.writeFile(
      iconsPkgPath,
      JSON.stringify(
        {
          name: '@siemens/ix/icons',
          version: version,
          module: 'index.mjs',
          main: 'index.js',
          typings: 'index.d.ts',
          private: true,
        },
        null,
        2,
      ),
    ),
  ]);
}

async function writeJSFile(icons: JavaScriptBuildData[], path: string, version: string) {
  const headline = `/* Siemens iX Icons (${version}) */\n\n`;
  const content: string[] = [];
  icons.forEach(icon => {
    content.push(`${icon.code}\n`);
  });

  console.log('Write file to:', path);
  return fs.writeFile(path, [headline, content.join('')].join(''));
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

buildIcons().then();
