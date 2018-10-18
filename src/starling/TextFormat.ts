module starling{
	export class TextFormat{
		public T:TextField;
		private _color:number;
		public get color():number{	return Number("0x"+this.T.color.substr(1));	}
		public set color(value:number){
			this._color = value;
			if(this.T){
				this.T.color="#"+this._color.toString(16);
			}
		}
		public constructor(t:TextField) {
			this.T=t;
		}

		public get font():string{return this.T.font;}
		public set font(value:string){this.T.font =value;}

		public get size():number{return this.T.fontSize;}
		public set size(value:number){this.T.fontSize =value;}
		
		public get horizontalAlign():string{return this.T.align;}
		public set horizontalAlign(value:string){
			if(value=="左"||value=="left")		this.T.align="left";
			else if(value=="右"||value=="right")	this.T.align="right";
			else							this.T.align="center";
		}

		public get italic():boolean{return this.T.italic;}
		public set italic(value:boolean){this.T.italic=value;}

		public get bold():boolean{return this.T.bold;}
		public set bold(value:boolean){this.T.bold=value;}
	}
}