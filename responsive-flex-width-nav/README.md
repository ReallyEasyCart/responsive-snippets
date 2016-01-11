
# Flexibly Spaced Nav Links

This small bit of CSS will dynamically space the links in a navbar using flex. This will only work in modern browsers (see http://caniuse.com/flexbox), meaning that you may need to adjust the padding for older browsers. Some examples of this in use are Postbox Shop, Hiroboy & Motorcycle Exhausts.

## Using the Responsive Flex Width Nav

1. Make sure that the nav is spaced correctly before applying this CSS for browsers that don't support flex
2. All you need to do is either copy the CSS into the site.css.twig file, or include it using: `{% include "path/to/file" %}`
