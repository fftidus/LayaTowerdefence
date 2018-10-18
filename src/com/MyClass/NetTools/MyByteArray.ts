module com.MyClass.NetTools{
import Byte =laya.utils.Byte;
import Tool_Function=com.MyClass.Tools.Tool_Function;
export class MyByteArray{

	private	CMD:number;
	public  Arr_val:Array<any>;
	public WriteB:Byte;
	constructor(cmd:number = -1){
		this.CMD=cmd;
	}

	public writeF(val:any):void
	{
		if(this.WriteB == null)	this.WriteB	= new Byte();
		if(val instanceof Array)
		{
			for(var i:number=0; i<val.length; i++)
			{
				this.write(val[i]);
			}
		}
		else this.write(val);
	}
	
	private write(val:any):void
	{
		if(typeof val == "number")
		{
			if(val != Tool_Function.onForceConvertType(val))
			{
				//小数
				this.WriteB.writeByte(5);
				this.WriteB.writeFloat64(val);
				return;
			}
			var n:number	= Math.abs(val);
			if(n < 127)
			{
				this.WriteB.writeByte(1);
				this.WriteB.writeByte(val);
			}
			else if(n < 32767)
			{
				this.WriteB.writeByte(2);
				this.WriteB.writeInt16(val);
			}
			else if(n < 2147483647)
			{
				this.WriteB.writeByte(3);
				this.WriteB.writeInt32(val);
			}
			else
			{
				this.WriteB.writeByte(5);
				this.WriteB.writeFloat64(val);
			}
		}
		else if(typeof val === "string")
		{
			this.WriteB.writeByte(4);
			this.WriteB.writeUTFString(val);
		}
		else if(val == null || val == undefined)
		{
			this.WriteB.writeByte(8);
		}
		else if(typeof val == "boolean")
		{
			this.WriteB.writeByte(7);
			if(val == true)	this.WriteB.writeByte(1);
			else			this.WriteB.writeByte(0);
		}
		else if(val instanceof Array)
		{
			this.WriteB.writeByte(6);
			this.write(val.length);
			for(let i:number=0; i<val.length; i++)
			{
				this.write(val[i]);
			}
			return;
		}
		else if(val instanceof Byte)
		{
			this.WriteB.writeByte(10);
			this.write(val.length);
			this.WriteB.writeArrayBuffer(val,0,val.length);
		}
		else if(val instanceof Dictionary)
		{
			var dic:Dictionary=val;
			var arr_key:Array<any>	= dic.keys;
			var arr_val:Array<any>	= dic.values;
			this.WriteB.writeByte(9);
			this.write(arr_key.length);
			for(let i2:number=0; i2<arr_key.length; i2++)
			{
				this.write(arr_key[i2]);
				this.write(arr_val[i2]);
			}
		}
		else{
			arr_key	= [];
			arr_val	= [];
			for(var key in val)
			{
				arr_key.push(key);
				arr_val.push(val[key]);
			}
			this.WriteB.writeByte(9);
			this.write(arr_key.length);
			for(let i2:number=0; i2<arr_key.length; i2++)
			{
				this.write(arr_key[i2]);
				this.write(arr_val[i2]);
			}
		}
	}
	
	public readF(buf:Byte):void
	{
		this.Arr_val			= [];
		buf.pos=0;
		while(buf.bytesAvailable > 0)
		{
			this.Arr_val.push(readNext());
		}
		function readNext():any
		{
			var val:any;
			var n:number	= buf.readByte();
			if(n == 1)		val	= buf.readByte();
			else if(n == 2)	val	= buf.getInt16();
			else if(n == 3)	val	= buf.getInt32();
			else if(n == 4)
			{
				val	= com.MyClass.Tools.Tool_StringBuild.replaceSTR(buf.readUTFString(),"\\n","\n");
			}
			else if(n == 5)	val	= buf.getFloat64();
			else if(n == 6)
			{
				var lenType:number= buf.readByte();
				var len:number;
				if(lenType == 1)	len	= buf.readByte();
				else if(lenType==2)len	= buf.getInt16();
				var arr:Array<any>	= [];
				for(;len>0;len--)
				{
					arr.push(readNext());
				}
				return arr;
			}
			else if(n == 7)
			{
				val	= Tool_Function.onForceConvertType(buf.readByte());
				if(val == 0)	return false;
				else			return true;
			}
			else if(n == 8)
			{
				return null;
			}
			else if(n == 9)
			{
				var dic:Object ={};
				lenType	= buf.readByte();
				if(lenType == 1)	len	= buf.readByte();
				else if(lenType==2)len	= buf.getInt16();
				var key:any;
				for(;len>0;len--)
				{
					key	= readNext();
					dic[key]	= readNext();
				}
				return dic;
			}
			else if(n == 10)
			{
				var b:Byte=new Byte();
				var l:number=readNext();
				for(let i:number=0;i<l;i++){
					b.writeByte(buf.readByte());
				}
				val=b;
			}
			else{
				Config.LogF("Unkownd Type In MyByteArray's readF!CMD=="+this.CMD+",n=="+n);
				return null;
			}
			return val;
		}
	}
}
}