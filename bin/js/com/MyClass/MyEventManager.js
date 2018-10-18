var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyEventManager = /** @class */ (function () {
            function MyEventManager() {
                this.DIC_Listener = {};
                this.isEventing = false;
                this.arrWaite = [];
            }
            MyEventManager.prototype.dispatchF = function (type, val) {
                if (val === void 0) { val = null; }
                if (this.isEventing == true) {
                    this.arrWaite.push(["dispatch", type, val]);
                    return;
                }
                this.isEventing = true;
                if (this.DIC_Listener[type] != null) {
                    var dic = this.DIC_Listener[type];
                    for (var i = 0; i < dic.keys.length; i++) {
                        var id = dic.keys[i];
                        var arr2 = dic.get(id);
                        var f = arr2[0];
                        if (val != null && arr2[2] != null) {
                            com.MyClass.Tools.Tool_Function.onRunFunction(f, arr2[2], val);
                        }
                        else if (val != null) {
                            com.MyClass.Tools.Tool_Function.onRunFunction(f, val);
                        }
                        else if (arr2[2] != null) {
                            com.MyClass.Tools.Tool_Function.onRunFunction(f, arr2[2]);
                        }
                        else {
                            com.MyClass.Tools.Tool_Function.onRunFunction(f);
                        }
                        if (arr2[1] == true) {
                            this.isEventing = false;
                            this.removeListenF(type, f);
                            this.isEventing = true;
                        }
                    }
                }
                this.isEventing = false;
                while (this.arrWaite.length > 0) {
                    var arr = this.arrWaite.shift();
                    var waiteType = arr.shift();
                    if (waiteType == "add") {
                        this.addListenF(arr[0], arr[1], arr[2], arr[3]);
                    }
                    else if (waiteType == "remove") {
                        this.removeListenF(arr[0], arr[1]);
                    }
                    else if (waiteType == "dispatch") {
                        this.dispatchF(arr[0], arr[1]);
                        break; //下一个dispatch会再处理
                    }
                }
            };
            MyEventManager.prototype.addListenF = function (type, fun, val, onece) {
                if (val === void 0) { val = null; }
                if (onece === void 0) { onece = false; }
                if (this.isEventing == true) {
                    this.arrWaite.push(["add", type, fun, val, onece]);
                    return;
                }
                var dic;
                if (this.DIC_Listener[type] == null) {
                    dic = new Dictionary();
                    dic.set(fun, [fun, onece, val]);
                    this.DIC_Listener[type] = dic;
                }
                else {
                    dic = this.DIC_Listener[type];
                    dic.set(fun, [fun, onece, val]);
                }
            };
            MyEventManager.prototype.removeListenF = function (type, fun) {
                if (this.isEventing == true) {
                    this.arrWaite.push(["remove", type, fun]);
                    return;
                }
                var dic;
                if (this.DIC_Listener[type] != null) {
                    if (fun == null) {
                        //删除所有事件
                        delete this.DIC_Listener[type];
                    }
                    else {
                        dic = this.DIC_Listener[type];
                        for (var i = 0; i < dic.keys.length; i++) {
                            var fun2 = dic.keys[i];
                            if (com.MyClass.Tools.Tool_Function.compareHandlers(fun, fun2) == true) {
                                dic.remove(fun2);
                                break;
                            }
                        }
                    }
                }
            };
            MyEventManager.prototype.haveListener = function (type) {
                var num = 0;
                if (this.DIC_Listener[type] != null) {
                    var dic = this.DIC_Listener[type];
                    num = dic.keys.length;
                }
                return num;
            };
            MyEventManager.prototype.destroyF = function () {
                for (var id in this.DIC_Listener) {
                    this.removeListenF(id, null);
                    delete this.DIC_Listener[id];
                }
            };
            return MyEventManager;
        }());
        MyClass.MyEventManager = MyEventManager;
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyEventManager.js.map