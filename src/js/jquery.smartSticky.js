/**
* jquery.smartSticky.js 1.0.1
* by Ondrej Planer
* 
* This library requires jQuery.js
* See the documentation before using this library please
* 
*
* Copyright 2020, Ondrej Planer
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
        return this.ww.scrollTop();
    };

    scrollingManager.prototype.update = function () {
        this.lastScrollTop = this.getCurrentScrollTop();
        return this;
    };

    scrollingManager.prototype.onScrolling = function (callback) {
        this.onScrollingCallbackArr.push(callback);
        return this;
    };

    var smartStickyScrollingManager = new scrollingManager();



    var smartStickyManager = function (elem, options) {
        var self = this;
        self.enabled = true;

        self.defaults = {
            show: {
                position: {
                    original: {
                        under: true,
                        above: false
                    },
                    sticky: 'top'
                },
                scrolling: {
                    sticky: {
                        delay: 50
                    },
                    up: false,
                    down: true
                }
            },
            container: false,
            css: {
                classes: {
                    root: 'sticky-smart',
                    placeholder: 'sticky-smart-placeholder',
                    invisible: 'sticky-smart-invisible',
                    active: 'sticky-smart-active',
                    bottom: 'sticky-smart-bottom',
                    top: 'sticky-smart-top'
                },
                sticky: {
                    width: false,
                    left: false
                }
            }
        };

        self.options = $.extend(true, {}, self.defaults, options);

        self.elem = elem.addClass(self.options.css.classes.root).wrap(
            $('<div />', { class: self.options.css.classes.placeholder })
        );

        self.smartStickyElementManagerInstance = new smartStickyElementManager(self.elem, self.options);

        smartStickyScrollingManager.onScrolling(function () {
            self.adjustToCurrentScrollTop();
        });

        smartStickyScrollingManager.ww.on('resize', function () {
            self.getSmartStickyElementManager().setOriginalPosition();
            self.adjustToCurrentScrollTop();
        }).trigger('resize');
    };

    smartStickyManager.prototype.getSmartStickyElementManager = function () {
        return this.smartStickyElementManagerInstance;
    };

    smartStickyManager.prototype.canBeShownDueToScrolling = function () {
        if (this.options.show.scrolling instanceof Function) {
            return this.options.show.scrolling(this, smartStickyScrollingManager.scrollingDown()) === true ? true : false;
        }

        if (smartStickyScrollingManager.scrollingDown()) {
            if (this.options.show.scrolling.down) {
                return true;
            }
        }
        else if (this.options.show.scrolling.up) {
            return true;
        }

        return false;
    };

    smartStickyManager.prototype.canBeShown = function () {
        if (!this.getSmartStickyElementManager().canBeShownDueToOrigPosition()) {
            return false;
        }

        return this.canBeShownDueToScrolling();
    };

    smartStickyManager.prototype.adjustToCurrentScrollTop = function () {
        var self = this;

        if (self.enabled) {
            if (self.getSmartStickyElementManager().outOfOrigPosition()) {
                 if (!this.elem.hasClass(self.options.css.classes.active)) {
                     self.getSmartStickyElementManager().activateStickyPosition();
                 }

                 this.elem.addClass(self.options.css.classes.invisible);

                if (!self.getSmartStickyElementManager().outOfContainer()) {
                     if (self.canBeShown()) {
                         if (self.getSmartStickyElementManager().toBePlacedBottom()) {
                             this.elem.removeClass(self.options.css.classes.invisible)
                                 .removeClass(self.options.css.classes.top)
                                 .addClass(self.options.css.classes.bottom);
                         }
                         else {
                             this.elem.removeClass(self.options.css.classes.invisible)
                                 .removeClass(self.options.css.classes.bottom)
                                 .addClass(self.options.css.classes.top);
                         }
                     }
                 }
             }
             else {
                self.getSmartStickyElementManager().setOriginalPosition();
             }
        }

        return self;
    };

    smartStickyManager.prototype.enable = function () {
        this.enabled = true;
        this.adjustToCurrentScrollTop();
        return this;
    };

    smartStickyManager.prototype.disable = function () {
        this.enabled = false;
        this.getSmartStickyElementManager().setOriginalPosition();
        return this;
    };

    smartStickyManager.prototype.hide = function () {
        this.elem.addClass(this.options.css.classes.invisible);
        return this;
    };

    var smartStickyElementManager = function (elem, options) {
        this.elem = elem;
        this.options = options;
        this.positions = ['top', 'bottom', 'toggle'];
    };

    smartStickyElementManager.prototype.setOriginalPosition = function () {
        var self = this;

        self.elem.removeClass(self.options.css.classes.active).css({ left: 0, width: '100%' }).data({
            offsetTop: self.elem.offset().top,
            height: self.elem.outerHeight()
        });
        self.getPlaceholder().height(self.elem.outerHeight());

        return self;
    };

    smartStickyElementManager.prototype.activateStickyPosition = function () {
        this.elem.addClass(this.options.css.classes.active).css({
            left: this.getStickyLeft(),
            width: this.getStickyWidth()
        });

        return this;
    };

    smartStickyElementManager.prototype.getPlaceholder = function () {
        return this.elem.parent('.' + this.options.css.classes.placeholder);
    };

    smartStickyElementManager.prototype.getOrigOffsetTop = function () {
        return this.elem.data('offsetTop');
    };

    smartStickyElementManager.prototype.getOrigHeight = function () {
        return this.elem.data('height');
    };

    smartStickyElementManager.prototype.getContainer = function () {
        if (this.options.container instanceof Function) {
            return this.options.container(this.elem);
        }

        if (this.options.container instanceof jQuery) {
            return this.options.container;
        }

        if (this.options.container instanceof HTMLCollection || this.options.container instanceof String || typeof this.options.container === 'string') {
            return $(this.options.container);
        }

        return this.getPlaceholder().parent();
    };

    smartStickyElementManager.prototype.getStickyLeft = function () {
        if (this.options.css.sticky.left instanceof Function) {
            var l = this.options.css.sticky.left(this, smartStickyScrollingManager.scrollingDown());
            if (Number.isFinite(l) || l instanceof String || typeof l === 'string') {
                return l;
            }
        }

        return this.getContainer().offset().left;
    };

    smartStickyElementManager.prototype.getStickyWidth = function () {
        if (this.options.css.sticky.width instanceof Function) {
            var w = this.options.css.sticky.width(this, smartStickyScrollingManager.scrollingDown());
            if (Number.isFinite(w) || w instanceof String || typeof w === 'string') {
                return w;
            }
        }

        return this.getContainer().width();
    };

    smartStickyElementManager.prototype.outOfOrigPositionAbove = function () {
        return this.getOrigOffsetTop() - this.getStickyPositionDelay() - smartStickyScrollingManager.ww.height() > smartStickyScrollingManager.getCurrentScrollTop();
    };

    smartStickyElementManager.prototype.outOfOrigPositionUnder = function () {
        return this.getOrigOffsetTop() + this.getOrigHeight() + this.getStickyPositionDelay() < smartStickyScrollingManager.getCurrentScrollTop();
    };

    smartStickyElementManager.prototype.outOfOrigPosition = function () {
        return this.outOfOrigPositionAbove() || this.outOfOrigPositionUnder();
    };

    smartStickyElementManager.prototype.outOfContainerAbove = function () {
        return smartStickyScrollingManager.getCurrentScrollTop() + (this.toBePlacedBottom() ? this.elem.outerHeight() : 0) < this.getContainer().offset().top;
    };

    smartStickyElementManager.prototype.outOfContainerUnder = function () {
        var container = this.getContainer();
        return smartStickyScrollingManager.getCurrentScrollTop() + (this.toBePlacedBottom() ? smartStickyScrollingManager.ww.height() : this.elem.outerHeight()) > container.offset().top + container.outerHeight();
    };

    smartStickyElementManager.prototype.outOfContainer = function () {
        return this.outOfContainerAbove() || this.outOfContainerUnder();
    };

    smartStickyElementManager.prototype.getStickyPosition = function () {
        var p = this.options.show.position.sticky;
        if (p instanceof Function) {
            p = p(smartStickyScrollingManager.scrollingDown(), this);
        }

        if (this.positions.indexOf(p) > -1) {
            if (p === 'toggle') {
                if (!smartStickyScrollingManager.scrollingDown()) {
                    return 'bottom';
                }
            }
            else return p;
        }

        return 'top';
    };

    smartStickyElementManager.prototype.toBePlacedBottom = function () {
        return this.getStickyPosition() === 'bottom';
    };

    smartStickyElementManager.prototype.canBeShownDueToOrigPosition = function () {
        if (this.outOfOrigPositionAbove() && this.options.show.position.original.above) {
            return true;
        }

        if (this.outOfOrigPositionUnder() && this.options.show.position.original.under) {
            return true;
        }

        return false;
    };

    smartStickyElementManager.prototype.getStickyPositionDelay = function () {
        return this.options.show.scrolling instanceof Function ? 0 : this.options.show.scrolling.sticky.delay;
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

}));