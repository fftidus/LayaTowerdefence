var starling;
(function (starling) {
    var TextFormat = /** @class */ (function () {
        function TextFormat(t) {
            this.T = t;
        }
        Object.defineProperty(TextFormat.prototype, "color", {
            get: function () { return Number("0x" + this.T.color.substr(1)); },
            set: function (value) {
                this._color = value;
                if (this.T) {
                    this.T.color = "#" + this._color.toString(16);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFormat.prototype, "font", {
            get: function () { return this.T.font; },
            set: function (value) { this.T.font = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFormat.prototype, "size", {
            get: function () { return this.T.fontSize; },
            set: function (value) { this.T.fontSize = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFormat.prototype, "horizontalAlign", {
            get: function () { return this.T.align; },
            set: function (value) {
                if (value == "左" || value == "left")
                    this.T.align = "left";
                else if (value == "右" || value == "right")
                    this.T.align = "right";
                else
                    this.T.align = "center";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFormat.prototype, "italic", {
            get: function () { return this.T.italic; },
            set: function (value) { this.T.italic = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFormat.prototype, "bold", {
            get: function () { return this.T.bold; },
            set: function (value) { this.T.bold = value; },
            enumerable: true,
            configurable: true
        });
        return TextFormat;
    }());
    starling.TextFormat = TextFormat;
})(starling || (starling = {}));
//# sourceMappingURL=TextFormat.js.map