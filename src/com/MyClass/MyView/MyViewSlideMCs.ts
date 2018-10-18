module com.MyClass.MyView{
import Sprite =starling.Sprite;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
import Tool_Function=com.MyClass.Tools.Tool_Function;
import SwfSprite=com.MyClass.MySwf.SwfSprite;
export class MyViewSlideMCs{
	public DicMc:Object =Tool_ObjUtils.getNewObjectFromPool();
	private DicOneURL:Object =Tool_ObjUtils.getNewObjectFromPool();
	public Dic_Meta:Object ={};
	constructor(view:Sprite){
		var l:number=view.numChildren;
		for(var i:number=0;i<l;i++)
		{
			var obj:any	= view.getChildAt(i);
			if(obj.name && obj.name.indexOf("slide_")==0)
			{
				var tmpL:any =obj.getChildByName("_layer");
				if(tmpL==null)
				{
					console.log("解析MyViewSlideMCs错误，没有_layer");
					continue;
				}
				var meta:Object;
				if(obj instanceof SwfSprite && ((obj as SwfSprite).spriteData[0] instanceof Array == false && (obj as SwfSprite).spriteData[0]["url"]==null)){
					meta=(obj as SwfSprite).spriteData[0];
				}
				if(meta==null)	{
					meta={};
					if(tmpL.width > tmpL.height){meta["方向"]="x";}
					else	{meta["方向"]="y";}
				}
				var Name:string=(obj.name as string).substr(6);
				var canx:boolean=meta["方向"]=="x";
				var cany:boolean=!canx;
				var 滑出:string=meta["边界"]?meta["边界"]:"mid";
				var Layer:Sprite=new Sprite();
				Layer.x=tmpL.x;
				Layer.y=tmpL.y;
				tmpL.x =tmpL.y =0;
				obj.addChild(Layer);
				Layer.addChild(tmpL);
				if(meta["w"])	
				{
					if(this.Dic_Meta[Name]==null)	this.Dic_Meta[Name]={};
					this.Dic_Meta[Name]["w"]=meta["w"];
				}
				if(meta["h"])
				{
					if(this.Dic_Meta[Name]==null)	this.Dic_Meta[Name]={};
					this.Dic_Meta[Name]["h"]=meta["h"];
				}
				if(meta["mid"])
				{
					if(this.Dic_Meta[Name]==null)	this.Dic_Meta[Name]={};
					this.Dic_Meta[Name]["mid"]=meta["mid"];
				}
				if(meta["每排数量"])
				{
					if(this.Dic_Meta[Name]==null)	this.Dic_Meta[Name]={};
					this.Dic_Meta[Name]["每排数量"]=meta["每排数量"];
				}
				var tmpOne:SwfSprite=obj.getChildByName("one")as SwfSprite;
				if(tmpOne)
				{
					obj.removeChild(tmpOne);
					this.DicOneURL[Name]=tmpOne.classLink;
					if(this.Dic_Meta[Name]==null)	this.Dic_Meta[Name]={};
					this.Dic_Meta[Name]["startX"]=tmpOne.x - Layer.x;
					this.Dic_Meta[Name]["startY"]=tmpOne.y - Layer.y;
					var tmpOne2:SwfSprite=obj.getChildByName("one2")as SwfSprite;
					if(tmpOne2)
					{
						obj.removeChild(tmpOne2);
						if(this.Dic_Meta[Name]==null)	this.Dic_Meta[Name]={};
						if(tmpOne2.y != tmpOne.y && tmpOne.x != tmpOne2.x){//间隔排列
							this.Dic_Meta[Name]["间隔排列"]=true;
							this.DicOneURL[Name+"_间隔"]=tmpOne2.classLink;
							if(canx==true){
								this.Dic_Meta[Name]["h"]=tmpOne2.y - tmpOne.y;
							}else{
								this.Dic_Meta[Name]["w"]=tmpOne2.x - tmpOne.x;
							}
						}else{
							if(Tool_Function.onForceConvertType(tmpOne2.y) == Tool_Function.onForceConvertType(tmpOne.y)){
								cany=true;
								canx=false;
							}else{
								canx=true;
								cany=false;
							}
							if(this.Dic_Meta[Name]["每排数量"]==null){
								if(cany && tmpOne.x != tmpOne2.x){//竖着滑动，mid为x
									this.Dic_Meta[Name]["mid"]=tmpOne2.x - tmpOne.x-tmpOne.width;
									this.Dic_Meta[Name]["每排数量"] =Tool_Function.onForceConvertType(tmpL.width / (tmpOne.width + this.Dic_Meta[Name]["mid"]));
									if(tmpL.width % (tmpOne.width + this.Dic_Meta[Name]["mid"]) >= tmpOne.width)	this.Dic_Meta[Name]["每排数量"]+=1;
								}else if(canx && tmpOne.y != tmpOne2.y){
									this.Dic_Meta[Name]["mid"]=tmpOne2.y - tmpOne.y - tmpOne.height;
									this.Dic_Meta[Name]["每排数量"] =Tool_Function.onForceConvertType(tmpL.height / (tmpOne.height + this.Dic_Meta[Name]["mid"]));
									if(tmpL.height % (tmpOne.height + this.Dic_Meta[Name]["mid"]) >= tmpOne.height)	this.Dic_Meta[Name]["每排数量"]+=1;
								}
							}
						}
					}
					var slide:MySlideMC=new MySlideMC(Layer,canx,cany,new laya.maths.Rectangle(0,0,tmpL.width,tmpL.height),滑出);
					var tmpScroll:Sprite=obj.getChildByName("_滑动条")as Sprite;
					if(tmpScroll)
					{
						var mcScroll:com.MyClass.Tools.MyScoll=new com.MyClass.Tools.MyScoll(tmpScroll);
						slide.setValue("滑动条",mcScroll);
					}
					// if(meta["透明区域"])	slide.setValue("透明图",tmpL);
					slide.visible=false;
					this.DicMc[Name]=slide;
				}
			}
		}
	}

	public getSlide(Name:string):MySlideMC
	{
		if(Name==null){
			for(let key in this.DicMc){
				return this.DicMc[key];
			}
		}
		return this.DicMc[Name];
	}
	/**
	 * 生成默认的one
	 * @param swf 
	 * @param Name slide的名字，null表示只有一个slide 
	 */
	public getDefaultOne(swf:string,Name:string = null):com.MyClass.MyView.MySlideMC_defaultOne{
		let spr=this.getSlideOne_ByNameFromSwf(swf,Name);
		var one:MySlideMC_defaultOne=new MySlideMC_defaultOne();
		if(spr){
			one.initF(spr);
		}
		return one;
	}
	public getSlideOne_ByNameFromSwf(swf:string,Name:string):starling.Sprite{
		let url:string =this.getOneClass_ByName(Name);
		if(url){
			return MySourceManager.getInstance().getSprFromSwf(swf,url);
		}
		return null;
	}
	public getOneClass_ByName(Name:string):string
	{
		return this.DicOneURL[Name];
	}
	public addSlideMc(Name:string,		arr:Array<any>):void
	{
		var slide:MySlideMC=this.getSlide(Name);
		if(slide)
		{
			slide.visible=true;
			if(arr[0] instanceof Array)
			{
				var Layer:Sprite=slide.Layer;
				var canX:Boolean=slide.canX;
				var midX:number=-1;
				var midY:number=-1;
				var startX:number=0;
				var startY:number=0;
				var everyNum:number=1;
				if(this.Dic_Meta && this.Dic_Meta[Name] && this.Dic_Meta[Name]["每排数量"])	everyNum=this.Dic_Meta[Name]["每排数量"];
				if(this.Dic_Meta && this.Dic_Meta[Name]){
					startX=Tool_Function.onForceConvertType(this.Dic_Meta[Name]["startX"]);
					startY=Tool_Function.onForceConvertType(this.Dic_Meta[Name]["startY"])
				}
				var countEvery:number=0;
				var countX:number=0;
				var countY:number=0;
				var countALL:number=0;
				
				if(this.Dic_Meta && this.Dic_Meta[Name])
				{
					if(this.Dic_Meta[Name]["w"])	midX=this.Dic_Meta[Name]["w"];
					if(this.Dic_Meta[Name]["h"])	midY=this.Dic_Meta[Name]["h"];
				}
				for(var i:number=0;i<arr[0].length;i++)
				{
					if(arr[0][i]==null)continue;
					Layer.addChild(arr[0][i]);
					if(midX==-1)
					{
						midX=arr[0][i].width;
						if(this.Dic_Meta && this.Dic_Meta[Name] && this.Dic_Meta[Name]["mid"])	midX+= this.Dic_Meta[Name]["mid"];
						else		midX+=midX * 0.1;
					}
					if(midY==-1)
					{
						midY=arr[0][i].height;
						if(this.Dic_Meta && this.Dic_Meta[Name] && this.Dic_Meta[Name]["mid"])	midY+= this.Dic_Meta[Name]["mid"];
						else		midY+=midY * 0.1;
					}
					countEvery++;
					countALL++;
					if(canX==true)
					{
						if(this.Dic_Meta && this.Dic_Meta[Name] && this.Dic_Meta[Name]["间隔排列"]==true){
							arr[0][i].x=countX * midX +startX;
							if(countALL % 2==0){
								arr[0][i].y =startY + midY;
							}else{
								arr[0][i].y =startY;
							}
							countX++;
						}else{
							if(countEvery >= everyNum){
								countEvery=0;
								arr[0][i].x=countX * midX +startX;
								arr[0][i].y =countY * midY +startY;
								countX++;
								countY=0;
							}
							else{
								arr[0][i].x=countX * midX +startX;
								arr[0][i].y =countY++ * midY +startY;
							}
						}
					}
					else
					{
						if(this.Dic_Meta && this.Dic_Meta[Name] && this.Dic_Meta[Name]["间隔排列"]==true){
							arr[0][i].y=countY * midY +startY;
							countY++;
							if(countALL % 2==0){
								arr[0][i].x =midX +startX;
							}else{
								arr[0][i].x =startX;
							}
							countX++;
						}
						else{
							if(countEvery >= everyNum){
								countEvery=0;
								arr[0][i].x =countX * midX +startX;
								arr[0][i].y=countY * midY +startY;
								countX=0;
								countY++;
							}
							else{
								arr[0][i].y=countY * midY +startY;
								arr[0][i].x =countX++ * midX +startX;
							}
						}
					}
					if(this.Dic_Meta && this.Dic_Meta[Name] && this.Dic_Meta[Name]["one大小"]!=null){
						arr[0][i]=new BTN_Virtual(0,this.Dic_Meta[Name]["one大小"]);
					}
				}
			}
			slide.setValue("按钮集",arr);
			slide.checkMINXY();
			slide._w0=midX;
			slide._h0=midY;
			if(Layer)
			{
				Layer.x=slide.maxX;
				Layer.y=slide.maxY;
			}
			slide.onCheckVisible();
		}
	}
	
	
	public destroyF():void
	{
		this.DicMc=Tool_ObjUtils.destroyF_One(this.DicMc);
		this.DicOneURL=Tool_ObjUtils.destroyF_One(this.DicOneURL);
	}
}
}