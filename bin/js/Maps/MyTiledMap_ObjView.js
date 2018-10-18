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
    var MyTiledMap_ObjView = /** @class */ (function (_super) {
        __extends(MyTiledMap_ObjView, _super);
        function MyTiledMap_ObjView() {
            return _super.call(this) || this;
        }
        /** 获得基础的显示元件 */
        MyTiledMap_ObjView.getOne = function (swf, url) {
            var pool = Maps.MyTiledMap.pool;
            var one;
            if (pool) {
                one = pool.getFromPool(swf + ":" + url);
            }
            if (one == null) {
                one = new MyTiledMap_ObjView();
            }
            one.initBaseMc(swf, url);
            return one;
        };
        /** 显示mc **/
        MyTiledMap_ObjView.prototype.initBaseMc = function (swf, url) {
            if (swf != null) {
                this.mc = com.MyClass.MySourceManager.getInstance().getObjFromSwf(swf, url);
                if (this.mc == null) {
                    com.MyClass.Config.LogF(swf + "：" + url + "，找不到地面图");
                }
                else {
                    this.addChild(this.mc);
                }
                this.poolName = swf + ":" + url;
            }
            if (this.mc && this.mc instanceof com.MyClass.MySwf.SwfMovieClip) {
                this.mc.play(true);
            }
        };
        Object.defineProperty(MyTiledMap_ObjView.prototype, "currentFrame", {
            get: function () {
                if (this.mc) {
                    return this.mc.currentFrame;
                }
                return 0;
            },
            set: function (value) {
                if (this.mc) {
                    this.mc.gotoAndStop(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyTiledMap_ObjView.prototype, "totalFrames", {
            get: function () {
                if (this.mc) {
                    return this.mc.totalFrames;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        MyTiledMap_ObjView.prototype.removeF = function () {
            if (this.mc) {
                if (this.mc instanceof com.MyClass.MySwf.SwfMovieClip) {
                    this.mc.stop(true);
                }
                else if (this.mc instanceof com.MyClass.MyView.MyMC) {
                    this.mc.stop();
                }
            }
            if (Maps.MyTiledMap.pool)
                Maps.MyTiledMap.pool.returnToPool(this.poolName, this);
        };
        MyTiledMap_ObjView.prototype.destroyF = function () {
            com.MyClass.Tools.Tool_ObjUtils.destroyDisplayObj(this);
            this.mc = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mc);
        };
        return MyTiledMap_ObjView;
    }(starling.Sprite));
    Maps.MyTiledMap_ObjView = MyTiledMap_ObjView;
})(Maps || (Maps = {}));
//# sourceMappingURL=MyTiledMap_ObjView.js.map