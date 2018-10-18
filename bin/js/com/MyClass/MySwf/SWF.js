var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MySwf;
        (function (MySwf) {
            var SWF = /** @class */ (function () {
                function SWF(url_Json, FLoaded) {
                    this.Dic_NameFrame = {};
                    this.URL_Swf = url_Json;
                    if (url_Json.indexOf("/") != -1) {
                        this.SwfName = url_Json.slice(url_Json.lastIndexOf("/") + 1, url_Json.indexOf(".json"));
                    }
                    this.FunLoaded = FLoaded;
                    this.hanProgress = laya.utils.Handler.create(this, this.onAtlasProgress, null, false);
                    Laya.loader.load(url_Json, laya.utils.Handler.create(this, this.onLoaded), this.hanProgress, laya.net.Loader.ATLAS);
                }
                SWF.prototype.onLoaded = function () {
                    this.hanProgress.clear();
                    this.hanProgress = null;
                    var atlas = Laya.Loader.getAtlas(this.URL_Swf);
                    var data = Laya.Loader.getRes(this.URL_Swf);
                    if (data == null) {
                        com.MyClass.Config.LogF("加载url_Json报错！");
                        this.onLoadEndF(false);
                        return;
                    }
                    var frames = data.frames;
                    var str;
                    var count = 0;
                    for (var name_1 in frames) {
                        var t = Laya.loader.getRes(atlas[count++]);
                        if (name_1.indexOf(".") >= 0)
                            str = name_1.slice(0, name_1.lastIndexOf("."));
                        this.Dic_NameFrame[str] = t;
                    }
                    //------------------------------------------------
                    var urlBytes = this.URL_Swf.split(".")[0] + ".bytes";
                    this.onLoadBytes(this.URL_Swf);
                };
                SWF.prototype.onAtlasProgress = function (per) {
                    MyClass.MainManager.getInstence().MEM.dispatchF("加载进度", per * 0.8);
                };
                SWF.prototype.onLoadBytes = function (url_Json) {
                    var url_bytes = url_Json.split(".")[0] + ".bytes";
                    var data = Laya.Loader.getRes(url_bytes);
                    if (data) {
                        this.initData(data);
                    }
                    else {
                        this.l = new Laya.Loader();
                        this.l.once(laya.events.Event.COMPLETE, this, this.loadCompleteF);
                        this.l.once(laya.events.Event.ERROR, this, this.loadErrorF);
                        this.l.on(laya.events.Event.PROGRESS, null, function (per) {
                            if (per != 1) {
                                // mem.dispatchF("加载进度",0.8 +per * 0.2);
                            }
                        });
                        this.l.load(url_bytes, Laya.Loader.BUFFER);
                    }
                };
                SWF.prototype.loadErrorF = function (err) {
                    com.MyClass.Config.LogF("加载Bytes报错！");
                    this.onLoadEndF(false);
                };
                SWF.prototype.loadCompleteF = function (data) {
                    this.l.offAll();
                    this.initData(data);
                };
                SWF.prototype.initData = function (data) {
                    try {
                        var inflate = new Zlib.Inflate(new Uint8Array(data));
                        var inbuffer = inflate.decompress();
                        var bytes = new laya.utils.Byte(inbuffer);
                    }
                    catch (e) {
                        com.MyClass.Config.LogF("解压报错！" + e.message);
                        return;
                    }
                    var str = bytes.readUTFBytes();
                    this._swfDatas = JSON.parse(str);
                    if (this._swfDatas["particle"] != null) {
                        var arrAll = [];
                        for (var key in this._swfDatas["particle"]) {
                            if (this._swfDatas["particle"][key] != null) {
                                arrAll.push(key);
                            }
                        }
                        if (arrAll.length > 0) {
                            this.onLoad粒子资源(arrAll);
                            return;
                        }
                    }
                    this.onLoadEndF(true);
                };
                SWF.prototype.onLoad粒子资源 = function (arr) {
                    var key = arr[0]; //particle_1
                    key = key.substr(9);
                    Laya.loader.load("assets/Particles/" + key + ".part", laya.utils.Handler.create(this, this.onParticleLoadOne, [arr]), null, Laya.Loader.JSON);
                };
                SWF.prototype.onParticleLoadOne = function (arr, settings) {
                    var key = arr.shift();
                    if (this.Dic_ParticleSetting == null) {
                        this.Dic_ParticleSetting = {};
                    }
                    this.Dic_ParticleSetting[key] = settings;
                    if (arr.length == 0) {
                        this.onLoadEndF(true);
                    }
                    else {
                        this.onLoad粒子资源(arr);
                    }
                };
                SWF.prototype.onLoadEndF = function (suc) {
                    com.MyClass.Tools.Tool_Function.onRunFunction(this.FunLoaded, suc == true ? this : null);
                    this.FunLoaded = null;
                };
                SWF.prototype.createFuns = function (objData) {
                    var strName;
                    if (objData instanceof Array)
                        strName = objData[0];
                    else if (typeof objData === 'string')
                        strName = objData;
                    else
                        strName = objData["url"];
                    if (strName.indexOf(SWF.dataKey_Image) == 0)
                        return this.getImage(strName);
                    if (strName.indexOf(SWF.dataKey_Sprite) == 0)
                        return this.getSprite(strName);
                    if (strName.indexOf(SWF.dataKey_MovieClip) == 0)
                        return this.getMc(strName);
                    if (strName.indexOf(SWF.dataKey_Scale9) == 0)
                        return this.getS9Image(strName);
                    if (strName.indexOf(SWF.dataKey_TextField) == 0)
                        return this.createTextField(objData);
                    if (strName.indexOf(SWF.dataKey_Particle) == 0)
                        return this.creatParticle(objData);
                    return null;
                };
                ;
                SWF.prototype.getObject = function (strName) {
                    if (strName.indexOf("img_") == 0)
                        return this.getImage(strName);
                    if (strName.indexOf("spr_") == 0)
                        return this.getSprite(strName);
                    if (strName.indexOf("mc_") == 0)
                        return this.getMc(strName);
                    if (strName.indexOf("s9_") == 0)
                        return this.getS9Image(strName);
                    return null;
                };
                SWF.prototype.getTexture = function (strName) {
                    if (this.Dic_NameFrame[strName] != null) {
                        var t = this.Dic_NameFrame[strName];
                        return t;
                    }
                    return null;
                };
                SWF.prototype.getImage = function (strName) {
                    if (this._swfDatas[SWF.dataKey_Image][strName] == null) {
                        return null;
                    }
                    if (this.Dic_NameFrame[strName] != null) {
                        var t = this.Dic_NameFrame[strName];
                        var image = new MySwf.SwfImage(t);
                        var imageData = this._swfDatas[SWF.dataKey_Image][strName];
                        image.classLink = strName;
                        image.swfName = this.SwfName;
                        image.pivotX = imageData[imageData.length - 2];
                        image.pivotY = imageData[imageData.length - 1];
                        if (imageData.length >= 4) { //有宽高
                            image.w0 = imageData[0];
                            image.h0 = imageData[1];
                        }
                        return image;
                    }
                    return null;
                };
                SWF.prototype.getS9Image = function (strName) {
                    if (this.Dic_NameFrame[strName] != null) {
                        var scale9Data = this._swfDatas[SWF.dataKey_Scale9][strName];
                        var t = this.Dic_NameFrame[strName];
                        var image = new MySwf.SwfS9Image();
                        image.source = t;
                        image.classLink = strName;
                        image.swfName = this.SwfName;
                        image.sizeGrid = scale9Data["y"] + "," + (t.width - scale9Data["x"] - scale9Data["w"]) + "," + (t.height - scale9Data["y"] - scale9Data["h"]) + "," + scale9Data["x"];
                        return image;
                    }
                    return null;
                };
                SWF.prototype.getSprite = function (strName) {
                    if (this._swfDatas[SWF.dataKey_Sprite] == null || this._swfDatas[SWF.dataKey_Sprite][strName] == null) {
                        com.MyClass.Config.LogF("没有Sprite:" + strName);
                        return null;
                    }
                    var sprData = this._swfDatas[SWF.dataKey_Sprite][strName];
                    var sprite = new MySwf.SwfSprite();
                    var length = sprData.length;
                    var objData;
                    var display;
                    var i = 0;
                    if (sprData.length > 0) {
                        if (!(sprData[0] instanceof Array) && sprData[0]["url"] == null)
                            i = 1;
                        for (; i < length; i++) {
                            objData = sprData[i];
                            display = this.getOneChild(objData);
                            if (display == null)
                                continue;
                            sprite.addChild(display);
                        }
                    }
                    sprite.setSpriteData(sprData);
                    sprite.classLink = strName;
                    sprite.swfName = this.SwfName;
                    return sprite;
                };
                SWF.prototype.getOneChild = function (objData) {
                    if (objData == null)
                        return null;
                    var display;
                    var i = 0;
                    display = this.createFuns(objData);
                    if (display == null)
                        return null;
                    if (objData instanceof Array) {
                        display.name = objData[9];
                        display.pos(objData[2], objData[3]);
                        if (objData[1] != SWF.dataKey_Scale9) {
                            display.scaleX = objData[4];
                            display.scaleY = objData[5];
                            display.sx0 = objData[4];
                            display.sy0 = objData[5];
                        }
                        else {
                            display.width = objData[10];
                            display.height = objData[11];
                        }
                        display.skewX = -objData[6];
                        display.skewY = objData[7];
                        display.alpha = objData[8];
                    }
                    else {
                        display.name = objData["name"];
                        display.pos(objData["x"], objData["y"]);
                        if (objData["type"] != SWF.dataKey_Scale9) {
                            display.scaleX = objData["sx"];
                            display.scaleY = objData["sy"];
                            display.sx0 = objData["sx"];
                            display.sy0 = objData["sy"];
                        }
                        else {
                            display.width = objData["w"];
                            display.height = objData["h"];
                        }
                        display.skewX = -objData["skewx"];
                        display.skewY = objData["skewy"];
                        display.alpha = objData["alpha"];
                    }
                    return display;
                };
                SWF.prototype.getMc = function (strName) {
                    if (this._swfDatas[SWF.dataKey_MovieClip] == null || this._swfDatas[SWF.dataKey_MovieClip][strName] == null) {
                        com.MyClass.Config.LogF("没有MC:" + strName);
                        return null;
                    }
                    var movieClipData = this._swfDatas[SWF.dataKey_MovieClip][strName];
                    if (movieClipData == null)
                        return null;
                    var objectCountData = movieClipData["objCount"];
                    var displayObjects = {};
                    var displayObjectArray;
                    var type;
                    var count;
                    for (var objName in objectCountData) {
                        type = objectCountData[objName][0];
                        count = objectCountData[objName][1];
                        displayObjectArray = displayObjects[objName] == null ? [] : displayObjects[objName];
                        if (type == "particle") {
                            for (var i = 0; i < count; i++) {
                                displayObjectArray.push(this.createFuns(objName));
                            }
                        }
                        else if (type == "text") {
                            for (var i = 0; i < count; i++) {
                                displayObjectArray.push(null);
                            }
                        }
                        else {
                            for (var i = 0; i < count; i++) {
                                if (i >= MySwf.SwfMovieClip.CacheNumBegin)
                                    break;
                                displayObjectArray.push(this.createFuns(objName));
                            }
                            displayObjectArray.push(null);
                        }
                        displayObjects[objName] = displayObjectArray;
                    }
                    var mc = new MySwf.SwfMovieClip(movieClipData["frames"], movieClipData["labels"], displayObjects, this);
                    if (movieClipData["重复"] != null)
                        mc.onCashSameFrameInfo(movieClipData["重复"]);
                    if (movieClipData["meta"] != null)
                        mc.setMetaData(movieClipData["meta"]);
                    mc.loop = movieClipData["loop"];
                    mc.classLink = strName;
                    mc.swfName = this.SwfName;
                    return mc;
                };
                SWF.prototype.createTextField = function (data) {
                    var textfield;
                    var txt = "";
                    if (data) {
                        if (data["text"] && data["text"] != "\r" && data["text"] != "") {
                            txt = data["text"];
                        }
                        textfield = com.MyClass.Tools.Tool_Textfield.newTextfield(data["w"], data["h"], txt, data["font"], data["size"], data["color"], "上", data["align"], data["italic"], data["bold"]);
                    }
                    return textfield;
                };
                SWF.prototype.creatParticle = function (_name) {
                    if (this.Dic_ParticleSetting[_name] == null) {
                        return null;
                    }
                    var sp = new laya.particle.Particle2D(this.Dic_ParticleSetting[_name]);
                    sp.emitter.start();
                    sp.play();
                    return sp;
                };
                SWF.prototype.destroyF = function () {
                    Laya.Loader.clearRes(this.URL_Swf);
                };
                SWF.prototype.onCheckDataForFilterAndColor = function (display, data) {
                    if (data == null)
                        return;
                    SWF.setBlendMode(display, data["blend"]);
                    if (data["color"] != null && (display instanceof starling.Sprite) == true) {
                        SWF.changeColor(display, data["color"]);
                    }
                };
                SWF.changeColor = function (tar, col) {
                    if (tar)
                        tar.color = col;
                };
                SWF.setBlendMode = function (display, blendMode) {
                    // 	"auto":true,
                    // 	"none":true,
                    // 	"normal":true,
                    // 	"add":true,
                    // 	"multiply":true,
                    // 	"screen":true,
                    // 	"erase":true,
                    // 	"below":true
                    if (blendMode == "add") {
                        display.blendMode = "lighter";
                    }
                    else if (blendMode == "erase") {
                    }
                    else {
                        //display.blendMode=egret.BlendMode.NORMAL;
                    }
                };
                SWF.dataKey_Sprite = "spr";
                SWF.dataKey_Image = "img";
                SWF.dataKey_MovieClip = "mc";
                SWF.dataKey_TextField = "text";
                SWF.dataKey_Scale9 = "s9";
                SWF.dataKey_Particle = "particle";
                return SWF;
            }());
            MySwf.SWF = SWF;
        })(MySwf = MyClass.MySwf || (MyClass.MySwf = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=SWF.js.map