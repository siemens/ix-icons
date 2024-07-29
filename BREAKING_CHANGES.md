# v3.0.0

## Loading icon svg as external resource

Previously all icons were bundled inside the icon package itself. We choose this way to provide a easy setup without any additional configurations.
The downside of this implementation results in a increasing bundle size.

With release of main library @siemens/ix and @siemens/ix-icons you have to provide the icons as a static resource. This makes the bundle size significant smaller.

# v2.0.0

Icon web fonts are removed.