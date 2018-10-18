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
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var Swf = com.MyClass.MySwf.SWF;
            var Handler = laya.utils.Handler;
            var Tool_Object = com.MyClass.Tools.Tool_ObjUtils;
            var SwfMovieClip = /** @class */ (function (_super) {
                __extends(SwfMovieClip, _super);
                function SwfMovieClip(frames, labels, displayObjects, ownerSwf) {
                    var _this = _super.call(this) || this;
                    _this._isPlay = false;
                    _this._loop = true;
                    _this._complete = null; //播放完毕的回调
                    _this._hasCompleteListener = false; //是否监听过播放完毕的事件
                    _this.numMC = 0;
                    _this.needUpdateEveryFrame = false;
                    _this.pastTime = 0;
                    if (SwfMovieClip.TimeFrame <= 0)
                        SwfMovieClip.TimeFrame = 1000 / SwfMovieClip.FPS_default;
                    _this.touchable = false;
                    _this._frames = frames;
                    _this._labels = labels;
                    _this._displayObjects = displayObjects;
                    _this._startFrame = 0;
                    _this._endFrame = _this._frames.length - 1;
                    _this._ownerSwf = ownerSwf;
                    _this.fps = SwfMovieClip.FPS_default;
                    _this.currentFrame = 0;
                    var k;
                    var arr;
                    var l;
                    for (k in _this._displayObjects) {
                        if (k.indexOf(Swf.dataKey_MovieClip) == 0) {
                            arr = _this._displayObjects[k];
                            if (arr == null)
                                continue;
                            l = arr.length;
                            for (var i = 0; i < l; i++) {
                                _this.numMC++;
                            }
                        }
                    }
                    _this.play();
                    return _this;
                }
                SwfMovieClip.prototype.onCashSameFrameInfo = function (obj) {
                    for (var f in obj) {
                        this._frames[f] = null;
                    }
                };
                SwfMovieClip.prototype._frameLoop = function () {
                    if (!this._isPlay) {
                        return;
                    }
                    this.pastTime += SwfMovieClip.TimeFrame;
                    var f2 = Tool_Function.onChangeInstance(this.pastTime / this.NeedTime);
                    while (f2 > 0) {
                        if (this._ownerSwf == null) {
                            return;
                        }
                        this.nextFrame();
                        f2--;
                        this.pastTime -= this.NeedTime;
                    }
                };
                SwfMovieClip.prototype.nextFrame = function () {
                    if (this._ownerSwf == null)
                        return;
                    if (this._currentFrame >= this._endFrame) {
                        var isReturn = false;
                        if (!this._loop || this._startFrame == this._endFrame) { //只有一帧就不要循环下去了
                            if (this._ownerSwf)
                                this.stop(false);
                            isReturn = true;
                        }
                        if (this._complete) {
                            Tool_Function.onRunFunction(this.completeFunction, this);
                            this.completeFunction = null;
                        }
                        if (isReturn)
                            return;
                        this._currentFrame = this._startFrame;
                    }
                    else {
                        this._currentFrame++;
                    }
                    this.currentFrame = this._currentFrame;
                    if (this._currentFrame >= this._endFrame) {
                        if (!this._loop || this._startFrame == this._endFrame) { //只有一帧就不要循环下去了
                            if (this._ownerSwf)
                                this.stop(false);
                            if (this._complete) {
                                Tool_Function.onRunFunction(this.completeFunction, this);
                                this.completeFunction = null;
                            }
                        }
                    }
                };
                /**
                 * 删除所有该链接的元件
                 * */
                SwfMovieClip.prototype.removeChildFromAllFrame = function (_classLink) {
                    var length = this._frames.length;
                    for (var i = 0; i < length; i++) {
                        var frameInfos2 = this._frames[i];
                        if (frameInfos2 == null)
                            continue;
                        for (var j = 0; j < frameInfos2.length; j++) {
                            this.data = frameInfos2[j];
                            if (this.data instanceof Array == false) {
                                if (this.data["url"] == _classLink) {
                                    frameInfos2.splice(j--, 1);
                                }
                            }
                        }
                    }
                };
                /**
                 * 获得某一帧上某个name的元件
                 * */
                SwfMovieClip.prototype.getChildByName_onFrame = function (_name, f) {
                    if (this._frames[f] == null)
                        return null;
                    var frameInfos2 = this._frames[f];
                    for (var j = 0; j < frameInfos2.length; j++) {
                        this.data = frameInfos2[j];
                        if (this.data instanceof Array == false) {
                            if (this.data["name"] == _name) {
                                var display;
                                if (this._displayObjects)
                                    display = this._displayObjects[this.data["url"]][this.data["index"]];
                                return display;
                            }
                        }
                    }
                    return null;
                };
                Object.defineProperty(SwfMovieClip.prototype, "currentFrame", {
                    get: function () {
                        return this._currentFrame;
                    },
                    /** 设置/获取 当前帧数 */
                    set: function (frame) {
                        this._currentFrame = frame;
                        this.__frameInfos = this._frames[this._currentFrame];
                        if (this.frameFunction)
                            Tool_Function.onRunFunction(this.frameFunction);
                        if (this.__frameInfos == null || this._ownerSwf == null)
                            return;
                        this.onSetCurrentFrame();
                    },
                    enumerable: true,
                    configurable: true
                });
                SwfMovieClip.prototype.onSetCurrentFrame = function () {
                    if (this._displayObjects)
                        this.clearChild();
                    else
                        this.clearChild(true);
                    var data;
                    var display;
                    var useIndex;
                    var length = this.__frameInfos.length;
                    for (var i = 0; i < length; i++) {
                        data = this.__frameInfos[i];
                        useIndex = data["index"];
                        if (data["type"] == MySwf.SWF.dataKey_Particle) {
                            var pd = this._displayObjects[data["url"]][useIndex];
                            pd.emitter._particleTemplate.x = data.x;
                            pd.emitter._particleTemplate.y = data.y;
                            pd.alpha = data["alpha"];
                            pd.name = data["name"];
                            pd.emitter.emit();
                            this.addChild(pd);
                            continue;
                        }
                        if (this._displayObjects) {
                            display = this._displayObjects[data["url"]][useIndex];
                        }
                        if (display == null) {
                            if (data["type"] == "text")
                                display = this._ownerSwf.createTextField(data);
                            else
                                display = this._ownerSwf.getObject(data["url"]);
                            if (display && this._displayObjects) {
                                this._displayObjects[data["url"]][useIndex] = display;
                            }
                        }
                        if (display == null || (this.dicRemoved != null && this.dicRemoved[display] == true))
                            continue;
                        this._ownerSwf.onCheckDataForFilterAndColor(display, data);
                        display.alpha = data["alpha"];
                        display.name = data["name"];
                        display.x = data["x"];
                        display.y = data["y"];
                        // display.skewX = data["skewx"] * SwfMovieClip.ANGLE_TO_RADIAN;
                        // display.skewY = data["skewy"] * SwfMovieClip.ANGLE_TO_RADIAN;
                        if (display.getStyle() != null && display.getStyle()._tf != null) {
                            display.skewX = -data["skewx"];
                            display.skewY = data["skewy"];
                        }
                        if (this.touchable == true) {
                            display.touchable = true;
                            if (display.mouseEnabled == false) {
                                display.mouseEnabled = true;
                            }
                        }
                        switch (data["type"]) {
                            case Swf.dataKey_Scale9:
                                display.width = data["w"];
                                display.height = data["h"];
                                MySwf.SWF.setBlendMode(display, data["blend"]);
                                if (data["color"] != null) {
                                    MySwf.SWF.changeColor(display, data["color"]);
                                }
                                this.addChild(display);
                                break;
                            case Swf.dataKey_TextField:
                                var tx = display;
                                if (tx.isCleared == true)
                                    break;
                                tx.width = data["w"];
                                tx.height = data["h"];
                                tx.format.font = data["font"];
                                tx.format.color = data["color"];
                                tx.format.size = data["size"];
                                tx.format.horizontalAlign = data["align"];
                                tx.format.italic = data["italic"];
                                tx.format.bold = data["bold"];
                                if (tx.text != data["text"] && tx.text != "\r" && tx.text != "") { }
                                else if (data["text"] && data["text"] != "\r" && data["text"] != "") {
                                    tx.text = data["text"];
                                }
                                MySwf.SWF.setBlendMode(display, data["blend"]);
                                this.addChild(display);
                                break;
                            case Swf.dataKey_Image:
                                display.scaleX = data["sx"];
                                display.scaleY = data["sy"];
                                MySwf.SWF.setBlendMode(display, data["blend"]);
                                if (data["color"] != null) {
                                    MySwf.SWF.changeColor(display, data["color"]);
                                }
                                this.addChild(display);
                                break;
                            default:
                                display.scaleX = data["sx"];
                                display.scaleY = data["sy"];
                                MySwf.SWF.setBlendMode(display, data["blend"]);
                                if (data["color"] != null) {
                                    MySwf.SWF.changeColor(display, data["color"]);
                                }
                                this.addChild(display);
                                break;
                        }
                    }
                };
                /**
                 * 播放
                 * @param	rePlayChildMovie	子动画是否重新播放
                 * */
                SwfMovieClip.prototype.play = function (rePlayChildMovie) {
                    if (rePlayChildMovie === void 0) { rePlayChildMovie = true; }
                    this._isPlay = true;
                    if (this._currentFrame >= this._endFrame) {
                        this._currentFrame = this._startFrame;
                    }
                    if (this.funEnter == null)
                        this.funEnter = Handler.create(this, this._frameLoop, null, false);
                    MyClass.MainManager.getInstence().addEnterFrameFun(this.funEnter);
                    if (this.numMC == 0 || this._displayObjects == null)
                        return;
                    var k;
                    var arr;
                    var l;
                    for (k in this._displayObjects) {
                        if (k.indexOf(Swf.dataKey_MovieClip) == 0) {
                            arr = this._displayObjects[k];
                            if (arr == null)
                                continue;
                            l = arr.length;
                            for (var i = 0; i < l; i++) {
                                if (arr[i] == null || (arr[i] instanceof SwfMovieClip) == false)
                                    continue;
                                if (rePlayChildMovie)
                                    arr[i].currentFrame = 0;
                                arr[i].play(rePlayChildMovie);
                            }
                        }
                    }
                    this.needUpdateEveryFrame = rePlayChildMovie;
                };
                /**
                 * 停止
                 * @param	stopChild	是否停止子动画
                 * */
                SwfMovieClip.prototype.stop = function (stopChild) {
                    if (stopChild === void 0) { stopChild = false; }
                    this._isPlay = false;
                    this.pastTime = 0;
                    MyClass.MainManager.getInstence().removeEnterFrameFun(this.funEnter);
                    if (this.numMC == 0)
                        return;
                    var k;
                    var arr;
                    var l;
                    for (k in this._displayObjects) {
                        if (k.indexOf(Swf.dataKey_MovieClip) == 0) {
                            arr = this._displayObjects[k];
                            if (arr == null)
                                continue;
                            l = arr.length;
                            for (var i = 0; i < l; i++) {
                                if (arr[i] == null || (arr[i] instanceof SwfMovieClip) == false)
                                    continue;
                                if (stopChild == true)
                                    arr[i].stop(stopChild);
                                else
                                    arr[i].play();
                            }
                        }
                    }
                    this.needUpdateEveryFrame = !stopChild;
                };
                /**
                 * 移动当前帧位置并停止播放
                 * @param frame  帧数或标签,使用的是帧数则从该帧起至总帧数的播放范围,使用的是标签则播放范围是该标签所属的.
                 * @param stopChild  是否停止子动画
                 * */
                SwfMovieClip.prototype.gotoAndStop = function (frame, stopChild) {
                    if (stopChild === void 0) { stopChild = false; }
                    this.goTo(frame);
                    this.onCheckLastNotNullFrame();
                    this.stop(stopChild);
                };
                /**
                 * 移动当前帧位置并开始播放
                 * @param frame	 帧数或标签,使用的是帧数则从该帧起至总帧数的播放范围,使用的是标签则播放范围是该标签所属的.
                 * @param rePlayChildMovie  子动画是否重新播放
                 * */
                SwfMovieClip.prototype.gotoAndPlay = function (frame, rePlayChildMovie) {
                    if (rePlayChildMovie === void 0) { rePlayChildMovie = false; }
                    this.goTo(frame);
                    this.onCheckLastNotNullFrame();
                    this.play(rePlayChildMovie);
                };
                SwfMovieClip.prototype.onCheckLastNotNullFrame = function () {
                    var count = 0;
                    while (this.__frameInfos == null) {
                        if (this._currentFrame - count < 0) {
                            this.__frameInfos = this._frames[0];
                            break;
                        }
                        this.__frameInfos = this._frames[this._currentFrame - count];
                        count++;
                    }
                    this.onSetCurrentFrame();
                };
                /**
                 *  移动到起始帧,并确定播放范围
                 * @param frame 帧或标签
                 * */
                SwfMovieClip.prototype.goTo = function (frame) {
                    if (typeof frame == "string") {
                        var labelData = this.getLabelData(frame);
                        this._currentLabel = labelData[0];
                        this._currentFrame = this._startFrame = labelData[1];
                        this._endFrame = labelData[2];
                    }
                    else {
                        if (frame < 0)
                            frame = 0;
                        this._currentFrame = this._startFrame = frame;
                        this._endFrame = this._frames.length - 1;
                    }
                    this.currentFrame = this._currentFrame;
                };
                /**
                 * 获取标签信息
                 * @param label 标签名
                 * @return 返回[标签名,起始帧数,结束帧数]
                 * */
                SwfMovieClip.prototype.getLabelData = function (label) {
                    var length = this._labels.length;
                    var labelData;
                    for (var i = 0; i < length; i++) {
                        labelData = this._labels[i];
                        if (labelData[0] == label) {
                            return labelData;
                        }
                    }
                    return null;
                };
                Object.defineProperty(SwfMovieClip.prototype, "isPlay", {
                    /**
                     * 是否再播放
                     * */
                    get: function () {
                        return this._isPlay;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfMovieClip.prototype, "loop", {
                    /**
                     * 设置/获取 是否循环播放
                     * */
                    get: function () {
                        return this._loop;
                    },
                    set: function (value) {
                        this._loop = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfMovieClip.prototype, "completeFunction", {
                    get: function () {
                        return this._complete;
                    },
                    /**
                     * 设置播放完毕的回调
                     */
                    set: function (value) {
                        this._complete = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfMovieClip.prototype, "totalFrames", {
                    /**
                     * 总共有多少帧
                     * */
                    get: function () {
                        return this._frames.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfMovieClip.prototype, "currentLabel", {
                    /**
                     * 返回当前播放的是哪一个标签
                     * */
                    get: function () {
                        return this._currentLabel;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfMovieClip.prototype, "labels", {
                    /**
                     * 获取所有标签
                     * */
                    get: function () {
                        if (this._labelStrings != null)
                            return this._labelStrings;
                        this._labelStrings = [];
                        var length = this._labels.length;
                        for (var i = 0; i < length; i++) {
                            this._labelStrings.push(this._labels[i][0]);
                        }
                        return this._labelStrings;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * 是否包含某个标签
                 * */
                SwfMovieClip.prototype.hasLabel = function (label) {
                    return !(this.labels.indexOf(label) == -1);
                };
                Object.defineProperty(SwfMovieClip.prototype, "startFrame", {
                    get: function () {
                        return this._startFrame;
                    },
                    /** 设置/获取 开始播放的帧 */
                    set: function (value) {
                        this._startFrame = value < 0 ? 0 : value;
                        this._startFrame = this._startFrame > this._endFrame ? this._endFrame : this._startFrame;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SwfMovieClip.prototype, "endFrame", {
                    get: function () {
                        return this._endFrame;
                    },
                    /** 设置/获取 结束播放的帧 */
                    set: function (value) {
                        this._endFrame = value > this._frames.length - 1 ? this._frames.length - 1 : value;
                        this._endFrame = this._endFrame < this._startFrame ? this._startFrame : this._endFrame;
                    },
                    enumerable: true,
                    configurable: true
                });
                SwfMovieClip.prototype.removeChildF = function (child, dispose) {
                    if (dispose === void 0) { dispose = true; }
                    if (this.dicRemoved == null)
                        this.dicRemoved = {};
                    if (child instanceof String) {
                        child = this.getChildByName(child);
                    }
                    if (child != null) {
                        this.dicRemoved[child] = true;
                        this.removeChild(child);
                    }
                };
                SwfMovieClip.prototype.destroyF = function () {
                    this.dicRemoved = null;
                    this.frameFunction = Tool_Object.destroyF_One(this.frameFunction);
                    this.completeFunction = Tool_Object.destroyF_One(this.completeFunction);
                    if (this._displayObjects) {
                        for (var key in this._displayObjects) {
                            var array = this._displayObjects[key];
                            var len = array.length;
                            for (var i = 0; i < len; i++) {
                                if (array[i]) {
                                    array[i].removeFromParent(true);
                                }
                            }
                        }
                        this._displayObjects = null;
                    }
                    this._ownerSwf = null;
                    if (this._isPlay) {
                        this._isPlay = false;
                        MyClass.MainManager.getInstence().removeEnterFrameFun(this.funEnter);
                    }
                };
                Object.defineProperty(SwfMovieClip.prototype, "fps", {
                    get: function () { return this._fps; },
                    set: function (value) {
                        this._fps = value;
                        this.NeedTime = 1000 / this._fps;
                    },
                    enumerable: true,
                    configurable: true
                });
                SwfMovieClip.ANGLE_TO_RADIAN = Math.PI / 180;
                SwfMovieClip.FPS_default = 30;
                /** 每帧的时长 */
                SwfMovieClip.TimeFrame = 0;
                /** 预缓存的动画数量 */
                SwfMovieClip.CacheNumBegin = 9999999;
                return SwfMovieClip;
            }(MySwf.SwfSprite));
            MySwf.SwfMovieClip = SwfMovieClip;
        })(MySwf = MyClass.MySwf || (MyClass.MySwf = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=SwfMovieClip.js.map