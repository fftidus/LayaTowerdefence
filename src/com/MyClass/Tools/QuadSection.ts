module com.MyClass.Tools{
import Sprite =starling.Sprite;
export class QuadSection extends Sprite{
	private mw:number;
	private mh:number;
	private _ratio:number;
	
	private imgTar:Sprite;
	private imgMask:Sprite;
	constructor(t:laya.resource.Texture, color:number = 0xffffff){
		super();
		this._ratio = 1.0;
		this.imgTar=new Sprite();
		this.imgTar.graphics.drawTexture(t);
		this.addChild(this.imgTar);
		this.mw=this.imgTar.width;
		this.mh=this.imgTar.height;
		
		this.imgMask=new Sprite();
		this.imgMask.x =this.mw/2;
		this.imgMask.y =this.mh/2;
		this.updateVertices();
	}

	private updateVertices():void//laya中0表示0°，和starling相差90°
	{
		var ang:number =360 * this._ratio -90;
		
		this.imgMask.graphics.clear();
		this.imgMask.graphics.drawPie(0,0,(this.mw+10)/2,-90,ang,"#FFFFFF");
		this.imgTar.mask=this.imgMask;
	}
	
	public get ratio():number  { return this._ratio; }
	
	public set ratio(value:number)
	{
		if (this._ratio != value)
		{
			this._ratio = value;
			this.updateVertices();
		}
	}
	
	public  get _width():number{
		return this.mw;
	}
	public  get _height():number{
		return this.mh;
	}
	
	public static fromTexture(texture:laya.resource.Texture):QuadSection
	{
		var quadPie:QuadSection = new QuadSection(texture);
		return quadPie;
	}
	
	public destroyF():void{
		this.removeFromParent(true);
		if(this.imgMask){
			this.imgMask.graphics.clear();
			this.imgMask.removeFromParent(true);
			this.imgMask=null;
		}
		this.imgTar=Tool_ObjUtils.destroyF_One(this.imgTar);
	}
}
}