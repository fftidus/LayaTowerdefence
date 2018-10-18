module com.MyClass.NetTools{
import Handler=laya.utils.Handler;
import SwfMovieClip=com.MyClass.MySwf.SwfMovieClip;
import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
import Tool_Function=com.MyClass.Tools.Tool_Function;
import Socket =laya.net.Socket;
import Event=laya.events.Event;
export class MgsSocket{
	public static Event_Close:string="网络断开";
	private static _mgsSocket:MgsSocket;
	public static getInstance():MgsSocket
	{
		if(this._mgsSocket == null){
			this._mgsSocket = new MgsSocket();
		}
		return this._mgsSocket;
	}
	private CMDLENGTH:number = 2;//指令头的长度，short
	private SEEDLength:number=4;//随机头长度，int
	public needURL:string="/websocket";
	public CMDHeart:number;
	public Fun_connect:Handler;
	
	private IP:string;
	private PORT:number=-1;
	public socket:Socket;
	public timeLimite:number=8;//自动断网时间
	private	isListening:boolean=false;
	private _cmdDict:Dictionary;
	private	Seed:CmdRand;
	private	SaveBuf:laya.utils.Byte;
	public	SaveCMD:number=-1;
	public nowFlag:string;
	public needCloseEvent:boolean=false;
	private FunGetReconnectCMD:Handler;
	private onTimeOverHandler:Handler;
	
	private	_pause:boolean=false;
	private Arr_WaiteReceiveCMD:Array<any>;
	private Arr_WaiteSendCMD:Array<any>;
	constructor(){
		this.Seed	= CmdRand.getInstance();
		this.socket = new Socket();
		this._cmdDict = new Dictionary();
		this.onTimeOverHandler=Handler.create(this,this.onTimeWrongF,null,false);
	}

	public getSocket(type:string = null):Socket
	{
		if(type==null)return this.socket;
		return null
	}
	public connectF(ip:string, port:number):void
	{
		if(ip!=null)	this.IP = ip;
		if(this.IP.indexOf(":")==-1){
			this.IP+=":"+port;
			if(this.needURL)this.IP+=this.needURL;
		}
		this.addListeners();
		this.nowFlag="正在连接";
		if(!this.socket.connected)
		{
			console.log("webSocket开始连接："+this.IP+"          ,端口"+this.PORT);
			if(this.PORT==-1){
				this.socket.connectByUrl("ws://"+this.IP);
			}else{
				this.socket.connect(this.IP,this.PORT); 
			}
		}
	}
	
	/**
	 *配置socket监听事件
	 *
	 */
	private addListeners():void
	{
		if(this.isListening)return;
		this.isListening=true;
		this.socket.on(Event.OPEN,this,this.connectHandler,null);
		this.socket.on(Event.CLOSE,this,this.closeHandler,null);
		this.socket.on(Event.ERROR,this,this.ioErrorHandler,null);
		this.socket.on(Event.MESSAGE,this,this.socketDataHandler,null);
	}
	/**
	 *删除socket监听事件
	 *
	 */
	public removeListeners():void
	{
		this.isListening=false;
		this.socket.offAll();
	}
	
	private connectHandler( event:Event ):void
	{
		console.log( "socket连接成功！" );
		this.nowFlag="连接";
		if(this.Fun_connect != null){
			this.Fun_connect.runWith(true);
			this.Fun_connect = null;
		}
	}
	
	/**
	 *当服务端关闭后触发
	 * @param event
	 *
	 */
	private closeHandler( event:Event ):void
	{
		if(this.nowFlag==null){return;}
		console.log( "socket已关闭!now状态="+this.nowFlag);
		this.nowFlag=null;
		if(this.needCloseEvent==true){
			MainManager.getInstence().MEM.dispatchF(MgsSocket.Event_Close);
		}
	}
	public closeSocket():void
	{
		if(this.socket!= null && this.socket.connected)this.socket.close();	
		else{
			this.closeHandler(null);
		}
	}
	
	/**
	 * IO异常
	 * @param event
	 *
	 */
	private ioErrorHandler( event:any ):void
	{
		console.log( "socket io错误" );
		if(this.Fun_connect != null){
			this.Fun_connect.runWith(false);
			this.Fun_connect = null;
		}
	}
	
	/**
	 *收到服务端发送数据触发
	 * @param event
	 *
	 */
	private socketDataHandler( message:any ):void
	{
		var buf:laya.utils.Byte;
		if (typeof message == "string")//
		{
			console.log("收到String消息：",message);
		}
		else if (message instanceof ArrayBuffer)
		{
			buf=new laya.utils.Byte();
			buf.writeArrayBuffer(message);
			buf.pos=0;
			this.getBytes(buf);
		}
		this.socket.input.clear();
	}
	private getBytes(buf:laya.utils.Byte):void
	{
		var l:number=buf.getInt32();
		var cmd:number = buf.getInt16();
		var realData:laya.utils.Byte = new laya.utils.Byte();
		var arr:ArrayBuffer =buf.getUint8Array(0,buf.length);
		// buf.readBytes(realData, 0, buf.bytesAvailable);
		realData.writeArrayBuffer(arr);
		this.receiveCommand(cmd, realData);
		realData = null;
		buf = null;
	}
	private receiveCommand(cmd:number, dataBytes:laya.utils.Byte):void
	{
		if(cmd==this.CMDHeart)
		{
			var c:Net_SocketCMD=new Net_SocketCMD(this.CMDHeart,false,false);
			c.sendF(false);
			return;
		}
		if(this.pause==true)
		{
			if(this.Arr_WaiteReceiveCMD==null)this.Arr_WaiteReceiveCMD=[];
			this.Arr_WaiteReceiveCMD.push([cmd,dataBytes]);
			return;
		}
		var hander:Array<any> = this._cmdDict.get(cmd);
		if(hander!=null){
			var l:number=hander.length;
			for (var i:number=0;i<l;i++ )
			{
				if(i>=hander.length)break;
				var val:Handler = hander[i];
				if(val == null)continue;
				Tool_Function.onRunFunction(val,dataBytes);
			}
			for (i=0;i<hander.length;i++ )
			{
				if(hander[i] == null)hander.splice(i--,1);
			}
		}
		if(cmd == this.SaveCMD)
		{
			this.SaveCMD=-1;
			this.SaveBuf=null;
			MainManager._instence.remove_delayFunction(this.onTimeOverHandler);
			if(this.Arr_WaiteSendCMD!=null && this.Arr_WaiteSendCMD.length > 0){
				var tmp:Array<any> =this.Arr_WaiteSendCMD.shift();
				console.log("发送缓存指令："+tmp[0]);
				this.sendMessage(tmp[0],tmp[1],tmp[2],tmp[3]);
			}else{
				if(this.FunGetReconnectCMD){
					Tool_Function.onRunFunction(this.FunGetReconnectCMD);
					this.FunGetReconnectCMD=null;
				}
			}
		}
	}
	/**
	 *添加某个消息号的监听
	 * @param cmd	消息号
	 * @param args	传两个参数，0为处理函数  1为需要填充的数据对象
	 *
	 */
	public addCmdListener( cmd:number , hander:Handler):void
	{
		var arr:Array<any> = this._cmdDict.get(cmd);
		if (arr == null ){
			arr=[];
			this._cmdDict.set(cmd, arr);
		}
		arr.push( hander );
	}
	
	/**
	 *移除 消息号监听
	 * @param cmd
	 *
	 */
	public removeCmdListener( cmd:number , listener:Handler ):void
	{
		var handers:Array<any> = this._cmdDict.get(cmd);
		if ( handers != null && handers.length > 0 )
		{
			var length:number = handers.length;
			for ( var i:number = ( length - 1 ) ; i >= 0 ; i-- )
			{
				if(handers[i] instanceof Array)
				{
					for(var j:number=0;j<handers[i].length;j++){
						if (com.MyClass.Tools.Tool_Function.compareHandlers(listener,handers[i][j])==true){
							handers[i][j]=null;
						}
					}
				}
				else if (Tool_Function.compareHandlers(listener,handers[i])==true)
				{
					handers[i]=null; //从数组中删除元素
				}
			}
		}
	}
	public sendMessage(cmd:number, content:laya.utils.Byte, needRandom:boolean=true, type:string = null):void
	{
		if(this.SaveCMD != -1 && needRandom==true){//正在等待上一个指令
			if(this.Arr_WaiteSendCMD==null)this.Arr_WaiteSendCMD=[];
			this.Arr_WaiteSendCMD.push([cmd,content,needRandom,type]);
			return;
		}
		//加随机数
		var contentLen:number = 0;
		if(content != null)
		{
			contentLen = content.length;
		}
		var lastSaveBuf:laya.utils.Byte =this.SaveBuf;
		this.SaveBuf = new laya.utils.Byte();
		this.SaveBuf.writeInt32(contentLen + this.CMDLENGTH+this.SEEDLength);
		if(needRandom)
		{
			var cmdSeed:number  =  CmdRand.getInstance().next();
			this.SaveBuf.writeInt32(cmdSeed);
		}
		else	this.SaveBuf.writeInt32(0);
		this.SaveBuf.writeInt16(cmd);
		if(content != null)
		{
			this.SaveBuf.writeArrayBuffer(content, 0, content.length);
		}
		this.sendF(type);
		if(needRandom==false){
			this.SaveBuf=lastSaveBuf;
		}else{
			this.SaveCMD	= cmd;
			if(this.timeLimite>0 && MainManager._instence!=null){
				MainManager._instence.add_delayFunction(this.onTimeOverHandler,this.timeLimite * Config.playSpeedTrue);
			}
		}
	}
	private onTimeWrongF():void{
		console.log("超时关闭socket！"+this.SaveCMD);
		if(this.SaveCMD==-1 || this.SaveBuf==null){
			return;
		}
		this.closeSocket();
	}
	public sendF(type:string):void
	{
		if(this.socket.connected==false)
		{
			this.closeHandler(null);
			return;
		}
		if(type==null)
		{
			if(this.SaveBuf==null)	return;
			this.SaveBuf.pos = 0;
			for (var i:number = 0; i < this.SaveBuf.length; i++)
			{
				this.socket.output.writeByte(this.SaveBuf.readByte());
			}
			this.SaveBuf.pos=0;
			this.socket.flush();
		}
		else
		{
			console.log("暂未支持h5的mysocket");
		}
	}
	public onSendCache(f:any):void{
		if(this.SaveCMD==-1){
			if(f)Tool_Function.onRunFunction(f);
			return;
		}
		console.log("发送缓存指令："+this.SaveCMD);
		this.FunGetReconnectCMD=f;
		MainManager._instence.add_delayFunction(this.onTimeOverHandler,this.timeLimite * Config.playSpeedTrue);
		this.sendF(null);
	}
	
	public destroyF():void
	{
		this.removeListeners();
		if(this.socket!= null && this.socket.connected)this.socket.close();
		this._cmdDict = new Dictionary();
		MgsSocket._mgsSocket=null;
		this.onTimeOverHandler.clear();
	}
	
	public get pause():boolean
	{
		return this._pause;
	}
	public set pause(value:boolean)
	{
		this._pause = value;
		if(value==false)
		{
			if(this.Arr_WaiteReceiveCMD)
			{
				while(this.Arr_WaiteReceiveCMD.length>0)
				{
					this.receiveCommand(this.Arr_WaiteReceiveCMD[0][0],this.Arr_WaiteReceiveCMD[0][1]);
					this.Arr_WaiteReceiveCMD.shift();
				}
			}
			this.Arr_WaiteReceiveCMD=null;
		}
	}
}
}