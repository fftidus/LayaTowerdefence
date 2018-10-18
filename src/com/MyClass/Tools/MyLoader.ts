module com.MyClass.Tools{
import Handler=laya.utils.Handler;
export class MyLoader{
	public	static TypePIC:string="pic";
	public	static TypeByte:string="byte";
	public	static TypePICByte:string="bytePic";
	public	static TypeString:string="str";
	private	static getTypeByURL(url:string):string
	{
		var type:string;
		if(url.indexOf(".jpg")!=-1 || url.indexOf(".png")!=-1)	type=this.TypePIC;
		else if(url.indexOf(".txt")!=-1)	type=this.TypeString;
		else 	type=this.TypeByte;
		return type;
	}
	//===============================================
	private	Fun:Handler;
	private	Type:string;
	private	Url:string;
	private	fVal:any;
	constructor(type:string,	url:any,	f:Handler,val:any =null){
		this.Fun=f;
		this.fVal=val;
		this.Type=type || MyLoader.getTypeByURL(url);
		if(typeof url == "string")	this.Url=url;
		if(this.Type==MyLoader.TypePIC)
		{
			Laya.loader.load(this.Url, Handler.create(this,this.onPicF));
		}
		else if(this.Type==MyLoader.TypeByte)
		{
		}
		else if(this.Type==MyLoader.TypePICByte)
		{
		}
		else if(this.Type==MyLoader.TypeString)
		{
			Laya.loader.load(this.Url, Handler.create(this, this.onStringF));
		}
	}

	private onPicF():void
	{
		var t:laya.resource.Texture = Laya.loader.getRes(this.Url);
		this.onRunFun(t);
		this.destroyF();
	}
	
	private onByteArrayF(e:any):void
	{
		this.onRunFun(null);
		this.destroyF();
	}
	
	private onStringF(tar:any):void
	{
		if(tar!=null){
			this.onRunFun(Laya.loader.getRes(this.Url));
		}else{
			this.onRunFun(null);
		}
		this.destroyF();
	}
	
	private onRunFun(val:any):void{
		if(this.Fun==null)	return;
		if(this.fVal)	Tool_Function.onRunFunction(this.Fun,val,this.fVal);
		else		Tool_Function.onRunFunction(this.Fun,val);
	}
	
	public destroyF():void
	{
		this.Fun=Tool_ObjUtils.destroyF_One(this.Fun);
	}
}
}