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
            var MyGesture_LongTouch = /** @class */ (function (_super) {
                __extends(MyGesture_LongTouch, _super);
                function MyGesture_LongTouch(tar, f, value, time, fd, fu) {
                    if (time === void 0) { time = 0.5; }
                    if (fd === void 0) { fd = null; }
                    if (fu === void 0) { fu = null; }
                    var _this = _super.call(this, tar, f, value) || this;
                    _this.mmo = new MyClass.MainManagerOne();
                    _this.isDown = false;
                    _this.T = time;
                    _this.FDown = fd;
                    _this.FUp = fu;
                    _this = _super.call(this, tar, f, value) || this;
                    var MME = _this.addMME();
                    MME.setValue("down事件", laya.utils.Handler.create(_this, _this.onDownF, null, false));
                    MME.setValue("up事件", laya.utils.Handler.create(_this, _this.onUpF, null, false));
                    MME.setValue("滑动", laya.utils.Handler.create(_this, _this.onSlideF, null, false));
                    return _this;
                }
                MyGesture_LongTouch.prototype.onDownF = function (p) {
                    if (this.isDown) {
                        return;
                    }
                    this.isDown = true;
                    this.mmo.add_delayFunction(laya.utils.Handler.create(this, this.onTimeF), this.T * MyClass.Config.playSpeedTrue);
                    com.MyClass.Tools.Tool_Function.onRunFunction(this.FDown, this.FValue);
                };
                MyGesture_LongTouch.prototype.onTimeF = function () {
                    if (this.F) {
                        com.MyClass.Tools.Tool_Function.onRunFunction(this.F, this.FValue);
                        this.onUpF(null);
                    }
                };
                MyGesture_LongTouch.prototype.onUpF = function (p) {
                    if (this.isDown == false) {
                        return;
                    }
                    this.isDown = false;
                    this.mmo.remove_delayFunction(this.onTimeF);
                    if (p && this.FUp) {
                        com.MyClass.Tools.Tool_Function.onRunFunction(this.FUp, this.FValue);
                    }
                };
                MyGesture_LongTouch.prototype.onSlideF = function (dic) {
                    if (dic["类型"] == "移动") {
                        this.onUpF(null);
                    }
                };
                MyGesture_LongTouch.prototype.destroyF = function () {
                    _super.prototype.destroyF.call(this);
                    this.FDown = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FDown);
                    this.FUp = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FUp);
                };
                return MyGesture_LongTouch;
            }(MyGestures.MyGesture));
            MyGestures.MyGesture_LongTouch = MyGesture_LongTouch;
        })(MyGestures = MyClass.MyGestures || (MyClass.MyGestures = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyGesture_LongTouch.js.map