var starling;
(function (starling) {
    var Tool_Function = com.MyClass.Tools.Tool_Function;
    var Handler = laya.utils.Handler;
    var Juggler = /** @class */ (function () {
        function Juggler() {
            this.countID = 1;
            this.dic_ids = new Dictionary();
        }
        Juggler.getInstance = function () {
            if (this.instance == null)
                this.instance = new Juggler();
            return this.instance;
        };
        Juggler.prototype.delayCall = function (f, time) {
            var arg = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                arg[_i - 2] = arguments[_i];
            }
            if (this.dic_ids.indexOf(f) == -1) {
                var arr = [f];
                if (arg.length > 0) {
                    arr = arr.concat(arg);
                }
                this.dic_ids.set(this.countID, arr);
                Laya.timer.once(time * 1000, this, this.onTimerF, [this.countID++], false);
            }
        };
        Juggler.prototype.onTimerF = function (id) {
            if (this.dic_ids.get(id) != null) {
                var arr = this.dic_ids.get(id);
                this.dic_ids.remove(id);
                var f = arr.shift();
                Tool_Function.onRunFunction(f, arr);
            }
            else {
                //				trace("已被清理");
            }
        };
        Juggler.prototype.removeDelayedCalls = function (f) {
            for (var i = 0; i < this.dic_ids.keys.length; i++) {
                var arr = this.dic_ids.get(this.dic_ids.keys[i]);
                var fun = arr[0];
                if (Tool_Function.compareHandlers(fun, f) == true) {
                    this.dic_ids.remove(this.dic_ids.keys[i]);
                    if (fun instanceof Handler)
                        fun.clear();
                    i--;
                }
                if (f instanceof Handler)
                    f.clear();
            }
        };
        Juggler.prototype.add = function (t) {
            //生成laya的tween并自动开始
            var f = null;
            if (t.tranType != null && typeof (t.tranType) != "number") {
                f = t.tranType;
            }
            else if (t.tranType == null || t.tranType == "linear") {
                f = laya.utils.Ease.linearNone;
            }
            else if (t.tranType == starling.Tween.EASE_IN) {
                f = laya.utils.Ease.backIn;
            }
            else if (t.tranType == starling.Tween.EASE_OUT) {
                f = laya.utils.Ease.backOut;
            }
            else if (t.tranType == starling.Tween.EASE_IN_OUT) {
                f = laya.utils.Ease.backInOut;
            }
            else if (t.tranType == starling.Tween.BOUNCE_IN) {
                f = laya.utils.Ease.bounceIn;
            }
            else if (t.tranType == starling.Tween.BOUNCE_OUT) {
                f = laya.utils.Ease.bounceOut;
            }
            else if (t.tranType == starling.Tween.BOUNCE_IN_OUT) {
                f = laya.utils.Ease.bounceInOut;
            }
            else if (t.tranType == starling.Tween.STRONG_In) {
                f = laya.utils.Ease.strongIn;
            }
            else if (t.tranType == starling.Tween.STRONG_In_Out) {
                f = laya.utils.Ease.strongInOut;
            }
            var comp;
            if (t.onComplete != null) {
                comp = t.onComplete;
                if (t.onCompleteArgs != null) {
                    comp.args = t.onCompleteArgs;
                }
            }
            laya.utils.Tween.to(t.tarObj, t.info, t.time * 1000, f, comp);
        };
        Juggler.prototype.remove = function (t) {
            if (Tool_Function.isTypeOf(t, starling.Tween)) {
                //laya的tween完成后自动删除
            }
        };
        return Juggler;
    }());
    starling.Juggler = Juggler;
})(starling || (starling = {}));
//# sourceMappingURL=Juggler.js.map