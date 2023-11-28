/*
 * COPYRIGHT (c) Siemens AG 2018-2023 ALL RIGHTS RESERVED.
 */
import { Icon } from '../icon';
import { resolveIcon } from '../resolveIcon';

const exampleSvg = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="512px" height="512px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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

let fetch = (global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(exampleSvg),
    ok: true,
  }),
) as jest.Mock);

describe('resolve icon', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should resolve svg from name', async () => {
    const icon = new Icon();
    icon.name = 'http://localhost/test.svg';

    const expectedName: string = await resolveIcon(icon);

    expect(expectedName.startsWith('<svg')).toBeTruthy();
    expect(expectedName.endsWith('</svg>')).toBeTruthy();
  });

  it('should resolve svg from src', async () => {
    const icon = new Icon();
    icon.name = 'http://localhost/test.svg';

    const expectedName = await resolveIcon(icon);

    expect(expectedName).toEqual(
      `<svg width=\"512px\" height=\"512px\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"Shape\" fill=\"#000000\" transform=\"translate(65.929697, 65.929697)\"> <polygon points=\"211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14\"></polygon> </g> </g> </svg>`,
    );
  });

  it('should not resolve invalid svg from src', async () => {
    fetch = global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(invalidexampleSvg),
        ok: true,
      }),
    ) as jest.Mock;

    const icon = new Icon();
    icon.name = 'http://localhost/test.svg';

    await expect(resolveIcon(icon)).rejects.toThrow('No valid svg data provided');
  });
});
