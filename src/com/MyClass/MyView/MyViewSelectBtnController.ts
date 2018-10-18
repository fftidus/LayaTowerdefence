module com.MyClass.MyView{
import Handler=laya.utils.Handler;
import Sprite=starling.Sprite;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class MyViewSelectBtnController{
	public Fun:Handler;
	public DicMc:Dictionary=new Dictionary();
	constructor(view:Sprite,	f:Handler){
		this.Fun=f;
		if(this.Fun)this.Fun.once=false;
		var l:number=view.numChildren;
		for(var i:number=0;i<l;i++)
		{
			var obj:any	= view.getChildAt(i);
			if(obj instanceof com.MyClass.MySwf.SwfSprite && obj.name && obj.name.indexOf("SBtn_")==0 && obj.name.length>5)
			{
				var meta:Object =(obj as com.MyClass.MySwf.SwfSprite).metaData;
				var Name:string=(obj.name as string).substr(5);
				var strFront:string="btn_";
				if(meta && meta["前缀"])	strFront=meta["前缀"];
				var canMulti:boolean=false;
				if(meta && meta["多选"]!=null)	canMulti=meta["多选"];
				var vType:any =MySelectSingleBTN.ValueType_Name;
				if(meta && meta["参数"]!=null)	vType=meta["参数"];
				var SB:MySelectSingleBTN=MySelectSingleBTN.creatBtnFromSprite(obj,Handler.create(this,this.onClickF,null,false),Name,strFront,canMulti,vType);
				this.DicMc.set(Name,SB);
				if(meta)
				{
					if(meta["初始"]!=null)	SB.setNow(meta["初始"]);
					else if(meta["初始且事件"]!=null)
					{
						if(typeof meta["初始且事件"] == "number")	SB.clickF(meta["初始且事件"]);
						else							SB.clickNameF(meta["初始且事件"]);
					}
				}
			}
		}
	}

	private onClickF(Name:string,		n:any):void
	{
		if(this.Fun==null || n==null || n==-1)return;
		this.Fun.runWith([Name,n]);
	}
	
	public setNow(Name:string,	now:any,		on:boolean=true):void
	{
		var key:any;
		for(var i:number=0;i<this.DicMc.keys.length;i++)
		{
			key=this.DicMc.keys[i];
			if(Name==null || Name==key)	this.getSBtn(key).setNow(now,on);
		}
	}
	public clickF(Name:string,	n:any):void
	{
		var SB:MySelectSingleBTN=this.DicMc.get(Name);
		if(SB)
		{
			if(typeof n =="number")	SB.clickF(n);
			else			SB.clickNameF(n);
		}
	}
	public getSBtn(Name:string):MySelectSingleBTN
	{
		return this.DicMc.get(Name);
	}
	public onPauseF(Name:string,	pause:boolean):void
	{
		var key:any;
		for(var i:number=0;i<this.DicMc.keys.length;i++)
		{
			key=this.DicMc.keys[i];
			if(Name==null || Name==key)	this.getSBtn(key).Busy=pause;
		}
	}
	
	
	public destroyF():void
	{
		if(this.Fun!=null){
			this.Fun.clear();
			this.Fun=null;
		}
		this.DicMc=Tool_ObjUtils.destroyF_One(this.DicMc);
	}
}
}