
# Price VAT Switcher

To enable the Price VAT Switcher you need to change a few templates as well as enable the feature in Superadmin Only. The HTML is heavily reliant on specific classes being present, if the elements don't have these classes it wont work.


## How it works

When the feature is enabled, a `<style>` tag is inserted into the `<head>` that handles which price should be displayed for the initial load. For instance, if the site is set up to display prices inclusive of VAT and you have the following elements:
```html
<div class="rec-price-ex-vat">...</div>
<div class="rec-price-inc-vat">...</div>
```
Then the `<div>` with the class of `rec-price-ex-vat` would be hidden, and vice-versa for if the site is set up to display prices exclusive of VAT.

By adding the toggle switches, you allow a user to change how they see the prices through Javascript. As said above, the classes and data-attributes are important - if they're not added or they're incorrect the feature will not work.


## Enabling the Price VAT Switcher

### GDPR/Cookies

This feature uses a single cookie (`rec-price-vat-switcher`) to store the users VAT preference. You will need to enable it Cookie Manager to make sure that the site is still compliant with GDPR laws.

### General

The first step is to add the toggles, these can be placed anywhere but it's usually a good idea to put them in or just after the header

```html
<a href="#" class="rec-price-vat-switcher-toggle" data-mode="inc">Inc VAT</a>
<a href="#" class="rec-price-vat-switcher-toggle" data-mode="ex">Ex VAT</a>
```
The class `rec-price-vat-switcher-toggle` as well as the `data-mode` attribute are both required by the javascript. The class being used as the target for the javascript and the mode value being used to decide which values to hide. Once you've added the toggles, you're ready to change other templates.


### /html/store/product.html.twig

To change the prices on the product template, you'll need to change the HTML from:
```twig
{% if product.is_special_offer %}
    <span class="pcl-product-each-price-before">{{ currency }}{{ product.price }}</span>
    <span class="pcl-product-each-price-special">{{ currency }}{{ product.special_price }}</span>
{% elseif product.is_upcomming %}
    <span class="pcl-product-each-coming-soon">Coming Soon!</span>
{% else %}
    {{ currency }}{{ product.price }}
{% endif %}
```
to:
```twig
{% if product.is_special_offer %}
    <span class="pcl-product-each-price-before rec-price-inc-vat">{{ currency }}{{ product.price_inc_vat }}</span>
    <span class="pcl-product-each-price-before rec-price-ex-vat">{{ currency }}{{ product.price_no_vat }}</span>
    <span class="pcl-product-each-price-special rec-price-inc-vat">{{ currency }}{{ product.special_price_inc_vat }}</span>
    <span class="pcl-product-each-price-special rec-price-ex-vat">{{ currency }}{{ product.special_price_no_vat }}</span>
{% elseif product.is_upcomming %}
    <span class="pcl-product-each-coming-soon">Coming Soon!</span>
{% else %}
    <span class="rec-price-inc-vat">{{ currency }}{{ product.price_inc_vat }}</span>
    <span class="rec-price-ex-vat">{{ currency }}{{ product.price_no_vat}}</span>
{% endif %}
```
Note that every price has been repeated and split out as Inc VAT and Ex VAT.


### /html/store/product_info.html.twig

The Product Info template requires a few more changes, so we'll break them down a bit more.

Default:
```html
<span class="product-info-price-before" id="pp_price">{{ product.price }}</span>
<span class="h2 product-info-price product-info-price-special" id="pp_special_price" itemprop="price" content="{{ product.special_price_inc_vat | replace({'&pound;': ''}) }}">{{ product.special_price }}</span>
```
After:
```html
<span class="product-info-price-before pp_auto_price_inc_vat rec-price-inc-vat">{{ product.price_inc_vat }}</span>
<span class="product-info-price-before pp_auto_price_ex_vat rec-price-ex-vat">{{ product.price_no_vat }}</span>
<span class="h2 product-info-price product-info-price-special pp_auto_special_price_inc_vat rec-price-inc-vat" itemprop="price" content="{{ product.special_price_inc_vat | replace({'&pound;': ''}) }}">{{ product.special_price_inc_vat }}</span>
<span class="h2 product-info-price product-info-price-special pp_auto_special_price_ex_vat rec-price-no-vat">{{ product.special_price_no_vat }}</span>
```

As above we have split the prices out into Inc VAT and Ex VAT, but we've also remove the `pp_price` and `pp_special_price` IDs and added `pp_auto_price_X_vat` and `pp_auto_special_price_X_vat` classes. This is because there is javascript that automatically updates the prices when the quantity is changed. Using these classes ensures that the javascript will still work.

You'll also notice that the `itemprop` and `content` attributes have stayed on the Inc VAT price but haven't been added to the Ex VAT price. This is because when Google looks at a product page, they look for those attributes and assume that it is inclusive of VAT.

The normal product price is changed much in that same way as the special price. In the end, you should end up with something like this:
```twig
{% if product.is_special_offer %}
    <span class="product-info-price-before pp_auto_price_inc_vat rec-price-inc-vat">{{ product.price_inc_vat }}</span>
    <span class="product-info-price-before pp_auto_price_ex_vat rec-price-ex-vat">{{ product.price_no_vat }}</span>
    <span class="h2 product-info-price product-info-price-special pp_auto_special_price_inc_vat rec-price-inc-vat" itemprop="price" content="{{ product.special_price_inc_vat | replace({'&pound;': ''}) }}">{{ product.special_price_inc_vat }}</span>
    <span class="h2 product-info-price product-info-price-special pp_auto_special_price_ex_vat rec-price-no-vat">{{ product.special_price_no_vat }}</span>
{% elseif product.is_upcomming %}
    <span class="product-info-coming-soon">Coming Soon!</span>
{% else %}
    <span class="h2 product-info-price pp_auto_price_inc_vat rec-price-inc-vat" itemprop="price" content="{{ product.price_inc_vat | replace({'&pound;': ''}) }}">{{ product.price_inc_vat }}</span>
    <span class="h2 product-info-price pp_auto_price_ex_vat rec-price-ex-vat">{{ product.price_no_vat }}</span>
{% endif %}
```


### /html/checkout/cart.html.twig

By now, you should get the idea of how this works. Meaning that it wouldn't surprise you find out that for each item line in the cart the code changes from:
```html
<strong class="cart-item-price">{{ currency }}{{ item.each_price_inc_options }}</strong>
```
To:
```html
<strong class="cart-item-price">
    <span class="rec-price-inc-vat">{{ currency }}{{ item.each_price_inc_options_inc_vat }}</span>
    <span class="rec-price-ex-vat">{{ currency }}{{ item.each_price_inc_options_ex_vat }}</span>
</strong>
```

However, for the cart total area we can do something better. As the javascript hides and shows elements based on the classes (and not a specific element type) we can hide and show more information. For instance, the default subtotal section looks like this:
```html
<div class="cart-subtotal">
    Subtotal <span class="cart-subtotal-qty">({{ cart.qty }} item{% if cart.qty != 1 %}s{% endif %})</span>:
    <strong class="cart-subtotal-price">{{ currency }}{{ cart.sub_total }}</strong>
</div>
```
But while this feature was being developed, I realised I could do this:
```html
<div class="cart-subtotal">
    <div class="rec-price-ex-vat">
        Items: <strong class="cart-subtotal-price-ex-vat">{{ currency }}{{ cart.sub_total_ex_vat }}</strong><br>
        VAT: <strong>{{ currency }}{{ cart.total_vat }}</strong>
    </div>
    Subtotal <span class="cart-subtotal-qty">({{ cart.qty }} item{% if cart.qty != 1 %}s{% endif %})</span>:
    <strong class="cart-subtotal-price-inc-vat">{{ currency }}{{ cart.sub_total_inc_vat }}</strong>
</div>
```
By doing this, when Ex VAT display is toggle on I can show the total of the items and the amount of VAT without having to repeat the `rec-price-ex-vat` class across multiple elements.


### /html/checkout/cart_associated_products.html.twig

The Cart Associated Products template is part of a premium feature that may or may not be enabled on the site you are working on. I'm only going to show the before and after here as it should be obvious by now.

Before:
```html
<span class="rec-cart-associated-item-price">{{ currency }}{{ product.price }}</span>
```
After:
```html
<span class="rec-cart-associated-item-price rec-price-inc-vat">{{ currency }}{{ product.price_inc_vat }}</span>
<span class="rec-cart-associated-item-price rec-price-ex-vat">{{ currency }}{{ product.price_ex_vat }}</span>
```


### But I use a template tag to show the Cart Total somewhere on the page? What do I do?

Awesome, this feature adds 2 new template tags: `{{ cart.total_inc_vat }}` and `{{ cart.total_ex_vat }}`. Using the same methods as above you can swap the display of them.