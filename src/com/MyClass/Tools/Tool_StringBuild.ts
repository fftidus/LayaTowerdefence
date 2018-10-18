module com.MyClass.Tools{
export class Tool_StringBuild{
	public static replaceSTR(str:string,str1:string,	str2:string):string
	{
		var out:string="";
		var arr:Array<string>	= str.split(str1);
		for(var i:number=0; i<arr.length;i++)
		{
			if(i>0)out+=str2;
			out+=arr[i];
		}
		return out;
	}

	public static onRemoveEnterSpace(str:string):string
	{
		var arr:Array<string>=["\n","\t","\r"," ","	"];
		while(arr.length>0)
		{
			str=this.replaceSTR(str,arr[0],"");
			arr.shift();
		}
		return str;
	}
	public static rebuild_by_length(str:string,	len:number, _chinese:boolean):string
	{
		var out:string	= "";
		if(_chinese == false)
		{
			out	= str.substr(0,len);
		}
		else
		{
			var nowL:number	= 0;
			var count:number	= 0;
			while(count < str.length)
			{
				if(nowL >= len)	break;
				var char:string	= str.charAt(count);
				var code:number	= str.charCodeAt(count);
				out	+= char;
				if(code >= 10000)	nowL+=2;
				else				nowL+=1;
				count++;
			}
		}
		return out;
	}

	
	public static getNewSTRBySlip(str1:string,str2:string):string
	{
		var arr:Array<string>	= str1.split(str2);
		str1	= "";
		while(arr.length > 0)
		{
			str1	+= arr[0];
			arr.shift();
		}
		return str1;
	}
	
	public static getArr_By_split(str1:string,	str2:string,	_changeInstance:string = null):Array<any>
	{
		var arr:Array<string>	= str1.split(str2);
		if(_changeInstance)
		{
			var i:number;
			var l:number= arr.length;
			for(i=0; i<l; i++)
			{
				if(_changeInstance == "int")	arr[i]	= Tool_Function.onChangeInstance(arr[i]);
				else if(_changeInstance == "Number")	arr[i]	= Tool_Function.onChangeInstance(arr[i],"num");
			}
		}
		return arr;
	}
	
	public static onInsertF(str:string,index:number,strTar:string):string{
		var str0:string=str.slice(0,index);
		var str1:string=str.slice(index);
		return str0+strTar+str1;
	}
}
}