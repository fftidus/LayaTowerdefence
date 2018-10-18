var starling;
(function (starling) {
    var Tween = /** @class */ (function () {
        function Tween(tar, _time, tran) {
            if (tran === void 0) { tran = "linear"; }
            this.info = {};
            this.tarObj = tar;
            this.time = _time;
            this.tranType = tran;
        }
        Tween.prototype.moveTo = function (endx, endy) {
            this.info["x"] = endx;
            this.info["y"] = endy;
        };
        Tween.prototype.fadeTo = function (enda) {
            this.info["alpha"] = enda;
        };
        Tween.prototype.scaleTo = function (ends) {
            this.info["scaleX"] = ends;
            this.info["scaleY"] = ends;
        };
        /** 线性 */
        Tween.LINEAR = "linear";
        /** 皮球弹 */
        Tween.BOUNCE_IN = "bounceIn";
        /** 皮球弹 */
        Tween.BOUNCE_OUT = "bounceOut";
        /** 皮球弹 */
        Tween.BOUNCE_IN_OUT = "bounceInOut";
        /** 先回弹 */
        Tween.EASE_IN = "easeIn";
        /** 超过再回来 */
        Tween.EASE_OUT = "easeOut";
        /** 开始结束都超过 */
        Tween.EASE_IN_OUT = "easeInOut";
        /** 加速 */
        Tween.STRONG_In = "strongOut";
        /** 减速 */
        Tween.STRONG_In_Out = "strongInOut";
        return Tween;
    }());
    starling.Tween = Tween;
})(starling || (starling = {}));
//# sourceMappingURL=Tween.js.map