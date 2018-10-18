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
            var LayerStarlingManager = /** @class */ (function (_super) {
                __extends(LayerStarlingManager, _super);
                function LayerStarlingManager() {
                    var _this = _super.call(this) || this;
                    // this.scaleX =this.scaleY =Config.stageScale;
                    LayerStarlingManager.instance = _this;
                    _this.LayerView = new starling.Sprite();
                    _this.addChild(_this.LayerView);
                    _this.LayerTop = new starling.Sprite();
                    _this.addChild(_this.LayerTop);
                    return _this;
                }
                LayerStarlingManager.getInstence = function () {
                    if (this.instance == null)
                        this.instance = new LayerStarlingManager();
                    return this.instance;
                };
                LayerStarlingManager.prototype.init = function (_stage) {
                    _stage.addChild(this);
                };
                LayerStarlingManager.prototype.destroyF = function () {
                    var child;
                    while (this.LayerView.numChildren > 0) {
                        child = this.LayerView.getChildAt(0);
                        this.LayerView.removeChild(child);
                        com.MyClass.Tools.Tool_ObjUtils.destroyF_One(child);
                    }
                    while (this.LayerTop.numChildren > 0) {
                        child = this.LayerTop.getChildAt(0);
                        this.LayerTop.removeChild(child);
                        com.MyClass.Tools.Tool_ObjUtils.destroyF_One(child);
                    }
                };
                return LayerStarlingManager;
            }(laya.display.Sprite));
            MyView.LayerStarlingManager = LayerStarlingManager;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=LayerStarlingManager.js.map