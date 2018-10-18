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
var Maps;
(function (Maps) {
    var MyTiledMap_Object = /** @class */ (function (_super) {
        __extends(MyTiledMap_Object, _super);
        function MyTiledMap_Object() {
            var _this = _super.call(this) || this;
            /** 占用格子大小 */
            _this.sizeNum = 1;
            _this.CID = Maps.MyTiledMap.countObject++;
            return _this;
        }
        MyTiledMap_Object.getOne = function (data, row, col) {
            var pool = Maps.MyTiledMap.pool;
            if (pool && pool.hasPool(this.PoolName_Ground) == false) {
                pool.registF(this.PoolName_Ground);
            }
            var one;
            if (pool) {
                one = pool.getFromPool(this.PoolName_Ground);
            }
            if (one == null) {
                one = new MyTiledMap_Object();
            }
            one.initF(data, row, col);
            return one;
        };
        MyTiledMap_Object.prototype.initF = function (data, row, col) {
            if (this.Role == null) {
                this.Role = Maps.MyTiledMap_ObjView.getOne(data.swf, data.url);
                this.addChild(this.Role);
            }
            this.sizeNum = data.size;
            this.url = data.url;
            this.row = row;
            this.col = col;
        };
        MyTiledMap_Object.prototype.setMap = function (map, index) {
            this.map = map;
            this.layerIndex = index;
            this.refreshXY();
        };
        /** 改变了row、col后刷新xy */
        MyTiledMap_Object.prototype.refreshXY = function () {
            this.x = this.map.data.width * (this.col - 1) / 2 - this.map.data.width * (this.row - 1 + 1) / 2;
            this.y = (this.row - 1 + this.col - 1) * this.map.data.height / 2;
        };
        /** 清理：人物等不缓存，直接清理。地面等地图素材缓存。 */
        MyTiledMap_Object.prototype.removeF = function () {
            // this.destroyF();
            if (this.CID != -1 && this.map) {
                this.map.removeObject(this);
                return;
            }
            this.removeFromParent(false);
            if (this.Role) {
                this.Role.removeF();
                this.Role = null;
            }
            this.map = null;
            if (Maps.MyTiledMap.pool)
                Maps.MyTiledMap.pool.returnToPool(MyTiledMap_Object.PoolName_Ground, this);
        };
        MyTiledMap_Object.prototype.destroyF = function () {
            this.map = null;
            com.MyClass.Tools.Tool_ObjUtils.destroyDisplayObj(this);
            this.Role = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Role);
        };
        MyTiledMap_Object.PoolName_Ground = "Map_G";
        return MyTiledMap_Object;
    }(starling.Sprite));
    Maps.MyTiledMap_Object = MyTiledMap_Object;
})(Maps || (Maps = {}));
//# sourceMappingURL=MyTiledMap_Object.js.map