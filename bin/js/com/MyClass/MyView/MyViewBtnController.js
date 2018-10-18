var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var Handler = laya.utils.Handler;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var MyViewBtnController = /** @class */ (function () {
                function MyViewBtnController(spr, fClick, fDown, fUp) {
                    if (fDown === void 0) { fDown = null; }
                    if (fUp === void 0) { fUp = null; }
                    this.Dic_Btn = {};
                    this.Busy = false;
                    this.FunClick = fClick;
                    this.FunDown = fDown;
                    this.FunUp = fUp;
                    Tool_Function.onTouchable(spr);
                    for (var i = 0; i < spr.numChildren; i++) {
                        var obj = spr.getChildAt(i);
                        var strName = obj.name;
                        if (strName && strName.indexOf("btn_") == 0) {
                            this.addOneBtn(spr, strName);
                        }
                    }
                }
                MyViewBtnController.prototype.addOneBtn = function (spr, strName) {
                    this.Dic_Btn[strName] = com.MyClass.Tools.Tool_SpriteUtils.getBtn(spr, strName);
                    this.Dic_Btn[strName].initTouch(Handler.create(this, this.onDownF), this.FunUp ? Handler.create(this, this.onUpF) : null, Handler.create(this, this.clickF), strName);
                };
                MyViewBtnController.prototype.onDownF = function (from) {
                    if (this.Busy)
                        return;
                    if (this.Dic_Sound && this.Dic_Sound[from]) {
                        MyClass.SoundManagerMy.getInstance().playSound(this.Dic_Sound[from]);
                    }
                    else if (MyViewBtnController.Dic_BtnSound && MyViewBtnController.Dic_BtnSound[from]) {
                        MyClass.SoundManagerMy.getInstance().playSound(MyViewBtnController.Dic_BtnSound[from]);
                    }
                    else if (MyViewBtnController.Dic_BtnSound && MyViewBtnController.Dic_BtnSound["默认"]) {
                        MyClass.SoundManagerMy.getInstance().playSound(MyViewBtnController.Dic_BtnSound["默认"]);
                    }
                    if (this.FunDown == null)
                        return;
                    if (this.Value == null)
                        this.FunDown.runWith(from);
                    else
                        this.FunDown.runWith([this.Value, from]);
                };
                MyViewBtnController.prototype.onUpF = function (from) {
                    if (this.Busy)
                        return;
                    if (this.FunUp == null)
                        return;
                    if (this.Value == null)
                        this.FunUp.runWith(from);
                    else
                        this.FunUp.runWith([this.Value, from]);
                };
                MyViewBtnController.prototype.clickF = function (from) {
                    if (this.Busy)
                        return;
                    if (this.FunClick == null)
                        return;
                    if (this.Value == null)
                        this.FunClick.runWith(from);
                    else
                        this.FunClick.runWith([this.Value, from]);
                };
                /** 添加按钮特殊音效 */
                MyViewBtnController.prototype.addBtnSound = function (btn, soundName) {
                    if (this.Dic_Sound == null)
                        this.Dic_Sound = com.MyClass.Tools.Tool_ObjUtils.getNewObjectFromPool();
                    this.Dic_Sound[btn] = soundName;
                };
                /** 隐藏按钮 */
                MyViewBtnController.prototype.onVisible = function (tar, vib) {
                    if (tar == null) {
                        //全部
                        for (var n in this.Dic_Btn) {
                            this.Dic_Btn[n].visible = vib;
                        }
                    }
                    else {
                        if (this.Dic_Btn[tar]) {
                            this.Dic_Btn[tar].visible = vib;
                        }
                        else {
                            console.log("MBC中对不存在的按钮进行visible操作！name=" + tar);
                        }
                    }
                };
                /** 停止按钮 */
                MyViewBtnController.prototype.onPause = function (tar, pause) {
                    if (tar == null) {
                        //全部
                        for (var n in this.Dic_Btn) {
                            this.Dic_Btn[n].pause = pause;
                        }
                    }
                    else {
                        if (this.Dic_Btn[tar]) {
                            this.Dic_Btn[tar].pause = pause;
                        }
                    }
                };
                MyViewBtnController.prototype.onEventStop = function () {
                    for (var n in this.Dic_Btn) {
                        this.Dic_Btn[n].setEventStop();
                    }
                };
                MyViewBtnController.prototype.changeFrame = function (tar, f) {
                    if (this.Dic_Btn[tar])
                        this.Dic_Btn[tar].setFrame(f);
                };
                MyViewBtnController.prototype.onChangeValues = function (Name, vName, value) {
                    for (var n in this.Dic_Btn) {
                        if (n == Name || Name == null)
                            this.Dic_Btn[n][vName] = value;
                    }
                };
                MyViewBtnController.prototype.getBtnByName = function (_name) {
                    return this.Dic_Btn[_name];
                };
                MyViewBtnController.prototype.checkInBtn = function (lx, ly) {
                    for (var _name in this.Dic_Btn) {
                        var btn = this.Dic_Btn[_name];
                        if (btn && btn.checkIn(lx, ly) == true) {
                            return _name;
                        }
                    }
                    return null;
                };
                MyViewBtnController.prototype.destroyF = function () {
                    this.FunDown = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FunDown);
                    this.FunUp = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FunUp);
                    this.FunClick = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FunClick);
                    for (var n in this.Dic_Btn) {
                        this.Dic_Btn[n].destroyF();
                        delete this.Dic_Btn[n];
                    }
                    this.Dic_Btn = null;
                    this.Dic_Sound = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Dic_Sound);
                };
                return MyViewBtnController;
            }());
            MyView.MyViewBtnController = MyViewBtnController;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyViewBtnController.js.map