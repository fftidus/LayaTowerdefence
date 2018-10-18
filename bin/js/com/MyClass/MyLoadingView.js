var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyLoadingView = /** @class */ (function () {
            function MyLoadingView(arr, complete, caller, loadPicID) {
                if (loadPicID === void 0) { loadPicID = 1; }
                this.nowPer = 0;
                this.step = 0;
                this.resArr = arr;
                this.callback = complete;
                this.caller = caller;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf(".swf") != -1) {
                        if (this.arrSwfs == null)
                            this.arrSwfs = [];
                        this.arrSwfs.push([arr[i].slice(0, arr[i].indexOf(".")), "swf"]);
                        arr.splice(i--, 1);
                    }
                }
                if (this.arrSwfs == null) {
                    this.per1 = 1;
                }
                else {
                    this.per1 = this.resArr.length / (this.resArr.length + this.arrSwfs.length);
                }
                this.per2 = 1 - this.per1;
                this.LView = new com.MyClass.MyView.LoadingView(this.resArr.length, loadPicID);
                this.LView.noAutoProgress();
                this.onProgress(0);
                if (this.resArr == null) {
                    return;
                }
                if (this.resArr.length == 0) {
                    this.onloaded();
                }
                else {
                    Laya.loader.load(this.resArr, laya.utils.Handler.create(this, this.onloaded), laya.utils.Handler.create(this, this.onProgress, null, false));
                }
            }
            MyLoadingView.prototype.onProgress = function (cur) {
                if (this.LView) {
                    this.LView.setPer(Math.ceil(cur * this.per1 * 100));
                }
            };
            MyLoadingView.prototype.setNowper = function (val) {
                if (typeof val == "number") {
                    return;
                }
                this.nowPer += this.per2 / this.arrSwfs.length;
                if (this.nowPer > 1) {
                    this.nowPer = 1;
                }
                if (this.LView) {
                    this.LView.setPer(Math.ceil(this.nowPer));
                }
            };
            MyLoadingView.prototype.onloaded = function () {
                if (this.step == 0) {
                    this.step = 1;
                    this.nowPer = this.per1;
                    if (this.arrSwfs) {
                        com.MyClass.MainManager.getInstence().MEM.addListenF("加载进度", laya.utils.Handler.create(this, this.setNowper, null, false));
                        com.MyClass.MySourceManager.getInstance().addTexture(this.arrSwfs, laya.utils.Handler.create(this, this.onloaded));
                        return;
                    }
                }
                com.MyClass.MainManager.getInstence().MEM.removeListenF("加载进度", this.setNowper);
                if (this.LView) {
                    this.LView.destroyF();
                    this.LView = null;
                }
                if (this.callback) {
                    this.callback.apply(this.caller);
                }
            };
            return MyLoadingView;
        }());
        MyClass.MyLoadingView = MyLoadingView;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyLoadingView.js.map