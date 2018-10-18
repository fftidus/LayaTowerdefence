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
    var MyTiledMap = /** @class */ (function (_super) {
        __extends(MyTiledMap, _super);
        function MyTiledMap() {
            var _this = _super.call(this) || this;
            _this.INDEX_Shadow = 2;
            _this.INDEX_GLight = 3;
            //显示
            _this.dicLayers = {};
            _this.dicObjects = {};
            _this.dicLayerData = {}; //每层的每个格子对应的object，多格物体则每个格子都是它
            _this.dicNeedSort = {};
            _this.p1 = { "x": 0, "y": 0 };
            _this.p2 = { "x": 0, "y": 0 };
            _this.p3 = { "x": 0, "y": 0 };
            _this.p4 = { "x": 0, "y": 0 };
            MyTiledMap.pool = new com.MyClass.Tools.MyPools();
            MyTiledMap.countObject = 1;
            for (var i = 1; i <= 5; i++) {
                _this.dicNeedSort[i] = true;
                _this.dicLayers[i] = new starling.Sprite();
                _this.addChild(_this.dicLayers[i]);
                if (i == _this.INDEX_Shadow) { //阴影层，不叠加??
                    _this.dicLayers[i].alpha = 0.5;
                }
                _this.dicLayerData[i] = {};
            }
            return _this;
        }
        MyTiledMap.prototype.initF = function () {
            var _this = this;
            if (this.data == null) {
                return;
            }
            //生成地图----------
            var fun = function (dic, index) {
                if (_this.dicLayers[index] == null)
                    return;
                for (var row in dic) {
                    var info = dic[row];
                    for (var name_1 in info) {
                        if (_this.data.dicUrl == null || _this.data.dicUrl[name_1] == null) {
                            com.MyClass.Config.onThrowNewErrorF("地图数据中找不到[" + name_1 + "]的资源数据");
                            continue;
                        }
                        var arr = info[name_1];
                        for (var i = 0; i < arr.length; i++) {
                            var one = Maps.MyTiledMap_Object.getOne(_this.data.dicUrl[name_1], parseInt(row), arr[i]);
                            _this.addMapObjectToLayer(one, index);
                        }
                    }
                }
            };
            if (this.data.Layer1_rows) {
                fun.apply(this, [this.data.Layer1_rows, 1]);
            }
            if (this.data.Layer4_rows) {
                fun.apply(this, [this.data.Layer4_rows, 4]);
            }
            //----------
            this.camera = new Maps.MyTiledMap_Camera(this);
            this.enterF();
        };
        /**
         * 帧频事件
         * */
        MyTiledMap.prototype.enterF = function () {
            this.camera.enterF();
            this.onSortGrips();
        };
        /** 排序图块 */
        MyTiledMap.prototype.onSortGrips = function () {
            for (var l in this.dicNeedSort) {
                if (this.dicNeedSort[l] == true) {
                    this.dicNeedSort[l] = false;
                    for (var key in this.dicLayers) {
                        var index = parseInt(key);
                        if (index == 3) {
                            continue;
                        }
                        var _layer = this.dicLayers[index];
                        var arrGrips = _layer._childs;
                        arrGrips.sort(function (obj1, obj2) {
                            if (obj1.row > obj2.row)
                                return 1;
                            if (obj1.row < obj2.row)
                                return -1;
                            if (obj1.col > obj2.col)
                                return 1;
                            return -1;
                        });
                    }
                }
            }
        };
        /** 添加ob，index取值1~5，默认-1表示物体层级4，2阴影层，3地面特效层，1地表层j */
        MyTiledMap.prototype.addMapObjectToLayer = function (obj, index) {
            if (index === void 0) { index = -1; }
            if (index == -1) { //默认添加到物体层
                index = 4;
            }
            if (this.dicLayers[index]) {
                this.dicLayers[index].addChild(obj);
                obj.setMap(this, index);
                if (index != 3 && index != 2) {
                    this.dicNeedSort[index] = true;
                }
                this.dicObjects[obj.CID] = obj;
                //添加到数据
                if (this.dicLayerData[obj.layerIndex] != null) {
                    for (var i = 0; i < obj.sizeNum; i++) {
                        if (this.dicLayerData[obj.layerIndex][obj.row + i] == null)
                            this.dicLayerData[obj.layerIndex][obj.row + i] = {};
                        for (var j = 0; j < obj.sizeNum; j++) {
                            this.dicLayerData[obj.layerIndex][obj.row + i][obj.col + j] = obj.CID;
                        }
                    }
                }
            }
        };
        /** 添加动画到最上层级 */
        MyTiledMap.prototype.addMcToTopLayer = function (mc) {
            this.addMapObjectToLayer(mc, 5);
        };
        /** 删除obj */
        MyTiledMap.prototype.removeObject = function (obj) {
            if (this.dicLayerData[obj.layerIndex]) {
                for (var i = 0; i < obj.sizeNum; i++) {
                    if (this.dicLayerData[obj.layerIndex][obj.row + i]) {
                        for (var j = 0; j < obj.sizeNum; j++) {
                            delete this.dicLayerData[obj.layerIndex][obj.row + i][obj.col + j];
                        }
                    }
                }
            }
            delete this.dicObjects[obj.CID];
            obj.CID = -1;
            obj.removeF();
        };
        /**
         * 点击地图
         */
        MyTiledMap.prototype.onClickMapF = function (p) {
            var _x = p.x;
            var _y = p.y;
            _x = (_x - this.x) / this.scaleX;
            _y = (_y - this.y) / this.scaleY;
            if (_y < 0)
                return;
            //m：row范围<=m+1，col范围<=m+1
            //n：col - row -1 =n
            var halfw = this.data.width / 2;
            var halfh = this.data.height / 2;
            var wOneCol = (this.data.row + 1) * halfw; //一列的总宽度
            var hOneRow = (this.data.col + 1) * halfh; //一行的总高度
            for (var row = 1; row <= this.data.row; row++) {
                if (_y < (row - 1) * halfh)
                    break;
                if (_y > (row - 1) * halfh + hOneRow)
                    continue;
                for (var col = 1; col <= this.data.col; col++) {
                    if (_x < col * halfw - wOneCol)
                        break;
                    if (_x > col * halfw)
                        continue;
                    this.p1.x = (col - row) * halfw;
                    this.p1.y = (row + col - 2) * halfh;
                    this.p2.x = this.p1.x + halfw;
                    this.p2.y = this.p1.y + halfh;
                    this.p3.x = this.p1.x;
                    this.p3.y = this.p2.y + halfh;
                    this.p4.x = this.p1.x - halfw;
                    this.p4.y = this.p2.y;
                    if (com.MyClass.Tools.Tool_HitTest.onPoint_IN_Eclipse([this.p1, this.p2, this.p3, this.p4], null, _x, _y) == true) {
                        console.log("点击" + row + ":" + col);
                        console.log("选中物体：" + this.getObjectByRC(row, col));
                        break;
                    }
                }
            }
        };
        /**
         * 根据row、col得到对应位置的物体。只判断4,2两层！
         */
        MyTiledMap.prototype.getObjectByRC = function (r, c) {
            for (var i = 4; i >= 2; i--) {
                if (i == 3)
                    continue;
                if (this.dicLayerData[i] == null || this.dicLayerData[i][r] == null || this.dicLayerData[i][r][c] == null)
                    continue;
                if (this.dicObjects[this.dicLayerData[i][r][c]]) {
                    return this.dicObjects[this.dicLayerData[i][r][c]];
                }
            }
            return null;
        };
        /**
         * 缩放地图
         */
        MyTiledMap.prototype.onScaleF = function (s) {
            if (s > 2)
                s = 2;
            else if (s < 0.2)
                s = 0.2;
            this.scaleX = this.scaleY = s;
        };
        /**
         * 移动地图
         */
        MyTiledMap.prototype.onMoveCamera = function (_x, _y) {
            this.camera.nowX += _x;
            this.camera.nowY += _y;
        };
        MyTiledMap.prototype.destroyF = function () {
            if (MyTiledMap.pool) {
                MyTiledMap.pool.destroyF();
                MyTiledMap.pool = null;
            }
            this.removeFromParent();
            this.dicLayers = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.dicLayers);
        };
        return MyTiledMap;
    }(starling.Sprite));
    Maps.MyTiledMap = MyTiledMap;
})(Maps || (Maps = {}));
//# sourceMappingURL=MyTiledMap.js.map