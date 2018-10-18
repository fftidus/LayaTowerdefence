module starling{
export class TextField extends laya.display.Text{
	private _format:TextFormat;
	public isCleared:boolean=false;
	public constructor(_w:number,_h:number,text:string,formate:TextFormat=null) {
		super();
		this.text =text;
	}

	public get format():TextFormat{
		if(this._format==null){
			this._format=new TextFormat(this);
		}else{
			this._format.T=this;
		}
		return this._format;
	}
	public set format(value:TextFormat){
		this._format =value;
	}

	private _autoScale:boolean=false;
	public get autoScale():boolean{return this._autoScale;}
	public set autoScale(_x:boolean){
		this._autoScale=_x;
	}

	private _touchable:boolean=false;
	public get touchable():boolean{return this._touchable;}
	public set touchable(can:boolean){
		this._touchable=can;
		this.mouseEnabled=can;
	}


	public removeFromParent(dispose:boolean=false):void{
		this.isCleared=true;
		if(this.parent!=null){
			this.parent.removeChild(this);
		}
		if(dispose){
			this.destroy();
		}
	}
	
}
}