var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var Sprite = starling.Sprite;
            var Handler = laya.utils.Handler;
            var SwfSprite = com.MyClass.MySwf.SwfSprite;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var MyViewAllCompsController = /** @class */ (function () {
                function MyViewAllCompsController(spr, needChildren) {
                    if (needChildren === void 0) { needChildren = false; }
                    this.sprBack = spr;
                    for (var i = 0; i < spr.numChildren; i++) {
                        var one = spr.getChildAt(i);
                        if (one.name == null || one.name.length == 0) {
                            continue;
                        }
                        if (one.name.indexOf("tx_") == 0 || one.name.indexOf("txi_") == 0) {
                            this.init_mt();
                            continue;
                        }
                        if (one.name.indexOf("btn_") == 0) {
                            this.init_mbc();
                            continue;
                        }
                        if (one.name.indexOf("SBtn_") == 0) {
                            this.init_msb();
                            continue;
                        }
                        if (one.name.indexOf("slide_") == 0) {
                            this.init_ms();
                            continue;
                        }
                        if (one.name.indexOf("num_") == 0) {
                            this.init_mnum();
                            continue;
                        }
                        if (one.name.indexOf("pic_") == 0) {
                            this.init_mpm();
                            continue;
                        }
                        if (needChildren == true && one.name != null && Tool_Function.isTypeOf(one, Sprite)) {
                            this.initChildComp(one);
                        }
                    }
                }
                MyViewAllCompsController.prototype.initChildComp = function (one) {
                    if (this.childrens == null)
                        this.childrens = {};
                    this.childrens[one.name] = new MyViewAllCompsController(one, false); //默认只有一层
                };
                MyViewAllCompsController.prototype.init_mt = function () {
                    if (this.MT != null)
                        return;
                    var useMyt = false;
                    if (this.sprBack instanceof SwfSprite && this.sprBack.metaData && this.sprBack.metaData["vc"]
                        && this.sprBack.metaData["vc"]["mt"] && this.sprBack.metaData["vc"]["mt"]["mytext"] == true) {
                        useMyt = true;
                    }
                    this.MT = new MyView.MyViewTXController(this.sprBack, useMyt);
                };
                MyViewAllCompsController.prototype.init_mbc = function () {
                    if (this.MBC != null)
                        return;
                    this.MBC = new MyView.MyViewBtnController(this.sprBack, Handler.create(this, this.mbc_ClickF, null, false), Handler.create(this, this.mbc_DownF, null, false), Handler.create(this, this.mbc_UpF, null, false));
                };
                MyViewAllCompsController.prototype.mbc_ClickF = function (btn) {
                    Tool_Function.onRunFunction(this.Fun_mbc_click, btn);
                };
                MyViewAllCompsController.prototype.mbc_DownF = function (btn) {
                    Tool_Function.onRunFunction(this.Fun_mbc_down, btn);
                };
                MyViewAllCompsController.prototype.mbc_UpF = function (btn) {
                    Tool_Function.onRunFunction(this.Fun_mbc_up, btn);
                };
                MyViewAllCompsController.prototype.init_msb = function () {
                    if (this.MSB != null)
                        return;
                    this.MSB = new MyView.MyViewSelectBtnController(this.sprBack, Handler.create(this, this.msb_ClickF, null, false));
                };
                MyViewAllCompsController.prototype.msb_ClickF = function (sbtn, btn) {
                    Tool_Function.onRunFunction(this.Fun_msb_click, sbtn, btn);
                };
                MyViewAllCompsController.prototype.init_ms = function () {
                    if (this.MS != null)
                        return;
                    this.MS = new MyView.MyViewSlideMCs(this.sprBack);
                };
                MyViewAllCompsController.prototype.init_mnum = function () {
                    if (this.MNum != null)
                        return;
                    this.MNum = new MyView.MyViewNumsController(this.sprBack);
                };
                MyViewAllCompsController.prototype.init_mpm = function () {
                    if (this.MPM != null)
                        return;
                    this.MPM = new MyView.MyViewPicsController(this.sprBack);
                };
                MyViewAllCompsController.prototype.destroyF = function () {
                    this.MT = Tool_ObjUtils.destroyF_One(this.MT);
                    this.MBC = Tool_ObjUtils.destroyF_One(this.MBC);
                    this.MSB = Tool_ObjUtils.destroyF_One(this.MSB);
                    this.MS = Tool_ObjUtils.destroyF_One(this.MS);
                    this.MNum = Tool_ObjUtils.destroyF_One(this.MNum);
                    this.MPM = Tool_ObjUtils.destroyF_One(this.MPM);
                    this.childrens = Tool_ObjUtils.destroyF_One(this.childrens);
                    this.Fun_mbc_click = Tool_ObjUtils.destroyF_One(this.Fun_mbc_click);
                    this.Fun_mbc_down = Tool_ObjUtils.destroyF_One(this.Fun_mbc_down);
                    this.Fun_mbc_up = Tool_ObjUtils.destroyF_One(this.Fun_mbc_up);
                };
                return MyViewAllCompsController;
            }());
            MyView.MyViewAllCompsController = MyViewAllCompsController;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyViewAllCompsController.js.map