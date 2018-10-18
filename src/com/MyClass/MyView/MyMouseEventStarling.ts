module com.MyClass.MyView{
import Handler=laya.utils.Handler;
import Tool_Function=com.MyClass.Tools.Tool_Function;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class MyMouseEventStarling{
	public Name:string;
	private MC:any;
	public  TouchID:number	= 0;
	private Dic_Click:any;
	private Dic_Slide:any;
	public startXY:any ={};
	public nowLocalXY:any ={};
	public worldXY:any ={};
	public isDown:boolean	= false;
	private pausing:boolean	= false;
	private stopEventMop:boolean	= false;
	public LStartMove:number	= 10;
	private FunEnter:Handler;
	private Dic_roll:any;

	constructor(tar:any){
		this.MC	= tar;
		Tool_Function.onTouchable(this.MC);
		this.MC.on(Laya.Event.MOUSE_DOWN, this, this.mouseHandler);
		this.MC.on(Laya.Event.MOUSE_UP, this, this.mouseHandler);
		this.MC.on(Laya.Event.MOUSE_MOVE, this, this.mouseHandler);
		this.MC.on(Laya.Event.MOUSE_OUT, this, this.mouseHandler);
	}
	public setValue(str:string,val:any =null):void
	{
		switch (str)
		{
			case "点击":
				this.newDicClick();
				this.Dic_Click["down"]		= false;
				(val as Handler).once=false;
				this.Dic_Click["fun_click"]		= val;
				break;
			case "down事件":
				this.newDicClick();
				(val as Handler).once=false;
				this.Dic_Click["fun_down"]		= val;
				break;
			case "up事件":
				this.newDicClick();
				(val as Handler).once=false;
				this.Dic_Click["fun_up"]			= val;
				break;
			case "滑动":
				this.Dic_Slide				  = {};
				this.Dic_Slide["初始x"]		= this.MC.x;
				this.Dic_Slide["初始y"]		= this.MC.y;
				this.Dic_Slide["上次x"]		= this.MC.x;
				this.Dic_Slide["上次y"]		= this.MC.y;
				this.Dic_Slide["开始移动"]	  = false;
				this.Dic_Slide["开始移动距离"]= this.LStartMove;
				this.Dic_Slide["满足滑动速度"]= 1;
				(val as Handler).once=false;
				this.Dic_Slide["fun"]			= val;
				break;
			case "停止本次":	this.upF(null);		break;
			case "暂停":		this.pausing	= val;	break;
			case "停止冒泡":	this.stopEventMop=true;	break;
			case "滚轮":
				if(val==null){
					if(this.Dic_roll){
						Config.mStage.off(laya.events.Event.MOUSE_WHEEL,this,this.onMouseWheel);
						this.Dic_roll=Tool_ObjUtils.destroyF_One(this.Dic_roll);
					}
				}else{
					if(this.Dic_roll == null){
						this.Dic_roll={};
						Config.mStage.on(laya.events.Event.MOUSE_WHEEL,this,this.onMouseWheel);
					}else{
						this.Dic_roll["fun"]=Tool_ObjUtils.destroyF_One(this.Dic_roll["fun"]);
					}
					this.Dic_roll["fun"]=val;
				}
				break;
			default:	this[str] = val;	break;
		}
	}
	
	private onMouseWheel(e:laya.events.Event):void{
		if(this.Dic_roll && this.Dic_roll["fun"]){
			var delta:number = e.delta;
			if (delta > 0) {//向上滚动：放大
			}
			Tool_Function.onRunFunction(this.Dic_roll["fun"],	delta);
		}else{
			Config.mStage.off(laya.events.Event.MOUSE_WHEEL,this,this.onMouseWheel);
			this.Dic_roll=Tool_ObjUtils.destroyF_One(this.Dic_roll);
		}
	}
	
	private newDicClick():void
	{
		if(this.Dic_Click)	return;
		this.Dic_Click	= Tool_ObjUtils.getNewObjectFromPool();
		this.Dic_Click["关闭点击距离"]	= 20;
	}

	/**
	 * 鼠标响应事件处理
	 */
	private mouseHandler(e:laya.events.Event=null):void
	{
		if(this.MC==null)return;
		var p:any ={};
		p["globalX"]=Laya.stage.mouseX;
		p["globalY"]=Laya.stage.mouseY;
		this.worldXY.x =p["globalX"];
		this.worldXY.y =p["globalY"];
		var pl:laya.maths.Point=this.MC.globalToLocal(new laya.maths.Point(p["globalX"],p["globalY"]));
		p["x"]=pl.x;
		p["y"]=pl.y;
		this.nowLocalXY.x =p.x;
		this.nowLocalXY.y =p.y;
		switch (e.type)
		{
			case laya.events.Event.MOUSE_DOWN:			this.downF(p);break;
			case laya.events.Event.MOUSE_UP:    		this.upF(p);break;
			case laya.events.Event.MOUSE_MOVE:			this.moveF(p);break;
			case laya.events.Event.MOUSE_OUT:			this.upF(p);break;

		}
	}
	private onRunF(f:any,arg:Array<any>):void{
		if(f instanceof Handler){
			if(arg==null || arg.length==0)	(f as Handler).run();
			else                            (f as Handler).runWith(arg);
		}else if(f instanceof Function){
			(f as Function).apply(null,arg);
		}
	}
		
	private downF(p:any):void
	{
		if(this.pausing == true)	return;
		if(this.isDown == true)	return;
		this.isDown	= true;
		if(this.Dic_Click != null)
		{
			this.Dic_Click["down"]	= true;
			this.Dic_Click["起点x"]		= p.globalX;
			this.Dic_Click["起点y"]		= p.globalY;
			if(this.Dic_Click["fun_down"] != null)	this.onRunF(this.Dic_Click["fun_down"],[p]);
		}
		if(this.Dic_Slide != null)
		{
			this.Dic_Slide["起点x"]		= p.globalX;
			this.Dic_Slide["起点y"]		= p.globalY;
//				Dic_Slide["上次x"]		= p.globalX;
//				Dic_Slide["上次y"]		= p.globalY;
			this.Dic_Slide["开始移动"]	= false;
			this.Dic_Slide["x速度"]		= 0;
			this.Dic_Slide["y速度"]		= 0;
			this.Dic_Slide["计时"]		= 0;
			if(this.FunEnter==null)this.FunEnter=Handler.create(this,this.enterFrameF,null,false);
			MainManager.getInstence().addEnterFrameFun(this.FunEnter);
		}
	}
		
	private upF(p:any):void
	{
		if(this.pausing == true)	return;
		if(this.isDown == false)	return;
		if(p != null && this.Dic_Click != null)
		{
			if((this.Dic_Slide==null || this.Dic_Slide["开始移动"]==false) && this.Dic_Click["down"] == true && this.Dic_Click["开始移动"]!=true)
			{
				if(this.Dic_Click["fun_up"] != null){
					this.onRunF(this.Dic_Click["fun_up"],[p]);
				}
				if(this.Dic_Click && this.Dic_Click["fun_click"] !=null){
					this.onRunF(this.Dic_Click["fun_click"],[p]);
				}
			}
			if(this.Dic_Click){
				this.Dic_Click["down"]	= false;
				this.Dic_Click["开始移动"]	=false;
			}
		}
		if(this.Dic_Slide != null && this.Dic_Slide["开始移动"] == true && p!=null)
		{
			var lx:number	= p.globalX;
			var ly:number	= p.globalY;
			var dic:any	= {};
			dic["类型"]	= "滑动";
			if(Math.abs(this.Dic_Slide["x速度"]) >= this.Dic_Slide["满足滑动速度"])			dic["x"]	= this.Dic_Slide["x速度"];
			else					dic["x"]	= 0;
			if(Math.abs(this.Dic_Slide["y速度"]) >= this.Dic_Slide["满足滑动速度"])			dic["y"]	= this.Dic_Slide["y速度"];
			else					dic["y"]	= 0;
			dic["gx"]=lx;
			dic["gy"]=ly;
			this.onRunF(this.Dic_Slide["fun"],[dic]);
			MainManager.getInstence().removeEnterFrameFun(this.FunEnter);
			this.FunEnter.clear();
			this.FunEnter=null;
		}
		else if(this.Dic_Slide != null)
		{
			dic	= {};
			dic["类型"]	= "滑动";
			dic["x"]	= 0;
			dic["y"]	= 0;
			this.onRunF(this.Dic_Slide["fun"],[dic]);
			MainManager.getInstence().removeEnterFrameFun(this.FunEnter);
			this.FunEnter.clear();
			this.FunEnter=null;
		}
		this.isDown	= false;
	}
	
	private moveF(p:any):void
	{
		if(this.pausing == true || p==null)	return;
		if(this.isDown == false)	return;
		var lx:number	= p.globalX;
		var ly:number	= p.globalY;
		if(this.Dic_Slide == null)
		{
			if(this.Dic_Click && this.Dic_Click["开始移动"] != true)
			{
				var L:number	= (lx - this.Dic_Click["起点x"]) * (lx - this.Dic_Click["起点x"]) + (ly - this.Dic_Click["起点y"]) * (ly - this.Dic_Click["起点y"]);
				L	= Math.sqrt(L);
				if(L > this.LStartMove)	this.Dic_Click["开始移动"]	= true;
			}
			return;
		}
		this.Dic_Slide["计时"]	= 3;
		var dic:any	= {};
		if(this.Dic_Slide["开始移动"]	== false)
		{
			L	= (lx - this.Dic_Slide["起点x"]) * (lx - this.Dic_Slide["起点x"]) + (ly - this.Dic_Slide["起点y"]) * (ly - this.Dic_Slide["起点y"]);
			L	= Math.sqrt(L);
			if(L > this.Dic_Slide["开始移动距离"])
			{
				this.Dic_Slide["开始移动"]	= true;
				this.Dic_Slide["上次x"]=lx;
				this.Dic_Slide["上次y"]=ly;
			}
		}
		if(this.Dic_Slide["开始移动"]	== true)
		{
			if(this.Dic_Click != null && this.Dic_Click["down"] == true)
			{
				L	= (lx - this.Dic_Slide["起点x"]) * (lx - this.Dic_Slide["起点x"]) + (ly - this.Dic_Slide["起点y"]) * (ly - this.Dic_Slide["起点y"]);
				L	= Math.sqrt(L);
				if(L > this.Dic_Click["关闭点击距离"])
				{
					this.Dic_Click["down"] = false;
				}
			}
			dic["类型"]="移动";
			if(lx != 0)	dic["x"]	= lx - this.Dic_Slide["上次x"];
			else			dic["x"]	= 0;
			if(ly != 0)	dic["y"]	= ly - this.Dic_Slide["上次y"];
			else			dic["y"]	= 0;
			if(dic["x"] == 0)	this.Dic_Slide["x速度"]	= 0;
			else if((this.Dic_Slide["x速度"] > 0 && dic["x"] > 0) || (this.Dic_Slide["x速度"] < 0 && dic["x"] < 0))
				this.Dic_Slide["x速度"]	= (this.Dic_Slide["x速度"] + dic["x"]) / 2;
			else
				this.Dic_Slide["x速度"]	= dic["x"] / 2;
			if(dic["y"] == 0)	this.Dic_Slide["y速度"]	= 0;
			else if((this.Dic_Slide["y速度"] > 0 && dic["y"] > 0) || (this.Dic_Slide["y速度"] < 0 && dic["y"] < 0))
				this.Dic_Slide["y速度"]	= (this.Dic_Slide["y速度"] + dic["y"]) / 2;
			else
				this.Dic_Slide["y速度"]	= dic["y"] / 2;
			this.Dic_Slide["上次x"]		= lx;
			this.Dic_Slide["上次y"]		= ly;
			dic["gx"]=lx;
			dic["gy"]=ly;
			this.onRunF(this.Dic_Slide["fun"],[dic]);
		}
	}
	
	private enterFrameF():void
	{
		if(this.pausing == true)	return;
		if(this.isDown == false)	return;
		this.Dic_Slide["计时"]	-= 1;
		if(this.Dic_Slide["计时"] <= 0)
		{
			this.Dic_Slide["计时"]	= 0;
			this.Dic_Slide["x速度"]	= 0;
			this.Dic_Slide["y速度"]	= 0;
		}
	}
		
		
	public destroyF():void
	{
		if(this.MC){
			this.MC.off(laya.events.Event.MOUSE_DOWN, this, this.mouseHandler);
			this.MC.off(laya.events.Event.MOUSE_UP, this, this.mouseHandler);
			this.MC.off(laya.events.Event.MOUSE_MOVE, this, this.mouseHandler);
			this.MC.off(laya.events.Event.MOUSE_OUT, this, this.mouseHandler);
			this.MC	= null;
		}
		MainManager.getInstence().removeEnterFrameFun(this.enterFrameF);
		if(this.FunEnter){
			this.FunEnter.clear();
			this.FunEnter=null;
		}
		this.Dic_Slide=Tool_ObjUtils.destroyF_One(this.Dic_Slide);
		this.Dic_Click=Tool_ObjUtils.destroyF_One(this.Dic_Click);
		if(this.Dic_roll){
			Config.mStage.off(laya.events.Event.MOUSE_WHEEL,this,this.onMouseWheel);
			this.Dic_roll=Tool_ObjUtils.destroyF_One(this.Dic_roll);
		}
	}
}
}