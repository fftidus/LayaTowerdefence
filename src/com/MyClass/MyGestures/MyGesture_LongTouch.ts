module com.MyClass.MyGestures{
	export class MyGesture_LongTouch extends MyGesture{
		private mmo:MainManagerOne=new MainManagerOne();
		private isDown:boolean=false;
		private T:number;
		private FDown:laya.utils.Handler;
		private FUp:laya.utils.Handler;
		constructor(tar,f:laya.utils.Handler,  value,  time:number=0.5,	fd:laya.utils.Handler =null,fu:laya.utils.Handler =null){
			super(tar,f,value);
			this.T=time;
			this.FDown=fd;
			this.FUp=fu;
			super(tar,f,value);
			var MME:com.MyClass.MyView.MyMouseEventStarling	= this.addMME();
			MME.setValue("down事件",laya.utils.Handler.create(this,this.onDownF,null,false));
			MME.setValue("up事件",laya.utils.Handler.create(this,this.onUpF,null,false));
			MME.setValue("滑动",laya.utils.Handler.create(this,this.onSlideF,null,false));
		}

		private onDownF(p):void{
			if(this.isDown){
				return;
			}
			this.isDown=true;
			this.mmo.add_delayFunction(laya.utils.Handler.create(this,this.onTimeF),this.T * Config.playSpeedTrue);
			com.MyClass.Tools.Tool_Function.onRunFunction(this.FDown,this.FValue);
		}
		private onTimeF():void{
			if(this.F){
				com.MyClass.Tools.Tool_Function.onRunFunction(this.F,this.FValue);
				this.onUpF(null);
			}
		}
		private onUpF(p):void{
			if(this.isDown==false){
				return;
			}
			this.isDown=false;
			this.mmo.remove_delayFunction(this.onTimeF);
			if(p && this.FUp){
				com.MyClass.Tools.Tool_Function.onRunFunction(this.FUp,this.FValue);
			}
		}
		private onSlideF(dic):void{
			if(dic["类型"]=="移动"){
				this.onUpF(null);
			}
		}
		
		public destroyF():void
		{
			super.destroyF();
			this.FDown=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FDown);
			this.FUp=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.FUp);
		}
	}
}