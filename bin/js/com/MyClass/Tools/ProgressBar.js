var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Sprite = starling.Sprite;
            var ProgressBar = /** @class */ (function (_super) {
                __extends(ProgressBar, _super);
                function ProgressBar() {
                    var _this = _super.call(this) || this;
                    _this.isDestroy = false;
                    return _this;
                }
                ProgressBar.prototype.init = function (_type, _image) {
                    this._type = _type;
                    if (_type == 1) {
                        this.progressBar = _image;
                        this.__width = _image.width;
                        this.progressBar.width = 0;
                    }
                    else if (_type == 2) {
                        this.progressBar = _image;
                        this._ratio = _image.ratio;
                    }
                    else if (_type == 3) {
                        this.progressBar = _image["img"];
                        this.progressBar.x = _image["x"];
                        this._maskedDisplayObject = _image["maskedObject"];
                        this.__width = _image["x"];
                    }
                };
                /**
                 * 初始化一个缩放进度条
                 * @param obj
                 * @return
                 */
                ProgressBar.prototype.initScaling = function (obj) {
                    if (obj == null) {
                        MyClass.Config.LogF("ProgressBar:initScaling参数错误");
                        return;
                    }
                    var _obj;
                    if (obj instanceof Sprite) {
                        _obj = obj.getChildByName("进度条");
                        if (_obj == null) {
                            _obj = obj;
                        }
                    }
                    else {
                        _obj = obj;
                    }
                    this.init(1, _obj);
                };
                /**
                 * 初始化圆形进度条
                 * @param obj
                 * @return
                 */
                ProgressBar.prototype.initQuadSection = function (obj) {
                    var texture;
                    if (obj == null) {
                    }
                    else if (obj instanceof Sprite) {
                        var image = obj.getChildByName("进度条");
                        if (image != null) {
                            texture = image.texture;
                        }
                    }
                    else if (obj instanceof starling.Image) {
                        texture = obj.texture;
                    }
                    else if (obj instanceof laya.resource.Texture) {
                        texture = obj;
                    }
                    if (texture == null) {
                        MyClass.Config.LogF("ProgressBar:initQuadSection参数错误");
                        return;
                    }
                    var q = Tools.QuadSection.fromTexture(texture);
                    q.ratio = 0;
                    if (obj instanceof Sprite) {
                        obj.addChildAt(q, obj.getChildIndex(image) + 1);
                        q.x = image.x;
                        q.y = image.y;
                        Tools.Tool_ObjUtils.destroyF_One(image);
                    }
                    else if (obj instanceof starling.Image) {
                        this.addChild(q);
                        Tools.Tool_SpriteUtils.onAddchild_ChangeParent(this, obj);
                        Tools.Tool_ObjUtils.destroyF_One(obj);
                    }
                    else if (obj instanceof laya.resource.Texture) {
                        this.addChild(q);
                    }
                    this.init(2, q);
                };
                /**
                 * 初始化遮罩进度条，传入对象本身就是个进度条
                 * @param image
                 */
                ProgressBar.prototype.initMaskImage = function (image) {
                    if (image == null) {
                        MyClass.Config.LogF("ProgressBar:initMaskNoBar参数错误");
                        return;
                    }
                    var img;
                    if (image instanceof Sprite) {
                        img = Tools.Tool_SpriteUtils.cloneSprite(image);
                    }
                    if (image instanceof starling.Image) {
                        img = Tools.Tool_ImgUtils.cloneImage(image);
                    }
                    image.mask = img;
                    var obj = new Object();
                    obj["img"] = img;
                    obj["maskedObject"] = img;
                    obj["x"] = -image.width;
                    this.init(3, obj);
                };
                /**
                 * 初始化遮罩进度条，传入对象中包含进度条
                 * @param image
                 */
                ProgressBar.prototype.initMaskSprite = function (sprite) {
                    if (sprite == null) {
                        MyClass.Config.LogF("ProgressBar:initMaskHasBar参数错误");
                        return;
                    }
                    var _image;
                    _image = sprite.getChildByName("进度条");
                    if (_image == null) {
                        MyClass.Config.LogF("ProgressBar:initMaskHasBar参数错误");
                        return;
                    }
                    var img = Tools.Tool_ImgUtils.cloneImage(_image);
                    img.x = 0;
                    img.y = 0;
                    _image.mask = img;
                    var obj = new Object();
                    obj["img"] = img;
                    obj["maskedObject"] = img;
                    obj["x"] = -_image.width;
                    this.init(3, obj);
                };
                Object.defineProperty(ProgressBar.prototype, "ratio", {
                    get: function () {
                        return this._ratio;
                    },
                    set: function (value) {
                        if (this.isDestroy) {
                            return;
                        }
                        if (value < 0) {
                            value = 0;
                        }
                        else if (value > 1) {
                            value = 1;
                        }
                        if (this._type == 1) {
                            this._ratio = value;
                            this.progressBar.width = this.__width * value;
                        }
                        else if (this._type == 2) {
                            this._ratio = value;
                            this.progressBar.ratio = value;
                        }
                        else if (this._type == 3) {
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ProgressBar.prototype.setVisible = function (value) {
                    this.visible = value;
                    if (this.progressBar)
                        this.progressBar.visible = value;
                };
                ProgressBar.prototype.destroyF = function () {
                    this.isDestroy = true;
                    Tools.Tool_ObjUtils.destroyDisplayObj(this);
                    this.progressBar = Tools.Tool_ObjUtils.destroyF_One(this.progressBar);
                    this.Fun = Tools.Tool_ObjUtils.destroyF_One(this.Fun);
                    this._maskedDisplayObject = Tools.Tool_ObjUtils.destroyF_One(this._maskedDisplayObject);
                };
                return ProgressBar;
            }(Sprite));
            Tools.ProgressBar = ProgressBar;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=ProgressBar.js.map