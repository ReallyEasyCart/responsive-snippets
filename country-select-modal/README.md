# Custom Code

This is the exact code that we used to create a GDPR compliant country select modal which identifies visitors by their IP address and then pops a modal, offering them the choice of going to the appropriate site for their geography (being the UK, US or Asia).

## How to Install

1. Include the CSS and all Javascript files in the head like so:
```html
<link rel="stylesheet" href="/country-select.css">
<script src="/modal.js"></script>
<script src="/countries-to-continents.js"></script>
<script src="/country-select-modal.js"></script>
```

2. Edit the configuration block at the top of country-select-modal.js to point to the images and change current_country to Asia.

3. Search country-select-modal.js for https://pro.ip-api.com/?key=XXXXXXXXXX and replace the Xs with the API Key