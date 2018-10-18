module com.MyClass.MyView{
import Sprite =starling.Sprite;
import Handler=laya.utils.Handler;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class MyMC extends Sprite{
	private static dicAll:Dictionary=new Dictionary();
	public static addF(mc:any):void{
		this.dicAll.set(mc,true);
	}
	public static removeF(mc:any):void{
		this.dicAll.remove(mc);
	}
	public static pauseF():void{
		for(var i:number=0;i<this.dicAll.keys.length;i++){
			var mc:any =this.dicAll.keys[i];
			if(mc){
				mc.pauseF();
			}
		}
	}
	public static resumeF():void{
		for(var i:number=0;i<this.dicAll.keys.length;i++){
			var mc:any =this.dicAll.keys[i];
			if(mc){
				mc.resumeF();
			}
		}
	}
	public static onNewByMc(mc:any):MyMC{
		if(mc==null)    return null;
		return new MyMC(mc);
	}

	private	mmo:MainManagerOne;
	public	MC:any;
	private	TimeFrame:number= parseInt(""+1000/Config.playSpeedTrue);
	private	NeedTime:number;
	private	pastTime:number=0;
	
	public	frameFunction:Handler;
	public	compFun:Handler;
	public	isPlay:boolean;
	
	private	_loop:boolean;
	private	_fps:number;
	private	_currentFrame:number;
	private	_totalFrames:number;
	private	_autoStopChild:boolean;
	
	private needLast:number=0;
	constructor(mc:any){
		super();
		this.MC=mc;
		this.fps=Config.playSpeedTrue;
		this.loop=false;
		this.autoStopChild=false;
		this.isPlay=false;
		MyMC.addF(this);
		if(this.MC!=null){
			this.addChild(this.MC);
			this.MC.stop(this.autoStopChild);
		}
	}

	public enterPlayF():void
	{
		this.pastTime	+=this.TimeFrame;
		var f2:number	= parseInt(""+this.pastTime/this.NeedTime);
		while(f2>0)
		{
			this.nextFrame();
			f2--;
			this.pastTime-=this.NeedTime;
		}
	}
	public enterPrePlayF():void
	{
		this.pastTime	+=this.TimeFrame;
		var f2:number	= parseInt(""+this.pastTime/this.NeedTime);
		while(f2>0)
		{
			this.preFrame();
			f2--;
			this.pastTime-=this.NeedTime;
		}
	}
	
	public gotoF(f:number):void
	{
		if(this.MC != null){
			if(f>=this.MC.totalFrames){
				if(this.MC.currentFrame>=this.MC.totalFrames-this.needLast)return;
				f=this.MC.totalFrames-this.needLast;
			}
			this.MC.gotoAndStop(f,this.autoStopChild);
			if(this.frameFunction)this.frameFunction.run();
			if(this.compFun)
			{
				if(this.MC.currentFrame==this.MC.totalFrames-this.needLast)this.compFun.run();
			}
		}
	}
	
	public nextFrame():void
	{
		if(this.MC != null){
			if(this.isComplete()==true)
			{
				if(this.loop==true)this.gotoF(0);
			}
			else
			{
				this.gotoF(this.MC.currentFrame+1);
			}
		}
	}
	public preFrame():void
	{
		if(this.MC != null){
			if(this.MC.currentFrame==0)
			{
				if(this.loop==true)this.gotoF(this.MC.totalFrames-this.needLast);
			}
			else
			{
				this.gotoF(this.MC.currentFrame-1);
			}
		}
	}
	
	public play():void{
		if(this.mmo){
			return;
		}
		this.mmo=new MainManagerOne();
		this.mmo.addEnterFrameFun(Handler.create(this,this.onEnterF,null,false));
	}
	private onEnterF():void{
		this.enterPlayF();
		if(this.MC==null){
			this.mmo=Tool_ObjUtils.destroyF_One(this.mmo);
			return;
		}
		if(this.loop==true)return;
		if(this.isComplete()==true){
			this.stop();
		}
	}
	public stop():void{
		this.pastTime=0;
		if(this.mmo){
			this.mmo=Tool_ObjUtils.destroyF_One(this.mmo);
		}
	}
	public gotoAndStop(f:number):void
	{
		this.gotoF(f);
		this.stop();
	}
	public gotoAndPlay(f:number):void
	{
		this.pastTime=0;
		this.gotoF(f);
		this.play();
	}
	public pauseF():void{
		this.stop();
	}
	public resumeF():void{
		this.play();
	}
	/****************************清理***********************************/
	public destroyF():void
	{
		MyMC.removeF(this);
		this.frameFunction=null;
		this.compFun=null;
		this.MC=Tool_ObjUtils.destroyF_One(this.MC);
		this.mmo=Tool_ObjUtils.destroyF_One(this.mmo);
		this.destroy();
	}
	/******************************FPS*********************************/
	public get loop():boolean
	{
		return this._loop;
	}
	public set loop(value:boolean)
	{
		this._loop = value;
	}
	
	public get fps():number
	{
		return this._fps;
	}
	public set fps(value:number)
	{
		this._fps = value;
		this.NeedTime=1000/this._fps;
	}
	
	public get currentFrame():number
	{
		return this.MC.currentFrame;
	}
	
	public get totalFrames():number
	{
		return this.MC.totalFrames;
	}
	public isComplete():Boolean{
		if(this.MC==null)return true;
		return this.MC.currentFrame >= this.MC.totalFrames-this.needLast;
	}
	
	public get autoStopChild():boolean
	{
		return this._autoStopChild;
	}
	
	public set autoStopChild(value:boolean)
	{
		this._autoStopChild = value;
	}
}
}