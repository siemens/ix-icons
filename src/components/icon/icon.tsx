/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { parseSVGDataContent, resolveIcon } from './resolveIcon';

const iconMissingSymbol =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><path fill-rule='evenodd' d='M384,0 L384,384 L0,384 L0,0 L384,0 Z M192,207.085 L57.751,341.333 L326.248,341.333 L192,207.085 Z M42.666,57.751 L42.666,326.248 L176.915,192 L42.666,57.751 Z M341.333,57.751 L207.085,192 L341.333,326.248 L341.333,57.751 Z M326.248,42.666 L57.751,42.666 L192,176.915 L326.248,42.666 Z' transform='translate(64 64)'/></svg>";

@Component({
  tag: 'ix-icon',
  styleUrl: 'icon.scss',
  shadow: true,
  assetsDirs: ['svg'],
})
export class Icon {
  /**
   * Size of the icon
   */
  @Prop() size: '12' | '16' | '24' | '32';

  /**
   * Color of the icon
   */
  @Prop() color: string;

  /**
   * Use one of our defined icon names e.g. `copy`
   *
   * https://ix.siemens.io/docs/icon-library/icons
   *
   * or the import variant
   *
   * ```
   * import { rocket } from '@siemens/ix-icons/icons';
   *
   * <ix-icon name={rocket}></ix-icon>
   * ```
   */
  @Prop() name: string;

  @State() svgContent?: string;

  connectedCallback() {
    this.loadIconContent();
  }

  @Watch('name')
  async loadIconContent() {
    try {
      this.svgContent = await resolveIcon(this.name);
    } catch (error) {
      this.svgContent = parseSVGDataContent(iconMissingSymbol);
    }
  }

  render() {
    const style: {
      [key: string]: string;
    } = {};

    if (this.color) {
      style['color'] = `var(--theme-${this.color})`;
    }

    return (
      <Host
        style={style}
        class={{
          ['size-12']: this.size === '12',
          ['size-16']: this.size === '16',
          ['size-24']: this.size === '24',
          ['size-32']: this.size === '32',
        }}
      >
        <div class={'svg-container'} innerHTML={this.svgContent}></div>
      </Host>
    );
  }
}
