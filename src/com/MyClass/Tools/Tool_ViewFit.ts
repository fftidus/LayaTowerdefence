module com.MyClass.Tools{
export class Tool_ViewFit{
	private static get isFat():boolean{
		var isFat:boolean;
		if(Config.stageScaleInfo["屏幕w"]/Config.stageScaleInfo["屏幕h"] >= Config.stageW/Config.stageH){//更宽，y轴
			isFat=true;
		}else{//更高，x轴
			isFat=false;
		}
		return isFat;
	}
	
	public static onViewFitF(tar:starling.Sprite):void{
		if(Config.TypeFit!=2){return;}
		var w0:number =50;
		var h0:number =50;
		var infoFit:Object;
		var i:number;
		var child:any;
		var rec:any;
		var rec2:any;
		var dicNo:Object ={};
		var typex:string;
		var typey:string;
		var info:any;
		var dicStatic:Object ={};
		var dicSuc:Object ={};
		var s0:number;
		var meta:Object;
		if(tar instanceof com.MyClass.MySwf.SwfSprite)meta=tar.metaData;
		if(meta==null || meta["适配"] == null){return;}
		infoFit=meta["适配"];
		//关联
		var arrWaiteRelationship:Array<any>=[];
		for(var key in infoFit){
			if(infoFit[key]["类型"] == "关联"){//获得适配前的关联距离
				arrWaiteRelationship.push(key);
				this.onSaveAssociated(infoFit[key],tar,child);
			}
		}
		//合并
		for(key in infoFit) {
			if (key.indexOf("合并") != 0) {continue;}
			var arrChilds:Array<any> = infoFit[key]["包含"];
			var recCombo:any = null;
			for (i = 0; i < arrChilds.length; i++) {
				dicNo[arrChilds[i]] = true;//中间的元件不自动适配
				child = tar.getChildByName(arrChilds[i]);
				rec = Tool_SpriteUtils.getBounds(child, tar);
				if (recCombo == null) {
					recCombo = rec;
				}
				else {
					if (rec.x < recCombo.x) {
						recCombo.x = rec.x;
					}
					if (rec.y < recCombo.y) {
						recCombo.y = rec.y;
					}
					if (rec.right > recCombo.right) {
						recCombo.width += rec.right - recCombo.right;
					}
					if (rec.bottom > recCombo.bottom) {
						recCombo.height += rec.bottom - recCombo.bottom;
					}
				}
			}
			info =this.onFitOne(recCombo,infoFit[key]);
			for (i = 0; i < arrChilds.length; i++) {
				child = tar.getChildByName(arrChilds[i]);
				rec2 = Tool_SpriteUtils.getBounds(child, tar);
				child.x += rec.x - recCombo.x;
				child.x -= (rec2.x - recCombo.x) * (1 - info.s);
				child.y += (rec.y - recCombo.y);
				child.y -= (rec2.y - recCombo.y) * (1 - info.s);
				child.scaleX *= info.s;
				child.scaleY *= info.s;
				dicStatic[arrChilds[i]]=info.s;
				dicSuc[arrChilds[i]] = true;
			}
		}
		//单个
		for(i=0;i<tar.numChildren;i++){
			child =tar.getChildAt(i);
			if(child.name && (dicNo[child.name]==true || arrWaiteRelationship.indexOf(child.name)!=-1)){continue;}
			rec = Tool_SpriteUtils.getBounds(child, tar);
			info =this.onFitOne(rec,infoFit[child.name]);
			if(info["sx"]!=null){
				child.scaleX =info.sx;
				child.scaleY =info.sy;
				child.x = info.x+(child.x - rec.x) * info.sx;
				child.y = info.y+(child.y - rec.y) * info.sy;
			}else{
				child.scaleX *= info.s;
				child.scaleY *= info.s;
				child.x = info.x+(child.x - rec.x) * info.s;
				child.y = info.y+(child.y - rec.y) * info.s;
			}
			// console.log(child.name,	"s="+info.s+"，x="+child.x+"，y="+child.y);
			dicStatic[child.name]=info.s;
			dicSuc[child.name] = true;
		}
		//关联
		var L:number=arrWaiteRelationship.length;
		while(true){
			for(i=0;i<arrWaiteRelationship.length;i++){
				key =arrWaiteRelationship[i];
				if(dicSuc[infoFit[key]["tar"]] != true){
					continue;
				}
				dicSuc[key]=true;
				child=tar.getChildByName(key);
				if(child==null)continue;
				var childTar:any =tar.getChildByName(infoFit[key]["tar"]);
				var s:number=1;
				if(infoFit[key]["ss"] !="无" && dicStatic[infoFit[key]["tar"]] != null){
					s = dicStatic[infoFit[key]["tar"]];
				}
				child.scaleX *= s;
				child.scaleY *= s;
				if(infoFit[key]["关联方式"] == null){
					child.x =childTar.x + infoFit[key]["x"] * s;
					child.y =childTar.y + infoFit[key]["y"] * s;
				}else{
					rec=Tool_SpriteUtils.getBounds(child,tar);
					rec2=Tool_SpriteUtils.getBounds(childTar,tar);
					if(infoFit[key]["关联方式"].charAt(0)=="左"){
						child.x =childTar.x + infoFit[key]["x"] * s;
					}else if(infoFit[key]["关联方式"].charAt(0)=="右"){
						child.x +=rec2.right + infoFit[key]["x"] * s -rec.right;
					}else if(infoFit[key]["关联方式"].charAt(0)=="中"){
						child.x =rec2.x+rec2.width/2  -rec.width/2 + infoFit[key]["x"] * s;
					}
					if(infoFit[key]["关联方式"].charAt(1)=="上"){
						child.y =childTar.y + infoFit[key]["y"] *s;
					}else if(infoFit[key]["关联方式"].charAt(1)=="下"){
						child.y +=rec2.bottom+ infoFit[key]["y"] * s - rec.bottom;
					}else if(infoFit[key]["关联方式"].charAt(1)=="中"){
						child.y =rec2.y+rec2.height/2-rec.height/2 + infoFit[key]["y"] * s  ;
					}
				}
				arrWaiteRelationship.splice(i--,1);
			}
			if(L==arrWaiteRelationship.length || arrWaiteRelationship.length==0){break;}
			L=arrWaiteRelationship.length;
		}
	}
	/**
	 * 记录关联属性
	 * */
	private static onSaveAssociated(infoSelf:any, tar:any,   child:any):void{
		var childTar:any =tar.getChildByName(infoSelf["tar"]);
		if(childTar == null){return;}
		if(infoSelf["关联方式"] == null){
			infoSelf["x"]=child.x - childTar.x;
			infoSelf["y"]=child.y - childTar.y;
		}else{
			var rec:any =Tool_SpriteUtils.getBounds(child,tar);
			var rec2:any =Tool_SpriteUtils.getBounds(childTar,tar);
			if(infoSelf["关联方式"].charAt(0)=="左"){
				infoSelf["x"]=child.x - childTar.x;
			}else if(infoSelf["关联方式"].charAt(0)=="右"){
				infoSelf["x"]=rec.right - rec2.right;
			}else if(infoSelf["关联方式"].charAt(0)=="中"){
				infoSelf["x"]=rec.x+rec.width/2 - (rec2.x+rec2.width/2);
			}
			if(infoSelf["关联方式"].charAt(1)=="上"){
				infoSelf["y"]=child.y - childTar.y;
			}else if(infoSelf["关联方式"].charAt(1)=="下"){
				infoSelf["y"]=rec.bottom - rec2.bottom;
			}else if(infoSelf["关联方式"].charAt(1)=="中"){
				infoSelf["y"]=rec.y+rec.height/2 - (rec2.y+rec2.height/2);
			}
		}
	}
	/**
	 * 适配一个元件
	 * @param infoSelf =infoFit[key]
	 * */
	private static onFitOne(recCombo:any,    infoSelf:any):any{
		var w0:number =50;
		var h0:number =50;
		var typex:String;
		var typey:String;
		var info:any ={};
		if(infoSelf && infoSelf["强制rec"]!=null){
			if(infoSelf["强制rec"] instanceof Array){
				if(infoSelf["强制rec"][0] != null){
					recCombo.x = infoSelf["强制rec"][0];
				}
				if(infoSelf["强制rec"][1] != null){
					recCombo.y = infoSelf["强制rec"][1];
				}
				if(infoSelf["强制rec"][2] != null){
					recCombo.width = infoSelf["强制rec"][2];
				}
				if(infoSelf["强制rec"][3] != null){
					recCombo.height = infoSelf["强制rec"][3];
				}
			}else{
				recCombo =infoSelf["强制rec"];
			}
		}
		if(recCombo.x<w0){	info["左"]=true;}
		if(recCombo.x+recCombo.width > Config.stageW-w0){info["右"]=true;	}
		if(recCombo.y<h0){	info["上"]=true;	}
		if(recCombo.y+recCombo.height>Config.stageH-h0){	info["下"]=true;		}
		if(info["左"]== info["右"]){typex="中";}
		else if(info["左"]==true){typex="左";}
		else{	typex="右";}
		if(info["上"]==info["下"]){	typey="中";}
		else if(info["上"]==true){typey="上";}
		else{	typey="下";}
		//强制类型
		if(infoSelf && infoSelf["x"] != null){typex =infoSelf["x"]; }
		if(infoSelf && infoSelf["y"] != null){typey =infoSelf["y"]; }
		if(infoSelf && infoSelf["类型"] != null){
			typex =infoSelf["类型"].charAt(0);
			typey =infoSelf["类型"].charAt(1);
		}
		var sCombine:number =1;
		var rec:any ={};
		if(infoSelf && infoSelf["缩放"] && infoSelf["缩放"] ==("xy")){
			rec["sx"]=(Config.stageScaleInfo["屏幕w"] * recCombo.width / Config.stageW) / recCombo.width;
			rec["sy"]=(Config.stageScaleInfo["屏幕h"] * recCombo.height / Config.stageH) / recCombo.height;
			rec["x"]=0;
			rec["y"]=0;
			return rec;
		}
		else if(infoSelf && infoSelf["缩放"] && infoSelf["缩放"].indexOf("x")!=-1 ){
			sCombine=(Config.stageScaleInfo["屏幕w"] * recCombo.width / Config.stageW) / recCombo.width;
		}else if(infoSelf && infoSelf["缩放"] && infoSelf["缩放"].indexOf("y")!=-1){
			sCombine=(Config.stageScaleInfo["屏幕h"] * recCombo.height / Config.stageH) / recCombo.height;
		}else{//表示根据宽高自动选择缩放方式
			if(this.isFat==true){//更宽，y轴
				sCombine=(Config.stageScaleInfo["屏幕h"] * recCombo.height / Config.stageH) / recCombo.height;
			}else{//更高，x轴
				sCombine=(Config.stageScaleInfo["屏幕w"] * recCombo.width / Config.stageW) / recCombo.width;
			}
		}
		rec["s"]=sCombine;
		if(typex=="左"){
			rec.x =(recCombo.x / Config.stageW)  * Config.stageScaleInfo["屏幕w"];
		}else if(typex=="右"){
			rec.x =Config.stageScaleInfo["屏幕w"]- ((Config.stageW-recCombo.right)/Config.stageW) * Config.stageScaleInfo["屏幕w"] - recCombo.width * sCombine;
		}else if(typex=="中"){
			rec.x =Config.stageScaleInfo["屏幕w"]/2 +((recCombo.x+recCombo.width/2 - Config.stageW/2)/Config.stageW) * Config.stageScaleInfo["屏幕w"] - recCombo.width * sCombine/2;
		}
		if(typey=="上"){
			rec.y =(recCombo.y / Config.stageH)  * Config.stageScaleInfo["屏幕h"];
		}else if(typey=="下"){
			rec.y =Config.stageScaleInfo["屏幕h"]- ((Config.stageH-recCombo.bottom)/Config.stageH) * Config.stageScaleInfo["屏幕h"] - recCombo.height * sCombine;
		}else{
			rec.y =Config.stageScaleInfo["屏幕h"]/2 +((recCombo.y+recCombo.height/2 - Config.stageH/2)/Config.stageH) * Config.stageScaleInfo["屏幕h"] - recCombo.height * sCombine/2;
		}
		return rec;
	}
	
	
	
	
	/** 适配弹窗：type0：拉伸适配。type1：x铺满整体缩放,y轴居中。type2：原点居中屏幕。type3：原点居中并缩放 。
	 * type4：原本元件不居中，但用居中对齐，并将底放大到铺满。type4.1：没有底的居中对齐
	 * type4.2：底x铺满y居中，其他居中
	 * type5：x铺满整体缩放，y轴不变；
	 * type6：y铺满整体缩放，x轴不移动	
	*/
	public static onWindowFitScreen(sprWin:laya.display.Sprite,	scaleType:number=0):void{
		if(scaleType==0){
			var rec:laya.maths.Rectangle=Tool_SpriteUtils.getBounds(sprWin,sprWin.parent);
			var sw:number =rec.width/Config.stageW;
			var sh:number =rec.height/Config.stageH;
			var wNeed:number =Config.stageScaleInfo["屏幕w"] * sw;
			var hNeed:number =Config.stageScaleInfo["屏幕h"] * sh;
			sprWin.scaleX *= wNeed/rec.width;
			sprWin.scaleY *= hNeed/rec.height;
		}else if(scaleType==1){
			sw =Config.stageScaleInfo["屏幕w"]/Config.stageW;//横向应该缩放大小
			hNeed =(Config.stageH -Config.stageH * sw) / 2;//纵向变化大小
			sprWin.scaleX *= sw;
			sprWin.scaleY *= sw;
			sprWin.y +=hNeed + (Config.stageScaleInfo["屏幕h"] - Config.stageH);
		}else if(scaleType==5){
			sw =Config.stageScaleInfo["屏幕w"]/Config.stageW;//横向应该缩放大小
			sprWin.scaleX *= sw;
			sprWin.scaleY *= sw;
		}
		else if(scaleType==6){
			sw =Config.stageScaleInfo["屏幕h"]/Config.stageH;//纵向应该缩放大小
			sprWin.scaleX *= sw;
			sprWin.scaleY *= sw;
		}
		else if(scaleType==2){
			sprWin.x =Config.stageScaleInfo["屏幕w"]/2;
			sprWin.y =Config.stageScaleInfo["屏幕h"]/2;
		}else if(scaleType==3){
			sprWin.x =Config.stageScaleInfo["屏幕w"]/2;
			sprWin.y =Config.stageScaleInfo["屏幕h"]/2;
			rec=Tool_SpriteUtils.getBounds(sprWin,sprWin.parent);
			sw =rec.width/Config.stageW;
			sh =rec.height/Config.stageH;
			wNeed =Config.stageScaleInfo["屏幕w"] * sw;
			hNeed =Config.stageScaleInfo["屏幕h"] * sh;
			var smin:number =wNeed/rec.width;
			if(hNeed/rec.height < smin){
				smin=hNeed/rec.height;
			}
			sprWin.scaleX *= smin;
			sprWin.scaleY *= smin;
		}else if(scaleType>=4 && scaleType <5){
			wNeed =Config.stageW  -Config.stageScaleInfo["屏幕w"];
			hNeed =Config.stageH  -Config.stageScaleInfo["屏幕h"];
			if(wNeed==hNeed){return;}
			if(wNeed>hNeed){
				sprWin.scaleX = (Config.stageW -wNeed) / Config.stageW;
				sprWin.scaleY=sprWin.scaleX;
				sprWin.y =(Config.stageH * (1-sprWin.scaleY))/2;
			}else{
				sprWin.scaleY = (Config.stageH -hNeed) / Config.stageH;
				sprWin.scaleX=sprWin.scaleY;
				sprWin.x =(Config.stageW * (1-sprWin.scaleX))/2;
			}
			if(scaleType!=4.1){
				let b:any =sprWin.getChildAt(0);
				if(wNeed>hNeed){
					b.y =-sprWin.y / sprWin.scaleY;
					b.scaleY /= sprWin.scaleX;
				}else{
					b.x =-sprWin.x / sprWin.scaleX;
					b.scaleX /= sprWin.scaleY;
					if(scaleType==4.2){
						b.y -= (b.height - Config.stageScaleInfo["屏幕h"])/(2 * sprWin.scaleY);
					}
				}
			}
		}
	}
}
}