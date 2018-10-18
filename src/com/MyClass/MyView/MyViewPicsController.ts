module com.MyClass.MyView{
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class MyViewPicsController{
	private sprBack:starling.Sprite;
	private dicPics:Object ={};

	constructor(spr:starling.Sprite){
		this.sprBack=spr;
		for(var i:number=0;i<this.sprBack.numChildren;i++)
		{
			var obj:any	= this.sprBack.getChildAt(i);
			if(obj.name && obj.name.indexOf("pic_")==0)
			{
				//pic_wxlocal__login_bg__jpg
				let str:string =(obj.name as string).substr(4);
				let arr:Array<string> =str.split("__");
				let strType:string =arr[arr.length-2]+"."+arr[arr.length-1];
				arr.splice(arr.length-2,2);
				let add:string ="";
				while(arr.length > 0){
					add+=arr[0]+"/";
					arr.splice(0,1);
				}
				var bg = new Laya.Image(add+strType);
				if(obj instanceof com.MyClass.MySwf.SwfSprite)	obj.addChild(bg);
				else				this.sprBack.addChildAt(bg,i++);
				this.dicPics[obj.name]=bg;
			}
		}
	}

	public destroyF():void{
		this.sprBack=Tool_ObjUtils.destroyF_One(this.sprBack);
		this.dicPics=Tool_ObjUtils.destroyF_One(this.dicPics);
	}
}
}