var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var Handler = laya.utils.Handler;
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var MyViewSelectBtnController = /** @class */ (function () {
                function MyViewSelectBtnController(view, f) {
                    this.DicMc = new Dictionary();
                    this.Fun = f;
                    if (this.Fun)
                        this.Fun.once = false;
                    var l = view.numChildren;
                    for (var i = 0; i < l; i++) {
                        var obj = view.getChildAt(i);
                        if (obj instanceof com.MyClass.MySwf.SwfSprite && obj.name && obj.name.indexOf("SBtn_") == 0 && obj.name.length > 5) {
                            var meta = obj.metaData;
                            var Name = obj.name.substr(5);
                            var strFront = "btn_";
                            if (meta && meta["前缀"])
                                strFront = meta["前缀"];
                            var canMulti = false;
                            if (meta && meta["多选"] != null)
                                canMulti = meta["多选"];
                            var vType = MyView.MySelectSingleBTN.ValueType_Name;
                            if (meta && meta["参数"] != null)
                                vType = meta["参数"];
                            var SB = MyView.MySelectSingleBTN.creatBtnFromSprite(obj, Handler.create(this, this.onClickF, null, false), Name, strFront, canMulti, vType);
                            this.DicMc.set(Name, SB);
                            if (meta) {
                                if (meta["初始"] != null)
                                    SB.setNow(meta["初始"]);
                                else if (meta["初始且事件"] != null) {
                                    if (typeof meta["初始且事件"] == "number")
                                        SB.clickF(meta["初始且事件"]);
                                    else
                                        SB.clickNameF(meta["初始且事件"]);
                                }
                            }
                        }
                    }
                }
                MyViewSelectBtnController.prototype.onClickF = function (Name, n) {
                    if (this.Fun == null || n == null || n == -1)
                        return;
                    this.Fun.runWith([Name, n]);
                };
                MyViewSelectBtnController.prototype.setNow = function (Name, now, on) {
                    if (on === void 0) { on = true; }
                    var key;
                    for (var i = 0; i < this.DicMc.keys.length; i++) {
                        key = this.DicMc.keys[i];
                        if (Name == null || Name == key)
                            this.getSBtn(key).setNow(now, on);
                    }
                };
                MyViewSelectBtnController.prototype.clickF = function (Name, n) {
                    var SB = this.DicMc.get(Name);
                    if (SB) {
                        if (typeof n == "number")
                            SB.clickF(n);
                        else
                            SB.clickNameF(n);
                    }
                };
                MyViewSelectBtnController.prototype.getSBtn = function (Name) {
                    return this.DicMc.get(Name);
                };
                MyViewSelectBtnController.prototype.onPauseF = function (Name, pause) {
                    var key;
                    for (var i = 0; i < this.DicMc.keys.length; i++) {
                        key = this.DicMc.keys[i];
                        if (Name == null || Name == key)
                            this.getSBtn(key).Busy = pause;
                    }
                };
                MyViewSelectBtnController.prototype.destroyF = function () {
                    if (this.Fun != null) {
                        this.Fun.clear();
                        this.Fun = null;
                    }
                    this.DicMc = Tool_ObjUtils.destroyF_One(this.DicMc);
                };
                return MyViewSelectBtnController;
            }());
            MyView.MyViewSelectBtnController = MyViewSelectBtnController;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyViewSelectBtnController.js.map