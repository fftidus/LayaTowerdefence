module starling{
export class Sprite extends Laya.Sprite{
	public name:string;
	private _touchable:boolean=false;
	private _color:number;
	constructor(){
		super();
	}
	public get touchable():boolean{return this._touchable;}
	public set touchable(can:boolean){
		this._touchable=can;
		this.mouseEnabled=can;
	}

	public removeFromParent(dispose:boolean=false):void{
		this.removeSelf();
	}

	public set color(col:number){
		if(col==starling.Color.WHITE){
			if(this.filters==null)return;
			for(let i:number=this.filters.length;i>=0;i--){
				if(this.filters[i] instanceof laya.filters.ColorFilter){
					this.filters.splice(i,1);
					break;
				}
			}
			return;
		}
		com.MyClass.Tools.Tool_ObjUtils.addColorFilter(this,com.MyClass.Tools.Tool_ObjUtils.ColorFilterType_color,col);
	}

	public get width():number{
		var rec:any =this.getBounds();
		return rec.width;
	}
	public set width(value:number){
		var w0:number =this.width / this.scaleX;
		this.scaleX =value / w0;
	}
	public get height():number{
		var rec:any =this.getBounds();
		return rec.height;
	}
	public set height(value:number){
		var w0:number =this.height / this.scaleY;
		this.scaleY =value / w0;
	}

	public destroyF():void{
		this.removeFromParent(true);
	}
}
}