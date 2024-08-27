import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import path from 'path';

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
          src: path.join(__dirname, 'build-dist'),
          dest: path.join(__dirname, 'dist'),
        },
      ],
    },
    {
      type: 'dist-custom-elements',
      dir: './components',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: path.join(__dirname, 'svg'),
          dest: 'build/svg  ',
        },
      ],
    },
  ],
};
