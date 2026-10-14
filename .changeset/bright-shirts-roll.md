---
'@siemens/ix-icons': minor
---

The `color` property of the `ix-icon` component now accepts CSS custom properties directly while continuing to support legacy theme token names. For example, a legacy token such as `primary` is still resolved as `var(--theme-primary)`, while CSS custom properties must be passed with their leading `--` prefix, for example `--si-sys-color-primary`.
