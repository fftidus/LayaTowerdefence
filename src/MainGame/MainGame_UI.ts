module MainGame{
export class MainGame_UI extends starling.Sprite{
	private sprBack:starling.Sprite;
	private ac:com.MyClass.MyView.MyViewAllCompsController;
	private sourceInfo:UI_sourceInfo;
	constructor(){
		super();
		this.sprBack=com.MyClass.MySourceManager.getInstance().getSprFromSwf(Strings.SWF_Fight,"spr_View");
		this.addChild(this.sprBack);
		this.ac=new com.MyClass.MyView.MyViewAllCompsController(this.sprBack);
		this.sourceInfo=new UI_sourceInfo(this.sprBack.getChildByName("_资源")as starling.Sprite);
	}
	/**
	 * 显示资源拥有量
	 * @param type 资源名 
	 * @param num 数量
	 */
	public onShowSource(type:string,num:number):void{
		this.sourceInfo.onShowSource(type,num);
	}

	public destroyF():void{
		com.MyClass.Tools.Tool_ObjUtils.destroyDisplayObj(this);
		com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.ac);
		if(this.sourceInfo){
			this.sourceInfo.destroyF();
		}
	}
}
class UI_sourceInfo{
	private ac:com.MyClass.MyView.MyViewAllCompsController;
	constructor(spr:starling.Sprite){
		this.ac=new com.MyClass.MyView.MyViewAllCompsController(spr);
		this.onShowSource("能源",0);
		this.onShowSource("木材",0);
		this.onShowSource("矿石",0);
	}
	public onShowSource(type:string,num:number):void{
		this.ac.MNum.onShowF("num_"+type,num);
	}
	public destroyF():void{
		this.ac.destroyF();
	}
}
}