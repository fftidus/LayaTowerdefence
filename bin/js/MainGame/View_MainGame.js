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
    var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
    var View_MainGame = /** @class */ (function (_super) {
        __extends(View_MainGame, _super);
        function View_MainGame(info) {
            var _this = _super.call(this) || this;
            _this.mso = new com.MyClass.MySourceManagerOne();
            _this.mmo = new com.MyClass.MainManagerOne();
            com.MyClass.MyView.LayerStarlingManager.getInstence().LayerView.addChild(_this);
            _this.backBg = new Laya.Image("res/skyBack.jpg");
            _this.addChild(_this.backBg);
            _this.backBg.x = (com.MyClass.Config.stageScaleInfo["屏幕w"] - _this.backBg.width) / 2;
            _this.backBg.y = (com.MyClass.Config.stageScaleInfo["屏幕h"] - _this.backBg.height) / 2;
            _this.map = new Maps.MyTiledMap();
            _this.map.data = info.map;
            _this.addChild(_this.map);
            _this.map.initF();
            _this.UI = new MainGame.MainGame_UI();
            _this.addChild(_this.UI);
            _this.addMapController();
            _this.mmo.addEnterFrameFun(laya.utils.Handler.create(_this, _this.enterF, null, false));
            return _this;
        }
        /**
         * 为地图添加控制器，点击，滚动，移动等
         */
        View_MainGame.prototype.addMapController = function () {
            this.mmeMap = new com.MyClass.MyView.MyMouseEventStarling(Laya.stage);
            this.mmeMap.setValue("点击", laya.utils.Handler.create(this, this.onClickMapF, null, false));
            this.mmeMap.setValue("滚轮", laya.utils.Handler.create(this, this.onWheelOnMapF, null, false));
            this.gesMapMove = new com.MyClass.MyGestures.MyGesture_RightSlide(Laya.stage, laya.utils.Handler.create(this, this.onRightMouseMoveMap, null, false), null);
        };
        /**
         * 点击地图
         */
        View_MainGame.prototype.onClickMapF = function (p) {
            this.map.onClickMapF(p);
        };
        /**
         * 滚轮缩放地图
         */
        View_MainGame.prototype.onWheelOnMapF = function (delta) {
            if (delta < 0) { //向上滚动：放大
                this.map.onScaleF(this.map.scaleX + 0.2);
            }
            else { //向下滚动：缩小
                this.map.onScaleF(this.map.scaleX - 0.2);
            }
        };
        /**
         * 右键按下拖动地图
         */
        View_MainGame.prototype.onRightMouseMoveMap = function (dic) {
            this.map.onMoveCamera(-dic["x"], -dic["y"]);
        };
        /**
         * 帧频
         */
        View_MainGame.prototype.enterF = function () {
            this.map.enterF();
        };
        View_MainGame.prototype.destroyF = function () {
            this.mso = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mso);
            this.mmo = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mmo);
            Tool_ObjUtils.destroyDisplayObj(this);
            Tool_ObjUtils.destroyF_One(this.map);
            Tool_ObjUtils.destroyF_One(this.UI);
            this.mmeMap = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mmeMap);
            this.gesMapMove = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.gesMapMove);
        };
        return View_MainGame;
    }(starling.Sprite));
    MainGame.View_MainGame = View_MainGame;
})(MainGame || (MainGame = {}));
//# sourceMappingURL=View_MainGame.js.map