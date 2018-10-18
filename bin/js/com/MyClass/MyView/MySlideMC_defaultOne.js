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
            var MySlideMC_defaultOne = /** @class */ (function (_super) {
                __extends(MySlideMC_defaultOne, _super);
                function MySlideMC_defaultOne() {
                    return _super.call(this) || this;
                }
                MySlideMC_defaultOne.prototype.initF = function (spr) {
                    this.sprBack = spr;
                    this.addChild(this.sprBack);
                };
                MySlideMC_defaultOne.prototype.setValue = function (key, value) {
                    if (this.values == null)
                        this.values = {};
                    this.values[key] = value;
                };
                MySlideMC_defaultOne.prototype.getValue = function (key) {
                    if (this.values == null)
                        return null;
                    return this.values[key];
                };
                MySlideMC_defaultOne.prototype.destroyF = function () {
                    com.MyClass.Tools.Tool_ObjUtils.destroyDisplayObj(this);
                    this.sprBack = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.sprBack);
                    this.values = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.values);
                };
                return MySlideMC_defaultOne;
            }(starling.Sprite));
            MyView.MySlideMC_defaultOne = MySlideMC_defaultOne;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MySlideMC_defaultOne.js.map