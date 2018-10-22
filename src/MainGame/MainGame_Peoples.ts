/**
* 人口控制，人口分类（劳力、技术、战斗），每个人的工作地址、身体情况、居住地址、信仰值、希望值
* 人员加入，死亡，离开
* TODO 结婚生子
* 需要API：查询【总人口，所有有房子的人口，所有有工作的人口】。寻找【某人所在住所、工作地、当前地】。
* 生成【】。死亡【】。
*/
module MainGame{
export class MainGame_Peoples{
	public static ChildAge:number=18;//成年
	public static OldAge:number=60;//退休
	private countID:number=1;
	private dicPeoples:Object={};

	constructor(){
	}
	/**
	 * 创建一个角色的公用API
	 * @param info 初始参数【Name,RaceType,JobType,Age,Sex,父母，孩子,婚姻，Hope,Anger】没有的参数部分随机，部分为空
	 */
	public creatOnePeople(info:Object):MainGame_PeopleOne{
		var one:MainGame_PeopleOne=new MainGame_PeopleOne();
		one.ID=this.countID++;
		one.initFromInfo(info);
		this.dicPeoples[one.ID]=one;
		return one;
	}
	/**
	 * 根据传入的人口来创建随机的人，随机生成家庭，小孩，老人
	 * @param num 人口总数
	 * @param isAverage 平均分配每种人的数量
	 * @param needChild 创建儿童
	 * @param needOld 创建老人
	 * @param needFamily 需要创建的完整家庭的最大数量，适龄男女自动配对，儿童老人随机加入
	 */
	public creatRandomPeoples(num:number,	isAverage:boolean,	needChild:boolean=false,needOld:boolean=false,needFamily:number=999):void{
		if(num<=0 || num ==NaN)return;
		//TODO ...
	}
}
/**
 * 单个角色
 */
export class MainGame_PeopleOne{
	public ID:number;
	public Name:string;
	public RaceType:string;//种族
	public JobType:string;//职业
	public Age:number;
	public Sex:number;
	//社会关系
	public LikePeoples:Array<number>;
	public HatePeoples:Array<number>;
	public Childs:Array<number>;
	public Parents:Array<number>;
	public Marriage:number;
	//状态
	public isDead:boolean=false;
	public WorkePlace:number;
	public House:number;
	public Hp:number;//生命值，健康状态
	public Hope:number;//希望值
	public Anger:number;//愤怒值
	public nowPlace:string;//当前地点
	constructor(){
	}
	public initFromInfo(info:Object):void{
		for(let key in info){
			if(key=="父母"){
				this.Parents=info[key];
			}else if(key=="孩子"){
				this.Childs=info[key];
			}else if(key=="婚姻"){
				this.Marriage=info[key];
			}
			else{
				this[key]=info[key];
			}
		}
		if(this.JobType==null)this.JobType=com.MyClass.Tools.Tool_ArrayUtils.getRadomOneFromArray([Strings.PeopleJob_worker,Strings.PeopleJob_engineer]);
		if(this.Age == NaN)this.Age =18;
		if(this.Sex==NaN)this.Sex=com.MyClass.Tools.Tool_ArrayUtils.getRadomOneFromArray([0,1]);
	}
}
}