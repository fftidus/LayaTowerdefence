module com.MyClass.MyView{
import Sprite=starling.Sprite;
export class MyViewNumsController{
	public Nums:Object;
	constructor(spr:Sprite,	fName:string=null,	swf:string=null){
		this.Nums=com.MyClass.Tools.Tool_SpriteUtils.onGetAll_ImageNum(spr,fName,swf);
	}
	public getNum(Name:string):ImageNum
	{
		return this.Nums[Name];
	}
	public onShowF(txName:string,val:any):void
	{
		if(this.Nums[txName])	this.Nums[txName].showF(val);
	}
	
	public destroyF():void
	{
		this.Nums=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Nums);
	}
}
}