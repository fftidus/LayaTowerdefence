module com.MyClass{
export class MyTweenerManager{
	private MM:MainManager	= MainManager.getInstence();
	private DIC_Tween:Dictionary = new Dictionary();
	public Pause:boolean=false;
	private countNum:number=0;
	public constructor() {
	}

	private actionF():void
	{
		if(this.Pause)return;
		for (let i=0;i<this.DIC_Tween.keys.length;i++)
		{
			let id =this.DIC_Tween.keys[i];
			if(this.DIC_Tween.get(id)==null){
				this.DIC_Tween.remove(id);
				i--;
			}else
				(this.DIC_Tween.get(id) as com.MyClass.Tools.MyTween).moveF();
		}
		if(this.DIC_Tween.keys.length==0){
			this.MM.removeEnterFrameFun(this.actionF);
		}
	}
	
	public newTween(mc:any,t:com.MyClass.Tools.MyTween):void
	{
		if(this.DIC_Tween.keys.indexOf(mc) == -1)
		{
			if(t==null)	return;
		}
		if(t == null){
			if(this.DIC_Tween.keys.indexOf(mc) != -1) {
				this.countNum--;
				this.DIC_Tween.remove(mc);
			}
		}else{
			this.DIC_Tween.set(mc,t);
			this.countNum++;
			if(this.countNum==1){
				this.MM.addEnterFrameFun(laya.utils.Handler.create(this,this.actionF,null,false));
			}
		}
	}
	
	public stopAll():void
	{
		this.DIC_Tween.clear();
		this.countNum=0;
		this.MM.removeEnterFrameFun(this.actionF);
	}
}
}