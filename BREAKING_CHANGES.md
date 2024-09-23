# v3.0.0

## Loading icon svg as external resource

Previously, all icons were included within the icon package itself. This approach was chosen to simplify setup and eliminate the need for additional configurations. However, this implementation has led to an increase in bundle size.

With the release of the main libraries @siemens/ix and @siemens/ix-icons, you now need to provide the icons as a static resource. This significantly reduces the bundle size.

# v2.0.0

Icon web fonts are removed.
