module com.MyClass.MyPartical{
import Sprite=starling.Sprite;
import Handler=laya.utils.Handler;
import SwfMovieClip=com.MyClass.MySwf.SwfMovieClip;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
import Tool_Function=com.MyClass.Tools.Tool_Function;
export class MyPartical_gravity extends Sprite{
	private mmo:MainManagerOne;
	private isDestroyF:boolean=false;
	public pause:boolean=false;
	public stop:boolean=false;
	/** 是否由外部调用enterF */
	public isUpdataByOther:boolean=false;
	/** 最大数量 */
	public maxNum:number=10;
	/** 每帧最多生成数量 */
	public maxNumFrame:number=1;
	/** 是否使用外部的addChild方法添加粒子，没有则直接添加到父元件 */
	public FunAddchild:any;
	/** 粒子元件的获取方法 */
	public Arr_mcs:Array<any>;
	
	/** 整体的重力：每秒移动的距离 */
	public set gx(value:number){this.spdx =value / Config.playSpeedTrue;}
	public set gy(value:number){this.spdy =value / Config.playSpeedTrue;}
	/** 由重力换算得到的每帧移动速度 */
	private spdx:number=0;
	private spdy:number=1;
	/** FPS */
	public  set FPS(value:number){this.needMS =1000/value;}
	private needMS:number;
	private countMS:number=0;
	
	/** 粒子的生存时间 */
	public lifeTime:number=1;
	/** 粒子的生存时间随机增量 */
	public lifeTime_random:number=0;
	/** 初始化粒子的位置：默认0，参数表示随机范围 */
	public startX:number=0;
	public startY:number=0;
	/** 初始化粒子的最小速度，根据本类的旋转角度会修改该速度 */
	public startSpdX:number=0;
	public startSpdY:number=0;
	/** 初始化粒子的随机速度增量 */
	public startSpdx_random:number=0;
	public startSpdy_random:number=0;
	/** 初始化粒子的缩放 */
	public startScaleX:number=1;
	public startScaleX_random:number=0;
	public startScaleY:number=1;
	public startScaleY_random:number=0;
	/** 初始化粒子的缩放变化速度 */
	public startSpdSx:number=0;
	public startSpdSx_random:number=0;
	public startSpdSy:number=0;
	public startSpdSy_random:number=0;
	/** 初始化粒子的旋转速度 */
	public startSpdR:number=0;
	public startSpdR_random:number=0;
	/** 初始化粒子的旋转角度随机 */
	public startRotation_random:number=0;
	/** 初始化粒子的透明度变化速度 */
	public startSpdA:number=0;
	public startSpdA_random:number=0;
	
	
	/** 所有粒子 */
	private Arr_Particals:Array<any>=[];
	/** 缓存池 */
	private poolParts:com.MyClass.Tools.MyPools =new com.MyClass.Tools.MyPools();
	
	
	constructor(){
		super();
		this.FPS=30;
	}

	/** 添加一个粒子底层元件的获取方法 */
	public addMcFunction(fun:Handler):void{
		if(this.Arr_mcs==null)this.Arr_mcs=[];
		this.Arr_mcs.push(fun);
		if(fun instanceof Handler){
			fun.once=false;
		}
	}
	
	public onStartF():void{
		if(this.Arr_mcs==null){
			console.log("还没有粒子的生成方法！");
			return;
		}
		for(var i:number=0;i<this.Arr_mcs.length;i++){
			this.poolParts.registF(i+"",this.maxNum);
		}
		if(this.isUpdataByOther==false){
			this.mmo=new MainManagerOne();
			this.mmo.addEnterFrameFun(Handler.create(this,this.enterF,null,false));
		}
	}
	
	public enterF():void{
		if(this.pause==true){return;}
		this.countMS+=Config.frameMS;
		if(this.countMS < this.needMS){	return;	}
		this.countMS -=this.needMS;
		this.onEnterParts();
		if(this.isDestroyF==true || this.stop==true){return;}
		//判断生成新的
		var count:number=this.maxNumFrame;
		while(this.Arr_Particals.length < this.maxNum){
			this.onNewOne();
			if(--count <= 0)break;
		}
	}
	/**
	 * 生成一个新的
	 * **/
	public onNewOne():void{
		var i:number =Tool_Function.onForceConvertType(Math.random() * this.Arr_mcs.length);
		var type:string =i+"";
		var one:MyPartical_particalOne =this.poolParts.getFromPool(type);
		if(one==null){
			one =new MyPartical_particalOne(type,Tool_Function.onRunFunction(this.Arr_mcs[i]));
		}
		//TODO 根据旋转角度改变速度
		one.spdX =this.startSpdX + this.startSpdx_random * Math.random();
		one.spdY =this.startSpdY + this.startSpdy_random * Math.random();
		
		one.lifeTime =(this.lifeTime + Math.random() * this.lifeTime_random);
		if(this.startX!=0){
			one.x =this.x -this.startX+ Math.random() * (this.startX+this.startX);
		}else{
			one.x=this.x;
		}
		if(this.startY!=0){
			one.y =this.y+this.startY*Math.random();
		}else{
			one.y =this.y;
		}
		if(this.startScaleX!=0 || this.startScaleX_random!=0){
			one.scaleX=this.startScaleX+Math.random() * this.startScaleX_random;
		}else{
			one.scaleX=1;
		}
		if(this.startScaleY!=0 || this.startScaleY_random!=0){
			one.scaleY=this.startScaleY+Math.random() * this.startScaleY_random;
		}else{
			one.scaleY=1;
		}
		if(this.startSpdSx!=0 || this.startSpdSx_random!=0){
			one.spdSx =this.startSpdSx + Math.random() * this.startSpdSx_random;
		}else{
			one.spdSx=0;
		}
		if(this.startSpdSy!=0 || this.startSpdSy_random!=0){
			one.spdSy =this.startSpdSy + Math.random() * this.startSpdSy_random;
		}else{
			one.spdSx=0;
		}
		if(this.startSpdA!=0 || this.startSpdA_random!=0){
			one.spdA =this.startSpdA + this.startSpdA_random * Math.random();
		}else{
			one.spdA =0;
		}
		one.rotation =Tool_Function.deg2rad(Math.random() * this.startRotation_random);
		if(this.startSpdR!=0 || this.startSpdR_random!=0){
			one.spdR = Tool_Function.deg2rad(this.startSpdR + Math.random() * this.startSpdR_random);
		}else{
			one.spdR=0;
		}
		if(this.FunAddchild == null){
			this.parent.addChild(one);
		}else{
			Tool_Function.onRunFunction(this.FunAddchild,one);
		}
		one.initF();
		this.Arr_Particals.push(one);
	}
	
	/**
	 * 粒子动画
	 * */
	private onEnterParts():void{
		if(this.Arr_Particals==null)return;
		for(var i:number=0;i<this.Arr_Particals.length;i++){
			var one:MyPartical_particalOne =this.Arr_Particals[i];
			if(one.isEnd==true){
				this.Arr_Particals.splice(i--,1);
				this.poolParts.returnToPool(one.Type,one);
			}else{
				one.enterF();
				one.spdX+=this.spdx;
				one.spdY+=this.spdy;
			}
		}
		if(this.Arr_Particals.length==0){
			if(this.isDestroyF==true){
				this.realDestroyF();
			}
		}
	}
	
	/**
	 * 清理，但不清理已发射的粒子
	 * */
	public destroyF():void{
		if(this.isDestroyF)return;
		this.isDestroyF=true;
		Tool_ObjUtils.destroyDisplayObj(this);
		this.Arr_mcs=Tool_ObjUtils.destroyF_One(this.Arr_mcs);
		this.FunAddchild=Tool_ObjUtils.destroyF_One(this.FunAddchild);
		this.poolParts=Tool_ObjUtils.destroyF_One(this.poolParts);
		if(this.isUpdataByOther==true){
			if(this.mmo==null){
				this.mmo=new MainManagerOne();
				this.mmo.addEnterFrameFun(Handler.create(this,this.enterF,null,false));
			}
		}
	}
	public realDestroyF():void{
		this.mmo=Tool_ObjUtils.destroyF_One(this.mmo);
		this.Arr_Particals=Tool_ObjUtils.destroyF_One(this.Arr_Particals);
	}
}
}