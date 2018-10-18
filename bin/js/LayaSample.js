var WebGL = Laya.WebGL;
// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        com.MyClass.Config.stageW = 1136;
        com.MyClass.Config.stageH = 640;
        Laya.init(com.MyClass.Config.stageW, com.MyClass.Config.stageH, Laya.WebGL);
        com.MyClass.MainManager.getInstence().init(Laya.stage);
        var source = [
            [Global.SWF_Default, "swf"]
        ];
        com.MyClass.MySourceManager.getInstance().addTexture(source, laya.utils.Handler.create(this, this.startGame));
    }
    /** 正式开始游戏 */
    GameMain.prototype.startGame = function () {
        new com.MyClass.MyLoadingView([
            "res/public/blue_btn.png",
            "res/public/btn_nom.png",
            "res/public/btn_return.png",
            "res/public/button_que.png",
            "res/public/yellow_btn.png"
        ], this.startGame, this);
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map