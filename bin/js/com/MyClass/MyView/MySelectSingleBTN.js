var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var Handler = laya.utils.Handler;
            var Sprite = starling.Sprite;
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var MySelectSingleBTN = /** @class */ (function () {
                function MySelectSingleBTN(spr, fchange, id, canMulti, vtype) {
                    if (canMulti === void 0) { canMulti = false; }
                    if (vtype === void 0) { vtype = 0; }
                    this.Now = -1;
                    this.Busy = false;
                    //多选
                    this.canMulti = false;
                    this.ID = id;
                    this.FunChange = fchange;
                    this.FunChange.once = false;
                    this.Spr = spr;
                    this.canMulti = canMulti;
                    this.funValueType = vtype;
                    if (this.canMulti == true)
                        this.Dic_Down = {};
                }
                MySelectSingleBTN.creatBtnFromSprite = function (spr, fchange, id, strFront, canMulti, vType) {
                    if (id === void 0) { id = null; }
                    if (strFront === void 0) { strFront = "btn_"; }
                    if (canMulti === void 0) { canMulti = false; }
                    if (vType === void 0) { vType = this.ValueType_ArrayIndex; }
                    var Arr = this.getArrFromSpr(spr, strFront, vType == this.ValueType_ArrayIndex);
                    var mbtn = new MySelectSingleBTN(spr, fchange, id, canMulti, vType);
                    mbtn.initF(Arr);
                    return mbtn;
                };
                MySelectSingleBTN.getArrFromSpr = function (spr, strFront, isArrayIndex) {
                    if (strFront === void 0) { strFront = "btn_"; }
                    if (isArrayIndex === void 0) { isArrayIndex = false; }
                    var Arr = [];
                    var dicName = {};
                    for (var i = 0; i < spr.numChildren; i++) {
                        var child = spr.getChildAt(i);
                        if (child instanceof com.MyClass.MySwf.SwfMovieClip && child.name.indexOf(strFront) == 0) {
                            var btn = new MyView.BTN_Starling(child);
                            btn.onChangeFrame(MyView.BTN_Starling.Frame_Nor);
                            if (isArrayIndex) {
                                var index = Tool_Function.onForceConvertType(child.name.substr(4));
                                Arr[index] = btn;
                                dicName[index] = child.name;
                            }
                            else {
                                Arr.push(btn);
                                dicName[Arr.length - 1] = child.name;
                            }
                        }
                    }
                    return [Arr, dicName];
                };
                MySelectSingleBTN.creatBtnFromArr = function (spr, Arr, fchange, id, canMulti) {
                    if (id === void 0) { id = null; }
                    if (canMulti === void 0) { canMulti = false; }
                    //只能用数组位置方式
                    for (var i = 0; i < Arr.length; i++) {
                        if (Arr[i] == null)
                            continue;
                        if (Arr[i] instanceof MyView.BTN_Starling)
                            continue;
                        Arr[i] = new MyView.BTN_Starling(Arr[i]);
                    }
                    var mbtn = new MySelectSingleBTN(spr, fchange, id, canMulti);
                    mbtn.initF([Arr]);
                    return mbtn;
                };
                MySelectSingleBTN.prototype.initF = function (arr) {
                    this.Arr = arr[0];
                    this.DicName = arr[1];
                    if (this.Arr == null)
                        return;
                    if (this.Arr.length == 0) {
                        if (this.Spr instanceof com.MyClass.MySwf.SwfMovieClip) { //自己就是一个sbtn
                            this.canMulti = true; //为true才能取消
                            this.Dic_Down = {};
                            this.Btn = new MyView.BTN_Starling(this.Spr);
                            this.Btn.initTouch(null, null, Handler.create(this, this.clickF, [0], false));
                            this.Arr[0] = this.Btn;
                        }
                        return;
                    }
                    //子界面：V_name
                    if (this.DicName) {
                        for (var n in this.DicName) {
                            this.Arr[n].name = this.DicName[n];
                            var tmp = this.Spr.getChildByName("V_" + this.DicName[n].substr(4));
                            if (tmp) {
                                if (this.infoSecond == null) {
                                    this.infoSecond = { "index": 999 };
                                }
                                this.infoSecond[n] = { "x": tmp.x, "y": tmp.y, "swf": tmp.swfName, "url": tmp.classLink, "sx": tmp.scaleX, "sy": tmp.scaleY };
                                var index = this.Spr.getChildIndex(tmp);
                                if (index < this.infoSecond["index"]) {
                                    this.infoSecond["index"] = index;
                                }
                                tmp = Tool_ObjUtils.destroyF_One(tmp);
                            }
                        }
                    }
                    //--------------------
                    this.BC = new MyView.BTNControllerStarling(this.Spr, this.Arr, Handler.create(this, this.clickF, null, false), null, null);
                    this.BC.autoChangeFrame = false;
                    // this.BC.EventMopType=BTNControllerStarling.Event_ActAndStopMop;
                    //判断滑动区域
                    var tmpL = this.Spr.getChildByName("_area");
                    if (tmpL == null)
                        return;
                    var meta;
                    if (this.Spr instanceof com.MyClass.MySwf.SwfSprite && this.Spr.spriteData[0] instanceof Array == false)
                        meta = this.Spr.spriteData[0];
                    if (meta == null)
                        return;
                    this.BC = Tool_ObjUtils.destroyF_One(this.BC);
                    var layer = new Sprite();
                    this.Spr.addChild(layer);
                    for (var i = 0; i < this.Arr.length; i++) {
                        if (this.Arr[i])
                            layer.addChild(this.Arr[i]);
                    }
                    this.BC = new MyView.BTNControllerStarling(layer, this.Arr, Handler.create(this, this.clickF), null, null);
                    this.BC.autoChangeFrame = false;
                    // this.BC.EventMopType=BTNControllerStarling.Event_ActAndStopMop;
                    var canx = meta["方向"] == "x";
                    var cany = !canx;
                    var slideType = meta["边界"] ? meta["边界"] : "mid";
                    this.McSlide = new MyView.MySlideMC(layer, canx, cany, new laya.maths.Rectangle(tmpL.x, tmpL.y, tmpL.width, tmpL.height), slideType);
                    this.McSlide.BC2 = this.BC;
                    if (meta["透明区域"])
                        this.McSlide.setValue("透明图", tmpL);
                    else
                        tmpL.removeFromParent(true);
                    if (canx == true) {
                        addCanSlide("左");
                        addCanSlide("右");
                    }
                    if (cany == true) {
                        addCanSlide("上");
                        addCanSlide("下");
                    }
                    if (this.DicCanSlideFlagmc)
                        this.McSlide.setValue("移动事件", onSlideF);
                    function addCanSlide(dir) {
                        var mc = this.Spr.getChildByName("_可滑动" + dir);
                        if (mc == null)
                            return;
                        if (this.DicCanSlideFlagmc == null)
                            this.DicCanSlideFlagmc = {};
                        mc.touchable = false;
                        this.Spr.addChild(mc);
                        this.DicCanSlideFlagmc[dir] = mc;
                    }
                    function onSlideF() {
                        if (this.McSlide.Layer.y < this.McSlide.maxY) {
                            if (this.DicCanSlideFlagmc["上"])
                                this.DicCanSlideFlagmc["上"].visible = true;
                        }
                        else {
                            if (this.DicCanSlideFlagmc["上"])
                                this.DicCanSlideFlagmc["上"].visible = false;
                        }
                        if (this.McSlide.Layer.y > this.McSlide.minY) {
                            if (this.DicCanSlideFlagmc["下"])
                                this.DicCanSlideFlagmc["下"].visible = true;
                        }
                        else {
                            if (this.DicCanSlideFlagmc["下"])
                                this.DicCanSlideFlagmc["下"].visible = false;
                        }
                    }
                };
                MySelectSingleBTN.prototype.clickNameF = function (Name) {
                    if (this.Busy)
                        return;
                    for (var n in this.DicName) {
                        if (this.DicName[n] == Name) {
                            this.clickF(Tool_Function.onForceConvertType(n));
                            return;
                        }
                    }
                };
                MySelectSingleBTN.prototype.clickF = function (n) {
                    if (this.Busy)
                        return;
                    if (this.Arr == null) {
                        if (this.Spr)
                            this.initF(MySelectSingleBTN.getArrFromSpr(this.Spr, "btn_", this.funValueType == MySelectSingleBTN.ValueType_ArrayIndex));
                    }
                    if (this.canMulti == false) {
                        if (n == this.Now)
                            return;
                        if (this.Now >= 0)
                            this.setFrame(this.Now, MyView.BTN_Starling.Frame_Nor);
                        this.Now = n;
                        this.setFrame(this.Now, MyView.BTN_Starling.Frame_Selected);
                        this.onShowSecond();
                    }
                    else {
                        if (this.Dic_Down[n] == true)
                            this.setNow(n, false);
                        else
                            this.setNow(n, true);
                    }
                    if (this.FunChange) {
                        var val;
                        if (this.funValueType == MySelectSingleBTN.ValueType_Name && this.DicName[n])
                            val = this.DicName[n];
                        else
                            val = n;
                        if (this.Arr.length == 1) { //只有一个，参数传boolean
                            val = this.Dic_Down[n];
                        }
                        if (this.ID == -1 || this.ID == null)
                            this.FunChange.runWith(val);
                        else
                            this.FunChange.runWith([this.ID, val]);
                    }
                };
                MySelectSingleBTN.prototype.getNow = function (now) {
                    if (now === void 0) { now = -1; }
                    if (this.canMulti == false)
                        return this.Now;
                    return this.Dic_Down[now];
                };
                MySelectSingleBTN.prototype.getNowName = function () {
                    if (this.canMulti == false)
                        return this.DicName[this.Now];
                    return null; //多选时没有此操作
                };
                MySelectSingleBTN.prototype.setNow = function (_now, on) {
                    if (on === void 0) { on = true; }
                    var po = -1;
                    if (typeof _now == "string") {
                        for (var n in this.DicName) {
                            if (this.DicName[n] == _now) {
                                po = Tool_Function.onForceConvertType(n);
                                break;
                            }
                        }
                    }
                    else {
                        po = _now;
                    }
                    if (po == -1)
                        return;
                    if (this.canMulti == false) {
                        if (po == this.Now)
                            return;
                        if (this.Now >= 0)
                            this.setFrame(this.Now, MyView.BTN_Starling.Frame_Nor);
                        this.Now = po;
                        this.setFrame(this.Now, MyView.BTN_Starling.Frame_Selected);
                        this.onShowSecond();
                    }
                    else {
                        if (po == -1) {
                            for (var key in this.Dic_Down) {
                                if (this.Dic_Down[key] == on)
                                    continue;
                                this.Dic_Down[key] = on;
                                if (on == true)
                                    this.setFrame(Tool_Function.onForceConvertType(key), MyView.BTN_Starling.Frame_Selected);
                                else
                                    this.setFrame(Tool_Function.onForceConvertType(key), MyView.BTN_Starling.Frame_Nor);
                            }
                        }
                        else {
                            if (this.Dic_Down[po] == on)
                                return;
                            this.Dic_Down[po] = on;
                            if (on == true)
                                this.setFrame(po, MyView.BTN_Starling.Frame_Selected);
                            else
                                this.setFrame(po, MyView.BTN_Starling.Frame_Nor);
                        }
                    }
                };
                MySelectSingleBTN.prototype.getBTN_by_Name = function (str) {
                    if (this.DicName == null)
                        return null;
                    for (var po in this.DicName) {
                        if (this.DicName[po] == str)
                            return this.Arr[Tool_Function.onForceConvertType(po)];
                    }
                    return null;
                };
                MySelectSingleBTN.prototype.onShowSecond = function () {
                    this.sprSecond = Tool_ObjUtils.destroyF_One(this.sprSecond);
                    if (this.infoSecond && this.infoSecond[this.Now]) {
                        this.sprSecond = MyClass.MySourceManager.getInstance().getSprFromSwf(this.infoSecond[this.Now]["swf"], this.infoSecond[this.Now]["url"]);
                        if (this.sprSecond) {
                            this.sprSecond.x = this.infoSecond[this.Now].x;
                            this.sprSecond.y = this.infoSecond[this.Now].y;
                            this.sprSecond.scaleX = this.infoSecond[this.Now].sx;
                            this.sprSecond.scaleY = this.infoSecond[this.Now].sy;
                            this.Spr.addChildAt(this.sprSecond, this.infoSecond["index"]);
                        }
                    }
                };
                MySelectSingleBTN.prototype.setFrame = function (n, f) {
                    if (this.Arr && this.Arr[n]) {
                        this.Arr[n].onChangeFrame(f);
                    }
                };
                MySelectSingleBTN.prototype.destroyF = function () {
                    this.Spr = Tool_ObjUtils.destroyF_One(this.Spr);
                    this.BC = Tool_ObjUtils.destroyF_One(this.BC);
                    this.Arr = Tool_ObjUtils.destroyF_One(this.Arr);
                    this.McSlide = Tool_ObjUtils.destroyF_One(this.McSlide);
                    this.DicCanSlideFlagmc = Tool_ObjUtils.destroyF_One(this.DicCanSlideFlagmc);
                    this.sprSecond = Tool_ObjUtils.destroyF_One(this.sprSecond);
                    if (this.FunChange) {
                        this.FunChange.clear();
                        this.FunChange = null;
                    }
                };
                MySelectSingleBTN.ValueType_ArrayIndex = 0;
                MySelectSingleBTN.ValueType_Name = 1;
                return MySelectSingleBTN;
            }());
            MyView.MySelectSingleBTN = MySelectSingleBTN;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MySelectSingleBTN.js.map