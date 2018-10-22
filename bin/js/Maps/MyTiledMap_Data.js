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
                this.dicUrl[n] = new MyTiledMap_Data_One(this.dicUrl[n]);
            }
            this.Layer1_rows = jobj["地表"];
            this.Layer3_rows = jobj["阴影"];
            this.Layer4_rows = com.MyClass.Tools.Tool_ObjUtils.CopyF(jobj["物体"], false);
            if (this.Layer4_rows == null)
                this.Layer4_rows = {};
        }
        /** 添加资源URL，传入新的url */
        MyTiledMap_Data.prototype.addNewUrlSource = function (dicNew) {
            for (var key in dicNew) {
                this.dicUrl[key] = new MyTiledMap_Data_One(dicNew[key]);
            }
        };
        /** 添加资源，传入新的第四层物体数据={1:{"b1":[1]}} */
        MyTiledMap_Data.prototype.onAddSourceData = function (dicNewlayer4) {
            com.MyClass.Tools.Tool_ObjUtils.onComboObject(this.Layer4_rows, dicNewlayer4, false);
        };
        return MyTiledMap_Data;
    }());
    Maps.MyTiledMap_Data = MyTiledMap_Data;
    var MyTiledMap_Data_One = /** @class */ (function () {
        function MyTiledMap_Data_One(jobj) {
            this.size = 1;
            this.swf = jobj["swf"];
            this.url = jobj["url"];
            if (jobj["size"])
                this.size = jobj["size"];
            this.dicSpe = jobj["属性"];
        }
        return MyTiledMap_Data_One;
    }());
    Maps.MyTiledMap_Data_One = MyTiledMap_Data_One;
})(Maps || (Maps = {}));
//# sourceMappingURL=MyTiledMap_Data.js.map