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
        var MySwf;
        (function (MySwf) {
            var AutoBitmap = laya.ui.AutoBitmap;
            var SwfS9Image = /** @class */ (function (_super) {
                __extends(SwfS9Image, _super);
                function SwfS9Image() {
                    var _this = _super.call(this) || this;
                    var g = new AutoBitmap();
                    _this.graphics = g;
                    return _this;
                }
                Object.defineProperty(SwfS9Image.prototype, "sizeGrid", {
                    get: function () {
                        if (this.graphics.sizeGrid)
                            return this.graphics.sizeGrid.join(",");
                        return null;
                    },
                    set: function (value) {
                        this.graphics.sizeGrid = laya.ui.UIUtils.fillArray(laya.ui.Styles.defaultSizeGrid, value, Number);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfS9Image.prototype, "source", {
                    get: function () {
                        return this.graphics.source;
                    },
                    set: function (value) {
                        if (!this.graphics)
                            return;
                        this.graphics.source = value;
                        _super.prototype.event.call(this, laya.events.Event.LOADED);
                        _super.prototype.repaint.call(this);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfS9Image.prototype, "width", {
                    get: function () {
                        return this.graphics.width;
                    },
                    set: function (value) {
                        this.graphics.width = value == 0 ? 0.0000001 : value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfS9Image.prototype, "height", {
                    get: function () {
                        return this.graphics.height;
                    },
                    set: function (value) {
                        this.graphics.height = value == 0 ? 0.0000001 : value;
                    },
                    enumerable: true,
                    configurable: true
                });
                SwfS9Image.prototype.removeFromParent = function (dispose) {
                    if (dispose === void 0) { dispose = false; }
                    if (this.parent != null) {
                        this.parent.removeChild(this);
                    }
                    if (dispose) {
                        this.destroy();
                    }
                };
                SwfS9Image.prototype.destroy = function (destroyChild) {
                    if (destroyChild === void 0) { destroyChild = true; }
                    if (this.graphics)
                        this.graphics.destroy();
                    _super.prototype.destroy.call(this, true);
                };
                return SwfS9Image;
            }(starling.Sprite));
            MySwf.SwfS9Image = SwfS9Image;
        })(MySwf = MyClass.MySwf || (MyClass.MySwf = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=SwfS9Image.js.map