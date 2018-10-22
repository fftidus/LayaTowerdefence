var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Tool_ObjUtils = /** @class */ (function () {
                function Tool_ObjUtils() {
                }
                Tool_ObjUtils.destroyF_One = function (obj) {
                    if (obj == null)
                        return null;
                    if (obj instanceof Array) {
                        for (var i = 0; i < obj.length; i++) {
                            Tool_ObjUtils.destroyF_One(obj[i]);
                        }
                        obj.length = 0;
                        Tools.Tool_ArrayUtils.returnArrayToPool(obj);
                    }
                    else if (obj instanceof Dictionary) {
                        for (var i_1 = 0; i_1 < obj.keys.length; i_1++) {
                            this.destroyF_One(obj.get[obj.keys[i_1]]);
                            if (typeof obj.keys[i_1] === "string" || typeof obj.keys[i_1] === "number") { }
                            else
                                this.destroyF_One(obj.keys[i_1]);
                            obj.keys.splice(i_1--, 1);
                        }
                    }
                    else if (typeof obj === "number") {
                        return 0;
                    }
                    else if (this.hasFunction(obj, "destroyF") == true) {
                        obj.destroyF();
                    }
                    else if (obj instanceof laya.utils.Handler) {
                        obj.clear();
                    }
                    else if (obj instanceof starling.Sprite) {
                        this.destroyDisplayObj(obj);
                    }
                    else if (obj instanceof laya.display.Text) {
                        obj.removeSelf();
                    }
                    else if (obj instanceof laya.display.Sprite) {
                        obj.removeSelf();
                    }
                    else if (obj instanceof Object) {
                        for (var n in obj) {
                            if (n == "__proto__")
                                continue;
                            this.destroyF_One(obj[n]);
                            delete obj[n];
                            if (typeof n === "string" || typeof n === "number") { }
                            else
                                this.destroyF_One(n);
                        }
                        this.returnObjectToPool(obj);
                    }
                    return null;
                };
                Tool_ObjUtils.destroyDisplayObj = function (obj) {
                    if (obj != null) {
                        obj.removeChildren();
                        obj.removeFromParent();
                    }
                };
                Tool_ObjUtils.hasFunction = function (target, method) {
                    var className = Tools.Tool_Function.getLastClassName(target);
                    if (this.Dic_HaveFun[className + "*" + method] == null) {
                        try {
                            this.Dic_HaveFun[className + "*" + method] = target[method] instanceof Function;
                        }
                        catch (e) {
                            this.Dic_HaveFun[className + "*" + method] = false;
                        }
                    }
                    return this.Dic_HaveFun[className + "*" + method];
                };
                Tool_ObjUtils.isEqual = function (obj1, obj2) {
                    if (obj1 == null && obj2 == null)
                        return true;
                    if (obj1 == null || obj2 == null)
                        return false;
                    if (obj1 instanceof Array)
                        return Tools.Tool_ArrayUtils.isEqual(obj1, obj2);
                    if (obj1 instanceof String) {
                        return obj1 == obj2;
                    }
                    if (obj1 instanceof Number && obj2 instanceof Number) {
                        var num1 = Tools.Tool_Function.onChangeInstance(obj1, "num");
                        var num2 = Tools.Tool_Function.onChangeInstance(obj2, "num");
                        if (Math.abs(num1 - num2) < 0.00001)
                            return true;
                        return false;
                    }
                    if (obj1 instanceof Object)
                        return Tool_ObjUtils.isEqualObj(obj1, obj2);
                    return obj1 == obj2;
                };
                Tool_ObjUtils.isEqualObj = function (dic1, dic2) {
                    var dicHave = {};
                    var haveWrong = false;
                    for (var n in dic1) {
                        dicHave[n] = true;
                        if (Tool_ObjUtils.isEqual(dic1[n], dic2[n]) == false) {
                            haveWrong = true;
                            break;
                        }
                    }
                    for (var n in dic2) {
                        if (dicHave[n] != true) {
                            haveWrong = true;
                            break;
                        }
                    }
                    if (haveWrong == true)
                        return false;
                    return true;
                };
                Tool_ObjUtils.CopyF = function (obj, noCopy) {
                    if (noCopy === void 0) { noCopy = false; }
                    if (obj instanceof String || obj instanceof Number || obj == null || obj instanceof Boolean)
                        return obj;
                    if (obj instanceof Array) {
                        if (noCopy)
                            return Tools.Tool_ArrayUtils.copyArr(obj);
                        return Tools.Tool_ArrayUtils.copyArr(obj);
                    }
                    if (obj instanceof Object) {
                        var out = Tool_ObjUtils.getNewObjectFromPool();
                        for (var key in obj) {
                            out[key] = Tool_ObjUtils.CopyF(obj[key], noCopy);
                        }
                        return out;
                    }
                    if (noCopy)
                        return obj;
                    if (obj instanceof starling.Image) {
                        return com.MyClass.Tools.Tool_ImgUtils.cloneImage(obj);
                    }
                    if (obj instanceof starling.Sprite) {
                        return Tools.Tool_SpriteUtils.cloneSprite(obj);
                    }
                    return obj;
                };
                /** 合并
                 * @param obj 目标object
                 * @param tar 要被复制的tar
                 */
                Tool_ObjUtils.onComboObject = function (obj, tar, copy) {
                    if (obj == null || tar == null)
                        return;
                    for (var key in tar) {
                        if (tar[key] == null) {
                            continue;
                        }
                        if (obj[key] == null || Tools.Tool_Function.isTypeOf(obj[key], Number) == false || Tools.Tool_Function.isTypeOf(tar[key], Number) == false) {
                            if (copy == false)
                                obj[key] = tar[key];
                            else
                                obj[key] = this.CopyF(tar[key]);
                        }
                        else {
                            obj[key] += tar[key];
                        }
                    }
                };
                Tool_ObjUtils.onClearObj = function (obj) {
                    if (obj == null)
                        return;
                    for (var key in obj) {
                        obj[key] = this.destroyF_One(obj[key]);
                        delete obj[key];
                    }
                };
                Tool_ObjUtils.addColorFilter = function (tar, type, val) {
                    var fil;
                    var matrix;
                    if (type == this.ColorFilterType_gray) {
                        if (val == null)
                            val = 0;
                        matrix = [
                            0.3086, 0.6094, 0.0820, 0, val,
                            0.3086, 0.6094, 0.0820, 0, val,
                            0.3086, 0.6094, 0.0820, 0, val,
                            0, 0, 0, 1, 0
                        ];
                    }
                    else if (type == this.ColorFilterType_light) {
                        matrix = [
                            1, 0, 0, 0, val,
                            0, 1, 0, 0, val,
                            0, 0, 1, 0, val,
                            0, 0, 0, 1, 0
                        ];
                    }
                    else if (type == this.ColorFilterType_fanse) {
                        matrix = [
                            -1, 0, 0, 0, 255,
                            0, -1, 0, 0, 255,
                            0, 0, -1, 0, 255,
                            0, 0, 0, 1, 0
                        ];
                    }
                    else if (type == this.ColorFilterType_color) {
                        matrix = [
                            starling.Color.getRed(val) / 255, 0.6094, 0.0820, 0, 0,
                            0.3086, starling.Color.getGreen(val) / 255, 0.0820, 0, 0,
                            0.3086, 0.6094, starling.Color.getBlue(val) / 255, 0, 0,
                            0, 0, 0, 1, 0
                        ];
                    }
                    else
                        return null;
                    if (tar.filters != null) {
                        for (var i = tar.filters.length; i >= 0; i--) {
                            if (tar.filters[i] instanceof laya.filters.ColorFilter) {
                                tar.filters.splice(i--, 1);
                            }
                        }
                    }
                    fil = new laya.filters.ColorFilter(matrix);
                    if (tar.filters == null)
                        tar.filters = [fil];
                    else
                        tar.filters.push(fil);
                    return fil;
                };
                /**
                 * 缓存
                 * */
                Tool_ObjUtils.getNewObjectFromPool = function () {
                    var arg = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        arg[_i] = arguments[_i];
                    }
                    var obj;
                    if (Tools.MyPools.getInstance().hasPool("Object") == false) {
                        obj = Tools.MyPools.getInstance().getFromPool("Object");
                    }
                    if (obj == null) {
                        obj = {};
                    }
                    if (arg.length > 0) {
                        for (var i = 0; i < arg.length; i += 2) {
                            obj[arg[i]] = arg[i + 1];
                        }
                    }
                    return obj;
                };
                /**
                 * 手动清理后再调用，本方法不自动清理！！！！
                 * */
                Tool_ObjUtils.returnObjectToPool = function (obj) {
                    if (Tools.MyPools.getInstance().hasPool("Object") == false) {
                        return;
                    }
                    Tools.MyPools.getInstance().returnToPool("Object", obj);
                };
                Tool_ObjUtils.Dic_HaveFun = new Object();
                Tool_ObjUtils.ColorFilterType_gray = "灰度";
                Tool_ObjUtils.ColorFilterType_light = "亮度";
                Tool_ObjUtils.ColorFilterType_fanse = "反色";
                Tool_ObjUtils.ColorFilterType_color = "颜色";
                return Tool_ObjUtils;
            }());
            Tools.Tool_ObjUtils = Tool_ObjUtils;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Tool_ObjUtils.js.map