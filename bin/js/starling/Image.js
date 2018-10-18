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
    var Image = /** @class */ (function (_super) {
        __extends(Image, _super);
        function Image(t) {
            var _this = _super.call(this) || this;
            _this.sx = 1;
            _this.sy = 1;
            _this.w0 = 0;
            _this.h0 = 0;
            _this.texture = t;
            return _this;
        }
        Object.defineProperty(Image.prototype, "texture", {
            get: function () {
                return this.tmpTexture;
            },
            set: function (value) {
                this.tmpTexture = value;
                if (this.tmpTexture) {
                    this.graphics.clear();
                }
                this.graphics.drawTexture(this.tmpTexture, 0, 0);
                this.w0 = this.tmpTexture.sourceWidth;
                this.h0 = this.tmpTexture.sourceHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "height", {
            get: function () {
                if (this.h0 == 0) {
                    this.h0 = this.height;
                }
                return this.h0 * this.scaleY;
            },
            set: function (value) {
                this.scaleY = value / this.h0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "width", {
            get: function () {
                if (this.w0 == 0) {
                    this.w0 = this.width;
                }
                return this.w0 * this.scaleX;
            },
            set: function (value) {
                this.scaleX = value / this.w0;
            },
            enumerable: true,
            configurable: true
        });
        Image.prototype.destroy = function (destroyChild) {
            if (destroyChild === void 0) { destroyChild = true; }
            this.tmpTexture = null;
            _super.prototype.destroy.call(this, destroyChild);
        };
        return Image;
    }(starling.Sprite));
    starling.Image = Image;
})(starling || (starling = {}));
//# sourceMappingURL=Image.js.map