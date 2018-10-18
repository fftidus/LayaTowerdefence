module com.MyClass.MyView{
import SwfMovieClip =com.MyClass.MySwf.SwfMovieClip;
export class LoadingSmall{
	public static One:LoadingSmall;
	public static showF(str:string = null):void
	{
		if(this.One == null)
		{
			this.One	= new LoadingSmall(str);
		}
	}
	public static removeF(e:any = null):void
	{
		if(this.One != null)
		{
			this.One.destroyF();
			this.One	= null;
		}
	}
	public static SWF_Starling:string="SWF_Default";
	private smc:SwfMovieClip;
	constructor(str:string){
		MyTextInput.onHideF(true);
		this.smc=MySourceManager.getInstance().getMcFromSwf(LoadingSmall.SWF_Starling,"mc_loadingsmall");
		if(this.smc){
			LayerStarlingManager.instance.LayerTop.addChild(this.smc);
		}
	}
	public destroyF():void
	{
		MyTextInput.onHideF(false);
		if(this.smc){
			this.smc.removeFromParent(true);
			this.smc=null;
		}
	}
}
}