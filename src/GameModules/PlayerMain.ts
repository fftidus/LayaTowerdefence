module GameModules{
export class PlayerMain{
	private static instance:PlayerMain;
	public static getInstance():PlayerMain{
		if(this.instance==null)this.instance=new PlayerMain();
		return this.instance;
	}
	public static destroyF():void{
		this.instance=null;
	}
	//=========================================
	public NID:number;
	public NickName:string;

	constructor(){
	}
}
}