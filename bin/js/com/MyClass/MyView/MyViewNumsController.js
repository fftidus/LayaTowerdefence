var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var MyViewNumsController = /** @class */ (function () {
                function MyViewNumsController(spr, fName, swf) {
                    if (fName === void 0) { fName = null; }
                    if (swf === void 0) { swf = null; }
                    this.Nums = com.MyClass.Tools.Tool_SpriteUtils.onGetAll_ImageNum(spr, fName, swf);
                }
                MyViewNumsController.prototype.getNum = function (Name) {
                    return this.Nums[Name];
                };
                MyViewNumsController.prototype.onShowF = function (txName, val) {
                    if (this.Nums[txName])
                        this.Nums[txName].showF(val);
                };
                MyViewNumsController.prototype.destroyF = function () {
                    this.Nums = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Nums);
                };
                return MyViewNumsController;
            }());
            MyView.MyViewNumsController = MyViewNumsController;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyViewNumsController.js.map