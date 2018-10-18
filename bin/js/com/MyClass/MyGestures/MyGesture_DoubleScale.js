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
/**
* 双指放大
*/
var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyGestures;
        (function (MyGestures) {
            var MyGesture_DoubleScale = /** @class */ (function (_super) {
                __extends(MyGesture_DoubleScale, _super);
                function MyGesture_DoubleScale(tar, f, value, factor, max, min) {
                    if (factor === void 0) { factor = 0.01; }
                    if (max === void 0) { max = NaN; }
                    if (min === void 0) { min = NaN; }
                    var _this = _super.call(this, tar, f, value) || this;
                    _this.lastDistance = 0;
                    _this.factor = factor;
                    _this.maxScale = max;
                    _this.minScale = min;
                    Laya.stage.on(Laya.Event.MOUSE_UP, _this, _this.onMouseUp);
                    Laya.stage.on(Laya.Event.MOUSE_OUT, _this, _this.onMouseUp);
                    _this.Tar.on(Laya.Event.MOUSE_DOWN, _this, _this.onMouseDown);
                    return _this;
                }
                MyGesture_DoubleScale.prototype.onMouseDown = function (e) {
                    var touches = e.touches;
                    if (touches && touches.length == 2) {
                        this.lastDistance = this.getDistance(touches);
                        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
                    }
                };
                MyGesture_DoubleScale.prototype.onMouseMove = function (e) {
                    var distance = this.getDistance(e.touches);
                    if (distance != this.lastDistance) {
                        if (this.factor > 0) {
                            var s = this.Tar.scaleX + (distance - this.lastDistance) * this.factor;
                            if (this.minScale != NaN && s < this.minScale)
                                s = this.minScale;
                            else if (this.maxScale != NaN && s > this.maxScale)
                                s = this.maxScale;
                            this.Tar.scaleX = this.Tar.scaleY = s;
                        }
                        com.MyClass.Tools.Tool_Function.onRunFunction(this.F, distance - this.lastDistance);
                    }
                    this.lastDistance = distance;
                };
                MyGesture_DoubleScale.prototype.onMouseUp = function (e) {
                    Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
                };
                /**计算两个触摸点之间的距离*/
                MyGesture_DoubleScale.prototype.getDistance = function (points) {
                    var distance = 0;
                    if (points && points.length == 2) {
                        var dx = points[0].stageX - points[1].stageX;
                        var dy = points[0].stageY - points[1].stageY;
                        distance = Math.sqrt(dx * dx + dy * dy);
                    }
                    return distance;
                };
                MyGesture_DoubleScale.prototype.destroyF = function () {
                    _super.prototype.destroyF.call(this);
                    Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
                    Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
                    Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
                };
                return MyGesture_DoubleScale;
            }(MyGestures.MyGesture));
            MyGestures.MyGesture_DoubleScale = MyGesture_DoubleScale;
        })(MyGestures = MyClass.MyGestures || (MyClass.MyGestures = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyGesture_DoubleScale.js.map