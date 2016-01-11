
# Currency Converter

Live change the currency on the front end with customizable buttons to switch between several different currencies.

## Using the Currency Converter

1. Either copy the CSS into the site.css.twig file, or include it using: `{% include "path/to/file" %}`
2. Either copy the JS into the site.js.twig file, or include it using: `{% include "path/to/file" %}`
3. Source the money.min.js file that is in /js/lib. (The way I have done this on Hiroboy is to create a new file in the js folder, then in site.js.twig I added: `{{ source("js/custom_app.js") }}` to the top of the file)
4. Add the following HTML into the template where you want the currency converter to be displayed (On Hiroboy it is the header.html.twig file):
```
<ul class="rec-currencies">
      <li>Change Currency:</li>
      <li><a href="#" data-currency="GBP" title="GBP">£</a></li>
      <li><a href="#" data-currency="EUR" title="EUR">€</a></li>
      <li><a href="#" data-currency="USD" title="USD">US $</a></li>
      <li><a href="#" data-currency="AUD" title="AUD">AU $</a></li>
      <li><a href="#" data-currency="CAD" title="CAD">CA $</a></li>
      <li><a href="#" data-currency="JPY" title="JPY">¥</a></li>
</ul>
```
