/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { resolveIcon } from './resolveIcon';

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
   * Use one of our defined icon names e.g. `copy`.
   */
  @Prop({ reflect: true }) name: string;

  /**
   * Path to the svg
   *
   * @internal
   */
  @Prop() src?: string;

  @State() svgContent?: string;

  connectedCallback() {
    this.loadIconContent();
  }

  @Watch('src')
  @Watch('name')
  async loadIconContent() {
    this.svgContent = await resolveIcon(this);
  }

  render() {
    const style: {
      [key: string]: string;
    } = {};

    if (this.color) {
      style['color'] = `var(--theme-${this.color})`;
    }

    if (this.name && !this.svgContent) {
      const iconName = this.name;
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
          <i
            class={{
              'glyph': true,
              [`glyph-${iconName}`]: true,
              'glyph-12': this.size === '12',
              'glyph-16': this.size === '16',
              'glyph-24': this.size === '24',
              'glyph-32': this.size === '32',
            }}
          ></i>
        </Host>
      );
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
        {this.svgContent ? (
          <div class={'svg-container'} innerHTML={this.svgContent}></div>
        ) : (
          <span
            class="skeleton-box"
            style={{
              width: '100%',
              height: '100%',
            }}
          ></span>
        )}
      </Host>
    );
  }
}
