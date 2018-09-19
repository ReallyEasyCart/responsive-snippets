{% include "js/countries-to-continents.js" %}

jQuery(function ($) {

    var shouldShowCountrySelectModal = function (tld, continentCode) {
        // If the IP check says that the user is from Europe or Africa and the site they're on 
        // does not end in .co.uk, show the modal.
        if ((continentCode == 'EU' || continentCode == 'AF') && tld != '.co.uk') {
            return true;
        }

        // If the IP check says that the user is from North or South America and the site
        // they're on does not end in .com, show the modal
        if ((continentCode == 'NA' || continentCode == 'SA') && tld != '.com') {
            return true;
        }

        // If the IP check says that the user is from Asia or Oceania and the site they're on
        // does not end in .asia, show the modal
        if ((continentCode == 'AS' || continentCode == 'OC') && tld != '.asia') {
            return true;
        }

        return false;
    };

    var buildCountrySelectModalTitle = function (countryName, tld) {
        // Build the part of the title that is common between all possibilities
        var title = 'You appear to be from ' + countryName + ' but you\'ve arrived at our ';

        if (tld == '.co.uk') {
            // If the domain ends with .co.uk its the European Site
            title += 'UK site.';
        } else if (tld == '.com') {
            // If the domain ends with .com its the American Site
            title += 'American site.';
        } else if (tld == '.asia') {
            // If the domain ends with .asia its the Asia Site
            title += 'Asia site.';
        } else {
            // If for some reason there are no matches, set to false to prevent errors
            title = false;
        }

        return title;
    };

    var getCountrySelectModalCurrentSite = function (tld) {
        var currentSite = {};

        if (tld == '.co.uk') {
            // If the domain ends with .co.uk show the UK Flag and text
            currentSite.flag = '/userfiles/images/website_imgs/uk_flag.png';
            currentSite.subText = 'Stay on our UK Site';
        } else if (tld == '.com') {
            // If the domain ends with .com show the America Flag and text
            currentSite.flag = '/userfiles/images/website_imgs/us_flag.png';
            currentSite.subText = 'Stay on our American Site';
        } else if (tld == '.asia') {
            // If the domain ends with .asia show the Asia Flag and text
            currentSite.flag = '/userfiles/images/website_imgs/asia_flag.png';
            currentSite.subText = 'Stay on our Asia Site';
        }

        return currentSite;
    };

    var getCountrySelectModalNewSite = function (continentCode) {
        var newSite = {};

        if (continentCode == 'EU' || continentCode == 'AF') {
            // If the user is from Europe or Africa show the UK flag, text and use the .co.uk url
            newSite.flag = '/userfiles/images/website_imgs/uk_flag.png';
            newSite.subText = 'Go to our UK Site';
            newSite.url = 'https://www.forgemotorsport.co.uk';
        } else if (continentCode == 'NA' || continentCode == 'SA') {
            // If the user is from North or South America show the America flag, text and use the .com url
            newSite.flag = '/userfiles/images/website_imgs/us_flag.png';
            newSite.subText = 'Go to our American Site';
            newSite.url = 'https://www.forgemotorsport.com';
        } else if (continentCode == 'AS' || continentCode == 'OC') {
            // If the user is from Asia or Oceania show the Asia flag, text and use the .asia url
            newSite.flag = '/userfiles/images/website_imgs/asia_flag.png';
            newSite.subText = 'Go to our Asia Site';
            newSite.url = 'https://www.forgemotorsport.asia';
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

    if (window.CookiePolicy.check('preferences')) {
        $.getJSON("http://ip-api.com/json/?callback=?", function(data) {

            if (!$.cookie('rec-country-select') && !getUrlParameter('overrideCookie')) {
                // Get the tld of the domain (.co.uk, .com e.t.c) and the country code returned by ip-api.com
                var tld = getUrlParameter('countrySelectTld') ? getUrlParameter('countrySelectTld') : location.hostname.match(/(\.(?:[a-z]{2,5}\.)?(?:[a-z]{2,5}))$/)[0];
                var countryCode = getUrlParameter('countrySelectCode') ? getUrlParameter('countrySelectCode'): data.countryCode;
                
                // Using the relational objects of countries and continents; get the country name, continent code and continent name
                var countryName = countries[countryCode].name,
                    continentCode = countries[countryCode].continent,
                    continentName = continents[continentCode];
                
                // If the country select modal should be shown...
                if (shouldShowCountrySelectModal(tld, continentCode)) {
                    // Build the title and get the details for the current site the user is on and the site that we want them to go to
                    var title = buildCountrySelectModalTitle(countryName, tld),
                        currentSite = getCountrySelectModalCurrentSite(tld),
                        newSite = getCountrySelectModalNewSite(continentCode);
                    
                    // If the above variables have been set correctly...
                    if (title && !$.isEmptyObject(currentSite) && !$.isEmptyObject(newSite)) {
                        // Show the modal
                        var countrySelectModal = new ModalWindow({
                            type: 'country-select',
                            closeOnBackgroundClick: false,
                            content: '<p style="margin-bottom: 1em;">' + title + '</p>\
                            <table style="width: 100%; border: 0; text-align: center;">\
                                <tr>\
                                    <td style="width: 50%;">\
                                        <a class="close-country-select-modal" data-action="stay">\
                                            <img src="' + currentSite.flag + '">\
                                        </a>\
                                    </td>\
                                    <td style="width: 50%;">\
                                        <a class="close-country-select-modal" href="' + newSite.url + '" data-action="' + newSite.url + '">\
                                            <img src="' + newSite.flag + '">\
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
                            </table>'
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

                        REC.Events.subscribe('cookie-modal-close', function () {
                            countrySelectModal.open();
                        });
                    }
                }
            } else if (getUrlParameter('overrideCookie')) {
                $.cookie('rec-country-select', 'stay', { expires: 365 });
            } else if ($.cookie('rec-country-select') !== 'stay') {
                window.location = $.cookie('rec-country-select');
            }
        });
    }
});