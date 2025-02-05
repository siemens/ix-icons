/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Component, h, Host, Prop, State, Watch, Element, Build } from '@stencil/core';
import { resolveIcon } from './resolveIcon';
import { errorSymbol, parseSVGDataContent } from './parser';

@Component({
  tag: 'ix-icon',
  styleUrl: 'icon.scss',
  shadow: true,
  assetsDirs: ['svg'],
})
export class Icon {
  @Element() hostElement!: HTMLIxIconElement;

  /**
   * Size of the icon
   */
  @Prop() size: '12' | '16' | '24' | '32' = '24';

  /**
   * Color of the icon
   */
  @Prop() color?: string;

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
  @Prop() name?: string;

  /**
   * Only fetch and parse svg data when icon is visible
   */
  @Prop() lazyLoading = false;

  @State() svgContent?: string;
  @State() isVisible = false;

  componentWillLoad() {
    this.waitForRendering(() => {
      this.isVisible = true;
      this.loadIconContent();
    });
  }

  @Watch('name')
  async loadIconContent() {
    const content = await resolveIcon(this.hostElement, this.name);

    if (!content) {
      this.svgContent = parseSVGDataContent(errorSymbol);
      return;
    }

    this.svgContent = content;
  }

  private waitForRendering(onRender: () => void) {
    if (Build.isBrowser && this.lazyLoading && typeof window !== 'undefined' && (window as any).IntersectionObserver) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              onRender();
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '25px',
        },
      );

      observer.observe(this.hostElement);
    } else {
      onRender();
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
