
# Responsive display for Autoparts sites Make/Model/Year search

On small screens this shows a button above the main content. An example of this in use is http://www.motorcycle-exhausts.co.uk

## Using the Responsive Autoparts Mobile Search Popup

1. Either copy the CSS into the site.css.twig file, or import it using: `{% import "path/to/file" %}`
2. Either copy the JS into the site.js.twig file, or import it using: `{% import "path/to/file" %}`
3. Add the following HTML to the template that you want the button to appear in:
```
<a href="javascript:;" class="open-mmy-search generated_button">Search by Year, Make &amp; Model</a>
```
