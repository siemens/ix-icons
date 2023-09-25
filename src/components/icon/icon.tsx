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
import { iconMissingSymbol } from './icons';
import svgSprite from './icons-sprite';
import { parseSVGDataContent, resolveIcon } from './resolveIcon';

let spriteInjected = false;

@Component({
  tag: 'ix-icon',
  styleUrl: 'icon.scss',
  shadow: false,
  scoped: true,
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
    new Promise(() => {
      if (!spriteInjected) {
        console.log('inject sprite to DOM');
        const svg = parseSVGDataContent(`<svg display="none">${svgSprite}</svg>`);
        const div = document.createElement('DIV');
        div.innerHTML = svg;
        document.body.insertBefore(div.children[0], document.body.firstChild);
        spriteInjected = true;
      }
    });

    this.loadIconContent();
  }

  @Watch('name')
  async loadIconContent() {
    try {
      this.svgContent = await resolveIcon(this);
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
        <svg class={'svg-container'}>
          <use href="#rocket" />
        </svg>
      </Host>
    );
  }
}
