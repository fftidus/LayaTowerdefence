module com.MyClass.MyGestures{
	export class MyGesture_RightSlide extends MyGesture{
		private isDown:boolean=false;
		private lastP:Object={};
		constructor(tar,f:laya.utils.Handler,  value){
			super(tar,f,value);
			this.Tar.on(Laya.Event.RIGHT_MOUSE_DOWN,this,this.onDownF);
			this.Tar.on(Laya.Event.RIGHT_MOUSE_UP,this,this.onUpF);
			this.Tar.on(Laya.Event.MOUSE_OUT,this,this.onOutF);
			this.Tar.on(Laya.Event.MOUSE_MOVE,this,this.onMoveF);
		}
		private onDownF(e):void{
			this.isDown=true;
			this.lastP["x"]=Laya.stage.mouseX;
			this.lastP["y"]=Laya.stage.mouseY;
		}
		private onMoveF(e):void{
			if(this.isDown==false)return;
			var p:any ={};
			p["x"]=Laya.stage.mouseX - this.lastP["x"];
			p["y"]=Laya.stage.mouseY - this.lastP["y"];
			com.MyClass.Tools.Tool_Function.onRunFunction(this.F,p);
			this.lastP["x"]=Laya.stage.mouseX;
			this.lastP["y"]=Laya.stage.mouseY;
		}
		private onUpF(e):void{
			this.isDown=false;
		}
		private onOutF(e):void{
			this.isDown=false;
		}

		public destroyF():void
		{
			this.Tar.off(Laya.Event.RIGHT_MOUSE_DOWN,this,this.onDownF);
			this.Tar.off(Laya.Event.RIGHT_MOUSE_UP,this,this.onUpF);
			this.Tar.off(Laya.Event.MOUSE_OUT,this,this.onOutF);
			this.Tar.off(Laya.Event.MOUSE_MOVE,this,this.onMoveF);
			super.destroyF();
		}
	}
}