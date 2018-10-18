module com.MyClass.Tools{
export class TmpTween{
	private FunEnd:any;
	private endValues:Array<any>;
	private T:starling.Tween;
	constructor(t:starling.Tween,fend:any,arrvalue:Array<any>){
		this.T=t;
		this.FunEnd=fend;
		this.endValues=arrvalue;
		this.T.onComplete=laya.utils.Handler.create(this,this.onEndF);
		starling.Juggler.getInstance().add(this.T);
	}

	private onEndF():void{
		starling.Juggler.getInstance().remove(this.T);
		this.T=null;
		if(this.endValues)	Tool_Function.onRunFunction(this.FunEnd,this.endValues);
		else	Tool_Function.onRunFunction(this.FunEnd);
		this.FunEnd=null;
	}
}
}