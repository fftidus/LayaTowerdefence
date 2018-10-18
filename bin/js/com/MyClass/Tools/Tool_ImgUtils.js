var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Tool_ImgUtils = /** @class */ (function () {
                function Tool_ImgUtils() {
                }
                Tool_ImgUtils.onNoSmooth = function (obj, maxS) {
                    if (maxS === void 0) { maxS = 3; }
                };
                Tool_ImgUtils.onAddSmooth = function (obj) {
                };
                Tool_ImgUtils.onCreateImageNum = function (fName, spr, _url, _swf) {
                    if (_swf === void 0) { _swf = null; }
                    var tmp = spr.getChildByName(_url);
                    if (tmp == null)
                        return null;
                    var num = new com.MyClass.MyView.ImageNum(fName, _swf);
                    num.setValue("父对象", tmp);
                    return num;
                };
                Tool_ImgUtils.cloneImage = function (target) {
                    var image = new starling.Image(target.texture);
                    image.x = target.x;
                    image.y = target.y;
                    image.width = target.width;
                    image.height = target.height;
                    image.skewX = target.skewX;
                    image.skewY = target.skewY;
                    image.alpha = target.alpha;
                    return image;
                };
                Tool_ImgUtils.onNewImageFromTexture = function (t) {
                    if (t == null) {
                        return null;
                    }
                    var image = new starling.Image(t);
                    return image;
                };
                return Tool_ImgUtils;
            }());
            Tools.Tool_ImgUtils = Tool_ImgUtils;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Tool_ImgUtils.js.map