module com.MyClass.MyView{
import Handler=laya.utils.Handler;
import Sprite =starling.Sprite;
import Tool_Function =com.MyClass.Tools.Tool_Function;
export class MyViewBtnController{
	public static Dic_BtnSound:Object;
	
	private	FunClick:Handler;
	private	FunDown:Handler;
	private	FunUp:Handler;
	public Dic_Btn:Object={};
	public Busy:boolean=false;
	public Value:any;
	public Dic_Sound:Object;
	
	public constructor(spr:Sprite,	fClick:Handler,		fDown:Handler=null,	fUp:Handler=null) {
		this.FunClick	=fClick;
		this.FunDown	=fDown;
		this.FunUp		=fUp;
		Tool_Function.onTouchable(spr);
		for(var i:number=0;i<spr.numChildren;i++)
		{
			var obj:any	= spr.getChildAt(i);
			var strName:string	=obj.name;
			if(strName && strName.indexOf("btn_")==0)
			{
				this.addOneBtn(spr,strName);
			}
		}
	}
	public addOneBtn(spr:Sprite,strName:string):void{
		this.Dic_Btn[strName]	= com.MyClass.Tools.Tool_SpriteUtils.getBtn(spr,strName);
		(this.Dic_Btn[strName]as BTN_Starling).initTouch(Handler.create(this,this.onDownF),this.FunUp?Handler.create(this,this.onUpF):null
		,Handler.create(this,this.clickF),strName);
	}
	
	private onDownF(from:string):void
	{
		if(this.Busy)return;
		if(this.Dic_Sound && this.Dic_Sound[from]){
			SoundManagerMy.getInstance().playSound(this.Dic_Sound[from]);
		}else if(MyViewBtnController.Dic_BtnSound  && MyViewBtnController.Dic_BtnSound[from]){
			SoundManagerMy.getInstance().playSound(MyViewBtnController.Dic_BtnSound[from]);
		}else if(MyViewBtnController.Dic_BtnSound  && MyViewBtnController.Dic_BtnSound["默认"]){
			SoundManagerMy.getInstance().playSound(MyViewBtnController.Dic_BtnSound["默认"]);
		}
		if(this.FunDown==null)	return;
		if(this.Value==null)	this.FunDown.runWith(from);
		else					this.FunDown.runWith([this.Value,from]);
	}
	private onUpF(from:string):void
	{
		if(this.Busy)return;
		if(this.FunUp==null)	return;
		if(this.Value==null)	this.FunUp.runWith(from);
		else					this.FunUp.runWith([this.Value,from]);
	}
	private clickF(from:string):void
	{
		if(this.Busy)return;
		if(this.FunClick==null)	return;
		if(this.Value==null)	this.FunClick.runWith(from);
		else					this.FunClick.runWith([this.Value,from]);
	}
	/** 添加按钮特殊音效 */
	public addBtnSound(btn:string,soundName:string):void{
		if(this.Dic_Sound==null)this.Dic_Sound=com.MyClass.Tools.Tool_ObjUtils.getNewObjectFromPool();
		this.Dic_Sound[btn]=soundName;
	}
	/** 隐藏按钮 */
	public onVisible(tar:string, vib:boolean):void
	{
		if(tar==null)
		{
			//全部
			for(let n in this.Dic_Btn)
			{
				(this.Dic_Btn[n]as BTN_Starling).visible=vib;
			}
		}
		else
		{
			if(this.Dic_Btn[tar]){
				(this.Dic_Btn[tar]as BTN_Starling).visible=vib;
			}else{
				console.log("MBC中对不存在的按钮进行visible操作！name="+tar);
			}
		}
	}
	/** 停止按钮 */
	public onPause(tar:string,pause:boolean):void{
		if(tar==null)
		{
			//全部
			for(let n in this.Dic_Btn)
			{
				(this.Dic_Btn[n]as BTN_Starling).pause=pause;
			}
		}
		else
		{
			if(this.Dic_Btn[tar]){
				(this.Dic_Btn[tar]as BTN_Starling).pause=pause;
			}
		}
	}
	
	public onEventStop():void
	{
		for(let n in this.Dic_Btn)
		{
			(this.Dic_Btn[n]as BTN_Starling).setEventStop();
		}
	}
	
	public changeFrame(tar:string,f:number):void
	{
		if(this.Dic_Btn[tar])(this.Dic_Btn[tar]as BTN_Starling).setFrame(f);
	}
	
	public onChangeValues(Name:string,		vName:string,	value:any):void
	{
		for(var n in this.Dic_Btn)
		{
			if(n==Name || Name==null)		this.Dic_Btn[n][vName]=value;
		}
	}
	
	public getBtnByName(_name:string):BTN_Starling{
		return this.Dic_Btn[_name];
	}
	
	public checkInBtn(lx:number,ly:number):string{
		for(var _name in this.Dic_Btn){
			var btn:BTN_Starling = this.Dic_Btn[_name];
			if(btn && btn.checkIn(lx,ly)==true){
				return _name;
			}
		}
		return null;
	}
	
	public destroyF():void
	{
		this.FunDown=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FunDown);
		this.FunUp=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FunUp);
		this.FunClick=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FunClick);
		for(var n in this.Dic_Btn)
		{
			(this.Dic_Btn[n]as BTN_Starling).destroyF();
			delete this.Dic_Btn[n];
		}
		this.Dic_Btn=null;
		this.Dic_Sound=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Dic_Sound);
	}
}
}