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
            var Input = laya.display.Input;
            var MyTextInput = /** @class */ (function (_super) {
                __extends(MyTextInput, _super);
                function MyTextInput(_width, _height, _size) {
                    if (_size === void 0) { _size = -1; }
                    var _this = _super.call(this) || this;
                    _this.visibleCount = 1;
                    _this.isPasswork = false;
                    _this.isFocus = false;
                    _this.isLinsening = false;
                    if (_size <= 0)
                        _size = 20;
                    _this.ID = MyTextInput.Count++;
                    MyTextInput.Dic.set(_this.ID, _this);
                    _this.inputText = new Input();
                    _this.inputText.size(_width, _height);
                    //		inputText.multiline = true;
                    //		inputText.wordWrap = true;
                    // 移动端输入提示符
                    //		inputText.prompt = "Type some word...";
                    // 设置字体样式
                    _this.inputText.bold = true;
                    _this.inputText.color = "#ffffff";
                    _this.inputText.fontSize = _size;
                    return _this;
                }
                MyTextInput.onHideF = function (real) {
                    for (var i = 0; i < this.Dic.keys.length; i++) {
                        var id = this.Dic.keys[i];
                        this.Dic.get(id).setValue("隐藏", real);
                    }
                };
                MyTextInput.DestroyALL = function () {
                    for (var i = 0; i < this.Dic.keys.length; i++) {
                        var id = this.Dic.keys[i];
                        this.Dic.get(id).destroyF();
                        this.Dic.remove(id);
                        i--;
                    }
                };
                MyTextInput.getNewOne = function (spr, url, size, col) {
                    if (size === void 0) { size = 0; }
                    if (col === void 0) { col = "白"; }
                    var tmpTX = spr.getChildByName(url);
                    if (size <= 0)
                        size = tmpTX.height - 3;
                    var TX = new MyTextInput(tmpTX.width, tmpTX.height, size);
                    var arr = url.split("_"); //txi_25_颜色FF99000_对齐中
                    TX.Name = arr[0] + "_" + arr[1];
                    if (arr.length > 2) {
                        var info = {};
                        for (var j = 2; j < arr.length; j++) {
                            var one = arr[j];
                            if (one.indexOf("颜色") == 0) {
                                one = one.slice(2);
                                if (one.length == 1)
                                    col = one;
                                else if (one.indexOf("0x") != 0)
                                    col = com.MyClass.Tools.Tool_Function.onForceConvertType("0x" + one);
                            }
                            else if (one.indexOf("对齐") == 0) {
                                TX.setValue("对齐", one.slice(2));
                            }
                            else if (one.indexOf("多行") == 0) {
                                var num = com.MyClass.Tools.Tool_Function.onForceConvertType(one.slice(2));
                                size = size / (num + 1);
                                TX.setValue("字号", size);
                            }
                            else if (one.indexOf("密码") == 0) {
                                TX.setValue("密码", true);
                            }
                            else if (one.indexOf("默认") == 0) {
                                TX.setValue("默认文字", one.slice(2));
                            }
                            else if (one == "仅数字") {
                                TX.setValue("仅数字", true);
                            }
                        }
                    }
                    TX.x = tmpTX.x;
                    TX.y = tmpTX.y;
                    TX.setValue("颜色", col);
                    spr.addChild(TX);
                    TX.initF();
                    return TX;
                };
                Object.defineProperty(MyTextInput.prototype, "text", {
                    get: function () {
                        return this.inputText.text;
                    },
                    set: function (value) {
                        if (this.isPasswork == true && this.inputText.type != "password") {
                            this.inputText.type = "password";
                        }
                        else if (this.isPasswork == false && this.inputText.type == "password") {
                            this.inputText.type = "text";
                        }
                        this.inputText.text = value;
                        if (this.visibleCount != 1)
                            return;
                        this.inputText.visible = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                MyTextInput.prototype.initF = function () {
                    Laya.stage.addChild(this.inputText);
                    if (this.mmo == null) {
                        this.mmo = new MyClass.MainManagerOne();
                        this.mmo.addEnterFrameFun(laya.utils.Handler.create(this, this.enterF, null, false));
                    }
                    //			this.addChild(inputText);
                };
                MyTextInput.prototype.enterF = function () {
                    if (this.visible == false)
                        return;
                    var p = this.localToGlobal(new laya.maths.Point(0, 0));
                    this.inputText.x = p.x;
                    this.inputText.y = p.y;
                };
                MyTextInput.prototype.setValue = function (type, val) {
                    switch (type) {
                        case "颜色":
                            if (typeof val === "string") {
                                if (val == "红")
                                    this.inputText.color = "#ff0000";
                                else if (val == "白")
                                    this.inputText.color = "#ffffff";
                                else if (val == "黑")
                                    this.inputText.color = "#000000";
                                else if (val == "黄")
                                    this.inputText.color = "#ffff00";
                                else
                                    this.inputText.color = val;
                            }
                            else {
                                this.inputText.color = "#" + val.toString(16);
                            }
                            break;
                        case "对齐":
                            if (val == "左")
                                this.inputText.align = "left";
                            else if (val == "中")
                                this.inputText.align = "center";
                            else if (val == "右")
                                this.inputText.align = "right";
                            break;
                        case "隐藏":
                            if (val == true)
                                this.visibleCount--;
                            else
                                this.visibleCount++;
                            if (this.visibleCount == 1) //visible刚刚从false变成true
                             {
                                this.inputText.visible = true;
                            }
                            else if (this.visibleCount == 0) {
                                this.inputText.visible = false;
                            }
                            break;
                        case "密码":
                            this.isPasswork = true;
                            this.inputText.type = "password";
                            break;
                        case "仅数字":
                            this.inputText.restrict = "0-9";
                            break;
                        case "仅英文":
                            this.inputText.restrict = "A-Z a-z";
                            break;
                        case "仅数字英文":
                            this.inputText.restrict = "A-Z a-z 0-9";
                            break;
                        case "输入事件":
                            this.ChangedFun = val;
                            if (this.ChangedFun != null) {
                                this.onAddFocusF();
                            }
                            else {
                                this.onClearFocusF();
                            }
                            break;
                        case "最大长度":
                            this.maxLength = val;
                            this.onAddFocusF();
                            break;
                        case "字号":
                            this.inputText.fontSize = val;
                            break;
                        case "默认文字":
                            this.inputText.prompt = val;
                            break;
                        case "可编辑":
                            this.inputText.editable = val;
                            break;
                    }
                };
                MyTextInput.prototype.setFocus = function () {
                    if (this.inputText) {
                        //				inputText.assignFocus();
                    }
                };
                MyTextInput.prototype.onAddFocusF = function () {
                    if (this.inputText == null)
                        return;
                    if (this.isLinsening == false) {
                        this.isLinsening = true;
                        this.inputText.on(laya.events.Event.FOCUS, this, this.onFocusIn);
                        this.inputText.on(laya.events.Event.BLUR, this, this.onFocusOut);
                    }
                    this.onFocusOut(null);
                };
                MyTextInput.prototype.onClearFocusF = function () {
                    if (this.inputText == null)
                        return;
                    if (this.isLinsening == true) {
                        this.isLinsening = false;
                        this.inputText.offAll();
                    }
                };
                MyTextInput.prototype.onFocusIn = function (e) {
                    this.isFocus = true;
                };
                MyTextInput.prototype.onFocusOut = function (e) {
                    if (this.maxLength != null) {
                        var str = this.inputText.text;
                        if (typeof this.maxLength === "number") {
                            str = com.MyClass.Tools.Tool_StringBuild.rebuild_by_length(str, this.maxLength, false);
                        }
                        else {
                            str = com.MyClass.Tools.Tool_StringBuild.rebuild_by_length(str, this.maxLength["长度"], this.maxLength["中文"]);
                        }
                        this.inputText.text = str;
                    }
                    if (this.ChangedFun && this.isFocus) {
                        com.MyClass.Tools.Tool_Function.onRunFunction(this.ChangedFun, this.Name);
                    }
                    this.isFocus = false;
                };
                MyTextInput.prototype.destroyF = function () {
                    MyTextInput.Dic.remove(this.ID);
                    this.inputText.destroy();
                    this.inputText = null;
                    this.ChangedFun = null;
                    this.mmo = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mmo);
                    this.destroy();
                };
                MyTextInput.Count = 0;
                MyTextInput.Dic = new Dictionary();
                return MyTextInput;
            }(starling.Sprite));
            MyView.MyTextInput = MyTextInput;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyTextInput.js.map