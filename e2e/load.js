/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function loadResources() {
  var ixIconsJsEsm = document.createElement('script');
  ixIconsJsEsm.setAttribute('type', 'module');
  ixIconsJsEsm.setAttribute('src', 'http://127.0.0.1:8080/www/build/ix-icons.esm.js');

  var ixIconsJs = document.createElement('script');
  ixIconsJs.setAttribute('nomodule', '');
  ixIconsJs.setAttribute('src', 'http://127.0.0.1:8080/www/build/ix-icons.js');

  document.getElementsByTagName('head')[0].appendChild(ixIconsJsEsm);
  document.getElementsByTagName('head')[0].appendChild(ixIconsJs);
}

function detectThemeSwitching() {
  var searchParams = new URLSearchParams(location.search);
  if (searchParams.has('theme')) {
    var theme = searchParams.get('theme');
    document.body.classList.add(theme);
  }
}

(function () {
  loadResources();
  detectThemeSwitching();
})();
