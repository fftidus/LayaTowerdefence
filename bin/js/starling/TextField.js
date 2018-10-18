var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var starling;
(function (starling) {
    var TextField = /** @class */ (function (_super) {
        __extends(TextField, _super);
        function TextField(_w, _h, text, formate) {
            if (formate === void 0) { formate = null; }
            var _this = _super.call(this) || this;
            _this.isCleared = false;
            _this._autoScale = false;
            _this._touchable = false;
            _this.text = text;
            return _this;
        }
        Object.defineProperty(TextField.prototype, "format", {
            get: function () {
                if (this._format == null) {
                    this._format = new starling.TextFormat(this);
                }
                else {
                    this._format.T = this;
                }
                return this._format;
            },
            set: function (value) {
                this._format = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "autoScale", {
            get: function () { return this._autoScale; },
            set: function (_x) {
                this._autoScale = _x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "touchable", {
            get: function () { return this._touchable; },
            set: function (can) {
                this._touchable = can;
                this.mouseEnabled = can;
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.removeFromParent = function (dispose) {
            if (dispose === void 0) { dispose = false; }
            this.isCleared = true;
            if (this.parent != null) {
                this.parent.removeChild(this);
            }
            if (dispose) {
                this.destroy();
            }
        };
        return TextField;
    }(laya.display.Text));
    starling.TextField = TextField;
})(starling || (starling = {}));
//# sourceMappingURL=TextField.js.map