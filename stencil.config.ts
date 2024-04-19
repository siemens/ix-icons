import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'ix-icons',
  plugins: [sass()],
  extras: {
    enableImportInjection: true,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        {
          src: '../dist-css/svg',
          dest: '../../dist/svg',
        },
        {
          src: '../dist-css/css',
          dest: '../../dist/css',
        },
        {
          src: '../dist-css/sample.json',
          dest: '../../dist/sample.json',
        },
      ],
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: '../svg',
          dest: 'build/svg  ',
        },
      ],
    },
  ],
};
