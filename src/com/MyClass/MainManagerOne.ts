module com.MyClass{
import Handler=laya.utils.Handler;
import Tool_Function=com.MyClass.Tools.Tool_Function;
import Tool_ObjUtils =com.MyClass.Tools.Tool_ObjUtils;
export class MainManagerOne{
	private	MM:MainManager;
	private	Arr_EnterFrame:Array<any>	= [];
	private Arr_EnterSecond:Array<any>;
	private	Dic_Delay:Dictionary=new Dictionary();
	constructor(){
		this.MM	= MainManager._instence;
	}

	public addEnterFrameFun(fun:Handler):void
	{
		if(this.Arr_EnterFrame.indexOf(fun) == -1)
		{
			this.Arr_EnterFrame.push(fun);
			this.MM.addEnterFrameFun(fun);
		}
	}
	
	public removeEnterFrameFun(fun:any):void
	{
		var index:number=-1;
		for(var i:number=0;i<this.Arr_EnterFrame.length;i++){
			var f:any =this.Arr_EnterFrame[i];
			if(Tool_Function.compareHandlers(f,fun)==true){
				index=i;
			}
			if(index!=-1){break;}
		}
		if(index != -1)
		{
			this.Arr_EnterFrame.splice(index,1);
			this.MM.removeEnterFrameFun(fun);
		}
	}
	
	public addEnterSecondFun(fun:Handler):void{
		if(this.Arr_EnterSecond==null){
			this.Arr_EnterSecond=[];
			this.MM.addEnterFrameFun(Handler.create(this,this.enterF,null,false));
		}
		if(this.hasEnterSecondFunction(fun) == -1){
			this.Arr_EnterSecond.push([fun,0]);
		}
	}
	public removeEnterSecondFun(fun:any):void{
		if(this.Arr_EnterSecond==null){return;}
		var i:number;
		var l:number=this.Arr_EnterSecond.length;
		for(i=0;i<l;i++){
			if(this.Arr_EnterSecond[i]!=null && (this.Arr_EnterSecond[i][0]==fun || this.Arr_EnterSecond[i][0].method == fun)){
				this.Arr_EnterSecond[i]=Tool_ObjUtils.destroyF_One(this.Arr_EnterSecond[i]);
			}
		}
	}
	private hasEnterSecondFunction(fun:Handler):number{
		if(this.Arr_EnterSecond==null)return -1;
		var i:number;
		var l:number=this.Arr_EnterSecond.length;
		for(i=0;i<l;i++){
			if(this.Arr_EnterSecond[i]!=null && this.Arr_EnterSecond[i][0]==fun){
				return i;
			}
		}
		return -1;
	}
	private enterF():void{
		var i:number;
		var l:number;
		//----------------------------秒频事件-----------------------------------
		if(this.Arr_EnterSecond){
			l=this.Arr_EnterSecond.length;
			var count:number;
			for(i=0;i<l;i++){
				if(this.Arr_EnterSecond[i]!=null){
					count=this.Arr_EnterSecond[i][1]++;
					if(count >= Config.playSpeedTrue) {
						this.Arr_EnterSecond[i][1]=0;
						Tool_Function.onRunFunction(this.Arr_EnterSecond[i][0]);
					}
				}else{
					this.Arr_EnterSecond.splice(i--,1);
					l--;
				}
			}
		}
	}
	
	public add_delayFunction(fun:any,	delay:number,	val:any = null):void
	{
		this.remove_delayFunction(fun);
		var h:Handler=Handler.create(this,this.tmpFunction,[fun,val]);
		this.Dic_Delay.set(fun,h);
		this.MM.add_delayFunction(h,delay);
	}
	private tmpFunction(fun:any,val:any):void{
		Tool_Function.onRunFunction(fun,val);
	}
	
	public remove_delayFunction(f:any):void
	{
		if(this.Dic_Delay==null)return;
		var h:any =this.Dic_Delay.get(f);
		if(h==null)return;
		this.MM.remove_delayFunction(h);
		this.Dic_Delay.remove(f);
	}
	
	public destroyF():void
	{
		var i:number;
		for(i=0; i<this.Arr_EnterFrame.length; i++)
		{
			this.removeEnterFrameFun(this.Arr_EnterFrame[i--]);
		}
		this.Arr_EnterFrame=null;
		if(this.Dic_Delay){
			com.MyClass.Tools.Tool_DictionUtils.onCheckAllDic(this.Dic_Delay,function (key:any,val:any):void{
				this.remove_delayFunction(key);
			});
			this.Dic_Delay.clear();
		}
		this.Dic_Delay=null;
		if(this.Arr_EnterSecond){
			this.MM.removeEnterFrameFun(this.enterF);
		}
		this.Arr_EnterSecond=Tool_ObjUtils.destroyF_One(this.Arr_EnterSecond);
		this.MM=null;
	}
}
}