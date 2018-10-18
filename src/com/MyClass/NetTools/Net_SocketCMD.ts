module com.MyClass.NetTools{
import Handler=laya.utils.Handler;
import Tool_Function=com.MyClass.Tools.Tool_Function;
export class Net_SocketCMD{
	public CMD:number;
	private isDicSendType:boolean;
	private isDicGetType:boolean;
	private dic_Send:Dictionary;
	private dic_Get:Dictionary;
	protected haveListener:boolean	= false;
	protected Arr_Fun:Array<any>		=[];
	protected Arr_autoClear:Array<any>		=[];
	private	 Arr_values:Array<any>;
	private Hrecive:Handler;
	
	public Type:string=null;
	constructor(cmd:number =0,__dicSendType:boolean=true,__dicReciveType:boolean=true){
		this.isDicSendType	= __dicSendType;
		this.isDicGetType	= __dicReciveType;
		this.CMD	= cmd;
		if(this.CMD==0)
		{
			var name:string=Tool_Function.getLastClassName(this);
			var arr:Array<string>=name.split("CMD");
			this.CMD=Tool_Function.onForceConvertType(arr[arr.length-1]);
		}
		this.Hrecive=Handler.create(this,this.recivedF,null,false);
	}

	public funAddListener(f:Handler,	once:boolean):void
	{
		if(this.haveListener==false)
		{
			MgsSocket.getInstance().addCmdListener(this.CMD, this.Hrecive);
			this.haveListener	= true;
		}
		this.Arr_Fun.push(f);
		this.Arr_autoClear.push(once);
	}
	
	public funcRemoveListener(f:any):void
	{
		for(let i:number=0;i<this.Arr_Fun.length;i++){
			if(Tool_Function.compareHandlers(f,this.Arr_Fun[i]) == true){
				this.Arr_Fun.splice(i,1);
				this.Arr_autoClear.splice(i,1);
				i--;
			}
		}
		if(this.Arr_Fun.length == 0)
		{
			MgsSocket.getInstance().removeCmdListener(this.CMD, this.Hrecive);
			this.haveListener	= false;
		}
	}
	
	protected recivedF(b:laya.utils.Byte):void
	{
		var b2:MyByteArray	= new MyByteArray(this.CMD);
		b2.readF(b);
		var f:Handler;
		if(this.isDicGetType)
		{
			if(b2.Arr_val.length > 0)	this.dic_Get	= b2.Arr_val[0];
			for(var i:number=0; i<this.Arr_Fun.length; i++)
			{
				if(this.Arr_Fun==null)return;
				f=	this.Arr_Fun[i];
				if(this.Arr_autoClear[i] == true)
				{
					this.funcRemoveListener(this.Arr_Fun[i]);
					i--
				}
				(f as Handler).runWith(this.dic_Get);
				if(this.Arr_Fun==null)return;
			}
			this.dic_Get=null;
		}
		else
		{
			this.Arr_values	= b2.Arr_val;
			for(i=0; i<this.Arr_Fun.length; i++)
			{
				if(this.Arr_Fun==null)return;
				f=	this.Arr_Fun[i];
				if(this.Arr_autoClear[i] == true)
				{
					this.funcRemoveListener(this.Arr_Fun[i]);
					i--
				}
				(f as Handler).runWith(this.Arr_values);
				if(this.Arr_Fun==null)return;
			}
		}
	}
	
	public writeValue_Dic(key:string,	val:any):void
	{
		if(this.isDicSendType==false)	throw new Error("不能使用该方法");
		if(this.dic_Send == null)	this.dic_Send	= new Dictionary();
		this.dic_Send.set(key, val);
	}
	
	public writeValueF_Arr(values:Array<any>):void
	{
		if(this.isDicSendType==true)	throw new Error("不能使用该方法");
		this.Arr_values	= values.concat();
	}
	
	public sendF(needRadom:boolean = true):void
	{
		if(this.Type==null)
		{
			if(MgsSocket.getInstance().nowFlag==null)
			{
				console.log("Socket未连接！");
				return;
			}
			if(MgsSocket.getInstance().nowFlag=="关闭")
			{
				console.log("已断网");
				return;
			}
		}
		else
		{
		}
		var b:MyByteArray =new MyByteArray();
		if(this.isDicSendType == false)
		{
			if(this.Arr_values != null)
			{
				b.writeF(this.Arr_values);
			}
			if(needRadom)	MgsSocket.getInstance().sendMessage(this.CMD,b.WriteB,true,this.Type);
			else			MgsSocket.getInstance().sendMessage(this.CMD,b.WriteB,false,this.Type);
			return;
		}
		else if(this.dic_Send != null)
		{
			b.writeF(this.dic_Send);
		}
		if(needRadom)	MgsSocket.getInstance().sendMessage(this.CMD,b.WriteB,true,this.Type);
		else			MgsSocket.getInstance().sendMessage(this.CMD,b.WriteB,false,this.Type);
	}
	
	public destroyF():void
	{
		if(this.haveListener==true)
		{
			MgsSocket.getInstance().removeCmdListener(this.CMD, this.Hrecive);
			this.haveListener	= false;
		}
		this.Arr_Fun	= null;
		this.dic_Send	= null;
		this.dic_Get	= null;
		this.Hrecive.clear();
	}
	
}
}