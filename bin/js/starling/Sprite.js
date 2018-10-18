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
    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            var _this = _super.call(this) || this;
            _this._touchable = false;
            return _this;
        }
        Object.defineProperty(Sprite.prototype, "touchable", {
            get: function () { return this._touchable; },
            set: function (can) {
                this._touchable = can;
                this.mouseEnabled = can;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.removeFromParent = function (dispose) {
            if (dispose === void 0) { dispose = false; }
            this.removeSelf();
        };
        Object.defineProperty(Sprite.prototype, "color", {
            set: function (col) {
                if (col == starling.Color.WHITE) {
                    if (this.filters == null)
                        return;
                    for (var i = this.filters.length; i >= 0; i--) {
                        if (this.filters[i] instanceof laya.filters.ColorFilter) {
                            this.filters.splice(i, 1);
                            break;
                        }
                    }
                    return;
                }
                com.MyClass.Tools.Tool_ObjUtils.addColorFilter(this, com.MyClass.Tools.Tool_ObjUtils.ColorFilterType_color, col);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "width", {
            get: function () {
                var rec = this.getBounds();
                return rec.width;
            },
            set: function (value) {
                var w0 = this.width / this.scaleX;
                this.scaleX = value / w0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "height", {
            get: function () {
                var rec = this.getBounds();
                return rec.height;
            },
            set: function (value) {
                var w0 = this.height / this.scaleY;
                this.scaleY = value / w0;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.destroyF = function () {
            this.removeFromParent(true);
        };
        return Sprite;
    }(Laya.Sprite));
    starling.Sprite = Sprite;
})(starling || (starling = {}));
//# sourceMappingURL=Sprite.js.map