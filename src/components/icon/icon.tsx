/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, getAssetPath, h, Host, Prop, State, Watch } from '@stencil/core';

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
   * Use one of our defined icon names e.g. `copy`.
   */
  @Prop({ reflect: true }) name: string;

  /**
   * Path to the svg
   */
  @Prop() src?: string;

  @State() svgContent?: string;

  connectedCallback() {
    this.fetchIcon();
  }

  @Watch('src')
  @Watch('name')
  async fetchIcon() {
    const response = await fetch(getAssetPath('svg/rocket.svg'));
    if (response.ok) {
      console.log(await response.text());
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
      ></Host>
    );

    // return (
    //   <Host
    //     style={style}
    //     class={{
    //       ['size-12']: this.size === '12',
    //       ['size-16']: this.size === '16',
    //       ['size-24']: this.size === '24',
    //       ['size-32']: this.size === '32',
    //     }}
    //   >
    //     <i
    //       class={{
    //         'glyph': true,
    //         [`glyph-${this.name}`]: true,
    //         'glyph-12': this.size === '12',
    //         'glyph-16': this.size === '16',
    //         'glyph-24': this.size === '24',
    //         'glyph-32': this.size === '32',
    //       }}
    //     >
    //       <slot></slot>
    //     </i>
    //   </Host>
    // );
  }
}
