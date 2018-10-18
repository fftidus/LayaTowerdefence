module com.MyClass.MyView{
import Handler=laya.utils.Handler;
import Sprite=starling.Sprite;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
import Tool_Function=com.MyClass.Tools.Tool_Function;
export class MySelectSingleBTN{
	public static creatBtnFromSprite(spr:Sprite,fchange:Handler,id:any =null,strFront:string="btn_",canMulti:boolean=false,vType:number=this.ValueType_ArrayIndex):MySelectSingleBTN
	{
		var Arr:Array<any>=this.getArrFromSpr(spr,strFront,vType==this.ValueType_ArrayIndex);
		var mbtn:MySelectSingleBTN=new MySelectSingleBTN(spr,fchange,id,canMulti,vType);
		mbtn.initF(Arr);
		return mbtn;
	}
	private static getArrFromSpr(spr:Sprite,strFront:string="btn_",	isArrayIndex:boolean=false):Array<any>
	{
		var Arr:Array<any>=[];
		var dicName:Object ={}
		for(var i:number=0;i<spr.numChildren;i++)
		{
			var child:any =spr.getChildAt(i);
			if(child instanceof com.MyClass.MySwf.SwfMovieClip && (child as com.MyClass.MySwf.SwfMovieClip).name.indexOf(strFront)==0)
			{
				var btn:BTN_Starling=new BTN_Starling(child);
				btn.onChangeFrame(BTN_Starling.Frame_Nor);
				if(isArrayIndex)
				{
					var index:number=Tool_Function.onForceConvertType((child.name as String).substr(4));
					Arr[index]=btn;
					dicName[index]=child.name;
				}
				else
				{
					Arr.push(btn);
					dicName[Arr.length-1]=child.name;
				}
			}
		}
		return [Arr,dicName];
	}
	public static creatBtnFromArr(spr:Sprite,Arr:Array<any>,	fchange:Handler,	id:any =null, canMulti:boolean=false):MySelectSingleBTN
	{
		//只能用数组位置方式
		for(var i:number=0;i<Arr.length;i++)
		{
			if(Arr[i]==null)continue;
			if(Arr[i] instanceof BTN_Starling)continue;
			Arr[i]=new BTN_Starling(Arr[i]);
		}
		var mbtn:MySelectSingleBTN=new MySelectSingleBTN(spr,fchange,id,canMulti);
		mbtn.initF([Arr]);
		return mbtn;
	}
	/////////////////////////////////////////////////////////////////////
	private ID:any;
	private FunChange:Handler;
	public Spr:Sprite;
	public Arr:Array<any>;
	private BC:BTNControllerStarling;
	private Btn:BTN_Starling;
	public  Now:number	= -1;
	public Busy:boolean	= false;
	public DicName:any;
	//多选
	public canMulti:boolean=false;
	private Dic_Down:any;
	//用名字返回事件
	public funValueType:number;
	public static ValueType_ArrayIndex:number=0;
	public static ValueType_Name:number=1;
	//滑动
	private McSlide:MySlideMC;
	private DicCanSlideFlagmc:any;
	//子界面
	public sprSecond:Sprite;
	private infoSecond:any;
	constructor(spr:Sprite,	fchange:Handler,	id:any,	canMulti:boolean=false,	vtype:number = 0){
		this.ID	= id;
		this.FunChange	= fchange;
		this.FunChange.once=false;
		this.Spr	= spr;
		this.canMulti=canMulti;
		this.funValueType=vtype;
		if(this.canMulti==true)this.Dic_Down={};
	}

	public initF(arr:Array<any>):void
	{
		this.Arr=arr[0];
		this.DicName=arr[1];
		if(this.Arr==null)return;
		if(this.Arr.length==0){
			if(this.Spr instanceof com.MyClass.MySwf.SwfMovieClip){//自己就是一个sbtn
				this.canMulti=true;//为true才能取消
				this.Dic_Down={};
				this.Btn=new BTN_Starling(this.Spr);
				this.Btn.initTouch(null,null,Handler.create(this,this.clickF,[0],false))
				this.Arr[0]=this.Btn;
			}
			return;
		}
		//子界面：V_name
		if(this.DicName){
			for(var n in this.DicName){
				this.Arr[n].name =this.DicName[n];
				var tmp:any =this.Spr.getChildByName("V_"+this.DicName[n].substr(4));
				if(tmp){
					if(this.infoSecond==null){this.infoSecond={"index":999};}
					this.infoSecond[n]={"x":tmp.x,"y":tmp.y,"swf":tmp.swfName,"url":tmp.classLink,"sx":tmp.scaleX,"sy":tmp.scaleY};
					var index:number =this.Spr.getChildIndex(tmp);
					if(index<this.infoSecond["index"]){
						this.infoSecond["index"]=index;
					}
					tmp=Tool_ObjUtils.destroyF_One(tmp);
				}
			}
		}
		//--------------------
		this.BC	= new BTNControllerStarling(this.Spr,this.Arr,Handler.create(this,this.clickF,null,false),null,null);
		this.BC.autoChangeFrame=false;
		// this.BC.EventMopType=BTNControllerStarling.Event_ActAndStopMop;
		//判断滑动区域
		var tmpL:any =this.Spr.getChildByName("_area");
		if(tmpL==null)	return;
		var meta:Object;
		if(this.Spr instanceof com.MyClass.MySwf.SwfSprite && (this.Spr as com.MyClass.MySwf.SwfSprite).spriteData[0] instanceof Array == false)
			meta=(this.Spr as com.MyClass.MySwf.SwfSprite).spriteData[0];
		if(meta==null)	return;
		
		this.BC=Tool_ObjUtils.destroyF_One(this.BC);
		var layer:Sprite=new Sprite();
		this.Spr.addChild(layer);
		for(var i:number=0;i<this.Arr.length;i++)
		{
			if(this.Arr[i])	layer.addChild(this.Arr[i]);
		}
		this.BC	= new BTNControllerStarling(layer,this.Arr,Handler.create(this,this.clickF),null,null);
		this.BC.autoChangeFrame=false;
		// this.BC.EventMopType=BTNControllerStarling.Event_ActAndStopMop;
		
		var canx:boolean=meta["方向"]=="x";
		var cany:boolean=!canx;
		var slideType:string=meta["边界"]?meta["边界"]:"mid";
		this.McSlide=new MySlideMC(layer,canx,cany,new laya.maths.Rectangle(tmpL.x,tmpL.y,tmpL.width,tmpL.height),slideType);
		this.McSlide.BC2=this.BC;
		if(meta["透明区域"])	this.McSlide.setValue("透明图",tmpL);
		else	tmpL.removeFromParent(true);
		if(canx==true)
		{
			addCanSlide("左");
			addCanSlide("右");
		}
		if(cany==true)
		{
			addCanSlide("上");
			addCanSlide("下");
		}
		if(this.DicCanSlideFlagmc)	this.McSlide.setValue("移动事件",onSlideF);
		function addCanSlide(dir:string):void
		{
			var mc:any =this.Spr.getChildByName("_可滑动"+dir);
			if(mc==null)return;
			if(this.DicCanSlideFlagmc==null)this.DicCanSlideFlagmc={};
			mc.touchable=false;
			this.Spr.addChild(mc);
			this.DicCanSlideFlagmc[dir]=mc;
		}
		function onSlideF():void
		{
			if(this.McSlide.Layer.y < this.McSlide.maxY)
			{
				if(this.DicCanSlideFlagmc["上"])	this.DicCanSlideFlagmc["上"].visible=true;
			}
			else
			{
				if(this.DicCanSlideFlagmc["上"])	this.DicCanSlideFlagmc["上"].visible=false;
			}
			if(this.McSlide.Layer.y > this.McSlide.minY)
			{
				if(this.DicCanSlideFlagmc["下"])	this.DicCanSlideFlagmc["下"].visible=true;
			}
			else
			{
				if(this.DicCanSlideFlagmc["下"])	this.DicCanSlideFlagmc["下"].visible=false;
			}
		}
	}
	public clickNameF(Name:string):void
	{
		if(this.Busy)return;
		for(var n in this.DicName)
		{
			if(this.DicName[n]==Name)
			{
				this.clickF(Tool_Function.onForceConvertType(n));
				return;
			}
		}
	}
	public clickF(n:number):void
	{
		if(this.Busy)return;
		if(this.Arr==null)
		{
			if(this.Spr)	this.initF(MySelectSingleBTN.getArrFromSpr(this.Spr,"btn_",this.funValueType==MySelectSingleBTN.ValueType_ArrayIndex));
		}
		if(this.canMulti==false)
		{
			if(n == this.Now)		return;
			if(this.Now >= 0)	this.setFrame(this.Now,BTN_Starling.Frame_Nor);
			this.Now	= n;
			this.setFrame(this.Now,BTN_Starling.Frame_Selected);
			this.onShowSecond();
		}
		else
		{
			if(this.Dic_Down[n]==true)	this.setNow(n,false);
			else						this.setNow(n,true);
		}
		if(this.FunChange)
		{
			var val:any;
			if(this.funValueType==MySelectSingleBTN.ValueType_Name && this.DicName[n])	val=this.DicName[n];
			else	val=n;
			if(this.Arr.length==1){//只有一个，参数传boolean
				val=this.Dic_Down[n];
			}
			if(this.ID==-1 || this.ID==null)	this.FunChange.runWith(val);
			else								this.FunChange.runWith([this.ID,val]);
		}
	}
	
	public getNow(now:number = -1):any
	{
		if(this.canMulti==false)	return this.Now;
		return this.Dic_Down[now];
	}
	public getNowName():string
	{
		if(this.canMulti==false)	return this.DicName[this.Now];
		return null;//多选时没有此操作
	}
	public setNow(_now:any,	on:boolean=true):void
	{
		var po:number=-1;
		if(typeof _now == "string")
		{
			for(var n in this.DicName)
			{
				if(this.DicName[n]==_now)
				{
					po=Tool_Function.onForceConvertType(n);
					break;
				}
			}
		}else{
			po=_now;
		}
		if(po ==-1)	return;
		if(this.canMulti==false)
		{
			if(po == this.Now)	return;
			if(this.Now >= 0)		this.setFrame(this.Now,BTN_Starling.Frame_Nor);
			this.Now	= po;
			this.setFrame(this.Now,BTN_Starling.Frame_Selected);
			this.onShowSecond();
		}
		else
		{
			if(po==-1){
				for(var key in this.Dic_Down)
				{
					if(this.Dic_Down[key]==on)continue;
					this.Dic_Down[key]=on;
					if(on==true)	this.setFrame(Tool_Function.onForceConvertType(key),BTN_Starling.Frame_Selected);
					else				this.setFrame(Tool_Function.onForceConvertType(key),BTN_Starling.Frame_Nor);
				}
			}else{
				if(this.Dic_Down[po]==on)return;
				this.Dic_Down[po]=on;
				if(on==true)	this.setFrame(po,BTN_Starling.Frame_Selected);
				else				this.setFrame(po,BTN_Starling.Frame_Nor);
			}
		}
	}
	public getBTN_by_Name(str:string):BTN_Starling
	{
		if(this.DicName==null)return null;
		for(var po in this.DicName)
		{
			if(this.DicName[po]==str)	return this.Arr[Tool_Function.onForceConvertType(po)];
		}
		return null;
	}
	
	private onShowSecond():void{
		this.sprSecond=Tool_ObjUtils.destroyF_One(this.sprSecond);
		if(this.infoSecond &&  this.infoSecond[this.Now]){
			this.sprSecond=MySourceManager.getInstance().getSprFromSwf(this.infoSecond[this.Now]["swf"],this.infoSecond[this.Now]["url"]);
			if(this.sprSecond){
				this.sprSecond.x=this.infoSecond[this.Now].x;
				this.sprSecond.y=this.infoSecond[this.Now].y;
				this.sprSecond.scaleX=this.infoSecond[this.Now].sx;
				this.sprSecond.scaleY=this.infoSecond[this.Now].sy;
				this.Spr.addChildAt(this.sprSecond,this.infoSecond["index"]);
			}
		}
	}
	
	private setFrame(n:number,	f:number):void
	{
		if(this.Arr && this.Arr[n]){
			(this.Arr[n]as BTN_Starling).onChangeFrame(f);
		}
	}
	
	public destroyF():void
	{
		this.Spr=Tool_ObjUtils.destroyF_One(this.Spr);
		this.BC=Tool_ObjUtils.destroyF_One(this.BC);
		this.Arr=Tool_ObjUtils.destroyF_One(this.Arr);
		this.McSlide=Tool_ObjUtils.destroyF_One(this.McSlide);
		this.DicCanSlideFlagmc=Tool_ObjUtils.destroyF_One(this.DicCanSlideFlagmc);
		this.sprSecond=Tool_ObjUtils.destroyF_One(this.sprSecond);
		if(this.FunChange){
			this.FunChange.clear();
			this.FunChange=null;
		}
	}
}
}