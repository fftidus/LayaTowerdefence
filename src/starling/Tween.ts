module starling{
import Handler=laya.utils.Handler;
export class Tween{
	public tarObj:any;
	public time:number;
	public tranType:any;
	public info:Object ={};
	public onComplete:Handler;
	public onCompleteArgs:Array<any>;
	constructor(tar:any,	_time:number,		tran:any ="linear"){
		this.tarObj=tar;
		this.time=_time;
		this.tranType=tran;
	}
	public moveTo(endx:number,endy:number):void{
		this.info["x"]=endx;
		this.info["y"]=endy;
	}
	public fadeTo(enda:Number):void{
		this.info["alpha"]=enda;
	}
	public scaleTo(ends:Number):void{
		this.info["scaleX"]=ends;
		this.info["scaleY"]=ends;
	}
	/** 线性 */
	public static LINEAR:string = "linear";

	/** 皮球弹 */
	public static BOUNCE_IN:string="bounceIn";
	/** 皮球弹 */
	public static BOUNCE_OUT:string="bounceOut";
	/** 皮球弹 */
	public static BOUNCE_IN_OUT:string="bounceInOut";

	/** 先回弹 */
	public static EASE_IN:string = "easeIn";
	/** 超过再回来 */
	public static EASE_OUT:string = "easeOut";
	/** 开始结束都超过 */
	public static EASE_IN_OUT:string = "easeInOut";
	
	/** 加速 */
	public static STRONG_In:string="strongOut";
	/** 减速 */
	public static STRONG_In_Out:string="strongInOut";
}
}