var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Tool_SpriteUtils = /** @class */ (function () {
                function Tool_SpriteUtils() {
                }
                /*** 替换父对象层级并add到自己上 ***/
                Tool_SpriteUtils.onAddchild_ReplaceParent = function (_parent, child) {
                    _parent.x = child.x;
                    _parent.y = child.y;
                    if (child.parent) {
                        child.parent.addChildAt(_parent, child.parent.getChildIndex(child));
                    }
                    _parent.addChild(child);
                    child.x = child.y = 0;
                };
                /*
                * 获得数字
                */
                Tool_SpriteUtils.onGetImageNum = function (fName, spr, _url, _Parentswf) {
                    if (_Parentswf === void 0) { _Parentswf = null; }
                    var tmp = spr.getChildByName(_url);
                    if (tmp == null)
                        return null;
                    var classLink = tmp.classLink;
                    var arr = classLink.split("_"); //img_25_颜色FF99000_对齐中
                    if (fName == null)
                        fName = arr[1];
                    if (_Parentswf == null) {
                        for (var i = 2; i < arr.length; i++) {
                            if (arr[i].indexOf("swf") == 0) {
                                _Parentswf = arr[i].slice(3);
                                if (_Parentswf == "SWF")
                                    _Parentswf += "_" + arr[i + 1];
                                break;
                            }
                        }
                    }
                    var num = new MyClass.MyView.ImageNum(fName, _Parentswf);
                    num.setValue("父对象", tmp);
                    if (arr.length > 2) {
                        var info = {};
                        for (var j = 2; j < arr.length; j++) {
                            var one = arr[j];
                            if (one.indexOf("颜色") == 0) {
                                one = one.slice(2);
                                if (one.indexOf("0x") != 0)
                                    one = "0x" + one;
                                num.setValue("颜色", Tools.Tool_Function.onChangeInstance(one));
                            }
                            else if (one.indexOf("对齐") == 0) {
                                num.setValue("对齐", one.slice(2));
                            }
                        }
                    }
                    return num;
                };
                Tool_SpriteUtils.onGetAll_ImageNum = function (spr, fName, _Parentswf) {
                    if (fName === void 0) { fName = null; }
                    if (_Parentswf === void 0) { _Parentswf = null; }
                    var dic = {};
                    var arrChild = [];
                    for (var i = 0; i < spr.numChildren; i++) {
                        var c = spr.getChildAt(i);
                        var str = c.name;
                        if (str == null || str.indexOf("num_") != 0)
                            continue;
                        arrChild.push(str);
                    }
                    for (i = 0; i < arrChild.length; i++) {
                        str = arrChild[i];
                        var tmp = str.split("_"); //num,???,字体25,颜色xxx，对齐xxx，swf
                        var name = tmp[0] + "_" + tmp[1];
                        var info = { "fName": fName, "swf": _Parentswf };
                        for (var j = 2; j < tmp.length; j++) {
                            var one = tmp[j];
                            if (one.indexOf("字体") == 0)
                                info["fName"] = one.slice(2);
                            else if (one.indexOf("swf") == 0) {
                                var strSWF = "";
                                j++;
                                while (j < tmp.length) {
                                    if (strSWF.length > 0)
                                        strSWF += "_";
                                    strSWF += tmp[j++];
                                }
                                info["swf"] = strSWF;
                                break;
                            }
                            else if (one.indexOf("颜色") == 0) {
                                one = one.slice(2);
                                if (one.indexOf("0x") != 0)
                                    one = "0x" + one;
                                info["颜色"] = Tools.Tool_Function.onChangeInstance(one);
                            }
                            else if (one.indexOf("对齐") == 0)
                                info["对齐"] = one.slice(2);
                        }
                        var num = this.onGetImageNum(info["fName"], spr, str, info["swf"]);
                        if (info["颜色"] != null)
                            num.setValue("颜色", info["颜色"]);
                        if (info["对齐"] != null)
                            num.setValue("对齐", info["对齐"]);
                        dic[name] = num;
                    }
                    return dic;
                };
                /**
                 * 复制
                */
                Tool_SpriteUtils.cloneSprite = function (target) {
                    var numChilds = target.numChildren;
                    var sprite = new starling.Sprite();
                    var child;
                    for (var i = 0; i < numChilds; i++) {
                        child = target.getChildAt(i);
                        if (child instanceof starling.Sprite) {
                            sprite.addChild(Tool_SpriteUtils.cloneSprite(child));
                        }
                        else if (child instanceof starling.Image) {
                            sprite.addChild(Tools.Tool_ImgUtils.cloneImage(child));
                        }
                    }
                    sprite.x = target.x;
                    sprite.y = target.y;
                    sprite.width = target.width;
                    sprite.height = target.height;
                    sprite.skewX = target.skewX;
                    sprite.skewY = target.skewY;
                    sprite.alpha = target.alpha;
                    return sprite;
                };
                /**
                 * 获得meta数据
                * **/
                Tool_SpriteUtils.getMetaData_FromSPR = function (spr) {
                    var meta;
                    if (spr instanceof com.MyClass.MySwf.SwfSprite && spr.spriteData[0] instanceof Array == false)
                        meta = spr.spriteData[0];
                    return meta;
                };
                /** 获得按钮 **/
                Tool_SpriteUtils.getBtn = function (spr, url) {
                    var B;
                    var tmp = spr.getChildByName(url);
                    if (tmp == null)
                        return null;
                    B = new com.MyClass.MyView.BTN_Starling(tmp);
                    B.name = url;
                    return B;
                };
                /*** 替换父对象层级并add到自己上 ***/
                Tool_SpriteUtils.onAddchild_ChangeParent = function (spr, child) {
                    spr.x = child.x;
                    spr.y = child.y;
                    if (child.parent) {
                        child.parent.addChildAt(spr, child.parent.getChildIndex(child));
                    }
                    spr.addChild(child);
                    child.x = child.y = 0;
                };
                /** getBounds */
                Tool_SpriteUtils.getBounds = function (tar, parent) {
                    if (tar instanceof com.MyClass.MySwf.SwfS9Image || tar instanceof starling.Image) {
                        var rec_1 = new laya.maths.Rectangle();
                        rec_1.x = tar.x;
                        rec_1.y = tar.y;
                        rec_1.width = tar.width;
                        rec_1.height = tar.height;
                        return rec_1;
                    }
                    if (tar instanceof starling.Sprite) {
                        var x0 = 9999999;
                        var y0 = 9999999;
                        var x1 = -9999999;
                        var y1 = -9999999;
                        for (var i = 0; i < tar.numChildren; i++) {
                            var rec = Tool_SpriteUtils.getBounds(tar.getChildAt(i), null);
                            if (rec.x < x0) {
                                x0 = rec.x;
                            }
                            if (rec.x + rec.width > x1) {
                                x1 = rec.x + rec.width;
                            }
                            if (rec.y < y0) {
                                y0 = rec.y;
                            }
                            if (rec.y + rec.height > y1) {
                                y1 = rec.y + rec.height;
                            }
                        }
                        if (rec == null) {
                            rec = new laya.maths.Rectangle();
                            rec.x = tar.x;
                            rec.y = tar.y;
                            return rec;
                        }
                        rec.x = x0 + tar.x;
                        rec.y = y0 + tar.y;
                        rec.width = x1 - x0;
                        rec.height = y1 - y0;
                        return rec;
                    }
                    return tar.getBounds();
                };
                return Tool_SpriteUtils;
            }());
            Tools.Tool_SpriteUtils = Tool_SpriteUtils;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Tool_SpriteUtils.js.map