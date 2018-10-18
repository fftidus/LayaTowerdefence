module com.MyClass.MyView{
import Handler=laya.utils.Handler;
import SwfMovieClip=com.MyClass.MySwf.SwfMovieClip;
import SwfSprite =com.MyClass.MySwf.SwfSprite;
export class TmpMovieClip extends starling.Sprite{
	private Arr:Array<any>	= [];
	private Fun:Handler;
	private Type:string;
	public	End:boolean	= false;
	constructor(mc:any,	f:Handler = null,	type:string	= "nor"){
		super();
		this.Type	= type;
		if(this.Type == "循环点击")
		{
			if(mc instanceof SwfMovieClip)
			{
				(mc as SwfMovieClip).loop	= true;
				(mc as SwfMovieClip).play();
			}
		}
		else if(mc instanceof SwfMovieClip)
		{
			(mc as SwfMovieClip).completeFunction	= Handler.create(this,this.overF);
			(mc as SwfMovieClip).play();
		}
		else if(mc instanceof SwfSprite)
		{
		}
		else if(mc instanceof MyZMovieClip){
			(mc as MyZMovieClip).completeFunction	= Handler.create(this,this.overF);
			(mc as MyZMovieClip).play();
		}
		this.Fun	= f;
		if(mc==null){
			this.overF();
		}else{
			this.addMC(mc);
		}
	}

	public addMC(mc:any):void
	{
		if(mc==null)return;
		this.addChild(mc);
		this.Arr.push(mc);
	}
	
	private overF(val:any = null):void
	{
		this.stopF();
		if(this.Type == "nor")
		{
			this.onRunFunction();
			this.destroyF();
		}
		else if(this.Type == "点击")
		{
			this.addClickF();
		}
		else if(this.Type == "屏幕点击")
		{
			this.addScreenClickF();
		}
		else if(this.Type == "手动")
		{
			this.onRunFunction();
		}
	}
	
	private stageF(e:any):void
	{
		this.addClickF();
	}
	
	private addClickF():void
	{
//			this.addEventListener(TouchEvent.TOUCH,clickF);
//			this.once(MOUSE_EVENTS,this,clickF);
		function clickF(e:any):void
		{
			this.onRunFunction();
			this.destroyF();
		}
	}
	
	private addScreenClickF():void
	{
//			LayerStarlingManager.instance.stage.addEventListener(TouchEvent.TOUCH,clickF);
		function clickF(e:any):void
		{
			this.onRunFunction();
			this.destroyF();
		}
	}
	
	public stopF():void
	{
		for(var i:number=0; i<this.Arr.length; i++)
		{
			var mc:any	= this.Arr[i];
			if(mc)mc.stop();
		}
	}
	public playF():void
	{
		for(var i:number=0; i<this.Arr.length; i++)
		{
			var mc:any	= this.Arr[i];
			if(mc)mc.play();
		}
	}
	public addStageRemoveListener():void
	{
//			this.addEventListener(Event.REMOVED_FROM_STAGE,onRemoveF);
	}
	public onRemoveF(e:any):void
	{
		this.destroyF();
	}
	private onRunFunction():void
	{
		if(this.Fun != null){
			var f:Handler=this.Fun;
			this.Fun=null;
			f.run();
		}
	}
	public destroyF():void
	{
		this.Fun=null;
		this.End	= true;
//			this.removeEventListener(Event.REMOVED_FROM_STAGE,onRemoveF);
//			this.removeEventListener(Event.ADDED_TO_STAGE,stageF);
		this.removeFromParent(true);
		this.Arr=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Arr);
	}
	
}
}