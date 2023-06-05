/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(async function () {
  await window.customElements.whenDefined('ix-icon');

  const searchParams = new URLSearchParams(location.search);
  const icon = document.createElement('ix-icon');
  icon.name = searchParams.get('icon');

  document.getElementById('mount').appendChild(icon);
})();
