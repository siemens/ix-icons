/*
 * COPYRIGHT (c) Siemens AG 2018-2023 ALL RIGHTS RESERVED.
 */
import { resolveIcon, getIconCacheMap, getIconUrl, addIcons } from '../resolveIcon';
import { parseSVGDataContent } from '../parser';

export const iconStarFilled =
  "data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg width='512px' height='512px' viewBox='0 0 512 512' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='add' transform='translate(18.640071, 18.640071)'><polygon id='Star' points='237.359929 344.171897 97.8432633 429.388145 135.775711 270.366642 11.6172218 164.011677 174.577429 150.947232 237.359929 3.90798505e-14 300.142429 150.947232 463.102636 164.011677 338.944147 270.366642 376.876595 429.388145'/></g></g></svg>";
export const iconStar =
  "data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg width='512px' height='512px' viewBox='0 0 512 512' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='add' transform='translate(30.257293, 18.640071)'><path d='M225.742707,0 L288.525207,150.947232 L451.485414,164.011677 L327.326925,270.366642 L365.259373,429.388145 L225.742707,344.171897 L86.2260415,429.388145 L124.158489,270.366642 L2.84217094e-14,164.011677 L162.960208,150.947232 L225.742707,0 Z M259.138288,191.394856 L225.742707,111.087929 L192.347127,191.394856 L105.657374,198.341262 L171.707523,254.917025 L151.524041,339.503929 L225.742707,294.175885 L299.940041,339.503929 L279.777892,254.917025 L345.806707,198.341262 L259.138288,191.394856 Z' id='Star'/></g></g></svg>";

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

let fetch = (global.fetch = jest.fn((url: string) => {
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
  let element: HTMLIxIconElement = null!;

  beforeEach(() => {
    fetch.mockClear();
    element = document.createElement('ix-icon');
  });

  it('should resolve svg from name', async () => {
    const data = await resolveIcon(element, 'bulb');

    expect(data).toBe(
      `<svg width=\"512px\" height=\"512px\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>add</title> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"Shape\" fill=\"#000000\" transform=\"translate(65.929697, 65.929697)\"> <polygon points=\"211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14\"></polygon> </g> </g> </svg>`,
    );
  });

  it('should resolve svg from src', async () => {
    const expectedName = await resolveIcon(element, urlTest);

    expect(expectedName).toEqual(
      `<svg width=\"512px\" height=\"512px\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>add</title> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"Shape\" fill=\"#000000\" transform=\"translate(65.929697, 65.929697)\"> <polygon points=\"211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14\"></polygon> </g> </g> </svg>`,
    );
  });

  it('should not resolve invalid svg from src', async () => {
    const icon = urlInvalid;

    const content = await resolveIcon(element, icon);
    expect(content).toEqual('');
  });
});

test('fill cache map if not loaded', async () => {
  const element = document.createElement('ix-icon');
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  const data = await resolveIcon(element, 'star');

  expect(data).toBe(parseSVGDataContent(iconStar));
  expect(cacheMap.get(getIconUrl('star', element))).toBe(parseSVGDataContent(iconStar));
});

test('preload custom icon', async () => {
  const element = document.createElement('ix-icon');
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  cacheMap.set(getIconUrl('star', element), '<svg>Test</svg>');

  const data = await resolveIcon(element, 'star');
  expect(data).toBe('<svg>Test</svg>');
});

test('add icons', async () => {
  fetch.mockClear();

  const cacheMap = getIconCacheMap();
  cacheMap.clear();

  addIcons({
    iconStarFilled,
  });

  expect(cacheMap.size).toBe(2);
  expect(cacheMap.has('starFilled')).toBeTruthy();
  expect(cacheMap.has('star-filled')).toBeTruthy();
});
