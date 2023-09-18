/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import type { IxIcons } from './icons';
import { iconQuestion } from './icons';
import { parseSVGDataContent, resolveIcon } from './resolveIcon';

@Component({
  tag: 'ix-icon',
  styleUrl: 'icon.scss',
  shadow: true,
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
  @Prop() name: IxIcons;

  @State() svgContent?: string;

  connectedCallback() {
    this.loadIconContent();
  }

  @Watch('name')
  async loadIconContent() {
    try {
      this.svgContent = await resolveIcon(this);
    } catch (error) {
      this.svgContent = parseSVGDataContent(iconQuestion);
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
