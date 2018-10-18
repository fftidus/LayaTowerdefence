module com.MyClass.MyView{
import SwfMovieClip=com.MyClass.MySwf.SwfMovieClip;
export class BTN_Starling extends starling.Sprite{
	public static Frame_Nor:number=0;
	public static Frame_Down:number=1;
	public static Frame_Selected:number=2;
	public static FramePause:number=3;
	public ID:any;
	public MC:starling.Sprite;
	private _pause:boolean;
	private isMc:boolean;
	private isDown:boolean=false;
	public FClick:laya.utils.Handler;
	public FDown:laya.utils.Handler;
	public FUp:laya.utils.Handler;
	public BtnVir:any;
	private nowFrame:number;
	public autoChangeFrame:boolean=true;
	
	private mme:MyMouseEventStarling;
	public constructor(tar:starling.Sprite) {
		super();
		var rec:laya.maths.Rectangle=com.MyClass.Tools.Tool_SpriteUtils.getBounds(tar,null);
		this.MC=tar;
		this.touchable=true;
		com.MyClass.Tools.Tool_SpriteUtils.onAddchild_ReplaceParent(this,this.MC);
		this.MC.touchable=true;
		this.isMc=this.MC instanceof SwfMovieClip;
		// this.initTouch(fd,fu,fClick);
		this.onChangeFrame(BTN_Starling.Frame_Nor);
		this.BtnVir={"startX":rec.x,"startY":rec.y,"endX":rec.right,"endY":rec.bottom};
		if(rec.width==0 || rec.height==0){//透明按钮
		}
	}

	public initTouch(fd:laya.utils.Handler,fu:laya.utils.Handler,	fc:laya.utils.Handler,val:any = null):void
	{
		this.FClick=fc;
		if(this.FClick)this.FClick.once=false;
		this.FDown=fd;
		if(this.FDown)this.FDown.once=false;
		this.FUp=fu;
		if(this.FUp)this.FUp.once=false;
		this.ID =val;
		
		if(this.mme==null){
			this.mme=new MyMouseEventStarling(this.MC);
			this.mme.setValue("down事件",laya.utils.Handler.create(this,this.onDownF));
			this.mme.setValue("up事件",laya.utils.Handler.create(this,this.onUpF));
			this.mme.setValue("点击",laya.utils.Handler.create(this,this.onClickF));
		}
	}
	public setEventStop():void{
		if(this.mme){
			this.mme.setValue("停止冒泡",true);
		}
	}

	private onDownF(p:any):void
	{
		if(this.pause)return;
		if(this.FDown)
		{
			com.MyClass.Tools.Tool_Function.onRunFunction(this.FDown,this.ID);
		}
		if(this.autoChangeFrame==true)this.onChangeFrame(BTN_Starling.Frame_Down);
	}
	private onUpF(p:any):void
	{
		if(this.autoChangeFrame==true)this.onChangeFrame(BTN_Starling.Frame_Nor);
		if(this.pause)return;
		if(this.FUp){
			if(this.ID==null)	this.FUp.run();
			else				this.FUp.runWith(this.ID);
		}
	}
	private onClickF(p:any):void{
		if(this.FClick){
			if(this.ID==null)	this.FClick.run();
			else				this.FClick.runWith(this.ID);
		}
	}
	
	public onChangeFrame(f:number):void
	{
		if(this.isMc==false || this.MC==null)return;
		if((this.MC as SwfMovieClip).totalFrames <= f)	return;
		(this.MC as SwfMovieClip).gotoAndStop(f,false);
	}
	
	public checkIn(mx:number,my:number):Boolean
	{
		if(this._pause || this.visible==false)	return false;
		if(this.BtnVir==null)return false;
		var lx:number	= mx;
		var ly:number	= my;
		if(lx>=this.BtnVir.startX && lx<=this.BtnVir.endX && ly>=this.BtnVir.startY && ly<=this.BtnVir.endY)return true;
		return false;
	}
	public get pause():boolean
	{
		return this._pause;
	}
	public set pause(value:boolean)
	{
		if(this.pause==true)	this.setFrame(BTN_Starling.FramePause);
		else this.setFrame(BTN_Starling.Frame_Nor);
		this._pause = value;
	}
	public setFrame(n:number):void
	{
		if(this.pause==true)return;
		if(this.isMc==false)return;
		if(n == this.nowFrame)	return;
		this.nowFrame	= n;
		if(this.MC != null)
		{
			if((this.MC as SwfMovieClip).totalFrames > n-1)(this.MC as SwfMovieClip).gotoAndStop(n-1,false);
		}
	}
	public destroyF():void
	{
		this.removeFromParent();
		this.mme=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mme);
		this.MC=null;
		if(this.FClick){
			this.FClick.clear();
			this.FClick=null;
		}
		if(this.FDown){
			this.FDown.clear();
			this.FDown=null;
		}
		if(this.FUp){
			this.FUp.clear();
			this.FUp=null;
		}
	}
}
}