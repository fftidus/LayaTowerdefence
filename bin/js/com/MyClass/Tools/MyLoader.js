var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Handler = laya.utils.Handler;
            var MyLoader = /** @class */ (function () {
                function MyLoader(type, url, f, val) {
                    if (val === void 0) { val = null; }
                    this.Fun = f;
                    this.fVal = val;
                    this.Type = type || MyLoader.getTypeByURL(url);
                    if (typeof url == "string")
                        this.Url = url;
                    if (this.Type == MyLoader.TypePIC) {
                        Laya.loader.load(this.Url, Handler.create(this, this.onPicF));
                    }
                    else if (this.Type == MyLoader.TypeByte) {
                    }
                    else if (this.Type == MyLoader.TypePICByte) {
                    }
                    else if (this.Type == MyLoader.TypeString) {
                        Laya.loader.load(this.Url, Handler.create(this, this.onStringF));
                    }
                }
                MyLoader.getTypeByURL = function (url) {
                    var type;
                    if (url.indexOf(".jpg") != -1 || url.indexOf(".png") != -1)
                        type = this.TypePIC;
                    else if (url.indexOf(".txt") != -1)
                        type = this.TypeString;
                    else
                        type = this.TypeByte;
                    return type;
                };
                MyLoader.prototype.onPicF = function () {
                    var t = Laya.loader.getRes(this.Url);
                    this.onRunFun(t);
                    this.destroyF();
                };
                MyLoader.prototype.onByteArrayF = function (e) {
                    this.onRunFun(null);
                    this.destroyF();
                };
                MyLoader.prototype.onStringF = function (tar) {
                    if (tar != null) {
                        this.onRunFun(Laya.loader.getRes(this.Url));
                    }
                    else {
                        this.onRunFun(null);
                    }
                    this.destroyF();
                };
                MyLoader.prototype.onRunFun = function (val) {
                    if (this.Fun == null)
                        return;
                    if (this.fVal)
                        Tools.Tool_Function.onRunFunction(this.Fun, val, this.fVal);
                    else
                        Tools.Tool_Function.onRunFunction(this.Fun, val);
                };
                MyLoader.prototype.destroyF = function () {
                    this.Fun = Tools.Tool_ObjUtils.destroyF_One(this.Fun);
                };
                MyLoader.TypePIC = "pic";
                MyLoader.TypeByte = "byte";
                MyLoader.TypePICByte = "bytePic";
                MyLoader.TypeString = "str";
                return MyLoader;
            }());
            Tools.MyLoader = MyLoader;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyLoader.js.map