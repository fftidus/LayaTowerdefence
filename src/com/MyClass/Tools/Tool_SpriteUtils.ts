module com.MyClass.Tools{
export class Tool_SpriteUtils{
	/*** 替换父对象层级并add到自己上 ***/
	public static onAddchild_ReplaceParent(_parent:any,	child:any):void
	{
		_parent.x=child.x;
		_parent.y=child.y;
		if(child.parent)
		{
			child.parent.addChildAt(_parent,child.parent.getChildIndex(child));
		}
		_parent.addChild(child);
		child.x=child.y=0;
	}

	/*
	* 获得数字
	*/
	public static onGetImageNum(fName:string,spr:starling.Sprite,_url:string,_Parentswf:string=null):MyView.ImageNum
	{
		var tmp:any	= spr.getChildByName(_url);
		if(tmp==null)	return null;
		var classLink:string=tmp.classLink;
		var arr:Array<string>=classLink.split("_");//img_25_颜色FF99000_对齐中
		if(fName==null)	fName=arr[1];
		if(_Parentswf==null)
		{
			for(var i:number=2;i<arr.length;i++)
			{
				if(arr[i].indexOf("swf")==0)
				{
					_Parentswf=arr[i].slice(3);
					if(_Parentswf=="SWF")	_Parentswf+="_"+arr[i+1];
					break;
				}
			}
		}
		var num:MyView.ImageNum	= new MyView.ImageNum(fName,_Parentswf);
		num.setValue("父对象",tmp);
		if(arr.length>2)
		{
			var info:Object = {};
			for(var j:number=2;j<arr.length;j++)
			{
				var one:string=arr[j];
				if(one.indexOf("颜色")==0)
				{
					one=one.slice(2);
					if(one.indexOf("0x")!=0)one="0x"+one;
					num.setValue("颜色",Tool_Function.onChangeInstance(one));
				}
				else if(one.indexOf("对齐")==0)
				{
					num.setValue("对齐",one.slice(2));
				}
			}
		}
		return num;
	}
	public static onGetAll_ImageNum(spr:starling.Sprite,fName:string=null,_Parentswf:string=null):any
	{
		var dic:Object ={};
		var arrChild:Array<any>=[];
		for(var i:number=0;i<spr.numChildren;i++)
		{
			var c:any = spr.getChildAt(i);
			var str:string=c.name;
			if(str==null || str.indexOf("num_")!=0)continue;
			arrChild.push(str);
		}
		for(i=0;i<arrChild.length;i++)
		{
			str=arrChild[i];
			var tmp:Array<any>=str.split("_");//num,???,字体25,颜色xxx，对齐xxx，swf
			var name:string=tmp[0]+"_"+tmp[1];
			var info:Object = {"fName":fName,"swf":_Parentswf};
			for(var j:number=2;j<tmp.length;j++)
			{
				var one:string=tmp[j];
				if(one.indexOf("字体")==0)info["fName"]=one.slice(2);
				else if(one.indexOf("swf")==0)
				{
					var strSWF:string="";
					j++;
					while(j<tmp.length)
					{
						if(strSWF.length>0)strSWF+="_";
						strSWF+=tmp[j++];
					}
					info["swf"]=strSWF;
					break;
				}
				else if(one.indexOf("颜色")==0)
				{
					
					one=one.slice(2);
					if(one.indexOf("0x")!=0)one="0x"+one;
					info["颜色"]=Tool_Function.onChangeInstance(one);
				}
				else if(one.indexOf("对齐")==0)info["对齐"]=one.slice(2);
			}
			var num:MyView.ImageNum=this.onGetImageNum(info["fName"],spr,str,info["swf"]);
			if(info["颜色"]!=null)num.setValue("颜色",info["颜色"]);
			if(info["对齐"]!=null)num.setValue("对齐",info["对齐"]);
			dic[name]=num;
		}
		return dic;
	}

	/**
	 * 复制
	*/
	public static cloneSprite(target:starling.Sprite):starling.Sprite{
		var numChilds:Number = target.numChildren;
		var sprite:starling.Sprite = new starling.Sprite();
		var child:any;
		for (var i:number = 0; i < numChilds; i++) {
			child = target.getChildAt(i);
			if(child instanceof starling.Sprite){
				sprite.addChild(Tool_SpriteUtils.cloneSprite(child as starling.Sprite));
			}else if(child instanceof starling.Image){
				sprite.addChild(Tool_ImgUtils.cloneImage(child as starling.Image));
			}
		}
		sprite.x=target.x;
		sprite.y=target.y;
		sprite.width =target.width;
		sprite.height =target.height;
		sprite.skewX = target.skewX;
		sprite.skewY = target.skewY;		
		sprite.alpha = target.alpha;
		return sprite;
	}
	
	/**
	 * 获得meta数据
	* **/
	public static getMetaData_FromSPR(spr:starling.Sprite):Object
	{
		var meta:Object;
		if(spr instanceof com.MyClass.MySwf.SwfSprite && (spr as com.MyClass.MySwf.SwfSprite).spriteData[0] instanceof Array == false)
			meta=(spr as com.MyClass.MySwf.SwfSprite).spriteData[0];
		return meta;
	}

	/** 获得按钮 **/
	public static getBtn(spr:starling.Sprite,url:string):com.MyClass.MyView.BTN_Starling
	{
		var B:com.MyClass.MyView.BTN_Starling;
		var tmp:any	= spr.getChildByName(url);
		if(tmp==null)return null;
		B	= new com.MyClass.MyView.BTN_Starling(tmp as starling.Sprite);
		B.name=url;
		return B;
	}
	
	/*** 替换父对象层级并add到自己上 ***/
	public static onAddchild_ChangeParent(spr:any,	child:any):void
	{
		spr.x=child.x;
		spr.y=child.y;
		if(child.parent)
		{
			child.parent.addChildAt(spr,child.parent.getChildIndex(child));
		}
		spr.addChild(child);
		child.x=child.y=0;
	}

	/** getBounds */
	public static getBounds(tar:any,parent:any):laya.maths.Rectangle{
		if(tar instanceof com.MyClass.MySwf.SwfS9Image || tar instanceof starling.Image){
			let rec =new laya.maths.Rectangle();
			rec.x =tar.x;
			rec.y =tar.y;
			rec.width =tar.width;
			rec.height =tar.height;
			return rec;
		}
		if(tar instanceof starling.Sprite){
			var x0:number=9999999;
			var y0:number=9999999;
			var x1:number=-9999999;
			var y1:number=-9999999;
			for(let i:number=0;i<(tar as starling.Sprite).numChildren;i++){
				var rec:laya.maths.Rectangle =Tool_SpriteUtils.getBounds(tar.getChildAt(i),null);
				if(rec.x < x0){x0=rec.x;}
				if(rec.x+rec.width > x1){x1=rec.x+rec.width;}
				if(rec.y < y0){y0=rec.y;}
				if(rec.y+rec.height > y1){y1=rec.y+rec.height;}
			}
			if(rec==null){
				rec =new laya.maths.Rectangle();
				rec.x =tar.x;
				rec.y =tar.y;
				return rec;
			}
			rec.x =x0+tar.x;
			rec.y =y0+tar.y;
			rec.width=x1-x0;
			rec.height=y1-y0;
			return rec;
		}
		return tar.getBounds();
	}
}
}