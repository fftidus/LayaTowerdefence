module com.MyClass.MyView{
import TextField =starling.TextField;
import Handler=laya.utils.Handler;
export class MyViewTXController{
	public Dic_TX:Object={};
	public Dic_TXI:Object ={};
	private Dic_Hide:Object ={};

	public constructor(spr:starling.Sprite,	useMyTx:boolean=false) {
		for(var i:number=0;i<spr.numChildren;i++)
		{
			var obj:any = spr.getChildAt(i);
			if(obj.name == null)continue;
			var strName:string	= obj.name;
			if(strName.indexOf("tx_") == 0 && obj instanceof starling.TextField)
			{
				//对齐，颜色，size都可以在编辑器设置，不写在name中
				(obj as starling.TextField).autoScale=true;
				this.Dic_TX[strName]=obj;
			}
			else if(strName.indexOf("txi_")==0)
			{
				var col:any ="白";
				if(obj instanceof starling.TextField){
					col =(obj as starling.TextField).format.color;
				}
				var tx:MyTextInput=MyTextInput.getNewOne(spr,strName,0,col);
				this.Dic_TXI[tx.Name]=tx;
				if(obj instanceof starling.TextField){
					tx.setValue("默认文字",(obj as starling.TextField).text);
				}
				com.MyClass.Tools.Tool_ObjUtils.destroyF_One(obj);
				i--;
			}
		}
	}

	/*********** 获得文本对象 ***********/
	public getTextField(strName:string):TextField
	{
		return this.Dic_TX[strName];
	}
	public getInput(strName):MyTextInput
	{
		return this.Dic_TXI[strName];
	}
	/*********** 获得或修改文本文字 ***********/
	public getText(strName:string):string
	{
		if(this.Dic_TX[strName])	return (this.Dic_TX[strName]as TextField).text;
		if(this.Dic_TXI[strName])	return (this.Dic_TXI[strName]as MyTextInput).text;
		var n:string;
		for(n in this.Dic_TX)
		{
			if(n.indexOf(strName)==0)	return this.Dic_TX[n].text;
		}
		for(n in this.Dic_TXI)
		{
			if(n.indexOf(strName)==0)	return this.Dic_TXI[n].text;
		}
		return null;
	}
	public setText(strName:string,	txt:string):void
	{
		if(this.Dic_TX[strName])	(this.Dic_TX[strName]as TextField).text=txt;
		if(this.Dic_TXI[strName])	(this.Dic_TXI[strName]as MyTextInput).text=txt;
		var n:string;
		if(strName=="tx_")
		{
			for(n in this.Dic_TX)
			{
				this.Dic_TX[n].text=txt;
			}
		}
		else if(strName=="txi_")
		{
			for(n in this.Dic_TXI)
			{
				this.Dic_TXI[n].text=txt;
			}
		}
	}
	private	Dic_Listener:Object;
	public addChangeEventListener(strName:string,	f:Handler):void
	{
		if(strName==null || f==null)return;
		if(this.Dic_Listener==null)this.Dic_Listener={};
		if(this.Dic_Listener[strName]==null)
		{
			(this.Dic_TXI[strName]as MyTextInput).setValue("输入事件",this.onChangeEvent);
			this.Dic_Listener[strName]=[];
		}
		if(this.Dic_Listener[strName].indexOf(f)==-1)this.Dic_Listener[strName].push(f);
	}
	private onChangeEvent(tar:string):void
	{
		if(this.Dic_TXI[tar]==null || this.Dic_Listener==null || this.Dic_Listener[tar]==null)return;
		for(var i:number=0;i<this.Dic_Listener[tar].length;i++)
		{
			if(this.Dic_Listener[tar][i]){
				var f:Handler =this.Dic_Listener[tar][i];
				com.MyClass.Tools.Tool_Function.onRunFunction(f,tar);
			}
		}
	}
	public onHideInput(real:boolean):void
	{
		var n:string;
		for(n in this.Dic_TXI)
		{
			if(this.Dic_TXI[n]==null)continue;
			if(real==false){
				if(this.Dic_Hide[n] != true)	continue;
			}else{
				if(this.Dic_Hide[n]==true)	continue;
			}
			this.Dic_Hide[n]=real;
			(this.Dic_TXI[n] as MyTextInput).setValue("隐藏",real);
		}
	}
	
	public destroyF():void
	{
		this.Dic_Listener=null;
		this.Dic_TX=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Dic_TX);
		this.Dic_TXI=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Dic_TXI);
	}
}
}