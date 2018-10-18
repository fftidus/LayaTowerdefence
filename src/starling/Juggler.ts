module starling{
import Tool_Function=com.MyClass.Tools.Tool_Function;
import Handler=laya.utils.Handler;
export class Juggler{
	private static instance:Juggler;
	public static getInstance():Juggler{
		if(this.instance==null)this.instance=new Juggler();
		return this.instance;
	}
	constructor(){
	}

	private countID:number=1;
	private dic_ids:Dictionary =new Dictionary();
	
	public delayCall(f:any ,time:number,...arg):void{
		if(this.dic_ids.indexOf(f) == -1){
			var arr:Array<any>=[f];
			if(arg.length > 0){
				arr=arr.concat(arg);
			}
			this.dic_ids.set(this.countID,arr);
			Laya.timer.once(time * 1000,this,this.onTimerF,[this.countID++],false);
		}
	}
	
	private onTimerF(id:number):void{
		if(this.dic_ids.get(id)!=null){
			var arr:Array<any> =this.dic_ids.get(id);
			this.dic_ids.remove(id);
			var f:any =arr.shift();
			Tool_Function.onRunFunction(f,arr);
		}else{
//				trace("已被清理");
		}
	}
	
	public removeDelayedCalls(f:any):void{
		for(var i:number=0;i<this.dic_ids.keys.length;i++){
			var arr:Array<any> =this.dic_ids.get(this.dic_ids.keys[i]);
			var fun =arr[0]
			if(Tool_Function.compareHandlers(fun,f)==true){
				this.dic_ids.remove(this.dic_ids.keys[i]);
				if(fun instanceof Handler)(fun as Handler).clear();
				i--;
			}
			if(f instanceof Handler)(f as Handler).clear();
		}
	}
	
	
	public add(t:starling.Tween):void{
		//生成laya的tween并自动开始
		var f:any =null;
		if(t.tranType!=null && typeof(t.tranType) != "number"){
			f=t.tranType;
		}
		else if(t.tranType==null || t.tranType=="linear"){
			f=laya.utils.Ease.linearNone;
		}
		else if(t.tranType==Tween.EASE_IN){
			f=	laya.utils.Ease.backIn;
		}
		else if(t.tranType==Tween.EASE_OUT){
			f=	laya.utils.Ease.backOut;
		}
		else if(t.tranType==Tween.EASE_IN_OUT){
			f= laya.utils.Ease.backInOut;
		}
		else if(t.tranType==Tween.BOUNCE_IN){
			f= laya.utils.Ease.bounceIn;
		}
		else if(t.tranType==Tween.BOUNCE_OUT){
			f= laya.utils.Ease.bounceOut;
		}
		else if(t.tranType==Tween.BOUNCE_IN_OUT){
			f= laya.utils.Ease.bounceInOut;
		}
		else if(t.tranType==Tween.STRONG_In){
			f= laya.utils.Ease.strongIn;
		}
		else if(t.tranType==Tween.STRONG_In_Out){
			f= laya.utils.Ease.strongInOut;
		}
		var comp:Handler;
		if(t.onComplete != null){
			comp=t.onComplete;
			if(t.onCompleteArgs!=null){
				comp.args =t.onCompleteArgs;
			}
		}
		laya.utils.Tween.to(t.tarObj,t.info,t.time * 1000,f,comp);
	}
	public remove(t:any):void{
		if(Tool_Function.isTypeOf(t,starling.Tween)){
			//laya的tween完成后自动删除
		}
	}
}
}