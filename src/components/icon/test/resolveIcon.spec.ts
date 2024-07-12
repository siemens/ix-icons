/*
 * COPYRIGHT (c) Siemens AG 2018-2023 ALL RIGHTS RESERVED.
 */
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

  expect(fetch).not.toHaveBeenCalled();
  expect(data).toBe(
    `<svg width=\"512px\" height=\"512px\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>add</title> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"Shape\" fill=\"#000000\" transform=\"translate(65.929697, 65.929697)\"> <polygon points=\"211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14\"></polygon> </g> </g> </svg>`,
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
