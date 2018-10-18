var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var NetTools;
        (function (NetTools) {
            var Handler = laya.utils.Handler;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var Net_SocketCMD = /** @class */ (function () {
                function Net_SocketCMD(cmd, __dicSendType, __dicReciveType) {
                    if (cmd === void 0) { cmd = 0; }
                    if (__dicSendType === void 0) { __dicSendType = true; }
                    if (__dicReciveType === void 0) { __dicReciveType = true; }
                    this.haveListener = false;
                    this.Arr_Fun = [];
                    this.Arr_autoClear = [];
                    this.Type = null;
                    this.isDicSendType = __dicSendType;
                    this.isDicGetType = __dicReciveType;
                    this.CMD = cmd;
                    if (this.CMD == 0) {
                        var name = Tool_Function.getLastClassName(this);
                        var arr = name.split("CMD");
                        this.CMD = Tool_Function.onForceConvertType(arr[arr.length - 1]);
                    }
                    this.Hrecive = Handler.create(this, this.recivedF, null, false);
                }
                Net_SocketCMD.prototype.funAddListener = function (f, once) {
                    if (this.haveListener == false) {
                        NetTools.MgsSocket.getInstance().addCmdListener(this.CMD, this.Hrecive);
                        this.haveListener = true;
                    }
                    this.Arr_Fun.push(f);
                    this.Arr_autoClear.push(once);
                };
                Net_SocketCMD.prototype.funcRemoveListener = function (f) {
                    for (var i = 0; i < this.Arr_Fun.length; i++) {
                        if (Tool_Function.compareHandlers(f, this.Arr_Fun[i]) == true) {
                            this.Arr_Fun.splice(i, 1);
                            this.Arr_autoClear.splice(i, 1);
                            i--;
                        }
                    }
                    if (this.Arr_Fun.length == 0) {
                        NetTools.MgsSocket.getInstance().removeCmdListener(this.CMD, this.Hrecive);
                        this.haveListener = false;
                    }
                };
                Net_SocketCMD.prototype.recivedF = function (b) {
                    var b2 = new NetTools.MyByteArray(this.CMD);
                    b2.readF(b);
                    var f;
                    if (this.isDicGetType) {
                        if (b2.Arr_val.length > 0)
                            this.dic_Get = b2.Arr_val[0];
                        for (var i = 0; i < this.Arr_Fun.length; i++) {
                            if (this.Arr_Fun == null)
                                return;
                            f = this.Arr_Fun[i];
                            if (this.Arr_autoClear[i] == true) {
                                this.funcRemoveListener(this.Arr_Fun[i]);
                                i--;
                            }
                            f.runWith(this.dic_Get);
                            if (this.Arr_Fun == null)
                                return;
                        }
                        this.dic_Get = null;
                    }
                    else {
                        this.Arr_values = b2.Arr_val;
                        for (i = 0; i < this.Arr_Fun.length; i++) {
                            if (this.Arr_Fun == null)
                                return;
                            f = this.Arr_Fun[i];
                            if (this.Arr_autoClear[i] == true) {
                                this.funcRemoveListener(this.Arr_Fun[i]);
                                i--;
                            }
                            f.runWith(this.Arr_values);
                            if (this.Arr_Fun == null)
                                return;
                        }
                    }
                };
                Net_SocketCMD.prototype.writeValue_Dic = function (key, val) {
                    if (this.isDicSendType == false)
                        throw new Error("不能使用该方法");
                    if (this.dic_Send == null)
                        this.dic_Send = new Dictionary();
                    this.dic_Send.set(key, val);
                };
                Net_SocketCMD.prototype.writeValueF_Arr = function (values) {
                    if (this.isDicSendType == true)
                        throw new Error("不能使用该方法");
                    this.Arr_values = values.concat();
                };
                Net_SocketCMD.prototype.sendF = function (needRadom) {
                    if (needRadom === void 0) { needRadom = true; }
                    if (this.Type == null) {
                        if (NetTools.MgsSocket.getInstance().nowFlag == null) {
                            console.log("Socket未连接！");
                            return;
                        }
                        if (NetTools.MgsSocket.getInstance().nowFlag == "关闭") {
                            console.log("已断网");
                            return;
                        }
                    }
                    else {
                    }
                    var b = new NetTools.MyByteArray();
                    if (this.isDicSendType == false) {
                        if (this.Arr_values != null) {
                            b.writeF(this.Arr_values);
                        }
                        if (needRadom)
                            NetTools.MgsSocket.getInstance().sendMessage(this.CMD, b.WriteB, true, this.Type);
                        else
                            NetTools.MgsSocket.getInstance().sendMessage(this.CMD, b.WriteB, false, this.Type);
                        return;
                    }
                    else if (this.dic_Send != null) {
                        b.writeF(this.dic_Send);
                    }
                    if (needRadom)
                        NetTools.MgsSocket.getInstance().sendMessage(this.CMD, b.WriteB, true, this.Type);
                    else
                        NetTools.MgsSocket.getInstance().sendMessage(this.CMD, b.WriteB, false, this.Type);
                };
                Net_SocketCMD.prototype.destroyF = function () {
                    if (this.haveListener == true) {
                        NetTools.MgsSocket.getInstance().removeCmdListener(this.CMD, this.Hrecive);
                        this.haveListener = false;
                    }
                    this.Arr_Fun = null;
                    this.dic_Send = null;
                    this.dic_Get = null;
                    this.Hrecive.clear();
                };
                return Net_SocketCMD;
            }());
            NetTools.Net_SocketCMD = Net_SocketCMD;
        })(NetTools = MyClass.NetTools || (MyClass.NetTools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Net_SocketCMD.js.map