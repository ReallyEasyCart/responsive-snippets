
# Responsive floating cart icon on large / desktop screens

On large enough screens this will show a small floating cart icon to the top left of the screen.

You can change this to be on the right instead by editing the css file and changing from "left: 0;" to "right: 0;"

Also the default is a basic blue background and white color on top, this is easy to change with css color and background-color properties too.

An example of this is up on http://www.postboxshop.com/

## Using the floating cart icon

1. Include the CSS into your site.css.twig file
2. Add the following HTML to your header.html.twig file

```html
<!-- floating cart icon (desktop only) -->
<a class="floating-cart-icon generated_button open-cart" href="#">
  <i class="fa fa-shopping-cart"></i>
</a>
```
