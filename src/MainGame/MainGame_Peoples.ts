/**
* 人口控制，人口分类（劳力、技术、战斗），每个人的工作地址、身体情况、居住地址、信仰值、希望值
* 人员加入，死亡，离开
* TODO 结婚生子
*/
module MainGame{
export class MainGame_Peoples{
	constructor(){

	}
}
/**
 * 单个角色
 */
export class MainGame_PeopleOne{
	public ID:number;
	public Name:string;
	public RaceType:string;
	public JobType:string;
	//社会关系
	public LikePeoples:Array<number>;
	public HatePeoples:Array<number>;
	public Childs:Array<number>;
	public Parents:Array<number>;
	public LovePeoples:Array<number>;
	//状态
	public isDead:boolean=false;
	public nowWorkerPlace:number;
	public nowHouse:number;
	public Hp:number;//生命值，健康状态
	public Hope:number;//希望值
	public Anger:number;//愤怒值
	constructor(){
	}
}
}