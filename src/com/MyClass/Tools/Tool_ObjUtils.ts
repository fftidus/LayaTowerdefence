module com.MyClass.Tools{
export class Tool_ObjUtils{
	public static destroyF_One(obj:any):any{
		if(obj == null)	return null;
		if(obj instanceof Array)
		{
			for(var i:number=0; i<obj.length; i++)
			{
				Tool_ObjUtils.destroyF_One(obj[i]);
			}
			obj.length=0;
			Tool_ArrayUtils.returnArrayToPool(obj);
		}
		else if(obj instanceof Dictionary)
		{
			for(let i:number=0;i<(obj as Dictionary).keys.length;i++)
			{
				this.destroyF_One(obj.get[obj.keys[i]]);
				if(typeof obj.keys[i] === "string" || typeof obj.keys[i] === "number"){}
				else	this.destroyF_One(obj.keys[i]);
				(obj as Dictionary).keys.splice(i--,1);
			}
		}
		else if(typeof obj === "number")
		{
			return 0;
		}
		else if(this.hasFunction(obj,"destroyF")==true)
		{
			obj.destroyF();
		}
		else if(obj instanceof laya.utils.Handler)
		{
			(obj as laya.utils.Handler).clear();
		}
		else if(obj instanceof starling.Sprite)
		{
			this.destroyDisplayObj(obj);
		}
		else if(obj instanceof laya.display.Text)
		{
			(obj as laya.display.Text).removeSelf();
		}
		else if(obj instanceof laya.display.Sprite)
		{
			(obj as laya.display.Sprite).removeSelf();
		}
		else if(obj instanceof Object)
		{
			for(var n in obj)
			{
				if(n=="__proto__")continue;
				this.destroyF_One(obj[n]);
				delete obj[n];
				if(typeof n === "string" || typeof n === "number"){}
				else	this.destroyF_One(n);
			}
			this.returnObjectToPool(obj);
		}
		return null;
	}

	public static destroyDisplayObj(obj:starling.Sprite):void
	{
		if(obj!=null){
			obj.removeChildren();
			obj.removeFromParent();
		}
	}

	private static Dic_HaveFun:Object=new Object();
	public static hasFunction(target:Object,method:string):boolean
	{
		var className:String	= Tool_Function.getLastClassName(target);
		if(this.Dic_HaveFun[className+"*"+method]==null)
		{
			try{
				this.Dic_HaveFun[className+"*"+method]=target[method] instanceof Function;
			}catch(e){
				this.Dic_HaveFun[className+"*"+method]=false;
			}
		}
		return this.Dic_HaveFun[className+"*"+method];
	}
	
	public static isEqual(obj1:any,	obj2:any):boolean
	{
		if(obj1==null && obj2==null)	return true;
		if(obj1==null || obj2==null)	return false;
		if(obj1 instanceof Array)	return Tool_ArrayUtils.isEqual(obj1,obj2);
		if(obj1 instanceof String)
		{
			return obj1 == obj2;
		}
		if(obj1 instanceof Number && obj2 instanceof Number)
		{
			let num1:number =Tool_Function.onChangeInstance(obj1,"num");
			let num2:number =Tool_Function.onChangeInstance(obj2,"num");
			if(Math.abs( num1-num2) < 0.00001)	return true;
			return false;
		}
		if(obj1 instanceof Object)return Tool_ObjUtils.isEqualObj(obj1,obj2);
		return obj1==obj2;
	}
	
	public static isEqualObj(dic1:any , dic2:any):boolean
	{
		var dicHave:Object={}
		var haveWrong:boolean=false;
		for(let n in dic1){
			dicHave[n]=true;
			if(Tool_ObjUtils.isEqual(dic1[n],dic2[n])==false){
				haveWrong=true;
				break;
			}
		}
		for(let n in dic2){
			if(dicHave[n]!=true){
				haveWrong=true;
				break;
			}
		}
		if(haveWrong==true)return false;
		return true;
	}

	public static CopyF(obj:any,	noCopy:boolean=false):any
	{
		if(obj instanceof String || obj instanceof Number || obj == null  || obj instanceof Boolean)	return obj;
		if(obj instanceof Array)
		{
			if(noCopy)	return Tool_ArrayUtils.copyArr(obj);
			return Tool_ArrayUtils.copyArr(obj);
		}
		if(obj instanceof Object)
		{
			var out:Object	= Tool_ObjUtils.getNewObjectFromPool();
			for(let key in obj)
			
			{
				out[key]=Tool_ObjUtils.CopyF(obj[key],noCopy);
			}
			return out;
		}
		if(noCopy)	return obj;
		if(obj instanceof starling.Image)
		{
			return com.MyClass.Tools.Tool_ImgUtils.cloneImage(obj as starling.Image);
		}
		if(obj instanceof starling.Sprite)
		{
			return Tool_SpriteUtils.cloneSprite(obj);
		}
		return obj;
	}

	/** 合并
	 * @param obj 目标object
	 * @param tar 要被复制的tar
	 */
	public static  onComboObject(obj:Object,		tar:Object,		copy:boolean):void{
		if(obj==null || tar==null)	return;
		for(let key in tar){
			if(tar[key]==null){continue;}
			if(obj[key]==null || Tool_Function.isTypeOf(obj[key],Number) == false || Tool_Function.isTypeOf(tar[key],Number)==false) {
				if (copy == false)    obj[key] = tar[key];
				else                   obj[key] = this.CopyF(tar[key]);
			}else{
				obj[key] += tar[key];
			}
		}
	}

	public static onClearObj(obj:Object):void{
		if(obj==null)return;
		for(var key in obj){
			obj[key]=this.destroyF_One(obj[key]);
			delete obj[key];
		}
	}

	public static ColorFilterType_gray:string="灰度";
	public static ColorFilterType_light:string="亮度";
	public static ColorFilterType_fanse:string="反色";
	public static ColorFilterType_color:string="颜色";
	public static addColorFilter(tar:starling.Sprite,	type:string,	val:any):any
	{
		var fil:laya.filters.ColorFilter;
		var matrix:Array<number>;
		if(type==this.ColorFilterType_gray)
		{
			if(val==null)val=0;
			matrix=[
				0.3086, 0.6094, 0.0820, 0, val, 
				0.3086,0.6094, 0.0820, 0, val, 
				0.3086, 0.6094, 0.0820, 0, val, 
				0,      0,      0,      1, 0
			];
		}
		else if(type==this.ColorFilterType_light)
		{
			matrix=[
				1,0,0,0,val,
				0,1,0,0,val,
				0,0,1,0,val,
				0,0,0,1,0
			];
		}
		else if(type==this.ColorFilterType_fanse)
		{
			matrix=[
				-1,0,0,0,255,
				0,-1,0,0,255,
				0,0,-1,0,255,
				0,0,0,1,0
			];
		}
		else if(type==this.ColorFilterType_color)
		{
			matrix=[
				starling.Color.getRed(val)/255, 0.6094, 0.0820, 0, 0, 
				0.3086,starling.Color.getGreen(val)/255, 0.0820, 0, 0, 
				0.3086, 0.6094, starling.Color.getBlue(val)/255, 0, 0, 
				0,      0,      0,      1, 0
			];
		}
		else return null;
		if(tar.filters!=null){
			for(let i:number=tar.filters.length;i>=0;i--){
				if(tar.filters[i] instanceof laya.filters.ColorFilter){
					tar.filters.splice(i--,1);
				}
			}
		}
		fil =new laya.filters.ColorFilter(matrix);
		if(tar.filters==null)tar.filters	= [fil];
		else tar.filters.push(fil);
		return fil;
	}


	/**
	 * 缓存
	 * */
	public static getNewObjectFromPool(...arg:any[]):Object{
		var obj:Object;
		if(MyPools.getInstance().hasPool("Object") == false){
			obj=MyPools.getInstance().getFromPool("Object");
		}
		if(obj==null){
			obj={};
		}
		if(arg.length>0){
			for(var i:number=0;i<arg.length;i+=2){
				obj[arg[i]]=arg[i+1];
			}
		}
		return obj;
	}
	/**
	 * 手动清理后再调用，本方法不自动清理！！！！
	 * */
	public static returnObjectToPool(obj:Object):void{
		if(MyPools.getInstance().hasPool("Object") == false){
			return;
		}
		MyPools.getInstance().returnToPool("Object",obj);
	}


}
}