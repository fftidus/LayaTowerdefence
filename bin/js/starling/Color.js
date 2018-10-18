var starling;
(function (starling) {
    var Color = /** @class */ (function () {
        function Color() {
        }
        /** Returns the alpha part of an ARGB color (0 - 255). */
        Color.getAlpha = function (color) { return (color >> 24) & 0xff; };
        /** Returns the red part of an (A)RGB color (0 - 255). */
        Color.getRed = function (color) { return (color >> 16) & 0xff; };
        /** Returns the green part of an (A)RGB color (0 - 255). */
        Color.getGreen = function (color) { return (color >> 8) & 0xff; };
        /** Returns the blue part of an (A)RGB color (0 - 255). */
        Color.getBlue = function (color) { return color & 0xff; };
        /** Sets the alpha part of an ARGB color (0 - 255). */
        Color.setAlpha = function (color, alpha) {
            return (color & 0x00ffffff) | (alpha & 0xff) << 24;
        };
        /** Sets the red part of an (A)RGB color (0 - 255). */
        Color.setRed = function (color, red) {
            return (color & 0xff00ffff) | (red & 0xff) << 16;
        };
        /** Sets the green part of an (A)RGB color (0 - 255). */
        Color.setGreen = function (color, green) {
            return (color & 0xffff00ff) | (green & 0xff) << 8;
        };
        /** Sets the blue part of an (A)RGB color (0 - 255). */
        Color.setBlue = function (color, blue) {
            return (color & 0xffffff00) | (blue & 0xff);
        };
        /** Creates an RGB color, stored in an unsigned numbereger. Channels are expected
         *  in the range 0 - 255. */
        Color.rgb = function (red, green, blue) {
            return (red << 16) | (green << 8) | blue;
        };
        /** Creates an ARGB color, stored in an unsigned numbereger. Channels are expected
         *  in the range 0 - 255. */
        Color.argb = function (alpha, red, green, blue) {
            return (alpha << 24) | (red << 16) | (green << 8) | blue;
        };
        /** Converts a color to a vector containing the RGBA components (in this order) scaled
         *  between 0 and 1. */
        Color.toVector = function (color, out) {
            if (out === void 0) { out = null; }
            if (out == null)
                out = new Array();
            out[0] = ((color >> 16) & 0xff) / 255.0;
            out[1] = ((color >> 8) & 0xff) / 255.0;
            out[2] = (color & 0xff) / 255.0;
            out[3] = ((color >> 24) & 0xff) / 255.0;
            return out;
        };
        /** Multiplies all channels of an (A)RGB color with a certain factor. */
        Color.multiply = function (color, factor) {
            if (factor == 0.0)
                return 0x0;
            var alpha = ((color >> 24) & 0xff) * factor;
            var red = ((color >> 16) & 0xff) * factor;
            var green = ((color >> 8) & 0xff) * factor;
            var blue = (color & 0xff) * factor;
            if (alpha > 255)
                alpha = 255;
            if (red > 255)
                red = 255;
            if (green > 255)
                green = 255;
            if (blue > 255)
                blue = 255;
            return this.argb(alpha, red, green, blue);
        };
        /** Calculates a smooth transition between one color to the next.
         *  <code>ratio</code> is expected between 0 and 1. */
        Color.numbererpolate = function (startColor, endColor, ratio) {
            var startA = (startColor >> 24) & 0xff;
            var startR = (startColor >> 16) & 0xff;
            var startG = (startColor >> 8) & 0xff;
            var startB = (startColor) & 0xff;
            var endA = (endColor >> 24) & 0xff;
            var endR = (endColor >> 16) & 0xff;
            var endG = (endColor >> 8) & 0xff;
            var endB = (endColor) & 0xff;
            var newA = startA + (endA - startA) * ratio;
            var newR = startR + (endR - startR) * ratio;
            var newG = startG + (endG - startG) * ratio;
            var newB = startB + (endB - startB) * ratio;
            return (newA << 24) | (newR << 16) | (newG << 8) | newB;
        };
        /** @private */
        Color.prototype.Color = function () { throw new Error(); };
        Color.WHITE = 0xffffff;
        Color.SILVER = 0xc0c0c0;
        Color.GRAY = 0x808080;
        Color.BLACK = 0x000000;
        Color.RED = 0xff0000;
        Color.MAROON = 0x800000;
        Color.YELLOW = 0xffff00;
        Color.OLIVE = 0x808000;
        Color.LIME = 0x00ff00;
        Color.GREEN = 0x008000;
        Color.AQUA = 0x00ffff;
        Color.TEAL = 0x008080;
        Color.BLUE = 0x0000ff;
        Color.NAVY = 0x000080;
        Color.FUCHSIA = 0xff00ff;
        Color.PURPLE = 0x800080;
        return Color;
    }());
    starling.Color = Color;
})(starling || (starling = {}));
//# sourceMappingURL=Color.js.map