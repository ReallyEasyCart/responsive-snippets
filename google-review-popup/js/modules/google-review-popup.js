//
// GoogleMyBusiness reviews popup
//
jQuery(function ($) {

    var $openReviewPopup = $('.google-review-popup'),
        reviewForm = new ModalWindow({
            header: 'Leave Feedback',
            type: 'google-review-popup',
            content: 'Loading',
            open: false
        });
    
    // helper to send tracking back to Google Analytics
    function track(action, label, value) {
        if (window.console) {
            console.log('Tracking:', action, label, value);
        }
        if (window.gtag) {
            window.gtag('event', action, {
                event_category: 'Google Review Popup',
                event_label: label,
                value: value
            });
        }
    }

    // if open product enquiry icon is shown on page
    if ($openReviewPopup.length) {

        $openReviewPopup.on('click', function (e) {
            e.preventDefault();

            // trigger to google analytics
            track('open', 'modal');
            reviewForm.onCloseCallback = function () {
                track('close-early', 'modal');
            };

            // show default screen
            var html = '';
            html += '<p>Your feedback is important to us so please take a moment to rate us.</p>';
            html += '<p class="google-review-popup-stars">';
            for (var i = 1; i <= 5; i++) {
                html += '<input name="rating" type="radio" value="' + i + '">';
            }
            html += '</p>';
            html += '<div class="google-review-popup-result-data"></div>';
            reviewForm.setContent(html);
            reviewForm.open();

            // watch for clicks on the stars
            reviewForm.on('click', 'input[name="rating"]', function () {
                var $rating = $(this),
                    rating = $rating.val();

                $rating.parents('.google-review-popup-stars').addClass('selected');

                // watch for modal close clicks
                reviewForm.onCloseCallback = function () {
                    track('close', 'modal', rating);
                };

                // make sure they click 1-5
                if (rating < 1 || rating > 5) {
                    alert('Please select a rating between 1 - 5.');
                    return;
                }

                // trigger to google analytics
                track('click', 'star', rating);

                // handle next stage
                $.post('/includes/view/render.php', {
                    template: 'apps/google-review-popup.html',
                    data: JSON.stringify({
                        rating: rating
                    })
                }, function (data) {
                    reviewForm.find('.google-review-popup-result-data').html(data);

                    // track if they go to google to leave a review
                    reviewForm.on('click', '.google-review-popup-gmb-link', function () {
                        track('click', 'Google business link', rating);
                    });
                    // also track if they submit the form if shown
                    reviewForm.on('submit', 'form', function () {
                        track('click', 'Submit form', rating);
                    });

                });
            });

        });

    }
});
