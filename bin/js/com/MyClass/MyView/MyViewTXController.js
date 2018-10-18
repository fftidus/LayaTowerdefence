var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var MyViewTXController = /** @class */ (function () {
                function MyViewTXController(spr, useMyTx) {
                    if (useMyTx === void 0) { useMyTx = false; }
                    this.Dic_TX = {};
                    this.Dic_TXI = {};
                    this.Dic_Hide = {};
                    for (var i = 0; i < spr.numChildren; i++) {
                        var obj = spr.getChildAt(i);
                        if (obj.name == null)
                            continue;
                        var strName = obj.name;
                        if (strName.indexOf("tx_") == 0 && obj instanceof starling.TextField) {
                            //对齐，颜色，size都可以在编辑器设置，不写在name中
                            obj.autoScale = true;
                            this.Dic_TX[strName] = obj;
                        }
                        else if (strName.indexOf("txi_") == 0) {
                            var col = "白";
                            if (obj instanceof starling.TextField) {
                                col = obj.format.color;
                            }
                            var tx = MyView.MyTextInput.getNewOne(spr, strName, 0, col);
                            this.Dic_TXI[tx.Name] = tx;
                            if (obj instanceof starling.TextField) {
                                tx.setValue("默认文字", obj.text);
                            }
                            com.MyClass.Tools.Tool_ObjUtils.destroyF_One(obj);
                            i--;
                        }
                    }
                }
                /*********** 获得文本对象 ***********/
                MyViewTXController.prototype.getTextField = function (strName) {
                    return this.Dic_TX[strName];
                };
                MyViewTXController.prototype.getInput = function (strName) {
                    return this.Dic_TXI[strName];
                };
                /*********** 获得或修改文本文字 ***********/
                MyViewTXController.prototype.getText = function (strName) {
                    if (this.Dic_TX[strName])
                        return this.Dic_TX[strName].text;
                    if (this.Dic_TXI[strName])
                        return this.Dic_TXI[strName].text;
                    var n;
                    for (n in this.Dic_TX) {
                        if (n.indexOf(strName) == 0)
                            return this.Dic_TX[n].text;
                    }
                    for (n in this.Dic_TXI) {
                        if (n.indexOf(strName) == 0)
                            return this.Dic_TXI[n].text;
                    }
                    return null;
                };
                MyViewTXController.prototype.setText = function (strName, txt) {
                    if (this.Dic_TX[strName])
                        this.Dic_TX[strName].text = txt;
                    if (this.Dic_TXI[strName])
                        this.Dic_TXI[strName].text = txt;
                    var n;
                    if (strName == "tx_") {
                        for (n in this.Dic_TX) {
                            this.Dic_TX[n].text = txt;
                        }
                    }
                    else if (strName == "txi_") {
                        for (n in this.Dic_TXI) {
                            this.Dic_TXI[n].text = txt;
                        }
                    }
                };
                MyViewTXController.prototype.addChangeEventListener = function (strName, f) {
                    if (strName == null || f == null)
                        return;
                    if (this.Dic_Listener == null)
                        this.Dic_Listener = {};
                    if (this.Dic_Listener[strName] == null) {
                        this.Dic_TXI[strName].setValue("输入事件", this.onChangeEvent);
                        this.Dic_Listener[strName] = [];
                    }
                    if (this.Dic_Listener[strName].indexOf(f) == -1)
                        this.Dic_Listener[strName].push(f);
                };
                MyViewTXController.prototype.onChangeEvent = function (tar) {
                    if (this.Dic_TXI[tar] == null || this.Dic_Listener == null || this.Dic_Listener[tar] == null)
                        return;
                    for (var i = 0; i < this.Dic_Listener[tar].length; i++) {
                        if (this.Dic_Listener[tar][i]) {
                            var f = this.Dic_Listener[tar][i];
                            com.MyClass.Tools.Tool_Function.onRunFunction(f, tar);
                        }
                    }
                };
                MyViewTXController.prototype.onHideInput = function (real) {
                    var n;
                    for (n in this.Dic_TXI) {
                        if (this.Dic_TXI[n] == null)
                            continue;
                        if (real == false) {
                            if (this.Dic_Hide[n] != true)
                                continue;
                        }
                        else {
                            if (this.Dic_Hide[n] == true)
                                continue;
                        }
                        this.Dic_Hide[n] = real;
                        this.Dic_TXI[n].setValue("隐藏", real);
                    }
                };
                MyViewTXController.prototype.destroyF = function () {
                    this.Dic_Listener = null;
                    this.Dic_TX = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Dic_TX);
                    this.Dic_TXI = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Dic_TXI);
                };
                return MyViewTXController;
            }());
            MyView.MyViewTXController = MyViewTXController;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyViewTXController.js.map