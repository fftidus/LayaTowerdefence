module com.MyClass.Tools{
export class Tool_ImgUtils{
	public static onNoSmooth(obj:any,		maxS:number=3):void
	{
	}
	public static onAddSmooth(obj:any):void
	{
	}
	
	
	public static onCreateImageNum(fName:string,spr:starling.Sprite,_url:string,_swf:string=null):com.MyClass.MyView.ImageNum
	{
		var tmp:any	= spr.getChildByName(_url);
		if(tmp==null)	return null;
		var num:com.MyClass.MyView.ImageNum	= new com.MyClass.MyView.ImageNum(fName,_swf);
		num.setValue("父对象",tmp);
		return num;
	}
	
	public static cloneImage(target:starling.Image):starling.Image{
		var image:starling.Image = new starling.Image(target.texture);
		image.x=target.x;
		image.y=target.y;
		image.width =target.width;
		image.height =target.height;
		image.skewX = target.skewX;
		image.skewY = target.skewY;		
		image.alpha = target.alpha;
		
		return image;
	}
	
	public static onNewImageFromTexture(t:laya.resource.Texture):any{
		if(t==null){return null;}
		var image:starling.Image = new starling.Image(t);
		return image;
	}
}
}