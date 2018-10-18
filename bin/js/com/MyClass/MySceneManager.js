/**
* 场景管理器
*/
var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MySceneManager = /** @class */ (function () {
            function MySceneManager() {
            }
            MySceneManager.getInstance = function () {
                if (this.instance == null)
                    this.instance = new MySceneManager();
                return this.instance;
            };
            /**
             * 进入场景，会自动清理之前的场景！
             */
            MySceneManager.prototype.runScene = function (scene, data) {
                this.nowScene = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.nowScene);
                this.nowScene = new scene(data);
            };
            /**
             * 弹窗
             */
            MySceneManager.prototype.showWindow = function (win, data) {
                this.nowWindow = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.nowWindow);
                this.nowWindow = new win(data);
            };
            return MySceneManager;
        }());
        MyClass.MySceneManager = MySceneManager;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MySceneManager.js.map