module com.MyClass{
import SoundManager=laya.media.SoundManager;
export class SoundManagerMy{
	public static nowMic:string;
	public static countBackNum:number;
	public static soundVal:number=1;
	public static instance:SoundManagerMy;
	public static getInstance():SoundManagerMy
	{
		if(SoundManagerMy.instance == null)
		{
			SoundManagerMy.instance	= new SoundManagerMy();
		}
		return SoundManagerMy.instance;
	}
	
	public DirPath:string="Sound";
	public pause:number=0;
	public mute:boolean=false;
	constructor(){
	}
	//----------------加载----------------------------------------
	private Fun:any;
	private Arr_now:Array<any>;
	private Arr_waite:Array<any>;
	private isLoading:boolean=false;
	private Dic_fullName:any = {};
	public addSounds(arr:Array<any>,f:any):void
	{
		if(this.isLoading==true){
			if(this.Arr_waite==null)this.Arr_waite=[];
			this.Arr_waite.push({"arr":arr,"f":f});
			return;
		}
		this.Arr_now	= arr;
		this.Fun		= f;
		this.nextF(true);
	}
	
	private nextF(first:boolean = false):void
	{
		this.isLoading=true;
		if(first == false)
		{
			this.Arr_now.shift();
			if(this.Arr_now.length == 0)
			{
				com.MyClass.Tools.Tool_Function.onRunFunction(this.Fun);
				this.Fun			= null;
				this.Arr_now	= null;
				if(this.Arr_waite==null || this.Arr_waite.length==0){
					this.isLoading=false;
				}else{
					var waite:any =this.Arr_waite.shift();
					this.Arr_now=waite["arr"];
					this.Fun=waite["f"];
					this.nextF(true);
				}
				return;
			}
		}
		if(this.Arr_now[0] == null)
		{
			this.nextF();
			return;
		}
		var name:string	= this.Arr_now[0][0];
		var fullName:string;
		var dir:string	= this.Arr_now[0][1];
		if(dir==null || dir.length==0){
			fullName=name;
		}
		else	if(dir.charAt(dir.length-1) == "/"){
			fullName=dir+name;
		}else{
			fullName=dir+"/"+name;
		}
		fullName=this.DirPath+"/"+fullName+".mp3";
		this.Dic_fullName[name]=fullName;
		this.nextF();//强制next
	}
	
	//@@@@@@@@@@@@@@@@@@@@@@播放@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	private getFullName(name:string):string{
		return this.Dic_fullName[name];
	}
	
	public playMusic(name:string,vol:number=-1,stopF:any =null,sTime:number =0,loop:number =9999,fadeTime:number=0):void
	{
		name=this.getFullName(name);
		if(name){
			SoundManager.playMusic(name,0,stopF);
		}
	}
	
	public playSound(name:string,	vol:number	= 1):void{
		name=this.getFullName(name);
		if(name){
			SoundManager.playSound(name);
		}
	}
	
	public setVol(vol:number,	name:string	= null):void
	{
		SoundManager.soundVolume=vol;
	}
	/*
		*  @fadeTime 缓出时间（毫秒）
	*/
	public stopMusic(name:string,fadeTime:number=0):void
	{
		SoundManager.stopMusic();
	}
	
	public removeSound(id:string):void
	{
	}
	
	public stopAll():void
	{
		SoundManager.stopAll();
	}
	
	public haveSound(name:string):boolean
	{
//			if(this.Dic_have[name] == null)	return false;
		return true;
	}
	
	public destroyF():void
	{
//			SoundAS.stopAll();
//			SoundAS.removeAll();
		SoundManagerMy.instance	= null;
		SoundManagerMy.nowMic=null;
		SoundManagerMy.countBackNum=0;
	}
	
}
}