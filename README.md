<!--
SPDX-FileCopyrightText: 2022 Siemens AG

SPDX-License-Identifier: MIT
-->

![iX](./logo.svg)

> Siemens Industrial Experience Icons

[![License: SEE LICENSE IN <LICENSE.md>](https://img.shields.io/badge/License-SEE%20LICENSE%20IN%20LICENSE.md-yellow.svg)](./LICENSE.md)

## Usage

Using icons within your project. You need to:

- Install `@siemens/ix-icons` e.g. `npm install --save @siemens/ix-icons`

```javascript
import { defineCustomElements } from '@siemens/ix-icons/loader';

(async () => {
  await defineCustomElements();
})();
```

### Angular / Web Component

```html
<ix-icon name="rocket"></ix-icon>
```

### React and Vue

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
pnpm install
```

### Build

```sh
pnpm build
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## 📝 License

Copyright © 2019–2023 [Siemens AG](https://www.siemens.com/).

This project is MIT licensed.
