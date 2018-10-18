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
var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Sprite = starling.Sprite;
            var QuadSection = /** @class */ (function (_super) {
                __extends(QuadSection, _super);
                function QuadSection(t, color) {
                    if (color === void 0) { color = 0xffffff; }
                    var _this = _super.call(this) || this;
                    _this._ratio = 1.0;
                    _this.imgTar = new Sprite();
                    _this.imgTar.graphics.drawTexture(t);
                    _this.addChild(_this.imgTar);
                    _this.mw = _this.imgTar.width;
                    _this.mh = _this.imgTar.height;
                    _this.imgMask = new Sprite();
                    _this.imgMask.x = _this.mw / 2;
                    _this.imgMask.y = _this.mh / 2;
                    _this.updateVertices();
                    return _this;
                }
                QuadSection.prototype.updateVertices = function () {
                    var ang = 360 * this._ratio - 90;
                    this.imgMask.graphics.clear();
                    this.imgMask.graphics.drawPie(0, 0, (this.mw + 10) / 2, -90, ang, "#FFFFFF");
                    this.imgTar.mask = this.imgMask;
                };
                Object.defineProperty(QuadSection.prototype, "ratio", {
                    get: function () { return this._ratio; },
                    set: function (value) {
                        if (this._ratio != value) {
                            this._ratio = value;
                            this.updateVertices();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QuadSection.prototype, "_width", {
                    get: function () {
                        return this.mw;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QuadSection.prototype, "_height", {
                    get: function () {
                        return this.mh;
                    },
                    enumerable: true,
                    configurable: true
                });
                QuadSection.fromTexture = function (texture) {
                    var quadPie = new QuadSection(texture);
                    return quadPie;
                };
                QuadSection.prototype.destroyF = function () {
                    this.removeFromParent(true);
                    if (this.imgMask) {
                        this.imgMask.graphics.clear();
                        this.imgMask.removeFromParent(true);
                        this.imgMask = null;
                    }
                    this.imgTar = Tools.Tool_ObjUtils.destroyF_One(this.imgTar);
                };
                return QuadSection;
            }(Sprite));
            Tools.QuadSection = QuadSection;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=QuadSection.js.map