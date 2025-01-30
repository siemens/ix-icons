/*
 * COPYRIGHT (c) Siemens AG 2018-2023 ALL RIGHTS RESERVED.
 */
import { iconAdd, iconStar } from '../icons';
import { resolveIcon, getIconCacheMap, getIconUrl, parseSVGDataContent, loadIcons, addIcons } from '../resolveIcon';

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

const urlInvalid = 'http://localhost/invalid.svg';
const urlTest = 'http://localhost/test.svg';

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

  if (url === urlTest) {
    return Promise.resolve({
      text: () => Promise.resolve(exampleSvg),
      ok: true,
    });
  }

  if (url === urlInvalid) {
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
    const expectedName = await resolveIcon(urlTest);

    expect(expectedName).toEqual(
      `<svg width=\"512px\" height=\"512px\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>add</title> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"Shape\" fill=\"#000000\" transform=\"translate(65.929697, 65.929697)\"> <polygon points=\"211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14\"></polygon> </g> </g> </svg>`,
    );
  });

  it('should not resolve invalid svg from src', async () => {
    const icon = urlInvalid;

    await expect(resolveIcon(icon)).rejects.toThrow('No valid svg data provided');
  });
});

test('fill cache map if not loaded', async () => {
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  const data = await resolveIcon('star');

  expect(data).toBe(parseSVGDataContent(iconStar));
  expect(cacheMap.get(getIconUrl('star'))).toBe(parseSVGDataContent(iconStar));
});

test('preload custom icon', async () => {
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  cacheMap.set(getIconUrl('star'), '<svg>Test</svg>');

  const data = await resolveIcon('star');
  expect(data).toBe('<svg>Test</svg>');
});

test('load icons', async () => {
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  const icons = ['star', urlTest];

  loadIcons(icons);

  const urlStar = getIconUrl('star');

  expect(fetch.mock.calls).toEqual([[urlStar], [urlTest]]);
});

test('add icons', async () => {
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  addIcons({
    iconAdd,
  });

  expect(cacheMap.size).toBe(2);
  expect(cacheMap.has('iconAdd')).toBeTruthy();
  expect(cacheMap.has('add')).toBeTruthy();
});
