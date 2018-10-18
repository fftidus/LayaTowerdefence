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
var MainGame;
(function (MainGame) {
    var MainGame_UI = /** @class */ (function (_super) {
        __extends(MainGame_UI, _super);
        function MainGame_UI() {
            var _this = _super.call(this) || this;
            _this.sprBack = com.MyClass.MySourceManager.getInstance().getSprFromSwf(Global.SWF_Fight, "spr_View");
            _this.addChild(_this.sprBack);
            _this.ac = new com.MyClass.MyView.MyViewAllCompsController(_this.sprBack);
            _this.sourceInfo = new UI_sourceInfo(_this.sprBack.getChildByName("_资源"));
            return _this;
        }
        /**
         * 显示资源拥有量
         * @param type 资源名
         * @param num 数量
         */
        MainGame_UI.prototype.onShowSource = function (type, num) {
            this.sourceInfo.onShowSource(type, num);
        };
        MainGame_UI.prototype.destroyF = function () {
            com.MyClass.Tools.Tool_ObjUtils.destroyDisplayObj(this);
            com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.ac);
            if (this.sourceInfo) {
                this.sourceInfo.destroyF();
            }
        };
        return MainGame_UI;
    }(starling.Sprite));
    MainGame.MainGame_UI = MainGame_UI;
    var UI_sourceInfo = /** @class */ (function () {
        function UI_sourceInfo(spr) {
            this.ac = new com.MyClass.MyView.MyViewAllCompsController(spr);
            this.onShowSource("能源", 0);
            this.onShowSource("木材", 0);
            this.onShowSource("矿石", 0);
        }
        UI_sourceInfo.prototype.onShowSource = function (type, num) {
            this.ac.MNum.onShowF("num_" + type, num);
        };
        UI_sourceInfo.prototype.destroyF = function () {
            this.ac.destroyF();
        };
        return UI_sourceInfo;
    }());
})(MainGame || (MainGame = {}));
//# sourceMappingURL=MainGame_UI.js.map