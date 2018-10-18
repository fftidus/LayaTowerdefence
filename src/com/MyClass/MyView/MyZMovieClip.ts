module com.MyClass.MyView{
import Handler=laya.utils.Handler;
import Templet=laya.ani.bone.Templet;
import Skeleton=laya.ani.bone.Skeleton;
import EventData=laya.ani.bone.EventData;
import Event=laya.events.Event;
import Tool_Function=com.MyClass.Tools.Tool_Function;
export class MyZMovieClip extends com.MyClass.MySwf.SwfSprite{
	private static dicTemplet:Object;
	
	public Name:string;
	public URL:string;
	private Fun:Handler;
	public zGameMc:Templet;
	private mArmature:Skeleton;
	private _loop:boolean;
	public nowLabel:string;
	private nowFrame:number;
	
	public completeFunction:Handler;
	public isComplete:boolean=false;
	constructor(url:string,f:Handler){
		super();
		MyMC.addF(this);
		this.URL=url;
		this.Fun=f;
		var index:number=this.URL.lastIndexOf("/");
		this.Name=this.URL.substr(index+1);
		if(MyZMovieClip.dicTemplet==null){MyZMovieClip.dicTemplet={};}
		if(MyZMovieClip.dicTemplet[this.URL]==null){
			this.zGameMc=new Templet();
			MyZMovieClip.dicTemplet[this.URL]={"模板":this.zGameMc,"num":1};
			this.zGameMc.on(Event.COMPLETE, this, this.parseComplete);
			this.zGameMc.on(Event.ERROR, this, this.onError);
			this.zGameMc.loadAni(url);
		}else{
			this.zGameMc=MyZMovieClip.dicTemplet[this.URL]["模板"];
			MyZMovieClip.dicTemplet[this.URL]["num"]++;
			Tool_Function.onRunFunction(this.Fun,this);
			this.Fun=null;
		}
	}

	private parseComplete(fac:Templet):void{
		this.zGameMc.offAll();
		if(fac==null){//error
			Tool_Function.onRunFunction(this.Fun,null);
		}else{
			Tool_Function.onRunFunction(this.Fun,this);
		}
		this.Fun=null;
	}
	private onError(e:Event):void{
		console.log("加载spine失败："+URL);
		this.parseComplete(null);
	}
	
	public initF():void{
		this.mArmature = this.zGameMc.buildArmature(0);//不支持换装
		this.addChild(this.mArmature);
		this.mArmature.playbackRate(30/Config.playSpeedTrue);
		this.mArmature.on(Event.STOPPED, this, this.completeHandler);
		this.mArmature.on(Event.LABEL, this, this.onEvent);
//			var allLabel:int=mArmature.getAnimNum();
//			for(var i:int=0;i<allLabel;i++){
//				trace("index="+i,mArmature.getAniNameByIndex(i));
//			}
	}
	private onEvent(e:any):void
	{
//			trace(mArmature.index,	mArmature.player.currentPlayTime);return;
		var tEventData:EventData = e as EventData;
		console.log("spine动画收到Label事件：",tEventData);
	}
	private completeHandler():void
	{
		console.log("completeHandler");
		this.isComplete=true;
		Tool_Function.onRunFunction(this.completeFunction);
	}
	public play(rePlayChildMovie:boolean = true):void
	{
		if(this.nowLabel==null){
			console.log(this.Name+"：spine：play失败，不应该没有label直接播放");
			return;
		}
		this.nowFrame=-1;
		this.mArmature.resume();
	}
	
	
	public gotoAndPlay(frame:any,rePlayChildMovie:boolean=false):void
	{
		if(typeof frame == "string"){
			this.gotoAndPlayLable(frame);
		}else{
			if(this.nowLabel==null){
				console.log(this.Name+"：spine：play失败，不应该没有label直接播放");
				return;
			}
			try{
				this.mArmature.index=frame;
			}catch(e){
				console.log(this.Name+"：spine：gotoAndPlay失败："+e.message);
				return;
			}
			this.play();
		}
	}
	public gotoAndPlayLable(label:any):void{
		if(typeof label == "number"){
			label =this.mArmature.getAniNameByIndex(label);
		}
		var allLabel:number=this.mArmature.getAnimNum();
		for(var i:number=0;i<allLabel;i++){
			if(label==this.mArmature.getAniNameByIndex(i)){
				this.nowLabel=label;
				this.nowFrame=-1;
				this.mArmature.play(label,this.loop,true);
				return;
			}
		}
		console.log("spine动画播放label："+label+"：失败");
	}
	
	private countMoreFrame:number=0;
	public gotoAndStop(frame:any,stopChild:boolean=false):void
	{
		if(this.zGameMc){
			this.countMoreFrame=0;
			this.mArmature.index=frame;
			this.nowFrame=frame;
			while(this.mArmature.index<frame){
				this.countMoreFrame++;
				if(frame+this.countMoreFrame<this.mArmature.total){
					this.mArmature.index=frame + this.countMoreFrame;
					if(this.mArmature.index>this.nowFrame){this.nowFrame=this.mArmature.index;}
				}else{
					break;
				}
			}
		}
	}
	public gotoAndStopLable(label:string):void{
		this.isComplete=false;
		this.nowLabel=label;
		var allLabel:number=this.mArmature.getAnimNum();
		for(var i:number=0;i<allLabel;i++){
			if(label==this.mArmature.getAniNameByIndex(i)){
				this.mArmature.play(i,this.loop);
				this.mArmature.index=0;
				this.nowFrame=-1;
				return;
			}
		}
		console.log("spine动画播放label："+label+"：失败");
	}
	
	public stop(stopChild:boolean=false):void
	{
		if(this.zGameMc){
			this.mArmature.stop();
		}
	}
	
	public pauseF():void{
		this.stop();
	}
	public resumeF():void{
		this.mArmature.resume();
	}

	public get totalFrames():number
	{
		if(this.zGameMc)	{
			return this.mArmature.total;
		}
		return 0;
	}
	public get currentFrame():number
	{
		if(this.zGameMc){
			if(this.mArmature.index<this.nowFrame && this.nowFrame>=0){
				return this.nowFrame;
			}
			return this.mArmature.index;
		}
		return 0;
	}
	public get loop():boolean
	{
		return this._loop;
	}
	public set loop(real:boolean)
	{
		this._loop=real;
	}
	
	public destroyF():void{
		MyMC.removeF(this);
		this.completeFunction=null;
		if(this.mArmature){
			this.mArmature.destroy();
			this.mArmature=null;
		}
		if(this.zGameMc){
			if(MyZMovieClip.dicTemplet[this.URL]){
				if(	--MyZMovieClip.dicTemplet[this.URL]["num"]<=0 ){
					this.zGameMc.destroy();
					MyZMovieClip.dicTemplet[this.URL]=null;
				}
			}
			this.zGameMc=null;
		}
		this.destroy();
	}
}
}