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
            var SwfSprite = /** @class */ (function (_super) {
                __extends(SwfSprite, _super);
                function SwfSprite() {
                    return _super.call(this) || this;
                }
                /*
                * meta数据
                */
                SwfSprite.prototype.setSpriteData = function (data) {
                    this.spriteData = data;
                    if (this.spriteData && (this.spriteData[0] instanceof Array) == false && this.spriteData.length > 0 && this.spriteData[0]["url"] == null) {
                        this.setMetaData(this.spriteData[0]);
                    }
                };
                SwfSprite.prototype.setMetaData = function (data) {
                    this.metaData = data;
                    if (this.metaData["鼠标区域"]) {
                        if (this.metaData["鼠标区域"]["形状"] == "圆") {
                            this.hit_半径 = this.metaData["鼠标区域"]["半径"];
                            this.hit_半径half = this.hit_半径 / 2;
                            this.hit_半径2 = this.hit_半径 * this.hit_半径;
                        }
                    }
                };
                /**
                 * 快速移出所有子集
                 */
                SwfSprite.prototype.clearChild = function (dispose) {
                    if (dispose === void 0) { dispose = false; }
                    this.removeChildren();
                };
                SwfSprite.prototype.setDisplayColor = function (display, color) {
                    display.color = color;
                };
                return SwfSprite;
            }(starling.Sprite));
            MySwf.SwfSprite = SwfSprite;
        })(MySwf = MyClass.MySwf || (MyClass.MySwf = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=SwfSprite.js.map