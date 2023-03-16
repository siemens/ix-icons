import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'ix-icons',
  plugins: [sass()],
  extras: {
    experimentalImportInjection: true,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        {
          src: '../dist-css/css',
          dest: '../../dist/css',
        },
        {
          src: '../dist-css/fonts',
          dest: '../../dist/fonts',
        },
        {
          src: '../dist-css/svg',
          dest: '../../dist/svg',
        },
        {
          src: '../dist-css/sample.html',
          dest: '../../dist/sample.html',
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
          src: '../dist-css/css',
          dest: 'build/css',
        },
        {
          src: '../dist-css/fonts',
          dest: 'build/fonts  ',
        },
        {
          src: '../svg',
          dest: 'build/svg  ',
        },
      ],
    },
  ],
};
