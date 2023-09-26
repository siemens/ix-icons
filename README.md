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

## Usage

Using icons within your project. You need to:

- Install `@siemens/ix-icons` e.g. `npm install --save @siemens/ix-icons`
- Load styling e.g. `@siemens/ix-icons/dist/scss/ix-icons.css`

```javascript
import { defineCustomElements } from '@siemens/ix-icons/loader';

(async () => {
  await defineCustomElements();
})();
```

### Use icon via string name

```html
<ix-icon name="rocket"></ix-icon>
```

### Use icon via import

```tsx
import { rocket } from '@siemens/ix-icons/icons';

<ix-icon name={rocket}></ix-icon>;
```

### Use `ix-icon` component with custom svg's

```tsx
<ix-icon name="/your/asset/path/my-icon.svg"></ix-icon>;
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

## 📝 License

Copyright © 2019–2023 [Siemens AG](https://www.siemens.com/).

This project is MIT licensed.
