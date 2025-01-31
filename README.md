<!--
SPDX-FileCopyrightText: 2022 Siemens AG

SPDX-License-Identifier: MIT
-->

![iX](./logo.svg)

> Siemens Industrial Experience Icons

[![License: SEE LICENSE IN <LICENSE.md>](https://img.shields.io/badge/License-SEE%20LICENSE%20IN%20LICENSE.md-yellow.svg)](./LICENSE.md)

## Usage

If you're using [Siemens Industrial Experience](https://github.com/siemens/ix/) library you don't have to setup your project this will be done via `@siemens/ix-angular`, `@siemens/ix-react` or `@siemens/ix-vue`, so no additional setup is necessary.

You want to use `@siemens/ix-icons` without `@siemens/ix` you need to follow these steps.

### Using CDN

Place the following `<script>` near the end of your page, right before the closing </body> tag, to enable them.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@siemens/ix-icons@%5E3.0.0/dist/ix-icons/ix-icons.esm.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/@siemens/ix-icons@%5E3.0.0/dist/ix-icons/ix-icons.js"></script>
```

Use the icon

```html
<ix-icon name="star"></ix-icon>
```

### Using package manager like `npm`/`pnpm`/`yarn`

First install the package `@siemens/ix-icons@latest` in your project (e.g. `npm install --save @siemens/ix-icons`).

Then load the icon component:

```javascript
import { defineCustomElements } from '@siemens/ix-icons/loader';

// Register Web Component <ix-icon></ix-icon>
defineCustomElements();
```

### Prepare your project

1. **Copy SVG Files:**
   Copy all SVG files located under `node_modules/@siemens/ix-icons/svg` to an asset folder in your project. This allows the `ix-icon` component to fetch the images.

2. **Alternative Method:**
   Alternatively, you can use the `addIcons` function to load specific icons directly in your code. For example:

   ```javascript
   import { addIcons } from '@siemens/ix-icons';
   import { iconStar } from '@siemens/ix-icons/icons';

   addIcons({ iconStar });
   ```

   ```html
   <ix-icon name="star"></ix-icon>
   ```

   You need only add the same icon once, additional calling `addIcons` will not add additional icons to the collection.

### Use `ix-icon` component with custom svg's

```tsx
<ix-icon name="/your/asset/path/my-icon.svg"></ix-icon>
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
