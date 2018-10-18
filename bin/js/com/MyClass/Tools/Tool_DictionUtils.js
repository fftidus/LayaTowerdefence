var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Tool_DictionUtils = /** @class */ (function () {
                function Tool_DictionUtils() {
                }
                Tool_DictionUtils.onGetDicFromObj = function (obj) {
                    var dic = new Dictionary();
                    this.onCheckAllDic(obj, function (key, val) {
                        dic.set(key, val);
                    });
                    return dic;
                };
                /** key和value都复制 */
                Tool_DictionUtils.copyDic = function (dic) {
                    if (dic == null)
                        return null;
                    var out = new Dictionary();
                    for (var i = 0; i < dic.keys.length; i++) {
                        var m = Tools.Tool_ObjUtils.CopyF(dic.keys[i]);
                        out.set(m, Tools.Tool_ObjUtils.CopyF(dic.get(dic.keys[i])));
                    }
                    return out;
                };
                /** 不复制key */
                Tool_DictionUtils.copySimple = function (dic) {
                    if (dic == null)
                        return null;
                    var out = new Dictionary();
                    for (var i = 0; i < dic.keys.length; i++) {
                        var m = dic.keys[i];
                        out.set(m, Tools.Tool_ObjUtils.CopyF(dic.get(dic.keys[i]), true));
                    }
                    return out;
                };
                Tool_DictionUtils.isEqual = function (dic1, dic2) {
                    var dicHave = new Dictionary();
                    for (var n in dic1) {
                        dicHave[n] = true;
                        if (Tools.Tool_ObjUtils.isEqual(dic1[n], dic2[n]) == false)
                            return false;
                    }
                    for (n in dic2) {
                        if (dicHave[n] == true)
                            continue;
                        return false;
                    }
                    return true;
                };
                Tool_DictionUtils.getKeySort = function (dic) {
                    var arrKey = [];
                    if (dic instanceof Dictionary) {
                        for (var i = 0; i < dic.keys.length; i++) {
                            arrKey.push(dic.keys[i]);
                        }
                    }
                    else {
                        for (var key in dic) {
                            arrKey.push(key);
                        }
                    }
                    arrKey.sort();
                    return arrKey;
                };
                Tool_DictionUtils.onCheckAllDic = function (dic, f) {
                    if (dic instanceof Dictionary) {
                        for (var i = 0; i < dic.keys.length; i++) {
                            var key = dic.keys[i];
                            var tar = dic.get(key);
                            Tools.Tool_Function.onRunFunction(f, [key, tar]);
                        }
                    }
                    else {
                        for (key in dic) {
                            Tools.Tool_Function.onRunFunction(f, [key, dic[key]]);
                        }
                    }
                };
                return Tool_DictionUtils;
            }());
            Tools.Tool_DictionUtils = Tool_DictionUtils;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Tool_DictionUtils.js.map