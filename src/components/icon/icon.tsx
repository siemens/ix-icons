import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'ix-icon',
  styleUrl: 'icon.scss',
  scoped: true,
  assetsDirs: ['assets'],
})
export class IxIcon {
  @Prop() name: string;

  render() {
    return (
      <Host>
        <i
          class={{
            glyph: true,
            [`glyph-${this.name}`]: true,
          }}
        ></i>
      </Host>
    );
  }
}
