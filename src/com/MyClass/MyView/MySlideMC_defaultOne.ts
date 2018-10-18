module com.MyClass.MyView{
	export class MySlideMC_defaultOne extends starling.Sprite{
		public sprBack:starling.Sprite;
		public values:Object;
		constructor(){
			super();
		}
		public initF(spr:starling.Sprite):void{
			this.sprBack=spr;
			this.addChild(this.sprBack);
		}
		public setValue(key:string,value:any):void{
			if(this.values==null)this.values={};
			this.values[key]=value;
		}
		public getValue(key:string):any{
			if(this.values==null)return null;
			return this.values[key];
		}

		public destroyF():void{
			com.MyClass.Tools.Tool_ObjUtils.destroyDisplayObj(this);
			this.sprBack=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.sprBack);
			this.values=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.values);
		}
	}
}