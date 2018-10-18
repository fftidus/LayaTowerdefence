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
            var SwfImage = com.MyClass.MySwf.SwfImage;
            var SwfSprite = com.MyClass.MySwf.SwfSprite;
            var ImageNum = /** @class */ (function (_super) {
                __extends(ImageNum, _super);
                function ImageNum(fname, _swf) {
                    var _this = _super.call(this) || this;
                    _this.W = -1;
                    _this.Arr_Save = [];
                    _this.MidL = 0; //统一间隔
                    _this.vAlin = "左";
                    _this.MinL = -1; //最少位数，不足将补0
                    _this.Col = -1;
                    _this.tmpCol = -1;
                    _this.OnlyNumberColor = false;
                    _this.neetW_to_10000 = -1;
                    _this.Arr数字 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "."];
                    _this.SwfName = _swf;
                    if (_this.SwfName == null)
                        _this.SwfName = ImageNum.SWFDefault;
                    _this.FrontName = fname;
                    return _this;
                }
                ImageNum.prototype.addSource = function (arr) {
                    if (arr === void 0) { arr = null; }
                    if (arr == null)
                        arr = [];
                    arr.push([this.SwfName, "swf", "FrontSource/" + this.SwfName]);
                    return arr;
                };
                ImageNum.prototype.setValue = function (str, val) {
                    if (val === void 0) { val = null; }
                    switch (str) {
                        case "间隔":
                            this.MidL = val;
                            break;
                        case "对齐":
                            this.vAlin = val;
                            break;
                        case "最少位数":
                            this.MinL = val;
                            break;
                        case "颜色":
                            if (this.Col == val)
                                return;
                            this.Col = val;
                            for (var i = 0; i < this.Arr_Save.length; i++) {
                                if (this.OnlyNumberColor && this.Arr_Save[i][2] == true)
                                    continue;
                                if (this.Arr_Save[i][1])
                                    this.Arr_Save[i][1].color = this.Col;
                            }
                            break;
                        case "局部颜色":
                            tmpCol = val;
                            break;
                        case "颜色仅数字":
                            this.OnlyNumberColor = val;
                            if (this.Col != -1) {
                                var tmpCol = this.Col;
                                this.Col = -1;
                                this.setValue("颜色", tmpCol);
                            }
                            break;
                        case "父对象":
                            if (val instanceof SwfImage) {
                                val.parent.addChildAt(this, val.parent.getChildIndex(val));
                                val.parent.removeChild(val);
                                this.x = val.x;
                                this.y = val.y;
                                this.TypeOfParent = "img";
                            }
                            else if (val instanceof starling.Sprite) {
                                val.removeChildren();
                                val.addChild(this);
                                this.TypeOfParent = "spr";
                            }
                            break;
                        case "x":
                            if (this.TypeOfParent == "spr")
                                this.parent.x = val;
                            else
                                this.x = val;
                            break;
                        case "y":
                            if (this.TypeOfParent == "spr")
                                this.parent.y = val;
                            else
                                this.y = val;
                            break;
                        case "stage监听":
                            // this.addEventListener(Event.REMOVED_FROM_STAGE,onRemoveF);
                            this.once(laya.events.Event.REMOVED, this, this.onRemoveF);
                            break;
                        case "万":
                            this.neetW_to_10000 = val;
                            break;
                    }
                };
                ImageNum.prototype.showF = function (val) {
                    this.L = 0;
                    if (this.Layer == null) {
                        this.Layer = new SwfSprite();
                        this.addChild(this.Layer);
                        this.tm = MyClass.MySourceManager.getInstance();
                    }
                    else {
                        this.Layer.removeChildren();
                        this.clearSaveF();
                    }
                    if (val == null)
                        val = "";
                    else if (typeof (val) === "number" && this.neetW_to_10000 > 0 && val >= this.neetW_to_10000) {
                        val = MyClass.Tools.Tool_Function.onChangeInstance(val / 10000) + "万";
                    }
                    this.appendShowF(val);
                };
                ImageNum.prototype.appendShowF = function (val) {
                    this.NowStr = MyClass.Tools.Tool_Function.onChangeInstance(val, "str");
                    var x0 = this.L == 0 ? 0 : (this.L * this.W + (this.L - 1) * this.MidL);
                    this.L = this.NowStr.length;
                    if (this.L == 0)
                        return;
                    var more0 = -1;
                    if (this.L < this.MinL) {
                        more0 = this.MinL - this.L;
                        this.L = this.MinL;
                    }
                    for (var i = 0; i < this.L; i++) {
                        var char = this.NowStr.charAt(i);
                        if (more0-- >= 0)
                            char = "0";
                        if (char == ".")
                            char = "小数点";
                        var is数字 = true;
                        var img;
                        img = ImageNum.getCache(this.FrontName + char, this.SwfName);
                        if (img == null)
                            img = this.tm.getImgFromSwf(this.SwfName, "img_" + this.FrontName + "Num_" + char);
                        if (this.Arr数字.indexOf(char) == -1)
                            is数字 = false;
                        if (is数字 == false)
                            this.Arr_Save.push([char, img]);
                        else
                            this.Arr_Save.push([char, img, true]);
                        if (img) {
                            if (this.W == -1) {
                                var imgW = this.tm.getImgFromSwf(this.SwfName, "img_" + this.FrontName + "FrontWidth");
                                if (imgW == null) {
                                    if (img) {
                                        this.W = img.width + img.pivotX;
                                    }
                                }
                                else {
                                    this.W = imgW.width;
                                }
                            }
                            img.x = x0 + i * this.W + this.MidL;
                            if (this.tmpCol != -1) {
                                if (this.OnlyNumberColor == false || is数字 == true)
                                    img.color = this.tmpCol;
                            }
                            else if (this.Col != -1) {
                                if (this.OnlyNumberColor == false || is数字 == true)
                                    img.color = this.Col;
                            }
                            this.Layer.addChild(img);
                        }
                    }
                    if (this.vAlin == "左")
                        this.Layer.x = 0;
                    else if (this.vAlin == "中")
                        this.Layer.x = -(this.L * this.W + (this.L - 1) * this.MidL) / 2 + this.W / 2;
                    else if (this.vAlin == "右")
                        this.Layer.x = -(this.L * this.W + (this.L - 1) * this.MidL) + this.W;
                    this.tmpCol = -1;
                };
                ImageNum.prototype.runF = function (fend, s, e, t, head, tail) {
                    this.FunRunover = fend;
                    this.NowNum = s;
                    this.EndNum = e;
                    this.RunTime = t;
                    this.STR_head = head;
                    if (this.STR_head == null)
                        this.STR_head = "";
                    this.STR_tail = tail;
                    if (this.STR_tail == null)
                        this.STR_tail = "";
                    this.SpdNum = (this.EndNum - this.NowNum) / t;
                    this.showF(this.STR_head + MyClass.Tools.Tool_Function.onChangeInstance(this.NowNum) + this.STR_tail);
                    MyClass.MainManager._instence.addEnterFrameFun(laya.utils.Handler.create(this, this.runCheck, null, false));
                };
                ImageNum.prototype.runCheck = function () {
                    if (this.NowNum == this.EndNum) {
                        MyClass.MainManager._instence.removeEnterFrameFun(this.runCheck);
                        if (this.FunRunover)
                            this.FunRunover.run();
                        return;
                    }
                    this.NowNum += this.SpdNum;
                    if (this.SpdNum > 0 && this.NowNum > this.EndNum)
                        this.NowNum = this.EndNum;
                    else if (this.SpdNum < 0 && this.NowNum < this.EndNum)
                        this.NowNum = this.EndNum;
                    if (--this.RunTime <= 0)
                        this.NowNum = this.EndNum;
                    this.showF(this.STR_head + MyClass.Tools.Tool_Function.onChangeInstance(this.NowNum) + this.STR_tail);
                };
                ImageNum.prototype.getValue = function (want) {
                    switch (want) {
                        case "右边x":
                            var x0;
                            if (this.vAlin == "左")
                                x0 = this.x + (this.L * this.W + (this.L - 1) * this.MidL);
                            else if (this.vAlin == "中")
                                x0 = this.x - this.Layer.x + this.W;
                            else if (this.vAlin == "右")
                                x0 = this.x;
                            if (this.TypeOfParent == "spr")
                                x0 += this.parent.x;
                            return x0;
                        default: return this[want];
                    }
                };
                ImageNum.prototype.onRemoveF = function (e) {
                    this.destroyF();
                };
                ImageNum.prototype.destroyF = function () {
                    if (this.Layer) {
                        this.removeChild(this.Layer);
                        this.Layer.destroyF();
                        this.Layer = null;
                    }
                    this.tm = null;
                    this.clearSaveF();
                    this.removeFromParent(true);
                };
                ImageNum.prototype.clearSaveF = function () {
                    for (var i = 0; i < this.Arr_Save.length; i++) {
                        if (this.Arr_Save[i][1]) {
                            if (this.Col != -1)
                                this.Arr_Save[i][1].color = starling.Color.WHITE;
                            ImageNum.addCache(this.FrontName + this.Arr_Save[i][0], this.SwfName, this.Arr_Save[i][1]);
                        }
                        this.Arr_Save.splice(i--, 1);
                    }
                };
                ImageNum.addNeedCache = function (fName, real) {
                    this.NeedCache[fName] = real;
                };
                ImageNum.removeNeedCache = function (fName) {
                    if (fName == null) {
                        this.NeedCache = {};
                        this.clearF();
                    }
                    else
                        this.NeedCache[fName] = false;
                };
                ImageNum.isNeedCache = function (fName) {
                    if (this.NeedCache[fName] != null)
                        return this.NeedCache[fName];
                    return false;
                };
                ImageNum.getCache = function (str, swf) {
                    if (this.isNeedCache(str) == false)
                        return null;
                    if (this.DicCache == null)
                        this.DicCache = {};
                    if (this.DicCache[swf] == null)
                        this.DicCache[swf] = {};
                    if (this.DicCache[swf][str] == null)
                        this.DicCache[swf][str] = [];
                    var img;
                    if (this.DicCache[swf][str].length > 0) {
                        img = this.DicCache[swf][str][0];
                        this.DicCache[swf][str].shift();
                    }
                    return img;
                };
                ImageNum.addCache = function (str, swf, obj) {
                    if (this.isNeedCache(str) == false)
                        return;
                    if (this.DicCache == null)
                        this.DicCache = {};
                    if (this.DicCache[swf] == null)
                        this.DicCache[swf] = {};
                    if (this.DicCache[swf][str] == null)
                        this.DicCache[swf][str] = [];
                    this.DicCache[swf][str].push(obj);
                };
                ImageNum.clearF = function () {
                    if (this.DicCache == null)
                        return;
                    for (var swf in this.DicCache) {
                        var dic = this.DicCache[swf];
                        for (var key in dic) {
                            var arr = dic[key];
                            for (var i = 0; i < arr.length; i++) {
                                arr[i].removeFromParent(true);
                            }
                            delete dic[key];
                        }
                    }
                    this.DicCache = null;
                };
                /** 手动缓存s */
                ImageNum.onCacheAndSaveF = function (fName, swf) {
                    this.addNeedCache(fName, true);
                    for (var i = 0; i < 10; i++) {
                        var count = 5;
                        while (count-- > 0) {
                            this.addCache(fName + i, swf, MyClass.MySourceManager.instance.getImgFromSwf(swf, "img_" + fName + "Num_" + i));
                        }
                    }
                };
                ImageNum.SWFDefault = "SWF_Default";
                /*
                * 缓存
                */
                ImageNum.NeedCache = {};
                return ImageNum;
            }(starling.Sprite));
            MyView.ImageNum = ImageNum;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=ImageNum.js.map