var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var MyView;
        (function (MyView) {
            var BTN_Virtual = /** @class */ (function () {
                function BTN_Virtual(type, arr) {
                    this.lookLike = type;
                    var tmpX = 0;
                    var tmpY = 0;
                    if (arr.length == 1 && arr[0] instanceof com.MyClass.MySwf.SwfSprite && arr[0].metaData) {
                        var metaData = arr[0].metaData;
                        if (metaData["鼠标区域"]) {
                            if (metaData["鼠标区域"]["形状"] == "圆") {
                                this.lookLike = 3;
                                this._circleMidR = metaData["鼠标区域"]["半径"];
                                this._circleMidX = this._circleMidR / 2 + arr[0].x;
                                this._circleMidY = this._circleMidR / 2 + arr[0].y;
                            }
                            else {
                                this.startX = metaData["鼠标区域"]["x0"] + arr[0].x;
                                this.endX = metaData["鼠标区域"]["x1"] + arr[0].x;
                                this.startY = metaData["鼠标区域"]["y0"] + arr[0].y;
                                this.endY = metaData["鼠标区域"]["y1"] + arr[0].y;
                            }
                            arr[0].metaData = null;
                            this.tar = arr[0];
                            return;
                        }
                    }
                    if (this.lookLike == 0) {
                        if (arr.length == 1) {
                            var tmpMC = arr[0];
                            this.tar = arr[0];
                            var rec;
                            try {
                                rec = tmpMC.getBounds();
                                this.startX = rec.x;
                                this.endX = rec.x + rec.width;
                                this.startY = rec.y;
                                this.endY = rec.y + rec.height;
                            }
                            catch (e) {
                                this.startX = this.tar.x;
                                this.endX = this.tar.x + 1;
                                this.startY = this.tar.y;
                                this.endY = this.tar.y + 1;
                            }
                        }
                        else {
                            this.startX = arr[0];
                            this.endX = arr[1];
                            this.startY = arr[2];
                            this.endY = arr[3];
                        }
                        if (this.startX > this.endX || this.startY > this.endY)
                            console.log("正方形出错！");
                    }
                    else if (this.lookLike == 1) {
                        this.pointArr1 = [];
                        this.pointArr1[0] = arr[0];
                        this.pointArr1[1] = arr[1];
                        this.pointArr2 = [];
                        this.pointArr2[0] = arr[2];
                        this.pointArr2[1] = arr[3];
                        this.pointArr3 = [];
                        this.pointArr3[0] = arr[4];
                        this.pointArr3[1] = arr[5];
                        this.oriArea = this.getTriArea(this.pointArr1, this.pointArr2, this.pointArr3);
                    }
                    else if (this.lookLike == 2) {
                        var i;
                        this.NUM_square = arr[0];
                        this.Arr_square = [];
                        for (i = 0; i < this.NUM_square; i++) {
                            var tmpSquare = new BTN_Virtual(0, arr[1 + i]);
                            this.Arr_square[i] = tmpSquare;
                        }
                        this.NUM_triangle = arr[1 + this.NUM_square];
                        this.Arr_triangle = [];
                        for (i = 0; i < this.NUM_triangle; i++) {
                            var tmpTriangle = new BTN_Virtual(1, arr[2 + this.NUM_square + i]);
                            this.Arr_triangle[i] = tmpTriangle;
                        }
                    }
                    else if (this.lookLike == 3) {
                        this._circleMidX = arr[0];
                        this._circleMidY = arr[1];
                        this._circleMidR = arr[2];
                    }
                }
                BTN_Virtual.prototype.getTriArea = function (t0, t1, t2) {
                    var area = (t0[0] * t1[1] + t1[0] * t2[1] + t2[0] * t0[1] - t1[0] * t0[1] - t2[0] * t1[1] - t0[0] * t2[1]) / 2;
                    area = area > 0 ? area : -area;
                    return area;
                };
                BTN_Virtual.prototype.checkIn = function (mX, mY) {
                    var ok = false;
                    if (this.lookLike == 0) {
                        if (mX >= this.startX && mX <= this.endX && mY >= this.startY && mY <= this.endY)
                            ok = true;
                    }
                    else if (this.lookLike == 1) {
                        var tmpArea1 = this.getTriArea(this.pointArr1, this.pointArr2, [mX, mY]);
                        var tmpArea2 = this.getTriArea(this.pointArr1, this.pointArr3, [mX, mY]);
                        var tmpArea3 = this.getTriArea(this.pointArr2, this.pointArr3, [mX, mY]);
                        var getArea = tmpArea1 + tmpArea2 + tmpArea3;
                        if (getArea == this.oriArea)
                            ok = true;
                    }
                    else if (this.lookLike == 2) {
                        var i;
                        for (i = 0; i < this.NUM_square; i++) {
                            ok = this.Arr_square[i].checkIn(mX, mY);
                            if (ok == true)
                                break;
                        }
                        if (ok == false) {
                            for (i = 0; i < this.NUM_triangle; i++) {
                                ok = this.Arr_triangle[i].checkIn(mX, mY);
                                if (ok == true)
                                    break;
                            }
                        }
                    }
                    else if (this.lookLike == 3) {
                        i = (mX - this._circleMidX) * (mX - this._circleMidX) + (mY - this._circleMidY) * (mY - this._circleMidY);
                        i = Math.sqrt(i);
                        if (i <= this._circleMidR)
                            ok = true;
                    }
                    return ok;
                };
                BTN_Virtual.prototype.hitTest = function (b2, _x, _y) {
                    if (this.lookLike == 0)
                        return this.Hit_矩形(b2, _x, _y);
                    if (this.lookLike == 1)
                        return this.Hit_圆(b2, _x, _y);
                    return false;
                };
                BTN_Virtual.prototype.Hit_矩形 = function (b2, _x, _y) {
                    if (b2.lookLike == 0) {
                        if (b2.startX + _x <= this.endX && b2.endY + _y >= this.startY &&
                            b2.endX + _x >= this.startX && b2.startY + _y <= this.endY)
                            return true;
                    }
                    else if (b2.lookLike == 1) {
                        if (this.checkIn(b2.pointArr1[0] + _x, b2.pointArr1[1] + _y) == true)
                            return true;
                        if (this.checkIn(b2.pointArr2[0] + _x, b2.pointArr2[1] + _y) == true)
                            return true;
                        if (this.checkIn(b2.pointArr3[0] + _x, b2.pointArr3[1] + _y) == true)
                            return true;
                    }
                    else if (b2.lookLike == 2) {
                        for (var i = 0; i < b2.Arr_square.length; i++) {
                            var b3 = b2.Arr_square[i];
                            if (b3 == null)
                                continue;
                            if (this.hitTest(b3, _x, _y) == true)
                                return true;
                        }
                    }
                    else if (b2.lookLike == 3) {
                        var mX = _x + b2._circleMidX;
                        var mY = _y + b2._circleMidY;
                        var newSX = this.startX - b2._circleMidR;
                        var newSY = this.startY - b2._circleMidR;
                        var newEX = this.endX + b2._circleMidR;
                        var newEY = this.endY + b2._circleMidR;
                        if (mX >= newSX && mX <= newEX && mY >= newSY && mY <= newEY)
                            return true;
                    }
                    return false;
                };
                BTN_Virtual.prototype.Hit_圆 = function (b2, _x, _y) {
                    if (b2.lookLike == 0) {
                        if (b2.hitTest(this, -_x, -_y) == true)
                            return true;
                    }
                    else if (b2.lookLike == 1) {
                    }
                    return false;
                };
                BTN_Virtual.prototype.destroyF = function () {
                    this.tar = null;
                };
                return BTN_Virtual;
            }());
            MyView.BTN_Virtual = BTN_Virtual;
        })(MyView = MyClass.MyView || (MyClass.MyView = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=BTN_Virtual.js.map