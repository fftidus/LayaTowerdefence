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
        com.MyClass.MySourceManager.getInstance().addTexture(source, laya.utils.Handler.create(this, this.initF));
    }
    /** 初始化资源加载完成 */
    GameMain.prototype.initF = function () {
        new com.MyClass.MyLoadingView([
            Global.SWF_Fight + ".swf",
            "res/skyBack.jpg"
        ], this.startGame, this);
    };
    /** 正式开始游戏 */
    GameMain.prototype.startGame = function () {
        var data = new Maps.MyTiledMap_Data({
            "size": 100,
            "底": "spr_map1",
            "url": { "g1": { "url": "spr_Map1", "swf": "SWF_Fight", "size": 20, "can": true }
            },
            "row": 20,
            "col": 20,
            "地表": {
                1: { "g1": [1] }
            }
            // ,"物体":{
            //     1:{"b1":[1]}
            //     ,5:{"i1":[5,6,7,8,9,10]}
            // }
        });
        com.MyClass.MySceneManager.getInstance().runScene(MainGame.View_MainGame, { "map": data });
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=Main.js.map