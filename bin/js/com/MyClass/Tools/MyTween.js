var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var MyTween = /** @class */ (function () {
                function MyTween(mc, fover, val, frun, val2) {
                    if (fover === void 0) { fover = null; }
                    if (val === void 0) { val = null; }
                    if (frun === void 0) { frun = null; }
                    if (val2 === void 0) { val2 = null; }
                    this.FR = 1; //摩擦力----每秒减少多少
                    this.spdXYMax = 30;
                    this.secondLimite = 0.5;
                    this.secondLimiteBack = 0.15;
                    this.role = mc;
                    this.FunOver = fover;
                    this.FunVal = val;
                    this.FunRun = frun;
                    this.FunVal2 = val2;
                }
                MyTween.prototype.initXYLine = function (spdX0, spdY0, _endX0, _endX1, _endY0, _endY1, cx, cy, canout) {
                    if (canout === void 0) { canout = true; }
                    this.type = "xy";
                    this.moveType = "line";
                    this.canOut = canout;
                    if (spdX0 > this.spdXYMax)
                        spdX0 = this.spdXYMax;
                    else if (spdX0 < -this.spdXYMax)
                        spdX0 = -this.spdXYMax;
                    if (spdY0 > this.spdXYMax)
                        spdY0 = this.spdXYMax;
                    else if (spdY0 < -this.spdXYMax)
                        spdY0 = -this.spdXYMax;
                    this.spd_x_now = spdX0;
                    this.FirstX = spdX0;
                    this.spd_y_now = spdY0;
                    this.FirstY = spdY0;
                    this.endX0 = _endX0;
                    this.endX1 = _endX1;
                    this.endY0 = _endY0;
                    this.endY1 = _endY1;
                    if (spdX0 != 0 && (Math.abs(spdX0) / this.FR) > this.secondLimite)
                        this.FR = Math.abs(spdX0) / this.secondLimite;
                    if (spdY0 != 0 && (Math.abs(spdY0) / this.FR) > this.secondLimite)
                        this.FR = Math.abs(spdY0) / this.secondLimite;
                    this.FR = this.FR / MyClass.Config.playSpeedTrue;
                    this.moreX = 0;
                    this.moreY = 0;
                    this.canX = cx;
                    if (this.canX == true) {
                        if (this.spd_x_now > 0)
                            this.a_X = -this.FR;
                        else if (this.spd_x_now < 0)
                            this.a_X = this.FR;
                        else {
                            //					trace("初速度 == 0时：",role.x,endX1,endX0);
                            if (this.role.x > this.endX1) {
                                this.moreX = this.role.x - this.endX1;
                                this.spd_x_now = -this.moreX / (this.secondLimiteBack * MyClass.Config.playSpeedTrue);
                            }
                            else if (this.role.x < this.endX0) {
                                this.moreX = this.role.x - this.endX0;
                                this.spd_x_now = -this.moreX / (this.secondLimiteBack * MyClass.Config.playSpeedTrue);
                            }
                            else {
                                this.stopF();
                                return;
                            }
                        }
                    }
                    this.canY = cy;
                    if (this.canY == true) {
                        if (this.spd_y_now > 0)
                            this.a_Y = -this.FR;
                        else if (this.spd_y_now < 0)
                            this.a_Y = this.FR;
                        else {
                            if (this.role.y > this.endY1) {
                                this.moreY = this.role.y - this.endY1;
                                this.spd_y_now = -this.moreY / (this.secondLimiteBack * MyClass.Config.playSpeedTrue);
                            }
                            else if (this.role.y < this.endY0) {
                                this.moreY = this.role.y - this.endY0;
                                this.spd_y_now = -this.moreY / (this.secondLimiteBack * MyClass.Config.playSpeedTrue);
                            }
                            else {
                                this.stopF();
                                return;
                            }
                        }
                    }
                    MyClass.MainManager.getInstence().MTM.newTween(this.role, this);
                };
                MyTween.prototype.initMCChange = function (spdx, endx, spdy, endy, spdalph, endalph, _spdScal, _endScal, _spdRo, _endRo) {
                    if (_spdRo === void 0) { _spdRo = 0; }
                    if (_endRo === void 0) { _endRo = 0; }
                    //元件状态改变
                    this.type = "元件变化";
                    this.spd_x_now = spdx;
                    this.endX0 = endx;
                    this.spd_y_now = spdy;
                    this.endY0 = endy;
                    this.spdAlph = spdalph;
                    this.endAlph = endalph;
                    this.spdScal = _spdScal;
                    this.endScal = _endScal;
                    this.spdRo = _spdRo;
                    this.endRo = _endRo;
                    MyClass.MainManager.getInstence().MTM.newTween(this.role, this);
                };
                MyTween.prototype.init指定参数Change = function (_names, _end, _spd) {
                    //元件状态改变
                    this.type = "指定参数";
                    this.Arr_Values = _names;
                    this.Arr_ValuesEnd = _end;
                    this.Arr_ValuesSpd = _spd;
                    MyClass.MainManager.getInstence().MTM.newTween(this.role, this);
                };
                MyTween.prototype.moveF = function () {
                    if (this.role == null)
                        return;
                    switch (this.type) {
                        case "xy":
                            this.xyMove();
                            break;
                        case "元件变化":
                            this.mcChange();
                            break;
                        case "指定参数":
                            this.onSPEValueF();
                            break;
                    }
                };
                MyTween.prototype.xyMove = function () {
                    var overx = true;
                    var overy = true;
                    if (this.canX == true) {
                        overx = false;
                        this.role.x += this.spd_x_now;
                        if (this.moreX != 0) {
                            if (this.moreX > 0) {
                                if (this.role.x <= this.endX1) {
                                    this.role.x = this.endX1;
                                    overx = true;
                                }
                            }
                            else {
                                if (this.role.x >= this.endX0) {
                                    this.role.x = this.endX0;
                                    overx = true;
                                }
                            }
                        }
                        else {
                            if (this.FirstX > 0) {
                                if (this.spd_x_now + this.a_X <= 0) {
                                    if (this.role.x > this.endX1) {
                                        if (this.canOut) {
                                            this.moreX = this.role.x - this.endX1;
                                            this.spd_x_now = -this.moreX / (this.secondLimiteBack * MyClass.Config.playSpeedTrue);
                                        }
                                        else {
                                            this.role.x = this.endX1;
                                            overx = true;
                                        }
                                    }
                                    else
                                        overx = true;
                                }
                                else {
                                    if (this.role.x > this.endX1) {
                                        if (this.canOut)
                                            this.spd_x_now += this.a_X;
                                        else {
                                            this.role.x = this.endX1;
                                            overx = true;
                                        }
                                    }
                                    this.spd_x_now += this.a_X;
                                }
                            }
                            else if (this.FirstX < 0) {
                                if (this.spd_x_now + this.a_X >= 0) {
                                    if (this.role.x < this.endX0) {
                                        if (this.canOut) {
                                            this.moreX = this.role.x - this.endX0;
                                            this.spd_x_now = -this.moreX / (this.secondLimiteBack * MyClass.Config.playSpeedTrue);
                                        }
                                        else {
                                            this.role.x = this.endX0;
                                            overx = true;
                                        }
                                    }
                                    else
                                        overx = true;
                                }
                                else {
                                    if (this.role.x < this.endX0) {
                                        if (this.canOut)
                                            this.spd_x_now += this.a_X;
                                        else {
                                            this.role.x = this.endX0;
                                            overx = true;
                                        }
                                    }
                                    this.spd_x_now += this.a_X;
                                }
                            }
                            else
                                this.spd_x_now += this.a_X;
                        }
                        if (overx == true) {
                            this.canX = false;
                        }
                    }
                    if (this.canY == true) {
                        overy = false;
                        this.role.y += this.spd_y_now;
                        if (this.moreY != 0) {
                            if (this.moreY > 0) {
                                if (this.role.y <= this.endY1) {
                                    this.role.y = this.endY1;
                                    overy = true;
                                }
                            }
                            else {
                                if (this.role.y >= this.endY0) {
                                    this.role.y = this.endY0;
                                    overy = true;
                                }
                            }
                        }
                        else {
                            if (this.FirstY > 0) {
                                if (this.spd_y_now + this.a_Y <= 0) {
                                    if (this.role.y > this.endY1) {
                                        if (this.canOut) {
                                            this.moreY = this.role.y - this.endY1;
                                            this.spd_y_now = -this.moreY / (this.secondLimiteBack * MyClass.Config.playSpeedTrue);
                                        }
                                        else {
                                            this.role.y = this.endY1;
                                            overy = true;
                                        }
                                    }
                                    else
                                        overy = true;
                                }
                                else {
                                    if (this.role.y > this.endY1) {
                                        if (this.canOut)
                                            this.spd_y_now += this.a_Y;
                                        else {
                                            this.role.y = this.endY1;
                                            overy = true;
                                        }
                                    }
                                    this.spd_y_now += this.a_Y;
                                }
                            }
                            else if (this.FirstY < 0) {
                                if (this.spd_y_now + this.a_Y >= 0) {
                                    if (this.role.y < this.endY0) {
                                        if (this.canOut) {
                                            this.moreY = this.role.y - this.endY0;
                                            this.spd_y_now = -this.moreY / (this.secondLimiteBack * MyClass.Config.playSpeedTrue);
                                        }
                                        else {
                                            this.role.y = this.endY0;
                                            overy = true;
                                        }
                                    }
                                    else
                                        overy = true;
                                }
                                else {
                                    if (this.role.y < this.endY0) {
                                        if (this.canOut)
                                            this.spd_y_now += this.a_Y;
                                        else {
                                            this.role.y = this.endY0;
                                            overy = true;
                                        }
                                    }
                                    this.spd_y_now += this.a_Y;
                                }
                            }
                        }
                        if (overy == true) {
                            this.canY = false;
                        }
                    }
                    if (this.FunRun) {
                        com.MyClass.Tools.Tool_Function.onRunFunction(this.FunRun, this.FunVal2);
                    }
                    if (overx == true && overy == true)
                        this.stopF();
                };
                MyTween.prototype.mcChange = function () {
                    var over = true;
                    if (this.spd_x_now != 0) {
                        over = false;
                        if (this.spd_x_now > 0 && this.role.x + this.spd_x_now >= this.endX0) {
                            this.role.x = this.endX0;
                            this.spd_x_now = 0;
                        }
                        else if (this.spd_x_now < 0 && this.role.x + this.spd_x_now <= this.endX0) {
                            this.role.x = this.endX0;
                            this.spd_x_now = 0;
                        }
                        else
                            this.role.x += this.spd_x_now;
                    }
                    if (this.spd_y_now != 0) {
                        over = false;
                        if (this.spd_y_now > 0 && this.role.y + this.spd_y_now >= this.endY0) {
                            this.role.y = this.endY0;
                            this.spd_y_now = 0;
                        }
                        else if (this.spd_y_now < 0 && this.role.y + this.spd_y_now <= this.endY0) {
                            this.role.y = this.endY0;
                            this.spd_y_now = 0;
                        }
                        else
                            this.role.y += this.spd_y_now;
                    }
                    if (this.spdAlph != 0) {
                        over = false;
                        if (this.spdAlph > 0 && this.role.alpha + this.spdAlph >= this.endAlph) {
                            this.role.alpha = this.endAlph;
                            this.spdAlph = 0;
                        }
                        else if (this.spdAlph < 0 && this.role.alpha + this.spdAlph <= this.endAlph) {
                            this.role.alpha = this.endAlph;
                            this.spdAlph = 0;
                        }
                        else
                            this.role.alpha += this.spdAlph;
                    }
                    if (this.spdScal != 0) {
                        over = false;
                        if (this.spdScal > 0 && this.role.scaleX + this.spdScal >= this.endScal) {
                            this.role.scaleX = this.endScal;
                            this.role.scaleY = this.endScal;
                            this.spdScal = 0;
                        }
                        else if (this.spdScal < 0 && this.role.scaleX + this.spdScal <= this.endScal) {
                            this.role.scaleX = this.endScal;
                            this.role.scaleY = this.endScal;
                            this.spdScal = 0;
                        }
                        else {
                            this.role.scaleX += this.spdScal;
                            this.role.scaleY += this.spdScal;
                        }
                    }
                    if (this.spdRo != 0) {
                        over = false;
                        var nowR = this.role.rotation; //弧度-角度 ==当前角度
                        if (this.spdRo > 0 && nowR + this.spdRo >= this.endRo) {
                            this.role.rotation = this.endRo;
                            this.spdRo = 0;
                        }
                        else if (this.spdRo < 0 && nowR + this.spdRo <= this.endRo) {
                            this.role.rotation = this.endRo;
                            this.spdRo = 0;
                        }
                        else {
                            this.role.rotation += this.spdRo;
                        }
                    }
                    Tools.Tool_Function.onRunFunction(this.FunRun, this.FunVal2);
                    if (over == true) {
                        this.stopF();
                    }
                };
                MyTween.prototype.onSPEValueF = function () {
                    if (this.Arr_Values.length == 0) {
                        this.stopF();
                        return;
                    }
                    for (var i = 0; i < this.Arr_Values.length; i++) {
                        if (this.Arr_ValuesSpd[i] > 0) {
                            if (this.role[this.Arr_Values[i]] + this.Arr_ValuesSpd[i] >= this.Arr_ValuesEnd[i]) {
                                this.onSPEValue_ComOne(i--);
                            }
                            else
                                this.role[this.Arr_Values[i]] += this.Arr_ValuesSpd[i];
                        }
                        else if (this.Arr_ValuesSpd[i] < 0) {
                            if (this.role[this.Arr_Values[i]] + this.Arr_ValuesSpd[i] <= this.Arr_ValuesEnd[i]) {
                                this.onSPEValue_ComOne(i--);
                            }
                            else
                                this.role[this.Arr_Values[i]] += this.Arr_ValuesSpd[i];
                        }
                        else {
                            this.onSPEValue_ComOne(i--);
                        }
                    }
                    Tools.Tool_Function.onRunFunction(this.FunRun, this.FunVal2);
                };
                MyTween.prototype.onSPEValue_ComOne = function (i) {
                    this.role[this.Arr_Values[i]] = this.Arr_ValuesEnd[i];
                    this.Arr_Values.splice(i, 1);
                    this.Arr_ValuesEnd.splice(i, 1);
                    this.Arr_ValuesSpd.splice(i, 1);
                };
                MyTween.prototype.stopF = function (auto) {
                    if (auto === void 0) { auto = false; }
                    if (this.role == null)
                        return;
                    MyClass.MainManager.getInstence().MTM.newTween(this.role, null);
                    MyClass.MainManager.getInstence().MEM.dispatchF("Tween结束", [this]);
                    this.role = null;
                    if (auto == true) {
                        this.FunOver = Tools.Tool_ObjUtils.destroyF_One(this.FunOver);
                        this.FunVal = Tools.Tool_ObjUtils.destroyF_One(this.FunVal);
                        return;
                    }
                    if (this.FunOver != null) {
                        Tools.Tool_Function.onRunFunction(this.FunOver, this.FunVal);
                        this.FunOver = Tools.Tool_ObjUtils.destroyF_One(this.FunOver);
                        this.FunVal = Tools.Tool_ObjUtils.destroyF_One(this.FunVal);
                    }
                };
                return MyTween;
            }());
            Tools.MyTween = MyTween;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=MyTween.js.map