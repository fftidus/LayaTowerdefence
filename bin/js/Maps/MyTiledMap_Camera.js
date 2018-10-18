var Maps;
(function (Maps) {
    var MyTiledMap_Camera = /** @class */ (function () {
        function MyTiledMap_Camera(map) {
            /** 摄像机的半径 */
            this.cameraW = com.MyClass.Config.stageScaleInfo["屏幕w"] / 2;
            this.cameraH = com.MyClass.Config.stageScaleInfo["屏幕h"] / 2;
            /** 当前摄像机的中心点 */
            this.nowX = 0;
            this.nowY = 0;
            /** 镜头放大的倍数 */
            this._scale = 1;
            this.Map = map;
            var data = map.data;
            this.minX = -data.row * data.width / 2;
            this.maxX = data.col * data.width / 2;
            this.minY = 0;
            this.maxY = (data.row + data.col) * data.height / 2;
            this.enterF();
        }
        Object.defineProperty(MyTiledMap_Camera.prototype, "scale", {
            get: function () { return this._scale; },
            set: function (value) { this._scale = value; },
            enumerable: true,
            configurable: true
        });
        /**
         * 帧频，由map调用
         * */
        MyTiledMap_Camera.prototype.enterF = function () {
            if (this.lookAtTar != null) {
                this.nowX = this.lookAtTar.x;
                this.nowY = this.lookAtTar.y;
            }
            if (this.nowX < this.minX) {
                this.nowX = this.minX;
            }
            else if (this.nowX > this.maxX) {
                this.nowX = this.maxX;
            }
            if (this.nowY < this.minY) {
                this.nowY = this.minY;
            }
            else if (this.nowY > this.maxY) {
                this.nowY = this.maxY;
            }
            this.Map.x = -this.nowX * this.Map.scaleX + this.cameraW;
            this.Map.y = -this.nowY * this.Map.scaleX + this.cameraH;
        };
        MyTiledMap_Camera.prototype.destroyF = function () {
            this.Map = null;
        };
        return MyTiledMap_Camera;
    }());
    Maps.MyTiledMap_Camera = MyTiledMap_Camera;
})(Maps || (Maps = {}));
//# sourceMappingURL=MyTiledMap_Camera.js.map