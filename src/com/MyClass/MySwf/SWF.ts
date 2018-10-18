module com.MyClass.MySwf{
export class SWF{
	public static dataKey_Sprite = "spr";
	public static dataKey_Image = "img";
	public static dataKey_MovieClip = "mc";
	public static dataKey_TextField = "text";
	public static dataKey_Scale9 = "s9";
	public static dataKey_Particle = "particle";
	//swf
	public SwfName:string;
	private URL_Swf:string;
	public Dic_NameFrame:Object={};
	private Dic_ParticleSetting:any;
	private _swfDatas:Object;
	private FunLoaded:laya.utils.Handler;
	constructor(url_Json:string,FLoaded:laya.utils.Handler){
		this.URL_Swf=url_Json;
		if(url_Json.indexOf("/") != -1){
			this.SwfName =url_Json.slice(url_Json.lastIndexOf("/")+1,	url_Json.indexOf(".json"));
		}
		this.FunLoaded=FLoaded;
		this.hanProgress =laya.utils.Handler.create(this,this.onAtlasProgress,null,false);
		Laya.loader.load(url_Json, laya.utils.Handler.create(this, this.onLoaded), this.hanProgress, laya.net.Loader.ATLAS);
	}
	private hanProgress:laya.utils.Handler;
	private onLoaded():void {
		this.hanProgress.clear();
		this.hanProgress=null;
		var atlas:Array<any>=Laya.Loader.getAtlas(this.URL_Swf);
		var data:any =Laya.Loader.getRes(this.URL_Swf);
		if(data==null){
			com.MyClass.Config.LogF("加载url_Json报错！");
			this.onLoadEndF(false);
			return;
		}
		var frames:Object = data.frames;
		var str:string;
		var count:number=0;
		for (let name in frames)
		{
			var t:laya.resource.Texture=Laya.loader.getRes(atlas[count++]);
			if(name.indexOf(".") >= 0)	str=name.slice(0,name.lastIndexOf("."));
			this.Dic_NameFrame[str]=t;
		}
		//------------------------------------------------
		var urlBytes:string=this.URL_Swf.split(".")[0]+".bytes";
		this.onLoadBytes(this.URL_Swf);
	}
	private onAtlasProgress(per:number):void{
		MainManager.getInstence().MEM.dispatchF("加载进度",per * 0.8);
	}

	private l:Laya.Loader;
	private onLoadBytes(url_Json:string):void
	{
		var url_bytes:string=url_Json.split(".")[0]+".bytes";
		var data:any = Laya.Loader.getRes(url_bytes);
		if (data) {
			this.initData(data);
		} else {
			this.l = new Laya.Loader();
			this.l.once(laya.events.Event.COMPLETE, this, this.loadCompleteF);
			this.l.once(laya.events.Event.ERROR, this, this.loadErrorF);
			this.l.on(laya.events.Event.PROGRESS,null,function(per:number):void{
				if(per!=1){
					// mem.dispatchF("加载进度",0.8 +per * 0.2);
				}
			});
			this.l.load(url_bytes, Laya.Loader.BUFFER);
		}
	}
	private loadErrorF(err:string):void{
		com.MyClass.Config.LogF("加载Bytes报错！");
		this.onLoadEndF(false);
	}
	private loadCompleteF(data:any):void{
		this.l.offAll();
		this.initData(data);
	}
	private initData(data:any):void
	{
		try{
			var inflate:Zlib.Inflate = new Zlib.Inflate(new Uint8Array(data));
			var inbuffer:Uint8Array = inflate.decompress();
			var bytes:laya.utils.Byte=new laya.utils.Byte(inbuffer);
		}catch(e){
			com.MyClass.Config.LogF("解压报错！"+e.message);
			return;
		}
		let str:string = bytes.readUTFBytes();

		this._swfDatas = JSON.parse(str);
		if(this._swfDatas["particle"] != null){
			var arrAll:Array<any>=[];
			for(var key in this._swfDatas["particle"]){
				if(this._swfDatas["particle"][key] != null){
					arrAll.push(key);
				}
			}
			if(arrAll.length > 0){
				this.onLoad粒子资源(arrAll);
				return;
			}
		}
		this.onLoadEndF(true);
	}

	private onLoad粒子资源(arr:Array<any>):void{
		var key:string=arr[0];//particle_1
		key=key.substr(9);
		Laya.loader.load("assets/Particles/"+key+".part", laya.utils.Handler.create(this, this.onParticleLoadOne,[arr]), null, Laya.Loader.JSON);
	}
	private onParticleLoadOne(arr:Array<any>,settings:laya.particle.ParticleSetting):void{
		var key:string=arr.shift();
		if(this.Dic_ParticleSetting==null){
			this.Dic_ParticleSetting={};
		}
		this.Dic_ParticleSetting[key]=settings;
		if(arr.length==0){
			this.onLoadEndF(true);
		}else{
			this.onLoad粒子资源(arr);
		}
	}

	private onLoadEndF(suc:boolean):void{
		com.MyClass.Tools.Tool_Function.onRunFunction(this.FunLoaded,suc==true?this:null);
		this.FunLoaded=null;
	}

	private createFuns(objData:any):any
	{
		var strName:string;
		if(objData instanceof Array)strName=objData[0];
		else if(typeof objData === 'string')		strName=objData as string;
		else	strName=objData["url"];
		if(strName.indexOf(SWF.dataKey_Image) == 0)		return this.getImage(strName);
		if(strName.indexOf(SWF.dataKey_Sprite) == 0)	return this.getSprite(strName);
		if(strName.indexOf(SWF.dataKey_MovieClip) == 0)	return this.getMc(strName);
		if(strName.indexOf(SWF.dataKey_Scale9) == 0)	return this.getS9Image(strName);
		if(strName.indexOf(SWF.dataKey_TextField) == 0)	return this.createTextField(objData);
		if(strName.indexOf(SWF.dataKey_Particle)==0)	return this.creatParticle(objData);
		return null;
	};
	
	public getObject(strName:string):any
	{
		if(strName.indexOf("img_")==0)	return this.getImage(strName);
		if(strName.indexOf("spr_")==0)	return this.getSprite(strName);
		if(strName.indexOf("mc_")==0)	return this.getMc(strName);
		if(strName.indexOf("s9_")==0)	return this.getS9Image(strName);
		return null;
	}
	public getTexture(strName:string):laya.resource.Texture{
		if (this.Dic_NameFrame[strName]!=null) {
			var t:laya.resource.Texture=this.Dic_NameFrame[strName];
			return t;
		}
		return null;
	}
	public getImage(strName:string):SwfImage
	{
		if( this._swfDatas[SWF.dataKey_Image][strName]==null){
			return null;
		}
		if (this.Dic_NameFrame[strName]!=null) {
			var t:laya.resource.Texture=this.Dic_NameFrame[strName];
			var image:SwfImage=new SwfImage(t);
			var imageData:Array<any> = this._swfDatas[SWF.dataKey_Image][strName];
			image.classLink = strName;
			image.swfName=this.SwfName;
			image.pivotX = imageData[imageData.length-2];
			image.pivotY = imageData[imageData.length-1];
			if(imageData.length>=4){//有宽高
				image.w0 =imageData[0];
				image.h0 =imageData[1];
			}
			return image;
		}
		return null;
	}
	public getS9Image(strName:string):SwfS9Image
	{
		if (this.Dic_NameFrame[strName]!=null) {
			var scale9Data:any = this._swfDatas[SWF.dataKey_Scale9][strName];
			var t:laya.resource.Texture=this.Dic_NameFrame[strName];
			var image:SwfS9Image=new SwfS9Image();
			image.source=t;
			image.classLink = strName;
			image.swfName=this.SwfName;
			image.sizeGrid=scale9Data["y"]+","+(t.width-scale9Data["x"]-scale9Data["w"])+","+(t.height-scale9Data["y"] -scale9Data["h"])+","+scale9Data["x"];
			return image;
		}
		return null;
	}
	public getSprite(strName:string):SwfSprite
	{
		if(this._swfDatas[SWF.dataKey_Sprite]==null ||  this._swfDatas[SWF.dataKey_Sprite][strName]==null)
		{
			com.MyClass.Config.LogF("没有Sprite:"+strName);
			return null;
		}
		var sprData:Array<any>=this._swfDatas[SWF.dataKey_Sprite][strName];
		var sprite:SwfSprite=new SwfSprite();
		var length:number = sprData.length;
		var objData:Array<any>;
		var display:any;
		var i:number=0;
		if(sprData.length>0){
			if(!(sprData[0] instanceof Array) && sprData[0]["url"]==null)	i=1;
			for (; i < length; i++) {
				objData = sprData[i];
				display=this.getOneChild(objData);
				if(display==null)continue;
				sprite.addChild(display);
			}
		}
		sprite.setSpriteData(sprData);
		sprite.classLink = strName;
		sprite.swfName=this.SwfName;
		return sprite;
	}
	private getOneChild(objData:any):any{
		if(objData==null)return null;
		var display:any;
		var i:number=0;
		display = this.createFuns(objData);
		if(display==null)return null;
		if(objData instanceof Array){
			display.name = objData[9];
			display.pos(objData[2],objData[3]);
			if(objData[1] != SWF.dataKey_Scale9){
				display.scaleX = objData[4];
				display.scaleY = objData[5];
				display.sx0=objData[4];
				display.sy0=objData[5];
			}else{
				display.width =objData[10];
				display.height =objData[11];
			}
			display.skewX = -objData[6];
			display.skewY = objData[7];			
			display.alpha = objData[8];
		}else{
			display.name = objData["name"];
			display.pos(objData["x"],objData["y"]);
			if(objData["type"] != SWF.dataKey_Scale9){
				display.scaleX = objData["sx"];
				display.scaleY = objData["sy"];
				display.sx0=objData["sx"];
				display.sy0=objData["sy"];
			}else{
				display.width =objData["w"];
				display.height =objData["h"];
			}
			display.skewX = -objData["skewx"];
			display.skewY = objData["skewy"];			
			display.alpha = objData["alpha"];
		}
		return display;
	}
	public getMc(strName:string):SwfMovieClip
	{
		if(this._swfDatas[SWF.dataKey_MovieClip]==null || this._swfDatas[SWF.dataKey_MovieClip][strName]==null)
		{
			com.MyClass.Config.LogF("没有MC:"+strName);
			return null;
		}
		var movieClipData:Object = this._swfDatas[SWF.dataKey_MovieClip][strName];
		if(movieClipData==null)return null;
		var objectCountData:Object = movieClipData["objCount"];
		var displayObjects:Object = {};
		var displayObjectArray:Array<any>;
		var type:string;
		var count:number;
		for(var objName in objectCountData){
			type = objectCountData[objName][0];
			count = objectCountData[objName][1];
			
			displayObjectArray = displayObjects[objName] == null ? [] : displayObjects[objName];
			
			
			if(type=="particle" ){
				for (let i:number = 0; i < count; i++) {
					displayObjectArray.push(this.createFuns(objName));
				}
			}
			else if(type=="text"){
				for (let i:number = 0; i < count; i++) {
					displayObjectArray.push(null);
				}
			}
			else{
				for (let i:number = 0; i < count; i++) {
					if(i>=SwfMovieClip.CacheNumBegin)break;
					displayObjectArray.push(this.createFuns(objName));
				}
				displayObjectArray.push( null);
			}
			
			displayObjects[objName] = displayObjectArray;
		}
		
		var mc:SwfMovieClip = new SwfMovieClip(movieClipData["frames"],movieClipData["labels"],displayObjects,this);
		if(movieClipData["重复"]!=null)	mc.onCashSameFrameInfo(movieClipData["重复"]);
		if(movieClipData["meta"]!=null)	mc.setMetaData(movieClipData["meta"]);
		mc.loop = movieClipData["loop"];
		mc.classLink = strName;
		mc.swfName =this.SwfName;
		return mc;
	}
	
	public createTextField(data:any):starling.TextField{
		var textfield:starling.TextField;
		var txt:string="";
		if(data){
			if(data["text"] && data["text"] != "\r" && data["text"] != ""){
				txt=data["text"];
			}
			textfield = com.MyClass.Tools.Tool_Textfield.newTextfield(data["w"],data["h"],txt,data["font"],data["size"],data["color"]
						,"上",data["align"],data["italic"],data["bold"]);
		}
		return textfield;
	}
	
	public creatParticle(_name:string):any{
		if(this.Dic_ParticleSetting[_name] == null){
			return null;
		}
		var sp:laya.particle.Particle2D = new laya.particle.Particle2D(this.Dic_ParticleSetting[_name]);
		sp.emitter.start(); 	
		sp.play();
		return sp;
	}
	
	public destroyF():void
	{
		Laya.Loader.clearRes(this.URL_Swf);
	}

	public onCheckDataForFilterAndColor(display:any,		data:any):void{
		if(data==null)return;
		SWF.setBlendMode(display,data["blend"]);
		if(data["color"]!=null && (display instanceof starling.Sprite)==true){
			SWF.changeColor(display,data["color"]);
		}
	}
	public static changeColor(tar:starling.Sprite,	col:number):void{
		if(tar)tar.color=col;
	}
	public static setBlendMode(display:starling.Sprite,blendMode:string):void{
		// 	"auto":true,
		// 	"none":true,
		// 	"normal":true,
		// 	"add":true,
		// 	"multiply":true,
		// 	"screen":true,
		// 	"erase":true,
		// 	"below":true
		if(blendMode == "add"){
			display.blendMode ="lighter";
		}
		else if(blendMode == "erase"){
		}
		else{
			//display.blendMode=egret.BlendMode.NORMAL;
		}
	}
}
}