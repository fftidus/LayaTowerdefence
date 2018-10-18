var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var Handler = laya.utils.Handler;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var MyViewEffect = /** @class */ (function () {
                function MyViewEffect(v, fend, _info, isIn) {
                    if (isIn === void 0) { isIn = true; }
                    this.dicTweens = new Dictionary();
                    this.Fun = fend;
                    this.View = v;
                    this.info = _info;
                    this.typeIn = isIn;
                    if (this.info == null) {
                        this.destroyF();
                        return;
                    }
                    var have = false;
                    for (var key in this.info) { //btn_1：{"x":200,"反弹":true,"startTime":0.03}//默认都是入场的数据，出场则自动计算
                        if (this.info[key] == null) {
                            continue;
                        }
                        var child = this.View.getChildByName(key);
                        if (child == null) {
                            console.log("入场动画中" + key + "不存在");
                            continue;
                        }
                        have = true;
                        var time;
                        if (this.info[key]["time"] != null)
                            time = this.info[key]["time"];
                        else
                            time = MyViewEffect.timeDefault;
                        if (this.info[key]["startTime"] != null && this.typeIn == true) {
                            this.onSetStartWaite参数(key, true);
                            this.dicTweens.set(key, "");
                            starling.Juggler.getInstance().delayCall(Handler.create(this, this.onAddTweenOne), this.info[key]["startTime"], key, this.info);
                            continue;
                        }
                        else if (this.info[key]["startTime2"] != null && this.typeIn == false) {
                            this.dicTweens.set(key, "");
                            starling.Juggler.getInstance().delayCall(Handler.create(this, this.onAddTweenOne), this.info[key]["startTime2"], key, this.info);
                            continue;
                        }
                        this.onAddTweenOne(key, this.info);
                    }
                    if (have == false) {
                        this.destroyF();
                    }
                }
                MyViewEffect.prototype.get相反缓动 = function (now) {
                    if (now == null) {
                        return null;
                    }
                    if (now == "easeOutBack") {
                        return "easeInOut";
                    }
                    return null;
                };
                MyViewEffect.prototype.onAddTweenOne = function (key, info) {
                    var child = this.View.getChildByName(key);
                    var time;
                    if (info[key]["time"] != null)
                        time = info[key]["time"];
                    else
                        time = MyViewEffect.timeDefault;
                    if (this.typeIn == true) {
                        this.onSetStartWaite参数(key, false);
                    }
                    this.dicTweens.remove(key);
                    if (info[key]["mc"] != null) {
                        var mcAni = MyClass.MySourceManager.getInstance().getObjFromSwf(info[key]["swf"], info[key]["mc"]);
                        if (mcAni == null) {
                            console.log("没有找到" + key + "的入场动画：" + info[key]["mc"]);
                            return;
                        }
                        if (this.mmo == null) {
                            this.dicMc = new Dictionary();
                            this.mmo = new MyClass.MainManagerOne();
                            this.mmo.addEnterFrameFun(Handler.create(this, this.enterF));
                        }
                        child.visible = false;
                        var mmc = new MyView.MyMC(mcAni);
                        mmc.loop = false;
                        if (this.typeIn == true) {
                            mmc.stop();
                        }
                        else {
                            mmc.gotoAndStop(mmc.totalFrames - 1);
                        }
                        this.dicMc.set(key, mmc);
                        mmc.x = child.x;
                        mmc.y = child.y;
                        this.View.addChild(mmc);
                        return;
                    }
                    var spdx = 0;
                    var spdy = 0;
                    var tween;
                    if (info[key]["缓动"] == null) {
                        tween = new starling.Tween(child, time);
                    }
                    else {
                        if (this.typeIn == true) {
                            tween = new starling.Tween(child, time, info[key]["缓动"]);
                        }
                        else {
                            tween = new starling.Tween(child, time, this.get相反缓动(info[key]["缓动"]));
                        }
                    }
                    if (this.typeIn == true) {
                        var needXY = false;
                        var endx = child.x;
                        var endy = child.y;
                        if (info[key]["x"] != null) { //xy使用变化值而不是固定初始值
                            child.x += info[key]["x"];
                            needXY = true;
                        }
                        if (info[key]["y"] != null) {
                            child.y += info[key]["y"];
                            needXY = true;
                        }
                        if (needXY) {
                            tween.moveTo(endx, endy);
                        }
                        if (info[key]["alpha"] != null) { //透明度使用初始值而不是变化值
                            var endAlhpa = child.alpha;
                            child.alpha = info[key]["alpha"];
                            tween.fadeTo(endAlhpa);
                        }
                        if (info[key]["scale"] != null) { //缩放使用初始值而不是变化值
                            var endScale = child.scale;
                            child.scale = info[key]["scale"];
                            tween.scaleTo(endScale);
                        }
                    }
                    else {
                        needXY = false;
                        endx = child.x;
                        endy = child.y;
                        if (info[key]["x"] != null) { //xy使用变化值而不是固定初始值
                            endx = child.x + info[key]["x"];
                            needXY = true;
                        }
                        if (info[key]["y"] != null) {
                            endy = child.y + info[key]["y"];
                            needXY = true;
                        }
                        if (needXY) {
                            tween.moveTo(endx, endy);
                        }
                        if (info[key]["alpha"] != null) { //透明度使用初始值而不是变化值
                            endAlhpa = info[key]["alpha"];
                            tween.fadeTo(endAlhpa);
                        }
                        if (info[key]["scale"] != null) { //缩放使用初始值而不是变化值
                            endScale = info[key]["scale"];
                            tween.scaleTo(endScale);
                        }
                    }
                    this.dicTweens.set(key, tween);
                    tween.onComplete = Handler.create(this, this.onTweenEnd);
                    tween.onCompleteArgs = [key];
                    starling.Juggler.getInstance().add(tween);
                };
                MyViewEffect.prototype.onSetStartWaite参数 = function (key, start) {
                    if (this.info[key]["startWaite"] == null) {
                        return;
                    }
                    var child = this.View.getChildByName(key);
                    for (var key2 in this.info[key]["startWaite"]) {
                        if (start == true) {
                            if (typeof this.info[key]["startWaite"][key2] == "number") {
                                child[key2] += this.info[key]["startWaite"][key2];
                            }
                            else if (typeof this.info[key]["startWaite"][key2] == "boolean") {
                                child[key2] = this.info[key]["startWaite"][key2];
                            }
                            else {
                                console.log("startWaite中有无法操作的类型：" + key2);
                            }
                        }
                        else {
                            if (typeof this.info[key]["startWaite"][key2] == "number") {
                                child[key2] -= this.info[key]["startWaite"][key2];
                            }
                            else if (typeof this.info[key]["startWaite"][key2] == "boolean") {
                                child[key2] = !this.info[key]["startWaite"][key2];
                            }
                            else {
                                console.log("startWaite中有无法操作的类型：" + key2);
                            }
                        }
                    }
                };
                MyViewEffect.prototype.enterF = function () {
                    for (var i = 0; i < this.dicMc.keys.length; i++) {
                        var key = this.dicMc.keys[i];
                        var mmc = this.dicMc.get(key);
                        if (this.typeIn == true) {
                            if (mmc.currentFrame >= mmc.totalFrames - 1) {
                                var child = this.View.getChildByName(key);
                                child.visible = true;
                                mmc = Tool_ObjUtils.destroyF_One(mmc);
                                this.dicMc.remove(key);
                                i--;
                            }
                            else {
                                mmc.nextFrame();
                            }
                        }
                        else {
                            if (mmc.currentFrame == 0) {
                                child = this.View.getChildByName(key);
                                child.visible = true;
                                mmc = Tool_ObjUtils.destroyF_One(mmc);
                                this.dicMc.remove(key);
                                i--;
                                this.onSetStartWaite参数(key, true);
                            }
                            else {
                                mmc.preFrame();
                            }
                        }
                    }
                    if (this.dicMc.keys.length == 0) {
                        this.dicMc = null;
                        this.mmo = Tool_ObjUtils.destroyF_One(this.mmo);
                        if (this.dicTweens == null) {
                            this.destroyF();
                        }
                    }
                };
                MyViewEffect.prototype.onTweenEnd = function (key) {
                    if (this.info == null) {
                        console.log("MyViewEffect：tween时已被清理！");
                        return;
                    }
                    if (this.dicTweens == null) {
                        return;
                    }
                    var t = this.dicTweens.get(key);
                    if (t) {
                        starling.Juggler.getInstance().remove(t);
                        this.dicTweens.remove(key);
                    }
                    if (this.typeIn == false) {
                        this.onSetStartWaite参数(key, true);
                    }
                    if (this.dicTweens.keys.length == 0) {
                        this.dicTweens = null;
                        if (this.dicMc != null) {
                            return;
                        }
                        this.destroyF();
                    }
                };
                MyViewEffect.prototype.destroyF = function () {
                    this.info = null;
                    if (this.Fun) {
                        Tool_Function.onRunFunction(this.Fun);
                        this.Fun = null;
                    }
                };
                MyViewEffect.timeDefault = 0.5;
                return MyViewEffect;
            }());
            MyView.MyViewEffect = MyViewEffect;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyViewEffect.js.map