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
            var Sprite = starling.Sprite;
            var Handler = laya.utils.Handler;
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var MyMC = /** @class */ (function (_super) {
                __extends(MyMC, _super);
                function MyMC(mc) {
                    var _this = _super.call(this) || this;
                    _this.TimeFrame = parseInt("" + 1000 / MyClass.Config.playSpeedTrue);
                    _this.pastTime = 0;
                    _this.needLast = 0;
                    _this.MC = mc;
                    _this.fps = MyClass.Config.playSpeedTrue;
                    _this.loop = false;
                    _this.autoStopChild = false;
                    _this.isPlay = false;
                    MyMC.addF(_this);
                    if (_this.MC != null) {
                        _this.addChild(_this.MC);
                        _this.MC.stop(_this.autoStopChild);
                    }
                    return _this;
                }
                MyMC.addF = function (mc) {
                    this.dicAll.set(mc, true);
                };
                MyMC.removeF = function (mc) {
                    this.dicAll.remove(mc);
                };
                MyMC.pauseF = function () {
                    for (var i = 0; i < this.dicAll.keys.length; i++) {
                        var mc = this.dicAll.keys[i];
                        if (mc) {
                            mc.pauseF();
                        }
                    }
                };
                MyMC.resumeF = function () {
                    for (var i = 0; i < this.dicAll.keys.length; i++) {
                        var mc = this.dicAll.keys[i];
                        if (mc) {
                            mc.resumeF();
                        }
                    }
                };
                MyMC.onNewByMc = function (mc) {
                    if (mc == null)
                        return null;
                    return new MyMC(mc);
                };
                MyMC.prototype.enterPlayF = function () {
                    this.pastTime += this.TimeFrame;
                    var f2 = parseInt("" + this.pastTime / this.NeedTime);
                    while (f2 > 0) {
                        this.nextFrame();
                        f2--;
                        this.pastTime -= this.NeedTime;
                    }
                };
                MyMC.prototype.enterPrePlayF = function () {
                    this.pastTime += this.TimeFrame;
                    var f2 = parseInt("" + this.pastTime / this.NeedTime);
                    while (f2 > 0) {
                        this.preFrame();
                        f2--;
                        this.pastTime -= this.NeedTime;
                    }
                };
                MyMC.prototype.gotoF = function (f) {
                    if (this.MC != null) {
                        if (f >= this.MC.totalFrames) {
                            if (this.MC.currentFrame >= this.MC.totalFrames - this.needLast)
                                return;
                            f = this.MC.totalFrames - this.needLast;
                        }
                        this.MC.gotoAndStop(f, this.autoStopChild);
                        if (this.frameFunction)
                            this.frameFunction.run();
                        if (this.compFun) {
                            if (this.MC.currentFrame == this.MC.totalFrames - this.needLast)
                                this.compFun.run();
                        }
                    }
                };
                MyMC.prototype.nextFrame = function () {
                    if (this.MC != null) {
                        if (this.isComplete() == true) {
                            if (this.loop == true)
                                this.gotoF(0);
                        }
                        else {
                            this.gotoF(this.MC.currentFrame + 1);
                        }
                    }
                };
                MyMC.prototype.preFrame = function () {
                    if (this.MC != null) {
                        if (this.MC.currentFrame == 0) {
                            if (this.loop == true)
                                this.gotoF(this.MC.totalFrames - this.needLast);
                        }
                        else {
                            this.gotoF(this.MC.currentFrame - 1);
                        }
                    }
                };
                MyMC.prototype.play = function () {
                    if (this.mmo) {
                        return;
                    }
                    this.mmo = new MyClass.MainManagerOne();
                    this.mmo.addEnterFrameFun(Handler.create(this, this.onEnterF, null, false));
                };
                MyMC.prototype.onEnterF = function () {
                    this.enterPlayF();
                    if (this.MC == null) {
                        this.mmo = Tool_ObjUtils.destroyF_One(this.mmo);
                        return;
                    }
                    if (this.loop == true)
                        return;
                    if (this.isComplete() == true) {
                        this.stop();
                    }
                };
                MyMC.prototype.stop = function () {
                    this.pastTime = 0;
                    if (this.mmo) {
                        this.mmo = Tool_ObjUtils.destroyF_One(this.mmo);
                    }
                };
                MyMC.prototype.gotoAndStop = function (f) {
                    this.gotoF(f);
                    this.stop();
                };
                MyMC.prototype.gotoAndPlay = function (f) {
                    this.pastTime = 0;
                    this.gotoF(f);
                    this.play();
                };
                MyMC.prototype.pauseF = function () {
                    this.stop();
                };
                MyMC.prototype.resumeF = function () {
                    this.play();
                };
                /****************************清理***********************************/
                MyMC.prototype.destroyF = function () {
                    MyMC.removeF(this);
                    this.frameFunction = null;
                    this.compFun = null;
                    this.MC = Tool_ObjUtils.destroyF_One(this.MC);
                    this.mmo = Tool_ObjUtils.destroyF_One(this.mmo);
                    this.destroy();
                };
                Object.defineProperty(MyMC.prototype, "loop", {
                    /******************************FPS*********************************/
                    get: function () {
                        return this._loop;
                    },
                    set: function (value) {
                        this._loop = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyMC.prototype, "fps", {
                    get: function () {
                        return this._fps;
                    },
                    set: function (value) {
                        this._fps = value;
                        this.NeedTime = 1000 / this._fps;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyMC.prototype, "currentFrame", {
                    get: function () {
                        return this.MC.currentFrame;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyMC.prototype, "totalFrames", {
                    get: function () {
                        return this.MC.totalFrames;
                    },
                    enumerable: true,
                    configurable: true
                });
                MyMC.prototype.isComplete = function () {
                    if (this.MC == null)
                        return true;
                    return this.MC.currentFrame >= this.MC.totalFrames - this.needLast;
                };
                Object.defineProperty(MyMC.prototype, "autoStopChild", {
                    get: function () {
                        return this._autoStopChild;
                    },
                    set: function (value) {
                        this._autoStopChild = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                MyMC.dicAll = new Dictionary();
                return MyMC;
            }(Sprite));
            MyView.MyMC = MyMC;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyMC.js.map