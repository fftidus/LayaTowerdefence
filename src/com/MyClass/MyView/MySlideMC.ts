module com.MyClass.MyView{
import SwfImage=com.MyClass.MySwf.SwfImage;
export class MySlideMC extends starling.Sprite{
	private ST:string;		/**mid:滑到中间，	max：滑到底（可省下100），	min：超过rec就停**/
	private canGoOut:boolean;	/**可以滑过并回弹**/
	public Layer:starling.Sprite;
	private Arr_one:Array<any>;
	private MC_Control:any;
	private showRec:laya.maths.Rectangle;
	private busy:boolean	= false;
	private	Scroll:any;
	private Canv:starling.Sprite;
	
	public canX:boolean;
	public maxX:number	= 0;
	public minX:number;
	public canY:boolean;
	public maxY:number	= 0;
	public minY:number;
	
	public _w0:number;
	public _h0:number;
	
	private imgTouming:SwfImage;
	private MME:MyMouseEventStarling;
	private BC:BTNControllerStarling;
	private Fun_clickBtn:laya.utils.Handler;
	private Fun_clickBtn2:laya.utils.Handler;
	private Fun_click:laya.utils.Handler;
	private Fun_move:laya.utils.Handler;
	private Fun_down:laya.utils.Handler;
	public  BC2:BTNControllerStarling;
	public	autoClearLayer:boolean=true;
	public	FunOnBottom:laya.utils.Handler;//类似微博，滑到顶或者底则触发
	public	FunOnTop:laya.utils.Handler;//类似微博，滑到顶或者底则触发
	public	FunStop:laya.utils.Handler;//当停下来就触发
	
	private autoDestroy:boolean=false;
	public nowFirstIndex:number=0;
	private Fun_xyChange:laya.utils.Handler=laya.utils.Handler.create(this,this.xyChange,null,false);

	public constructor(spr:starling.Sprite,cx:boolean,cy:boolean,rec:laya.maths.Rectangle,  showType:string = "mid",canout:boolean = true) {
		super();
		this.Layer	= spr;
		this.canX	= cx;
		this.canY	= cy;
		this.showRec	= rec;
		this.ST		= showType;
		this.canGoOut	= canout;
		Tools.Tool_Function.onTouchable(this.Layer);
		if(this.Layer.parent)
		{
			Tools.Tool_SpriteUtils.onAddchild_ReplaceParent(this,this.Layer)
			this.setValue("rec",rec);
		}
		else
		{
			this.addChild(this.Layer);
		}
	}

	public addedToStageF():void
	{
		this.setValue("rec",this.showRec);
	}
	
	public setValue(type:string,	val:any = null):void
	{
		switch (type)
		{
			case "rec":
				if(val != null)
				{
					this.showRec= val;
					this.maxX	= this.Layer.x;
					this.maxY	= this.Layer.y;
				}
				this.checkMINXY();
				break;
			case "按钮集":
				if(val[0] instanceof Array)
				{
					if(this.Fun_clickBtn)this.Fun_clickBtn.clear();
					this.Fun_clickBtn	= val[1];
					if(this.Fun_clickBtn)this.Fun_clickBtn.once=false;
					if(this.BC)	this.BC.destroyF();
					this.BC	= new BTNControllerStarling(this.Layer,val[0],laya.utils.Handler.create(this,this.clickBtn));
					this.BC.canSlide	= false;
					this.Arr_one=val[0];
					this.onCheckVisible();
				}
				break;
			case "按钮集2":
				if(val[0] instanceof Array && val[1] instanceof Array)
				{
					if(this.Fun_clickBtn)this.Fun_clickBtn.clear();
					this.Fun_clickBtn	= val[2];
					this.Fun_clickBtn.once=false;
					if(this.Fun_clickBtn2)this.Fun_clickBtn.clear();
					this.Fun_clickBtn2=val[3];
					this.Fun_clickBtn2.once=false;
					if(this.BC)	this.BC.destroyF();
					this.BC	= new BTNControllerStarling(this.Layer,val[0],laya.utils.Handler.create(this,this.clickBtn));
					this.BC.canSlide	= false;
					if(val[4]!=null)	this.Arr_one=val[4];
					this.BC2=Tools.Tool_ObjUtils.destroyF_One(this.BC2);
					this.BC2	= new BTNControllerStarling(this.Layer,val[1],laya.utils.Handler.create(this,this.clickBtn2));
					this.BC2.canSlide	= false;
					this.onCheckVisible();
				}
				break;
			case "按钮集自动清理":
				if(this.BC)this.BC.autoClear=true;
				break;
			case "透明图":
				if(this.imgTouming)
				{
					this.imgTouming.removeFromParent(true);
				}
				this.imgTouming	= val;
				this.imgTouming.touchable=true;
				this.addChildAt(this.imgTouming,0);
				this.rejuseSize();
				break;
			case "移动事件":	this.Fun_move	= val;	break;
			case "down事件":
				this.Fun_down	= val;
				this.MME.setValue("down事件",this.Fun_down);
				break;
			case "x滑动":	this.canX	= val;	this.rejuseSize();	break;
			case "y滑动":	this.canY	= val;	this.rejuseSize();	break;
			case "回弹":	this.canGoOut	= val;	break;
			case "底层":	this.addChildAt(val,0);	break;
			case "点击事件":
				this.Fun_click	= val;
				this.MME.setValue("点击",laya.utils.Handler.create(this,this.clickNoneF,null,false));
				break;
			case "暂停":		this.busy	= val;	break;
			case "滑动条":
				this.Scroll	= val;
				if(this.Scroll)
				{
					if(this.canX)	this.Scroll.init(-this.minX,this.showRec.width);
					else		this.Scroll.init(-this.minY,this.showRec.height);
				}
				break;
			case "改变x":
				if(this.canX)
				{
					if(val > this.maxX)		val	= this.maxX;
					else if(val < this.minX)	val	= this.minX;
				}
				this.Layer.x	= val;
				this.Fun_xyChange.run();
				break;
			case "改变y":
				if(this.canY)
				{
					if(val > this.maxY)		val	= this.maxY;
					else if(val < this.minY)	val	= this.minY;
				}
				this.Layer.y	= val;
				this.Fun_xyChange.run();
				break;
			case "控制元件":
				this.MC_Control	= val;
				if(this.MME)		this.MME.destroyF();
				this.MME	 = new MyMouseEventStarling(this.MC_Control);
				this.MME.setValue("滑动",laya.utils.Handler.create(this,this.slideF));
				if(this.Fun_click)		this.MME.setValue("点击",laya.utils.Handler.create(this,this.clickNoneF));
				break;
			case "停止冒泡":
				this.MME.setValue("停止冒泡");
				this.BC.typeEventMop="触发禁止";
				break;
			case "自动销毁":
				this.autoDestroy=true;
				break;
		}
	}

	private xyChange():void
	{
		if(this.Fun_move)	this.Fun_move.run();
		if(this.Scroll)
		{
			if(this.canY)	this.Scroll.changeNow(-this.Layer.y);
			else		this.Scroll.changeNow(-this.Layer.x);
		}
		this.onCheckVisible();
	}
	
	public checkMINXY():void
	{
		this.minX	= this.maxX;
		this.minY	= this.maxY;
		if(this.Canv){
			this.Canv=null;
			this.mask=null;
		}
		this.Canv= new starling.Sprite();
        // this.Canv.graphics.drawRect(0,0,this.showRec.width,this.showRec.height);
		 //画线
		// this.sp.graphics.drawLine(10, 58, 146, 58, "#ff0000", 3);
		//画连续直线
		// this.sp.graphics.drawLines(176, 58, [0, 0, 39, -50, 78, 0, 117, 50, 156, 0], "#ff0000", 5);
		//画曲线
		// this.sp.graphics.drawCurves(352, 58, [0, 0, 19, -100, 39, 0, 58, 100, 78, 0, 97, -100, 117, 0, 136, 100, 156, 0], "#ff0000", 5);
		//画矩形
		this.Canv.graphics.drawRect(0, 0, this.showRec.width,this.showRec.height, "#ffff00");
		//画多边形
		// this.sp.graphics.drawPoly(264, 166, [0, 0, 60, 0, 78.48, 57, 30, 93.48, -18.48, 57], "#ffff00");
		//画三角形
		// this.sp.graphics.drawPoly(400, 166, [0, 100, 50, 0, 100, 100], "#ffff00");
		//画圆
		// this.sp.graphics.drawCircle(98, 332, 50, "#00ffff");
		//画扇形
		// this.sp.graphics.drawPie(240, 290, 100, 10, 60, "#00ffff");
		//绘制圆角矩形，自定义路径
		// this.sp.graphics.drawPath(400, 310, [["moveTo", 5, 0], ["lineTo", 105, 0], ["arcTo", 110, 0, 110, 5, 5], ["lineTo", 110, 55], ["arcTo", 110, 60, 105, 60, 5], ["lineTo", 5, 60], ["arcTo", 0, 60, 0, 55, 5], ["lineTo", 0, 5], ["arcTo", 0, 0, 5, 0, 5], ["closePath"]], {fillStyle: "#00ffff"});


		this.mask=this.Canv;
		if(this.ST == "mid")
		{
			this.minX	+= (this.showRec.width >> 1) - this.Layer.width;
			this.minY	+= (this.showRec.height >> 1)- this.Layer.height;
		}
		else if(this.ST=="max")
		{
			this.minX	+= -this.Layer.width + 100;
			this.minY	+= -this.Layer.height+ 100;
		}
		else
		{
			this.minX	+= this.showRec.width - this.Layer.width;
			this.minY	+= this.showRec.height- this.Layer.height;
		}
		if(this.minX > this.maxX)	this.minX	= this.maxX;
		if(this.minY > this.maxY)	this.minY	= this.maxY;
		if(this.Scroll)
		{
			this.setValue("滑动条",this.Scroll);
		}
		this.rejuseSize();
	}
	
	public rejuseSize():void
	{
		//在改变了Layer的大小后调用
		//在改变了rec后调用
		if(this.imgTouming)
		{
			this.imgTouming.x=this.showRec.x;
			this.imgTouming.y=this.showRec.y;
			this.imgTouming.width	=this.showRec.width;
			this.imgTouming.height	= this.showRec.height;
		}
		if(this.MME)		this.MME.destroyF();
		this.MME	 = new MyMouseEventStarling(Laya.stage);
		this.MME.setValue("down事件",laya.utils.Handler.create(this,this.onDownF,null,false));
		this.MME.setValue("滑动",laya.utils.Handler.create(this,this.slideF));
		if(this.Fun_click)	this.MME.setValue("点击",laya.utils.Handler.create(this,this.clickNoneF));
	}
	private isDown:boolean=false;
	private onDownF(p:any):void{
		var gp = this.localToGlobal(new laya.maths.Point(0,0));
		if(p.x >= gp.x && p.y >= gp.y && p.x - gp.x <= this.showRec.width && p.y-gp.y<=this.showRec.height){
			this.isDown=true;
		}else{
			this.isDown=false;
		}
	}

	private slideF(dic:Object):void
	{
		if(this.busy || this.isDown==false)	return;
		if(this.MME==null){
			console.log("MME == NULL !!!!!");
			return;
		}
		if(dic["类型"] == "移动")
		{
			if(this.FunStop)MainManager.getInstence().MTM.newTween(this.Layer,null);
			if(this.FunOnBottom)this.FunOnBottom.runWith("中断");
			if(this.FunOnTop)this.FunOnTop.runWith("中断");
			if(this.canX)
			{
				if(this.Layer.x > this.maxX && dic["x"] > 0)
				{
					if(this.canGoOut)	this.Layer.x	+= dic["x"]/3;
				}
				else if(this.Layer.x < this.minX && dic["x"] < 0)
				{
					if(this.canGoOut)	this.Layer.x	+= dic["x"]/3;
				}
				else
				{
					this.Layer.x	+= dic["x"];
				}
			}
			if(this.canY)
			{
				if(this.Layer.y > this.maxY && dic["y"] > 0)
				{
					if(this.canGoOut)	this.Layer.y	+= dic["y"]/3;
				}
				else if(this.Layer.y < this.minY && dic["y"] < 0)
				{
					if(this.canGoOut)	this.Layer.y	+= dic["y"]/3;
				}
				else	this.Layer.y	+= dic["y"];
			}
			if(this.BC2)this.BC2.pauseF(false);
			if(this.BC)this.BC.pauseF(false);
			this.Fun_xyChange.run();
		}
		else if(dic["类型"] == "滑动")
		{
			if(this.FunOnBottom && this.canY){
				if(dic["y"]>0 && this.Layer.y>=this.maxY)
				{
					if(this.FunOnBottom.runWith("开始")==true)	return;
				}
			}
			if(this.FunOnTop && this.canY){
				if(dic["y"]<0 && this.Layer.y<=this.minY)
				{
					if(this.FunOnBottom.runWith("开始")==true)	return;
				}
			}
			this.isDown=false;
			var t:Tools.MyTween	= new Tools.MyTween(this.Layer,laya.utils.Handler.create(this,this.onTStop),null
			,laya.utils.Handler.create(this,this.xyChange),null);
			t.initXYLine(dic["x"],dic["y"],this.minX,this.maxX,this.minY,this.maxY,	this.canX,this.canY,this.canGoOut);
		}
	}

	public onCheckVisible():void{
		if(this.Arr_one==null)return;
		return;
		var i:number;
		if(this.canX && this._w0>0){
			for(i=0;i<this.Arr_one.length;i++){
				if(this.Arr_one[i]==null)continue;
				if(this.Arr_one[i].x+this.Layer.x < this.showRec.x-this._w0 || this.Arr_one[i].x+this.Layer.x > this.showRec.width){
					this.Arr_one[i].visible=false;
				}else{
					this.Arr_one[i].visible=true;
				}
			}
		}
		if(this.canY && this._h0>0){
			var count:number=0;
			for(i=0;i<this.Arr_one.length;i++){
				if(this.Arr_one[i]==null)continue;
				if(this.Arr_one[i].y+this.Layer.y < this.showRec.y- this._h0 || this.Arr_one[i].y+this.Layer.y > this.showRec.height){
					this.Arr_one[i].visible=false;
				}else{
					this.Arr_one[i].visible=true;
					count++;
				}
			}
		}
	}
	
	private onTStop():void
	{
		if(this.FunStop)this.FunStop.run();
	}
	
	private clickNoneF(p:any = null):void
	{
		if(this.busy)	return;
		if(p){
			p.x -=this.Layer.x;
			p.y -=this.Layer.y;
		}
		this.Fun_click.runWith(p);
	}

	private clickBtn(n:number):void
	{
		if(this.busy)	return;
		this.MME.setValue("停止本次");
		if(this.Fun_clickBtn){
			if(this.autoDestroy==null)	this.Fun_clickBtn.runWith(n);
			else						this.Fun_clickBtn.runWith(this.nowFirstIndex+n);
		}
	}
	private clickBtn2(n:number):void
	{
		if(this.busy)	return;
		this.MME.setValue("停止本次");
		if(this.Fun_clickBtn2){
			if(this.autoDestroy==null)	this.Fun_clickBtn2.runWith(n);
			else						this.Fun_clickBtn2.runWith(this.nowFirstIndex+n);
		}
	}
	
	public removeAt(n:number,		parent层级:number=0):void
	{
		if(this.BC==null || this.BC.Arr_Btn==null || n>=this.BC.Arr_Btn.length)return;
		if(n<this.BC.Arr_Btn.length-1 && this.BC.Arr_Btn.length>1)
		{
			var L:number;
			if(this.canY)	L=getBtnY(n+1) - getBtnY(n);
			else			L=getBtnX(n+1) - getBtnX(n);
			for(var i:number=n+1;i<this.BC.Arr_Btn.length;i++)
			{
				if(this.canY)	setBtnY(i,-L);
				else			setBtnX(i,-L);
			}
		}
		if(parent层级==1)
		{
			if(this.BC.Arr_Btn[n] instanceof BTN_Virtual)	Tools.Tool_ObjUtils.destroyF_One(this.BC.Arr_Mc[n].parent);
			else											Tools.Tool_ObjUtils.destroyF_One(this.BC.Arr_Btn[n].parent);
		}
		else if(parent层级==2)
		{
			if(this.BC.Arr_Btn[n] instanceof BTN_Virtual)	Tools.Tool_ObjUtils.destroyF_One(this.BC.Arr_Mc[n].parent.parent);
			else											Tools.Tool_ObjUtils.destroyF_One(this.BC.Arr_Btn[n].parent.parent);
		}
		Tools.Tool_ObjUtils.destroyF_One(this.BC.Arr_Btn[n]);
		Tools.Tool_ObjUtils.destroyF_One(this.BC.Arr_Mc[n]);
		this.BC.removeIndex(n);
		if(this.BC2)this.BC2.removeIndex(n);
		if(this.canY)
		{
			this.minY+=L;
			if(this.minY > this.maxY)	this.minY	= this.maxY;
			this.setValue("改变y",this.Layer.y);
		}
		else
		{
			this.minX+=L;
			if(this.minX > this.maxX)	this.minX	= this.maxX;
			this.setValue("改变x",this.Layer.x);
		}
		
		function getBtnY(index:number):number
		{
			var b:any =this.BC.Arr_Btn[index];
			try{
				if(b instanceof BTN_Virtual)
				{
					if(parent层级==0)		return (b as BTN_Virtual).startY;
					if(this.BC.Arr_Mc[index]){
						if(parent层级==1)	return this.BC.Arr_Mc[index].parent.y;
						else if(parent层级==2)	return this.BC.Arr_Mc[index].parent.parent.y;
					}else{
						return (b as BTN_Virtual).startY;
					}
				}
				else if(b instanceof BTN_Starling)
				{
					if(parent层级==0)			return b.y;
					else if(parent层级==1)	return (b.parent as laya.display.Sprite).y;
					else if(parent层级==2)	return (b.parent.parent as laya.display.Sprite).y;
				}
				if(parent层级==0)			return b.y;
				else if(parent层级==1)	return b.parent.y;
				else if(parent层级==2)	return b.parent.parent.y;
				return b.y;
			}catch(e){
				return 0;
			}
		}
		function getBtnX(index:number):number
		{
			var b:any =this.BC.Arr_Btn[index];
			try{
				if(b instanceof BTN_Virtual)
				{
					if(parent层级==0)			return this.BC.Arr_Mc[index].x;
					else if(parent层级==1)	return this.BC.Arr_Mc[index].parent.x;
					else if(parent层级==2)	return this.BC.Arr_Mc[index].parent.parent.x;
				}
				else if(b instanceof BTN_Starling)
				{
					if(parent层级==0)			return b.x;
					else if(parent层级==1)	return (b.parent as laya.display.Sprite).x;
					else if(parent层级==2)	return (b.parent.parent as laya.display.Sprite).x;
				}
				if(parent层级==0)			return b.x;
				else if(parent层级==1)	return b.parent.x;
				else if(parent层级==2)	return b.parent.parent.x;
				return b.x;
			}catch(e){
				return 0;
			}
		}
		function setBtnY(index:number,	y0:number):void
		{
			var b:any;
			b=this.BC.Arr_Btn[index];
			try{
				if(b instanceof BTN_Virtual)
				{
					(b as BTN_Virtual).startY+=y0;
					(b as BTN_Virtual).endY+=y0;
					if(this.BC.Arr_Mc[index]){
						if(parent层级==0)			this.BC.Arr_Mc[index].y+=y0;
						else if(parent层级==1)	this.BC.Arr_Mc[index].parent.y+=y0;
						else if(parent层级==2)	this.BC.Arr_Mc[index].parent.parent.y+=y0;
					}else{
						if(b.tar)	b.tar.y+=y0;
					}
				}
				else if(b instanceof BTN_Starling)
				{
					(b as BTN_Starling).BtnVir.startY+=y0;
					(b as BTN_Starling).BtnVir.endY+=y0;
					if(parent层级==0)			b.y+=y0;
					else if(parent层级==1)	(b.parent as laya.display.Sprite).y+=y0;
					else if(parent层级==2)	(b.parent.parent as laya.display.Sprite).y+=y0;
				}
				if(this.BC2)
				{
					b=this.BC2.Arr_Btn[index];
					if(b instanceof BTN_Virtual)
					{
						(b as BTN_Virtual).startY+=y0;
						(b as BTN_Virtual).endY+=y0;
					}
					else if(b instanceof BTN_Starling)
					{
						(b as BTN_Starling).BtnVir.startY+=y0;
						(b as BTN_Starling).BtnVir.endY+=y0;
					}
				}
			}catch(e){
			}
		}
		function setBtnX(index:number,	x0:number):void
		{
			var b:any;
			try{
				b=this.BC.Arr_Btn[index];
				if(b instanceof BTN_Virtual)
				{
					(b as BTN_Virtual).startX+=x0;
					(b as BTN_Virtual).endX+=x0;
					if(parent层级==0)			this.BC.Arr_Mc[index].y+=x0;
					else if(parent层级==1)	this.BC.Arr_Mc[index].parent.x+=x0;
					else if(parent层级==2)	this.BC.Arr_Mc[index].parent.parent.x+=x0;
				}
				else if(b instanceof BTN_Starling)
				{
					(b as BTN_Starling).BtnVir.startX+=x0;
					(b as BTN_Starling).BtnVir.endX+=x0;
					if(parent层级==0)			b.x+=x0;
					else if(parent层级==1)	(b.parent as laya.display.Sprite).x+=x0;
					else if(parent层级==2)	(b.parent.parent as laya.display.Sprite).x+=x0;
				}
				if(this.BC2)
				{
					b=this.BC2.Arr_Btn[index];
					if(b instanceof BTN_Virtual)
					{
						(b as BTN_Virtual).startX+=x0;
						(b as BTN_Virtual).endX+=x0;
					}
					else if(b instanceof BTN_Starling)
					{
						(b as BTN_Starling).BtnVir.startX+=x0;
						(b as BTN_Starling).BtnVir.endX+=x0;
					}
				}
			}catch(e){
				
			}
		}
	}
	
	public getNowShowArea():laya.maths.Rectangle
	{
		return new laya.maths.Rectangle(-this.Layer.x,-this.Layer.y,this.showRec.width,this.showRec.height);
	}
	public getValue(want:String):any
	{
		// return this[want];
	}
	
	public destroyF():void
	{
		if(this.MME)
		{
			this.MME.destroyF();
			this.MME	= null;
		}
		if(this.BC)
		{
			this.BC.destroyF();
			this.BC	= null;
		}
		if(this.Canv){
			this.Canv.graphics.clear();
			this.Canv.destroy();
			this.Canv=null;
		}
		if(this.Scroll)
		{
			this.Scroll.destroyF();
			this.Scroll=null;
		}
		if(this.autoClearLayer)
		{
			this.BC2=Tools.Tool_ObjUtils.destroyF_One(this.BC2);
			this.Layer.removeFromParent(true);
		}
		this.Layer=null;
		this.Arr_one=null;
		if(this.Fun_clickBtn){
			this.Fun_clickBtn.clear();
			this.Fun_clickBtn=null;
		}
		if(this.Fun_clickBtn2){
			this.Fun_clickBtn2.clear();
			this.Fun_clickBtn2=null;
		}
		if(this.Fun_click){
			this.Fun_click.clear();
			this.Fun_click=null;
		}
		if(this.Fun_move){
			this.Fun_move.clear();
			this.Fun_move=null;
		}
		if(this.Fun_down){
			this.Fun_down.clear();
			this.Fun_down=null;
		}
		if(this.FunOnBottom){
			this.FunOnBottom.clear();
			this.FunOnBottom=null;
		}
		if(this.FunOnTop){
			this.FunOnTop.clear();
			this.FunOnTop=null;
		}
		if(this.FunStop){
			this.FunStop.clear();
			this.FunStop=null;
		}
		if(this.Fun_xyChange){
			this.Fun_xyChange.clear();
			this.Fun_xyChange=null;
		}
		this.removeFromParent(true);
	}
}
}