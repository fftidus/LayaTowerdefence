module com.MyClass.MyView{
import Sprite =starling.Sprite;
import Handler=laya.utils.Handler;
import Tool_Function=com.MyClass.Tools.Tool_Function;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class LoadingView extends Sprite{
	private sprBack:Sprite;
	private bar:com.MyClass.Tools.ProgressBar;
	private mt:MyViewTXController;
	private all:number;
	private now:number;
	private picBack:Sprite;
	public lastPer:number=0;
	public nextPer:number;
	public per:number=0;
	//自动文本
	private tf:starling.TextField;
	
	public	static NeedLoadBackPic:boolean=true;
	public static ArrTips:Array<any>;

	constructor(_all:number, id:number=0){
		super();
		this.all= _all;
		var picUrl:string;
		LayerStarlingManager.getInstence().LayerTop.addChild(this);
		this.sprBack	=MySourceManager.getInstance().getObjFromSwf(Global.SWF_Default,"spr_Loading");
		if(this.sprBack!=null){
			this.addChild(this.sprBack);
			for(let i:number=0;i<this.sprBack.numChildren;i++){
				let childone:any =this.sprBack.getChildAt(i);
				if(childone.name && childone.name.indexOf("进度条_")==0){
					this.bar=new com.MyClass.Tools.ProgressBar();
					if(childone.name=="进度条_s"){
						this.bar.initScaling(childone);
					}else if(childone.name =="进度条_m"){
						this.bar.initMaskImage(childone);
					}else if(childone.name=="进度条_q"){
						this.bar.initQuadSection(childone);
					}
					break;
				}
			}
			if(LoadingView.NeedLoadBackPic){
				picUrl="res/LoadBack_"+id+".jpg";
				let imgtouming:any =this.sprBack.getChildAt(0);
				this.picBack = new Sprite();
				this.picBack.addChild(imgtouming);
				this.sprBack.addChildAt(this.picBack,0);
				this.picBack.addChild(new Laya.Image(picUrl));
			}
			this.mt=new MyViewTXController(this.sprBack);
			Config.mStage.addChild(this);
		}
		else{//没有SWF_Default
			if(LoadingView.NeedLoadBackPic){
				picUrl="res/LoadBack_"+id+".jpg";
				this.picBack = new Sprite();
				this.addChild(this.picBack);
				this.picBack.loadImage(picUrl);
			}
			this.tf=com.MyClass.Tools.Tool_Textfield.newTextfield(100,30,"",null,25,0xFFFFFF,null,"中");
			this.addChild(this.tf);
			this.tf.x = (Config.stageScaleInfo["屏幕w"] - 100)/2;
			this.tf.y = (Config.stageScaleInfo["屏幕h"] - 30)/2;
		}
		if(Config.TypeFit==2){
			if(this.sprBack){
				com.MyClass.Tools.Tool_ViewFit.onWindowFitScreen(this.sprBack,4.2);
			}
			else if(this.picBack){
				com.MyClass.Tools.Tool_ViewFit.onWindowFitScreen(this.picBack,0);
			}
		}
		MainManager.getInstence().MEM.addListenF("加载进度",Handler.create(this,this.setNowper,null,false));
		this.now	= this.all+1;
		this.setNowper();
	}
	public noAutoProgress():void{
		MainManager.getInstence().MEM.removeListenF("加载进度",this.setNowper);
	}
	/** 直接设置进度：值=0~100 */
	public setPer(val:number):void{
		this.per =val;
		if(this.bar){
			this.bar.ratio =val * 0.01;
		}
		if(this.mt){
			this.mt.setText("tx_进度",this.per+ "%");
		}
		if(this.tf){
			this.tf.text=this.per+"%";
		}
	}
	private setNowper(val:any = null):void
	{
		if(this.now <= 0)	return;
		if(typeof val == "number"){
			this.per =this.lastPer + (this.nextPer - this.lastPer) * val;
			if(this.bar){
				this.bar.ratio =(this.all - this.now) / this.all;
			}
			if(this.mt){
				this.mt.setText("tx_进度",this.per+ "%");
			}
			if(this.tf){
				this.tf.text=this.per+"%";
			}
			return;
		}
		this.now--;
		this.lastPer=this.per;
		if(this.all > 0)
		{
			this.per=Tool_Function.onForceConvertType((this.all - this.now) * 100 / this.all + "");//55.22
			this.nextPer=Tool_Function.onForceConvertType((this.all -this.now+1) * 100 / this.all +"");
			if(this.bar){
				this.bar.ratio =(this.all - this.now) / this.all;
			}
			if(this.mt){
				this.mt.setText("tx_进度",this.per+ "%");
			}
			if(this.tf){
				this.tf.text=this.per+"%";
			}
		}
		else
		{
			this.per=100;
			this.nextPer=100;
			if(this.bar){
				this.bar.ratio =1;
			}
			if(this.mt)this.mt.setText("tx_进度", "100%");
			if(this.tf){
				this.tf.text="100%";
			}
		}
	}
	
	public destroyF():void
	{
		MainManager.getInstence().MEM.removeListenF("加载进度",this.setNowper);
		this.removeFromParent();
		this.mt=Tool_ObjUtils.destroyF_One(this.mt);
		this.tf=Tool_ObjUtils.destroyF_One(this.tf);
		if(this.picBack){
			this.picBack.removeFromParent();
			this.picBack=null;
		}
	}
	
	
}
}