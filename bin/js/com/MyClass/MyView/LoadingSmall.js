var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var LoadingSmall = /** @class */ (function () {
                function LoadingSmall(str) {
                    MyView.MyTextInput.onHideF(true);
                    this.smc = MyClass.MySourceManager.getInstance().getMcFromSwf(LoadingSmall.SWF_Starling, "mc_loadingsmall");
                    if (this.smc) {
                        MyView.LayerStarlingManager.instance.LayerTop.addChild(this.smc);
                    }
                }
                LoadingSmall.showF = function (str) {
                    if (str === void 0) { str = null; }
                    if (this.One == null) {
                        this.One = new LoadingSmall(str);
                    }
                };
                LoadingSmall.removeF = function (e) {
                    if (e === void 0) { e = null; }
                    if (this.One != null) {
                        this.One.destroyF();
                        this.One = null;
                    }
                };
                LoadingSmall.prototype.destroyF = function () {
                    MyView.MyTextInput.onHideF(false);
                    if (this.smc) {
                        this.smc.removeFromParent(true);
                        this.smc = null;
                    }
                };
                LoadingSmall.SWF_Starling = "SWF_Default";
                return LoadingSmall;
            }());
            MyView.LoadingSmall = LoadingSmall;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=LoadingSmall.js.map