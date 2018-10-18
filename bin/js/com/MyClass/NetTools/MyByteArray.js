var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var NetTools;
        (function (NetTools) {
            var Byte = laya.utils.Byte;
            var Tool_Function = com.MyClass.Tools.Tool_Function;
            var MyByteArray = /** @class */ (function () {
                function MyByteArray(cmd) {
                    if (cmd === void 0) { cmd = -1; }
                    this.CMD = cmd;
                }
                MyByteArray.prototype.writeF = function (val) {
                    if (this.WriteB == null)
                        this.WriteB = new Byte();
                    if (val instanceof Array) {
                        for (var i = 0; i < val.length; i++) {
                            this.write(val[i]);
                        }
                    }
                    else
                        this.write(val);
                };
                MyByteArray.prototype.write = function (val) {
                    if (typeof val == "number") {
                        if (val != Tool_Function.onForceConvertType(val)) {
                            //小数
                            this.WriteB.writeByte(5);
                            this.WriteB.writeFloat64(val);
                            return;
                        }
                        var n = Math.abs(val);
                        if (n < 127) {
                            this.WriteB.writeByte(1);
                            this.WriteB.writeByte(val);
                        }
                        else if (n < 32767) {
                            this.WriteB.writeByte(2);
                            this.WriteB.writeInt16(val);
                        }
                        else if (n < 2147483647) {
                            this.WriteB.writeByte(3);
                            this.WriteB.writeInt32(val);
                        }
                        else {
                            this.WriteB.writeByte(5);
                            this.WriteB.writeFloat64(val);
                        }
                    }
                    else if (typeof val === "string") {
                        this.WriteB.writeByte(4);
                        this.WriteB.writeUTFString(val);
                    }
                    else if (val == null || val == undefined) {
                        this.WriteB.writeByte(8);
                    }
                    else if (typeof val == "boolean") {
                        this.WriteB.writeByte(7);
                        if (val == true)
                            this.WriteB.writeByte(1);
                        else
                            this.WriteB.writeByte(0);
                    }
                    else if (val instanceof Array) {
                        this.WriteB.writeByte(6);
                        this.write(val.length);
                        for (var i = 0; i < val.length; i++) {
                            this.write(val[i]);
                        }
                        return;
                    }
                    else if (val instanceof Byte) {
                        this.WriteB.writeByte(10);
                        this.write(val.length);
                        this.WriteB.writeArrayBuffer(val, 0, val.length);
                    }
                    else if (val instanceof Dictionary) {
                        var dic = val;
                        var arr_key = dic.keys;
                        var arr_val = dic.values;
                        this.WriteB.writeByte(9);
                        this.write(arr_key.length);
                        for (var i2 = 0; i2 < arr_key.length; i2++) {
                            this.write(arr_key[i2]);
                            this.write(arr_val[i2]);
                        }
                    }
                    else {
                        arr_key = [];
                        arr_val = [];
                        for (var key in val) {
                            arr_key.push(key);
                            arr_val.push(val[key]);
                        }
                        this.WriteB.writeByte(9);
                        this.write(arr_key.length);
                        for (var i2 = 0; i2 < arr_key.length; i2++) {
                            this.write(arr_key[i2]);
                            this.write(arr_val[i2]);
                        }
                    }
                };
                MyByteArray.prototype.readF = function (buf) {
                    this.Arr_val = [];
                    buf.pos = 0;
                    while (buf.bytesAvailable > 0) {
                        this.Arr_val.push(readNext());
                    }
                    function readNext() {
                        var val;
                        var n = buf.readByte();
                        if (n == 1)
                            val = buf.readByte();
                        else if (n == 2)
                            val = buf.getInt16();
                        else if (n == 3)
                            val = buf.getInt32();
                        else if (n == 4) {
                            val = com.MyClass.Tools.Tool_StringBuild.replaceSTR(buf.readUTFString(), "\\n", "\n");
                        }
                        else if (n == 5)
                            val = buf.getFloat64();
                        else if (n == 6) {
                            var lenType = buf.readByte();
                            var len;
                            if (lenType == 1)
                                len = buf.readByte();
                            else if (lenType == 2)
                                len = buf.getInt16();
                            var arr = [];
                            for (; len > 0; len--) {
                                arr.push(readNext());
                            }
                            return arr;
                        }
                        else if (n == 7) {
                            val = Tool_Function.onForceConvertType(buf.readByte());
                            if (val == 0)
                                return false;
                            else
                                return true;
                        }
                        else if (n == 8) {
                            return null;
                        }
                        else if (n == 9) {
                            var dic = {};
                            lenType = buf.readByte();
                            if (lenType == 1)
                                len = buf.readByte();
                            else if (lenType == 2)
                                len = buf.getInt16();
                            var key;
                            for (; len > 0; len--) {
                                key = readNext();
                                dic[key] = readNext();
                            }
                            return dic;
                        }
                        else if (n == 10) {
                            var b = new Byte();
                            var l = readNext();
                            for (var i = 0; i < l; i++) {
                                b.writeByte(buf.readByte());
                            }
                            val = b;
                        }
                        else {
                            MyClass.Config.LogF("Unkownd Type In MyByteArray's readF!CMD==" + this.CMD + ",n==" + n);
                            return null;
                        }
                        return val;
                    }
                };
                return MyByteArray;
            }());
            NetTools.MyByteArray = MyByteArray;
        })(NetTools = MyClass.NetTools || (MyClass.NetTools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyByteArray.js.map