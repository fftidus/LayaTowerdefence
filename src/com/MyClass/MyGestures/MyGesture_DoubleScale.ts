/**
* 双指放大
*/
module com.MyClass.MyGestures{
	export class MyGesture_DoubleScale extends MyGesture{
		private lastDistance: number = 0;
		//双指距离对应的缩放比例
		public factor:number;
		public maxScale:number;
		public minScale:number;
		constructor(tar,f:laya.utils.Handler,  value,factor:number=0.01,	max:number=NaN,min:number=NaN){
			super(tar,f,value);
			this.factor=factor;
			this.maxScale=max;
			this.minScale=min;
			Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
			this.Tar.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
		}
		private onMouseDown(e: Laya.Event): void {
            var touches: Array<any> = e.touches;

            if (touches && touches.length == 2) {
                this.lastDistance = this.getDistance(touches);
                Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            }
        }

        private onMouseMove(e: Laya.Event): void {
            var distance: number = this.getDistance(e.touches);
			if(distance != this.lastDistance){
				if(this.factor>0){
					let s:number =this.Tar.scaleX + (distance-this.lastDistance) * this.factor;
					if(this.minScale != NaN && s<this.minScale)s=this.minScale;
					else if(this.maxScale!=NaN && s>this.maxScale)s=this.maxScale;
					this.Tar.scaleX=this.Tar.scaleY=s;
				}
				com.MyClass.Tools.Tool_Function.onRunFunction(this.F,distance-this.lastDistance);
			}
            this.lastDistance = distance;
        }

        private onMouseUp(e: Laya.Event): void {
			Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }

        /**计算两个触摸点之间的距离*/
        private getDistance(points: Array<any>): number {
            var distance: number = 0;
			if (points && points.length == 2)
			{
				var dx: number = points[0].stageX - points[1].stageX;
				var dy: number = points[0].stageY - points[1].stageY;
				distance = Math.sqrt(dx * dx + dy * dy);
			}
            return distance;
        }

		public destroyF():void{
			super.destroyF();
			Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
			Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
		}
	}
}