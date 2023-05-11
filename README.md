<!--
SPDX-FileCopyrightText: 2022 Siemens AG

SPDX-License-Identifier: MIT
-->

![iX](./logo.svg)

> Siemens Industrial Experience Icons

![npm](https://img.shields.io/badge/npm-%3E%3D8.x.x-blue.svg)
![node](https://img.shields.io/badge/node-%3E%3D16.16.x-blue.svg)
![yarn](https://img.shields.io/badge/yarn->=1.x.x-blue.svg)
[![License: SEE LICENSE IN <LICENSE.md>](https://img.shields.io/badge/License-SEE%20LICENSE%20IN%20LICENSE.md-yellow.svg)](./LICENSE.md)

Icon web font library for `@siemens/ix`

## Usage

Using icons within your project. You need to:

- Install `@siemens/ix-icons` e.g `npm install --save @siemens/ix-icons`
- Load styling `@siemens/ix-icons/dist/scss/ix-icons.css` e.g

```scss
@import '@siemens/ix-icons/dist/scss/ix-icons.css';
```

## Usage without `@siemens/ix`

Using icons within your project. You need to:

- Install `@siemens/ix-icons` e.g `npm install --save @siemens/ix-icons`
- Load styling `@siemens/ix-icons/dist/scss/ix-icons.css` e.g

```javascript
import { defineCustomElements } from '@siemens/ix-icons/loader';

(async () => {
  await defineCustomElements();
})();
```

### Use icon via string name

In this case the `ix-icon` component is using the web font. Which requires the import of the css file in some of your style files:

`styles.css`
```scss
@import '@siemens/ix-icons/dist/scss/ix-icons.css';
```

`demo.html`
```html
<ix-icon name="rocket"></ix-icon>
```

### Use icon via import

```tsx
import { rocket } from '@siemens/ix-icons/icons';

// render your template code
<ix-icon name={rocket}></ix-icon>

```

## Development

### Installation

```sh
yarn install
```

### Build

```sh
yarn build
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## 👨‍💻 Contributors

- Daniel Leroux <daniel.leroux@siemens.com>
- Lukas Maurer <lukas.maurer@siemens.com>
- Carlos Leandro Cruz Ferrer <carlos.cruz_ferrer@siemens.com>
- Gonçalo Ferreira <goncalo.alves-ferreira@siemens.com>

## 📝 License

Copyright © 2019 [Siemens AG](https://www.siemens.com/).

This project is MIT licensed.
