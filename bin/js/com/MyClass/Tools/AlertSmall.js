var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var MyViewTXController = com.MyClass.MyView.MyViewTXController;
            var MyMouseEventStarling = com.MyClass.MyView.MyMouseEventStarling;
            var Handler = laya.utils.Handler;
            var AlertSmall = /** @class */ (function () {
                function AlertSmall(str) {
                    this.INFO = str;
                    this.mcBack = MyClass.MySourceManager.getInstance().getMcFromSwf("SWF_Default", "mc_AlertSmall");
                    if (this.mcBack == null) {
                        return;
                    }
                    com.MyClass.MyView.LayerStarlingManager.instance.LayerView.addChild(this.mcBack);
                    this.mt = new MyViewTXController(this.mcBack);
                    this.mt.setText("tx_info", "");
                    this.mcBack.completeFunction = Handler.create(this, this.stopF);
                    this.mcBack.loop = false;
                    this.mcBack.play();
                }
                AlertSmall.showF = function (str, clearOther, endFlag) {
                    if (clearOther === void 0) { clearOther = true; }
                    if (endFlag === void 0) { endFlag = null; }
                    if (clearOther == true)
                        this.clearAllF();
                    if (this.Vec_info == null)
                        this.Vec_info = [];
                    if (str != null)
                        this.Vec_info.push(str);
                    this.nextF();
                };
                AlertSmall.clearAllF = function () {
                    this.Vec_info = null;
                    if (this.NowMC)
                        this.NowMC.clickF(null);
                };
                AlertSmall.removeF = function () {
                    this.NowMC = null;
                    this.nextF();
                };
                AlertSmall.nextF = function () {
                    if (this.Vec_info == null)
                        return;
                    if (this.NowMC != null)
                        return;
                    if (this.Vec_info.length == 0) {
                        this.Vec_info = null;
                        return;
                    }
                    try {
                        this.NowMC = new AlertSmall(this.Vec_info[0]);
                        this.Vec_info.shift();
                        if (this.Vec_info.length == 0)
                            this.Vec_info = null;
                    }
                    catch (e) {
                        this.Vec_info = null;
                    }
                };
                AlertSmall.prototype.stopF = function () {
                    if (this.mcBack == null)
                        return;
                    this.mcBack.stop();
                    this.mt.setText("tx_info", this.INFO);
                    this.mme = new MyMouseEventStarling(this.mcBack);
                    this.mme.setValue("点击", Handler.create(this, this.clickF));
                    MyClass.MainManager.getInstence().add_delayFunction(Handler.create(this, this.clickF), com.MyClass.Config.playSpeedTrue * 2);
                };
                AlertSmall.prototype.clickF = function (e) {
                    if (e === void 0) { e = null; }
                    if (this.mcBack == null)
                        return;
                    this.mcBack = Tools.Tool_ObjUtils.destroyF_One(this.mcBack);
                    this.mt = Tools.Tool_ObjUtils.destroyF_One(this.mt);
                    this.mme = Tools.Tool_ObjUtils.destroyF_One(this.mme);
                    AlertSmall.removeF();
                };
                return AlertSmall;
            }());
            Tools.AlertSmall = AlertSmall;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=AlertSmall.js.map