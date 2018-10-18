module com.MyClass.Tools{
export class MyPools{
	private static instance:MyPools;
	public static getInstance():MyPools{
		if(this.instance==null)this.instance=new  MyPools();
		return this.instance;
	}
	
	private Dic:Object ={};
	private Dic_Max:Object ={};
	public constructor() {
	}
	/**
	 * 注册一个缓存池
	 * */
	public registF(Name:string,max:number=50):void{
		if(this.Dic[Name] != null){
			this.removeF(Name);
		}
		this.Dic[Name]=[];
		this.Dic_Max[Name]=max;
	}
	public hasPool(Name:string):Boolean{
		return this.Dic[Name]!=null;
	}
	/**
	 * 从缓存池中获取一个元素
	 * */
	public getFromPool(Name:string,...arg:any[]):any{
		if(this.Dic[Name]==null){
			return null;
		}
		if(this.Dic[Name].length == 0){
			return null;
		}
		return this.Dic[Name].shift();
	}
	/**
	* 还回一个
	* */
	public returnToPool(Name:string, one:any):void{
		if(this.Dic[Name]==null || this.Dic[Name].length >= this.Dic_Max[Name]){
			one=Tool_ObjUtils.destroyF_One(one);
			return;
		}
		this.Dic[Name].push(one);
	}
	
	/**
	 * 删除一个缓存池
	 * */
	public removeF(Name:string):void{
		if(this.Dic[Name] != null){
			Tool_ObjUtils.destroyF_One(this.Dic[Name]);
			delete this.Dic[Name];
		}
	}
	public destroyF():void{
		MyPools.instance=null;
		if(this.Dic==null){return;}
		for(var Name in this.Dic){
			this.removeF(Name);
		}
		this.Dic=null;
	}
}
}