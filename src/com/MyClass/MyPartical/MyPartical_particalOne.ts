module com.MyClass.MyPartical{
import Sprite=starling.Sprite;
import SwfMovieClip=com.MyClass.MySwf.SwfMovieClip;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class MyPartical_particalOne extends Sprite{
	public Type:string;
	public isEnd:boolean=false;
	private Mc:any;
	/** 存活时间 */
	public lifeTime:number;
	private countFrame:number;
	/** 移动速度 */
	public spdX:number=0;
	public spdY:number=0;
	public spdA:number=0;
	public spdSx:number=0;
	public spdSy:number=0;
	public spdR:number=0;
	constructor(_type:string,mc:any){
		super();
		this.Type=_type;
		this.Mc=mc;
		this.addChild(this.Mc);
	}

	/** 初始化前应重新设置alpha、spd、scale等数据 **/
	public initF():void{
		this.isEnd=false;
		if(this.Mc instanceof SwfMovieClip){
			(this.Mc as SwfMovieClip).play();
		}
		this.countFrame=this.lifeTime * Config.playSpeedTrue;
	}
	
	public enterF():void{
		if(this.isEnd)return;
		if(this.countFrame--<0){
			this.clearF();
		}else{
			this.x +=this.spdX;
			this.y +=this.spdY;
			this.alpha +=this.spdA;
			if(this.spdA > 0){
				if(this.spdA+this.alpha > 1)this.alpha=1;
				else this.alpha+=this.spdA;
			}else if(this.spdA<0){
				if(this.spdA+this.alpha < 0){
					this.alpha=0;
					this.clearF();
					return;
				}else{
					this.alpha+=this.spdA;
				}
			}
			if(this.spdSx>0){
				this.scaleX+=this.spdSx;
			}else if(this.spdSx<0){
				if(this.scaleX + this.spdSx <=0){
					this.clearF();
					return;
				}else{
					this.scaleX+=this.spdSx;
				}
			}
			if(this.spdSy>0){
				this.scaleY+=this.spdSy;
			}else if(this.spdSy<0){
				if(this.scaleY + this.spdSy <=0){
					this.clearF();
					return;
				}else{
					this.scaleY+=this.spdSy;
				}
			}
			if(this.spdR!=0){
				this.rotation+=this.spdR;
			}
		}
	}
	
	
	public clearF():void{
		this.isEnd=true;
		if(this.parent){
			this.parent.removeChild(this);
		}
		if(this.Mc instanceof SwfMovieClip){
			(this.Mc as SwfMovieClip).stop(true);
		}
	}
	public destroyF():void{
		Tool_ObjUtils.destroyDisplayObj(this);
		this.Mc=Tool_ObjUtils.destroyF_One(this.Mc);
	}
}
}