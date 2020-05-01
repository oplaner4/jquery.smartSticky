/**
* jquery.smartSticky 1.3.1
* by Ondrej Planer
* 
* This library requires jQuery.js
* See the documentation before using this library please
* jquery.smartSticky.js may be freely distributed under the MIT license.
*
* Copyright 2020, Ondrej Planer
 * 
 * 
 * PRESERVE THIS PLEASE
*/

(function (factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else if (typeof exports !== "undefined") {
        module.exports = factory(require("jquery"));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    /** Protection of jQuery's $ alias */
    "use strict";


    var smartStickyManager = function (elem, options) {
        var self = this;
        self.enabled = true;

        self.elementManagerInstance = new smartStickyElementManager(elem, options);

        $.fn.smartSticky.scrollingManager.onScrolling(function () {
            self.adjustToCurrentScrollTop();
        }).getWindow().on('resize', function () {
            self.getElementManager().setOriginalPosition();
            self.adjustToCurrentScrollTop();
        }).trigger('resize');
    };

    smartStickyManager.prototype.getElementManager = function () {
        return this.elementManagerInstance;
    };

    smartStickyManager.prototype.canBeShownDueToScrolling = function () {
        if (this.getElementManager().getOptions().show.scrolling instanceof Function) {
            return this.getElementManager().getOptions().show.scrolling(this.getElementManager(), $.fn.smartSticky.scrollingManager.scrollingDown()) === true ? true : false;
        }

        if ($.fn.smartSticky.scrollingManager.scrollingDown()) {
            if (this.getElementManager().getOptions().show.scrolling.down) {
                return true;
            }
        }
        else if (this.getElementManager().getOptions().show.scrolling.up) {
            return true;
        }

        return false;
    };

    smartStickyManager.prototype.adjustToCurrentScrollTop = function () {
        if (this.enabled) {
            if (this.getElementManager().outOfOrigPosition()) {
                if (!this.getElementManager().activated()) {
                    this.getElementManager().activate();
                }

                this.getElementManager().getElement().addClass($.fn.smartSticky.classes.invisible);

                if (this.getElementManager().canBeShownDueToOrigPosition()) {
                    if (!this.getElementManager().outOfContainer()) {
                        if (this.canBeShownDueToScrolling()) {
                            this.getElementManager().getElement().removeClass($.fn.smartSticky.classes.invisible);
                            if (this.getElementManager().toBePlacedBottom()) {
                                this.getElementManager().getElement()
                                    .removeClass($.fn.smartSticky.classes.top)
                                    .addClass($.fn.smartSticky.classes.bottom);
                            }
                            else {
                                this.getElementManager().getElement()
                                    .removeClass($.fn.smartSticky.classes.bottom)
                                    .addClass($.fn.smartSticky.classes.top);
                            }
                        }
                    }
                }
            }
            else if (this.getElementManager().activated()) {
                this.getElementManager().deactivate();
            }
        }

        return this;
    };

    smartStickyManager.prototype.enable = function () {
        this.enabled = true;
        this.adjustToCurrentScrollTop();
        return this;
    };

    smartStickyManager.prototype.disable = function () {
        this.enabled = false;
        this.getElementManager().deactivate();
        return this;
    };

    smartStickyManager.prototype.hide = function () {
        this.getElementManager().getElement().addClass($.fn.smartSticky.classes.invisible);
        return this;
    };

    smartStickyManager.prototype.setOptions = function (options) {
        this.getElementManager().setOptions(options);
        return this;
    };



    var smartStickyElementManager = function (elem, options) {
        this.elem = elem.addClass($.fn.smartSticky.classes.root).wrap(
            $('<div />', { class: $.fn.smartSticky.classes.placeholder })
        );

        this.setOptions(options).updateContainer();

        this.positions = ['top', 'bottom', 'toggle'];
    };

    smartStickyElementManager.prototype.setOptions = function (options) {
        this.options = $.extend(true, {}, $.fn.smartSticky.defaults, options);
        return this;
    };

    smartStickyElementManager.prototype.getOptions = function () {
        return this.options;
    };

    smartStickyElementManager.prototype.getElement = function () {
        return this.elem;
    };

    smartStickyElementManager.prototype.setOriginalPosition = function () {
        this.getPlaceholder().css('height', 'initial');
        this.updateContainer().getElement().removeClass($.fn.smartSticky.classes.active).css({ left: 0, width: '100%' }).data({
            offsetTop: this.getElement().offset().top,
            height: this.getElement().outerHeight()
        });
        return this;
    };

    smartStickyElementManager.prototype.deactivate = function () {
        this.setOriginalPosition().getElement().trigger('smartSticky.deactivate', [this]);
        return this;
    };

    smartStickyElementManager.prototype.activate = function () {
        this.getPlaceholder().height(this.getElement().outerHeight());

        this.getElement().addClass($.fn.smartSticky.classes.active).removeClass($.fn.smartSticky.classes.background).css({
            left: this.getFixedLeft(),
            width: this.getFixedWidth()
        }).trigger('smartSticky.activate', [this]);

        if (this.getElement().css('background-color') === 'rgba(0, 0, 0, 0)') {
            this.getElement().addClass($.fn.smartSticky.classes.background);
        }

        return this;
    };

    smartStickyElementManager.prototype.activated = function () {
        return this.getElement().hasClass($.fn.smartSticky.classes.active);
    }

    smartStickyElementManager.prototype.getPlaceholder = function () {
        return this.getElement().parent('.' + $.fn.smartSticky.classes.placeholder);
    };

    smartStickyElementManager.prototype.getOrigOffsetTop = function () {
        return this.getElement().data('offsetTop');
    };

    smartStickyElementManager.prototype.getOrigHeight = function () {
        return this.getElement().data('height');
    };

    smartStickyElementManager.prototype.updateContainer = function () {
        var c = this.getOptions().container;

        if (c instanceof Function) {
            c = c(this);
        }

        if (c instanceof HTMLElement || c instanceof String || typeof c === 'string') {
            c = $(c);
        }

        if (c instanceof jQuery) {
            if (c.length > 0) {
                c = c.first();
            }
        }
        else {
            c = this.getPlaceholder().parent();
        }

        this.container = c;

        return this;
    };

    smartStickyElementManager.prototype.getContainer = function () {
        return this.container;
    };

    smartStickyElementManager.prototype.getFixedLeft = function () {
        var l = this.getOptions().css.fixed.left;

        if (l instanceof Function) {
            l = l(this, $.fn.smartSticky.scrollingManager.scrollingDown());
        }

        if (Number.isFinite(l) || l instanceof String || typeof l === 'string') {
            return l;
        }

        return this.getPlaceholder().offset().left;
    };

    smartStickyElementManager.prototype.getFixedWidth = function () {
        var w = this.getOptions().css.fixed.width;

        if (w instanceof Function) {
            w = w(this, $.fn.smartSticky.scrollingManager.scrollingDown());
        }

        if (Number.isFinite(w) || w instanceof String || typeof w === 'string') {
            return w;
        }

        return this.getPlaceholder().outerWidth();
    };

    smartStickyElementManager.prototype.outOfOrigPositionAbove = function () {
        return this.getOrigOffsetTop() - this.getOptions().show.delay - $.fn.smartSticky.scrollingManager.getWindow().height() > $.fn.smartSticky.scrollingManager.getCurrentScrollTop();
    };

    smartStickyElementManager.prototype.outOfOrigPositionUnder = function () {
        return this.getOrigOffsetTop() + this.getOrigHeight() + this.getOptions().show.delay < $.fn.smartSticky.scrollingManager.getCurrentScrollTop();
    };

    smartStickyElementManager.prototype.outOfOrigPosition = function () {
        return this.outOfOrigPositionAbove() || this.outOfOrigPositionUnder();
    };

    smartStickyElementManager.prototype.outOfContainerAbove = function () {
        return $.fn.smartSticky.scrollingManager.getCurrentScrollTop() + (this.toBePlacedBottom() ? this.getElement().outerHeight() : 0) < this.getContainer().offset().top;
    };

    smartStickyElementManager.prototype.outOfContainerUnder = function () {
        var c = this.getContainer();
        return $.fn.smartSticky.scrollingManager.getCurrentScrollTop() + (this.toBePlacedBottom() ? $.fn.smartSticky.scrollingManager.getWindow().height() : this.getElement().outerHeight()) > c.offset().top + c.outerHeight();
    };

    smartStickyElementManager.prototype.outOfContainer = function () {
        return this.outOfContainerAbove() || this.outOfContainerUnder();
    };

    smartStickyElementManager.prototype.getFixedPosition = function () {
        var p = this.getOptions().show.fixed;
        if (p instanceof Function) {
            p = p(this, $.fn.smartSticky.scrollingManager.scrollingDown());
        }

        if (this.positions.indexOf(p) > -1) {
            if (p === 'toggle') {
                if (!$.fn.smartSticky.scrollingManager.scrollingDown()) {
                    return 'bottom';
                }
            }
            else return p;
        }

        return 'top';
    };

    smartStickyElementManager.prototype.toBePlacedBottom = function () {
        return this.getFixedPosition() === 'bottom';
    };

    smartStickyElementManager.prototype.canBeShownDueToOrigPosition = function () {
        if (this.getOptions().show.original.above) {
            if (this.outOfOrigPositionAbove()) {
                return true;
            }
        }

        if (this.getOptions().show.original.under) {
            if (this.outOfOrigPositionUnder()) {
                return true;
            }
        }

        return false;
    };


    $.fn.smartSticky = function (optionsOrCallbackName) {
        var isCallback = optionsOrCallbackName instanceof String || typeof optionsOrCallbackName === 'string';
        var smartStickyManagerInstance = 'smartStickyManagerInstance';
        var callbackArguments = arguments;

        if (isCallback && optionsOrCallbackName === 'instance') {
            var manager = this.data(smartStickyManagerInstance);
            if (manager instanceof smartStickyManager) {
                return manager;
            }
            else $.error('smartSticky has not been initialized');
        }

        return this.each(function () {
            var $this = $(this);
            if (isCallback) {
                var manager = $this.data(smartStickyManagerInstance);
                if (manager instanceof smartStickyManager) {
                    if (manager[optionsOrCallbackName] instanceof Function) {
                        manager[optionsOrCallbackName].apply(manager, Array.prototype.slice.call(callbackArguments, 1));
                    }
                }
            }
            else if (!$this.data(smartStickyManagerInstance)) {
                $this.data(smartStickyManagerInstance, new smartStickyManager($this, optionsOrCallbackName));
            }
        });
    };

    $.fn.smartSticky.defaults = {
        show: {
            delay: 50,
            original: {
                under: true,
                above: false
            },
            fixed: 'top',
            scrolling: {
                up: false,
                down: true
            }
        },
        container: null,
        css: {
            fixed: {
                width: null,
                left: null
            }
        }
    };

    $.fn.smartSticky.classes = {
        placeholder: 'sticky-smart-placeholder',
        root: 'sticky-smart',
        invisible: 'sticky-smart-invisible',
        active: 'sticky-smart-active',
        bottom: 'sticky-smart-bottom',
        top: 'sticky-smart-top',
        background: 'sticky-smart-background'
    };


    var scrollingManager = function () {
        var self = this;
        self.lastScrollTop = 0;
        self.onScrollingCallbackArr = new Array();
        self.ww = $(window).on('scroll', function () {
            self.onScrollingCallbackArr.forEach(function (callback) {
                callback(self);
            });
            self.update();
        });
    };

    scrollingManager.prototype.scrollingDown = function () {
        return this.lastScrollTop < this.getCurrentScrollTop();
    };

    scrollingManager.prototype.getCurrentScrollTop = function () {
        return this.getWindow().scrollTop();
    };

    scrollingManager.prototype.update = function () {
        this.lastScrollTop = this.getCurrentScrollTop();
        return this;
    };

    scrollingManager.prototype.onScrolling = function (callback) {
        this.onScrollingCallbackArr.push(callback);
        return this;
    };

    scrollingManager.prototype.getWindow = function () {
        return this.ww;
    };

    $.fn.smartSticky.scrollingManager = new scrollingManager();

}));