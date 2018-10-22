module com.MyClass.Tools{
export class Tool_ArrayUtils{
	/**
	 * 数组的缓存
	 * */
	public static getNewArrayFromPool(...arg):Array<any>{
		var arr:Array<any>;
		if(MyPools.getInstance().hasPool("Array") == false){
			arr=MyPools.getInstance().getFromPool("Array");
		}
		if(arr==null){
			arr=[];
		}
		if(arg.length>0){
			var i:number;
			for(i=0;i<arg.length;i++){
				arr[i]=arg[i];
			}
		}
		return arr;
	}
	public static returnArrayToPool(arr:Array<any>):void{
		if(arr==null){return;}
		if(MyPools.getInstance().hasPool("Array") == false){
			return;
		}
		arr.length=0;
		MyPools.getInstance().returnToPool("Array",arr);
	}


	public static copyArr(arr:Array<any>):Array<any>
	{
		if(arr==null)return null;
		var out:Array<any>=[];
		for(var i:number=0;i<arr.length;i++)
		{
			out[i]=Tool_ObjUtils.CopyF(arr[i]);
		}
		return out;
	}
	
	public static isEqual(arr1:Array<any>,	arr2:Array<any>):boolean
	{
		if(arr1==null && arr2==null)	return true;
		if(arr1==null || arr2==null)	return false;
		if(arr1.length != arr2.length)	return false;
		for(var i:number=0; i<arr1.length;i++)
		{
			if(Tool_ObjUtils.isEqual(arr1[i],arr2[i])==false)	return false;
		}
		return true;
	}
	/** 删除重复数字 **/
	public static onRemoveLoopNumber(arr:Array<any>):void
	{
		var dic:Object ={};
		for(var i:number=0;i<arr.length;i++)
		{
			if(arr[i] instanceof Number)
			{
				if(dic[arr[i]]==true)arr.splice(i--,1);
				else	dic[arr[i]]=true;
			}
		}
	}
	/** 从数组中取一个随机值 */
	public static getRadomOneFromArray(arr:Array<any>):any{
		let i:number =Tool_Function.onForceConvertType(Math.random() * arr.length);
		return arr[i];
	}
}
}