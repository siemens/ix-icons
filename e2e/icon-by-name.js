/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function waitForVariable(variableName) {
  return new Promise(resolve => {
    if (typeof window[variableName] !== 'undefined') {
      resolve(window[variableName]);
    } else {
      const interval = setInterval(() => {
        if (typeof window[variableName] !== 'undefined') {
          clearInterval(interval);
          resolve(window[variableName]);
        }
      }, 100);
    }
  });
}

(async function () {
  await window.customElements.whenDefined('ix-icon');
  const searchParams = new URLSearchParams(location.search);
  const iconName = searchParams.get('icon');
  const svgUrl = `/www/build/svg/${iconName}.svg`;

  const nameIcon = document.createElement('ix-icon');
  nameIcon.name = iconName;

  const srcIcon = document.createElement('ix-icon');
  srcIcon.name = svgUrl;

  await waitForVariable('__SVG_DATA__');

  const dataUrlIcon = document.createElement('ix-icon');
  dataUrlIcon.name = window.__SVG_DATA__;

  document.getElementById('mount').appendChild(nameIcon);
  document.getElementById('mount').appendChild(dataUrlIcon);
  document.getElementById('mount').appendChild(srcIcon);

  console.log('icon-loaded-success');
})();
