var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var NetTools;
        (function (NetTools) {
            var CmdRand = /** @class */ (function () {
                function CmdRand() {
                    this._seed = 0;
                    this.seed = 0;
                }
                CmdRand.getInstance = function () {
                    if (this.instance == null)
                        this.instance = new CmdRand();
                    return this.instance;
                };
                CmdRand.prototype.next = function () {
                    this.lastSeed = this._seed;
                    do {
                        this._seed ^= (this._seed << 21);
                        this._seed ^= (this._seed >> 21);
                        this._seed ^= (this._seed << 4);
                    } while (this._seed == 0 || this.seed == this._seed);
                    this.seed = this._seed;
                    return this._seed;
                };
                CmdRand.prototype.setSeed = function (n) {
                    this._seed = n;
                    this.lastSeed = n;
                };
                return CmdRand;
            }());
            NetTools.CmdRand = CmdRand;
        })(NetTools = MyClass.NetTools || (MyClass.NetTools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=CmdRand.js.map