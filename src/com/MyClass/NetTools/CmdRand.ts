module com.MyClass.NetTools{
export class CmdRand{
	private static instance:CmdRand;
	public static getInstance():CmdRand
	{
		if(this.instance  == null)
			this.instance  = new CmdRand();
		return this.instance;
	}
	private _seed:number = 0;
	public   seed:number = 0;
	public lastSeed:number;
	constructor(){
	}
	public next():number
	{
		this.lastSeed=this._seed;
		do
		{
			this._seed^=(this._seed<<21);
			this._seed^=(this._seed>>21);
			this._seed^=(this._seed<<4);
		}
		while(this._seed == 0 || this.seed == this._seed);
		this.seed = this._seed;
		return this._seed;
	}
	
	public setSeed(n:number):void
	{
		this._seed	= n;
		this.lastSeed=n;
	}
}
}