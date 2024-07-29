/*
 * COPYRIGHT (c) Siemens AG 2018-2023 ALL RIGHTS RESERVED.
 */
import { setAssetPath } from '../../../index';
import { preloadIconMap } from '../../../legacy-support';
import { iconStar } from '../icons';
import { resolveIcon, getIconCacheMap, getAssetUrl, parseSVGDataContent } from '../resolveIcon';
const exampleSvg = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="512px" height="512px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>add</title>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Shape" fill="#000000" transform="translate(65.929697, 65.929697)">
            <polygon points="211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14"></polygon>
        </g>
    </g>
</svg>
`;

const invalidexampleSvg = `
<?xml version="1.0" encoding="UTF-8"?>
<script>
    alert('Test!');
</script>
`;

jest.mock('../meta-tag');
jest.mock('../icons', () => ({
  iconStar: exampleSvg,
}));
let fetch = (global.fetch = jest.fn((url: string) => {
  console.log(url);

  if (url === '/svg/star.svg') {
    return Promise.resolve({
      text: () => Promise.resolve(iconStar),
      ok: true,
    });
  }

  if (url === '/svg/bulb.svg') {
    return Promise.resolve({
      text: () => Promise.resolve(exampleSvg),
      ok: true,
    });
  }

  if (url === 'http://localhost/test.svg') {
    return Promise.resolve({
      text: () => Promise.resolve(exampleSvg),
      ok: true,
    });
  }

  if (url === 'http://localhost/invalid.svg') {
    return Promise.resolve({
      text: () => Promise.resolve(invalidexampleSvg),
      ok: true,
    });
  }
}) as jest.Mock);

describe('resolve icon', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should resolve svg from name', async () => {
    const data = await resolveIcon('bulb');

    expect(data).toBe(
      `<svg width=\"512px\" height=\"512px\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>add</title> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"Shape\" fill=\"#000000\" transform=\"translate(65.929697, 65.929697)\"> <polygon points=\"211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14\"></polygon> </g> </g> </svg>`,
    );
  });

  it('should resolve svg from src', async () => {
    const expectedName = await resolveIcon('http://localhost/test.svg');

    expect(expectedName).toEqual(
      `<svg width=\"512px\" height=\"512px\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>add</title> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"Shape\" fill=\"#000000\" transform=\"translate(65.929697, 65.929697)\"> <polygon points=\"211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14\"></polygon> </g> </g> </svg>`,
    );
  });

  it('should not resolve invalid svg from src', async () => {
    const icon = 'http://localhost/invalid.svg';

    await expect(resolveIcon(icon)).rejects.toThrow('No valid svg data provided');
  });
});

test('preload icon map', async () => {
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  preloadIconMap();
  expect(cacheMap.size).toBeGreaterThan(0);

  const data = await resolveIcon('bulb');

  expect(cacheMap.size).toBeGreaterThan(0);
  expect(fetch).not.toHaveBeenCalled();
  expect(data).toBe(
    '<svg width="512px" height="512px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Combined-Shape" transform="translate(42.666667, 21.333333)"><path d="M213.333333,85.3333333 C284.025781,85.3333333 341.333333,142.640885 341.333333,213.333333 C341.333333,260.711239 315.5928,302.077122 277.333732,324.208982 L277.333333,405.333333 L256,426.666667 L234.666667,426.666667 C234.666667,438.448741 225.115408,448 213.333333,448 C201.551259,448 192,438.448741 192,426.666667 L192,426.666667 L170.666667,426.666667 L149.333333,405.333333 L149.332954,324.208993 C111.073876,302.077136 85.3333333,260.711248 85.3333333,213.333333 C85.3333333,142.640885 142.640885,85.3333333 213.333333,85.3333333 Z M234.667665,339.563386 C227.72957,340.727434 220.602209,341.333333 213.333333,341.333333 C206.064458,341.333333 198.937097,340.727434 191.999002,339.563386 L192,384 L234.666667,384 L234.667665,339.563386 Z M96.4250122,307.614237 L119.052429,330.241654 L73.7975952,375.496488 L51.1701782,352.869071 L96.4250122,307.614237 Z M330.241654,307.614237 L375.496488,352.869071 L352.869071,375.496488 L307.614237,330.241654 L330.241654,307.614237 Z M213.333333,128 C166.205035,128 128,166.205035 128,213.333333 C128,260.461632 166.205035,298.666667 213.333333,298.666667 C260.461632,298.666667 298.666667,260.461632 298.666667,213.333333 C298.666667,166.205035 260.461632,128 213.333333,128 Z M426.666667,197.333333 L426.666667,229.333333 L362.666667,229.333333 L362.666667,197.333333 L426.666667,197.333333 Z M64,197.333333 L64,229.333333 L3.55271368e-14,229.333333 L3.55271368e-14,197.333333 L64,197.333333 Z M352.869071,51.1701782 L375.496488,73.7975952 L330.241654,119.052429 L307.614237,96.4250122 L352.869071,51.1701782 Z M73.7975952,51.1701782 L119.052429,96.4250122 L96.4250122,119.052429 L51.1701782,73.7975952 L73.7975952,51.1701782 Z M229.333333,-1.0658141e-14 L229.333333,64 L197.333333,64 L197.333333,-1.0658141e-14 L229.333333,-1.0658141e-14 Z"></path></g></g></svg>',
  );
});

test('fill cache map if not loaded', async () => {
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  expect(cacheMap.size).toBe(0);

  const data = await resolveIcon('star');

  expect(data).toBe(parseSVGDataContent(iconStar));
  expect(cacheMap.get(getAssetUrl('star'))).toBe(parseSVGDataContent(iconStar));
});

test('preload custom icon', async () => {
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  cacheMap.set(getAssetUrl('star'), '<svg>Test</svg>');

  const data = await resolveIcon('star');
  expect(data).toBe('<svg>Test</svg>');
});
