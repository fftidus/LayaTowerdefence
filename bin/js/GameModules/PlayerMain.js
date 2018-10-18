var GameModules;
(function (GameModules) {
    var PlayerMain = /** @class */ (function () {
        function PlayerMain() {
        }
        PlayerMain.getInstance = function () {
            if (this.instance == null)
                this.instance = new PlayerMain();
            return this.instance;
        };
        PlayerMain.destroyF = function () {
            this.instance = null;
        };
        return PlayerMain;
    }());
    GameModules.PlayerMain = PlayerMain;
})(GameModules || (GameModules = {}));
//# sourceMappingURL=PlayerMain.js.map