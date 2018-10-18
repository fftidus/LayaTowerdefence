module com.MyClass.Tools{
import Sprite=starling.Sprite;
export class MyScoll extends starling.Sprite{

	private	Layer:Sprite;
	private	Mc_slide:Sprite
	private	Img_back:any;
	private	Img_up:any;
	private	Mc_Area:any;
	
	private MinHeight:number;
	private	NowHeight:number;
	
	private	H_Area:number;
	private	MaxY:number;
	private	AllNum:number;
	private	CanNum:number;
	private	NowNum:number	= 0;
	private Canv:Sprite;
	constructor(mc:starling.Sprite){
		super();
		this.visible=false;
		if(mc==null){
			return;
		}
		if(mc.parent)
		{
			this.x	= mc.x;
			this.y	= mc.y;
			mc.parent.addChildAt(this,mc.parent.getChildIndex(mc));
			mc.x	= 0;
			mc.y	= 0;
		}
		this.addChild(mc);
		this.Mc_slide	= mc.getChildByName("_滑块")as Sprite;
		this.Mc_Area	= mc.getChildByName("_区域");
		this.Img_back= this.Mc_slide.getChildByName("_back");
		this.Img_up	= this.Mc_slide.getChildByName("_up");
		this.Layer	= new Sprite();
		this.Layer.x	= this.Mc_slide.x;
		this.Mc_slide.x= 0;
		mc.addChildAt(this.Layer,mc.getChildIndex(this.Mc_slide));
		this.Layer.addChild(this.Mc_slide);
		
		var msy:number	= mc.scaleY;
		mc.scaleY		= 1;
		this.H_Area			= this.Mc_Area.height * msy;
		this.Mc_Area.scaleY	*= msy;
		this.MinHeight		= this.Img_back.height;
		
		this.Canv=new Sprite();
		this.Canv.graphics.drawRect(-5,0,this.Mc_slide.width+5,this.H_Area,"#ff0000");
		this.Layer.mask=this.Canv;
	}

	public init(all:number,	can:number):void
	{
		this.AllNum	= all;
		this.CanNum	= can;
		if(this.AllNum == 0)
		{
			this.visible	= false;
		}
		else
		{
			this.visible	= true;
			var per:number	= can/(all+can);
			if(per > 1)	per	= 1;
			this.changeSlideHeight(this.H_Area * per);
			this.MaxY	= this.H_Area - this.NowHeight;
		}
		this.changeNow(0);
	}
	
	public changeNow(now:number):void
	{
		if(this.AllNum == 0)	return;
		this.NowNum	= now;
		this.showNowF();
	}
	
	private showNowF():void
	{
		if(this.Mc_slide==null)return;
		if(this.AllNum == 0)	this.Mc_slide.y	= 0;
		else			this.Mc_slide.y	= this.MaxY * this.NowNum / this.AllNum;
	}
	
	private changeSlideHeight(h:number):void
	{
		if(this.Mc_slide==null)return;
		if(h < this.MinHeight)	h	= this.MinHeight;
		this.Img_back.height	= h;
		this.NowHeight		= h;
		if(this.Img_up)	this.Img_up.y		= (h - this.Img_up.height)>>1;
	}
	
	public autoRemove():void
	{
		this.on(laya.events.Event.REMOVED,this,this.destroyF);
	}
	
	public destroyF(e:any =null):void
	{
		this.Canv.destroy();
		this.removeFromParent(true);
	}
	
}
}