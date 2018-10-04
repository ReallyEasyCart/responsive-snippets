jQuery(function ($) {
    
    var config = {
        current_country: 'UK', // UK, US or ASIA
        uk_flag: '/userfiles/images/website_imgs/uk_flag.png',
        uk_title: 'UK',
        uk_url: 'http://www.forgeuk.recds12.co.uk',
        us_flag: '/userfiles/images/website_imgs/us_flag.png',
        us_title: 'US',
        us_url: 'http://www.forgeus.recds12.co.uk',
        asia_flag: '/userfiles/images/website_imgs/asia_flag.png',
        asia_title: 'Asia',
        asia_url: 'http://www.forgemotorsport.asia'
    };
    
    var shouldShowCountrySelectModal = function (continentCode) {
        // If the IP check says that the user is from Europe or Africa and the site they're on 
        // does not end in .co.uk, show the modal.
        if ((continentCode == 'EU' || continentCode == 'AF') && config.current_country != 'UK') {
            return true;
        }

        // If the IP check says that the user is from North or South America and the site
        // they're on does not end in .com, show the modal
        if ((continentCode == 'NA' || continentCode == 'SA') && config.current_country != 'US') {
            return true;
        }

        // If the IP check says that the user is from Asia or Oceania and the site they're on
        // does not end in .asia, show the modal
        if ((continentCode == 'AS' || continentCode == 'OC') && config.current_country != 'ASIA') {
            return true;
        }

        return false;
    };

    var buildCountrySelectModalTitle = function (countryName) {
        // Build the part of the title that is common between all possibilities
        var title = 'You appear to be from ' + countryName + ' but you\'ve arrived at our ';

        if (config.current_country == 'UK') {
            // If the domain ends with .co.uk its the European Site
            title += config.uk_title + ' site.';
        } else if (config.current_country == 'US') {
            // If the domain ends with .com its the American Site
            title += config.us_title + ' site.';
        } else if (config.current_country == 'ASIA') {
            // If the domain ends with .asia its the Asia Site
            title += config.asia_title + ' site.';
        } else {
            // If for some reason there are no matches, set to false to prevent errors
            title = false;
        }

        return title;
    };

    var getCountrySelectModalCurrentSite = function () {
        var currentSite = {};

        if (config.current_country == 'UK') {
            // If the domain ends with .co.uk show the UK Flag and text
            currentSite.flag = config.uk_flag;
            currentSite.subText = 'Stay on our ' + config.uk_title + ' Site';
        } else if (config.current_country == 'US') {
            // If the domain ends with .com show the America Flag and text
            currentSite.flag = config.us_flag;
            currentSite.subText = 'Stay on our ' + config.us_title + ' Site';
        } else if (config.current_country == 'ASIA') {
            // If the domain ends with .asia show the Asia Flag and text
            currentSite.flag = config.asia_flag;
            currentSite.subText = 'Stay on our ' + config.asia_title + ' Site';
        }

        return currentSite;
    };

    var getCountrySelectModalNewSite = function (continentCode) {
        var newSite = {};

        if (continentCode == 'EU' || continentCode == 'AF') {
            // If the user is from Europe or Africa show the UK flag, text and use the .co.uk url
            newSite.flag = config.uk_flag;
            newSite.subText = 'Go to our ' + config.uk_title + ' Site';
            newSite.url = config.uk_url;
        } else if (continentCode == 'NA' || continentCode == 'SA') {
            // If the user is from North or South America show the America flag, text and use the .com url
            newSite.flag = config.us_flag;
            newSite.subText = 'Go to our ' + config.us_title + ' Site';
            newSite.url = config.us_url;
        } else if (continentCode == 'AS' || continentCode == 'OC') {
            // If the user is from Asia or Oceania show the Asia flag, text and use the .asia url
            newSite.flag = config.asia_flag;
            newSite.subText = 'Go to our ' + config.asia_title + ' Site';
            newSite.url = config.asia_url;
        }

        return newSite;
    };

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }

        return false;
    };

    if (window.CookiePolicy.check('preferences') || !window.CookiePolicy) {
        if (!$.cookie('rec-country-select') && !getUrlParameter('overrideCookie')) {
            $.getJSON("https://pro.ip-api.com/json/?key=XXXXXXXXXX&callback=?", function(data) {
                // Get the tld of the domain (.co.uk, .com e.t.c) and the country code returned by ip-api.com
                var countryCode = getUrlParameter('countrySelectCode') || data.countryCode;
                
                // Using the relational objects of countries and continents; get the country name, continent code and continent name
                var countryName = countries[countryCode].name,
                    continentCode = countries[countryCode].continent,
                    continentName = continents[continentCode];
                
                // If the country select modal should be shown...
                if (shouldShowCountrySelectModal(continentCode)) {
                    // Build the title and get the details for the current site the user is on and the site that we want them to go to
                    var title = buildCountrySelectModalTitle(countryName),
                        currentSite = getCountrySelectModalCurrentSite(),
                        newSite = getCountrySelectModalNewSite(continentCode);
                    
                    // If the above variables have been set correctly...
                    if (title && !$.isEmptyObject(currentSite) && !$.isEmptyObject(newSite)) {
                        // Show the modal
                        var countrySelectModal = new ModalWindow({
                            type: 'country-select',
                            content: '<p style="margin: 1.5em;">' + title + '</p>\
                            <table style="width: 100%; border: 0; text-align: center; margin-bottom: 1.5em;">\
                                <tr>\
                                    <td style="width: 50%;">\
                                        <a class="close-country-select-modal" data-action="stay">\
                                            <img src="' + currentSite.flag + '" style="max-width: 50%; margin: auto;">\
                                        </a>\
                                    </td>\
                                    <td style="width: 50%;">\
                                        <a class="close-country-select-modal" href="' + newSite.url + '" data-action="' + newSite.url + '">\
                                            <img src="' + newSite.flag + '" style="max-width: 50%; margin: auto;">\
                                        </a>\
                                    </td>\
                                </tr>\
                                <tr>\
                                    <td style="padding: 0;">\
                                        <a class="close-country-select-modal" data-action="stay">' + currentSite.subText + '</a>\
                                    </td>\
                                    <td style="padding: 0;">\
                                        <a class="close-country-select-modal" href="' + newSite.url + '" data-action="' + newSite.url + '">' + newSite.subText + '</a>\
                                    </td>\
                            </table>',
                            onCloseCallback: function () {
                                if (!$.cookie('rec-country-select')) {
                                    $.cookie('rec-country-select', 'stay', { expires: 365 });
                                }
                            }
                        });

                        // Close the modal if the "stay on current site" flag is clicked
                        countrySelectModal.on('click', '.close-country-select-modal', function (e) {
                            e.preventDefault();

                            var action = $(this).data('action');

                            $.cookie('rec-country-select', action, { expires: 365 });

                            if (action !== 'stay') {
                                window.location = action;
                            } else {
                                countrySelectModal.close();
                            }
                        });

                        // Subscribe to the cookie modal close event so that we can re-pop the country select modal
                        // due to only one modal window being allowed to be open at a time.

                        // We had to add the cookie modal close event manually by putting "REC.Events.publish('cookie-modal-close');"
                        // into cookie-policy.js in the part that says "modal.on('close', function () { ... }"
                        REC.Events.subscribe('modal.cookie-law.close', function () {
                            countrySelectModal.open();
                        });
                    }
                } else {
                    $.cookie('rec-country-select', 'stay', { expires: 365 });
                }
            });
        } else if (getUrlParameter('overrideCookie')) {
            $.cookie('rec-country-select', 'stay', { expires: 365 });
        } else if ($.cookie('rec-country-select') !== 'stay') {
            window.location = $.cookie('rec-country-select');
        }
    }
});