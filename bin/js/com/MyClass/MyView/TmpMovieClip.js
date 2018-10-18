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
            var Handler = laya.utils.Handler;
            var SwfMovieClip = com.MyClass.MySwf.SwfMovieClip;
            var SwfSprite = com.MyClass.MySwf.SwfSprite;
            var TmpMovieClip = /** @class */ (function (_super) {
                __extends(TmpMovieClip, _super);
                function TmpMovieClip(mc, f, type) {
                    if (f === void 0) { f = null; }
                    if (type === void 0) { type = "nor"; }
                    var _this = _super.call(this) || this;
                    _this.Arr = [];
                    _this.End = false;
                    _this.Type = type;
                    if (_this.Type == "循环点击") {
                        if (mc instanceof SwfMovieClip) {
                            mc.loop = true;
                            mc.play();
                        }
                    }
                    else if (mc instanceof SwfMovieClip) {
                        mc.completeFunction = Handler.create(_this, _this.overF);
                        mc.play();
                    }
                    else if (mc instanceof SwfSprite) {
                    }
                    else if (mc instanceof MyView.MyZMovieClip) {
                        mc.completeFunction = Handler.create(_this, _this.overF);
                        mc.play();
                    }
                    _this.Fun = f;
                    if (mc == null) {
                        _this.overF();
                    }
                    else {
                        _this.addMC(mc);
                    }
                    return _this;
                }
                TmpMovieClip.prototype.addMC = function (mc) {
                    if (mc == null)
                        return;
                    this.addChild(mc);
                    this.Arr.push(mc);
                };
                TmpMovieClip.prototype.overF = function (val) {
                    if (val === void 0) { val = null; }
                    this.stopF();
                    if (this.Type == "nor") {
                        this.onRunFunction();
                        this.destroyF();
                    }
                    else if (this.Type == "点击") {
                        this.addClickF();
                    }
                    else if (this.Type == "屏幕点击") {
                        this.addScreenClickF();
                    }
                    else if (this.Type == "手动") {
                        this.onRunFunction();
                    }
                };
                TmpMovieClip.prototype.stageF = function (e) {
                    this.addClickF();
                };
                TmpMovieClip.prototype.addClickF = function () {
                    //			this.addEventListener(TouchEvent.TOUCH,clickF);
                    //			this.once(MOUSE_EVENTS,this,clickF);
                    function clickF(e) {
                        this.onRunFunction();
                        this.destroyF();
                    }
                };
                TmpMovieClip.prototype.addScreenClickF = function () {
                    //			LayerStarlingManager.instance.stage.addEventListener(TouchEvent.TOUCH,clickF);
                    function clickF(e) {
                        this.onRunFunction();
                        this.destroyF();
                    }
                };
                TmpMovieClip.prototype.stopF = function () {
                    for (var i = 0; i < this.Arr.length; i++) {
                        var mc = this.Arr[i];
                        if (mc)
                            mc.stop();
                    }
                };
                TmpMovieClip.prototype.playF = function () {
                    for (var i = 0; i < this.Arr.length; i++) {
                        var mc = this.Arr[i];
                        if (mc)
                            mc.play();
                    }
                };
                TmpMovieClip.prototype.addStageRemoveListener = function () {
                    //			this.addEventListener(Event.REMOVED_FROM_STAGE,onRemoveF);
                };
                TmpMovieClip.prototype.onRemoveF = function (e) {
                    this.destroyF();
                };
                TmpMovieClip.prototype.onRunFunction = function () {
                    if (this.Fun != null) {
                        var f = this.Fun;
                        this.Fun = null;
                        f.run();
                    }
                };
                TmpMovieClip.prototype.destroyF = function () {
                    this.Fun = null;
                    this.End = true;
                    //			this.removeEventListener(Event.REMOVED_FROM_STAGE,onRemoveF);
                    //			this.removeEventListener(Event.ADDED_TO_STAGE,stageF);
                    this.removeFromParent(true);
                    this.Arr = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Arr);
                };
                return TmpMovieClip;
            }(starling.Sprite));
            MyView.TmpMovieClip = TmpMovieClip;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=TmpMovieClip.js.map