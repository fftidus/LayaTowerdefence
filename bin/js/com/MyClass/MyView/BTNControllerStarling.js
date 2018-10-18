var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var SwfMovieClip = com.MyClass.MySwf.SwfMovieClip;
            var BTNControllerStarling = /** @class */ (function () {
                function BTNControllerStarling(L, arr, Fclick, Fdown, Fup, fnone) {
                    if (Fdown === void 0) { Fdown = null; }
                    if (Fup === void 0) { Fup = null; }
                    if (fnone === void 0) { fnone = null; }
                    this.Arr_Btn = [];
                    this.Arr_Mc = [];
                    this.Arr_BtnXY = [];
                    this.Arr_Fun = [];
                    this.now = -1;
                    this.down = 0;
                    this.pause = false;
                    this.typeEventMop = null; //null:普通冒泡，“禁止”：不冒泡，“触发禁止”：自身有事件就不冒泡
                    this.MinSlideLength = 2;
                    this.canSlide = true;
                    this.canSlideAndSelect = true;
                    this.autoClear = false;
                    this.canMouseSlide = false;
                    this.autoChangeFrame = true;
                    this.Layer = L;
                    MyClass.Tools.Tool_Function.onTouchable(this.Layer);
                    this.FunClick = Fclick;
                    this.FunDown = Fdown;
                    this.FunUp = Fup;
                    this.FunClickNone = fnone;
                    if (this.FunClick)
                        this.FunClick.once = false;
                    if (this.FunDown)
                        this.FunDown.once = false;
                    if (this.FunUp)
                        this.FunUp.once = false;
                    if (this.FunClickNone)
                        this.FunClickNone.once = false;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == null)
                            continue;
                        this.Arr_BtnXY[i] = [0, 0];
                        var tmp = arr[i].parent;
                        while (L != tmp && tmp != null) {
                            this.Arr_BtnXY[i][0] += tmp.x;
                            this.Arr_BtnXY[i][1] += tmp.y;
                            tmp = tmp.parent;
                        }
                        if (arr[i] instanceof MyView.BTN_Starling) {
                            this.Arr_Btn[i] = arr[i];
                        }
                        else if (arr[i] instanceof SwfMovieClip) {
                            if (this.Layer) {
                                arr[i].gotoAndStop(0);
                            }
                            var b = new MyView.BTN_Virtual(0, [arr[i]]);
                            this.Arr_Btn[i] = b;
                            this.Arr_Mc[i] = [arr[i], arr[i].totalFrames];
                        }
                        else if (arr[i] instanceof MyView.BTN_Virtual) {
                            b = arr[i];
                            this.Arr_Btn[i] = b;
                            this.Arr_Mc[i] = [arr[i], arr[i].totalFrames];
                        }
                        else {
                            if (arr[i] instanceof Array)
                                b = new MyView.BTN_Virtual(0, arr[i]);
                            else
                                b = new MyView.BTN_Virtual(0, [arr[i]]);
                            this.Arr_Btn[i] = b;
                            if (MyClass.Tools.Tool_ObjUtils.hasFunction(arr[i], "setFrame") == true)
                                this.Arr_Fun[i] = arr[i].setFrame;
                        }
                    }
                    if (this.Layer) {
                        this.mme = new MyView.MyMouseEventStarling(this.Layer);
                        this.mme.setValue("down事件", laya.utils.Handler.create(this, this.onDownF));
                        this.mme.setValue("up事件", laya.utils.Handler.create(this, this.onUPF));
                        this.mme.setValue("滑动", laya.utils.Handler.create(this, this.onSlideF));
                    }
                }
                BTNControllerStarling.prototype.setValue = function (str, val) {
                    // this[str]=val;
                };
                BTNControllerStarling.prototype.getValue = function (want) {
                    // return this[want];
                };
                BTNControllerStarling.prototype.onSlideF = function (dic) {
                    if (this.pause == true)
                        return;
                    if (this.down == 0)
                        return;
                    var p = this.mme.nowLocalXY;
                    var now2;
                    if (this.canSlide == false) {
                        var l = Math.sqrt(Math.pow(p.x - this.startX, 2) + Math.pow(p.y - this.startY, 2));
                        if (l > this.MinSlideLength) {
                            this.onUPF(null);
                            return;
                        }
                    }
                    now2 = this.checkIn(p.x, p.y);
                    if (now2 >= 0 && now2 != this.now) {
                        //滑动到别的按钮上
                        if (this.canSlideAndSelect == false) {
                            if (this.now != -1) {
                                if (this.FunUp != null)
                                    MyClass.Tools.Tool_Function.onRunFunction(this.FunUp, this.now);
                                this.changeFrame(this.now, 1);
                            }
                            this.now = -1;
                            this.down = 0;
                        }
                        else {
                            if (this.now != -1) {
                                if (this.FunUp != null)
                                    MyClass.Tools.Tool_Function.onRunFunction(this.FunUp, this.now);
                                this.changeFrame(this.now, 1);
                            }
                            this.down = 1;
                            this.changeFrame(now2, 2);
                            this.now = now2;
                            if (this.FunDown != null) {
                                MyClass.Tools.Tool_Function.onRunFunction(this.FunDown, this.now);
                            }
                        }
                    }
                    else if (now2 == -1 && this.now != -1) {
                        //滑动到空白处
                        if (this.FunUp != null)
                            MyClass.Tools.Tool_Function.onRunFunction(this.FunUp, this.now);
                        this.changeFrame(this.now, 1);
                        this.now = -1;
                        this.down++;
                    }
                };
                BTNControllerStarling.prototype.onDownF = function (p) {
                    if (this.down > 0)
                        return;
                    this.now = this.checkIn(p.x, p.y);
                    if (this.now >= 0) {
                        this.down = 1;
                        this.changeFrame(this.now, 2);
                        if (this.FunDown != null) {
                            MyClass.Tools.Tool_Function.onRunFunction(this.FunDown, this.now);
                        }
                        this.startX = p.x;
                        this.startY = p.y;
                    }
                };
                BTNControllerStarling.prototype.onUPF = function (p) {
                    if (this.down > 0) {
                        if (this.now != -1) {
                            this.changeFrame(this.now, 1);
                            if (p) {
                                if (this.FunUp != null)
                                    MyClass.Tools.Tool_Function.onRunFunction(this.FunUp, this.now);
                                if (this.FunClick && this.down == 1)
                                    MyClass.Tools.Tool_Function.onRunFunction(this.FunClick, this.now);
                            }
                            this.now = -1;
                        }
                        else if (this.FunClickNone != null && p)
                            MyClass.Tools.Tool_Function.onRunFunction(this.FunClickNone);
                        this.down = 0;
                    }
                    else if (this.FunClickNone != null && p) {
                        MyClass.Tools.Tool_Function.onRunFunction(this.FunClickNone);
                    }
                };
                BTNControllerStarling.prototype.checkIn = function (lx, ly) {
                    for (var i = 0; i < this.Arr_Btn.length; i++) {
                        if (this.Arr_Btn[i] == null)
                            continue;
                        if (this.Arr_Mc[i] && this.Arr_Mc[i][0].visible == false)
                            continue;
                        if (this.Arr_Btn[i].checkIn(lx - this.Arr_BtnXY[i][0], ly - this.Arr_BtnXY[i][1]) == true)
                            return i;
                    }
                    return -1;
                };
                BTNControllerStarling.prototype.changeFrame = function (num, f) {
                    if (this.autoChangeFrame == false || this.Arr_Btn == null)
                        return;
                    if (num >= 0) {
                        if (this.Arr_Btn[num] instanceof MyView.BTN_Starling)
                            this.Arr_Btn[num].onChangeFrame(f);
                        else {
                            if (this.Arr_Mc[num] != null) {
                                f--;
                                if (f >= this.Arr_Mc[num][1])
                                    f = 0;
                                this.Arr_Mc[num][0].gotoAndStop(f);
                            }
                            else if (this.Arr_Fun[num] != null) {
                                MyClass.Tools.Tool_Function.onRunFunction(this.Arr_Fun[num], f);
                            }
                        }
                    }
                };
                BTNControllerStarling.prototype.pauseF = function (b) {
                    this.pause = b;
                    this.stopF();
                };
                BTNControllerStarling.prototype.removeIndex = function (n) {
                    this.Arr_Btn.splice(n, 1);
                    this.Arr_Mc.splice(n, 1);
                };
                BTNControllerStarling.prototype.stopF = function () {
                    if (this.down > 0) {
                        this.down = 0;
                        this.changeFrame(this.now, 1);
                        this.now = -1;
                    }
                };
                BTNControllerStarling.prototype.destroyF = function () {
                    this.mme = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mme);
                    if (this.Layer) {
                        if (this.autoClear)
                            this.Layer = MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Layer);
                        else
                            this.Layer = null;
                    }
                    if (this.autoClear) {
                        this.Arr_Btn = MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Arr_Btn);
                    }
                    else
                        this.Arr_Btn = null;
                    if (this.FunClick) {
                        this.FunClick.clear();
                        this.FunClick = null;
                    }
                    if (this.FunDown) {
                        this.FunDown.clear();
                        this.FunDown = null;
                    }
                    if (this.FunUp) {
                        this.FunUp.clear();
                        this.FunUp = null;
                    }
                    if (this.FunClickNone) {
                        this.FunClickNone.clear();
                        this.FunClickNone = null;
                    }
                };
                return BTNControllerStarling;
            }());
            MyView.BTNControllerStarling = BTNControllerStarling;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=BTNControllerStarling.js.map