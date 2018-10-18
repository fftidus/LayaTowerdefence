module com.MyClass.MyView{
import Sprite=starling.Sprite;
import Handler=laya.utils.Handler;
import Tool_Function=com.MyClass.Tools.Tool_Function;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class MyViewEffect{
	public static timeDefault:number=0.5;
	/*
		* 界面入场和出场的过程
	* @param info 设置各个元件的入场出场方式
	*/
	private Fun:any;
	private typeIn:boolean;
	private View:Sprite;
	private info:any;
	private dicTweens:Dictionary=new  Dictionary();
	private dicMc:Dictionary;
	private mmo:MainManagerOne;
	constructor(v:Sprite,	fend:any,		_info:Object,	isIn:boolean =true){
		this.Fun=fend;
		this.View=v;
		this.info=_info;
		this.typeIn=isIn;
		if(this.info==null){
			this.destroyF();
			return;
		}
		var have:boolean=false;
		for(var key in this.info){//btn_1：{"x":200,"反弹":true,"startTime":0.03}//默认都是入场的数据，出场则自动计算
			if(this.info[key]==null){continue;}
			var child:any =this.View.getChildByName(key);
			if(child==null){
				console.log("入场动画中"+key+"不存在");
				continue;
			}
			have=true;
			var time:number;
			if(this.info[key]["time"] != null)	time= this.info[key]["time"];
			else								time= MyViewEffect.timeDefault; 
			if(this.info[key]["startTime"] != null && this.typeIn==true){
				this.onSetStartWaite参数(key,true);
				this.dicTweens.set(key,"");
				starling.Juggler.getInstance().delayCall(Handler.create(this,this.onAddTweenOne), this.info[key]["startTime"],key,this.info);
				continue;
			}
			else if(this.info[key]["startTime2"] != null && this.typeIn==false){
				this.dicTweens.set(key,"");
				starling.Juggler.getInstance().delayCall(Handler.create(this,this.onAddTweenOne), this.info[key]["startTime2"],key,this.info);
				continue;
			}
			this.onAddTweenOne(key,this.info);
		}
		if(have==false){
			this.destroyF();
		}
	}

	private get相反缓动(now:string):string{
		if(now==null){return null;}
		if(now == "easeOutBack"){return "easeInOut";}
		return null;
	}
	
	private onAddTweenOne(key:string,	info:any):void{
		var child:any =this.View.getChildByName(key);
		var time:number;
		if(info[key]["time"] != null)	time= info[key]["time"];
		else							time= MyViewEffect.timeDefault; 
		if(this.typeIn==true){
			this.onSetStartWaite参数(key,false);
		}
		this.dicTweens.remove(key);
		if(info[key]["mc"] != null){
			var mcAni:com.MyClass.MySwf.SwfMovieClip=MySourceManager.getInstance().getObjFromSwf(info[key]["swf"],info[key]["mc"]);
			if(mcAni==null){
				console.log("没有找到"+key+"的入场动画："+info[key]["mc"]);
				return;
			}
			if(this.mmo==null){
				this.dicMc=new  Dictionary();
				this.mmo=new  MainManagerOne();
				this.mmo.addEnterFrameFun(Handler.create(this,this.enterF));
			}
			child.visible=false;
			var mmc:MyMC=new  MyMC(mcAni);
			mmc.loop=false;
			if(this.typeIn==true){
				mmc.stop();
			}else{
				mmc.gotoAndStop(mmc.totalFrames-1);
			}
			this.dicMc.set(key,mmc);
			mmc.x =child.x;
			mmc.y =child.y;
			this.View.addChild(mmc);
			return;
		}
		var spdx:number =0;
		var spdy:number =0;
		var tween:starling.Tween;
		if(info[key]["缓动"] == null){
			tween=new  starling.Tween(child,time);
		}else{
			if(this.typeIn==true){
				tween=new  starling.Tween(child,time,info[key]["缓动"]);
			}else{
				tween=new  starling.Tween(child,time,this.get相反缓动(info[key]["缓动"]));
			}
		}
		if(this.typeIn==true){
			var needXY:boolean=false;
			var endx:number=child.x;
			var endy:number=child.y;
			if(info[key]["x"] != null){//xy使用变化值而不是固定初始值
				child.x +=info[key]["x"];
				needXY=true;
			}
			if(info[key]["y"] != null){
				child.y +=info[key]["y"];
				needXY=true;
			}
			if(needXY){
				tween.moveTo(endx,endy);
			}
			if(info[key]["alpha"] != null){//透明度使用初始值而不是变化值
				var endAlhpa:Number =child.alpha;
				child.alpha = info[key]["alpha"];
				tween.fadeTo(endAlhpa);
			}
			if(info[key]["scale"] != null){//缩放使用初始值而不是变化值
				var endScale:Number=child.scale;
				child.scale = info[key]["scale"];
				tween.scaleTo(endScale);
			}
		}else{
			needXY=false;
			endx =child.x;
			endy =child.y;
			if(info[key]["x"] != null){//xy使用变化值而不是固定初始值
				endx =child.x +info[key]["x"];
				needXY=true;
			}
			if(info[key]["y"] != null){
				endy =child.y +info[key]["y"];
				needXY=true;
			}
			if(needXY){
				tween.moveTo(endx,endy);
			}
			if(info[key]["alpha"] != null){//透明度使用初始值而不是变化值
				endAlhpa =info[key]["alpha"];
				tween.fadeTo(endAlhpa);
			}
			if(info[key]["scale"] != null){//缩放使用初始值而不是变化值
				endScale=info[key]["scale"];
				tween.scaleTo(endScale);
			}
		}
		this.dicTweens.set(key,tween);
		tween.onComplete=Handler.create(this,this.onTweenEnd);
		tween.onCompleteArgs=[key];
		starling.Juggler.getInstance().add(tween);
	}
	
	private onSetStartWaite参数(key:string,start:boolean):void{
		if(this.info[key]["startWaite"]==null){return;}
		var child:any =this.View.getChildByName(key);
		for(var key2 in this.info[key]["startWaite"]){
			if(start==true){
				if(typeof this.info[key]["startWaite"][key2] == "number"){
					child[key2] += this.info[key]["startWaite"][key2];
				}else if(typeof this.info[key]["startWaite"][key2] == "boolean"){
					child[key2] = this.info[key]["startWaite"][key2];
				}else{
					console.log("startWaite中有无法操作的类型："+key2);
				}
			}else{
				if(typeof this.info[key]["startWaite"][key2] == "number"){
					child[key2] -= this.info[key]["startWaite"][key2];
				}else if(typeof this.info[key]["startWaite"][key2] == "boolean"){
					child[key2] = !this.info[key]["startWaite"][key2];
				}else{
					console.log("startWaite中有无法操作的类型："+key2);
				}
			}
		}
	}
	
	private enterF():void{
		for(var i:number=0;i<this.dicMc.keys.length;i++){
			var key:string =this.dicMc.keys[i];
			var mmc:MyMC=this.dicMc.get(key);
			if(this.typeIn==true){
				if(mmc.currentFrame >= mmc.totalFrames-1){
					var child:any =this.View.getChildByName(key);
					child.visible=true;
					mmc=Tool_ObjUtils.destroyF_One(mmc);
					this.dicMc.remove(key);
					i--;
				}else{
					mmc.nextFrame();
				}
			}else{
				if(mmc.currentFrame==0){
					child =this.View.getChildByName(key);
					child.visible=true;
					mmc=Tool_ObjUtils.destroyF_One(mmc);
					this.dicMc.remove(key);
					i--;
					this.onSetStartWaite参数(key,true);
				}else{
					mmc.preFrame();
				}
			}
		}
		if(this.dicMc.keys.length==0){
			this.dicMc=null;
			this.mmo=Tool_ObjUtils.destroyF_One(this.mmo);
			if(this.dicTweens==null){
				this.destroyF();
			}
		}
	}
	
	private onTweenEnd(key:string):void{
		if(this.info==null){
			console.log("MyViewEffect：tween时已被清理！");
			return;
		}
		if(this.dicTweens==null){return;}
		var t:starling.Tween=this.dicTweens.get(key);
		if(t){
			starling.Juggler.getInstance().remove(t);
			this.dicTweens.remove(key);
		}
		if(this.typeIn==false){
			this.onSetStartWaite参数(key,true);
		}
		if(this.dicTweens.keys.length==0){
			this.dicTweens=null;
			if(this.dicMc!=null){return;}
			this.destroyF();
		}
	}
	
	public destroyF():void{
		this.info=null;
		if(this.Fun){
			Tool_Function.onRunFunction(this.Fun);
			this.Fun=null;
		}
	}
}
}