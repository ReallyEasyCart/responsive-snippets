
# Mega Menu

Fully responsive mega menu with only a tiny bit of JS. Demo [here](http://www.mega-menu.recds12.co.uk).

## Install Instructions

1. Overwrite js/modules/nav.js with mega-menu.js so that the default JS doesn't interfere.
2. Overwrite css/modules/nav.css with mega_menu.css so that the default CSS doesn't interfere.
3. Include header-icons.css in site.js.twig.
4. Overwrite html/sections/header.html.twig with the header.html.twig included in this repo.
5. Overwrite html/sections/menu.html.twig with the menu.html.twig included in this repo.

## Content Blocks

On the demo, the two central blocks of the Mega Menu dropdown are built using [Content Blocks](http://www.mega-menu.recds12.co.uk/admin/admin.php?p=content_blocks&screen=all). This is done through the line in menu.html.twig:

```twig
{{ rec_block('mega_menu_' ~ link.slug, type="html") }}
```

This will allow a content block to be added before the links in the column, provided you name it correctly. The code I have written will use the Slug of the Section it is currently on. So for instance, in my demo the Stormtroopers content block is named mega_menu_stormtroopers (Content Block names are case-insensitive)
