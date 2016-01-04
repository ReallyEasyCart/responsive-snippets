jQuery(function ($) {
    var $openMMYSearch = $('.open-mmy-search'),
        mmySearchModal = new ModalWindow({
            type: 'simple',
            content: 'Loading',
            open: false,
            onCloseCallback: function () {
                // When the Modal is closed, put the Search Form back into the left sidebar
                var search_form = $('div.sidebar-app-n-auto-parts-search'),
                    location = $('#sidebar-left');
                location.prepend(search_form);
                // re-init js events on change of autopart selections
                autopartsSearchOnloads();
            }
        });

    function generateSearchModal(mmySearchModal, source) {
        // If source is undefined, force it to be false
        source = (typeof source == 'undefined') ? false : source;

        // If source html was passed in, then find the sidebar app inside that, else get it from the body
        // *** This is so that the button will work on a page that doesn't have the sidebar app on it (See Below)***
        var $data = source ? $(source).find('div.sidebar-app-n-auto-parts-search') : $('div.sidebar-app-n-auto-parts-search');

        var $header = $data.find('h3'),
            header = $header.html(),
            data;

        $header.remove();
        // Detach the code from its current location
        data = $data.detach();

        // Set the modal content and header before opening it
        mmySearchModal.setContent(data);
        mmySearchModal.setHeader(header);
        mmySearchModal.open();

        // re-init js events on change of autopart selections
        autopartsSearchOnloads();
    }

    // if open product enquiry icon is shown on page
    if ($openMMYSearch.length) {
        $openMMYSearch.on('click', function (e) {
            e.preventDefault();

            // This is the bit of code I was on about earlier, if the sidebar app is on the page it will use the "undefined source" method...
            if ($('#autoparts_search').length > 0) {
                generateSearchModal(mmySearchModal);
            } else {
                // ... However, if the app isn't on the page, we do a GET request to the Homepage (this may need changing if the app isn't on the homepage for whatever reason) and pass in the HTML it responds with
                $.ajax({
                    url: '/',
                    method: 'GET'
                }).done(function (response) {
                    generateSearchModal(mmySearchModal, response);
                });
            }
        });
    }
});
