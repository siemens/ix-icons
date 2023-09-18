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
const svgSrcPath = path.join(rootPath, 'svg');
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
}

interface JavaScriptBuildData {
  name: string;
  originalIconName: string;
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

const pluginTest: CustomPlugin = {
  name: 'replaceFillColors',
  fn: (() => {
    return {
      element: {
        exit: node => {
          const { attributes } = node;
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

function optimizeSvgData(svgData: string) {
  return optimize(svgData, {
    plugins: [pluginTest],
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
    const originalIconName = iconPath.substring(0, iconPath.lastIndexOf('.svg'));
    let iconName = convertToCamelCase(originalIconName);

    const upperCaseIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

    iconCollection.push({
      name: iconName,
      originalIconName: originalIconName,
      cjs: `exports.icon${upperCaseIconName} = ${getDataUrl(svgDataOptimized)}`,
      esm: `export const icon${upperCaseIconName} = ${getDataUrl(svgDataOptimized)}`,
      dts: `export declare var icon${upperCaseIconName}: string;`,
    });
  });

  await Promise.all([
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

    writeIconSampleJson(iconCollection, path.join(rootPath, 'dist-css', 'sample.json'), version),
    writeGlobalCSSFile(path.join(rootPath, 'dist-css', 'css', 'ix-icons.css')),

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

async function writeGlobalCSSFile(targetPath: string) {
  // Write the global css file to keep the application compiling after update to 2.0.0
  fs.ensureDirSync(path.join(targetPath, '..'));

  return fs.writeFile(
    targetPath,
    `
/*
* SPDX-FileCopyrightText: 2023 Siemens AG
*
* SPDX-License-Identifier: MIT
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

/*
* Deprecated since 2.0.0 no global css file is necessary.
*/
    `,
  );
}

async function writeIconCollectionFile(icons: JavaScriptBuildData[], targetPath: string, version: string, includeTypings = false) {
  const headline = `/* Siemens iX Icons (${version}) */\n/* autogenerated do not edit */\n\n`;
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
  const content = JSON.stringify(
    {
      icons: icons.map(icon => icon.originalIconName),
    },
    undefined,
    2,
  );

  fs.ensureDirSync(path.join(targetPath, '..'));
  return fs.writeFile(targetPath, content);
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

buildIcons().then();
