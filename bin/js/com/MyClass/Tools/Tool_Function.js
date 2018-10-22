var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Tool_Function = /** @class */ (function () {
                function Tool_Function() {
                }
                Tool_Function.onRunFunction = function (f) {
                    var arg = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        arg[_i - 1] = arguments[_i];
                    }
                    if (f == null)
                        return;
                    if (f instanceof Function) {
                        return f.apply(null, arg);
                    }
                    else {
                        return f.runWith(arg);
                    }
                };
                /** 比较两个方法或handler是否相同 */
                Tool_Function.compareHandlers = function (f, fun) {
                    if (f == null && fun == null)
                        return true;
                    if (f instanceof laya.utils.Handler) {
                        if (fun == null || (fun instanceof laya.utils.Handler && fun == f)) {
                            return true;
                        }
                        else if (fun == null || (fun instanceof Function && f.method == fun)) {
                            return true;
                        }
                    }
                    else if (f instanceof Function) {
                        if (fun == null || (fun instanceof Function && fun == f)) {
                            return true;
                        }
                        else if (fun == null || (fun instanceof laya.utils.Handler && fun.method == f)) {
                            return true;
                        }
                    }
                    return false;
                };
                /**
                 * 设置点击开关
                */
                Tool_Function.onTouchable = function (tar, needParent, needChild) {
                    if (needParent === void 0) { needParent = true; }
                    if (needChild === void 0) { needChild = true; }
                    if (tar == null)
                        return;
                    tar.touchable = true;
                };
                Tool_Function.getLastClassName = function (tar) {
                    var className = tar.constructor.toString();
                    if (className.indexOf("(") != -1) {
                        className = className.slice(0, className.indexOf("("));
                        className = className.substr(className.indexOf(" ") + 1);
                    }
                    return className;
                };
                Tool_Function.getDefinationByName = function (name) {
                    return Laya.ClassUtils.getClass(name);
                };
                Tool_Function.isTypeOf = function (obj, type) {
                    if (obj == null)
                        return false;
                    if (obj == -0) {
                        if (typeof type === "number")
                            return true;
                        return false;
                    }
                    return this.getLastClassName(obj) == this.getLastClassName(type);
                };
                /** 角度转化为弧度 */
                Tool_Function.deg2rad = function (deg) {
                    return deg / 180.0 * Math.PI;
                };
                /** 弧度转换为角度 */
                Tool_Function.rad2deg = function (rad) {
                    return rad * 180 / Math.PI;
                };
                /** 强转类型 */
                Tool_Function.onForceConvertType = function (tar, type) {
                    if (type === void 0) { type = "int"; }
                    return Tool_Function.onChangeInstance(tar, type);
                };
                /** 强制转换类型 */
                Tool_Function.onChangeInstance = function (tar, type) {
                    if (type === void 0) { type = "int"; }
                    var tarType = typeof (tar);
                    if (type == "int") {
                        if (tarType == "number") {
                            return parseInt(tar + "");
                        }
                        else if (tarType === "string") {
                            return parseInt(tar);
                        }
                        else {
                            return 0;
                        }
                    }
                    else if (type == "num") {
                        if (tarType == "number") {
                            return tar;
                        }
                        else if (tarType === "string") {
                            return parseFloat(tar);
                        }
                        else {
                            return 0;
                        }
                    }
                    if (type == "str") {
                        return String(tar);
                    }
                    return null;
                };
                return Tool_Function;
            }());
            Tools.Tool_Function = Tool_Function;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Tool_Function.js.map