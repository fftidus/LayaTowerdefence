var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Effect;
        (function (Effect) {
            var Handler = laya.utils.Handler;
            var Sprite = starling.Sprite;
            var MyEffect_WindowAppear_Scale = /** @class */ (function () {
                function MyEffect_WindowAppear_Scale(mc, f) {
                    this.S = 0.2;
                    this.time = 0.2;
                    this.MC = mc;
                    this.Fun = f;
                    this.layer = new Sprite();
                    if (this.MC.parent) {
                        this.MC.parent.addChildAt(this.layer, this.MC.parent.getChildIndex(this.MC));
                    }
                    this.layer.addChild(this.MC);
                    this.W = MyClass.Config.stageW;
                    this.H = MyClass.Config.stageH;
                    this.layer.scaleX = this.layer.scaleY = this.S;
                    this.layer.x += this.W * (1 - this.S) / 2;
                    this.layer.y += this.H * (1 - this.S) / 2;
                    this.layer.alpha = 0.1;
                    laya.utils.Tween.to(this.layer, { x: 0, y: 0, scaleX: 1, scaleY: 1, alpha: 1 }, this.time * 1000, null, Handler.create(this, this.Tover));
                }
                MyEffect_WindowAppear_Scale.prototype.Tover = function () {
                    this.layer.parent.addChildAt(this.MC, this.layer.parent.getChildIndex(this.layer));
                    this.layer = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.layer);
                    com.MyClass.Tools.Tool_Function.onRunFunction(this.Fun);
                };
                return MyEffect_WindowAppear_Scale;
            }());
            Effect.MyEffect_WindowAppear_Scale = MyEffect_WindowAppear_Scale;
        })(Effect = MyClass.Effect || (MyClass.Effect = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyEffect_WindowAppear_Scale.js.map