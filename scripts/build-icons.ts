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
import { rimraf } from 'rimraf';
import { CustomPlugin, optimize } from 'svgo';

const __dirname = path.resolve();

const rootPath = path.join(__dirname);
const svgSrcPath = path.join(rootPath, 'incoming-svg');
const buildDistPath = path.join(rootPath, 'build-dist');
const pkgPath = path.join(rootPath, 'package.json');

const iconsDestPath = path.join(__dirname, 'icons');
const iconsEsmPath = path.join(iconsDestPath, 'index.mjs');
const iconsCjsPath = path.join(iconsDestPath, 'index.js');
const iconsDtsPath = path.join(iconsDestPath, 'index.d.ts');
const iconsPkgPath = path.join(iconsDestPath, 'package.json');

interface BuildIconData {
  name: string;
  originalIconName: string;
  esm: string;
  cjs: string;
  dts: string;
  rawSvgOptimized: string;
}

interface JavaScriptBuildData {
  name: string;
  originalIconName: string;
  code: string;
}

const pluginTest = (iconName: string): CustomPlugin => {
  return {
    name: 'replaceFillColors',
    fn: (() => {
      return {
        element: {
          exit: node => {
            const { attributes } = node;

            if (node.name === 'svg' && attributes.viewBox === undefined) {
              const errorMessage = `Missing viewBox for svg ${iconName}`;
              throw Error(errorMessage);
            }

            if (!attributes) {
              return;
            }

            const { fill, stroke } = attributes;

            // Remove fill and stoke colors to avoid multicolor SVGs
            if (fill && fill !== undefined && fill !== 'none') {
              delete node['attributes']['fill'];
            }

            if (stroke && stroke !== undefined && stroke !== 'none') {
              delete node['attributes']['stroke'];
            }
          },
        },
      };
    }) as any,
  };
};

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

function optimizeSvgData(svgData: string, iconName: string) {
  return optimize(svgData, {
    plugins: [pluginTest(iconName)],
  }).data;
}

async function buildIcons() {
  await rimraf(iconsDestPath);
  fs.ensureDirSync(iconsDestPath);

  const version = getPkgVersion();
  const svgIcons = fs.readdirSync(svgSrcPath);
  const iconCollection: BuildIconData[] = [];

  svgIcons.forEach(iconFileName => {
    const iconPath = path.join(svgSrcPath, iconFileName);
    const svgData = fs.readFileSync(iconPath).toString();
    const originalIconName = iconFileName.substring(0, iconFileName.lastIndexOf('.svg'));
    const svgDataOptimized = optimizeSvgData(svgData, originalIconName);
    let iconName = convertToCamelCase(originalIconName);

    const upperCaseIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

    iconCollection.push({
      name: iconName,
      originalIconName: originalIconName,
      cjs: `exports.icon${upperCaseIconName} = ${getDataUrl(svgDataOptimized)}`,
      esm: `export const icon${upperCaseIconName} = ${getDataUrl(svgDataOptimized)}`,
      dts: `export declare var icon${upperCaseIconName}: string;`,
      rawSvgOptimized: svgDataOptimized,
    });
  });

  await Promise.all([
    ...writeOptimizedSvg(iconCollection, path.join(rootPath, 'svg')),

    writeIconCollectionFile(
      iconCollection.map(i => ({
        name: i.name,
        originalIconName: i.originalIconName,
        code: i.esm,
      })),
      path.join(rootPath, 'src', 'components', 'icon', 'icons.ts'),
      version,
      true,
    ),

    writeIconCollectionFile(
      iconCollection.map(i => ({
        name: i.name,
        originalIconName: i.originalIconName,
        code: i.esm,
      })),
      iconsEsmPath,
      version,
    ),

    writeIconCollectionFile(
      iconCollection.map(i => ({
        name: i.name,
        originalIconName: i.originalIconName,
        code: i.cjs,
      })),
      iconsCjsPath,
      version,
    ),

    writeIconCollectionFile(
      iconCollection.map(i => ({
        name: i.name,
        originalIconName: i.originalIconName,
        code: i.dts,
      })),
      iconsDtsPath,
      version,
    ),

    writeIconSampleJson(iconCollection, path.join(rootPath, 'e2e'), version),
    writeIconSampleJson(iconCollection, buildDistPath, version),
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

function writeOptimizedSvg(icons: BuildIconData[], targetPath: string) {
  fs.ensureDirSync(targetPath);
  return icons.map(icon => {
    const iconPath = path.join(targetPath, `${icon.originalIconName}.svg`);
    return fs.writeFile(iconPath, icon.rawSvgOptimized);
  });
}

async function writeIconCollectionFile(icons: JavaScriptBuildData[], targetPath: string, version: string, includeTypings = false) {
  const headline = `/* Siemens iX Icons */\n/* autogenerated do not edit */\n\n`;
  const content: string[] = [];
  icons.forEach(icon => {
    content.push(`${icon.code}\n`);
  });

  if (includeTypings) {
    content.push('\n');
    content.push('\n');

    content.push('export type IxIcons = ');
    icons.forEach(icon => {
      content.push(`| '${icon.originalIconName}'\n`);
    });
    content.push(`| (string & {});`);
  }

  console.log('Write file to:', targetPath);
  return fs.writeFile(targetPath, [headline, content.join('')].join(''));
}

async function writeIconSampleJson(icons: BuildIconData[], targetPath: string, version: string) {
  fs.ensureDirSync(targetPath);
  const content = JSON.stringify(
    {
      icons: icons.map(icon => icon.originalIconName),
    },
    undefined,
    2,
  );

  return fs.writeFile(path.join(targetPath, 'sample.json'), content);
}

function getDataUrl(svgData: string) {
  let svg = svgData;
  if (svg.includes(`'`)) {
    throw new Error(`No single quotes allowed!`);
  }
  if (svg.includes(`\n`) || svg.includes(`\r`)) {
    throw new Error(`No new lines allowed!`);
  }
  svg = svg.replace(/"/g, "'");
  return `"data:image/svg+xml;utf8,${svg}"`;
}

buildIcons();
