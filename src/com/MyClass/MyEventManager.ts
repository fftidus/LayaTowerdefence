module com.MyClass{
export class MyEventManager{
	private DIC_Listener:Object={};
	private isEventing:boolean=false;
	private arrWaite:Array<any>=[];
	public constructor() {
	}

	public dispatchF(type:string,val:any =null):void
	{
		if(this.isEventing==true){
			this.arrWaite.push(["dispatch",type,val]);
			return;
		}
		this.isEventing=true;
		if(this.DIC_Listener[type] != null)
		{
			var dic:Dictionary	= this.DIC_Listener[type];
			for(let i:number=0;i<dic.keys.length;i++)
			{
				let id =dic.keys[i];
				var arr2:Array<any>	= dic.get(id);
				var f:any	= arr2[0];
				if(val!=null && arr2[2]!=null){
					com.MyClass.Tools.Tool_Function.onRunFunction(f,arr2[2],val);
				}else if(val!=null){
					com.MyClass.Tools.Tool_Function.onRunFunction(f,val);
				}else if(arr2[2]!=null){
					com.MyClass.Tools.Tool_Function.onRunFunction(f,arr2[2]);
				}else{
					com.MyClass.Tools.Tool_Function.onRunFunction(f);
				}
				if(arr2[1] == true){
					this.isEventing=false;
					this.removeListenF(type,f);
					this.isEventing=true;
				}
			}
		}
		this.isEventing=false;
		while(this.arrWaite.length>0){
			var arr:Array<any>=this.arrWaite.shift();
			var waiteType:string=arr.shift();
			if(waiteType=="add"){
				this.addListenF(arr[0],arr[1],arr[2],arr[3]);
			}else if(waiteType=="remove"){
				this.removeListenF(arr[0],arr[1]);
			}else if(waiteType=="dispatch"){
				this.dispatchF(arr[0],arr[1]);
				break;//下一个dispatch会再处理
			}
		}
	}
	
	public addListenF(type:string, fun:laya.utils.Handler,	val:any = null,onece:Boolean = false):void
	{
		if(this.isEventing==true){
			this.arrWaite.push(["add",type,fun,val,onece]);
			return;
		}
		var dic:Dictionary;
		if(this.DIC_Listener[type] == null)
		{
			dic	= new Dictionary();
			dic.set(fun,[fun,onece,val]);
			this.DIC_Listener[type]	= dic;
		}
		else
		{
			dic	= this.DIC_Listener[type];
			dic.set(fun,[fun,onece,val]);
		}
	}
	
	public removeListenF(type:string, fun:any):void
	{
		if(this.isEventing==true){
			this.arrWaite.push(["remove",type,fun]);
			return;
		}
		var dic:Dictionary;
		if(this.DIC_Listener[type] != null)
		{
			if(fun == null)
			{
				//删除所有事件
				delete this.DIC_Listener[type];
			}
			else
			{
				dic			= this.DIC_Listener[type];
				for(let i:number=0;i<dic.keys.length;i++){
					let fun2:laya.utils.Handler = dic.keys[i];
					if(com.MyClass.Tools.Tool_Function.compareHandlers(fun,fun2)==true){
						dic.remove(fun2);
						break;
					}
				}
			}
		}
	}
	
	public haveListener(type:string):number
	{
		var num:number=0;
		if(this.DIC_Listener[type] != null)
		{
			var dic:Dictionary=this.DIC_Listener[type];
			num =dic.keys.length;
		}
		return num;
	}
	
	public destroyF():void
	{
		for(var id in this.DIC_Listener)
		{
			this.removeListenF(id,null);
			delete this.DIC_Listener[id];
		}
	}
}
}