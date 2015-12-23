(function ($) {

    //
    // REC Currency Converter
    //

    var REC = REC || {},
        Cookie,
        Config,
        Converter;

    // config
    Config = {
        currency: 'GBP' // default currency
    };

    // Cookies simple helpers,
    // http://www.quirksmode.org/js/cookies.html
    Cookie = {
        // Write to a cookie
        write: function (name, value) {
            document.cookie = name+"="+value+"; path=/";
        },
        read: function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    };

    // main currency converter class
    Converter = (function () {

        var userCurrency,
            cookieCurrency,
            userHasChangedCurrency = false;

        // round to a money value
        function round(val) {
            return Number.prototype.toFixed
                ? Number(val).toFixed(2)
                : Math.round(val * 100) / 100;
        }

        // defautl to site's currency
        userCurrency = Config.currency;

        // check for cookie stored version of currency
        cookieCurrency = Cookie.read('default-currency');
        if (cookieCurrency) {
            // set user currency to be the cookie currency
            userCurrency = cookieCurrency;
            if (userCurrency != Config.currency) {
                userHasChangedCurrency = true;
            }
        }

        return {

            // get rates
            getRates: function (callback) {
                $.ajax({
                    url: 'https://api.fixer.io/latest',
                    dataType: 'jsonp',
                    jsonp: "callback",
                    success: function(data) {
                        window.fx.rates = data.rates;
                        window.fx.rates.EUR = 1;
                        callback();
                    }
                });
            },

            // convert a value
            convert: function (val) {
                return round(window.fx.convert(val, {
                    from: Config.currency,
                    to: userCurrency
                }));
            },

            // set the users currency
            setUserCurrency: function (currency) {
                userCurrency = currency;
                Cookie.write('default-currency', currency);
                userHasChangedCurrency = true;
            },

            // get the users currency symbol
            getUserCurrencySymbol: function () {
                return {
                    'GBP': '&pound;',
                    'USD': 'US$',
                    'EUR': '&euro;',
                    'AUD': 'AU$',
                    'CAD': 'CA$',
                    'JPY': '&yen;'
                }[userCurrency];
            },

            // should any converting be run?
            // e.g. has the user selected a different currency yet?
            shouldBeRun: function () {
                return userHasChangedCurrency;
            }
        };

    }());

    // on dom ready
    $(document).ready(function () {

        // loop prices, converting the value
        var priceSelectors = [
            // price elements
            '#pp_price', '#pp_special_price', '.pcl-product-price', '.mini_product_price',
            // cart prices
            '.rec-full-cart-item-each-price div[id^="update_each_"]', '.rec-full-cart-item-total-price div[id^="total"] strong', '#overall_total_costs',
            '.rec-full-cart-item-each-price-breakdown', '.rec-full-cart-item-options',
            // sidebar
            '.scs-cart-item-total-price', '.scs-total-price', '.sidebar-product-price',
            // checkout prices
            '#products_items p[id^="total"]', '.checkout-order-items-totals', '.checkout-section-heading-total',
            '#order_summary_totals', '.rec-checkout-item-price-per-item', '#delivery_method_result_list li',
            '.rec-checkout-item-each-price'
        ];

        function convertAllPrices(invalidateCache, scope, scopedSelectors) {

            if ( ! Converter.shouldBeRun()) return;

            $(scope || 'body').find((scopedSelectors || priceSelectors).join(',')).each(function () {

                var $price = $(this),
                    currentPrice, // current price being shown
                    newPrice, // end price to use
                    priceHtml;

                // skip if not currently found on page
                if ( ! $price.length) return;

                // get cached price html (or cache for later if this is the first convert)
                priceHtml = (invalidateCache ? false : $price.data('old-price-html')) || (function () {

                    priceHtml = $price.html();

                    // store this html for use later
                    $price.data('old-price-html', priceHtml);

                    // use current price html
                    return priceHtml;
                }());

                // skip if html not a string...
                if (typeof priceHtml !== 'string') return;

                // get current shown price from (might be multiple in the given string so loop them)
                currentPrices = priceHtml.match(/(\d+\.\d+)/g);
                if ( ! currentPrices || ! currentPrices.length) return;
                $.each(currentPrices, function (i, currentPrice) {

                    // replace currency symbol
                    priceHtml = priceHtml.replace(/(£|&pound;|€|&euro;|(\w{2})?\$)/g, Converter.getUserCurrencySymbol());

                    // convert price
                    newPrice = Converter.convert(currentPrice);

                    // replace price in html
                    priceHtml = priceHtml.split(currentPrice).join(newPrice);
                });

                // set end html
                $price.html(priceHtml);

            });

        }

        // get current rates & fix current prices if the user
        Converter.getRates(convertAllPrices);

        // setup click of a currency link, to change the currency shown and save to cookie
        $('.rec-currencies').on('click', 'a', function () {
            var currency = $(this).data('currency');
            Converter.setUserCurrency(currency);
            convertAllPrices();
            return false;
        });

        function invalidateCacheAndConvertAllPrices(scope, scopedSelectorsFunc) {
            return function (data) {
                convertAllPrices(1, scope, scopedSelectorsFunc ? scopedSelectorsFunc(data) : undefined);
            };
        }

        // re-run converter on Cart open and update events
        window.REC.Events.subscribe('cart.open', invalidateCacheAndConvertAllPrices('.rec-full-cart-container'));
        window.REC.Events.subscribe('cart.item.update', invalidateCacheAndConvertAllPrices('.rec-full-cart-container', function (data) {
            return ['#total' + data.lineId + ' strong'];
        }));
        window.REC.Events.subscribe('cart.item.update.each_price', invalidateCacheAndConvertAllPrices('.rec-full-cart-container', function (data) {
            return ['#update_each_' + data.lineId];
        }));
        window.REC.Events.subscribe('cart.totals.update', invalidateCacheAndConvertAllPrices('.rec-full-cart-container', function () {
            return ['#overall_total_costs'];
        }));
        window.REC.Events.subscribe('checkout.summary.reload', invalidateCacheAndConvertAllPrices('#checkout_sidebar_app_order_summary'));
        window.REC.Events.subscribe('checkout.items.reload', invalidateCacheAndConvertAllPrices('#order_product_items'));
        window.REC.Events.subscribe('checkout.delivery_methods.reload', invalidateCacheAndConvertAllPrices('#delivery_method_result'));

    });

}(jQuery));
