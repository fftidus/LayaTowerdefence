var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var SoundManager = laya.media.SoundManager;
        var SoundManagerMy = /** @class */ (function () {
            function SoundManagerMy() {
                this.DirPath = "Sound";
                this.pause = 0;
                this.mute = false;
                this.isLoading = false;
                this.Dic_fullName = {};
            }
            SoundManagerMy.getInstance = function () {
                if (SoundManagerMy.instance == null) {
                    SoundManagerMy.instance = new SoundManagerMy();
                }
                return SoundManagerMy.instance;
            };
            SoundManagerMy.prototype.addSounds = function (arr, f) {
                if (this.isLoading == true) {
                    if (this.Arr_waite == null)
                        this.Arr_waite = [];
                    this.Arr_waite.push({ "arr": arr, "f": f });
                    return;
                }
                this.Arr_now = arr;
                this.Fun = f;
                this.nextF(true);
            };
            SoundManagerMy.prototype.nextF = function (first) {
                if (first === void 0) { first = false; }
                this.isLoading = true;
                if (first == false) {
                    this.Arr_now.shift();
                    if (this.Arr_now.length == 0) {
                        com.MyClass.Tools.Tool_Function.onRunFunction(this.Fun);
                        this.Fun = null;
                        this.Arr_now = null;
                        if (this.Arr_waite == null || this.Arr_waite.length == 0) {
                            this.isLoading = false;
                        }
                        else {
                            var waite = this.Arr_waite.shift();
                            this.Arr_now = waite["arr"];
                            this.Fun = waite["f"];
                            this.nextF(true);
                        }
                        return;
                    }
                }
                if (this.Arr_now[0] == null) {
                    this.nextF();
                    return;
                }
                var name = this.Arr_now[0][0];
                var fullName;
                var dir = this.Arr_now[0][1];
                if (dir == null || dir.length == 0) {
                    fullName = name;
                }
                else if (dir.charAt(dir.length - 1) == "/") {
                    fullName = dir + name;
                }
                else {
                    fullName = dir + "/" + name;
                }
                fullName = this.DirPath + "/" + fullName + ".mp3";
                this.Dic_fullName[name] = fullName;
                this.nextF(); //强制next
            };
            //@@@@@@@@@@@@@@@@@@@@@@播放@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            SoundManagerMy.prototype.getFullName = function (name) {
                return this.Dic_fullName[name];
            };
            SoundManagerMy.prototype.playMusic = function (name, vol, stopF, sTime, loop, fadeTime) {
                if (vol === void 0) { vol = -1; }
                if (stopF === void 0) { stopF = null; }
                if (sTime === void 0) { sTime = 0; }
                if (loop === void 0) { loop = 9999; }
                if (fadeTime === void 0) { fadeTime = 0; }
                name = this.getFullName(name);
                if (name) {
                    SoundManager.playMusic(name, 0, stopF);
                }
            };
            SoundManagerMy.prototype.playSound = function (name, vol) {
                if (vol === void 0) { vol = 1; }
                name = this.getFullName(name);
                if (name) {
                    SoundManager.playSound(name);
                }
            };
            SoundManagerMy.prototype.setVol = function (vol, name) {
                if (name === void 0) { name = null; }
                SoundManager.soundVolume = vol;
            };
            /*
                *  @fadeTime 缓出时间（毫秒）
            */
            SoundManagerMy.prototype.stopMusic = function (name, fadeTime) {
                if (fadeTime === void 0) { fadeTime = 0; }
                SoundManager.stopMusic();
            };
            SoundManagerMy.prototype.removeSound = function (id) {
            };
            SoundManagerMy.prototype.stopAll = function () {
                SoundManager.stopAll();
            };
            SoundManagerMy.prototype.haveSound = function (name) {
                //			if(this.Dic_have[name] == null)	return false;
                return true;
            };
            SoundManagerMy.prototype.destroyF = function () {
                //			SoundAS.stopAll();
                //			SoundAS.removeAll();
                SoundManagerMy.instance = null;
                SoundManagerMy.nowMic = null;
                SoundManagerMy.countBackNum = 0;
            };
            SoundManagerMy.soundVal = 1;
            return SoundManagerMy;
        }());
        MyClass.SoundManagerMy = SoundManagerMy;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=SoundManagerMy.js.map