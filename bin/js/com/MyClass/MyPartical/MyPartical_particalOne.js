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
        var MyPartical;
        (function (MyPartical) {
            var Sprite = starling.Sprite;
            var SwfMovieClip = com.MyClass.MySwf.SwfMovieClip;
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var MyPartical_particalOne = /** @class */ (function (_super) {
                __extends(MyPartical_particalOne, _super);
                function MyPartical_particalOne(_type, mc) {
                    var _this = _super.call(this) || this;
                    _this.isEnd = false;
                    /** 移动速度 */
                    _this.spdX = 0;
                    _this.spdY = 0;
                    _this.spdA = 0;
                    _this.spdSx = 0;
                    _this.spdSy = 0;
                    _this.spdR = 0;
                    _this.Type = _type;
                    _this.Mc = mc;
                    _this.addChild(_this.Mc);
                    return _this;
                }
                /** 初始化前应重新设置alpha、spd、scale等数据 **/
                MyPartical_particalOne.prototype.initF = function () {
                    this.isEnd = false;
                    if (this.Mc instanceof SwfMovieClip) {
                        this.Mc.play();
                    }
                    this.countFrame = this.lifeTime * MyClass.Config.playSpeedTrue;
                };
                MyPartical_particalOne.prototype.enterF = function () {
                    if (this.isEnd)
                        return;
                    if (this.countFrame-- < 0) {
                        this.clearF();
                    }
                    else {
                        this.x += this.spdX;
                        this.y += this.spdY;
                        this.alpha += this.spdA;
                        if (this.spdA > 0) {
                            if (this.spdA + this.alpha > 1)
                                this.alpha = 1;
                            else
                                this.alpha += this.spdA;
                        }
                        else if (this.spdA < 0) {
                            if (this.spdA + this.alpha < 0) {
                                this.alpha = 0;
                                this.clearF();
                                return;
                            }
                            else {
                                this.alpha += this.spdA;
                            }
                        }
                        if (this.spdSx > 0) {
                            this.scaleX += this.spdSx;
                        }
                        else if (this.spdSx < 0) {
                            if (this.scaleX + this.spdSx <= 0) {
                                this.clearF();
                                return;
                            }
                            else {
                                this.scaleX += this.spdSx;
                            }
                        }
                        if (this.spdSy > 0) {
                            this.scaleY += this.spdSy;
                        }
                        else if (this.spdSy < 0) {
                            if (this.scaleY + this.spdSy <= 0) {
                                this.clearF();
                                return;
                            }
                            else {
                                this.scaleY += this.spdSy;
                            }
                        }
                        if (this.spdR != 0) {
                            this.rotation += this.spdR;
                        }
                    }
                };
                MyPartical_particalOne.prototype.clearF = function () {
                    this.isEnd = true;
                    if (this.parent) {
                        this.parent.removeChild(this);
                    }
                    if (this.Mc instanceof SwfMovieClip) {
                        this.Mc.stop(true);
                    }
                };
                MyPartical_particalOne.prototype.destroyF = function () {
                    Tool_ObjUtils.destroyDisplayObj(this);
                    this.Mc = Tool_ObjUtils.destroyF_One(this.Mc);
                };
                return MyPartical_particalOne;
            }(Sprite));
            MyPartical.MyPartical_particalOne = MyPartical_particalOne;
        })(MyPartical = MyClass.MyPartical || (MyClass.MyPartical = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyPartical_particalOne.js.map