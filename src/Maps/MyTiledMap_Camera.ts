module Maps{
	export class MyTiledMap_Camera{
		private Map:MyTiledMap;
		private minX:number;
		private maxX:number;
		private minY:number;
		private maxY:number;
		/** 摄像机的半径 */
		public cameraW:number =com.MyClass.Config.stageScaleInfo["屏幕w"]/2;
		public cameraH:number =com.MyClass.Config.stageScaleInfo["屏幕h"]/2;
		/** 当前摄像机的中心点 */
		public nowX:number=0;
		public nowY:number=0;
		/** 镜头放大的倍数 */
		private _scale:number=1;
		public set scale(value:number){this._scale=value;}
		public get scale():number{return this._scale;}
		/** 跟随的目标 */
		public lookAtTar:any;

		constructor(map:MyTiledMap){
			this.Map=map;
			let data:MyTiledMap_Data =map.data;
			this.minX=-data.row * data.width/2;
			this.maxX=data.col * data.width/2;
			this.minY=0;
			this.maxY=(data.row + data.col) * data.height/2;
			this.enterF();
		}

		/**
		 * 帧频，由map调用
		 * */
		public enterF():void{
			if(this.lookAtTar!=null) {
				this.nowX = this.lookAtTar.x;
				this.nowY = this.lookAtTar.y;
			}
			if(this.nowX<this.minX){this.nowX=this.minX;}
			else if(this.nowX>this.maxX){this.nowX=this.maxX;}
			if(this.nowY<this.minY){this.nowY=this.minY;}
			else if(this.nowY>this.maxY){this.nowY=this.maxY;}
			this.Map.x =-this.nowX * this.Map.scaleX+this.cameraW ;
			this.Map.y =-this.nowY * this.Map.scaleX+this.cameraH ;
		}
		
		public destroyF():void{
			this.Map=null;
		}
	}
}