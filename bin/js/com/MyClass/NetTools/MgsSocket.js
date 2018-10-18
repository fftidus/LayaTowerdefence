var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var NetTools;
        (function (NetTools) {
            var Handler = laya.utils.Handler;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var Socket = laya.net.Socket;
            var Event = laya.events.Event;
            var MgsSocket = /** @class */ (function () {
                function MgsSocket() {
                    this.CMDLENGTH = 2; //指令头的长度，short
                    this.SEEDLength = 4; //随机头长度，int
                    this.needURL = "/websocket";
                    this.PORT = -1;
                    this.timeLimite = 8; //自动断网时间
                    this.isListening = false;
                    this.SaveCMD = -1;
                    this.needCloseEvent = false;
                    this._pause = false;
                    this.Seed = NetTools.CmdRand.getInstance();
                    this.socket = new Socket();
                    this._cmdDict = new Dictionary();
                    this.onTimeOverHandler = Handler.create(this, this.onTimeWrongF, null, false);
                }
                MgsSocket.getInstance = function () {
                    if (this._mgsSocket == null) {
                        this._mgsSocket = new MgsSocket();
                    }
                    return this._mgsSocket;
                };
                MgsSocket.prototype.getSocket = function (type) {
                    if (type === void 0) { type = null; }
                    if (type == null)
                        return this.socket;
                    return null;
                };
                MgsSocket.prototype.connectF = function (ip, port) {
                    if (ip != null)
                        this.IP = ip;
                    if (this.IP.indexOf(":") == -1) {
                        this.IP += ":" + port;
                        if (this.needURL)
                            this.IP += this.needURL;
                    }
                    this.addListeners();
                    this.nowFlag = "正在连接";
                    if (!this.socket.connected) {
                        console.log("webSocket开始连接：" + this.IP + "          ,端口" + this.PORT);
                        if (this.PORT == -1) {
                            this.socket.connectByUrl("ws://" + this.IP);
                        }
                        else {
                            this.socket.connect(this.IP, this.PORT);
                        }
                    }
                };
                /**
                 *配置socket监听事件
                 *
                 */
                MgsSocket.prototype.addListeners = function () {
                    if (this.isListening)
                        return;
                    this.isListening = true;
                    this.socket.on(Event.OPEN, this, this.connectHandler, null);
                    this.socket.on(Event.CLOSE, this, this.closeHandler, null);
                    this.socket.on(Event.ERROR, this, this.ioErrorHandler, null);
                    this.socket.on(Event.MESSAGE, this, this.socketDataHandler, null);
                };
                /**
                 *删除socket监听事件
                 *
                 */
                MgsSocket.prototype.removeListeners = function () {
                    this.isListening = false;
                    this.socket.offAll();
                };
                MgsSocket.prototype.connectHandler = function (event) {
                    console.log("socket连接成功！");
                    this.nowFlag = "连接";
                    if (this.Fun_connect != null) {
                        this.Fun_connect.runWith(true);
                        this.Fun_connect = null;
                    }
                };
                /**
                 *当服务端关闭后触发
                 * @param event
                 *
                 */
                MgsSocket.prototype.closeHandler = function (event) {
                    if (this.nowFlag == null) {
                        return;
                    }
                    console.log("socket已关闭!now状态=" + this.nowFlag);
                    this.nowFlag = null;
                    if (this.needCloseEvent == true) {
                        MyClass.MainManager.getInstence().MEM.dispatchF(MgsSocket.Event_Close);
                    }
                };
                MgsSocket.prototype.closeSocket = function () {
                    if (this.socket != null && this.socket.connected)
                        this.socket.close();
                    else {
                        this.closeHandler(null);
                    }
                };
                /**
                 * IO异常
                 * @param event
                 *
                 */
                MgsSocket.prototype.ioErrorHandler = function (event) {
                    console.log("socket io错误");
                    if (this.Fun_connect != null) {
                        this.Fun_connect.runWith(false);
                        this.Fun_connect = null;
                    }
                };
                /**
                 *收到服务端发送数据触发
                 * @param event
                 *
                 */
                MgsSocket.prototype.socketDataHandler = function (message) {
                    var buf;
                    if (typeof message == "string") //
                     {
                        console.log("收到String消息：", message);
                    }
                    else if (message instanceof ArrayBuffer) {
                        buf = new laya.utils.Byte();
                        buf.writeArrayBuffer(message);
                        buf.pos = 0;
                        this.getBytes(buf);
                    }
                    this.socket.input.clear();
                };
                MgsSocket.prototype.getBytes = function (buf) {
                    var l = buf.getInt32();
                    var cmd = buf.getInt16();
                    var realData = new laya.utils.Byte();
                    var arr = buf.getUint8Array(0, buf.length);
                    // buf.readBytes(realData, 0, buf.bytesAvailable);
                    realData.writeArrayBuffer(arr);
                    this.receiveCommand(cmd, realData);
                    realData = null;
                    buf = null;
                };
                MgsSocket.prototype.receiveCommand = function (cmd, dataBytes) {
                    if (cmd == this.CMDHeart) {
                        var c = new NetTools.Net_SocketCMD(this.CMDHeart, false, false);
                        c.sendF(false);
                        return;
                    }
                    if (this.pause == true) {
                        if (this.Arr_WaiteReceiveCMD == null)
                            this.Arr_WaiteReceiveCMD = [];
                        this.Arr_WaiteReceiveCMD.push([cmd, dataBytes]);
                        return;
                    }
                    var hander = this._cmdDict.get(cmd);
                    if (hander != null) {
                        var l = hander.length;
                        for (var i = 0; i < l; i++) {
                            if (i >= hander.length)
                                break;
                            var val = hander[i];
                            if (val == null)
                                continue;
                            Tool_Function.onRunFunction(val, dataBytes);
                        }
                        for (i = 0; i < hander.length; i++) {
                            if (hander[i] == null)
                                hander.splice(i--, 1);
                        }
                    }
                    if (cmd == this.SaveCMD) {
                        this.SaveCMD = -1;
                        this.SaveBuf = null;
                        MyClass.MainManager._instence.remove_delayFunction(this.onTimeOverHandler);
                        if (this.Arr_WaiteSendCMD != null && this.Arr_WaiteSendCMD.length > 0) {
                            var tmp = this.Arr_WaiteSendCMD.shift();
                            console.log("发送缓存指令：" + tmp[0]);
                            this.sendMessage(tmp[0], tmp[1], tmp[2], tmp[3]);
                        }
                        else {
                            if (this.FunGetReconnectCMD) {
                                Tool_Function.onRunFunction(this.FunGetReconnectCMD);
                                this.FunGetReconnectCMD = null;
                            }
                        }
                    }
                };
                /**
                 *添加某个消息号的监听
                 * @param cmd	消息号
                 * @param args	传两个参数，0为处理函数  1为需要填充的数据对象
                 *
                 */
                MgsSocket.prototype.addCmdListener = function (cmd, hander) {
                    var arr = this._cmdDict.get(cmd);
                    if (arr == null) {
                        arr = [];
                        this._cmdDict.set(cmd, arr);
                    }
                    arr.push(hander);
                };
                /**
                 *移除 消息号监听
                 * @param cmd
                 *
                 */
                MgsSocket.prototype.removeCmdListener = function (cmd, listener) {
                    var handers = this._cmdDict.get(cmd);
                    if (handers != null && handers.length > 0) {
                        var length = handers.length;
                        for (var i = (length - 1); i >= 0; i--) {
                            if (handers[i] instanceof Array) {
                                for (var j = 0; j < handers[i].length; j++) {
                                    if (com.MyClass.Tools.Tool_Function.compareHandlers(listener, handers[i][j]) == true) {
                                        handers[i][j] = null;
                                    }
                                }
                            }
                            else if (Tool_Function.compareHandlers(listener, handers[i]) == true) {
                                handers[i] = null; //从数组中删除元素
                            }
                        }
                    }
                };
                MgsSocket.prototype.sendMessage = function (cmd, content, needRandom, type) {
                    if (needRandom === void 0) { needRandom = true; }
                    if (type === void 0) { type = null; }
                    if (this.SaveCMD != -1 && needRandom == true) { //正在等待上一个指令
                        if (this.Arr_WaiteSendCMD == null)
                            this.Arr_WaiteSendCMD = [];
                        this.Arr_WaiteSendCMD.push([cmd, content, needRandom, type]);
                        return;
                    }
                    //加随机数
                    var contentLen = 0;
                    if (content != null) {
                        contentLen = content.length;
                    }
                    var lastSaveBuf = this.SaveBuf;
                    this.SaveBuf = new laya.utils.Byte();
                    this.SaveBuf.writeInt32(contentLen + this.CMDLENGTH + this.SEEDLength);
                    if (needRandom) {
                        var cmdSeed = NetTools.CmdRand.getInstance().next();
                        this.SaveBuf.writeInt32(cmdSeed);
                    }
                    else
                        this.SaveBuf.writeInt32(0);
                    this.SaveBuf.writeInt16(cmd);
                    if (content != null) {
                        this.SaveBuf.writeArrayBuffer(content, 0, content.length);
                    }
                    this.sendF(type);
                    if (needRandom == false) {
                        this.SaveBuf = lastSaveBuf;
                    }
                    else {
                        this.SaveCMD = cmd;
                        if (this.timeLimite > 0 && MyClass.MainManager._instence != null) {
                            MyClass.MainManager._instence.add_delayFunction(this.onTimeOverHandler, this.timeLimite * MyClass.Config.playSpeedTrue);
                        }
                    }
                };
                MgsSocket.prototype.onTimeWrongF = function () {
                    console.log("超时关闭socket！" + this.SaveCMD);
                    if (this.SaveCMD == -1 || this.SaveBuf == null) {
                        return;
                    }
                    this.closeSocket();
                };
                MgsSocket.prototype.sendF = function (type) {
                    if (this.socket.connected == false) {
                        this.closeHandler(null);
                        return;
                    }
                    if (type == null) {
                        if (this.SaveBuf == null)
                            return;
                        this.SaveBuf.pos = 0;
                        for (var i = 0; i < this.SaveBuf.length; i++) {
                            this.socket.output.writeByte(this.SaveBuf.readByte());
                        }
                        this.SaveBuf.pos = 0;
                        this.socket.flush();
                    }
                    else {
                        console.log("暂未支持h5的mysocket");
                    }
                };
                MgsSocket.prototype.onSendCache = function (f) {
                    if (this.SaveCMD == -1) {
                        if (f)
                            Tool_Function.onRunFunction(f);
                        return;
                    }
                    console.log("发送缓存指令：" + this.SaveCMD);
                    this.FunGetReconnectCMD = f;
                    MyClass.MainManager._instence.add_delayFunction(this.onTimeOverHandler, this.timeLimite * MyClass.Config.playSpeedTrue);
                    this.sendF(null);
                };
                MgsSocket.prototype.destroyF = function () {
                    this.removeListeners();
                    if (this.socket != null && this.socket.connected)
                        this.socket.close();
                    this._cmdDict = new Dictionary();
                    MgsSocket._mgsSocket = null;
                    this.onTimeOverHandler.clear();
                };
                Object.defineProperty(MgsSocket.prototype, "pause", {
                    get: function () {
                        return this._pause;
                    },
                    set: function (value) {
                        this._pause = value;
                        if (value == false) {
                            if (this.Arr_WaiteReceiveCMD) {
                                while (this.Arr_WaiteReceiveCMD.length > 0) {
                                    this.receiveCommand(this.Arr_WaiteReceiveCMD[0][0], this.Arr_WaiteReceiveCMD[0][1]);
                                    this.Arr_WaiteReceiveCMD.shift();
                                }
                            }
                            this.Arr_WaiteReceiveCMD = null;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                MgsSocket.Event_Close = "网络断开";
                return MgsSocket;
            }());
            NetTools.MgsSocket = MgsSocket;
        })(NetTools = MyClass.NetTools || (MyClass.NetTools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MgsSocket.js.map