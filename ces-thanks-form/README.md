
# CES form on the Thanks page

Here's the steps to install this:

1. Download the [json](./Thanks-Form-Feedback-Ratings-export-21-01-2020.json)
2. Import it in Admin > Form Builder > "Import a form as packaged JSON".
3. Edit/extend the html/checkout/order_thanks.html.twig file.
4. Under the `{{ content }}` tag, add: `{{ rec_form('thanks-form-feedback-amp-ratings') }}` to render the form.
