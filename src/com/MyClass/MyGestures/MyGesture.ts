module com.MyClass.MyGestures{
	export class MyGesture{
		protected Tar:any;
		protected F:laya.utils.Handler;
		protected FValue:any;
		protected Arr_MME:Array<any>	= [];
		public pause:boolean=false;
		constructor(tar,	fun:laya.utils.Handler,	val){
			this.Tar	= tar;
			this.F	= fun;
			this.FValue=val;
		}

		protected addMME():com.MyClass.MyView.MyMouseEventStarling
		{
			var MME:com.MyClass.MyView.MyMouseEventStarling	= new com.MyClass.MyView.MyMouseEventStarling(this.Tar);
			this.Arr_MME.push(MME);
			return MME;
		}
		
		public destroyF():void
		{
			this.Tar	= null;
			this.F	= com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.F);
			for(let i=0; i<this.Arr_MME.length; i++)
			{
				var MME:com.MyClass.MyView.MyMouseEventStarling	= this.Arr_MME[i];
				MME.destroyF();
			}
			this.Arr_MME=null;
		}
	}
}