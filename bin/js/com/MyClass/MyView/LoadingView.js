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
        var MyView;
        (function (MyView) {
            var Sprite = starling.Sprite;
            var Handler = laya.utils.Handler;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var LoadingView = /** @class */ (function (_super) {
                __extends(LoadingView, _super);
                function LoadingView(_all, id) {
                    if (id === void 0) { id = 0; }
                    var _this = _super.call(this) || this;
                    _this.lastPer = 0;
                    _this.per = 0;
                    _this.all = _all;
                    var picUrl;
                    MyView.LayerStarlingManager.getInstence().LayerTop.addChild(_this);
                    _this.sprBack = MyClass.MySourceManager.getInstance().getObjFromSwf(Global.SWF_Default, "spr_Loading");
                    if (_this.sprBack != null) {
                        _this.addChild(_this.sprBack);
                        for (var i = 0; i < _this.sprBack.numChildren; i++) {
                            var childone = _this.sprBack.getChildAt(i);
                            if (childone.name && childone.name.indexOf("进度条_") == 0) {
                                _this.bar = new com.MyClass.Tools.ProgressBar();
                                if (childone.name == "进度条_s") {
                                    _this.bar.initScaling(childone);
                                }
                                else if (childone.name == "进度条_m") {
                                    _this.bar.initMaskImage(childone);
                                }
                                else if (childone.name == "进度条_q") {
                                    _this.bar.initQuadSection(childone);
                                }
                                break;
                            }
                        }
                        if (LoadingView.NeedLoadBackPic) {
                            picUrl = "res/LoadBack_" + id + ".jpg";
                            var imgtouming = _this.sprBack.getChildAt(0);
                            _this.picBack = new Sprite();
                            _this.picBack.addChild(imgtouming);
                            _this.sprBack.addChildAt(_this.picBack, 0);
                            _this.picBack.addChild(new Laya.Image(picUrl));
                        }
                        _this.mt = new MyView.MyViewTXController(_this.sprBack);
                        MyClass.Config.mStage.addChild(_this);
                    }
                    else { //没有SWF_Default
                        if (LoadingView.NeedLoadBackPic) {
                            picUrl = "res/LoadBack_" + id + ".jpg";
                            _this.picBack = new Sprite();
                            _this.addChild(_this.picBack);
                            _this.picBack.loadImage(picUrl);
                        }
                        _this.tf = com.MyClass.Tools.Tool_Textfield.newTextfield(100, 30, "", null, 25, 0xFFFFFF, null, "中");
                        _this.addChild(_this.tf);
                        _this.tf.x = (MyClass.Config.stageScaleInfo["屏幕w"] - 100) / 2;
                        _this.tf.y = (MyClass.Config.stageScaleInfo["屏幕h"] - 30) / 2;
                    }
                    if (MyClass.Config.TypeFit == 2) {
                        if (_this.sprBack) {
                            com.MyClass.Tools.Tool_ViewFit.onWindowFitScreen(_this.sprBack, 4.2);
                        }
                        else if (_this.picBack) {
                            com.MyClass.Tools.Tool_ViewFit.onWindowFitScreen(_this.picBack, 0);
                        }
                    }
                    MyClass.MainManager.getInstence().MEM.addListenF("加载进度", Handler.create(_this, _this.setNowper, null, false));
                    _this.now = _this.all + 1;
                    _this.setNowper();
                    return _this;
                }
                LoadingView.prototype.noAutoProgress = function () {
                    MyClass.MainManager.getInstence().MEM.removeListenF("加载进度", this.setNowper);
                };
                /** 直接设置进度：值=0~100 */
                LoadingView.prototype.setPer = function (val) {
                    this.per = val;
                    if (this.bar) {
                        this.bar.ratio = val * 0.01;
                    }
                    if (this.mt) {
                        this.mt.setText("tx_进度", this.per + "%");
                    }
                    if (this.tf) {
                        this.tf.text = this.per + "%";
                    }
                };
                LoadingView.prototype.setNowper = function (val) {
                    if (val === void 0) { val = null; }
                    if (this.now <= 0)
                        return;
                    if (typeof val == "number") {
                        this.per = this.lastPer + (this.nextPer - this.lastPer) * val;
                        if (this.bar) {
                            this.bar.ratio = (this.all - this.now) / this.all;
                        }
                        if (this.mt) {
                            this.mt.setText("tx_进度", this.per + "%");
                        }
                        if (this.tf) {
                            this.tf.text = this.per + "%";
                        }
                        return;
                    }
                    this.now--;
                    this.lastPer = this.per;
                    if (this.all > 0) {
                        this.per = Tool_Function.onForceConvertType((this.all - this.now) * 100 / this.all + ""); //55.22
                        this.nextPer = Tool_Function.onForceConvertType((this.all - this.now + 1) * 100 / this.all + "");
                        if (this.bar) {
                            this.bar.ratio = (this.all - this.now) / this.all;
                        }
                        if (this.mt) {
                            this.mt.setText("tx_进度", this.per + "%");
                        }
                        if (this.tf) {
                            this.tf.text = this.per + "%";
                        }
                    }
                    else {
                        this.per = 100;
                        this.nextPer = 100;
                        if (this.bar) {
                            this.bar.ratio = 1;
                        }
                        if (this.mt)
                            this.mt.setText("tx_进度", "100%");
                        if (this.tf) {
                            this.tf.text = "100%";
                        }
                    }
                };
                LoadingView.prototype.destroyF = function () {
                    MyClass.MainManager.getInstence().MEM.removeListenF("加载进度", this.setNowper);
                    this.removeFromParent();
                    this.mt = Tool_ObjUtils.destroyF_One(this.mt);
                    this.tf = Tool_ObjUtils.destroyF_One(this.tf);
                    if (this.picBack) {
                        this.picBack.removeFromParent();
                        this.picBack = null;
                    }
                };
                LoadingView.NeedLoadBackPic = true;
                return LoadingView;
            }(Sprite));
            MyView.LoadingView = LoadingView;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=LoadingView.js.map