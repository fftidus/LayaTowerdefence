module com.MyClass.Tools{
export class Tool_DictionUtils{
	public static onGetDicFromObj(obj:Object):Dictionary
	{
		var dic:Dictionary	= new Dictionary();
		this.onCheckAllDic(obj,function (key:any,val:any):void{
			dic.set(key,val);
		});
		return dic;
	}
	/** key和value都复制 */
	public static copyDic(dic:any):Dictionary
	{
		if(dic==null)	return null;
		var out:Dictionary	= new Dictionary();
		for(var i:number=0;i<dic.keys.length;i++)
		{
			var m:any	= Tool_ObjUtils.CopyF(dic.keys[i]);
			out.set(m,Tool_ObjUtils.CopyF(dic.get(dic.keys[i])));
		}
		return out;
	}
	/** 不复制key */
	public static copySimple(dic:any):Dictionary
	{
		if(dic==null)	return null;
		var out:Dictionary	= new Dictionary();
		for(var i:number=0;i<dic.keys.length;i++)
		{
			var m:any	= dic.keys[i];
			out.set(m,Tool_ObjUtils.CopyF(dic.get(dic.keys[i]),true));
		}
		return out;
	}
	
	public static isEqual(dic1:any , dic2:any):boolean
	{
		var dicHave:Dictionary=new Dictionary();
		for(var n in dic1)
		{
			dicHave[n]=true;
			if(Tool_ObjUtils.isEqual(dic1[n],dic2[n])==false)return false;
		}
		for(n in dic2)
		{
			if(dicHave[n]==true)	continue;
			return false;
		}
		return true;
	}
	
	public static getKeySort(dic:any):Array<any>
	{
		var arrKey:Array<any>=[];
		if(dic instanceof Dictionary){
			for(var i:number=0;i<dic.keys.length;i++)
			{
				arrKey.push(dic.keys[i]);
			}
		}else{
			for(var key in dic)
			{
				arrKey.push(key);
			}
		}
		arrKey.sort();
		return arrKey;
	}
	
	public static onCheckAllDic(dic:any,	f:any):void{
		if(dic instanceof Dictionary){
			for(var i:number=0;i<dic.keys.length;i++)
			{
				var key =dic.keys[i];
				var tar =dic.get(key);
				Tool_Function.onRunFunction(f,[key,tar]);
			}
		}else{
			for(key in dic)
			{
				Tool_Function.onRunFunction(f,[key,dic[key]]);
			}
		}
	}
}
}