module com.MyClass.MyView{
import Sprite =starling.Sprite;
import Handler=laya.utils.Handler;
import SwfSprite=com.MyClass.MySwf.SwfSprite;
import Tool_Function=com.MyClass.Tools.Tool_Function;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class MyViewAllCompsController{
	protected sprBack:Sprite;
	public MT:MyViewTXController;
	public MBC:MyViewBtnController;
	public MSB:MyViewSelectBtnController;
	public MS:MyViewSlideMCs;
	public MNum:MyViewNumsController;
	public MPM:MyViewPicsController;
	public childrens:Object;//子类的控件
	
	public Fun_mbc_click:Handler;
	public Fun_mbc_down:Handler;
	public Fun_mbc_up:Handler;
	
	public Fun_msb_click:Handler;
	constructor(spr:Sprite,	needChildren:boolean=false){
		this.sprBack=spr;
		for(var i:number=0;i<spr.numChildren;i++){
			var one:any =spr.getChildAt(i);
			if(one.name == null || one.name.length==0){continue;}
			if(one.name.indexOf("tx_")==0 || one.name.indexOf("txi_")==0){
				this.init_mt();
				continue;
			}
			if(one.name.indexOf("btn_")==0){
				this.init_mbc();
				continue;
			}
			if(one.name.indexOf("SBtn_")==0){
				this.init_msb();
				continue;
			}
			if(one.name.indexOf("slide_")==0){
				this.init_ms();
				continue;
			}
			if(one.name.indexOf("num_")==0){
				this.init_mnum();
				continue;
			}
			if(one.name.indexOf("pic_")==0){
				this.init_mpm();
				continue;
			}
			if(needChildren==true && one.name != null && Tool_Function.isTypeOf(one,Sprite)){
				this.initChildComp(one);
			}
		}
	}

	protected initChildComp(one:any):void{
		if(this.childrens==null)this.childrens={};
		this.childrens[one.name] =new MyViewAllCompsController(one,false);//默认只有一层
	}
	
	protected init_mt():void{
		if(this.MT!=null)return;
		var useMyt:boolean=false;
		if(this.sprBack instanceof SwfSprite && (this.sprBack as SwfSprite).metaData &&  (this.sprBack as SwfSprite).metaData["vc"] 
			&&  (this.sprBack as SwfSprite).metaData["vc"]["mt"] && (this.sprBack as SwfSprite).metaData["vc"]["mt"]["mytext"]==true){
			useMyt=true;
		}
		this.MT=new  MyViewTXController(this.sprBack,useMyt);
	}
	
	protected init_mbc():void{
		if(this.MBC!=null)return;
		this.MBC=new  MyViewBtnController(this.sprBack,Handler.create(this,this.mbc_ClickF,null,false)
			,Handler.create(this,this.mbc_DownF,null,false),Handler.create(this,this.mbc_UpF,null,false));
	}
	protected mbc_ClickF(btn:string):void{
		Tool_Function.onRunFunction(this.Fun_mbc_click,btn);
	}
	protected mbc_DownF(btn:string):void{
		Tool_Function.onRunFunction(this.Fun_mbc_down,btn);
	}
	protected mbc_UpF(btn:string):void{
		Tool_Function.onRunFunction(this.Fun_mbc_up,btn);
	}
	
	protected init_msb():void{
		if(this.MSB!=null)return;
		this.MSB=new  MyViewSelectBtnController(this.sprBack,Handler.create(this,this.msb_ClickF,null,false));
	}
	protected msb_ClickF(sbtn:string,btn:string):void{
		Tool_Function.onRunFunction(this.Fun_msb_click,sbtn,btn);
	}
	
	protected init_ms():void{
		if(this.MS!=null)return;
		this.MS=new  MyViewSlideMCs(this.sprBack);
	}
	
	protected init_mnum():void{
		if(this.MNum!=null)return;
		this.MNum=new  MyViewNumsController(this.sprBack);
	}

	protected init_mpm():void{
		if(this.MPM!=null)return;
		this.MPM=new MyViewPicsController(this.sprBack);
	}
	
	public destroyF():void{
		this.MT=Tool_ObjUtils.destroyF_One(this.MT);
		this.MBC=Tool_ObjUtils.destroyF_One(this.MBC);
		this.MSB=Tool_ObjUtils.destroyF_One(this.MSB);
		this.MS=Tool_ObjUtils.destroyF_One(this.MS);
		this.MNum=Tool_ObjUtils.destroyF_One(this.MNum);
		this.MPM=Tool_ObjUtils.destroyF_One(this.MPM);
		this.childrens=Tool_ObjUtils.destroyF_One(this.childrens);
		this.Fun_mbc_click=Tool_ObjUtils.destroyF_One(this.Fun_mbc_click);
		this.Fun_mbc_down=Tool_ObjUtils.destroyF_One(this.Fun_mbc_down);
		this.Fun_mbc_up=Tool_ObjUtils.destroyF_One(this.Fun_mbc_up);
	}
}
}