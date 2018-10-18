module com.MyClass.MySwf{
import AutoBitmap=laya.ui.AutoBitmap;
import Texture=laya.resource.Texture;
export class SwfS9Image extends starling.Sprite{
	public classLink:string;
	public swfName:string;
	constructor(){
		super();
		var g:AutoBitmap=new AutoBitmap();
		this.graphics=g;
	}
	public get sizeGrid():string {
		if ((this.graphics as AutoBitmap).sizeGrid) return (this.graphics as AutoBitmap).sizeGrid.join(",");
		return null;
	}
	public set sizeGrid(value:string) {
		(this.graphics as AutoBitmap).sizeGrid = laya.ui.UIUtils.fillArray(laya.ui.Styles.defaultSizeGrid, value, Number);
	}
	
	public get source():Texture {
		return (this.graphics as AutoBitmap).source;
	}
	public set source(value:Texture){
		if (!this.graphics) return;
		(this.graphics as AutoBitmap).source = value;
		super.event(laya.events.Event.LOADED);
		super.repaint();
	}
	
	public set width(value:number) {
		(this.graphics as AutoBitmap).width = value == 0 ? 0.0000001 : value;
	}
	public get width():number{
		return (this.graphics as AutoBitmap).width;
	}
	
	public set height(value:number) {
		(this.graphics as AutoBitmap).height = value == 0 ? 0.0000001 : value;
	}
	public get height():number{
		return (this.graphics as AutoBitmap).height;
	}
	public removeFromParent(dispose:boolean=false):void{
		if(this.parent!=null){
			this.parent.removeChild(this);
		}
		if(dispose){
			this.destroy();
		}
	}
	public destroy(destroyChild:boolean = true):void {
		if(this.graphics)this.graphics.destroy();
		super.destroy(true);
	}
}
}