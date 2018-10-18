module com.MyClass{
import Handler=laya.utils.Handler;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
import Tool_Function=com.MyClass.Tools.Tool_Function;
export class MySourceManagerOne{
	private static waiteClear:Array<any>=[];
	private static onNewOne(mso:MySourceManagerOne):void{
		for(var i:number=0;i<MySourceManagerOne.waiteClear.length;i++){
			(MySourceManagerOne.waiteClear[i]as MySourceManagerOne).onRemoveSources(mso.Arr_source);
		}
	}
	public static onClearWaite():void{
		while(MySourceManagerOne.waiteClear.length > 0){
			(MySourceManagerOne.waiteClear[0]as MySourceManagerOne).onRealDestroyF();
			MySourceManagerOne.waiteClear.shift();
		}
	}
	public static FunGetLoadView:Handler;
	
	private	SM:MySourceManager;
	public	Arr_source:Array<any>;
	private autoClearLoadView:Boolean;
	public	LView:any;
	private	Busy:Boolean=false;
	private	Arr_waite:Array<any>=[];
	private countAddTime:number=0;

	constructor(){
		this.SM= MySourceManager.instance;
	}

	private	Fun:Handler;
	public addSource(arr:Array<any>,	f:Handler,	needLoadingMC:any,		_autoClear:boolean=true,...arg):void
	{
		if(this.Busy)
		{
			this.Arr_waite.push([arr,	f,	needLoadingMC,_autoClear]);
			return;
		}
		this.Busy=true;
		this.autoClearLoadView=_autoClear;
		if(this.autoClearLoadView==true){
			this.Fun=f;
		}
		var j:number;
		for(var i:number=0;i<arr.length;i++){
			if(this.Arr_source && this.countAddTime > 0){//countAddTime>0表示已经加载过一次，=0表示即使有Arr_source也是由外部直接赋值，并没有加载过
				var re:Boolean=false;
				for (j=0;j<this.Arr_source.length;j++){
					if(Tool_ObjUtils.isEqual(arr[i],this.Arr_source[j])==true){
						arr.splice(i,1);
						re=true;
						break;
					}
				}
				if(re==true){
					i--;
					continue;
				}
			}
			for(j=i+1;j<arr.length;j++){
				if(Tool_ObjUtils.isEqual(arr[i],arr[j])==true){
					arr.splice(j,1);
				}
			}
		}
		if(this.Arr_source==null)	this.Arr_source	= arr.concat();
		else					this.Arr_source	= this.Arr_source.concat(arr);
		if(this.countAddTime==0){
			arr=this.Arr_source;
		}
		this.countAddTime++;
		this.SM.addTexture(arr,Handler.create(this,this.addOver));
		MySourceManagerOne.onNewOne(this);
		if(MySourceManagerOne.FunGetLoadView){
			if(arg.length==0)	this.LView=Tool_Function.onRunFunction(MySourceManagerOne.FunGetLoadView,arr.length,needLoadingMC);
			else				this.LView=Tool_Function.onRunFunction(MySourceManagerOne.FunGetLoadView,[arr.length,needLoadingMC].concat(arg));
		}
		if(this.LView==null){
			if(typeof needLoadingMC == "number"){
				this.LView	= new com.MyClass.MyView.LoadingView(arr.length,needLoadingMC as number);
			}
			else if(needLoadingMC==true){
				this.LView	= new  com.MyClass.MyView.LoadingView(arr.length,0);
			}
		}
	}
	private addOver():void
	{
		if(this.autoClearLoadView==false)return;
		if(this.SM==null)return;//已经被清理
		if(this.LView)
		{
			this.LView.destroyF();
			this.LView		= null;
		}
		if(this.Fun){Tool_Function.onRunFunction(this.Fun)}
		this.Fun=null;
		this.Busy=false;
		if(this.Arr_waite.length > 0)
		{
			var arr:Array<any>=this.Arr_waite[0];
			this.Arr_waite.shift();
			this.addSource(arr[0],arr[1],arr[2],arr[3]);
		}
		MySourceManagerOne.onClearWaite();
	}
	public onRemoveLoadView():void{
		this.autoClearLoadView=true;
		this.addOver();
	}
	
	public deleteSourceFromArray(arr:Array<any>):void
	{
		//			SM.removeTextures(arr);
		arr.forEach(function (item:any, index:number, array:Array<any>):void{
			for(var i:number=0;i<this.Arr_source.length;i++)
			{
				if(this.Arr_source[i][0]==item){
					this.Arr_source.removeAt(i--);
				}
			}
		});
	}
	
	public getSwf(name:string):com.MyClass.MySwf.SWF
	{
		return this.SM.getSwf(name);
	}
	public setSwfAutoSmooth(name:string):void
	{
	}
	
	public getTextureFromSWF(swfName:string,name:string):laya.resource.Texture
	{
		return this.SM.getTextureFromSWF(swfName,name);
	}
	
	public getImgFromSwf(swfName:string,	imgname:string):starling.Image
	{
		return this.SM.getImgFromSwf(swfName,imgname);
	}
	
	public getS9FromSwf(swf:string,s9name:string):com.MyClass.MySwf.SwfS9Image
	{
		return this.SM.getS9FromSwf(swf,s9name);
	}
	
	public getSprFromSwf(swfName:string,	sprname:string):com.MyClass.MySwf.SwfSprite
	{
		return this.SM.getSprFromSwf(swfName,sprname);
	}
	
	public getMcFromSwf(swfName:string,	mcname:string):any
	{
		return this.SM.getMcFromSwf(swfName,mcname);
	}
	public getObjFromSwf(swfName:string, objName:string):any
	{
		if(objName.indexOf("img_")==0)	return this.getImgFromSwf(swfName,objName);
		if(objName.indexOf("spr_")==0)	return this.getSprFromSwf(swfName,objName);
		if(objName.indexOf("mc_")==0)	return this.getMcFromSwf(swfName,objName);
		if(objName.indexOf("s9_")==0)	return this.getS9FromSwf(swfName,objName);
		return null;
	}
	public getJson(jName:string):any{
		return this.SM.getJson(jName);
	}
	/** 去掉资源 **/
	public onRemoveSources(source:Array<any>):void{
		if(this.Arr_source==null)return;
		var arrNoRepeat:Array<any>=[];
		this.Arr_source.forEach(function (item:any,index:number,arr:Array<any>):void {
			if(item==null)  return;
			var re:Boolean=false;
			    source.forEach(function (item2:Array<any>,index2:number,arr2:Array<any>):void {
				if(com.MyClass.Tools.Tool_ArrayUtils.isEqual(item,item2)==true)    re=true;
			});
			    if(re==false){
				this.Arr_source[index]=null;
				arrNoRepeat.push(item);
			}
		});
		if(arrNoRepeat.length>0){
			MySourceManager.instance.removeTextures(arrNoRepeat);
		}
	}
	
	public destroyF():void
	{
		this.Fun=null;
		if(this.LView)
		{
			this.LView.destroyF();this.LView=null;
		}
		if(this.SM){
			MySourceManagerOne.waiteClear.push(this);
			this.SM=null;
		}
	}
	
	public onRealDestroyF():void{
		if(this.Arr_source && this.Arr_source.length>0){
			MySourceManager.instance.removeTextures(this.Arr_source);
		}
	}
}
}