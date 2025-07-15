# @siemens/ix-icons

## 3.1.1

### Patch Changes

- [#97](https://github.com/siemens/ix-icons/pull/97) [`d72a080`](https://github.com/siemens/ix-icons/commit/d72a080534c7ba7e518a008c3456045aa2e2eba3) Thanks [@danielleroux](https://github.com/danielleroux)! - Fix package exports to point to correct commonjs file

- [#94](https://github.com/siemens/ix-icons/pull/94) [`9c93993`](https://github.com/siemens/ix-icons/commit/9c93993160702514a61cf5065484a5664e3769cc) Thanks [@danielleroux](https://github.com/danielleroux)! - Update stencil to v4.35.3

- [#90](https://github.com/siemens/ix-icons/pull/90) [`5bd49d4`](https://github.com/siemens/ix-icons/commit/5bd49d417527978d8198f7b9d06b88413492925c) Thanks [@lzeiml](https://github.com/lzeiml)! - Set aria-hidden for icon svg
  Set "img" role for icon host element

## 3.1.0

### Minor Changes

- [#85](https://github.com/siemens/ix-icons/pull/85) [`ba9b506`](https://github.com/siemens/ix-icons/commit/ba9b5060f5b5ceeb852bd34a23512fb752f18354) Thanks [@danielleroux](https://github.com/danielleroux)! - Update dependencies, move stencil/core to devDependencies

### Patch Changes

- [#88](https://github.com/siemens/ix-icons/pull/88) [`c83174b`](https://github.com/siemens/ix-icons/commit/c83174bc3a468895113d0f6461e9fd97b58cd59b) Thanks [@silviowolf](https://github.com/silviowolf)! - Remove transparency form license.svg

  Fixes siemens/ix#1935

- [#86](https://github.com/siemens/ix-icons/pull/86) [`9bec0de`](https://github.com/siemens/ix-icons/commit/9bec0de543e2aefa5dcfd3fa11b7e71df6d7daa9) Thanks [@silviowolf](https://github.com/silviowolf)! - Update image for text-document

## 3.0.0

### Major Changes

- [#65](https://github.com/siemens/ix-icons/pull/65) [`0d271ac`](https://github.com/siemens/ix-icons/commit/0d271ac1791b007520cd00698ce2082a46a3f07d) Thanks [@danielleroux](https://github.com/danielleroux)! - - Add new set of icons

  - Icon replacements:

  | removed                      | replaced by                  |
  | ---------------------------- | ---------------------------- |
  | add-cirlce-small-filled      | add-circle-small-filled      |
  | asset-network-1              | asset-network-filled         |
  | battery-bolt                 | battery-charge               |
  | battery-upright-bolt         | battery-upright-charge       |
  | checkbox-component-checked   | checkbox                     |
  | corner-arrow-up-left         | arrow-up-left                |
  | draw-cirlce                  | draw-circle                  |
  | filter-outline               | filter                       |
  | folder-new-outline           | folder-new                   |
  | folder-open-outline          | folder-open                  |
  | folder-outline               | folder                       |
  | full-screeen-exit            | full-screen-exit             |
  | full-screeen                 | full-screen                  |
  | location-outline             | location                     |
  | new-indicator-filled         | add-circle-small-filled      |
  | new-indicator                | add-circle-small             |
  | no-anomaly                   | anomaly-none                 |
  | plant-outline                | plant                        |
  | tag-cirlce-arrow-down        | tag-circle-arrow-down        |
  | tag-cirlce-arrow-down-filled | tag-circle-arrow-down-filled |
  | thumb-filled                 | thumb-down-filled            |
  | user-reading-reading         | user-reading-filled          |

  - Icon `landing-page-logo` removed without an replacement

- [#65](https://github.com/siemens/ix-icons/pull/65) [`0d271ac`](https://github.com/siemens/ix-icons/commit/0d271ac1791b007520cd00698ce2082a46a3f07d) Thanks [@danielleroux](https://github.com/danielleroux)! - feat: remove prebundled icons

### Minor Changes

- [#83](https://github.com/siemens/ix-icons/pull/83) [`e2bf758`](https://github.com/siemens/ix-icons/commit/e2bf758b0b837796c0cd22f25d6424f9523878af) Thanks [@danielleroux](https://github.com/danielleroux)! - add table specific icons

  - table-add-column-right
  - table-add-row-below
  - table-insert-column-left
  - table-insert-column-right
  - table-insert-row-above
  - table-insert-row-below

- [#65](https://github.com/siemens/ix-icons/pull/65) [`0d271ac`](https://github.com/siemens/ix-icons/commit/0d271ac1791b007520cd00698ce2082a46a3f07d) Thanks [@danielleroux](https://github.com/danielleroux)! - Allow users to put specific icons into the cache.

- [#83](https://github.com/siemens/ix-icons/pull/83) [`e2bf758`](https://github.com/siemens/ix-icons/commit/e2bf758b0b837796c0cd22f25d6424f9523878af) Thanks [@danielleroux](https://github.com/danielleroux)! - Convert package to type module

- [#83](https://github.com/siemens/ix-icons/pull/83) [`e2bf758`](https://github.com/siemens/ix-icons/commit/e2bf758b0b837796c0cd22f25d6424f9523878af) Thanks [@danielleroux](https://github.com/danielleroux)! - - Update shapes of battery icons, affected icons:

  - battery-charge
  - battery-check
  - battery-empty-question
  - battery-exclamation
  - battery-full-check
  - battery-full
  - battery-half
  - battery-low
  - battery-quarter
  - battery-slash
  - battery-three-quarter
  - battery-upright-charge
  - battery-upright-check
  - battery-upright-empty-question
  - battery-upright-exclamation
  - battery-upright-full-check
  - battery-upright-full
  - battery-upright-half
  - battery-upright-low
  - battery-upright-quarter
  - battery-upright-slash
  - battery-upright-three-quarter

  - Update shape of cloud icons, affected icons:

    - cloud-download-add-filled
    - cloud-download-add
    - cloud-download-filled
    - cloud-download-list-filled
    - cloud-download-list
    - cloud-download
    - cloud-filled
    - cloud-new-filled
    - cloud-new
    - cloud-upload-filled
    - cloud-upload
    - cloud
    - cloud-cancelled-filled
    - cloud-cancelled
    - cloud-fail-filled
    - cloud-fail
    - cloud-rain-filled
    - cloud-rain
    - cloud-snow-filled
    - cloud-snow
    - cloud-success-filled
    - cloud-success
    - cloud-thunder-filled
    - cloud-thunder
    - sun-cloud-filled
    - sun-cloud

  - Add new icons

    - error-multiple-filled
    - error-multiple
    - info-multiple-filled
    - info-multiple
    - success-multiple-filled
    - success-multiple
    - warning-multiple-filled
    - warning-multiple
    - warning-rhomb-multiple-filled
    - warning-rhomb-multiple
    - asset-indoor
    - asset-outdoor
    - bug-runtime-filled
    - bug-runtime
    - capacity-check-filled
    - capacity-check
    - capacity-locked-filled
    - capacity-locked
    - capacity-pen-filled
    - capacity-pen
    - clock-person
    - communication-filled
    - communication
    - dashboard-pen-filled
    - dashboard-pen
    - device-manager
    - document-plus-minus-filled
    - document-plus-minus
    - export-check
    - export-failed
    - export-progress
    - extension
    - eye-dropper
    - folder-application-screen
    - folder-tag
    - grid-pen
    - id-filled
    - id
    - java-script-connection
    - list-percentage
    - lock-check
    - move-horizontally
    - move-vertically
    - pen-cancelled-filled
    - pen-cancelled
    - projects
    - remote-access (closes https://github.com/siemens/ix/issues/1673)
    - tag-connection-view
    - tree-two-level
    - trend-flat-curve
    - user-lock-filled
    - user-lock
    - user-management-settings-filled
    - user-management-settings

  - Fix ending of thermometer-filled not rounded

- [#65](https://github.com/siemens/ix-icons/pull/65) [`0d271ac`](https://github.com/siemens/ix-icons/commit/0d271ac1791b007520cd00698ce2082a46a3f07d) Thanks [@danielleroux](https://github.com/danielleroux)! - - Improve logging by including HTML element in output to identify the source component.
  - Update stencil version to 4.27.1

### Patch Changes

- [#83](https://github.com/siemens/ix-icons/pull/83) [`e2bf758`](https://github.com/siemens/ix-icons/commit/e2bf758b0b837796c0cd22f25d6424f9523878af) Thanks [@danielleroux](https://github.com/danielleroux)! - **ix-icon** component can now handle encoded URI strings

## 3.0.0-alpha.1

### Minor Changes

- [#77](https://github.com/siemens/ix-icons/pull/77) [`1d49f19`](https://github.com/siemens/ix-icons/commit/1d49f19ef80b5f39e8500bec9b0a78e2984a240b) Thanks [@danielleroux](https://github.com/danielleroux)! - Convert package to type module

## 3.0.0-alpha.0

### Major Changes

- [#65](https://github.com/siemens/ix-icons/pull/65) [`0d271ac`](https://github.com/siemens/ix-icons/commit/0d271ac1791b007520cd00698ce2082a46a3f07d) Thanks [@danielleroux](https://github.com/danielleroux)! - - Add new set of icons

  - Icon replacements:

  | removed                      | replaced by                  |
  | ---------------------------- | ---------------------------- |
  | add-cirlce-small-filled      | add-circle-small-filled      |
  | asset-network-1              | asset-network-filled         |
  | battery-bolt                 | battery-charge               |
  | battery-upright-bolt         | battery-upright-charge       |
  | checkbox-component-checked   | checkbox                     |
  | corner-arrow-up-left         | arrow-up-left                |
  | draw-cirlce                  | draw-circle                  |
  | filter-outline               | filter                       |
  | folder-new-outline           | folder-new                   |
  | folder-open-outline          | folder-open                  |
  | folder-outline               | folder                       |
  | full-screeen-exit            | full-screen-exit             |
  | full-screeen                 | full-screen                  |
  | location-outline             | location                     |
  | new-indicator-filled         | add-circle-small-filled      |
  | new-indicator                | add-circle-small             |
  | no-anomaly                   | anomaly-none                 |
  | plant-outline                | plant                        |
  | tag-cirlce-arrow-down        | tag-circle-arrow-down        |
  | tag-cirlce-arrow-down-filled | tag-circle-arrow-down-filled |
  | thumb-filled                 | thumb-down-filled            |
  | user-reading-reading         | user-reading-filled          |

  - Icon `landing-page-logo` removed without an replacement

- [#65](https://github.com/siemens/ix-icons/pull/65) [`0d271ac`](https://github.com/siemens/ix-icons/commit/0d271ac1791b007520cd00698ce2082a46a3f07d) Thanks [@danielleroux](https://github.com/danielleroux)! - feat: remove prebundled icons

### Minor Changes

- [#65](https://github.com/siemens/ix-icons/pull/65) [`0d271ac`](https://github.com/siemens/ix-icons/commit/0d271ac1791b007520cd00698ce2082a46a3f07d) Thanks [@danielleroux](https://github.com/danielleroux)! - Allow users to put specific icons into the cache.

- [#65](https://github.com/siemens/ix-icons/pull/65) [`0d271ac`](https://github.com/siemens/ix-icons/commit/0d271ac1791b007520cd00698ce2082a46a3f07d) Thanks [@danielleroux](https://github.com/danielleroux)! - - Improve logging by including HTML element in output to identify the source component.
  - Update stencil version to 4.27.1

## 2.2.0

### Minor Changes

- [#56](https://github.com/siemens/ix-icons/pull/56) [`858426a`](https://github.com/siemens/ix-icons/commit/858426a71e0c50acf700c59a1aff70f63b0ac2fd) Thanks [@danielleroux](https://github.com/danielleroux)! - feat: fetch svg from asset path

- [#59](https://github.com/siemens/ix-icons/pull/59) [`ca808ce`](https://github.com/siemens/ix-icons/commit/ca808ce7d5239c5e9db9a2e9e760276004e6ccc1) Thanks [@silviowolf](https://github.com/silviowolf)! - feat: add additional icons
