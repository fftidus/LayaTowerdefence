var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyGestures;
        (function (MyGestures) {
            var MyGesture = /** @class */ (function () {
                function MyGesture(tar, fun, val) {
                    this.Arr_MME = [];
                    this.pause = false;
                    this.Tar = tar;
                    this.F = fun;
                    this.FValue = val;
                }
                MyGesture.prototype.addMME = function () {
                    var MME = new com.MyClass.MyView.MyMouseEventStarling(this.Tar);
                    this.Arr_MME.push(MME);
                    return MME;
                };
                MyGesture.prototype.destroyF = function () {
                    this.Tar = null;
                    this.F = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.F);
                    for (var i = 0; i < this.Arr_MME.length; i++) {
                        var MME = this.Arr_MME[i];
                        MME.destroyF();
                    }
                    this.Arr_MME = null;
                };
                return MyGesture;
            }());
            MyGestures.MyGesture = MyGesture;
        })(MyGestures = MyClass.MyGestures || (MyClass.MyGestures = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyGesture.js.map