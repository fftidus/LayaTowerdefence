var Maps;
(function (Maps) {
    var MyTiledMap_Data = /** @class */ (function () {
        function MyTiledMap_Data(jobj) {
            this.width = jobj["size"];
            this.height = this.width / 2;
            this.gripSize = this.height / Math.SQRT2;
            this.row = jobj["row"];
            this.col = jobj["col"];
            this.dicUrl = jobj["url"];
            for (var n in this.dicUrl) {
                this.dicUrl[n] = new MyTiledMap_Data_urlOne(this.dicUrl[n]);
            }
            this.Layer1_rows = jobj["地表"];
            this.Layer3_rows = jobj["阴影"];
            this.Layer4_rows = jobj["物体"];
        }
        return MyTiledMap_Data;
    }());
    Maps.MyTiledMap_Data = MyTiledMap_Data;
    var MyTiledMap_Data_urlOne = /** @class */ (function () {
        function MyTiledMap_Data_urlOne(jobj) {
            this.size = 1;
            this.swf = jobj["swf"];
            this.url = jobj["url"];
            if (jobj["size"])
                this.size = jobj["size"];
        }
        return MyTiledMap_Data_urlOne;
    }());
    Maps.MyTiledMap_Data_urlOne = MyTiledMap_Data_urlOne;
})(Maps || (Maps = {}));
//# sourceMappingURL=MyTiledMap_Data.js.map