
# BrowserSync with REC

Live reload your site on changes to html, css and javascript.

Also synchronize the scroll, clicks etc with multiple devices :)
[See here for more details.](https://www.browsersync.io/)

**Requires nodejs & npm installed: [Download & Install](https://nodejs.org/en/)**

## Using BrowserSync with REC.

You will need to create a `package.json` file in your project and add the following link content to it:
[https://raw.githubusercontent.com/ReallyEasyCart/template-boilerplate/master/package.json](https://raw.githubusercontent.com/ReallyEasyCart/template-boilerplate/master/package.json)

Then run: `npm install` via the terminal.
This will install any dependancies we need to start using this sync tool.

Next you'll need the sync.js script, create a `sync.js` file in your project with the following links content:
[https://raw.githubusercontent.com/ReallyEasyCart/template-boilerplate/master/sync.js](https://raw.githubusercontent.com/ReallyEasyCart/template-boilerplate/master/sync.js)

Then to begin you can run:
`node sync.js --browsersync --url www.yoursite.com` to begin.

Replaceing www.yoursite.com with the site you're working with.
e.g. `node sync.js --browsersync --url www.andrew.recds12.co.uk`

This should print a "live site" for you to use to work on, in the top right on load it should for a second say it's connected to browsersync.
Message me with any errors or help needed :).

Other options can be called on this file to also work with Sass, run `node sync.js --help` for more information.
