var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Handler = laya.utils.Handler;
        var Tool_Function = com.MyClass.Tools.Tool_Function;
        var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
        var MainManagerOne = /** @class */ (function () {
            function MainManagerOne() {
                this.Arr_EnterFrame = [];
                this.Dic_Delay = new Dictionary();
                this.MM = MyClass.MainManager._instence;
            }
            MainManagerOne.prototype.addEnterFrameFun = function (fun) {
                if (this.Arr_EnterFrame.indexOf(fun) == -1) {
                    this.Arr_EnterFrame.push(fun);
                    this.MM.addEnterFrameFun(fun);
                }
            };
            MainManagerOne.prototype.removeEnterFrameFun = function (fun) {
                var index = -1;
                for (var i = 0; i < this.Arr_EnterFrame.length; i++) {
                    var f = this.Arr_EnterFrame[i];
                    if (Tool_Function.compareHandlers(f, fun) == true) {
                        index = i;
                    }
                    if (index != -1) {
                        break;
                    }
                }
                if (index != -1) {
                    this.Arr_EnterFrame.splice(index, 1);
                    this.MM.removeEnterFrameFun(fun);
                }
            };
            MainManagerOne.prototype.addEnterSecondFun = function (fun) {
                if (this.Arr_EnterSecond == null) {
                    this.Arr_EnterSecond = [];
                    this.MM.addEnterFrameFun(Handler.create(this, this.enterF, null, false));
                }
                if (this.hasEnterSecondFunction(fun) == -1) {
                    this.Arr_EnterSecond.push([fun, 0]);
                }
            };
            MainManagerOne.prototype.removeEnterSecondFun = function (fun) {
                if (this.Arr_EnterSecond == null) {
                    return;
                }
                var i;
                var l = this.Arr_EnterSecond.length;
                for (i = 0; i < l; i++) {
                    if (this.Arr_EnterSecond[i] != null && (this.Arr_EnterSecond[i][0] == fun || this.Arr_EnterSecond[i][0].method == fun)) {
                        this.Arr_EnterSecond[i] = Tool_ObjUtils.destroyF_One(this.Arr_EnterSecond[i]);
                    }
                }
            };
            MainManagerOne.prototype.hasEnterSecondFunction = function (fun) {
                if (this.Arr_EnterSecond == null)
                    return -1;
                var i;
                var l = this.Arr_EnterSecond.length;
                for (i = 0; i < l; i++) {
                    if (this.Arr_EnterSecond[i] != null && this.Arr_EnterSecond[i][0] == fun) {
                        return i;
                    }
                }
                return -1;
            };
            MainManagerOne.prototype.enterF = function () {
                var i;
                var l;
                //----------------------------秒频事件-----------------------------------
                if (this.Arr_EnterSecond) {
                    l = this.Arr_EnterSecond.length;
                    var count;
                    for (i = 0; i < l; i++) {
                        if (this.Arr_EnterSecond[i] != null) {
                            count = this.Arr_EnterSecond[i][1]++;
                            if (count >= MyClass.Config.playSpeedTrue) {
                                this.Arr_EnterSecond[i][1] = 0;
                                Tool_Function.onRunFunction(this.Arr_EnterSecond[i][0]);
                            }
                        }
                        else {
                            this.Arr_EnterSecond.splice(i--, 1);
                            l--;
                        }
                    }
                }
            };
            MainManagerOne.prototype.add_delayFunction = function (fun, delay, val) {
                if (val === void 0) { val = null; }
                this.remove_delayFunction(fun);
                var h = Handler.create(this, this.tmpFunction, [fun, val]);
                this.Dic_Delay.set(fun, h);
                this.MM.add_delayFunction(h, delay);
            };
            MainManagerOne.prototype.tmpFunction = function (fun, val) {
                Tool_Function.onRunFunction(fun, val);
            };
            MainManagerOne.prototype.remove_delayFunction = function (f) {
                if (this.Dic_Delay == null)
                    return;
                var h = this.Dic_Delay.get(f);
                if (h == null)
                    return;
                this.MM.remove_delayFunction(h);
                this.Dic_Delay.remove(f);
            };
            MainManagerOne.prototype.destroyF = function () {
                var i;
                for (i = 0; i < this.Arr_EnterFrame.length; i++) {
                    this.removeEnterFrameFun(this.Arr_EnterFrame[i--]);
                }
                this.Arr_EnterFrame = null;
                if (this.Dic_Delay) {
                    com.MyClass.Tools.Tool_DictionUtils.onCheckAllDic(this.Dic_Delay, function (key, val) {
                        this.remove_delayFunction(key);
                    });
                    this.Dic_Delay.clear();
                }
                this.Dic_Delay = null;
                if (this.Arr_EnterSecond) {
                    this.MM.removeEnterFrameFun(this.enterF);
                }
                this.Arr_EnterSecond = Tool_ObjUtils.destroyF_One(this.Arr_EnterSecond);
                this.MM = null;
            };
            return MainManagerOne;
        }());
        MyClass.MainManagerOne = MainManagerOne;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MainManagerOne.js.map