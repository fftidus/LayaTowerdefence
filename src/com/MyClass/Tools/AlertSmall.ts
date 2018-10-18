module com.MyClass.Tools{
import SwfMovieClip=com.MyClass.MySwf.SwfMovieClip;
import MyViewTXController=com.MyClass.MyView.MyViewTXController;
import MyMouseEventStarling=com.MyClass.MyView.MyMouseEventStarling;
import Handler=laya.utils.Handler;
export class AlertSmall{
	public static SWF:string;
	private static Vec_info:Array<any>;
	private static NowMC:AlertSmall;
	public static showF(str:string,clearOther:boolean=true,endFlag:any =null):void
	{
		if(clearOther==true)this.clearAllF();
		if(this.Vec_info == null)	this.Vec_info	= [];
		if(str != null)			this.Vec_info.push(str);
		this.nextF();
	}
	public static clearAllF():void
	{
		this.Vec_info=null;
		if(this.NowMC)this.NowMC.clickF(null);
	}
	private static removeF():void
	{
		this.NowMC	= null;
		this.nextF();
	}
	private static nextF():void
	{
		if(this.Vec_info == null)	return;
		if(this.NowMC != null)		return;
		if(this.Vec_info.length == 0)
		{
			this.Vec_info=null;return;
		}
		try{
			this.NowMC	= new AlertSmall(this.Vec_info[0]);
			this.Vec_info.shift();
			if(this.Vec_info.length == 0)	this.Vec_info	= null;
		}catch(e){
			this.Vec_info	= null;
		}
	}
	
	/*
	* 实例
	*/
	
	private INFO:string;
	private mcBack:SwfMovieClip;
	private mt:MyViewTXController;
	private mme:MyMouseEventStarling;
	constructor(str:string){
		this.INFO	= str;
		this.mcBack=MySourceManager.getInstance().getMcFromSwf("SWF_Default","mc_AlertSmall");
		if(this.mcBack==null){
			return;
		}
		com.MyClass.MyView.LayerStarlingManager.instance.LayerView.addChild(this.mcBack);
		this.mt=new  MyViewTXController(this.mcBack);
		this.mt.setText("tx_info","");
		this.mcBack.completeFunction =Handler.create(this,this.stopF);
		this.mcBack.loop=false;
		this.mcBack.play();
	}

	private stopF():void
	{
		if(this.mcBack==null)return;
		this.mcBack.stop();
		this.mt.setText("tx_info",this.INFO);
		this.mme=new MyMouseEventStarling(this.mcBack);
		this.mme.setValue("点击",Handler.create(this,this.clickF));
		
		MainManager.getInstence().add_delayFunction(Handler.create(this,this.clickF),com.MyClass.Config.playSpeedTrue * 2);
	}
	
	public clickF(e:any =null):void
	{
		if(this.mcBack==null)return;
		this.mcBack=Tool_ObjUtils.destroyF_One(this.mcBack);
		this.mt=Tool_ObjUtils.destroyF_One(this.mt);
		this.mme=Tool_ObjUtils.destroyF_One(this.mme);
		AlertSmall.removeF();
	}
	
}
}