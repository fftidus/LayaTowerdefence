var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var MyPools = /** @class */ (function () {
                function MyPools() {
                    this.Dic = {};
                    this.Dic_Max = {};
                }
                MyPools.getInstance = function () {
                    if (this.instance == null)
                        this.instance = new MyPools();
                    return this.instance;
                };
                /**
                 * 注册一个缓存池
                 * */
                MyPools.prototype.registF = function (Name, max) {
                    if (max === void 0) { max = 50; }
                    if (this.Dic[Name] != null) {
                        this.removeF(Name);
                    }
                    this.Dic[Name] = [];
                    this.Dic_Max[Name] = max;
                };
                MyPools.prototype.hasPool = function (Name) {
                    return this.Dic[Name] != null;
                };
                /**
                 * 从缓存池中获取一个元素
                 * */
                MyPools.prototype.getFromPool = function (Name) {
                    var arg = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        arg[_i - 1] = arguments[_i];
                    }
                    if (this.Dic[Name] == null) {
                        return null;
                    }
                    if (this.Dic[Name].length == 0) {
                        return null;
                    }
                    return this.Dic[Name].shift();
                };
                /**
                * 还回一个
                * */
                MyPools.prototype.returnToPool = function (Name, one) {
                    if (this.Dic[Name] == null || this.Dic[Name].length >= this.Dic_Max[Name]) {
                        one = Tools.Tool_ObjUtils.destroyF_One(one);
                        return;
                    }
                    this.Dic[Name].push(one);
                };
                /**
                 * 删除一个缓存池
                 * */
                MyPools.prototype.removeF = function (Name) {
                    if (this.Dic[Name] != null) {
                        Tools.Tool_ObjUtils.destroyF_One(this.Dic[Name]);
                        delete this.Dic[Name];
                    }
                };
                MyPools.prototype.destroyF = function () {
                    MyPools.instance = null;
                    if (this.Dic == null) {
                        return;
                    }
                    for (var Name in this.Dic) {
                        this.removeF(Name);
                    }
                    this.Dic = null;
                };
                return MyPools;
            }());
            Tools.MyPools = MyPools;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyPools.js.map