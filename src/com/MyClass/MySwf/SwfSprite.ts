module com.MyClass.MySwf{
export class SwfSprite extends starling.Sprite{
	public classLink:string;
	public swfName:string;
	/** sprite本身的数据 **/
	public data:Object;
	/** sprite child的数据 **/
	public spriteData:Array<any>;
	public metaData:Object;
	constructor(){
		super();
	}
	/*
	* meta数据
	*/
	public setSpriteData(data:any):void
	{
		this.spriteData=data;
		if(this.spriteData && (this.spriteData[0] instanceof Array)==false && this.spriteData.length>0 && this.spriteData[0]["url"]==null)
		{
			this.setMetaData(this.spriteData[0]);
		}
	}
	public setMetaData(data:any):void
	{
		this.metaData=data;
		if(this.metaData["鼠标区域"])
		{
			if(this.metaData["鼠标区域"]["形状"]=="圆")
			{
				this.hit_半径=this.metaData["鼠标区域"]["半径"];
				this.hit_半径half=this.hit_半径/2;
				this.hit_半径2=this.hit_半径 * this.hit_半径;
			}
		}
	}
	private	hit_半径:number;
	private	hit_半径2:number;
	private	hit_半径half:number;

	/**
	 * 快速移出所有子集
	 */	
	public clearChild(dispose:boolean = false):void{
		this.removeChildren();
	}

	protected setDisplayColor(display:starling.Sprite,color:number):void{
		(display as starling.Sprite).color = color;
	}
}
}