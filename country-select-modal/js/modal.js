//
// Modal module
// Offers a generic, simple and responsive modal window
//
// module scope:
//  - images
//  - iframes
//  - simple text
//  - forms and other simpler content
//  - other html content
//  - full ecommerce cart
//
// example:
//  var modal = new ModalWindow({ content: "hi" });
//
(function ($) {

    // CoreModal -> single instance of core html structure of modal
    // ModalWindow -> each usage instance, e.g. cart vs popup product images

    var CoreModal,
        ModalWindow,
        $body,
        $doc = $(document);


    //
    // Core modal window html lib
    //
    CoreModal = (function () {

        var $modalOuter,
            $modalInner,
            $modalHeader,
            $modalHeaderTitle,
            $modalHeaderClose,
            $modalBody,
            $modalFooter,
            currentType = '';

        return {
            build: function () {

                var modalThis = this;

                // already built?
                if ($modalOuter) {
                    // return as there's nothing left to do :)
                    return ;
                }

                // check for cached <body> object
                if ( ! $body) {
                    $body = $('body');
                }

                //
                // build the html needed
                //

                // outer container
                $modalOuter = $('<div>');
                $modalOuter.addClass('modal-window-outer');
                // setup close event on click of modal background
                $modalOuter.on('click', function (e) {
                    if (e.target == this) { // make sure we clicked on the background and not the main content of the modal
                        modalThis.close();
                    }
                });

                // inner container
                $modalInner = $('<div>');
                $modalInner.addClass('modal-window-inner');
                $modalInner.appendTo($modalOuter);

                // header
                $modalHeader = $('<div>');
                $modalHeader.addClass('modal-window-header').addClass('clearfix');

                // modal header close btn
                $modalHeaderClose = $('<a>');
                $modalHeaderClose.addClass('modal-window-header-close');
                $('<i>').addClass('fa').addClass('fa-close').appendTo($modalHeaderClose);
                $modalHeaderClose.appendTo($modalHeader);
                // setup close event on click of this close icon
                $modalHeaderClose.on('click', $.proxy(this.close, this));

                // modal header title
                $modalHeaderTitle = $('<div>');
                $modalHeaderTitle.addClass('modal-window-header-title');
                $modalHeaderTitle.addClass('h2');
                $modalHeaderTitle.appendTo($modalHeader);
                $modalHeader.appendTo($modalInner);

                // body
                $modalBody = $('<div>');
                $modalBody.addClass('modal-window-body');
                $modalBody.appendTo($modalInner);

                // footer
                $modalFooter = $('<div>');
                $modalFooter.addClass('modal-window-footer').addClass('clearfix');
                $modalFooter.appendTo($modalInner);

                // insert modal html at bottom of <body>
                $body.append($modalOuter);

                // watch for ESC key, close modal when ESC pressed
                $body.on('keyup', function (e) {
                    if (e.which==27) {
                        modalThis.close();
                    }
                });

            },
            setHeader: function (content) {
                // really setting the title here ;)
                $modalHeaderTitle.html(content);
            },
            setBody: function (content) {
                $modalBody.html(content);
            },
            setFooter: function (content) {
                $modalFooter.html(content);
            },
            setType: function (type) {
                currentType = type;
                // remove any current type class
                var prefix = 'modal-window-is-';
                $modalOuter.removeClassPrefix(prefix).addClass(prefix + (type || 'default'));
            },
            setWidth: function (width) {
                $modalInner.css('max-width', width);
            },
            is_open: false,
            isOpen: function () {
                return this.is_open;
            },
            open: function () {

                // remove any current width set on it, can be re-set later
                this.setWidth('max-width', '');

                // check if already open?
                if (this.isOpen()) return ;
                this.is_open = true;

                // detect any scrollbar currently to the side (e.g. 15px in chrome vs 12px in firefox vs 0 on mobile)
                // and add padding right to fake it when modal is open
                if ( ! this.scrollbarWidth) {
                    this.scrollbarWidth = window.innerWidth - $('.modal-window-outer').width();
                }
                if (this.scrollbarWidth) {
                    $body.css('padding-right', this.scrollbarWidth);
                }

                // show modal, + use css to disable scroll on <body>, instead scroll within modal
                $body.addClass('modal-is-open');

                // clear any margin-right previously set on modalOuter (see close method)
                $modalOuter.css('margin-right', '');

                // this only runs if ie8 is in use, but for ie8 we have to redraw all icons on open of modals
                if (window.redrawFontAwesomeIcons) {
                    window.redrawFontAwesomeIcons();
                }
                // also in ie7 and less, show text of close in place of the close icon
                if ($('html').is('.lt-ie8')) {
                    $('.modal-window-header-close').html('Close');
                }

                // detect if in REC system, if so publish open events
                if (window.REC) {
                    window.REC.Events.publish('modal.open');
                    window.REC.Events.publish('modal.' + currentType + '.open');
                }

            },
            close: function () {

                // check if not currently open?
                if ( ! this.isOpen()) return ;
                this.is_open = false;

                // hide modal, + re-enable the scroll on <body>
                $body.removeClass('modal-is-open');

                // remove any fake scrollbar padding
                $body.css('padding-right', '');

                // but if the window is less than the height of the window
                if ($modalInner.outerHeight(true) < window.innerHeight) {
                    // then minus from the outer window until it hides
                    $modalOuter.css('margin-right', 0 - this.scrollbarWidth);
                }

                // callback given? remove after called, resets on add :)
                if (this.closeCallback) {
                    this.closeCallback();
                    this.closeCallback = null;
                }

                // fire close event for easier events that specifying closeCallback
                $modalOuter.trigger('close');

                // detect if in REC system, if so publish close events
                if (window.REC) {
                    window.REC.Events.publish('modal.close');
                    window.REC.Events.publish('modal.' + currentType + '.close');
                }

            },
            // set a temp callback on close (that removes after close)
            onCloseCallback: function (callback) {
                this.closeCallback = callback;
            },
            // find a given selector within modal
            find: function (selector) {
                return $modalOuter.find(selector);
            },
            // on event (within scope of current opened modal, clears once modal is destroyed)
            on: function (a, b, c) {
                return $modalOuter.off(a, b).on(a, b, c);
            }
        };
    }());

    //
    // Each instance
    // (only one open window at a time, but multiple instances can get ready and change the content)
    //

    // open window
    // e.g. new ModalWindow({ content: '' });
    ModalWindow = function (config, callback) {

        // set default config
        var defaults = {
            header: '',
            content: '',
            footer: '',
            scrollBetween: null,
            open: true // assume auto opening
        };

        // setup user config with defaults
        this.config = $.extend(defaults, config);

        // if given a callback, set it to the config object and call in init() function
        if (callback) {
            this.config.callback = callback;
        }

        // make sure document is ready before initiating
        this.init();
    };

    // on init
    ModalWindow.prototype.init = function () {

        // build html (if none already setup)
        CoreModal.build();

        // set type if any given
        if (this.config.type) {
            this.setType(this.config.type);
        }

        // set content if any given
        if (this.config.content) {
            this.setContent(this.config.content);
        }

        // set width if any given
        if (this.config.width) {
            this.setWidth(this.config.width);
        }

        // if auto opening, then open
        if (this.config.open) {
            this.open();
        }

        // run callback
        if (this.config.callback) {
            this.config.callback(this);
        }

        // allow scroll between multiple images?
        if (this.config.type == 'image' && this.config.scrollBetween) {

            // gather images
            var $images = $(this.config.scrollBetween),
                that = this;

            if ($images.length > 1) {

                // mark the active one as current
                var $activeImage = $images.filter('[href*="' + this.config.unformattedContent + '"]'),
                    activeImageIndex = $images.index($activeImage);

                // setup buttons
                this.setContent(this.config.content + '<div class="modal-window-gallery-controls"><a href="#prev" title="Previous"></a><a href="#next" title="Next"></a></div>');

                // setup event listeners
                this.on('click', '.modal-window-gallery-controls a', function () {
                    var direction = $(this).attr('href').replace('#', ''),
                        nextImage;

                    // work out next image based on direction, careful not to use an index that doesnt exist ;)
                    if (direction == 'next') {
                        activeImageIndex++;
                        if (activeImageIndex >= $images.length) {
                            activeImageIndex = 0;
                        }
                    } else {
                        activeImageIndex--;
                        if (activeImageIndex < 0) {
                            activeImageIndex = $images.length-1;
                        }
                    }
                    // set next image and re-call open/init of the modal to redraw the content
                    nextImage = $images.eq(activeImageIndex);
                    that.config.content = nextImage.attr('href').replace(/^\/thumbnail\/\d+x\d+/, '');
                    that.config.header = nextImage.find('> img').attr('title');
                    that.init();
                    return false;
                });

                $body.off('keyup', this.leftRightDetection);
                $body.on('keyup', this.leftRightDetection);
            }
        }
    };

    // watch for left/right keys press, scroll next and prev
    ModalWindow.prototype.leftRightDetection = function (e) {
        if (e.which==37) { // left, previous
            $('.modal-window-gallery-controls a[href="#prev"]').click();
        }
        else if (e.which==39) { // right, next
            $('.modal-window-gallery-controls a[href="#next"]').click();
        }
    };

    // set modal content
    // legacy method (ignores header and footer of modal)
    ModalWindow.prototype.setContent = function (content) {

        if (content) {

            // grab header &/or footer from data returned
            var $content = jQuery('<div>').append(content),
                $header = $content.find('.modal-window-header-title'),
                header = $header.wrap('<div>').html(), // get the outer html
                $footer = $content.find('.modal-window-footer'),
                footer = $footer.wrap('<div>').html();

            // remove it's header/footer from html content
            if ($header.length) {
                $header.remove();
            }
            if ($footer.length) {
                $footer.remove();
            }

            // set header & footer content
            if (header) this.setHeader(header);
            if (footer) this.setFooter(footer);

            this.config.content = $content.html();
        }
        CoreModal.setHeader(this.config.header);
        CoreModal.setBody(this.config.content);
        CoreModal.setFooter(this.config.footer);
    };

    // set modal type (image vs iframe vs youtube vs cart vs simple)
    // legacy method (ignores header and footer of modal)
    ModalWindow.prototype.setType = function (type) {
        var youtubeId;

        if (type) {
            this.config.type = type;
            this.config.unformattedContent = this.config.content;
        }

        // mod content if image type
        if (type == 'image') {
            this.config.content = '<img src="'+ this.config.content +'">';
        }

        // mod content if iframe type
        if (type == 'iframe') {
            this.config.content = '<iframe src="'+ this.config.content +'"></iframe>';
        }

        // mod content if youtube type
        if (type == 'youtube') {
            youtubeId = this.config.content.match(/watch\?v=(\w+)/, '$1')[1];
            this.config.content = '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/'+ youtubeId +'" frameborder="0" allowfullscreen></iframe>';
        }

        CoreModal.setType(this.config.type);
    };

    // set modal header content
    ModalWindow.prototype.setHeader = function (content) {
        this.config.header = content;
        CoreModal.setHeader(content);
    };

    // set modal body content
    ModalWindow.prototype.setBody = function (content) {
        CoreModal.setBody(content);
    };

    // set modal header content
    ModalWindow.prototype.setFooter = function (content) {
        this.config.footer = content;
        CoreModal.setFooter(content);
    };

    // set modal window width
    ModalWindow.prototype.setWidth = function (width) {
        this.config.width = width;
        CoreModal.setWidth(width);
    };

    // set modal window events on callback
    ModalWindow.prototype.on = function (a, b, c) {
        CoreModal.on(a, b, c);
    };

    // open window
    ModalWindow.prototype.open = function () {
        this.setContent();
        this.setType();
        CoreModal.open();

        var self = this;

        // if type was youtube or other iframe, we'll want to stop the iframe/video from playing when closed
        if (self.config.type=='youtube' || self.config.type=='iframe') {
            CoreModal.onCloseCallback(function () {
                setTimeout(function () {
                    CoreModal.setBody('');
                }, 1000);

                // call on close callback?
                if (typeof self.config.onCloseCallback == 'function') {
                    self.config.onCloseCallback();
                }
            });
        }
        else {
            CoreModal.onCloseCallback(function () {

                // call on close callback?
                if (typeof self.config.onCloseCallback == 'function') {
                    self.config.onCloseCallback();
                }
            });
        }

    };

    // close window
    ModalWindow.prototype.close = function () {
        CoreModal.close();
    };

    // find element inside window (in order to attach events etc.)
    // returns a jQuery object
    ModalWindow.prototype.find = function (selector) {
        return CoreModal.find(selector);
    };

    // expose to window
    window.ModalWindow = ModalWindow;

    // auto setup on all links with [data-modal]
    $(document).ready(function () {
        $('body').on('click', 'a[data-modal]', function () {

            // pop modal based on href
            var $this = $(this),
                type = $this.data('modal'),
                href = $this.attr('href'),
                modal = new ModalWindow({
                    type: type,
                    content: href
                }),
                modalWidth = $this.data('modal-width'),
                modalHeader = $this.data('modal-header');


            // given a specific width?
            if (modalWidth) {
                modal.setWidth(modalWidth);
            }

            // given a header?
            if (modalHeader) {
                modal.setHeader(modalHeader);
            }

            // set data ref to modal object incase we want to ref it later
            $this.data('modal-object', modal);

            return false;
        });
    });

}(jQuery));
