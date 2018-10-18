module com.MyClass{
import SWF=com.MyClass.MySwf.SWF;
export class MySourceManager{
	public static DirMain:string;
	public static ClassManager:any;
	public static instance:MySourceManager;
	public static getInstance():MySourceManager
	{
		if(this.instance == null)	this.instance	= new MySourceManager();
		return this.instance;
	}
	
	private Dic_Num:Object ={};
	private Dic_have:Object ={};
	private Dic_swf:Object ={};
	private Dic_json:Object ={};
	private Dic_zmc:Object;
	private Dic_pic:Object;
	private FunLoadOver:laya.utils.Handler;
	private Arr_waite:Array<any>;
	private Arr_waiteArrs:Array<any>	= [];
	constructor(){
	}

	public addTexture(arr:Array<any>,	f:laya.utils.Handler):void
	{
		for(var i:number=0; i<arr.length; i++)
		{
			if(arr[i] == null)	continue;
			var name:string		= arr[i][0];
			if(name==null)	continue;
			if(this.Dic_Num[name] == null)	this.Dic_Num[name]=0;
			this.Dic_Num[name]++;
		}
		if(this.Arr_waite && this.Arr_waite.length > 0)
		{
			this.Arr_waiteArrs.push([arr,f]);
			return;
		}
		this.FunLoadOver	= f;
		this.Arr_waite	= [];
		for(i=0; i<arr.length; i++)
		{
			if(arr[i] == null)	continue;
			this.Arr_waite.push(arr[i]);
		}
		MainManager._instence.add_delayFunction(laya.utils.Handler.create(this,this.loadNextF),2,true);
	}
	public removeTexture(name:string):void
	{
		if(name == null)	return;
		if(--this.Dic_Num[name] > 0)		return;
		this.onRemoveF(name);
	}
	private onRemoveF(name:string):void{
		var swf:SWF	= this.Dic_swf[name];
		if(swf)swf.destroyF();
		delete this.Dic_swf[name];
		delete this.Dic_have[name];
	}
	public removeTextures(arr:Array<any>):void
	{
		while(arr.length > 0)
		{
			if(arr[0]!=null)this.removeTexture(arr[0][0]);
			arr.shift();
		}
	}
	private loadNextF(first:boolean = false):void
	{
		if(first != true)		this.Arr_waite.shift();
		if(this.Arr_waite.length == 0)
		{
			this.Arr_waite	= null;
			var tmpF:any	= this.FunLoadOver;
			this.FunLoadOver	= null;
			com.MyClass.Tools.Tool_Function.onRunFunction(tmpF);
			if(this.Arr_waiteArrs.length > 0)
			{
				this.Arr_waite	= this.Arr_waiteArrs[0][0];
				this.FunLoadOver= this.Arr_waiteArrs[0][1];
				this.Arr_waiteArrs.shift();
				this.loadNextF(true);
			}
			return;
		}
		var name:string		= this.Arr_waite[0][0];
		if(this.Dic_have[name] != null)
		{
			MainManager.getInstence().MEM.dispatchF("加载进度",[]);
			MainManager._instence.add_delayFunction(laya.utils.Handler.create(this,this.loadNextF),2);
			return;
		}
		var Type:string		= this.Arr_waite[0][1];
		if(Type == "png" || Type == "jpg" || Type == "net")
		{
			if(this.Arr_waite[0][0]==null){
				this.onWantNextF("pic");
				return;
			}
			if(this.Dic_pic==null){this.Dic_pic={};}
			var Add:string= this.Arr_waite[0][2];
			if(Add == null){
				Add	= "Pic/";
			}else{
				if(Add.charAt(Add.length-1) != "/")	Add	+="/";
			}
			if(MySourceManager.DirMain!=null){
				Add=MySourceManager.DirMain+"/"+Add;
			}
			if(Add.indexOf(".") == -1){
				Add+=this.Arr_waite[0][0]+"."+Type;
			}
			Laya.loader.load(Add, laya.utils.Handler.create(this, this.onPicEnd,[Add]));
		}
		else if(Type == "swf")
		{
			if(this.Arr_waite[0][0]==null){
				this.onWantNextF("swf");
				return;
			}
			Add= this.Arr_waite[0][2];
			if(Add == null){
				Add	= name+"/";
			}else{
				if(Add.charAt(Add.length-1) != "/")	Add	+="/";
			}
			if(Add.indexOf("res/") != 0)	Add	= "res/"+Add;
			if(MySourceManager.DirMain!=null){
				Add=MySourceManager.DirMain+"/"+Add;
			}
			new com.MyClass.MySwf.SWF(Add+name+".json",laya.utils.Handler.create(this,this.onSwfLoaded));
		}
		else if(Type=="zmc"){
			Add= this.Arr_waite[0][2];
			if(Add == null){
				Add	= name+"/";
			}else{
				if(Add.charAt(Add.length-1) != "/")	Add	+="/";
			}
			if(Add.indexOf("res/") != 0)	Add	= "res/"+Add;
			if(MySourceManager.DirMain!=null){
				Add=MySourceManager.DirMain+"/"+Add;
			}
			new  com.MyClass.MyView.MyZMovieClip(Add+name+".sk",laya.utils.Handler.create(null,this.onZMCLoaded,[name]));
		}
		else if(Type == "mp3" || Type == "wav")
		{
			var sm:SoundManagerMy	= SoundManagerMy.getInstance();
			Add="";
			if(this.Arr_waite[0].length == 3)	Add= this.Arr_waite[0][2];
			if(MySourceManager.DirMain){
				Add=MySourceManager.DirMain+"/"+Add;
			}
			var arr:Array<any>	= [this.Arr_waite[0][0],Add,Type];
			sm.addSounds([arr],laya.utils.Handler.create(this,this.onWantNextF)	);
		}
		else if(Type=="json"){
			var jName:string=this.Arr_waite[0][0];
			Add= this.Arr_waite[0][2];
			if(Add == null){
				Add	= "";
			}
			if(Add.indexOf("assets/") != 0)	Add	= "assets/"+Add;
			if(MySourceManager.DirMain!=null){
				Add=MySourceManager.DirMain+"/"+Add;
			}
			if(Add.indexOf(".") == -1){
				if(Add.charAt(Add.length-1) != "/")	Add	+="/";
				Add+=this.Arr_waite[0][0]+"."+Type;
			}
			Laya.loader.load(Add, laya.utils.Handler.create(this, function(tar:any):void
			{
				if(tar!=null){
					com.MyClass.Config.LogF("json加载成功："+this.Arr_waite[0][0]);
					this.Dic_json[this.Arr_waite[0][0]]=Laya.loader.getRes(Add);
				}
				this.onWantNextF("json");
			}),null,Laya.Loader.TEXT);
		}
		else{
			com.MyClass.Config.LogF("暂时不支持加载的文件"+Type);
		}
	}
	private onPicEnd(Add:string):void
	{
		var t:laya.resource.Texture = Laya.loader.getRes(Add);
		this.Dic_pic[this.Arr_waite[0][0]]=t;
		com.MyClass.Config.LogF("pic加载成功："+this.Arr_waite[0][0]+"："+t);
		this.onWantNextF("swf");
	}
	private onZMCLoaded(_name:string	,zmc:com.MyClass.MyView.MyZMovieClip):void{
		if(zmc==null)	{
			com.MyClass.Config.LogF("加载zmc："+_name+"失败！");
		}else{
			if(this.Dic_zmc==null){this.Dic_zmc={};}
			this.Dic_zmc[_name]=zmc;
			this.Dic_have[_name]=true;
		}
		this.onWantNextF("zmc");
	}
	private onSwfLoaded(swf:SWF):void{
		if(swf!=null){
			this.Dic_have[swf.SwfName]=true;
			this.Dic_swf[swf.SwfName]=swf;
		}
		this.onWantNextF("swf");
	}

	private onWantNextF(type:string):void
	{
		if(this.Arr_waite==null && this.FunLoadOver==null)return;
		MainManager.getInstence().MEM.dispatchF("加载进度",[]);
		MainManager._instence.add_delayFunction(laya.utils.Handler.create(this,this.loadNextF),1);
	}

	public getSwf(name:string):SWF
	{
		return this.Dic_swf[name];
	}

	public getTextureFromSWF(swfName:string,name:string):laya.resource.Texture
	{
		var swf:SWF	= this.Dic_swf[swfName];
		if(swf == null)
		{
			Config.LogF("没有SWF："+swfName);
			return null;
		}
		return swf.getTexture(name);
	}
	
	public getImgFromSwf(swfName:string,	imgname:string):com.MyClass.MySwf.SwfImage
	{
		var swf:SWF	= this.Dic_swf[swfName];
		if(swf == null)
		{
			Config.LogF("没有SWF："+swfName);
			return null;
		}
		return swf.getImage(imgname);
	}
	public getS9FromSwf(swfName:string,s9name:string):com.MyClass.MySwf.SwfS9Image
	{
		var swf:SWF= this.Dic_swf[swfName];
		if(swf == null)
		{
			return null;
		}
		return swf.getS9Image(s9name);
	}
	public getSprFromSwf(swfName:string,	sprname:string):any
	{
		var swf:SWF= this.Dic_swf[swfName];
		if(swf == null)	return null;
		return swf.getSprite(sprname);
	}
	
	public getMcFromSwf(swfName:string,mcname:string):any
	{
		var swf:SWF= this.Dic_swf[swfName];
		if(swf == null){
			// if(this.Dic_zmc[swfName]){
			// 	var mc:MyZMovieClip=Dic_zmc[swfName];
			// 	var nmc:MyZMovieClip=new MyZMovieClip(mc.URL,null);
			// 	nmc.initF();
			// 	return nmc;
			// }
			return null;
		}
		return swf.getMc(mcname);
	}
	public getObjFromSwf(swfName:string, objName:string):any
	{
		if(swfName==null || objName==null)return null;
		if(objName.indexOf("img_")==0)	return this.getImgFromSwf(swfName,objName);
		if(objName.indexOf("spr_")==0)	return this.getSprFromSwf(swfName,objName);
		if(objName.indexOf("mc_")==0)	return this.getMcFromSwf(swfName,objName);
		if(objName.indexOf("s9_")==0)	return this.getS9FromSwf(swfName,objName);
		return null;
	}
	
	// public getTexture(name:string):Texture
	// {
	// 	if(Dic_pic==null){
	// 		return null;
	// 	}
	// 	return Dic_pic[name];
	// }
	
	public getJson(name:string):string{
		return this.Dic_json[name];
	}
	
	public destroyF():void
	{
		for(var n in this.Dic_Num)
		{
			this.removeTexture(n);
		}
		MySourceManager.instance	= null;
	}
}
}