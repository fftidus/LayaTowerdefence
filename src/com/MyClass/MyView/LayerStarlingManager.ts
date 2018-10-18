module com.MyClass.MyView{
export class LayerStarlingManager extends laya.display.Sprite{
	public static instance:LayerStarlingManager;
	public static getInstence():LayerStarlingManager{
		if(this.instance==null)this.instance=new LayerStarlingManager();
		return this.instance;
	}

	public LayerTop:starling.Sprite;
	public LayerView:starling.Sprite;

	public constructor() {
		super();
		// this.scaleX =this.scaleY =Config.stageScale;
		LayerStarlingManager.instance	= this;
		this.LayerView	= new starling.Sprite();
		this.addChild(this.LayerView);
		this.LayerTop	= new starling.Sprite();
		this.addChild(this.LayerTop);
	}
	public init(_stage:laya.display.Stage):void{
		_stage.addChild(this);
	}

	public destroyF():void
	{
		var child:any;
		while(this.LayerView.numChildren>0)
		{
			child=this.LayerView.getChildAt(0);
			this.LayerView.removeChild(child);
			com.MyClass.Tools.Tool_ObjUtils.destroyF_One(child);
		}
		while(this.LayerTop.numChildren>0)
		{
			child=this.LayerTop.getChildAt(0);
			this.LayerTop.removeChild(child);
			com.MyClass.Tools.Tool_ObjUtils.destroyF_One(child);
		}
	}
}
}