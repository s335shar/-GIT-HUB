define('jira/ajs/layer/inline-layer/standard-positioning', ['jira/lib/class', 'jquery'], function (Class, jQuery) {
    /**
     * Handles standing positioning of dropdowns
     *
     * @class StandardPositioning
     * @extends Class
     */
    return Class.extend({

        /**
         * @constructs
         */
        init: function init() {
            this.rebuiltCallbacks = [];
        },

        /**
         * Returns coordinates for bottom left corner of target
         *
         * @returns {{left: Number, top: Number}}
         */
        left: function left() {
            var offset = this.offset();
            return {
                left: offset.left,
                top: offset.top + this.offsetTarget().outerHeight()
            };
        },

        /**
         * Returns coordinates for bottom right corner of target
         *
         * @returns {{left: Number, top: Number}}
         */
        right: function right() {
            var offset = this.offset();
            return {
                left: offset.left - this.layer().outerWidth() + this.offsetTarget().outerWidth(),
                top: offset.top + this.offsetTarget().outerHeight()
            };
        },

        /**
         * Get window. This can change dependant on if your in an iframe or not.
         */
        window: function (_window) {
            function window() {
                return _window.apply(this, arguments);
            }

            window.toString = function () {
                return _window.toString();
            };

            return window;
        }(function () {
            return window;
        }),

        /**
         * Get offset of target
         * @return {Object}
         */
        offset: function offset() {

            var offset = this.offsetTarget().offset();

            if (this.offsetTarget().hasFixedParent()) {
                this.layer().css("position", "fixed");
                offset.top = offset.top - jQuery(window).scrollTop();
            } else {
                this.layer().css("position", "absolute");
            }

            return offset;
        },

        /**
         * A callback for when elements have been modified/rebuilt. IE7 needs to do this when moving elements to parent
         * document.
         *
         * @param arg
         */
        rebuilt: function rebuilt(arg) {

            var instance = this;

            if (jQuery.isFunction(arg)) {
                this.rebuiltCallbacks.push(arg);
            } else {
                jQuery.each(this.rebuiltCallbacks, function () {
                    this(instance.layer());
                });
            }
        },

        /**
         * Appends to body
         */
        appendToBody: function appendToBody() {
            this.layer().appendTo("body");
        },

        /**
         * Appends to placeholder
         */
        appendToPlaceholder: function appendToPlaceholder() {
            this.layer().appendTo(this.$placeholder);
        },

        /**
         * If out of view, scrolls inline layer into view.
         */
        scrollTo: function scrollTo() {
            // JRADEV-2900 says we shouldn't scroll InlineLayers anymore so the following
            // is commented out but preserved for future generations to discover.
            /*
            this.layer().scrollIntoView({
                duration: 750,
                marginTop: this.$offsetTarget.outerHeight()
            });
            //*/
        }

    });
});