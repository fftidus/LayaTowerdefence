/**
* 场景管理器 
*/
module com.MyClass{
export class MySceneManager{
	public static instance:MySceneManager;
	public static getInstance():MySceneManager{
		if(this.instance==null)this.instance=new MySceneManager();
		return this.instance;
	}
	//========================================================
	public nowScene:starling.Sprite;
	public nowWindow:starling.Sprite;
	constructor(){
	}
	/**
	 * 进入场景，会自动清理之前的场景！
	 */
	public runScene(scene,data):void{
		this.nowScene=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.nowScene);
		this.nowScene =new scene(data);
	}
	/**
	 * 弹窗
	 */
	public showWindow(win,data):void{
		this.nowWindow=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.nowWindow);
		this.nowWindow =new win(data);
	}

}
}