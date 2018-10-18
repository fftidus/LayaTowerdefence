module com.MyClass{
import Stage=laya.display.Stage;

export class MainManager{
	public static _instence:MainManager;
	public static getInstence():MainManager
	{
		if(MainManager._instence == null)	MainManager._instence	= new MainManager();
		return MainManager._instence;
	}

	constructor(){
	}
	public MEM:MyEventManager;
	public MTM:MyTweenerManager;
	public Time:number	= 0;
	public pause:boolean=false;
	private mstage:Stage;
	private inEnter:boolean=false;
	private Dic_enterFun:Dictionary=new Dictionary();
	private Dic_delayFun:Dictionary=new Dictionary();
	private Arr_waiteRemove:Array<any>;
	
	public init(stage:Stage):void
	{
		this.MEM	= new MyEventManager();
		this.MTM	= new MyTweenerManager();
		if(this.mstage==null)
		{
			this.mstage =stage;
			com.MyClass.Config.mStage =stage;
			com.MyClass.Config.initF();
			com.MyClass.MyView.LayerStarlingManager.getInstence().init(stage);
			Laya.timer.frameLoop(1, this, this.enterF,null,false);
		}
	}
	private enterF(e:any):void{
		if(this.pause==true){return;}
		this.Time++;
		this.inEnter=true;
		for(var i:number=0;i<this.Dic_enterFun.keys.length;i++)
		{
			var f:any =this.Dic_enterFun.get(this.Dic_enterFun.keys[i]);
			if(f!=null){
				com.MyClass.Tools.Tool_Function.onRunFunction(f);
			}
		}
		for(i=0;i<this.Dic_delayFun.keys.length;i++)
		{
			var arr:any =this.Dic_delayFun.get(this.Dic_delayFun.keys[i]);
			if(arr[1] <= 0)
			{
				var fun:any	= arr[0];
				var val:any	= arr[2];
				com.MyClass.Tools.Tool_Function.onRunFunction(fun,val);
				this.remove_delayFunction(fun);
				i--;
			}
			else{
				arr[1]	-= 1;
			}
		}
		this.inEnter=false;
		if(this.Arr_waiteRemove != null){
			for(i=0;i<this.Arr_waiteRemove.length;i++){
				this.removeEnterFrameFun(this.Arr_waiteRemove[i]);
			}
			this.Arr_waiteRemove=null;
		}
	}

	public addEnterFrameFun(fun:any):void
	{
		if(fun == null)	return;
		if(fun instanceof laya.utils.Handler && fun.once==true){
			fun.once=false;
		}
		this.Dic_enterFun.set(fun,fun);
	}
	
	public removeEnterFrameFun(fun:any):void
	{
		if(fun==null)return;
		if(this.inEnter==true){
			if(this.Arr_waiteRemove==null)this.Arr_waiteRemove=[];
			this.Arr_waiteRemove.push(fun);
		}else{
			for(var i:number=0;i<this.Dic_enterFun.keys.length;i++){
				var f:any =this.Dic_enterFun.keys[i];
				if(com.MyClass.Tools.Tool_Function.compareHandlers(fun,f)==true){
					this.Dic_enterFun.remove(f);
					i--;
					if(f instanceof laya.utils.Handler)(f as laya.utils.Handler).clear();
				}
			}
		}
		if(fun instanceof laya.utils.Handler){
			(fun as laya.utils.Handler).clear();
		}
	}
	
	public add_delayFunction(fun:laya.utils.Handler,	delay:number,	val:any = null):void
	{
		fun.once=true;
		if(fun.method == null){
			return;
		}
		if(delay == 0)
		{
			if(val==null)	fun.run();
			else			fun.runWith(val);
			return;
		}
		this.Dic_delayFun.set(fun,[fun,delay,val]);
	}
	
	public remove_delayFunction(fun:any):void
	{
		for(var i:number=0;i<this.Dic_delayFun.keys.length;i++){
			var f:any =this.Dic_delayFun.keys[i];
			if(com.MyClass.Tools.Tool_Function.compareHandlers(fun,f)==true){
				this.Dic_delayFun.remove(fun);
				i--;
				if(f instanceof laya.utils.Handler)(f as laya.utils.Handler).clear();
			}
		}
		if(fun instanceof laya.utils.Handler){
			(fun as laya.utils.Handler).clear();
		}
	}

	public destroyF():void
	{
		this.remove_delayFunction(null);
		this.removeEnterFrameFun(null);
		if(this.MTM)
		{
			this.MTM.stopAll();
			this.MTM=null;
		}
		if(this.MEM){
			this.MEM.destroyF();this.MEM=null;
		}
		Laya.timer.clear(this,this.enterF);
		com.MyClass.MyView.LayerStarlingManager.getInstence().destroyF();
		MainManager._instence	= null;
	}
	
	public clearF():void
	{
		this.remove_delayFunction(null);
		this.removeEnterFrameFun(null);
		if(this.MTM)
		{
			this.MTM.stopAll();
			this.MTM=null;
		}
		this.MTM=new MyTweenerManager();
		if(this.MEM){
			this.MEM.destroyF();this.MEM=null;
		}
		this.MEM=new MyEventManager();
	}


}
}