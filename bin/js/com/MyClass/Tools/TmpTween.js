var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var TmpTween = /** @class */ (function () {
                function TmpTween(t, fend, arrvalue) {
                    this.T = t;
                    this.FunEnd = fend;
                    this.endValues = arrvalue;
                    this.T.onComplete = laya.utils.Handler.create(this, this.onEndF);
                    starling.Juggler.getInstance().add(this.T);
                }
                TmpTween.prototype.onEndF = function () {
                    starling.Juggler.getInstance().remove(this.T);
                    this.T = null;
                    if (this.endValues)
                        Tools.Tool_Function.onRunFunction(this.FunEnd, this.endValues);
                    else
                        Tools.Tool_Function.onRunFunction(this.FunEnd);
                    this.FunEnd = null;
                };
                return TmpTween;
            }());
            Tools.TmpTween = TmpTween;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=TmpTween.js.map