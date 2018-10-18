var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyTweenerManager = /** @class */ (function () {
            function MyTweenerManager() {
                this.MM = MyClass.MainManager.getInstence();
                this.DIC_Tween = new Dictionary();
                this.Pause = false;
                this.countNum = 0;
            }
            MyTweenerManager.prototype.actionF = function () {
                if (this.Pause)
                    return;
                for (var i = 0; i < this.DIC_Tween.keys.length; i++) {
                    var id = this.DIC_Tween.keys[i];
                    if (this.DIC_Tween.get(id) == null) {
                        this.DIC_Tween.remove(id);
                        i--;
                    }
                    else
                        this.DIC_Tween.get(id).moveF();
                }
                if (this.DIC_Tween.keys.length == 0) {
                    this.MM.removeEnterFrameFun(this.actionF);
                }
            };
            MyTweenerManager.prototype.newTween = function (mc, t) {
                if (this.DIC_Tween.keys.indexOf(mc) == -1) {
                    if (t == null)
                        return;
                }
                if (t == null) {
                    if (this.DIC_Tween.keys.indexOf(mc) != -1) {
                        this.countNum--;
                        this.DIC_Tween.remove(mc);
                    }
                }
                else {
                    this.DIC_Tween.set(mc, t);
                    this.countNum++;
                    if (this.countNum == 1) {
                        this.MM.addEnterFrameFun(laya.utils.Handler.create(this, this.actionF, null, false));
                    }
                }
            };
            MyTweenerManager.prototype.stopAll = function () {
                this.DIC_Tween.clear();
                this.countNum = 0;
                this.MM.removeEnterFrameFun(this.actionF);
            };
            return MyTweenerManager;
        }());
        MyClass.MyTweenerManager = MyTweenerManager;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyTweenerManager.js.map