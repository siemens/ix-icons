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

test('handle encoded URI data', async () => {
  const element = document.createElement('ix-icon');
  const svg = `data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M21.0953%203V4.755H19.4973L21.9583%2011.3026L22%2011.5321V11.5725C22%2013.4726%2020.4556%2015.015%2018.5478%2015.015C16.7035%2015.015%2015.199%2013.5737%2015.1007%2011.7609L15.1001%2011.7488L15.0945%2011.5381L15.1374%2011.3026L17.5983%204.755H13.3814V16.68H19.3811V21H5.61999V16.68H11.6196V4.755H7.40276L9.86373%2011.3026L9.90546%2011.5321V11.5725C9.90546%2013.4726%208.36104%2015.015%206.45327%2015.015C4.60898%2015.015%203.10445%2013.5737%203.00619%2011.7609L3.00553%2011.7488L3%2011.5381L3.04282%2011.3026L5.50379%204.755H3.9058V3H21.0953ZM7.38179%2019.245H17.6193V18.435H7.38179V19.245ZM5.00926%2012.4504H7.89736C7.60139%2012.9344%207.06803%2013.2576%206.46017%2013.26L6.34174%2013.2562L6.22565%2013.2449C5.71119%2013.1759%205.26891%2012.8749%205.00926%2012.4504ZM17.1038%2012.4504C17.3635%2012.8749%2017.8057%2013.1759%2018.3202%2013.2449L18.4363%2013.2562L18.5547%2013.26C19.1626%2013.2576%2019.6959%2012.9344%2019.9919%2012.4504H17.1038ZM18.5478%207.23449L17.2467%2010.695H19.849L18.5478%207.23449ZM6.45327%207.2345L7.75443%2010.695H5.15212L6.45327%207.2345Z'%20fill='white'/%3e%3c/svg%3e`;
  const icon = await resolveIcon(element, svg);

  expect(icon).toBeDefined();
  expect(icon).toBe(
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.0953 3V4.755H19.4973L21.9583 11.3026L22 11.5321V11.5725C22 13.4726 20.4556 15.015 18.5478 15.015C16.7035 15.015 15.199 13.5737 15.1007 11.7609L15.1001 11.7488L15.0945 11.5381L15.1374 11.3026L17.5983 4.755H13.3814V16.68H19.3811V21H5.61999V16.68H11.6196V4.755H7.40276L9.86373 11.3026L9.90546 11.5321V11.5725C9.90546 13.4726 8.36104 15.015 6.45327 15.015C4.60898 15.015 3.10445 13.5737 3.00619 11.7609L3.00553 11.7488L3 11.5381L3.04282 11.3026L5.50379 4.755H3.9058V3H21.0953ZM7.38179 19.245H17.6193V18.435H7.38179V19.245ZM5.00926 12.4504H7.89736C7.60139 12.9344 7.06803 13.2576 6.46017 13.26L6.34174 13.2562L6.22565 13.2449C5.71119 13.1759 5.26891 12.8749 5.00926 12.4504ZM17.1038 12.4504C17.3635 12.8749 17.8057 13.1759 18.3202 13.2449L18.4363 13.2562L18.5547 13.26C19.1626 13.2576 19.6959 12.9344 19.9919 12.4504H17.1038ZM18.5478 7.23449L17.2467 10.695H19.849L18.5478 7.23449ZM6.45327 7.2345L7.75443 10.695H5.15212L6.45327 7.2345Z" fill="white"></path></svg>`,
  );
});
