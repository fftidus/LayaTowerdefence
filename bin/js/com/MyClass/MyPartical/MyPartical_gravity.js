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
            var Handler = laya.utils.Handler;
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var MyPartical_gravity = /** @class */ (function (_super) {
                __extends(MyPartical_gravity, _super);
                function MyPartical_gravity() {
                    var _this = _super.call(this) || this;
                    _this.isDestroyF = false;
                    _this.pause = false;
                    _this.stop = false;
                    /** 是否由外部调用enterF */
                    _this.isUpdataByOther = false;
                    /** 最大数量 */
                    _this.maxNum = 10;
                    /** 每帧最多生成数量 */
                    _this.maxNumFrame = 1;
                    /** 由重力换算得到的每帧移动速度 */
                    _this.spdx = 0;
                    _this.spdy = 1;
                    _this.countMS = 0;
                    /** 粒子的生存时间 */
                    _this.lifeTime = 1;
                    /** 粒子的生存时间随机增量 */
                    _this.lifeTime_random = 0;
                    /** 初始化粒子的位置：默认0，参数表示随机范围 */
                    _this.startX = 0;
                    _this.startY = 0;
                    /** 初始化粒子的最小速度，根据本类的旋转角度会修改该速度 */
                    _this.startSpdX = 0;
                    _this.startSpdY = 0;
                    /** 初始化粒子的随机速度增量 */
                    _this.startSpdx_random = 0;
                    _this.startSpdy_random = 0;
                    /** 初始化粒子的缩放 */
                    _this.startScaleX = 1;
                    _this.startScaleX_random = 0;
                    _this.startScaleY = 1;
                    _this.startScaleY_random = 0;
                    /** 初始化粒子的缩放变化速度 */
                    _this.startSpdSx = 0;
                    _this.startSpdSx_random = 0;
                    _this.startSpdSy = 0;
                    _this.startSpdSy_random = 0;
                    /** 初始化粒子的旋转速度 */
                    _this.startSpdR = 0;
                    _this.startSpdR_random = 0;
                    /** 初始化粒子的旋转角度随机 */
                    _this.startRotation_random = 0;
                    /** 初始化粒子的透明度变化速度 */
                    _this.startSpdA = 0;
                    _this.startSpdA_random = 0;
                    /** 所有粒子 */
                    _this.Arr_Particals = [];
                    /** 缓存池 */
                    _this.poolParts = new com.MyClass.Tools.MyPools();
                    _this.FPS = 30;
                    return _this;
                }
                Object.defineProperty(MyPartical_gravity.prototype, "gx", {
                    /** 整体的重力：每秒移动的距离 */
                    set: function (value) { this.spdx = value / MyClass.Config.playSpeedTrue; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyPartical_gravity.prototype, "gy", {
                    set: function (value) { this.spdy = value / MyClass.Config.playSpeedTrue; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyPartical_gravity.prototype, "FPS", {
                    /** FPS */
                    set: function (value) { this.needMS = 1000 / value; },
                    enumerable: true,
                    configurable: true
                });
                /** 添加一个粒子底层元件的获取方法 */
                MyPartical_gravity.prototype.addMcFunction = function (fun) {
                    if (this.Arr_mcs == null)
                        this.Arr_mcs = [];
                    this.Arr_mcs.push(fun);
                    if (fun instanceof Handler) {
                        fun.once = false;
                    }
                };
                MyPartical_gravity.prototype.onStartF = function () {
                    if (this.Arr_mcs == null) {
                        console.log("还没有粒子的生成方法！");
                        return;
                    }
                    for (var i = 0; i < this.Arr_mcs.length; i++) {
                        this.poolParts.registF(i + "", this.maxNum);
                    }
                    if (this.isUpdataByOther == false) {
                        this.mmo = new MyClass.MainManagerOne();
                        this.mmo.addEnterFrameFun(Handler.create(this, this.enterF, null, false));
                    }
                };
                MyPartical_gravity.prototype.enterF = function () {
                    if (this.pause == true) {
                        return;
                    }
                    this.countMS += MyClass.Config.frameMS;
                    if (this.countMS < this.needMS) {
                        return;
                    }
                    this.countMS -= this.needMS;
                    this.onEnterParts();
                    if (this.isDestroyF == true || this.stop == true) {
                        return;
                    }
                    //判断生成新的
                    var count = this.maxNumFrame;
                    while (this.Arr_Particals.length < this.maxNum) {
                        this.onNewOne();
                        if (--count <= 0)
                            break;
                    }
                };
                /**
                 * 生成一个新的
                 * **/
                MyPartical_gravity.prototype.onNewOne = function () {
                    var i = Tool_Function.onForceConvertType(Math.random() * this.Arr_mcs.length);
                    var type = i + "";
                    var one = this.poolParts.getFromPool(type);
                    if (one == null) {
                        one = new MyPartical.MyPartical_particalOne(type, Tool_Function.onRunFunction(this.Arr_mcs[i]));
                    }
                    //TODO 根据旋转角度改变速度
                    one.spdX = this.startSpdX + this.startSpdx_random * Math.random();
                    one.spdY = this.startSpdY + this.startSpdy_random * Math.random();
                    one.lifeTime = (this.lifeTime + Math.random() * this.lifeTime_random);
                    if (this.startX != 0) {
                        one.x = this.x - this.startX + Math.random() * (this.startX + this.startX);
                    }
                    else {
                        one.x = this.x;
                    }
                    if (this.startY != 0) {
                        one.y = this.y + this.startY * Math.random();
                    }
                    else {
                        one.y = this.y;
                    }
                    if (this.startScaleX != 0 || this.startScaleX_random != 0) {
                        one.scaleX = this.startScaleX + Math.random() * this.startScaleX_random;
                    }
                    else {
                        one.scaleX = 1;
                    }
                    if (this.startScaleY != 0 || this.startScaleY_random != 0) {
                        one.scaleY = this.startScaleY + Math.random() * this.startScaleY_random;
                    }
                    else {
                        one.scaleY = 1;
                    }
                    if (this.startSpdSx != 0 || this.startSpdSx_random != 0) {
                        one.spdSx = this.startSpdSx + Math.random() * this.startSpdSx_random;
                    }
                    else {
                        one.spdSx = 0;
                    }
                    if (this.startSpdSy != 0 || this.startSpdSy_random != 0) {
                        one.spdSy = this.startSpdSy + Math.random() * this.startSpdSy_random;
                    }
                    else {
                        one.spdSx = 0;
                    }
                    if (this.startSpdA != 0 || this.startSpdA_random != 0) {
                        one.spdA = this.startSpdA + this.startSpdA_random * Math.random();
                    }
                    else {
                        one.spdA = 0;
                    }
                    one.rotation = Tool_Function.deg2rad(Math.random() * this.startRotation_random);
                    if (this.startSpdR != 0 || this.startSpdR_random != 0) {
                        one.spdR = Tool_Function.deg2rad(this.startSpdR + Math.random() * this.startSpdR_random);
                    }
                    else {
                        one.spdR = 0;
                    }
                    if (this.FunAddchild == null) {
                        this.parent.addChild(one);
                    }
                    else {
                        Tool_Function.onRunFunction(this.FunAddchild, one);
                    }
                    one.initF();
                    this.Arr_Particals.push(one);
                };
                /**
                 * 粒子动画
                 * */
                MyPartical_gravity.prototype.onEnterParts = function () {
                    if (this.Arr_Particals == null)
                        return;
                    for (var i = 0; i < this.Arr_Particals.length; i++) {
                        var one = this.Arr_Particals[i];
                        if (one.isEnd == true) {
                            this.Arr_Particals.splice(i--, 1);
                            this.poolParts.returnToPool(one.Type, one);
                        }
                        else {
                            one.enterF();
                            one.spdX += this.spdx;
                            one.spdY += this.spdy;
                        }
                    }
                    if (this.Arr_Particals.length == 0) {
                        if (this.isDestroyF == true) {
                            this.realDestroyF();
                        }
                    }
                };
                /**
                 * 清理，但不清理已发射的粒子
                 * */
                MyPartical_gravity.prototype.destroyF = function () {
                    if (this.isDestroyF)
                        return;
                    this.isDestroyF = true;
                    Tool_ObjUtils.destroyDisplayObj(this);
                    this.Arr_mcs = Tool_ObjUtils.destroyF_One(this.Arr_mcs);
                    this.FunAddchild = Tool_ObjUtils.destroyF_One(this.FunAddchild);
                    this.poolParts = Tool_ObjUtils.destroyF_One(this.poolParts);
                    if (this.isUpdataByOther == true) {
                        if (this.mmo == null) {
                            this.mmo = new MyClass.MainManagerOne();
                            this.mmo.addEnterFrameFun(Handler.create(this, this.enterF, null, false));
                        }
                    }
                };
                MyPartical_gravity.prototype.realDestroyF = function () {
                    this.mmo = Tool_ObjUtils.destroyF_One(this.mmo);
                    this.Arr_Particals = Tool_ObjUtils.destroyF_One(this.Arr_Particals);
                };
                return MyPartical_gravity;
            }(Sprite));
            MyPartical.MyPartical_gravity = MyPartical_gravity;
        })(MyPartical = MyClass.MyPartical || (MyClass.MyPartical = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyPartical_gravity.js.map