/**
* jquery.smartSticky 2.4.0
* https://github.com/oplaner4/jquery.smartSticky
* by Ondrej Planer, oplaner4@gmail.com
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
        self._isEnabled = true;

        self._settingsManagerInstance = new smartStickySettingsManager(options, elem);

        if (self.getSettingsManager().isContainerOverflowing()) {
            self._scrollingManagerInstance = new smartStickyScrollingManager(self.getSettingsManager().getContainer()).onScrolling(function () {
                self.adjustToCurrentScrollTop();
            });

            $.fn.smartSticky.windowScrollingManager.onScrolling(function () {
                if (self.activated()) {
                    self.getPositionManager().setYCoordManager().recalculateFixedPosition();
                }
            });
        }
        else {
            self._scrollingManagerInstance = $.fn.smartSticky.windowScrollingManager.onScrolling(function () {
                self.adjustToCurrentScrollTop();
            });
        }

        self._positionManagerInstance = new smartStickyPositionManager(self._settingsManagerInstance, self._scrollingManagerInstance);

        $.fn.smartSticky.windowScrollingManager.getOverflowingElement().on('resize', function () {
            self.getPositionManager().setOrigPosition();
            self.adjustToCurrentScrollTop();
        }).trigger('resize');
    };

    smartStickyManager.prototype.getPositionManager = function () {
        return this._positionManagerInstance;
    };

    smartStickyManager.prototype.getSettingsManager = function () {
        return this._settingsManagerInstance;
    };

    smartStickyManager.prototype.getScrollingManager = function () {
        return this._scrollingManagerInstance;
    };

    smartStickyManager.prototype.adjustToCurrentScrollTop = function () {
        if (this.isEnabled()) {
            if (this.getPositionManager().outOfOrigPosition()) {
                if (!this.activated()) {
                    this.activate();
                }

                if (!this.hide().getPositionManager().prepareFixedPosition().outOfContainer()) {
                    if (this.getPositionManager().canBeShownDueToScrolling()) {
                        this.getSettingsManager().getElement().removeClass($.fn.smartSticky.classes.invisible);
                        this.getPositionManager().recalculateFixedPosition();
                    }
                }
            }
            else if (this.activated()) {
                this.deactivate();
            }
        }

        return this;
    };

    smartStickyManager.prototype.enable = function () {
        this._isEnabled = true;
        this.adjustToCurrentScrollTop();
        return this;
    };

    smartStickyManager.prototype.disable = function () {
        this._isEnabled = false;
        this.deactivate();
        return this;
    };

    smartStickyManager.prototype.isEnabled = function () {
        return this._isEnabled;
    };

    smartStickyManager.prototype.hide = function () {
        this.getSettingsManager().getElement().addClass($.fn.smartSticky.classes.invisible);
        return this;
    };

    smartStickyManager.prototype.setOptions = function (options) {
        this.getSettingsManager().setOptions(options, true);
        return this;
    };

    smartStickyManager.prototype.deactivate = function () {
        this.getPositionManager().setOrigPosition();
        this.getSettingsManager().getElement().trigger('smartSticky.deactivate', [this.getSettingsManager()]);
        return this;
    };

    smartStickyManager.prototype.activate = function () {
        this.getSettingsManager().preparePlaceholder().getElement().removeClass($.fn.smartSticky.classes.background).css({
            left: this.getSettingsManager().getFixedLeft(),
            width: this.getSettingsManager().getFixedWidth()
        }).addClass($.fn.smartSticky.classes.active).trigger('smartSticky.activate', [this.getSettingsManager()]);

        if (new Array('rgba(0, 0, 0, 0)', 'transparent').indexOf(this.getSettingsManager().getElement().css('background-color')) > -1) {
            this.getSettingsManager().getElement().addClass($.fn.smartSticky.classes.background);
        }

        return this;
    };

    smartStickyManager.prototype.activated = function () {
        return this.getSettingsManager().getElement().hasClass($.fn.smartSticky.classes.active);
    };




    var smartStickySettingsManager = function (options, elem) {
        this._options = null;
        this._container = null;
        this._isContainerOverflowing = null;

        this._elem = elem.addClass($.fn.smartSticky.classes.root).wrap(
            $('<div />', { class: $.fn.smartSticky.classes.placeholder })
        );

        this.setOptions(options, false).setContainer();
    };

    smartStickySettingsManager.prototype.getElement = function () {
        return this._elem;
    };

    smartStickySettingsManager.prototype.setOptions = function (options, update) {
        this._options = $.extend(true, {}, update ? this._options : $.fn.smartSticky.defaults, options);
        return this;
    };

    smartStickySettingsManager.prototype.getOptions = function () {
        return this._options;
    };

    smartStickySettingsManager.prototype.setContainer = function () {
        var c = this.getOptions().container;

        if (c instanceof Function) {
            c = c(this);
        }

        if (c instanceof HTMLElement || c instanceof HTMLCollection || c instanceof String || typeof c === 'string') {
            c = $(c);
        }

        if (c instanceof jQuery && c.length > 0) {
            c = c.first();
        }
        else {
            c = this.getPlaceholder().parent();
        }

        this._container = c.addClass($.fn.smartSticky.classes.container);
        this._isContainerOverflowing = new Array('auto', 'scroll', 'overlay').indexOf(this.getContainer().css('overflow')) > -1;
        return this;
    };

    smartStickySettingsManager.prototype.getContainer = function () {
        return this._container;
    };

    smartStickySettingsManager.prototype.isContainerOverflowing = function () {
        return this._isContainerOverflowing;
    };

    smartStickySettingsManager.prototype.getFixedLeft = function () {
        var l = this.getOptions().css.fixed.left;

        if (l instanceof Function) {
            l = l(this);
        }

        if (l === parseFloat(l) || l instanceof Number || l instanceof String || typeof l === 'string') {
            return l;
        }

        return this.getElement().offset().left;
    };

    smartStickySettingsManager.prototype.getFixedWidth = function () {
        var w = this.getOptions().css.fixed.width;

        if (w instanceof Function) {
            w = w(this);
        }

        if (w === parseFloat(w) || w instanceof Number || w instanceof String || typeof w === 'string') {
            return w;
        }

        return this.getElement().outerWidth();
    };

    smartStickySettingsManager.prototype.getOrigOffsetTop = function () {
        return this.getElement().data('offsetTop');
    };

    smartStickySettingsManager.prototype.getOrigHeight = function () {
        return this.getElement().data('height');
    };

    smartStickySettingsManager.prototype.getPlaceholder = function () {
        return this.getElement().parent('.' + $.fn.smartSticky.classes.placeholder);
    };

    smartStickySettingsManager.prototype.preparePlaceholder = function () {
        this.getPlaceholder().height(this.getElement().outerHeight());
        return this;
    };



    var smartStickyPositionYCoordManager = function (yCoordObj) {
        this._yCoordObj = yCoordObj instanceof Object ? yCoordObj : { top: 0 };
    };

    smartStickyPositionYCoordManager.prototype.isCalculatedFromTop = function () {
        return this._yCoordObj.hasOwnProperty('top');
    };

    smartStickyPositionYCoordManager.prototype.getFromTop = function () {
        return this.isCalculatedFromTop() ? this._yCoordObj.top : 'auto';
    };

    smartStickyPositionYCoordManager.prototype.getFromBottom = function () {
        return !this.isCalculatedFromTop() ? this._yCoordObj.bottom : 'auto';
    };




    var smartStickyPositionManager = function (settingsManagerInstance, scrollingManagerInstance) {
        this._settingsManagerInstance = settingsManagerInstance;
        this._scrollingManagerInstance = scrollingManagerInstance;
        this._fixedPosition = null;
        this._yCoordManagerInstance = null;
        this.prepareFixedPosition();
    };

    smartStickyPositionManager.prototype.getSettingsManager = function () {
        return this._settingsManagerInstance;
    };

    smartStickyPositionManager.prototype.getScrollingManager = function () {
        return this._scrollingManagerInstance;
    };

    smartStickyPositionManager.prototype.getYCoordManager = function () {
        return this._yCoordManagerInstance;
    };

    smartStickyPositionManager.prototype.setYCoordManager = function () {
        this._yCoordManagerInstance = new smartStickyPositionYCoordManager($.fn.smartSticky.positions[this.getFixedPosition()](this));
        return this;
    };

    smartStickyPositionManager.prototype.setOrigPosition = function () {
        this.getSettingsManager().getPlaceholder().css('height', 'auto');
        this.getSettingsManager().getElement()
            .removeClass($.fn.smartSticky.classes.active)
            .css({ left: 'auto', top: 'auto', bottom: 'auto', width: 'auto' })
            .data({
                offsetTop: this.getSettingsManager().getElement().offset().top +
                    (this.getSettingsManager().isContainerOverflowing() ? this.getScrollingManager().getCurrentScrollTop() - this.getScrollingManager().getOverflowingElement().offset().top : 0),
                height: this.getSettingsManager().getElement().outerHeight()
            });


        return this;
    };

    smartStickyPositionManager.prototype.recalculateFixedPosition = function () {
        this.getSettingsManager().getElement().css({
            top: this.getYCoordManager().getFromTop(),
            bottom: this.getYCoordManager().getFromBottom()
        });

        return this;
    };

    smartStickyPositionManager.prototype.outOfOrigPositionAbove = function () {
        if (!this.getSettingsManager().getOptions().show.original.above) {
            return false;
        }

        return this.getSettingsManager().getOrigOffsetTop() -
            this.getScrollingManager().getOverflowingElement().outerHeight() +
            (this.getSettingsManager().getOptions().show.immediately ? this.getSettingsManager().getOrigHeight() : -1 * this.getSettingsManager().getOptions().show.delay) >
            this.getScrollingManager().getCurrentScrollTop();
    };

    smartStickyPositionManager.prototype.outOfOrigPositionUnder = function () {
        if (!this.getSettingsManager().getOptions().show.original.under) {
            return false;
        }

        return this.getSettingsManager().getOrigOffsetTop() +
            (this.getSettingsManager().getOptions().show.immediately ? 0 : this.getSettingsManager().getOrigHeight() + this.getSettingsManager().getOptions().show.delay) <
            this.getScrollingManager().getCurrentScrollTop();
    };

    smartStickyPositionManager.prototype.outOfOrigPosition = function () {
        return this.outOfOrigPositionAbove() || this.outOfOrigPositionUnder();
    };

    smartStickyPositionManager.prototype.outOfContainerAbove = function () {
        return $.fn.smartSticky.windowScrollingManager.getCurrentScrollTop() +
            (this.getYCoordManager().isCalculatedFromTop() ? this.getYCoordManager().getFromTop() : $.fn.smartSticky.windowScrollingManager.getOverflowingElement().height() - this.getSettingsManager().getElement().outerHeight() - this.getYCoordManager().getFromBottom()) <
            this.getSettingsManager().getContainer().offset().top;
    };

    smartStickyPositionManager.prototype.outOfContainerUnder = function () {
        return $.fn.smartSticky.windowScrollingManager.getCurrentScrollTop() +
            (this.getYCoordManager().isCalculatedFromTop() ? this.getSettingsManager().getElement().outerHeight() + this.getYCoordManager().getFromTop() : $.fn.smartSticky.windowScrollingManager.getOverflowingElement().height() - this.getYCoordManager().getFromBottom()) >
            this.getSettingsManager().getContainer().offset().top +
            this.getSettingsManager().getContainer().outerHeight();
    };

    smartStickyPositionManager.prototype.outOfContainer = function () {
        if (this.getSettingsManager().isContainerOverflowing()) {
            return false;
        }

        return this.outOfContainerAbove() || this.outOfContainerUnder();
    };

    smartStickyPositionManager.prototype.canBeShownDueToScrolling = function () {
        if (this.getSettingsManager().getOptions().show.scrolling instanceof Function) {
            return this.getSettingsManager().getOptions().show.scrolling(this.getSettingsManager(), this.getScrollingManager()) === true ? true : false;
        }

        if (this.getScrollingManager().scrollingDown()) {
            if (this.getSettingsManager().getOptions().show.scrolling.down) {
                return true;
            }
        }
        else if (this.getSettingsManager().getOptions().show.scrolling.up) {
            return true;
        }

        return false;
    };

    smartStickyPositionManager.prototype.getFixedPosition = function () {
        return this._fixedPosition;
    };

    smartStickyPositionManager.prototype.prepareFixedPosition = function () {
        var p = this.getSettingsManager().getOptions().show.fixed;
        if (p instanceof Function) {
            p = p(this.getSettingsManager(), this.getScrollingManager());
        }

        this._fixedPosition = Object.keys($.fn.smartSticky.positions)[0];

        while ($.fn.smartSticky.positions.hasOwnProperty(p)) {
            this._fixedPosition = p;
            p = $.fn.smartSticky.positions[this._fixedPosition](this);
        }

        return this.setYCoordManager();
    };



    var smartStickyScrollingManager = function (overflowingElement) {
        var self = this;
        self._lastScrollTop = 0;
        self._lastScrollingDown = true;
        self._onScrollingCallbackArr = new Array();
        self._overflowingElement = overflowingElement.on('scroll', function () {
            self._onScrollingCallbackArr.forEach(function (callback) {
                callback(self);
            });
            self.update();
        });
    };

    smartStickyScrollingManager.prototype.getOverflowingElement = function () {
        return this._overflowingElement;
    };

    smartStickyScrollingManager.prototype.scrollingDown = function () {
        if (this._lastScrollTop === this.getCurrentScrollTop()) {
            return this._lastScrollingDown;
        }

        return this._lastScrollingDown = this._lastScrollTop < this.getCurrentScrollTop();
    };

    smartStickyScrollingManager.prototype.getCurrentScrollTop = function () {
        return this.getOverflowingElement().scrollTop();
    };

    smartStickyScrollingManager.prototype.update = function () {
        this._lastScrollTop = this.getCurrentScrollTop();
        return this;
    };

    smartStickyScrollingManager.prototype.onScrolling = function (callback) {
        this._onScrollingCallbackArr.push(callback);
        return this;
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
            immediately: false,
            original: {
                under: true,
                above: false
            },
            fixed: 'top',
            scrolling: {
                up: true,
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
        background: 'sticky-smart-background',
        container: 'sticky-smart-container'
    };

    $.fn.smartSticky.positions = {
        top: function (manager) {
            if (manager.getSettingsManager().isContainerOverflowing()) {
                return {
                    top: manager.getSettingsManager().getContainer().offset().top - $.fn.smartSticky.windowScrollingManager.getCurrentScrollTop()
                };
            }

            return { top: 0 };

        },
        bottom: function (manager) {
            if (manager.getSettingsManager().isContainerOverflowing()) {
                return {
                    bottom: Math.ceil(
                        $.fn.smartSticky.windowScrollingManager.getCurrentScrollTop() +
                        $.fn.smartSticky.windowScrollingManager.getOverflowingElement().height() -
                        manager.getSettingsManager().getContainer().offset().top -
                        manager.getSettingsManager().getContainer().outerHeight()
                    )
                };
            }

            return { bottom: 0 };
        },
        toggle: function (manager) {
            return manager.getScrollingManager().scrollingDown() ? 'top' : 'bottom';
        }
    };

    $.fn.smartSticky.windowScrollingManager = new smartStickyScrollingManager($(window));
}));