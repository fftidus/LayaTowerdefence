module com.MyClass{
export class Config{
	public static FunRestart:any;
	public static mainClassInstance:any;
	public static PF:any;
	public static ClassFunction:any;
	public	static stageW:number=1136;
	public	static stageH:number=640;
	public	static deviceWidth:number;
	public	static deviceHeight:number;
	public	static stageRec:laya.maths.Rectangle;
	public	static stageScale:any;
	public	static stageScaleInfo:any;//适配方式2时的参数
	public	static playSpeedTrue:number= 60;
	public	static swfFPS:number=30;
	public	static frameMS:number;
	public	static SoundVol:number=0.5;
	public static mStage:laya.display.Stage;
	public static MainDevice:string="H5";
	public static Platform:string;
	public static TypeFit:number=2;
	public static DeviceInfos:any;
	public static VerMain:number=1;
	public static VerSecond:number=0;
	public static FunLog:laya.utils.Handler;
	
	public static Active:Boolean=true;
	public static OS:string;
	
	public static Set_pauseCMDonBack:Boolean=true;

	public static initF():void
	{
		if(this.stageW < this.stageH)Laya.stage.screenMode = "vertical";
		else Laya.stage.screenMode="horizontal";
		Laya.stage.scaleMode =laya.display.Stage.SCALE_NOBORDER;
		com.MyClass.MySourceManager.getInstance();
		console.log("屏幕大小："+Laya.Browser.clientWidth+":"+Laya.Browser.clientHeight);
		this.deviceWidth =Laya.Browser.clientWidth;
		this.deviceHeight =Laya.Browser.clientHeight;
		this.mStage.frameRate	= this.playSpeedTrue==60?"fast":"slow";
		this.frameMS= 1000 / this.playSpeedTrue;
		var sx:number=this.deviceWidth/this.stageW;
		var sy:number=this.deviceHeight/this.stageH;
		if(this.TypeFit==2){
			this.stageScale=sx>sy?sx:sy;
			this.stageScaleInfo={"屏幕w": this.deviceWidth / Config.stageScale,"屏幕h": this.deviceHeight /Config.stageScale};
			this.LogF("屏幕宽"+this.deviceWidth+"屏幕高"+this.deviceHeight+"，缩放="+this.stageScale
				+"，屏幕真实占用starling屏幕的：",this.stageScaleInfo);
		}
	}

	public static onThrowNewErrorF(mess:string):void{

	}

	public static LogF(...arg:any[]):void{
		if(arg.length==0)return;
		var str:string="";
		while(arg.length>0)
		{
			if(str.length>0)str+="  ";
			str+=this.toStringF(arg[0]);
			arg.shift();
		}
		console.log(str);
		if(this.FunLog){
			this.FunLog.runWith(str);
		}
	}
	public static toStringF(obj:any):string
	{
		var str:string="";
		if(typeof obj === "string" || typeof obj === "number" || obj == null || typeof obj === "boolean")str+=obj;
		else if(obj instanceof Array)
		{
			str+="[";
			for(var i:number=0;i<obj.length;i++)
			{
				if(i>0)str+=", ";
				str+=this.toStringF(obj[i]);
			}
			str+="]";
		}
		else if(obj instanceof laya.maths.Rectangle)
		{
			str+="RECT::{x="+obj.x+",y="+obj.y+",w="+obj.width+",h="+obj.height+"}";
		}
		else if(obj instanceof laya.maths.Point)
		{
			str+="POINT::{x="+obj.x+",y="+obj.y+"}";
		}
		else if(obj instanceof Dictionary || obj instanceof Object)
		{
			str+="{";
			i=0;
			for(var key in obj)
			{
				if(i>0)str+=", ";
				str+=this.toStringF(key)+"::"+this.toStringF(obj[key]);
				i++;
			}
			str+="}";
		}
		else
		{
			if(com.MyClass.Tools.Tool_ObjUtils.hasFunction(obj,"toString")==true){
				str+=com.MyClass.Tools.Tool_Function.getLastClassName(obj)+"->"+obj.toString();
			}else{
				str+="实例::"+com.MyClass.Tools.Tool_Function.getLastClassName(obj)+"-->"+obj;
			}
		}
		return str;
	}

}
}