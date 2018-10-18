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
        var MyGestures;
        (function (MyGestures) {
            var MyGesture_RightSlide = /** @class */ (function (_super) {
                __extends(MyGesture_RightSlide, _super);
                function MyGesture_RightSlide(tar, f, value) {
                    var _this = _super.call(this, tar, f, value) || this;
                    _this.isDown = false;
                    _this.lastP = {};
                    _this.Tar.on(Laya.Event.RIGHT_MOUSE_DOWN, _this, _this.onDownF);
                    _this.Tar.on(Laya.Event.RIGHT_MOUSE_UP, _this, _this.onUpF);
                    _this.Tar.on(Laya.Event.MOUSE_OUT, _this, _this.onOutF);
                    _this.Tar.on(Laya.Event.MOUSE_MOVE, _this, _this.onMoveF);
                    return _this;
                }
                MyGesture_RightSlide.prototype.onDownF = function (e) {
                    this.isDown = true;
                    this.lastP["x"] = Laya.stage.mouseX;
                    this.lastP["y"] = Laya.stage.mouseY;
                };
                MyGesture_RightSlide.prototype.onMoveF = function (e) {
                    if (this.isDown == false)
                        return;
                    var p = {};
                    p["x"] = Laya.stage.mouseX - this.lastP["x"];
                    p["y"] = Laya.stage.mouseY - this.lastP["y"];
                    com.MyClass.Tools.Tool_Function.onRunFunction(this.F, p);
                    this.lastP["x"] = Laya.stage.mouseX;
                    this.lastP["y"] = Laya.stage.mouseY;
                };
                MyGesture_RightSlide.prototype.onUpF = function (e) {
                    this.isDown = false;
                };
                MyGesture_RightSlide.prototype.onOutF = function (e) {
                    this.isDown = false;
                };
                MyGesture_RightSlide.prototype.destroyF = function () {
                    this.Tar.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.onDownF);
                    this.Tar.off(Laya.Event.RIGHT_MOUSE_UP, this, this.onUpF);
                    this.Tar.off(Laya.Event.MOUSE_OUT, this, this.onOutF);
                    this.Tar.off(Laya.Event.MOUSE_MOVE, this, this.onMoveF);
                    _super.prototype.destroyF.call(this);
                };
                return MyGesture_RightSlide;
            }(MyGestures.MyGesture));
            MyGestures.MyGesture_RightSlide = MyGesture_RightSlide;
        })(MyGestures = MyClass.MyGestures || (MyClass.MyGestures = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyGesture_RightSlide.js.map