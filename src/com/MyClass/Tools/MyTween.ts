module com.MyClass.Tools{
export class MyTween{
	private role:any;	//添加鼠标事件的元件
	private FunOver:laya.utils.Handler;
	private FunVal:any;
	private FunRun:laya.utils.Handler;
	private FunVal2:any;
	private type:string;
	private moveType:string;
	
	private FR:number	= 1;	//摩擦力----每秒减少多少
	//----------xy位移-----------------
	private canX:boolean;
	private canY:boolean;
	private spdXYMax:number	= 30;
	private FirstX:number;
	private FirstY:number;
	private spd_x_now:number;
	private spd_y_now:number;
	private endX0:number;
	private endX1:number;
	private endY0:number;
	private endY1:number;
	private a_X:number;
	private a_Y:number;
	private moreX:number;
	private moreY:number;
	private secondLimite:number		= 0.5;
	private secondLimiteBack:number	= 0.15;
	private canOut:boolean;
	//----------元件状态变化-------------------------
	private spdAlph:number;
	private endAlph:number;
	private spdScal:number;
	private endScal:number;
	private spdRo:number;
	private endRo:number;
	//----------指定参数变化-------------------------
	private Arr_Values:Array<any>;
	private Arr_ValuesEnd:Array<any>;
	private Arr_ValuesSpd:Array<any>;
	public constructor(mc:any,fover:laya.utils.Handler = null,val:any = null,frun:laya.utils.Handler = null,val2:any = null) {
		this.role =mc;
		this.FunOver =fover;
		this.FunVal =val;
		this.FunRun =frun;
		this.FunVal2 =val2;
	}

	public initXYLine(spdX0:number,spdY0:number,	_endX0:number,_endX1:number,_endY0:number,_endY1:number,cx:boolean,cy:boolean,canout:boolean = true):void
	{
		this.type		= "xy";
		this.moveType	= "line";
		this.canOut		= canout;
		if(spdX0 > this.spdXYMax)		spdX0	= this.spdXYMax;
		else if(spdX0 < -this.spdXYMax)	spdX0	= -this.spdXYMax;
		if(spdY0 > this.spdXYMax)		spdY0	= this.spdXYMax;
		else if(spdY0 < -this.spdXYMax)	spdY0	= -this.spdXYMax;
		this.spd_x_now	= spdX0;	this.FirstX	= spdX0;
		this.spd_y_now	= spdY0;	this.FirstY	= spdY0;
		this.endX0		= _endX0;	this.endX1		= _endX1;
		this.endY0		= _endY0;	this.endY1		= _endY1;
		if(spdX0 != 0 && (Math.abs(spdX0) / this.FR) > this.secondLimite)	this.FR	= Math.abs(spdX0) / this.secondLimite;
		if(spdY0 != 0 && (Math.abs(spdY0) / this.FR) > this.secondLimite)	this.FR	= Math.abs(spdY0) / this.secondLimite;
		this.FR		= this.FR / Config.playSpeedTrue;
		this.moreX		= 0;
		this.moreY		= 0;
		this.canX		= cx;
		if(this.canX	== true)
		{
			if(this.spd_x_now > 0)		this.a_X	= -this.FR;
			else if(this.spd_x_now < 0)	this.a_X	= this.FR;
			else
			{
				//					trace("初速度 == 0时：",role.x,endX1,endX0);
				if(this.role.x > this.endX1)
				{
					this.moreX	= this.role.x - this.endX1;
					this.spd_x_now	= -this.moreX / (this.secondLimiteBack * Config.playSpeedTrue);
				}
				else if(this.role.x < this.endX0)
				{
					this.moreX	= this.role.x - this.endX0;
					this.spd_x_now	= -this.moreX / (this.secondLimiteBack * Config.playSpeedTrue);
				}
				else
				{
					this.stopF();
					return;
				}
			}
		}
		this.canY		= cy;
		if(this.canY == true)
		{
			if(this.spd_y_now > 0)		this.a_Y	= -this.FR;
			else if(this.spd_y_now < 0)	this.a_Y	= this.FR;
			else
			{
				if(this.role.y > this.endY1)
				{
					this.moreY	= this.role.y - this.endY1;
					this.spd_y_now	= -this.moreY / (this.secondLimiteBack * Config.playSpeedTrue);
				}
				else if(this.role.y < this.endY0)
				{
					this.moreY	= this.role.y - this.endY0;
					this.spd_y_now	= -this.moreY / (this.secondLimiteBack * Config.playSpeedTrue);
				}
				else
				{
					this.stopF();
					return;
				}
			}
		}
		MainManager.getInstence().MTM.newTween(this.role,this);
	}

	public initMCChange(spdx:number,endx:number,spdy:number,endy:number,
									 spdalph:number,endalph:number,
									 _spdScal:number,_endScal:number,
									 _spdRo:number = 0,_endRo:number = 0):void
	{
		//元件状态改变
		this.type		= "元件变化";
		this.spd_x_now	= spdx;
		this.endX0	= endx;
		this.spd_y_now	= spdy;
		this.endY0	= endy;
		this.spdAlph		= spdalph;
		this.endAlph		= endalph;
		this.spdScal		= _spdScal;
		this.endScal		= _endScal;
		this.spdRo		= _spdRo;
		this.endRo		= _endRo;
		MainManager.getInstence().MTM.newTween(this.role,this);
	}
	
	public init指定参数Change(_names:Array<string>,	_end:Array<number>,_spd:Array<number>):void
	{
		//元件状态改变
		this.type		= "指定参数";
		this.Arr_Values	= _names;
		this.Arr_ValuesEnd	= _end;
		this.Arr_ValuesSpd	= _spd;
		MainManager.getInstence().MTM.newTween(this.role,this);
	}
	
	public moveF():void
	{
		if(this.role==null)return;
		switch (this.type)
		{
			case "xy":		this.xyMove();	break;
			case "元件变化":	this.mcChange();	break;
			case "指定参数":	this.onSPEValueF();	break;
		}
	}
	
	private xyMove():void
	{
		var overx:boolean	= true;
		var overy:boolean	= true;
		if(this.canX == true)
		{
			overx	= false;
			this.role.x	+= this.spd_x_now;
			if(this.moreX != 0)
			{
				if(this.moreX > 0)
				{
					if(this.role.x <= this.endX1)
					{
						this.role.x	= this.endX1;
						overx	= true;
					}
				}
				else
				{
					if(this.role.x >= this.endX0)
					{
						this.role.x	= this.endX0;
						overx	= true;
					}
				}
			}
			else
			{
				if(this.FirstX > 0)
				{
					if(this.spd_x_now + this.a_X <= 0)
					{
						if(this.role.x > this.endX1)
						{
							if(this.canOut)
							{
								this.moreX	= this.role.x - this.endX1;
								this.spd_x_now	= -this.moreX / (this.secondLimiteBack * Config.playSpeedTrue);
							}
							else
							{
								this.role.x	= this.endX1;	overx	= true;
							}
						}
						else	overx	= true;
					}
					else
					{
						if(this.role.x > this.endX1)
						{
							if(this.canOut)	this.spd_x_now	+= this.a_X;
							else
							{
								this.role.x	= this.endX1;	overx	= true;
							}
						}
						this.spd_x_now	+= this.a_X;
					}
				}
				else if(this.FirstX < 0)
				{
					if(this.spd_x_now+this.a_X>= 0)
					{
						if(this.role.x < this.endX0)
						{
							if(this.canOut)
							{
								this.moreX	= this.role.x - this.endX0;
								this.spd_x_now	= -this.moreX / (this.secondLimiteBack * Config.playSpeedTrue);
							}
							else
							{
								this.role.x	= this.endX0;	overx	= true;
							}
						}
						else	overx	= true;
					}
					else
					{
						if(this.role.x < this.endX0)
						{
							if(this.canOut)	this.spd_x_now	+= this.a_X;
							else
							{
								this.role.x	= this.endX0;	overx	= true;
							}
						}
						this.spd_x_now	+= this.a_X;
					}
				}
				else	this.spd_x_now	+= this.a_X;
			}
			if(overx == true)
			{
				this.canX	= false;
			}
		}
		if(this.canY == true)
		{
			overy	= false;
			this.role.y	+= this.spd_y_now;
			if(this.moreY != 0)
			{
				if(this.moreY > 0)
				{
					if(this.role.y <= this.endY1)
					{
						this.role.y	= this.endY1;
						overy	= true;
					}
				}
				else
				{
					if(this.role.y >= this.endY0)
					{
						this.role.y	= this.endY0;
						overy	= true;
					}
				}
			}
			else
			{
				if(this.FirstY > 0)
				{
					if(this.spd_y_now + this.a_Y <= 0)
					{
						if(this.role.y > this.endY1)
						{
							if(this.canOut)
							{
								this.moreY	= this.role.y - this.endY1;
								this.spd_y_now	= -this.moreY / (this.secondLimiteBack * Config.playSpeedTrue);
							}
							else
							{
								this.role.y	= this.endY1;	overy	= true;
							}
						}
						else	overy	= true;
					}
					else
					{
						if(this.role.y > this.endY1)
						{
							if(this.canOut)		this.spd_y_now	+= this.a_Y;
							else
							{
								this.role.y	= this.endY1;	overy	= true;
							}
						}
						this.spd_y_now	+= this.a_Y;
					}
				}
				else if(this.FirstY < 0)
				{
					if(this.spd_y_now+this.a_Y>= 0)
					{
						if(this.role.y < this.endY0)
						{
							if(this.canOut)
							{
								this.moreY	= this.role.y - this.endY0;
								this.spd_y_now	= -this.moreY / (this.secondLimiteBack * Config.playSpeedTrue);
							}
							else
							{
								this.role.y	= this.endY0;	overy	= true;
							}
						}
						else	overy	= true;
					}
					else
					{
						if(this.role.y < this.endY0)
						{
							if(this.canOut)		this.spd_y_now	+= this.a_Y;
							else
							{
								this.role.y	= this.endY0;	overy	= true;
							}
						}
						this.spd_y_now	+= this.a_Y;
					}
				}
			}
			if(overy == true)
			{
				this.canY	= false;
			}
		}
		if(this.FunRun)
		{
			com.MyClass.Tools.Tool_Function.onRunFunction(this.FunRun,this.FunVal2);
		}
		if(overx == true && overy == true)	this.stopF();
	}
	
	private mcChange():void
	{
		var over:Boolean	= true;
		if(this.spd_x_now != 0)
		{
			over	= false;
			if(this.spd_x_now > 0 && this.role.x + this.spd_x_now >= this.endX0)
			{
				this.role.x		= this.endX0;
				this.spd_x_now	= 0;
			}
			else if(this.spd_x_now < 0 && this.role.x + this.spd_x_now <= this.endX0)
			{
				this.role.x		= this.endX0;
				this.spd_x_now	= 0;
			}
			else	this.role.x	+= this.spd_x_now;
		}
		if(this.spd_y_now != 0)
		{
			over	= false;
			if(this.spd_y_now > 0 && this.role.y + this.spd_y_now >= this.endY0)
			{
				this.role.y		= this.endY0;
				this.spd_y_now	= 0;
			}
			else if(this.spd_y_now < 0 && this.role.y + this.spd_y_now <= this.endY0)
			{
				this.role.y		= this.endY0;
				this.spd_y_now	= 0;
			}
			else	this.role.y	+= this.spd_y_now;
		}
		if(this.spdAlph != 0)
		{
			over	= false;
			if(this.spdAlph > 0 && this.role.alpha + this.spdAlph >= this.endAlph)
			{
				this.role.alpha	= this.endAlph;
				this.spdAlph		= 0;
			}
			else if(this.spdAlph < 0 && this.role.alpha + this.spdAlph <= this.endAlph)
			{
				this.role.alpha	= this.endAlph;
				this.spdAlph	= 0;
			}
			else	this.role.alpha	+= this.spdAlph;
		}
		if(this.spdScal != 0)
		{
			over	= false;
			if(this.spdScal > 0 && this.role.scaleX + this.spdScal >= this.endScal)
			{
				this.role.scaleX	= this.endScal;
				this.role.scaleY	= this.endScal;
				this.spdScal		= 0;
			}
			else if(this.spdScal < 0 && this.role.scaleX + this.spdScal <= this.endScal)
			{
				this.role.scaleX	= this.endScal;
				this.role.scaleY	= this.endScal;
				this.spdScal		= 0;
			}
			else
			{
				this.role.scaleX	+= this.spdScal;
				this.role.scaleY	+= this.spdScal;
			}
		}
		if(this.spdRo != 0)
		{
			over	= false;
			var nowR:number	= this.role.rotation;	//弧度-角度 ==当前角度
			if(this.spdRo > 0 && nowR + this.spdRo >= this.endRo)
			{
				this.role.rotation	= this.endRo;
				this.spdRo	= 0;
			}
			else if(this.spdRo < 0 && nowR + this.spdRo <= this.endRo)
			{
				this.role.rotation	= this.endRo;
				this.spdRo	= 0;
			}
			else
			{
				this.role.rotation	+= this.spdRo;
			}
		}
		Tool_Function.onRunFunction(this.FunRun,this.FunVal2);
		if(over == true)
		{
			this.stopF();
		}
	}
	
	private onSPEValueF():void
	{
		if(this.Arr_Values.length == 0)
		{
			this.stopF();
			return;
		}
		for(var i:number=0; i<this.Arr_Values.length; i++)
		{
			if(this.Arr_ValuesSpd[i] > 0)
			{
				if(this.role[this.Arr_Values[i]] + this.Arr_ValuesSpd[i] >= this.Arr_ValuesEnd[i])
				{
					this.onSPEValue_ComOne(i--);
				}
				else	this.role[this.Arr_Values[i]] += this.Arr_ValuesSpd[i];
			}
			else if(this.Arr_ValuesSpd[i] < 0)
			{
				if(this.role[this.Arr_Values[i]] + this.Arr_ValuesSpd[i] <= this.Arr_ValuesEnd[i])
				{
					this.onSPEValue_ComOne(i--);
				}
				else	this.role[this.Arr_Values[i]] += this.Arr_ValuesSpd[i];
			}
			else{
				this.onSPEValue_ComOne(i--);
			}
		}
		Tool_Function.onRunFunction(this.FunRun,this.FunVal2);
	}
	private onSPEValue_ComOne(i:number):void{
		this.role[this.Arr_Values[i]]	= this.Arr_ValuesEnd[i];
		this.Arr_Values.splice(i,1);
		this.Arr_ValuesEnd.splice(i,1);
		this.Arr_ValuesSpd.splice(i,1);
	}
	
	public stopF(auto:boolean = false):void
	{
		if(this.role==null)return;
		MainManager.getInstence().MTM.newTween(this.role,null);
		MainManager.getInstence().MEM.dispatchF("Tween结束",[this]);
		this.role=null;
		if(auto == true)
		{
			this.FunOver=Tool_ObjUtils.destroyF_One(this.FunOver);
			this.FunVal=Tool_ObjUtils.destroyF_One(this.FunVal);
			return;
		}
		if(this.FunOver != null)
		{
			Tool_Function.onRunFunction(this.FunOver,this.FunVal);
			this.FunOver=Tool_ObjUtils.destroyF_One(this.FunOver);
			this.FunVal=Tool_ObjUtils.destroyF_One(this.FunVal);
		}
	}
}
}