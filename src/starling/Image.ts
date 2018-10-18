module starling{
import Texture =laya.resource.Texture;
export class Image extends Sprite{
	protected sx:number=1;
	protected sy:number=1;
	public w0:number=0;
	public h0:number=0;
	public tmpTexture:laya.resource.Texture;
	constructor(t:Texture){
		super();
		this.texture =t;
	}

	public get texture():Texture
	{
		return this.tmpTexture;
	}
	
	public set texture(value:Texture)
	{
		this.tmpTexture=value;
		if(this.tmpTexture){
			this.graphics.clear();
		}
		this.graphics.drawTexture(this.tmpTexture,0,0);
		this.w0 =this.tmpTexture.sourceWidth;
		this.h0 =this.tmpTexture.sourceHeight;
	}
	
	public get height():number
	{
		if(this.h0==0){
			this.h0=this.height;
		}
		return this.h0 * this.scaleY;
	}
	public set height(value:number){
		this.scaleY =value / this.h0;
	}
	public get width():number
	{
		if(this.w0==0){
			this.w0=this.width;
		}
		return this.w0 * this.scaleX;
	}
	public set width(value:number){
		this.scaleX =value / this.w0;
	}
	
	public destroy(destroyChild:boolean=true):void
	{
		this.tmpTexture=null;
		super.destroy(destroyChild);
	}
}
}