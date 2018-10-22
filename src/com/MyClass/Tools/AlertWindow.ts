module com.MyClass.Tools{
import MySourceManagerOne=com.MyClass.MySourceManagerOne;
import BTNControllerStarling=com.MyClass.MyView.BTNControllerStarling;
export class AlertWindow{
	public static showF(str:string,viewText:Object,fok:any = null,okVal:any = null,
									 haveno:boolean = false,fno:any = null,noVal:any = null):void
	{
		if(this.Instance != null)
		{
			this.Arr_Waite.push([str,viewText,fok,okVal,haveno,fno,noVal]);
			return;
		}
		this.Instance	= new AlertWindow(str,viewText,fok,okVal,haveno,fno,noVal);
	}
	public static showSimpleF(str:string,viewText:Object,fok:any = null,okVal:any = null,
										haveno:boolean = false,fno:any = null,noVal:any = null,
										mustOrg:boolean	= true,noAni:boolean=false):void
	{
		var a:AlertWindow	= new AlertWindow(str,viewText,fok,okVal,haveno,fno,noVal,mustOrg,noAni);
		a.simple	= true;
	}
	public static clearF():void
	{
		this.Arr_Waite=[];
		if(this.Instance)
		{
			this.Instance.clickF(-1);this.Instance=null;
		}
	}
	
	private static Instance:AlertWindow;
	private static Arr_Waite:Array<any>	= [];
	
	private	MSO:MySourceManagerOne;
	private	Spr:starling.Sprite;
	private	BC2:BTNControllerStarling;
	private Layer2:starling.Sprite;
	
	private BtnOK:any;
	private BtnNO:any;
	private FOK:any;
	private FNO:any;
	private ValOK:any;
	private ValNO:any;
	private HaveNO:boolean;
	private Busy:boolean	= false;
	public  simple:boolean	= false;
	constructor(str:string,viewText:Object,fok:any = null,okVal:any = null,
							  haveno:boolean = false,fno:any = null,noVal:any = null,
							  mustOrg:boolean=false,noAni:boolean=false){
		com.MyClass.MyView.MyTextInput.onHideF(true);
		this.FOK	= fok;	this.ValOK	= okVal;
		this.FNO	= fno;	this.ValNO	= noVal;
		this.HaveNO	= haveno;
		this.initStarlingVer(str,viewText,noAni);
	}

	private tover():void
	{
		this.Busy	= false;
	}
	
	public clickF(n:number):void
	{
		if(this.Busy)	return;
		com.MyClass.MyView.MyTextInput.onHideF(false);
		this.Layer2=Tool_ObjUtils.destroyF_One(this.Layer2);
		this.Spr=Tool_ObjUtils.destroyF_One(this.Spr);
		if(this.BC2)
		{
			this.BC2.destroyF();this.BC2=null;
		}
		this.MSO=null;
		if(n == 0 && this.FOK != null)
		{
			if(this.ValOK!=null)	Tool_Function.onRunFunction(this.FOK,this.ValOK);
			else						Tool_Function.onRunFunction(this.FOK);
		}
		else if(n == 1 && this.FNO != null)
		{
			if(this.ValNO!=null)	Tool_Function.onRunFunction(this.FNO,this.ValNO);
			else						Tool_Function.onRunFunction(this.FNO);
		}
		this.FOK=null;
		this.FNO=null;
		if(this.simple == false)
		{
			AlertWindow.Instance	= null;
			if(AlertWindow.Arr_Waite.length > 0)
			{
				var arr:Array<any>	= AlertWindow.Arr_Waite[0];
				AlertWindow.Arr_Waite.splice(0,1);
				AlertWindow.showF(arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6]);
			}
		}
	}
	
	//-------------------------------------------------------------------------
	private initStarlingVer(str:string,viewText:Object,noAni:boolean):void
	{
		this.MSO		= new MySourceManagerOne();
		this.Spr		= this.MSO.getSprFromSwf("SWF_Default","spr_AlertWin");
		if(this.Spr==null)
		{
			this.clickF(0);
			return;
		}
		this.Layer2	= new starling.Sprite();
		com.MyClass.MyView.LayerStarlingManager.instance.LayerTop.addChild(this.Layer2);
		if(Config.TypeFit==2){
			var sx:Number=Config.deviceWidth/Config.stageW;
			var sy:Number=Config.deviceHeight/Config.stageH;
			if(sx < sy){//pad2类似方形屏幕
				this.Layer2.scaleX =Config.stageScaleInfo["屏幕w"] / Config.stageW;
			}else if(sx > sy){//宽屏
				this.Layer2.scaleY =Config.stageScaleInfo["屏幕h"] / Config.stageH;
			}
		}
		this.Layer2.addChild(this.Spr);
		
		var TX:laya.display.Text;
		TX	= this.Spr.getChildByName("t1")as laya.display.Text;
		TX.text	= str;
		if(viewText && viewText["title"])
		{
			TX	= this.Spr.getChildByName("tx_title")as laya.display.Text;
			TX.text	= viewText["title"];
		}
		this.BtnOK	= this.Spr.getChildByName("b1");
		this.BtnNO	= this.Spr.getChildByName("b2");
		
		var dicImg:Object =Tool_ObjUtils.getNewObjectFromPool();
		var i:number=0;
		if(this.BtnOK instanceof com.MyClass.MySwf.SwfMovieClip){
			for(var j:number=0;j<2;j++){
				(this.BtnOK as com.MyClass.MySwf.SwfMovieClip).gotoAndStop(j);
				i=0;
				while(i<this.BtnOK.numChildren){
					var cone:any =this.BtnOK.getChildAt(i);
					if(cone.name && cone.name.indexOf("_img")==0){
						if(dicImg["ok"]==null)dicImg["ok"]=Tool_ArrayUtils.getNewArrayFromPool();
						dicImg["ok"].push(cone);
					}
					i++;
				}
			}
		}else{
			while(i<this.BtnOK.numChildren){
				cone =this.BtnOK.getChildAt(i);
				if(cone.name && cone.name.indexOf("_img")==0){
					if(dicImg["ok"]==null)dicImg["ok"]=Tool_ArrayUtils.getNewArrayFromPool();
					dicImg["ok"].push(cone);
				}
				i++;
			}
		}
		if(this.BtnNO instanceof com.MyClass.MySwf.SwfMovieClip){
			for(j=0;j<2;j++){
				(this.BtnNO as com.MyClass.MySwf.SwfMovieClip).gotoAndStop(j);
				i=0;
				while(i<this.BtnNO.numChildren){
					cone =this.BtnNO.getChildAt(i);
					if(cone.name && cone.name.indexOf("_img")==0){
						if(dicImg["no"]==null)dicImg["no"]=Tool_ArrayUtils.getNewArrayFromPool();
						dicImg["no"].push(cone);
					}
					i++;
				}
			}
		}else{
			while(i<this.BtnNO.numChildren){
				cone =this.BtnNO.getChildAt(i);
				if(cone.name && cone.name.indexOf("_img")==0){
					if(dicImg["no"]==null)dicImg["no"]=Tool_ArrayUtils.getNewArrayFromPool();
					dicImg["no"].push(cone);
				}
				i++;
			}
		}
		
		TX	= this.BtnOK.getChildByName("tx_name")as laya.display.Text;
		if(viewText && viewText["ok"]){
			TX.text	= viewText["ok"];
			if(dicImg["ok"]){
				for(i=0;i<dicImg["ok"].length;i++){
					var childarr:Array<any> =dicImg["ok"];
					while(childarr.length >0){
						var childone:any =childarr.shift();
						if(this.BtnOK instanceof com.MyClass.MySwf.SwfMovieClip){
							(this.BtnOK as com.MyClass.MySwf.SwfMovieClip).removeChildFromAllFrame(childone.classLink);
						}else{
							childone=Tool_ObjUtils.destroyF_One(childone);
						}
					}
				}
			}
		}
		else if(dicImg["ok"] != null){
			TX=Tool_ObjUtils.destroyF_One(TX);
		}
		else	TX.text	= "确定";
		
		
		if(this.HaveNO == false)
		{
			this.BtnOK.x	+= (this.BtnNO.width + this.BtnNO.x - this.BtnOK.x)/2 - this.BtnOK.width/2;
			this.BtnNO	= Tool_ObjUtils.destroyF_One(this.BtnNO);
			this.BC2= new BTNControllerStarling(this.Spr,[this.BtnOK],laya.utils.Handler.create(this,this.clickF));
		}
		else
		{
			TX	= this.BtnNO.getChildByName("tx_ok")as laya.display.Text;
			if(viewText && viewText["no"]){
				TX.text	= viewText["no"];
				if(dicImg["no"]){
					for(i=0;i<dicImg["no"].length;i++){
						childarr =dicImg["no"];
						while(childarr.length >0){
							childone =childarr.shift();
							if(this.BtnNO instanceof com.MyClass.MySwf.SwfMovieClip){
								(this.BtnNO as com.MyClass.MySwf.SwfMovieClip).removeChildFromAllFrame(childone.classLink);
							}else{
								childone=Tool_ObjUtils.destroyF_One(childone);
							}
						}
					}
				}
			}
			else if(dicImg["no"] != null){
				TX=Tool_ObjUtils.destroyF_One(TX);
			}
			else	TX.text	= "取消";
			this.BC2		= new BTNControllerStarling(this.Spr,[this.BtnOK,this.BtnNO],laya.utils.Handler.create(this,this.clickF));
		}
		this.BC2.typeEventMop="触发禁止";
		if(noAni)	return;
		var eff:com.MyClass.Effect.MyEffect_WindowAppear_Scale	= new com.MyClass.Effect.MyEffect_WindowAppear_Scale(this.Spr,laya.utils.Handler.create(this,this.tover));
		this.Busy	= false;
	}
	
}
}