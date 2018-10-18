module com.MyClass.MyView{
import SwfMovieClip=com.MyClass.MySwf.SwfMovieClip;
export class BTNControllerStarling{
	private Layer:starling.Sprite;
	private mme:MyMouseEventStarling;
	public Arr_Btn:Array<any>		= [];
	public Arr_Mc:Array<any>		= [];
	public Arr_BtnXY:Array<any>	= [];
	public Arr_Fun:Array<any>		= [];
	public  now:number			= -1;
	private FunClick:laya.utils.Handler;
	private	FunUp:laya.utils.Handler;
	private FunDown:laya.utils.Handler;
	private FunClickNone:laya.utils.Handler;
	
	private down:number=0;
	private pause:boolean		= false;
	public	typeEventMop:string		= null;//null:普通冒泡，“禁止”：不冒泡，“触发禁止”：自身有事件就不冒泡
	public	MinSlideLength:number=2;
	public	canSlide:boolean	= true;
	public	canSlideAndSelect:boolean=true;
	public	autoClear:boolean	=false;
	public	canMouseSlide:boolean	=false;
	public	autoChangeFrame:boolean=true;
	
	private	startX:number;
	private	startY:number;
	public constructor(L:starling.Sprite,	arr:Array<any>,	Fclick:laya.utils.Handler,Fdown:laya.utils.Handler=null,Fup:laya.utils.Handler=null,fnone:laya.utils.Handler = null) {
		this.Layer		= L;
		Tools.Tool_Function.onTouchable(this.Layer);
		this.FunClick	= Fclick;
		this.FunDown= Fdown;
		this.FunUp=Fup;
		this.FunClickNone= fnone;
		if(this.FunClick)this.FunClick.once=false;
		if(this.FunDown)this.FunDown.once=false;
		if(this.FunUp)this.FunUp.once=false;
		if(this.FunClickNone)this.FunClickNone.once=false;
		for(var i:number=0; i<arr.length; i++)
		{
			if(arr[i] == null)	continue;
			this.Arr_BtnXY[i]= [0,0];
			var tmp:any	= arr[i].parent;
			while(L != tmp && tmp != null)
			{
				this.Arr_BtnXY[i][0]	+= tmp.x;
				this.Arr_BtnXY[i][1]	+= tmp.y;
				tmp	= tmp.parent;
			}
			if(arr[i] instanceof BTN_Starling)
			{
				this.Arr_Btn[i]	= arr[i];
			}
			else if(arr[i] instanceof SwfMovieClip)
			{
				if(this.Layer)
				{
					(arr[i]as SwfMovieClip).gotoAndStop(0);
				}
				var b:BTN_Virtual	= new BTN_Virtual(0,[arr[i]]);
				this.Arr_Btn[i]	= b;
				this.Arr_Mc[i]	= [arr[i],(arr[i]as SwfMovieClip).totalFrames];
			}
			else if(arr[i] instanceof BTN_Virtual)
			{
				b			= arr[i];
				this.Arr_Btn[i]	= b;
				this.Arr_Mc[i]	= [arr[i],(arr[i]as SwfMovieClip).totalFrames];
			}
			else
			{
				if(arr[i] instanceof Array)	b	= new BTN_Virtual(0,arr[i]);
				else				b	= new BTN_Virtual(0,[arr[i]]);
				this.Arr_Btn[i]	= b;
				if(Tools.Tool_ObjUtils.hasFunction(arr[i],"setFrame") == true)
					this.Arr_Fun[i]	= arr[i].setFrame;
			}
		}
		if(this.Layer){
			this.mme=new MyMouseEventStarling(this.Layer);
			this.mme.setValue("down事件",laya.utils.Handler.create(this,this.onDownF));
			this.mme.setValue("up事件",laya.utils.Handler.create(this,this.onUPF));
			this.mme.setValue("滑动",laya.utils.Handler.create(this,this.onSlideF));
		}
	}

	public setValue(str:String,	val:any):void
	{
		// this[str]=val;
	}
	public getValue(want:String):any
	{
		// return this[want];
	}
	
	private onSlideF(dic:any):void
	{
		if(this.pause == true)	return;
		if(this.down == 0)	return;
		var p:any =this.mme.nowLocalXY;
		var now2:number;
		if(this.canSlide==false)
		{
			var l:number=Math.sqrt(Math.pow(p.x-this.startX,2) + Math.pow(p.y -this.startY,2));
			if(l>this.MinSlideLength)
			{
				this.onUPF(null);
				return;
			}
		}
		now2	= this.checkIn(p.x,p.y);
		if(now2 >= 0 && now2 != this.now)
		{
			//滑动到别的按钮上
			if(this.canSlideAndSelect==false)
			{
				if(this.now!=-1)
				{
					if(this.FunUp!=null)Tools.Tool_Function.onRunFunction(this.FunUp,this.now);
					this.changeFrame(this.now,1);
				}
				this.now	= -1;
				this.down=0;
			}
			else
			{
				if(this.now!=-1)
				{
					if(this.FunUp!=null)Tools.Tool_Function.onRunFunction(this.FunUp,this.now);
					this.changeFrame(this.now,1);
				}
				this.down=1;
				this.changeFrame(now2,2);
				this.now	= now2;
				if(this.FunDown != null)
				{
					Tools.Tool_Function.onRunFunction(this.FunDown,this.now);
				}
			}
		}
		else if(now2 == -1 && this.now != -1)
		{
			//滑动到空白处
			if(this.FunUp!=null)Tools.Tool_Function.onRunFunction(this.FunUp,this.now);
			this.changeFrame(this.now,1);
			this.now		= -1;
			this.down++;
		}
	}
	
	private onDownF(p:any):void{
		if(this.down>0)	return;
		this.now		= this.checkIn(p.x,p.y);
		if(this.now >= 0)
		{
			this.down	= 1;
			this.changeFrame(this.now,2);
			if(this.FunDown != null)
			{
				Tools.Tool_Function.onRunFunction(this.FunDown,this.now);
			}
			this.startX=p.x;
			this.startY=p.y;
		}
	}
	private onUPF(p:any):void
	{
		if(this.down > 0)
		{
			if(this.now != -1)
			{
				this.changeFrame(this.now,1);
				if(p){
					if(this.FunUp!=null)Tools.Tool_Function.onRunFunction(this.FunUp,this.now);
					if(this.FunClick && this.down==1)Tools.Tool_Function.onRunFunction(this.FunClick,this.now);
				}
				this.now		= -1;
			}
			else if(this.FunClickNone != null && p)Tools.Tool_Function.onRunFunction(this.FunClickNone);
			this.down=0;
		}
		else if(this.FunClickNone != null && p)
		{
			Tools.Tool_Function.onRunFunction(this.FunClickNone);
		}
	}
	
	public checkIn(lx:number,ly:number):number
	{
		for(var i:number=0; i<this.Arr_Btn.length; i++)
		{
			if(this.Arr_Btn[i] == null)	continue;
			if(this.Arr_Mc[i] && this.Arr_Mc[i][0].visible==false)continue;
			if(this.Arr_Btn[i].checkIn(lx-this.Arr_BtnXY[i][0],ly-this.Arr_BtnXY[i][1]) == true)	return i;
		}
		return -1;
	}
	
	private changeFrame(num:number,	f:number):void
	{
		if(this.autoChangeFrame==false || this.Arr_Btn==null)return;
		if(num >= 0)
		{
			if(this.Arr_Btn[num] instanceof BTN_Starling)	(this.Arr_Btn[num] as BTN_Starling).onChangeFrame(f);
			else
			{
				if(this.Arr_Mc[num] != null)
				{
					f--;
					if(f >= this.Arr_Mc[num][1])	f	= 0;
					(this.Arr_Mc[num][0]as SwfMovieClip).gotoAndStop(f);
				}
				else if(this.Arr_Fun[num] != null){
					Tools.Tool_Function.onRunFunction(this.Arr_Fun[num],f);
				}
			}
		}
	}
	
	public pauseF(b:boolean):void
	{
		this.pause	= b;
		this.stopF();
	}
	
	public removeIndex(n:number):void
	{
		this.Arr_Btn.splice(n,1);
		this.Arr_Mc.splice(n,1);
	}
	
	private stopF():void
	{
		if(this.down >0)
		{
			this.down	= 0;
			this.changeFrame(this.now,1);
			this.now		= -1;
		}
	}
	
	public destroyF():void
	{
		this.mme=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mme);
		if(this.Layer)
		{
			if(this.autoClear)	this.Layer=Tools.Tool_ObjUtils.destroyF_One(this.Layer);
			else		this.Layer=null;
		}
		if(this.autoClear)	
		{
			this.Arr_Btn=Tools.Tool_ObjUtils.destroyF_One(this.Arr_Btn);
		}
		else	this.Arr_Btn	= null;
		if(this.FunClick){
			this.FunClick.clear();
			this.FunClick		= null;
		}
		if(this.FunDown){
			this.FunDown.clear();
			this.FunDown		= null;
		}
		if(this.FunUp){
			this.FunUp.clear();
			this.FunUp		= null;
		}
		if(this.FunClickNone){
			this.FunClickNone.clear();
			this.FunClickNone		= null;
		}
	}
}
}