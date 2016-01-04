
# Currency Converter

Live change the currency on the front end with customizable buttons to switch between several different currencies.

## Using the Currency Converter

1. Copy the currency-converter.css file into the site CSS folder
2. If you are not pasting the CSS directly into the site.css.twig file, don't forget to:
`{% include "path/to/file" %}`
3. Copy the currency-converter.js file into the site JS folder
4. Again, if you are not pasting the JS directly into the site.js.twig, don't forget to:
`{% include "path/to/file" %}`
5. Add the following HTML into the template where you want the currency converter to be displayed (i.e. On Hiroboy it is the header.html.twig file):
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
