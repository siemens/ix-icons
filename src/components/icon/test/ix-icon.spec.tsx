/*
 * COPYRIGHT (c) Siemens AG 2018-2023 ALL RIGHTS RESERVED.
 */
import { newSpecPage } from '@stencil/core/testing';
import { Icon } from '../icon';
import { rocket } from './rocker-example';

//@ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () =>
      Promise.resolve(`
      <svg height="512px" version="1.1" viewBox="0 0 512 512" width="512px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
        <title>
          rocket
        </title>
        <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
          <g id="icon" transform="translate(42.666667, 64.000000)">
            <path d="M405.333333,1.42108547e-14 C396.316305,122.794806 364.316305,211.683695 309.333333,266.666667 C299.582265,276.417735 288.905446,285.33185 277.302879,293.409011 L277.302464,341.234872 L213.302464,405.234872 L174.248,336.891 L68.525,231.157 L7.10542736e-15,192 L64,128 L112.079613,128.000404 C120.083859,116.387258 128.94621,105.720457 138.666667,96 C193.649638,41.0170286 282.538527,9.01702859 405.333333,1.42108547e-14 Z M357.333333,47.9786667 L348.203556,49.3631108 C266.32942,62.2476147 206.763982,88.2424635 168.836556,126.169889 C146.004433,149.002012 128.637057,178.732412 116.876114,215.881246 L116.096,218.389333 L187.584,289.877333 L191.120585,288.76541 C224.531258,277.548675 251.975141,261.807487 273.818948,241.632769 L279.163444,236.496777 C317.09087,198.569351 343.085719,139.003914 355.970222,57.1297769 L357.333333,47.9786667 Z M75.9901363,269.368015 L30.7353023,314.622849 L0.565412939,284.452959 L45.8202469,239.198125 L75.9901363,269.368015 Z M121.24497,314.622849 L45.8202469,390.047572 L15.6503576,359.877683 L91.0750809,284.452959 L121.24497,314.622849 Z M136.329915,329.707793 L166.499804,359.877683 L121.24497,405.132517 L91.0750809,374.962627 L136.329915,329.707793 Z M245.333333,128 C263.006445,128 277.333333,142.326888 277.333333,160 C277.333333,177.673112 263.006445,192 245.333333,192 C227.660221,192 213.333333,177.673112 213.333333,160 C213.333333,142.326888 227.660221,128 245.333333,128 Z" id="Combined-Shape"></path>
          </g>
        </g>
      </svg>
    `),
  }),
);

describe('ix-icon', () => {
  beforeEach(() => {
    //@ts-ignore
    fetch.mockClear();
  });

  it('should render with icon font', async () => {
    const page = await newSpecPage({
      components: [Icon],
      html: `<ix-icon name="rocket"></ix-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <ix-icon name="rocket">
        <mock:shadow-root>
          <i class="glyph glyph-rocket"></i>
        </mock:shadow-root>
      </ix-icon>
    `);
  });

  it('should render base64 data url svg as fallback via name attribute', async () => {
    const page = await newSpecPage({
      components: [Icon],
      html: `<ix-icon name="${rocket}"></ix-icon>`,
    });
    expect(page.root.shadowRoot).toEqualHtml(`
    <div class="svg-container">
      <svg height="512px" version="1.1" viewBox="0 0 512 512" width="512px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
        <title>
          rocket
        </title>
        <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
          <g id="icon" transform="translate(42.666667, 64.000000)">
            <path d="M405.333333,1.42108547e-14 C396.316305,122.794806 364.316305,211.683695 309.333333,266.666667 C299.582265,276.417735 288.905446,285.33185 277.302879,293.409011 L277.302464,341.234872 L213.302464,405.234872 L174.248,336.891 L68.525,231.157 L7.10542736e-15,192 L64,128 L112.079613,128.000404 C120.083859,116.387258 128.94621,105.720457 138.666667,96 C193.649638,41.0170286 282.538527,9.01702859 405.333333,1.42108547e-14 Z M357.333333,47.9786667 L348.203556,49.3631108 C266.32942,62.2476147 206.763982,88.2424635 168.836556,126.169889 C146.004433,149.002012 128.637057,178.732412 116.876114,215.881246 L116.096,218.389333 L187.584,289.877333 L191.120585,288.76541 C224.531258,277.548675 251.975141,261.807487 273.818948,241.632769 L279.163444,236.496777 C317.09087,198.569351 343.085719,139.003914 355.970222,57.1297769 L357.333333,47.9786667 Z M75.9901363,269.368015 L30.7353023,314.622849 L0.565412939,284.452959 L45.8202469,239.198125 L75.9901363,269.368015 Z M121.24497,314.622849 L45.8202469,390.047572 L15.6503576,359.877683 L91.0750809,284.452959 L121.24497,314.622849 Z M136.329915,329.707793 L166.499804,359.877683 L121.24497,405.132517 L91.0750809,374.962627 L136.329915,329.707793 Z M245.333333,128 C263.006445,128 277.333333,142.326888 277.333333,160 C277.333333,177.673112 263.006445,192 245.333333,192 C227.660221,192 213.333333,177.673112 213.333333,160 C213.333333,142.326888 227.660221,128 245.333333,128 Z" id="Combined-Shape"></path>
          </g>
        </g>
      </svg>
    </div>
    `);
  });

  it('should render base64 data url svg via src attribute', async () => {
    const page = await newSpecPage({
      components: [Icon],
      html: `<ix-icon src="${rocket}"></ix-icon>`,
    });
    expect(page.root.shadowRoot).toEqualHtml(`
    <div class="svg-container">
      <svg height="512px" version="1.1" viewBox="0 0 512 512" width="512px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
        <title>
          rocket
        </title>
        <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
          <g id="icon" transform="translate(42.666667, 64.000000)">
            <path d="M405.333333,1.42108547e-14 C396.316305,122.794806 364.316305,211.683695 309.333333,266.666667 C299.582265,276.417735 288.905446,285.33185 277.302879,293.409011 L277.302464,341.234872 L213.302464,405.234872 L174.248,336.891 L68.525,231.157 L7.10542736e-15,192 L64,128 L112.079613,128.000404 C120.083859,116.387258 128.94621,105.720457 138.666667,96 C193.649638,41.0170286 282.538527,9.01702859 405.333333,1.42108547e-14 Z M357.333333,47.9786667 L348.203556,49.3631108 C266.32942,62.2476147 206.763982,88.2424635 168.836556,126.169889 C146.004433,149.002012 128.637057,178.732412 116.876114,215.881246 L116.096,218.389333 L187.584,289.877333 L191.120585,288.76541 C224.531258,277.548675 251.975141,261.807487 273.818948,241.632769 L279.163444,236.496777 C317.09087,198.569351 343.085719,139.003914 355.970222,57.1297769 L357.333333,47.9786667 Z M75.9901363,269.368015 L30.7353023,314.622849 L0.565412939,284.452959 L45.8202469,239.198125 L75.9901363,269.368015 Z M121.24497,314.622849 L45.8202469,390.047572 L15.6503576,359.877683 L91.0750809,284.452959 L121.24497,314.622849 Z M136.329915,329.707793 L166.499804,359.877683 L121.24497,405.132517 L91.0750809,374.962627 L136.329915,329.707793 Z M245.333333,128 C263.006445,128 277.333333,142.326888 277.333333,160 C277.333333,177.673112 263.006445,192 245.333333,192 C227.660221,192 213.333333,177.673112 213.333333,160 C213.333333,142.326888 227.660221,128 245.333333,128 Z" id="Combined-Shape"></path>
          </g>
        </g>
      </svg>
    </div>
    `);
  });

  it('should fetch and render svg via http get call', async () => {
    const page = await newSpecPage({
      components: [Icon],
      html: `<ix-icon src="/data/example.svg"></ix-icon>`,
    });

    expect(global.fetch).toHaveBeenCalledWith('/data/example.svg');

    expect(page.root.shadowRoot).toEqualHtml(`
    <div class="svg-container">
      <svg height="512px" version="1.1" viewBox="0 0 512 512" width="512px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
        <title>
          rocket
        </title>
        <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
          <g id="icon" transform="translate(42.666667, 64.000000)">
            <path d="M405.333333,1.42108547e-14 C396.316305,122.794806 364.316305,211.683695 309.333333,266.666667 C299.582265,276.417735 288.905446,285.33185 277.302879,293.409011 L277.302464,341.234872 L213.302464,405.234872 L174.248,336.891 L68.525,231.157 L7.10542736e-15,192 L64,128 L112.079613,128.000404 C120.083859,116.387258 128.94621,105.720457 138.666667,96 C193.649638,41.0170286 282.538527,9.01702859 405.333333,1.42108547e-14 Z M357.333333,47.9786667 L348.203556,49.3631108 C266.32942,62.2476147 206.763982,88.2424635 168.836556,126.169889 C146.004433,149.002012 128.637057,178.732412 116.876114,215.881246 L116.096,218.389333 L187.584,289.877333 L191.120585,288.76541 C224.531258,277.548675 251.975141,261.807487 273.818948,241.632769 L279.163444,236.496777 C317.09087,198.569351 343.085719,139.003914 355.970222,57.1297769 L357.333333,47.9786667 Z M75.9901363,269.368015 L30.7353023,314.622849 L0.565412939,284.452959 L45.8202469,239.198125 L75.9901363,269.368015 Z M121.24497,314.622849 L45.8202469,390.047572 L15.6503576,359.877683 L91.0750809,284.452959 L121.24497,314.622849 Z M136.329915,329.707793 L166.499804,359.877683 L121.24497,405.132517 L91.0750809,374.962627 L136.329915,329.707793 Z M245.333333,128 C263.006445,128 277.333333,142.326888 277.333333,160 C277.333333,177.673112 263.006445,192 245.333333,192 C227.660221,192 213.333333,177.673112 213.333333,160 C213.333333,142.326888 227.660221,128 245.333333,128 Z" id="Combined-Shape"></path>
          </g>
        </g>
      </svg>
    </div>
    `);
  });

  it('should show error placeholder if svg is not found', async () => {
    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(`ERROR!`),
      }),
    );

    const page = await newSpecPage({
      components: [Icon],
      html: `<ix-icon src="/data/not-existing.svg"></ix-icon>`,
    });

    expect(page.root.shadowRoot).toEqualHtml(`<span class="skeleton-box" style="width: 100%; height: 100%;"></span>`);
  });
});
