/**
* 人口控制，人口分类（劳力、技术、战斗），每个人的工作地址、身体情况、居住地址、信仰值、希望值
* 人员加入，死亡，离开
* TODO 结婚生子
* 需要API：查询【总人口，所有有房子的人口，所有有工作的人口】。寻找【某人所在住所、工作地、当前地】。
* 生成【】。死亡【】。
*/
var MainGame;
(function (MainGame) {
    var MainGame_Peoples = /** @class */ (function () {
        function MainGame_Peoples() {
            this.countID = 1;
            this.dicPeoples = {};
        }
        /**
         * 创建
         * @param info 初始参数【Name,RaceType,JobType,Age,Sex,父母，孩子，Hope,Anger】没有的参数部分随机，部分为空
         */
        MainGame_Peoples.prototype.creatOnePeople = function (info) {
            var one = new MainGame_PeopleOne();
            one.ID = this.countID++;
            one.initFromInfo(info);
            this.dicPeoples[one.ID] = one;
            return one;
        };
        return MainGame_Peoples;
    }());
    MainGame.MainGame_Peoples = MainGame_Peoples;
    /**
     * 单个角色
     */
    var MainGame_PeopleOne = /** @class */ (function () {
        function MainGame_PeopleOne() {
            //状态
            this.isDead = false;
        }
        MainGame_PeopleOne.prototype.initFromInfo = function (info) {
            for (var key in info) {
                if (key == "父母") {
                    this.Parents = info[key];
                }
                else if (key == "孩子") {
                    this.Childs = info[key];
                }
                else {
                    this[key] = info[key];
                }
            }
            if (this.JobType == null)
                this.JobType = com.MyClass.Tools.Tool_ArrayUtils.getRadomOneFromArray([Strings.PeopleJob_worker, Strings.PeopleJob_engineer]);
            if (this.Age == NaN)
                this.Age = 18;
            if (this.Sex == NaN)
                this.Sex = com.MyClass.Tools.Tool_ArrayUtils.getRadomOneFromArray([0, 1]);
        };
        return MainGame_PeopleOne;
    }());
    MainGame.MainGame_PeopleOne = MainGame_PeopleOne;
})(MainGame || (MainGame = {}));
//# sourceMappingURL=MainGame_Peoples.js.map