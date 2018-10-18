var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var Tool_ObjUtils = com.MyClass.Tools.Tool_ObjUtils;
            var MyViewPicsController = /** @class */ (function () {
                function MyViewPicsController(spr) {
                    this.dicPics = {};
                    this.sprBack = spr;
                    for (var i = 0; i < this.sprBack.numChildren; i++) {
                        var obj = this.sprBack.getChildAt(i);
                        if (obj.name && obj.name.indexOf("pic_") == 0) {
                            //pic_wxlocal__login_bg__jpg
                            var str = obj.name.substr(4);
                            var arr = str.split("__");
                            var strType = arr[arr.length - 2] + "." + arr[arr.length - 1];
                            arr.splice(arr.length - 2, 2);
                            var add = "";
                            while (arr.length > 0) {
                                add += arr[0] + "/";
                                arr.splice(0, 1);
                            }
                            var bg = new Laya.Image(add + strType);
                            if (obj instanceof com.MyClass.MySwf.SwfSprite)
                                obj.addChild(bg);
                            else
                                this.sprBack.addChildAt(bg, i++);
                            this.dicPics[obj.name] = bg;
                        }
                    }
                }
                MyViewPicsController.prototype.destroyF = function () {
                    this.sprBack = Tool_ObjUtils.destroyF_One(this.sprBack);
                    this.dicPics = Tool_ObjUtils.destroyF_One(this.dicPics);
                };
                return MyViewPicsController;
            }());
            MyView.MyViewPicsController = MyViewPicsController;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyViewPicsController.js.map