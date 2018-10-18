module com.MyClass.MyView{
import Input=laya.display.Input;
export class MyTextInput extends starling.Sprite{
	private	static Count:number=0;
	private	static Dic:Dictionary=new Dictionary();
	public	static onHideF(real:boolean):void
	{
		for(var i:number=0;i<this.Dic.keys.length;i++)
		{
			var id =this.Dic.keys[i];
			this.Dic.get(id).setValue("隐藏",real);
		}
	}
	public static DestroyALL():void
	{
		for(var i:number=0;i<this.Dic.keys.length;i++)
		{
			var id =this.Dic.keys[i];
			this.Dic.get(id).destroyF();
			this.Dic.remove(id);
			i--;
		}
	}
	
	public static getNewOne(spr:starling.Sprite,	url:string,	size:number=0,	col:any ="白"):MyTextInput
	{
		var tmpTX:any		= spr.getChildByName(url);
		if(size<=0)		size=tmpTX.height-3;
		var TX:MyTextInput	= new MyTextInput(tmpTX.width,tmpTX.height,size);
		var arr:Array<any>=url.split("_");//txi_25_颜色FF99000_对齐中
		TX.Name=arr[0]+"_"+arr[1];
		if(arr.length>2)
		{
			var info:Object = {};
			for(var j:number=2;j<arr.length;j++)
			{
				var one:string=arr[j];
				if(one.indexOf("颜色")==0)
				{
					one=one.slice(2);
					if(one.length==1)	col=one;
					else if(one.indexOf("0x")!=0)col=com.MyClass.Tools.Tool_Function.onForceConvertType("0x"+one);
				}
				else if(one.indexOf("对齐")==0)
				{
					TX.setValue("对齐",one.slice(2));
				}
				else if(one.indexOf("多行")==0)
				{
					var num:number=com.MyClass.Tools.Tool_Function.onForceConvertType(one.slice(2));
					size=size / (num+1);
					TX.setValue("字号",size);
				}
				else if(one.indexOf("密码")==0){
					TX.setValue("密码",true);
				}
				else if(one.indexOf("默认")==0){
					TX.setValue("默认文字",one.slice(2));
				}
				else if(one=="仅数字"){
					TX.setValue("仅数字",true);
				}
			}
		}
		TX.x	= tmpTX.x;
		TX.y	= tmpTX.y;
		TX.setValue("颜色",col);
		spr.addChild(TX);
		TX.initF();
		return TX;
	}

	public Name:string;
	private ID:number;
	private W:number;
	private H:number;
	private inputText:Input;
	private ChangedFun:Function;
	private visibleCount:number=1;
	private isPasswork:boolean=false;
	private isFocus:boolean=false;
	private isLinsening:boolean=false;
	private maxLength:any;
	private mmo:MainManagerOne;

	constructor(_width:number, _height:number, _size:number=-1){
		super();
		if(_size <= 0)	_size = 20;
		this.ID=MyTextInput.Count++;
		MyTextInput.Dic.set(this.ID,this);
		
		this.inputText = new Input();
		this.inputText.size(_width, _height);
//		inputText.multiline = true;
//		inputText.wordWrap = true;
		// 移动端输入提示符
//		inputText.prompt = "Type some word...";
		// 设置字体样式
		this.inputText.bold = true;
		this.inputText.color = "#ffffff";
		this.inputText.fontSize=_size;
	}

	public get text():string
	{
		return this.inputText.text;
	}

	public set text(value:string)
	{
		if(this.isPasswork==true && this.inputText.type!="password"){
			this.inputText.type="password";
		}else if(this.isPasswork==false && this.inputText.type=="password"){
			this.inputText.type="text";
		}
		this.inputText.text	= value;
		if(this.visibleCount!=1)	return;
		this.inputText.visible=true;
	}

	public initF():void
	{
		Laya.stage.addChild(this.inputText);
		if(this.mmo==null){
			this.mmo=new  MainManagerOne();
			this.mmo.addEnterFrameFun(laya.utils.Handler.create(this,this.enterF,null,false));
		}
//			this.addChild(inputText);
	}
	private enterF():void{
		if(this.visible==false)return;
		var p:laya.maths.Point =this.localToGlobal(new laya.maths.Point(0,0));
		this.inputText.x =p.x;
		this.inputText.y =p.y;
	}
	
	public setValue(type:string,	val:any):void
	{
		switch (type)
		{
			case "颜色":
				if(typeof val === "string")
				{
					if(val == "红")		this.inputText.color = "#ff0000";
					else if(val == "白")	this.inputText.color = "#ffffff";
					else if(val == "黑")	this.inputText.color = "#000000";
					else if(val == "黄")	this.inputText.color = "#ffff00";
					else this.inputText.color= val;
				}else{
					this.inputText.color="#"+val.toString(16);
				}
				break;
			case "对齐":
				if(val == "左")		this.inputText.align	="left";
				else if(val == "中")	this.inputText.align	="center";
				else if(val == "右")	this.inputText.align	="right";
				break;
			case "隐藏":
				if(val==true)this.visibleCount--;
				else	this.visibleCount++;
				if(this.visibleCount==1)//visible刚刚从false变成true
				{
					this.inputText.visible=true;
				}
				else if(this.visibleCount==0)
				{
					this.inputText.visible=false;
				}
				break;
			case "密码":
				this.isPasswork=true;
				this.inputText.type="password";
				break;
			case "仅数字":
				this.inputText.restrict="0-9";
				break;
			case "仅英文":
				this.inputText.restrict="A-Z a-z";
				break;
			case "仅数字英文":
				this.inputText.restrict="A-Z a-z 0-9";
				break;
			case "输入事件":
				this.ChangedFun=val;
				if(this.ChangedFun!=null){
					this.onAddFocusF();
				}
				else{
					this.onClearFocusF();
				}
				break;
			case "最大长度":
				this.maxLength=val;
				this.onAddFocusF();
				break;
			case "字号":
				this.inputText.fontSize = val;
				break;
			case "默认文字":
				this.inputText.prompt=val;
				break;
			case "可编辑":
				this.inputText.editable=val;
				break;
		}
	}
	
	public setFocus():void{
		if(this.inputText){
//				inputText.assignFocus();
		}
	}
	private onAddFocusF():void{
		if(this.inputText==null)return;
		if(this.isLinsening==false){
			this.isLinsening=true;
			this.inputText.on(laya.events.Event.FOCUS,this,this.onFocusIn);
			this.inputText.on(laya.events.Event.BLUR,this,this.onFocusOut);
		}
		this.onFocusOut(null);
	}
	private onClearFocusF():void{
		if(this.inputText==null)return;
		if(this.isLinsening==true){
			this.isLinsening=false;
			this.inputText.offAll();
		}
	}
	private onFocusIn(e:any):void{
		this.isFocus=true;
	}
	private onFocusOut(e:any):void
	{
		if(this.maxLength != null){
			var str:string=this.inputText.text;
			if(typeof this.maxLength ==="number"){
				str=com.MyClass.Tools.Tool_StringBuild.rebuild_by_length(str,this.maxLength,false);
			}else{
				str=com.MyClass.Tools.Tool_StringBuild.rebuild_by_length(str,this.maxLength["长度"],this.maxLength["中文"]);
			}
			this.inputText.text=str;
		}
		if(this.ChangedFun && this.isFocus){
			com.MyClass.Tools.Tool_Function.onRunFunction(this.ChangedFun,this.Name);
		}
		this.isFocus=false;
	}
	
	public destroyF():void
	{
		MyTextInput.Dic.remove(this.ID);
		this.inputText.destroy();
		this.inputText=null;
		this.ChangedFun	= null;
		this.mmo=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mmo);
		this.destroy();
	}
}
}