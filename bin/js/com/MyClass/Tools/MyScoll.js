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
            var MyScoll = /** @class */ (function (_super) {
                __extends(MyScoll, _super);
                function MyScoll(mc) {
                    var _this = _super.call(this) || this;
                    _this.NowNum = 0;
                    _this.visible = false;
                    if (mc == null) {
                        return _this;
                    }
                    if (mc.parent) {
                        _this.x = mc.x;
                        _this.y = mc.y;
                        mc.parent.addChildAt(_this, mc.parent.getChildIndex(mc));
                        mc.x = 0;
                        mc.y = 0;
                    }
                    _this.addChild(mc);
                    _this.Mc_slide = mc.getChildByName("_滑块");
                    _this.Mc_Area = mc.getChildByName("_区域");
                    _this.Img_back = _this.Mc_slide.getChildByName("_back");
                    _this.Img_up = _this.Mc_slide.getChildByName("_up");
                    _this.Layer = new Sprite();
                    _this.Layer.x = _this.Mc_slide.x;
                    _this.Mc_slide.x = 0;
                    mc.addChildAt(_this.Layer, mc.getChildIndex(_this.Mc_slide));
                    _this.Layer.addChild(_this.Mc_slide);
                    var msy = mc.scaleY;
                    mc.scaleY = 1;
                    _this.H_Area = _this.Mc_Area.height * msy;
                    _this.Mc_Area.scaleY *= msy;
                    _this.MinHeight = _this.Img_back.height;
                    _this.Canv = new Sprite();
                    _this.Canv.graphics.drawRect(-5, 0, _this.Mc_slide.width + 5, _this.H_Area, "#ff0000");
                    _this.Layer.mask = _this.Canv;
                    return _this;
                }
                MyScoll.prototype.init = function (all, can) {
                    this.AllNum = all;
                    this.CanNum = can;
                    if (this.AllNum == 0) {
                        this.visible = false;
                    }
                    else {
                        this.visible = true;
                        var per = can / (all + can);
                        if (per > 1)
                            per = 1;
                        this.changeSlideHeight(this.H_Area * per);
                        this.MaxY = this.H_Area - this.NowHeight;
                    }
                    this.changeNow(0);
                };
                MyScoll.prototype.changeNow = function (now) {
                    if (this.AllNum == 0)
                        return;
                    this.NowNum = now;
                    this.showNowF();
                };
                MyScoll.prototype.showNowF = function () {
                    if (this.Mc_slide == null)
                        return;
                    if (this.AllNum == 0)
                        this.Mc_slide.y = 0;
                    else
                        this.Mc_slide.y = this.MaxY * this.NowNum / this.AllNum;
                };
                MyScoll.prototype.changeSlideHeight = function (h) {
                    if (this.Mc_slide == null)
                        return;
                    if (h < this.MinHeight)
                        h = this.MinHeight;
                    this.Img_back.height = h;
                    this.NowHeight = h;
                    if (this.Img_up)
                        this.Img_up.y = (h - this.Img_up.height) >> 1;
                };
                MyScoll.prototype.autoRemove = function () {
                    this.on(laya.events.Event.REMOVED, this, this.destroyF);
                };
                MyScoll.prototype.destroyF = function (e) {
                    if (e === void 0) { e = null; }
                    this.Canv.destroy();
                    this.removeFromParent(true);
                };
                return MyScoll;
            }(starling.Sprite));
            Tools.MyScoll = MyScoll;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyScoll.js.map