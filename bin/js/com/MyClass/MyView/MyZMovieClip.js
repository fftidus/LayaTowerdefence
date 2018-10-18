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
            var Templet = laya.ani.bone.Templet;
            var Event = laya.events.Event;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var MyZMovieClip = /** @class */ (function (_super) {
                __extends(MyZMovieClip, _super);
                function MyZMovieClip(url, f) {
                    var _this = _super.call(this) || this;
                    _this.isComplete = false;
                    _this.countMoreFrame = 0;
                    MyView.MyMC.addF(_this);
                    _this.URL = url;
                    _this.Fun = f;
                    var index = _this.URL.lastIndexOf("/");
                    _this.Name = _this.URL.substr(index + 1);
                    if (MyZMovieClip.dicTemplet == null) {
                        MyZMovieClip.dicTemplet = {};
                    }
                    if (MyZMovieClip.dicTemplet[_this.URL] == null) {
                        _this.zGameMc = new Templet();
                        MyZMovieClip.dicTemplet[_this.URL] = { "模板": _this.zGameMc, "num": 1 };
                        _this.zGameMc.on(Event.COMPLETE, _this, _this.parseComplete);
                        _this.zGameMc.on(Event.ERROR, _this, _this.onError);
                        _this.zGameMc.loadAni(url);
                    }
                    else {
                        _this.zGameMc = MyZMovieClip.dicTemplet[_this.URL]["模板"];
                        MyZMovieClip.dicTemplet[_this.URL]["num"]++;
                        Tool_Function.onRunFunction(_this.Fun, _this);
                        _this.Fun = null;
                    }
                    return _this;
                }
                MyZMovieClip.prototype.parseComplete = function (fac) {
                    this.zGameMc.offAll();
                    if (fac == null) { //error
                        Tool_Function.onRunFunction(this.Fun, null);
                    }
                    else {
                        Tool_Function.onRunFunction(this.Fun, this);
                    }
                    this.Fun = null;
                };
                MyZMovieClip.prototype.onError = function (e) {
                    console.log("加载spine失败：" + URL);
                    this.parseComplete(null);
                };
                MyZMovieClip.prototype.initF = function () {
                    this.mArmature = this.zGameMc.buildArmature(0); //不支持换装
                    this.addChild(this.mArmature);
                    this.mArmature.playbackRate(30 / MyClass.Config.playSpeedTrue);
                    this.mArmature.on(Event.STOPPED, this, this.completeHandler);
                    this.mArmature.on(Event.LABEL, this, this.onEvent);
                    //			var allLabel:int=mArmature.getAnimNum();
                    //			for(var i:int=0;i<allLabel;i++){
                    //				trace("index="+i,mArmature.getAniNameByIndex(i));
                    //			}
                };
                MyZMovieClip.prototype.onEvent = function (e) {
                    //			trace(mArmature.index,	mArmature.player.currentPlayTime);return;
                    var tEventData = e;
                    console.log("spine动画收到Label事件：", tEventData);
                };
                MyZMovieClip.prototype.completeHandler = function () {
                    console.log("completeHandler");
                    this.isComplete = true;
                    Tool_Function.onRunFunction(this.completeFunction);
                };
                MyZMovieClip.prototype.play = function (rePlayChildMovie) {
                    if (rePlayChildMovie === void 0) { rePlayChildMovie = true; }
                    if (this.nowLabel == null) {
                        console.log(this.Name + "：spine：play失败，不应该没有label直接播放");
                        return;
                    }
                    this.nowFrame = -1;
                    this.mArmature.resume();
                };
                MyZMovieClip.prototype.gotoAndPlay = function (frame, rePlayChildMovie) {
                    if (rePlayChildMovie === void 0) { rePlayChildMovie = false; }
                    if (typeof frame == "string") {
                        this.gotoAndPlayLable(frame);
                    }
                    else {
                        if (this.nowLabel == null) {
                            console.log(this.Name + "：spine：play失败，不应该没有label直接播放");
                            return;
                        }
                        try {
                            this.mArmature.index = frame;
                        }
                        catch (e) {
                            console.log(this.Name + "：spine：gotoAndPlay失败：" + e.message);
                            return;
                        }
                        this.play();
                    }
                };
                MyZMovieClip.prototype.gotoAndPlayLable = function (label) {
                    if (typeof label == "number") {
                        label = this.mArmature.getAniNameByIndex(label);
                    }
                    var allLabel = this.mArmature.getAnimNum();
                    for (var i = 0; i < allLabel; i++) {
                        if (label == this.mArmature.getAniNameByIndex(i)) {
                            this.nowLabel = label;
                            this.nowFrame = -1;
                            this.mArmature.play(label, this.loop, true);
                            return;
                        }
                    }
                    console.log("spine动画播放label：" + label + "：失败");
                };
                MyZMovieClip.prototype.gotoAndStop = function (frame, stopChild) {
                    if (stopChild === void 0) { stopChild = false; }
                    if (this.zGameMc) {
                        this.countMoreFrame = 0;
                        this.mArmature.index = frame;
                        this.nowFrame = frame;
                        while (this.mArmature.index < frame) {
                            this.countMoreFrame++;
                            if (frame + this.countMoreFrame < this.mArmature.total) {
                                this.mArmature.index = frame + this.countMoreFrame;
                                if (this.mArmature.index > this.nowFrame) {
                                    this.nowFrame = this.mArmature.index;
                                }
                            }
                            else {
                                break;
                            }
                        }
                    }
                };
                MyZMovieClip.prototype.gotoAndStopLable = function (label) {
                    this.isComplete = false;
                    this.nowLabel = label;
                    var allLabel = this.mArmature.getAnimNum();
                    for (var i = 0; i < allLabel; i++) {
                        if (label == this.mArmature.getAniNameByIndex(i)) {
                            this.mArmature.play(i, this.loop);
                            this.mArmature.index = 0;
                            this.nowFrame = -1;
                            return;
                        }
                    }
                    console.log("spine动画播放label：" + label + "：失败");
                };
                MyZMovieClip.prototype.stop = function (stopChild) {
                    if (stopChild === void 0) { stopChild = false; }
                    if (this.zGameMc) {
                        this.mArmature.stop();
                    }
                };
                MyZMovieClip.prototype.pauseF = function () {
                    this.stop();
                };
                MyZMovieClip.prototype.resumeF = function () {
                    this.mArmature.resume();
                };
                Object.defineProperty(MyZMovieClip.prototype, "totalFrames", {
                    get: function () {
                        if (this.zGameMc) {
                            return this.mArmature.total;
                        }
                        return 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyZMovieClip.prototype, "currentFrame", {
                    get: function () {
                        if (this.zGameMc) {
                            if (this.mArmature.index < this.nowFrame && this.nowFrame >= 0) {
                                return this.nowFrame;
                            }
                            return this.mArmature.index;
                        }
                        return 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyZMovieClip.prototype, "loop", {
                    get: function () {
                        return this._loop;
                    },
                    set: function (real) {
                        this._loop = real;
                    },
                    enumerable: true,
                    configurable: true
                });
                MyZMovieClip.prototype.destroyF = function () {
                    MyView.MyMC.removeF(this);
                    this.completeFunction = null;
                    if (this.mArmature) {
                        this.mArmature.destroy();
                        this.mArmature = null;
                    }
                    if (this.zGameMc) {
                        if (MyZMovieClip.dicTemplet[this.URL]) {
                            if (--MyZMovieClip.dicTemplet[this.URL]["num"] <= 0) {
                                this.zGameMc.destroy();
                                MyZMovieClip.dicTemplet[this.URL] = null;
                            }
                        }
                        this.zGameMc = null;
                    }
                    this.destroy();
                };
                return MyZMovieClip;
            }(com.MyClass.MySwf.SwfSprite));
            MyView.MyZMovieClip = MyZMovieClip;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyZMovieClip.js.map