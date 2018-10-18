var com;
(function (com) {
    var MyClass;
    (function (MyClass) {
        var Tools;
        (function (Tools) {
            var Tool_Textfield = /** @class */ (function () {
                function Tool_Textfield() {
                }
                Tool_Textfield.newTextfield = function (w, h, text, font, size, col, vUD, hLR, italic, bold) {
                    if (vUD === void 0) { vUD = "中"; }
                    if (hLR === void 0) { hLR = "中"; }
                    if (italic === void 0) { italic = false; }
                    if (bold === void 0) { bold = false; }
                    var t = new starling.TextField(w, h, text);
                    t.font = font;
                    t.fontSize = size;
                    t.color = "#" + col.toString(16);
                    if (vUD == "上" || vUD == "up")
                        t.valign = "top";
                    else if (vUD == "下" || vUD == "down")
                        t.valign = "bottom";
                    else
                        t.valign = "middle";
                    if (hLR == "左" || hLR == "left")
                        t.align = "left";
                    else if (hLR == "右" || hLR == "right")
                        t.align = "right";
                    else
                        t.align = "center";
                    t.width = w;
                    t.height = h;
                    t.italic = italic;
                    t.bold = bold;
                    t.text = text;
                    t.autoScale = true;
                    return t;
                };
                return Tool_Textfield;
            }());
            Tools.Tool_Textfield = Tool_Textfield;
        })(Tools = MyClass.Tools || (MyClass.Tools = {}));
    })(MyClass = com.MyClass || (com.MyClass = {}));
})(com || (com = {}));
//# sourceMappingURL=Tool_Textfield.js.map