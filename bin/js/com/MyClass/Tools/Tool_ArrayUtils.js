var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Tool_ArrayUtils = /** @class */ (function () {
                function Tool_ArrayUtils() {
                }
                /**
                 * 数组的缓存
                 * */
                Tool_ArrayUtils.getNewArrayFromPool = function () {
                    var arg = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        arg[_i] = arguments[_i];
                    }
                    var arr;
                    if (Tools.MyPools.getInstance().hasPool("Array") == false) {
                        arr = Tools.MyPools.getInstance().getFromPool("Array");
                    }
                    if (arr == null) {
                        arr = [];
                    }
                    if (arg.length > 0) {
                        var i;
                        for (i = 0; i < arg.length; i++) {
                            arr[i] = arg[i];
                        }
                    }
                    return arr;
                };
                Tool_ArrayUtils.returnArrayToPool = function (arr) {
                    if (arr == null) {
                        return;
                    }
                    if (Tools.MyPools.getInstance().hasPool("Array") == false) {
                        return;
                    }
                    arr.length = 0;
                    Tools.MyPools.getInstance().returnToPool("Array", arr);
                };
                Tool_ArrayUtils.copyArr = function (arr) {
                    if (arr == null)
                        return null;
                    var out = [];
                    for (var i = 0; i < arr.length; i++) {
                        out[i] = Tools.Tool_ObjUtils.CopyF(arr[i]);
                    }
                    return out;
                };
                Tool_ArrayUtils.isEqual = function (arr1, arr2) {
                    if (arr1 == null && arr2 == null)
                        return true;
                    if (arr1 == null || arr2 == null)
                        return false;
                    if (arr1.length != arr2.length)
                        return false;
                    for (var i = 0; i < arr1.length; i++) {
                        if (Tools.Tool_ObjUtils.isEqual(arr1[i], arr2[i]) == false)
                            return false;
                    }
                    return true;
                };
                /** 删除重复数字 **/
                Tool_ArrayUtils.onRemoveLoopNumber = function (arr) {
                    var dic = {};
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] instanceof Number) {
                            if (dic[arr[i]] == true)
                                arr.splice(i--, 1);
                            else
                                dic[arr[i]] = true;
                        }
                    }
                };
                /** 从数组中取一个随机值 */
                Tool_ArrayUtils.getRadomOneFromArray = function (arr) {
                    var i = Tools.Tool_Function.onForceConvertType(Math.random() * arr.length);
                    return arr[i];
                };
                return Tool_ArrayUtils;
            }());
            Tools.Tool_ArrayUtils = Tool_ArrayUtils;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Tool_ArrayUtils.js.map