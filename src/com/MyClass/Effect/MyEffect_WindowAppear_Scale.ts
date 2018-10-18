module com.MyClass.Effect{
import Handler=laya.utils.Handler;
import Sprite=starling.Sprite;
export class MyEffect_WindowAppear_Scale{
	private	Fun:Handler;
	private layer:Sprite;
	private	MC:any;
	private	W:number;
	private	H:number;
	private	S:number	= 0.2;
	private	time:number=0.2;
	constructor(mc:any,	f:Handler){
		this.MC	= mc;
		this.Fun	= f;
		
		this.layer=new  Sprite();
		if(this.MC.parent)
		{
			this.MC.parent.addChildAt(this.layer,this.MC.parent.getChildIndex(this.MC));
		}
		this.layer.addChild(this.MC);
		
		this.W=Config.stageW;
		this.H=Config.stageH;
		this.layer.scaleX	= this.layer.scaleY	= this.S;
		this.layer.x	+= this.W * (1-this.S) / 2;
		this.layer.y	+= this.H * (1-this.S)/ 2;
		this.layer.alpha=0.1;
		laya.utils.Tween.to(this.layer, { x : 0,y:0 ,scaleX:1,scaleY:1,alpha:1}, this.time * 1000,null,Handler.create(this,this.Tover));
	}

	private Tover():void
	{
		this.layer.parent.addChildAt(this.MC,this.layer.parent.getChildIndex(this.layer));
		this.layer=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.layer);
		com.MyClass.Tools.Tool_Function.onRunFunction(this.Fun);
	}
}
}