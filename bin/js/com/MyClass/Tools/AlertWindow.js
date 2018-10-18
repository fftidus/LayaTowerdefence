var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var MySourceManagerOne = com.MyClass.MySourceManagerOne;
            var BTNControllerStarling = com.MyClass.MyView.BTNControllerStarling;
            var AlertWindow = /** @class */ (function () {
                function AlertWindow(str, viewText, fok, okVal, haveno, fno, noVal, mustOrg, noAni) {
                    if (fok === void 0) { fok = null; }
                    if (okVal === void 0) { okVal = null; }
                    if (haveno === void 0) { haveno = false; }
                    if (fno === void 0) { fno = null; }
                    if (noVal === void 0) { noVal = null; }
                    if (mustOrg === void 0) { mustOrg = false; }
                    if (noAni === void 0) { noAni = false; }
                    this.Busy = false;
                    this.simple = false;
                    com.MyClass.MyView.MyTextInput.onHideF(true);
                    this.FOK = fok;
                    this.ValOK = okVal;
                    this.FNO = fno;
                    this.ValNO = noVal;
                    this.HaveNO = haveno;
                    this.initStarlingVer(str, viewText, noAni);
                }
                AlertWindow.showF = function (str, viewText, fok, okVal, haveno, fno, noVal) {
                    if (fok === void 0) { fok = null; }
                    if (okVal === void 0) { okVal = null; }
                    if (haveno === void 0) { haveno = false; }
                    if (fno === void 0) { fno = null; }
                    if (noVal === void 0) { noVal = null; }
                    if (this.Instance != null) {
                        this.Arr_Waite.push([str, viewText, fok, okVal, haveno, fno, noVal]);
                        return;
                    }
                    this.Instance = new AlertWindow(str, viewText, fok, okVal, haveno, fno, noVal);
                };
                AlertWindow.showSimpleF = function (str, viewText, fok, okVal, haveno, fno, noVal, mustOrg, noAni) {
                    if (fok === void 0) { fok = null; }
                    if (okVal === void 0) { okVal = null; }
                    if (haveno === void 0) { haveno = false; }
                    if (fno === void 0) { fno = null; }
                    if (noVal === void 0) { noVal = null; }
                    if (mustOrg === void 0) { mustOrg = true; }
                    if (noAni === void 0) { noAni = false; }
                    var a = new AlertWindow(str, viewText, fok, okVal, haveno, fno, noVal, mustOrg, noAni);
                    a.simple = true;
                };
                AlertWindow.clearF = function () {
                    this.Arr_Waite = [];
                    if (this.Instance) {
                        this.Instance.clickF(-1);
                        this.Instance = null;
                    }
                };
                AlertWindow.prototype.tover = function () {
                    this.Busy = false;
                };
                AlertWindow.prototype.clickF = function (n) {
                    if (this.Busy)
                        return;
                    com.MyClass.MyView.MyTextInput.onHideF(false);
                    this.Layer2 = Tools.Tool_ObjUtils.destroyF_One(this.Layer2);
                    this.Spr = Tools.Tool_ObjUtils.destroyF_One(this.Spr);
                    if (this.BC2) {
                        this.BC2.destroyF();
                        this.BC2 = null;
                    }
                    this.MSO = null;
                    if (n == 0 && this.FOK != null) {
                        if (this.ValOK != null)
                            Tools.Tool_Function.onRunFunction(this.FOK, this.ValOK);
                        else
                            Tools.Tool_Function.onRunFunction(this.FOK);
                    }
                    else if (n == 1 && this.FNO != null) {
                        if (this.ValNO != null)
                            Tools.Tool_Function.onRunFunction(this.FNO, this.ValNO);
                        else
                            Tools.Tool_Function.onRunFunction(this.FNO);
                    }
                    this.FOK = null;
                    this.FNO = null;
                    if (this.simple == false) {
                        AlertWindow.Instance = null;
                        if (AlertWindow.Arr_Waite.length > 0) {
                            var arr = AlertWindow.Arr_Waite[0];
                            AlertWindow.Arr_Waite.splice(0, 1);
                            AlertWindow.showF(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
                        }
                    }
                };
                //-------------------------------------------------------------------------
                AlertWindow.prototype.initStarlingVer = function (str, viewText, noAni) {
                    this.MSO = new MySourceManagerOne();
                    this.Spr = this.MSO.getSprFromSwf("SWF_Default", "spr_AlertWin");
                    if (this.Spr == null) {
                        this.clickF(0);
                        return;
                    }
                    this.Layer2 = new starling.Sprite();
                    com.MyClass.MyView.LayerStarlingManager.instance.LayerTop.addChild(this.Layer2);
                    if (MyClass.Config.TypeFit == 2) {
                        var sx = MyClass.Config.deviceWidth / MyClass.Config.stageW;
                        var sy = MyClass.Config.deviceHeight / MyClass.Config.stageH;
                        if (sx < sy) { //pad2类似方形屏幕
                            this.Layer2.scaleX = MyClass.Config.stageScaleInfo.屏幕w / MyClass.Config.stageW;
                        }
                        else if (sx > sy) { //宽屏
                            this.Layer2.scaleY = MyClass.Config.stageScaleInfo.屏幕h / MyClass.Config.stageH;
                        }
                    }
                    this.Layer2.addChild(this.Spr);
                    var TX;
                    TX = this.Spr.getChildByName("t1");
                    TX.text = str;
                    if (viewText && viewText["title"]) {
                        TX = this.Spr.getChildByName("tx_title");
                        TX.text = viewText["title"];
                    }
                    this.BtnOK = this.Spr.getChildByName("b1");
                    this.BtnNO = this.Spr.getChildByName("b2");
                    var dicImg = Tools.Tool_ObjUtils.getNewObjectFromPool();
                    var i = 0;
                    if (this.BtnOK instanceof com.MyClass.MySwf.SwfMovieClip) {
                        for (var j = 0; j < 2; j++) {
                            this.BtnOK.gotoAndStop(j);
                            i = 0;
                            while (i < this.BtnOK.numChildren) {
                                var cone = this.BtnOK.getChildAt(i);
                                if (cone.name && cone.name.indexOf("_img") == 0) {
                                    if (dicImg["ok"] == null)
                                        dicImg["ok"] = Tools.Tool_ArrayUtils.getNewArrayFromPool();
                                    dicImg["ok"].push(cone);
                                }
                                i++;
                            }
                        }
                    }
                    else {
                        while (i < this.BtnOK.numChildren) {
                            cone = this.BtnOK.getChildAt(i);
                            if (cone.name && cone.name.indexOf("_img") == 0) {
                                if (dicImg["ok"] == null)
                                    dicImg["ok"] = Tools.Tool_ArrayUtils.getNewArrayFromPool();
                                dicImg["ok"].push(cone);
                            }
                            i++;
                        }
                    }
                    if (this.BtnNO instanceof com.MyClass.MySwf.SwfMovieClip) {
                        for (j = 0; j < 2; j++) {
                            this.BtnNO.gotoAndStop(j);
                            i = 0;
                            while (i < this.BtnNO.numChildren) {
                                cone = this.BtnNO.getChildAt(i);
                                if (cone.name && cone.name.indexOf("_img") == 0) {
                                    if (dicImg["no"] == null)
                                        dicImg["no"] = Tools.Tool_ArrayUtils.getNewArrayFromPool();
                                    dicImg["no"].push(cone);
                                }
                                i++;
                            }
                        }
                    }
                    else {
                        while (i < this.BtnNO.numChildren) {
                            cone = this.BtnNO.getChildAt(i);
                            if (cone.name && cone.name.indexOf("_img") == 0) {
                                if (dicImg["no"] == null)
                                    dicImg["no"] = Tools.Tool_ArrayUtils.getNewArrayFromPool();
                                dicImg["no"].push(cone);
                            }
                            i++;
                        }
                    }
                    TX = this.BtnOK.getChildByName("tx_name");
                    if (viewText && viewText["ok"]) {
                        TX.text = viewText["ok"];
                        if (dicImg["ok"]) {
                            for (i = 0; i < dicImg["ok"].length; i++) {
                                var childarr = dicImg["ok"];
                                while (childarr.length > 0) {
                                    var childone = childarr.shift();
                                    if (this.BtnOK instanceof com.MyClass.MySwf.SwfMovieClip) {
                                        this.BtnOK.removeChildFromAllFrame(childone.classLink);
                                    }
                                    else {
                                        childone = Tools.Tool_ObjUtils.destroyF_One(childone);
                                    }
                                }
                            }
                        }
                    }
                    else if (dicImg["ok"] != null) {
                        TX = Tools.Tool_ObjUtils.destroyF_One(TX);
                    }
                    else
                        TX.text = "确定";
                    if (this.HaveNO == false) {
                        this.BtnOK.x += (this.BtnNO.width + this.BtnNO.x - this.BtnOK.x) / 2 - this.BtnOK.width / 2;
                        this.BtnNO = Tools.Tool_ObjUtils.destroyF_One(this.BtnNO);
                        this.BC2 = new BTNControllerStarling(this.Spr, [this.BtnOK], laya.utils.Handler.create(this, this.clickF));
                    }
                    else {
                        TX = this.BtnNO.getChildByName("tx_ok");
                        if (viewText && viewText["no"]) {
                            TX.text = viewText["no"];
                            if (dicImg["no"]) {
                                for (i = 0; i < dicImg["no"].length; i++) {
                                    childarr = dicImg["no"];
                                    while (childarr.length > 0) {
                                        childone = childarr.shift();
                                        if (this.BtnNO instanceof com.MyClass.MySwf.SwfMovieClip) {
                                            this.BtnNO.removeChildFromAllFrame(childone.classLink);
                                        }
                                        else {
                                            childone = Tools.Tool_ObjUtils.destroyF_One(childone);
                                        }
                                    }
                                }
                            }
                        }
                        else if (dicImg["no"] != null) {
                            TX = Tools.Tool_ObjUtils.destroyF_One(TX);
                        }
                        else
                            TX.text = "取消";
                        this.BC2 = new BTNControllerStarling(this.Spr, [this.BtnOK, this.BtnNO], laya.utils.Handler.create(this, this.clickF));
                    }
                    this.BC2.typeEventMop = "触发禁止";
                    if (noAni)
                        return;
                    var eff = new com.MyClass.Effect.MyEffect_WindowAppear_Scale(this.Spr, laya.utils.Handler.create(this, this.tover));
                    this.Busy = false;
                };
                AlertWindow.Arr_Waite = [];
                return AlertWindow;
            }());
            Tools.AlertWindow = AlertWindow;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=AlertWindow.js.map