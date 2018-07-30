
# Add a PayPal buy now button to a product page

You can add a button like this: 

<img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/buy-logo-medium.png" alt="Buy now with PayPal" />

Or any other logo button from PayPal: https://www.paypal.com/us/webapps/mpp/logos-buttons

With the following code added to the product_info.html.twig file where you'd like the button to appear:

```
<img style="margin-top: 10px; display: block; cursor: pointer;" onclick="REC.Events.subscribe('cart.open.pre', function(){ location.href = '/pages/paypal_express/redirect.php'; }); REC.Events.subscribe('cart.open', function(){ jQuery('.cart-msg').addClass('rec-msg-success').html('Redirecting to PayPal...'); }); jQuery('#product-add-to-cart-form').submit();" src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/buy-logo-medium.png" alt="Buy now with PayPal" />

```

In use here: https://www.hiroboy.com/124_Jaguar_D_Type_Long_Nose_n6__1st_Le_Mans_1955--product--12297.html
