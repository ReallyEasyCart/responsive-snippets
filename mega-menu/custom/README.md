# Custom Code

This is just an example of how you can edit the HTML to create a more advanced mega menu.

1. Either copy the JS into the site.js.twig file, or include it using: `{% include "path/to/file" %}`.
2. Copy the contents of the CSS of mega_menu.css into css/modules/nav.css so that it overrides the existing navbar css.
3. Include header-icons.css in site.js.twig.
4. Edit html/sections/header.html.twig and add the class "mega-menu" to the main nav element (the one that has a class of "header-nav").