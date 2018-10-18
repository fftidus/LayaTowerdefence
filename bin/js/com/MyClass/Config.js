var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Config = /** @class */ (function () {
            function Config() {
            }
            Config.initF = function () {
                if (this.stageW < this.stageH)
                    Laya.stage.screenMode = "vertical";
                else
                    Laya.stage.screenMode = "horizontal";
                Laya.stage.scaleMode = laya.display.Stage.SCALE_NOBORDER;
                com.MyClass.MySourceManager.getInstance();
                console.log("屏幕大小：" + Laya.Browser.clientWidth + ":" + Laya.Browser.clientHeight);
                this.deviceWidth = Laya.Browser.clientWidth;
                this.deviceHeight = Laya.Browser.clientHeight;
                this.mStage.frameRate = this.playSpeedTrue == 60 ? "fast" : "slow";
                this.frameMS = 1000 / this.playSpeedTrue;
                var sx = this.deviceWidth / this.stageW;
                var sy = this.deviceHeight / this.stageH;
                if (this.TypeFit == 2) {
                    this.stageScale = sx > sy ? sx : sy;
                    this.stageScaleInfo = { "屏幕w": this.deviceWidth / Config.stageScale, "屏幕h": this.deviceHeight / Config.stageScale };
                    this.LogF("屏幕宽" + this.deviceWidth + "屏幕高" + this.deviceHeight + "，缩放=" + this.stageScale
                        + "，屏幕真实占用starling屏幕的：", this.stageScaleInfo);
                }
            };
            Config.onThrowNewErrorF = function (mess) {
            };
            Config.LogF = function () {
                var arg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arg[_i] = arguments[_i];
                }
                if (arg.length == 0)
                    return;
                var str = "";
                while (arg.length > 0) {
                    if (str.length > 0)
                        str += "  ";
                    str += this.toStringF(arg[0]);
                    arg.shift();
                }
                console.log(str);
                if (this.FunLog) {
                    this.FunLog.runWith(str);
                }
            };
            Config.toStringF = function (obj) {
                var str = "";
                if (typeof obj === "string" || typeof obj === "number" || obj == null || typeof obj === "boolean")
                    str += obj;
                else if (obj instanceof Array) {
                    str += "[";
                    for (var i = 0; i < obj.length; i++) {
                        if (i > 0)
                            str += ", ";
                        str += this.toStringF(obj[i]);
                    }
                    str += "]";
                }
                else if (obj instanceof laya.maths.Rectangle) {
                    str += "RECT::{x=" + obj.x + ",y=" + obj.y + ",w=" + obj.width + ",h=" + obj.height + "}";
                }
                else if (obj instanceof laya.maths.Point) {
                    str += "POINT::{x=" + obj.x + ",y=" + obj.y + "}";
                }
                else if (obj instanceof Dictionary || obj instanceof Object) {
                    str += "{";
                    i = 0;
                    for (var key in obj) {
                        if (i > 0)
                            str += ", ";
                        str += this.toStringF(key) + "::" + this.toStringF(obj[key]);
                        i++;
                    }
                    str += "}";
                }
                else {
                    if (com.MyClass.Tools.Tool_ObjUtils.hasFunction(obj, "toString") == true) {
                        str += com.MyClass.Tools.Tool_Function.getLastClassName(obj) + "->" + obj.toString();
                    }
                    else {
                        str += "实例::" + com.MyClass.Tools.Tool_Function.getLastClassName(obj) + "-->" + obj;
                    }
                }
                return str;
            };
            Config.stageW = 1136;
            Config.stageH = 640;
            Config.playSpeedTrue = 60;
            Config.swfFPS = 30;
            Config.SoundVol = 0.5;
            Config.MainDevice = "H5";
            Config.TypeFit = 2;
            Config.VerMain = 1;
            Config.VerSecond = 0;
            Config.Active = true;
            Config.Set_pauseCMDonBack = true;
            return Config;
        }());
        MyClass.Config = Config;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Config.js.map