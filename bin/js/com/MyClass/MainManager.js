var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MainManager = /** @class */ (function () {
            function MainManager() {
                this.Time = 0;
                this.pause = false;
                this.inEnter = false;
                this.Dic_enterFun = new Dictionary();
                this.Dic_delayFun = new Dictionary();
            }
            MainManager.getInstence = function () {
                if (MainManager._instence == null)
                    MainManager._instence = new MainManager();
                return MainManager._instence;
            };
            MainManager.prototype.init = function (stage) {
                this.MEM = new MyClass.MyEventManager();
                this.MTM = new MyClass.MyTweenerManager();
                if (this.mstage == null) {
                    this.mstage = stage;
                    com.MyClass.Config.mStage = stage;
                    com.MyClass.Config.initF();
                    com.MyClass.MyView.LayerStarlingManager.getInstence().init(stage);
                    Laya.timer.frameLoop(1, this, this.enterF, null, false);
                }
            };
            MainManager.prototype.enterF = function (e) {
                if (this.pause == true) {
                    return;
                }
                this.Time++;
                this.inEnter = true;
                for (var i = 0; i < this.Dic_enterFun.keys.length; i++) {
                    var f = this.Dic_enterFun.get(this.Dic_enterFun.keys[i]);
                    if (f != null) {
                        com.MyClass.Tools.Tool_Function.onRunFunction(f);
                    }
                }
                for (i = 0; i < this.Dic_delayFun.keys.length; i++) {
                    var arr = this.Dic_delayFun.get(this.Dic_delayFun.keys[i]);
                    if (arr[1] <= 0) {
                        var fun = arr[0];
                        var val = arr[2];
                        com.MyClass.Tools.Tool_Function.onRunFunction(fun, val);
                        this.remove_delayFunction(fun);
                        i--;
                    }
                    else {
                        arr[1] -= 1;
                    }
                }
                this.inEnter = false;
                if (this.Arr_waiteRemove != null) {
                    for (i = 0; i < this.Arr_waiteRemove.length; i++) {
                        this.removeEnterFrameFun(this.Arr_waiteRemove[i]);
                    }
                    this.Arr_waiteRemove = null;
                }
            };
            MainManager.prototype.addEnterFrameFun = function (fun) {
                if (fun == null)
                    return;
                if (fun instanceof laya.utils.Handler && fun.once == true) {
                    fun.once = false;
                }
                this.Dic_enterFun.set(fun, fun);
            };
            MainManager.prototype.removeEnterFrameFun = function (fun) {
                if (fun == null)
                    return;
                if (this.inEnter == true) {
                    if (this.Arr_waiteRemove == null)
                        this.Arr_waiteRemove = [];
                    this.Arr_waiteRemove.push(fun);
                }
                else {
                    for (var i = 0; i < this.Dic_enterFun.keys.length; i++) {
                        var f = this.Dic_enterFun.keys[i];
                        if (com.MyClass.Tools.Tool_Function.compareHandlers(fun, f) == true) {
                            this.Dic_enterFun.remove(f);
                            i--;
                            if (f instanceof laya.utils.Handler)
                                f.clear();
                        }
                    }
                }
                if (fun instanceof laya.utils.Handler) {
                    fun.clear();
                }
            };
            MainManager.prototype.add_delayFunction = function (fun, delay, val) {
                if (val === void 0) { val = null; }
                fun.once = true;
                if (fun.method == null) {
                    return;
                }
                if (delay == 0) {
                    if (val == null)
                        fun.run();
                    else
                        fun.runWith(val);
                    return;
                }
                this.Dic_delayFun.set(fun, [fun, delay, val]);
            };
            MainManager.prototype.remove_delayFunction = function (fun) {
                for (var i = 0; i < this.Dic_delayFun.keys.length; i++) {
                    var f = this.Dic_delayFun.keys[i];
                    if (com.MyClass.Tools.Tool_Function.compareHandlers(fun, f) == true) {
                        this.Dic_delayFun.remove(fun);
                        i--;
                        if (f instanceof laya.utils.Handler)
                            f.clear();
                    }
                }
                if (fun instanceof laya.utils.Handler) {
                    fun.clear();
                }
            };
            MainManager.prototype.destroyF = function () {
                this.remove_delayFunction(null);
                this.removeEnterFrameFun(null);
                if (this.MTM) {
                    this.MTM.stopAll();
                    this.MTM = null;
                }
                if (this.MEM) {
                    this.MEM.destroyF();
                    this.MEM = null;
                }
                Laya.timer.clear(this, this.enterF);
                com.MyClass.MyView.LayerStarlingManager.getInstence().destroyF();
                MainManager._instence = null;
            };
            MainManager.prototype.clearF = function () {
                this.remove_delayFunction(null);
                this.removeEnterFrameFun(null);
                if (this.MTM) {
                    this.MTM.stopAll();
                    this.MTM = null;
                }
                this.MTM = new MyClass.MyTweenerManager();
                if (this.MEM) {
                    this.MEM.destroyF();
                    this.MEM = null;
                }
                this.MEM = new MyClass.MyEventManager();
            };
            return MainManager;
        }());
        MyClass.MainManager = MainManager;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MainManager.js.map