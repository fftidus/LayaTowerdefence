module Maps{
	export class MyTiledMap_ObjView extends starling.Sprite{
		/** 获得基础的显示元件 */
		public static getOne(swf:string,url:string):any{
			var pool =MyTiledMap.pool;
			var one;
			if(pool){
				one=pool.getFromPool(swf+":"+url);
			}
			if(one==null){
				one=new MyTiledMap_ObjView();
			}
			one.initBaseMc(swf,url);
			return one;
		}
		public mc:any;
		protected poolName:string;
		constructor(){
			super();
		}
		/** 显示mc **/
		public initBaseMc(swf:string,url:string):void{
			if(swf!=null){
				this.mc=com.MyClass.MySourceManager.getInstance().getObjFromSwf(swf,url);
				if(this.mc==null){com.MyClass.Config.LogF(swf+"："+url+"，找不到地面图")}
				else{
					this.addChild(this.mc);
				}
				this.poolName=swf+":"+url;
			}
			if(this.mc && this.mc instanceof com.MyClass.MySwf.SwfMovieClip){
				this.mc.play(true);
			}
		}
		
		public set currentFrame(value:number){
			if(this.mc){
				this.mc.gotoAndStop(value);
			}
		}
		public get currentFrame():number{
			if(this.mc){
				return this.mc.currentFrame;
			}
			return 0;
		}
		public get totalFrames():number{
			if(this.mc){
				return this.mc.totalFrames;
			}
			return 0;
		}
		
		
		public removeF():void{
			if(this.mc){
				if(this.mc instanceof com.MyClass.MySwf.SwfMovieClip){
					(this.mc as com.MyClass.MySwf.SwfMovieClip).stop(true);
				}else if(this.mc instanceof com.MyClass.MyView.MyMC){
					(this.mc as com.MyClass.MyView.MyMC).stop();
				}
			}
			if(MyTiledMap.pool)MyTiledMap.pool.returnToPool(this.poolName,this);
		}
		public destroyF():void{
			com.MyClass.Tools.Tool_ObjUtils.destroyDisplayObj(this);
			this.mc=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mc);
		}


	}
}