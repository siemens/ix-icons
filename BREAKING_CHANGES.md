# v3.0.0

## Loading icon svg as external resource

Previously, all icons were included within the icon package itself. This approach was chosen to simplify setup and eliminate the need for additional configurations. However, this implementation has led to an increase in bundle size.

With the release of version 3 of the main libraries @siemens/ix and @siemens/ix-icons, you now need to provide the icons as a static resource. This significantly reduces the bundle size.

## Remove misspelled and deprecated icons 

| removed    | replaced by |
| -------- | ------- |
| add-cirlce-small-filled | add-circle-small-filled |
| asset-network-1 | asset-network-filled |
| battery-bolt | battery-charge |
| battery-upright-bolt | battery-upright-charge |
| checkbox-component-checked | checkbox |
| corner-arrow-up-left | arrow-up-left |
| draw-cirlce | draw-circle |
| filter-outline | filter |
| folder-new-outline | folder-new |
| folder-open-outline | folder-open |
| folder-outline | folder |
| full-screeen-exit | full-screen-exit |
| full-screeen | full-screen |
| location-outline | location |
| new-indicator-filled | add-circle-small-filled |
| new-indicator | add-circle-small |
| no-anomaly | anomaly-none |
| plant-outline | plant |
| tag-cirlce-arrow-down | tag-circle-arrow-down |
| tag-cirlce-arrow-down-filled | tag-circle-arrow-down-filled |
| thumb-filled | thumb-down-filled |
| user-reading-reading | user-reading-filled |
| validate | checkbox |
| checkbox-component-mixed | checkbox-mixed |
| checkbox-component-unchecked | checkbox-empty |
| landing-page-logo | *-- no replacement --* |




# v2.0.0

Icon web fonts are removed.
