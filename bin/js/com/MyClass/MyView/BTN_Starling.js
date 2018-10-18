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
        var MyView;
        (function (MyView) {
            var SwfMovieClip = com.MyClass.MySwf.SwfMovieClip;
            var BTN_Starling = /** @class */ (function (_super) {
                __extends(BTN_Starling, _super);
                function BTN_Starling(tar) {
                    var _this = _super.call(this) || this;
                    _this.isDown = false;
                    _this.autoChangeFrame = true;
                    var rec = com.MyClass.Tools.Tool_SpriteUtils.getBounds(tar, null);
                    _this.MC = tar;
                    _this.touchable = true;
                    com.MyClass.Tools.Tool_SpriteUtils.onAddchild_ReplaceParent(_this, _this.MC);
                    _this.MC.touchable = true;
                    _this.isMc = _this.MC instanceof SwfMovieClip;
                    // this.initTouch(fd,fu,fClick);
                    _this.onChangeFrame(BTN_Starling.Frame_Nor);
                    _this.BtnVir = { "startX": rec.x, "startY": rec.y, "endX": rec.right, "endY": rec.bottom };
                    if (rec.width == 0 || rec.height == 0) { //透明按钮
                    }
                    return _this;
                }
                BTN_Starling.prototype.initTouch = function (fd, fu, fc, val) {
                    if (val === void 0) { val = null; }
                    this.FClick = fc;
                    if (this.FClick)
                        this.FClick.once = false;
                    this.FDown = fd;
                    if (this.FDown)
                        this.FDown.once = false;
                    this.FUp = fu;
                    if (this.FUp)
                        this.FUp.once = false;
                    this.ID = val;
                    if (this.mme == null) {
                        this.mme = new MyView.MyMouseEventStarling(this.MC);
                        this.mme.setValue("down事件", laya.utils.Handler.create(this, this.onDownF));
                        this.mme.setValue("up事件", laya.utils.Handler.create(this, this.onUpF));
                        this.mme.setValue("点击", laya.utils.Handler.create(this, this.onClickF));
                    }
                };
                BTN_Starling.prototype.setEventStop = function () {
                    if (this.mme) {
                        this.mme.setValue("停止冒泡", true);
                    }
                };
                BTN_Starling.prototype.onDownF = function (p) {
                    if (this.pause)
                        return;
                    if (this.FDown) {
                        com.MyClass.Tools.Tool_Function.onRunFunction(this.FDown, this.ID);
                    }
                    if (this.autoChangeFrame == true)
                        this.onChangeFrame(BTN_Starling.Frame_Down);
                };
                BTN_Starling.prototype.onUpF = function (p) {
                    if (this.autoChangeFrame == true)
                        this.onChangeFrame(BTN_Starling.Frame_Nor);
                    if (this.pause)
                        return;
                    if (this.FUp) {
                        if (this.ID == null)
                            this.FUp.run();
                        else
                            this.FUp.runWith(this.ID);
                    }
                };
                BTN_Starling.prototype.onClickF = function (p) {
                    if (this.FClick) {
                        if (this.ID == null)
                            this.FClick.run();
                        else
                            this.FClick.runWith(this.ID);
                    }
                };
                BTN_Starling.prototype.onChangeFrame = function (f) {
                    if (this.isMc == false || this.MC == null)
                        return;
                    if (this.MC.totalFrames <= f)
                        return;
                    this.MC.gotoAndStop(f, false);
                };
                BTN_Starling.prototype.checkIn = function (mx, my) {
                    if (this._pause || this.visible == false)
                        return false;
                    if (this.BtnVir == null)
                        return false;
                    var lx = mx;
                    var ly = my;
                    if (lx >= this.BtnVir.startX && lx <= this.BtnVir.endX && ly >= this.BtnVir.startY && ly <= this.BtnVir.endY)
                        return true;
                    return false;
                };
                Object.defineProperty(BTN_Starling.prototype, "pause", {
                    get: function () {
                        return this._pause;
                    },
                    set: function (value) {
                        if (this.pause == true)
                            this.setFrame(BTN_Starling.FramePause);
                        else
                            this.setFrame(BTN_Starling.Frame_Nor);
                        this._pause = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                BTN_Starling.prototype.setFrame = function (n) {
                    if (this.pause == true)
                        return;
                    if (this.isMc == false)
                        return;
                    if (n == this.nowFrame)
                        return;
                    this.nowFrame = n;
                    if (this.MC != null) {
                        if (this.MC.totalFrames > n - 1)
                            this.MC.gotoAndStop(n - 1, false);
                    }
                };
                BTN_Starling.prototype.destroyF = function () {
                    this.removeFromParent();
                    this.mme = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mme);
                    this.MC = null;
                    if (this.FClick) {
                        this.FClick.clear();
                        this.FClick = null;
                    }
                    if (this.FDown) {
                        this.FDown.clear();
                        this.FDown = null;
                    }
                    if (this.FUp) {
                        this.FUp.clear();
                        this.FUp = null;
                    }
                };
                BTN_Starling.Frame_Nor = 0;
                BTN_Starling.Frame_Down = 1;
                BTN_Starling.Frame_Selected = 2;
                BTN_Starling.FramePause = 3;
                return BTN_Starling;
            }(starling.Sprite));
            MyView.BTN_Starling = BTN_Starling;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=BTN_Starling.js.map