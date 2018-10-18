var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Tool_StringBuild = /** @class */ (function () {
                function Tool_StringBuild() {
                }
                Tool_StringBuild.replaceSTR = function (str, str1, str2) {
                    var out = "";
                    var arr = str.split(str1);
                    for (var i = 0; i < arr.length; i++) {
                        if (i > 0)
                            out += str2;
                        out += arr[i];
                    }
                    return out;
                };
                Tool_StringBuild.onRemoveEnterSpace = function (str) {
                    var arr = ["\n", "\t", "\r", " ", "	"];
                    while (arr.length > 0) {
                        str = this.replaceSTR(str, arr[0], "");
                        arr.shift();
                    }
                    return str;
                };
                Tool_StringBuild.rebuild_by_length = function (str, len, _chinese) {
                    var out = "";
                    if (_chinese == false) {
                        out = str.substr(0, len);
                    }
                    else {
                        var nowL = 0;
                        var count = 0;
                        while (count < str.length) {
                            if (nowL >= len)
                                break;
                            var char = str.charAt(count);
                            var code = str.charCodeAt(count);
                            out += char;
                            if (code >= 10000)
                                nowL += 2;
                            else
                                nowL += 1;
                            count++;
                        }
                    }
                    return out;
                };
                Tool_StringBuild.getNewSTRBySlip = function (str1, str2) {
                    var arr = str1.split(str2);
                    str1 = "";
                    while (arr.length > 0) {
                        str1 += arr[0];
                        arr.shift();
                    }
                    return str1;
                };
                Tool_StringBuild.getArr_By_split = function (str1, str2, _changeInstance) {
                    if (_changeInstance === void 0) { _changeInstance = null; }
                    var arr = str1.split(str2);
                    if (_changeInstance) {
                        var i;
                        var l = arr.length;
                        for (i = 0; i < l; i++) {
                            if (_changeInstance == "int")
                                arr[i] = Tools.Tool_Function.onChangeInstance(arr[i]);
                            else if (_changeInstance == "Number")
                                arr[i] = Tools.Tool_Function.onChangeInstance(arr[i], "num");
                        }
                    }
                    return arr;
                };
                Tool_StringBuild.onInsertF = function (str, index, strTar) {
                    var str0 = str.slice(0, index);
                    var str1 = str.slice(index);
                    return str0 + strTar + str1;
                };
                return Tool_StringBuild;
            }());
            Tools.Tool_StringBuild = Tool_StringBuild;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Tool_StringBuild.js.map