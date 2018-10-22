module com.MyClass.Tools{
export class Tool_Function{
	public static onRunFunction(f:any,...arg:any[]):any{
		if(f==null)return;
		if(f instanceof Function){
			return (f as Function).apply(null,arg);
		}else{
			return f.runWith(arg);
		}
	}

	/** 比较两个方法或handler是否相同 */
	public static compareHandlers(f:any,fun:any):boolean{
		if(f==null && fun==null)return true;
		if(f instanceof laya.utils.Handler){
			if(fun==null || (fun instanceof laya.utils.Handler && fun==f)){
				return true;
			}else if(fun==null || (fun instanceof Function && (f as laya.utils.Handler).method==fun)){
				return true;
			}
		}else if(f instanceof Function){
			if(fun==null || (fun instanceof Function && fun==f)){
				return true;
			}else if(fun==null || (fun instanceof laya.utils.Handler && (fun as laya.utils.Handler).method==f)){
				return true;
			}
		}
		return false;
	}

	/**
	 * 设置点击开关
	*/
	public static onTouchable(tar:any,needParent:boolean=true,needChild:boolean=true):void{
		if(tar==null)return;
		tar.touchable=true;
	}

	public static getLastClassName(tar:any):string{
		var className:string	= tar.constructor.toString();
        if(className.indexOf("(")!=-1){
            className =className.slice(0,className.indexOf("("));
            className =className.substr(className.indexOf(" ")+1);
        }
		return className;
	}

	public static isTypeOf(obj:any,	type:any):boolean
	{
		if(obj == null)	return false;
		if(obj==-0){
			if(typeof type === "number")return true;
			return false;
		}
		return this.getLastClassName(obj)==this.getLastClassName(type);
	}
	/** 角度转化为弧度 */
	public static deg2rad(deg:number):number
	{
		return deg / 180.0 * Math.PI;   
	}
	/** 弧度转换为角度 */
	public static rad2deg(rad:number):number{
		return rad * 180 / Math.PI;
	}
	/** 强转类型 */
	public static onForceConvertType(tar:any,type:string="int"):any{
		return Tool_Function.onChangeInstance(tar,type);
	}
	/** 强制转换类型 */
	public static onChangeInstance(tar:any,	type:string="int"):any{
		var tarType:string =typeof(tar);
		if(type=="int"){
			if(tarType=="number"){
				return parseInt(tar+"");
			}
			else if(tarType==="string"){
				return parseInt(tar);
			}
			else{
				return 0;
			}
		}
		else if(type=="num")
		{
			if(tarType=="number"){
				return tar;
			}
			else if(tarType==="string"){
				return parseFloat(tar);
			}
			else{
				return 0;
			}
		}
		if(type=="str"){
			return String(tar);
		}
		return null;
	}
}
}