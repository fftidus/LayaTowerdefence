var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Handler = laya.utils.Handler;
        var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
        var Tool_Function = com.MyClass.Tools.Tool_Function;
        var MySourceManagerOne = /** @class */ (function () {
            function MySourceManagerOne() {
                this.Busy = false;
                this.Arr_waite = [];
                this.countAddTime = 0;
                this.SM = MyClass.MySourceManager.instance;
            }
            MySourceManagerOne.onNewOne = function (mso) {
                for (var i = 0; i < MySourceManagerOne.waiteClear.length; i++) {
                    MySourceManagerOne.waiteClear[i].onRemoveSources(mso.Arr_source);
                }
            };
            MySourceManagerOne.onClearWaite = function () {
                while (MySourceManagerOne.waiteClear.length > 0) {
                    MySourceManagerOne.waiteClear[0].onRealDestroyF();
                    MySourceManagerOne.waiteClear.shift();
                }
            };
            MySourceManagerOne.prototype.addSource = function (arr, f, needLoadingMC, _autoClear) {
                if (_autoClear === void 0) { _autoClear = true; }
                var arg = [];
                for (var _i = 4; _i < arguments.length; _i++) {
                    arg[_i - 4] = arguments[_i];
                }
                if (this.Busy) {
                    this.Arr_waite.push([arr, f, needLoadingMC, _autoClear]);
                    return;
                }
                this.Busy = true;
                this.autoClearLoadView = _autoClear;
                if (this.autoClearLoadView == true) {
                    this.Fun = f;
                }
                var j;
                for (var i = 0; i < arr.length; i++) {
                    if (this.Arr_source && this.countAddTime > 0) { //countAddTime>0表示已经加载过一次，=0表示即使有Arr_source也是由外部直接赋值，并没有加载过
                        var re = false;
                        for (j = 0; j < this.Arr_source.length; j++) {
                            if (Tool_ObjUtils.isEqual(arr[i], this.Arr_source[j]) == true) {
                                arr.splice(i, 1);
                                re = true;
                                break;
                            }
                        }
                        if (re == true) {
                            i--;
                            continue;
                        }
                    }
                    for (j = i + 1; j < arr.length; j++) {
                        if (Tool_ObjUtils.isEqual(arr[i], arr[j]) == true) {
                            arr.splice(j, 1);
                        }
                    }
                }
                if (this.Arr_source == null)
                    this.Arr_source = arr.concat();
                else
                    this.Arr_source = this.Arr_source.concat(arr);
                if (this.countAddTime == 0) {
                    arr = this.Arr_source;
                }
                this.countAddTime++;
                this.SM.addTexture(arr, Handler.create(this, this.addOver));
                MySourceManagerOne.onNewOne(this);
                if (MySourceManagerOne.FunGetLoadView) {
                    if (arg.length == 0)
                        this.LView = Tool_Function.onRunFunction(MySourceManagerOne.FunGetLoadView, arr.length, needLoadingMC);
                    else
                        this.LView = Tool_Function.onRunFunction(MySourceManagerOne.FunGetLoadView, [arr.length, needLoadingMC].concat(arg));
                }
                if (this.LView == null) {
                    if (typeof needLoadingMC == "number") {
                        this.LView = new com.MyClass.MyView.LoadingView(arr.length, needLoadingMC);
                    }
                    else if (needLoadingMC == true) {
                        this.LView = new com.MyClass.MyView.LoadingView(arr.length, 0);
                    }
                }
            };
            MySourceManagerOne.prototype.addOver = function () {
                if (this.autoClearLoadView == false)
                    return;
                if (this.SM == null)
                    return; //已经被清理
                if (this.LView) {
                    this.LView.destroyF();
                    this.LView = null;
                }
                if (this.Fun) {
                    Tool_Function.onRunFunction(this.Fun);
                }
                this.Fun = null;
                this.Busy = false;
                if (this.Arr_waite.length > 0) {
                    var arr = this.Arr_waite[0];
                    this.Arr_waite.shift();
                    this.addSource(arr[0], arr[1], arr[2], arr[3]);
                }
                MySourceManagerOne.onClearWaite();
            };
            MySourceManagerOne.prototype.onRemoveLoadView = function () {
                this.autoClearLoadView = true;
                this.addOver();
            };
            MySourceManagerOne.prototype.deleteSourceFromArray = function (arr) {
                //			SM.removeTextures(arr);
                arr.forEach(function (item, index, array) {
                    for (var i = 0; i < this.Arr_source.length; i++) {
                        if (this.Arr_source[i][0] == item) {
                            this.Arr_source.removeAt(i--);
                        }
                    }
                });
            };
            MySourceManagerOne.prototype.getSwf = function (name) {
                return this.SM.getSwf(name);
            };
            MySourceManagerOne.prototype.setSwfAutoSmooth = function (name) {
            };
            MySourceManagerOne.prototype.getTextureFromSWF = function (swfName, name) {
                return this.SM.getTextureFromSWF(swfName, name);
            };
            MySourceManagerOne.prototype.getImgFromSwf = function (swfName, imgname) {
                return this.SM.getImgFromSwf(swfName, imgname);
            };
            MySourceManagerOne.prototype.getS9FromSwf = function (swf, s9name) {
                return this.SM.getS9FromSwf(swf, s9name);
            };
            MySourceManagerOne.prototype.getSprFromSwf = function (swfName, sprname) {
                return this.SM.getSprFromSwf(swfName, sprname);
            };
            MySourceManagerOne.prototype.getMcFromSwf = function (swfName, mcname) {
                return this.SM.getMcFromSwf(swfName, mcname);
            };
            MySourceManagerOne.prototype.getObjFromSwf = function (swfName, objName) {
                if (objName.indexOf("img_") == 0)
                    return this.getImgFromSwf(swfName, objName);
                if (objName.indexOf("spr_") == 0)
                    return this.getSprFromSwf(swfName, objName);
                if (objName.indexOf("mc_") == 0)
                    return this.getMcFromSwf(swfName, objName);
                if (objName.indexOf("s9_") == 0)
                    return this.getS9FromSwf(swfName, objName);
                return null;
            };
            MySourceManagerOne.prototype.getJson = function (jName) {
                return this.SM.getJson(jName);
            };
            /** 去掉资源 **/
            MySourceManagerOne.prototype.onRemoveSources = function (source) {
                if (this.Arr_source == null)
                    return;
                var arrNoRepeat = [];
                this.Arr_source.forEach(function (item, index, arr) {
                    if (item == null)
                        return;
                    var re = false;
                    source.forEach(function (item2, index2, arr2) {
                        if (com.MyClass.Tools.Tool_ArrayUtils.isEqual(item, item2) == true)
                            re = true;
                    });
                    if (re == false) {
                        this.Arr_source[index] = null;
                        arrNoRepeat.push(item);
                    }
                });
                if (arrNoRepeat.length > 0) {
                    MyClass.MySourceManager.instance.removeTextures(arrNoRepeat);
                }
            };
            MySourceManagerOne.prototype.destroyF = function () {
                this.Fun = null;
                if (this.LView) {
                    this.LView.destroyF();
                    this.LView = null;
                }
                if (this.SM) {
                    MySourceManagerOne.waiteClear.push(this);
                    this.SM = null;
                }
            };
            MySourceManagerOne.prototype.onRealDestroyF = function () {
                if (this.Arr_source && this.Arr_source.length > 0) {
                    MyClass.MySourceManager.instance.removeTextures(this.Arr_source);
                }
            };
            MySourceManagerOne.waiteClear = [];
            return MySourceManagerOne;
        }());
        MyClass.MySourceManagerOne = MySourceManagerOne;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MySourceManagerOne.js.map