module com.MyClass.MyView{
import SwfImage=com.MyClass.MySwf.SwfImage;
import SwfSprite=com.MyClass.MySwf.SwfSprite;
export class ImageNum extends starling.Sprite{
	public static SWFDefault:string="SWF_Default";
	private SwfName:string;
	public FrontName:string;
	private Layer:com.MyClass.MySwf.SwfSprite;
	private L:number;
	private W:number	= -1;
	private Arr_Save:Array<any>	= [];
	private tm:MySourceManager;
	
	public  NowStr:string;
	private MidL:number	= 0;	//统一间隔
	private vAlin:string= "左";
	private MinL:number	= -1;	//最少位数，不足将补0
	private Col:number		= -1;
	private tmpCol:number=-1;
	private	OnlyNumberColor:boolean=false;
	private	TypeOfParent:string;
	private neetW_to_10000:number=-1;
	
	private	FunRunover:laya.utils.Handler;
	private	NowNum:number;
	private	EndNum:number;
	private	SpdNum:number;
	private	RunTime:number;
	private	STR_head:string;
	private	STR_tail:string;

	constructor(fname:string, 	_swf:string){
		super();
		this.SwfName	= _swf;
		if(this.SwfName==null)this.SwfName=ImageNum.SWFDefault;
		this.FrontName	= fname;
	}

	public addSource(arr:Array<any> = null):Array<any>
	{
		if(arr == null)	arr	= [];
		arr.push([this.SwfName,"swf","FrontSource/"+this.SwfName]);
		return arr;
	}
	
	public setValue(str:string,	val:any = null):void
	{
		switch (str)
		{
			case "间隔":		this.MidL	= val;	break;
			case "对齐":		this.vAlin	= val;	break;
			case "最少位数":	this.MinL	= val;	break;
			case "颜色":
				if(this.Col==val)return;
				this.Col		= val;
				for(var i:number=0;i<this.Arr_Save.length;i++)
				{
					if(this.OnlyNumberColor && this.Arr_Save[i][2]==true)continue;
					if(this.Arr_Save[i][1])(this.Arr_Save[i][1] as SwfImage).color	= this.Col;
				}
				break;
			case "局部颜色":
				tmpCol=val;
				break;
			case "颜色仅数字":
				this.OnlyNumberColor=val;
				if(this.Col !=-1)
				{
					var tmpCol:number=this.Col;
					this.Col=-1;
					this.setValue("颜色",tmpCol);
				}
				break;
			case "父对象":
				if(val instanceof SwfImage)
				{
					val.parent.addChildAt(this,val.parent.getChildIndex(val));
					val.parent.removeChild(val);
					this.x	= val.x;
					this.y	= val.y;
					this.TypeOfParent="img";
				}
				else if(val instanceof starling.Sprite)
				{
					(val as starling.Sprite).removeChildren();
					(val as starling.Sprite).addChild(this);
					this.TypeOfParent="spr";
				}
				break;
			case "x":
				if(this.TypeOfParent=="spr")	(this.parent as starling.Sprite).x=val;
				else				this.x=val;
				break;
			case "y":
				if(this.TypeOfParent=="spr")	(this.parent as starling.Sprite).y=val;
				else				this.y=val;
				break;
			case "stage监听":
				// this.addEventListener(Event.REMOVED_FROM_STAGE,onRemoveF);
				this.once(laya.events.Event.REMOVED,this,this.onRemoveF);
				break;
			case "万":
				this.neetW_to_10000=val;
				break;
		}
	}
	private Arr数字:Array<string>=["0","1","2","3","4","5","6","7","8","9","+","-","."];

	public showF(val:any):void
	{
		this.L=0;
		if(this.Layer == null)
		{
			this.Layer	= new SwfSprite();
			this.addChild(this.Layer);
			this.tm	= MySourceManager.getInstance();
		}
		else
		{
			this.Layer.removeChildren();
			this.clearSaveF();
		}
		if(val==null)val="";
		else if(typeof(val)==="number" && this.neetW_to_10000>0 && val >= this.neetW_to_10000){
			val=Tools.Tool_Function.onChangeInstance(val / 10000)+"万";
		}
		this.appendShowF(val);
	}
	public appendShowF(val:any):void{
		this.NowStr	= Tools.Tool_Function.onChangeInstance(val,"str");
		var x0:number=this.L==0?0:(this.L * this.W + (this.L-1) * this.MidL);
		this.L	= this.NowStr.length;
		if(this.L == 0)	return;
		var more0:number	= -1;
		if(this.L < this.MinL)	{more0	= this.MinL - this.L;	this.L	= this.MinL;}
		for(var i:number=0; i<this.L; i++)
		{
			var char:string	= this.NowStr.charAt(i);
			if(more0-- >= 0)	char	= "0";
			if(char==".")	char="小数点";
			var is数字:Boolean=true;
			var img:SwfImage;
			img	= ImageNum.getCache(this.FrontName+char,this.SwfName);
			if(img==null)img	= this.tm.getImgFromSwf(this.SwfName,"img_"+this.FrontName+"Num_"+char);
			if(this.Arr数字.indexOf(char) == -1)	is数字=false;
			if(is数字==false)this.Arr_Save.push([char,img]);
			else			this.Arr_Save.push([char,img,true]);
			if(img)
			{
				if(this.W == -1)
				{
					var imgW:SwfImage= this.tm.getImgFromSwf(this.SwfName,"img_"+this.FrontName+"FrontWidth");
					if(imgW == null){
						if(img){
							this.W	= img.width+img.pivotX;
						}
					}
					else{
						this.W	= imgW.width;
					}
				}
				img.x	=x0+ i * this.W + this.MidL;
				if(this.tmpCol!=-1){
					if(this.OnlyNumberColor==false || is数字==true)		img.color	= this.tmpCol;
				}
				else if(this.Col != -1)
				{
					if(this.OnlyNumberColor==false || is数字==true)		img.color	= this.Col;
				}
				this.Layer.addChild(img);
			}
		}
		if(this.vAlin == "左")		this.Layer.x	= 0;
		else if(this.vAlin == "中")		this.Layer.x	= -(this.L * this.W + (this.L-1) * this.MidL)/2 + this.W/2;
		else if(this.vAlin == "右")		this.Layer.x	= -(this.L * this.W + (this.L-1) * this.MidL) + this.W;
		this.tmpCol=-1;
	}
	
	public runF(fend:laya.utils.Handler,s:number,e:number,t:number,head:string,tail:string):void
	{
		this.FunRunover	= fend;
		this.NowNum	= s;
		this.EndNum	= e;
		this.RunTime	= t;
		this.STR_head	= head;if(this.STR_head == null)	this.STR_head	= "";
		this.STR_tail	= tail;	if(this.STR_tail == null)		this.STR_tail		= "";
		this.SpdNum			= (this.EndNum - this.NowNum)/t;
		this.showF(this.STR_head+Tools.Tool_Function.onChangeInstance(this.NowNum)+this.STR_tail);
		MainManager._instence.addEnterFrameFun(laya.utils.Handler.create(this,this.runCheck,null,false));
	}
	
	private runCheck():void
	{
		if(this.NowNum == this.EndNum)
		{
			MainManager._instence.removeEnterFrameFun(this.runCheck);
			if(this.FunRunover)	this.FunRunover.run();
			return;
		}
		this.NowNum	+= this.SpdNum;
		if(this.SpdNum > 0 && this.NowNum > this.EndNum)	this.NowNum	= this.EndNum;
		else if(this.SpdNum < 0 && this.NowNum < this.EndNum)	this.NowNum	= this.EndNum;
		if(--this.RunTime <= 0)							this.NowNum	= this.EndNum;
		this.showF(this.STR_head+Tools.Tool_Function.onChangeInstance(this.NowNum)+this.STR_tail);
	}
	
	public getValue(want:string):any
	{
		switch (want)
		{
			case "右边x":
				var x0:number;
				if(this.vAlin == "左")		x0=this.x + (this.L * this.W + (this.L-1) * this.MidL);
				else if(this.vAlin == "中")		x0=this.x - this.Layer.x + this.W;
				else if(this.vAlin == "右")		x0=this.x;
				if(this.TypeOfParent=="spr")	x0+=(this.parent as starling.Sprite).x;
				return x0;
			default:	return this[want];
		}
	}
	private onRemoveF(e:any):void{
		this.destroyF();
	}
	public destroyF():void
	{
		if(this.Layer)
		{
			this.removeChild(this.Layer);
			this.Layer.destroyF();
			this.Layer	= null;
		}
		this.tm=null;
		this.clearSaveF();
		this.removeFromParent(true);
	}
	private clearSaveF():void
	{
		for(var i:number=0;i<this.Arr_Save.length;i++)
		{
			if(this.Arr_Save[i][1])
			{
				if(this.Col != -1)	this.Arr_Save[i][1].color	= starling.Color.WHITE;
				ImageNum.addCache(this.FrontName+this.Arr_Save[i][0],this.SwfName,this.Arr_Save[i][1]);
			}
			this.Arr_Save.splice(i--,1);
		}
	}
	/*
	* 缓存
	*/
	private static NeedCache:Object={};
	public static addNeedCache(fName:string,	real:boolean):void
	{
		this.NeedCache[fName]=real;
	}
	public static removeNeedCache(fName:string):void
	{
		if(fName==null)
		{
			this.NeedCache={};
			this.clearF();
		}
		else	this.NeedCache[fName]=false;
	}
	private static isNeedCache(fName:string):boolean
	{
		if(this.NeedCache[fName]!=null)return this.NeedCache[fName];
		return false;
	}
	private static DicCache:Object;
	private static getCache(str:string,swf:string):SwfImage
	{
		if(this.isNeedCache(str)==false)	return null;
		if(this.DicCache==null)this.DicCache={};
		if(this.DicCache[swf]==null)this.DicCache[swf]={};
		if(this.DicCache[swf][str]==null)this.DicCache[swf][str]=[];
		var img:SwfImage;
		if(this.DicCache[swf][str].length > 0)
		{
			img	= this.DicCache[swf][str][0];
			(this.DicCache[swf][str]as Array<any>).shift();
		}
		return img;
	}
	private static addCache(str:string,swf:string,	obj:any):void
	{
		if(this.isNeedCache(str)==false)	return;
		if(this.DicCache==null)this.DicCache={};
		if(this.DicCache[swf]==null)this.DicCache[swf]={};
		if(this.DicCache[swf][str]==null)this.DicCache[swf][str]=[];
		this.DicCache[swf][str].push(obj);
	}
	public static clearF():void
	{
		if(this.DicCache==null)	return;
		for(var swf in this.DicCache)
		{
			var dic:any	= this.DicCache[swf];
			for(var key in dic)
			{
				var arr:Array<any>=dic[key];
				for(var i:number=0; i<arr.length; i++)
				{
					(arr[i]as SwfImage).removeFromParent(true);
				}
				delete dic[key];
			}
		}
		this.DicCache=null;
	}
	/** 手动缓存s */
	public static onCacheAndSaveF(fName:string,	swf:string):void
	{
		this.addNeedCache(fName,true);
		for(var i:number=0; i<10; i++)
		{
			var count:number = 5;
			while(count-- > 0)
			{
				this.addCache(fName+i,swf,MySourceManager.instance.getImgFromSwf(swf,"img_"+fName+"Num_"+i));
			}
		}
	}
	
}
}