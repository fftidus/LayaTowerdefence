module com.MyClass.MySwf{
	import Tool_Function =com.MyClass.Tools.Tool_Function;
	import Swf =com.MyClass.MySwf.SWF;
	import Handler=laya.utils.Handler;
	import Tool_Object=com.MyClass.Tools.Tool_ObjUtils;
export class SwfMovieClip extends SwfSprite{
public static ANGLE_TO_RADIAN:number = Math.PI / 180;
	public static FPS_default:number=30;

	public _ownerSwf:Swf;//所属swf
		
	private _frames:Array<any>;
	private _labels:Array<any>;
	private _frameEvents:Object;
	private _labelStrings:Array<string>;
	public _displayObjects:Object;
	
	private _startFrame:number;
	private _endFrame:number;
	private _currentFrame:number;
	private _currentLabel:string;
	
	private _isPlay:boolean = false;
	private _loop:boolean = true;
	
	private _complete:Handler = null;//播放完毕的回调
	private _hasCompleteListener:boolean = false;//是否监听过播放完毕的事件
	
	private	numMC:number=0;
	private needUpdateEveryFrame:boolean=false;
	public	frameFunction:Handler;
	private funEnter:Handler;

	public constructor(frames:Array<any>,labels:Array<any>,displayObjects:Object,ownerSwf:Swf) {
		super();
		if(SwfMovieClip.TimeFrame<=0)SwfMovieClip.TimeFrame=1000/SwfMovieClip.FPS_default;
		this.touchable=false;
		this._frames = frames;
		this._labels = labels;
		this._displayObjects = displayObjects;
		
		this._startFrame = 0;
		this._endFrame = this._frames.length - 1;
		this._ownerSwf = ownerSwf;
		
		this.fps=SwfMovieClip.FPS_default;
		this.currentFrame = 0;
		
		var k:string;
		var arr:Array<any>;
		var l:number;
		for(k in this._displayObjects){
			if(k.indexOf(Swf.dataKey_MovieClip) == 0){
				arr = this._displayObjects[k];
				if(arr==null)continue;
				l = arr.length;
				for (var i:number = 0; i < l; i++) {
					this.numMC++;
				}
			}
		}
		this.play();
	}
	public onCashSameFrameInfo(obj:Object):void{
		for(var f in obj){
			this._frames[f]=null;
		}
	}
	public  _frameLoop():void{
		if (!this._isPlay){
			return;
		}
		this.pastTime	+=SwfMovieClip.TimeFrame;
		var f2:number	= Tool_Function.onChangeInstance(this.pastTime/this.NeedTime);
		while(f2>0){
			if(this._ownerSwf==null){
				return;
			}
			this.nextFrame();
			f2--;
			this.pastTime-=this.NeedTime;
		}
	}
	private  nextFrame():void{
		if(this._ownerSwf==null)return;
		if(this._currentFrame >= this._endFrame){
			var isReturn:boolean = false;
			if(!this._loop || this._startFrame == this._endFrame){//只有一帧就不要循环下去了
				if(this._ownerSwf) this.stop(false);
				isReturn = true;
			}
			
			if(this._complete){
				Tool_Function.onRunFunction(this.completeFunction,this);
				this.completeFunction=null;
			}
			if(isReturn) return;
			this._currentFrame = this._startFrame;
		}else{
			this._currentFrame ++;
		}
		this.currentFrame = this._currentFrame;
		if(this._currentFrame >= this._endFrame){
			if(!this._loop || this._startFrame == this._endFrame){//只有一帧就不要循环下去了
				if(this._ownerSwf) this.stop(false);
			if(this._complete){
				Tool_Function.onRunFunction(this.completeFunction,this);
				this.completeFunction=null;
				}
			}
		}
	}
	/**
	 * 删除所有该链接的元件
	 * */
	public  removeChildFromAllFrame(_classLink:string):void{
		var length:number = this._frames.length;
		for (var i:number = 0; i < length; i++) {
			var frameInfos2:Array<any> =this._frames[i];
			if(frameInfos2==null)continue;
			for (var j:number = 0; j < frameInfos2.length; j++) {
				this.data = frameInfos2[j];
				if(this.data instanceof Array == false){
					if(this.data["url"]==_classLink){
						frameInfos2.splice(j--,1);
					}
				}
			}
		}
	}
	/**
	 * 获得某一帧上某个name的元件
	 * */
	public  getChildByName_onFrame(_name:string,f:number):any{
		if(this._frames[f]==null)return null;
		var frameInfos2:Array<any> =this._frames[f];
		for (var j:number = 0; j < frameInfos2.length; j++) {
			this.data = frameInfos2[j];
			if(this.data instanceof Array == false){
				if(this.data["name"]==_name){
					var display:any;
					if(this._displayObjects)		display = this._displayObjects[this.data["url"]][this.data["index"]];
					return display;
				}
			}
		}
		return null;
	}
	
	private __frameInfos:Array<any>;
	/** 设置/获取 当前帧数 */
	public  set currentFrame(frame:number){
		this._currentFrame = frame;
		this.__frameInfos = this._frames[this._currentFrame];
		if(this.frameFunction)Tool_Function.onRunFunction(this.frameFunction);
		if(this.__frameInfos==null || this._ownerSwf==null)return;
		this.onSetCurrentFrame();
	}
	private  onSetCurrentFrame():void
	{
		if(this._displayObjects)	this.clearChild();
		else						this.clearChild(true);
		var data:any;
		var display:any;
		var useIndex:number;
		var length:number = this.__frameInfos.length;
		for (var i:number = 0; i < length; i++) {
			data = this.__frameInfos[i];
			useIndex = data["index"];
			if(data["type"] == SWF.dataKey_Particle){
				var pd:laya.particle.Particle2D=this._displayObjects[data["url"]][useIndex];
				(pd.emitter._particleTemplate as laya.particle.ParticleTemplate2D).x =data.x;
				(pd.emitter._particleTemplate as laya.particle.ParticleTemplate2D).y =data.y;
				pd.alpha = data["alpha"];
				pd.name = data["name"];
				pd.emitter.emit();
				this.addChild(pd);
				continue;
			}
			if(this._displayObjects){
				display = this._displayObjects[data["url"]][useIndex];
			}
			if(display==null){
				if(data["type"] == "text")	display=this._ownerSwf.createTextField(data);
				else 				display=this._ownerSwf.getObject(data["url"]);
				if(display && this._displayObjects){
					this._displayObjects[data["url"]][useIndex]=display;
				}
			}
			if(display==null || (this.dicRemoved!=null && this.dicRemoved[display]==true))continue;
			this._ownerSwf.onCheckDataForFilterAndColor(display,data);
			display.alpha = data["alpha"];
			display.name = data["name"];
			display.x = data["x"];
			display.y = data["y"];
			// display.skewX = data["skewx"] * SwfMovieClip.ANGLE_TO_RADIAN;
			// display.skewY = data["skewy"] * SwfMovieClip.ANGLE_TO_RADIAN;
			if(display.getStyle()!=null && display.getStyle()._tf!=null){
				display.skewX = -data["skewx"];
				display.skewY = data["skewy"];			
			}

			if(this.touchable==true){
				display.touchable=true;
				if(display.mouseEnabled==false){
					display.mouseEnabled=true;
				}
			}
			switch(data["type"]){
				case Swf.dataKey_Scale9:
					display.width = data["w"];
					display.height = data["h"];
					SWF.setBlendMode(display,data["blend"]);
					if(data["color"]!=null){
						SWF.changeColor(display,data["color"]);
					}
					this.addChild(display);
					break;
				case Swf.dataKey_TextField:
					var tx:starling.TextField =display as starling.TextField;
					if(tx.isCleared==true)break;
					tx.width=data["w"];
					tx.height=data["h"];
					tx.format.font=data["font"];
					tx.format.color=data["color"];
					tx.format.size=data["size"];
					tx.format.horizontalAlign=data["align"];
					tx.format.italic=data["italic"];
					tx.format.bold=data["bold"];
					if(tx.text != data["text"] && tx.text != "\r" && tx.text!=""){}
					else if(data["text"] && data["text"] != "\r" && data["text"] != ""){
						tx.text = data["text"];
					}
					SWF.setBlendMode(display,data["blend"]);
					this.addChild(display);
					break;
				case Swf.dataKey_Image:
					display.scaleX = data["sx"];
					display.scaleY = data["sy"];
					SWF.setBlendMode(display,data["blend"]);
					if(data["color"]!=null){
						SWF.changeColor(display,data["color"]);
					}
					this.addChild(display);
					break;
				default:
					display.scaleX = data["sx"];
					display.scaleY = data["sy"];
					 SWF.setBlendMode(display,data["blend"]);
					if(data["color"]!=null){
						SWF.changeColor(display,data["color"]);
					}
					this.addChild(display);
					break;
			}
		}
	}
	
	public  get currentFrame():number{
		return this._currentFrame;
	}
		
	/**
	 * 播放
	 * @param	rePlayChildMovie	子动画是否重新播放
	 * */
	public  play(rePlayChildMovie:boolean = true):void{
		this._isPlay = true;
		
		if(this._currentFrame >= this._endFrame){
			this._currentFrame = this._startFrame;
		}
		if(this.funEnter==null)this.funEnter=Handler.create(this,this._frameLoop,null,false);
		MainManager.getInstence().addEnterFrameFun(this.funEnter);
		if(this.numMC==0 || this._displayObjects==null)return;
		
		var k:string;
		var arr:Array<any>;
		var l:number;
		for(k in this._displayObjects){
			if(k.indexOf(Swf.dataKey_MovieClip) == 0){
				arr = this._displayObjects[k];
				if(arr==null)continue;
				l = arr.length;
				for (var i:number = 0; i < l; i++) {
					if(arr[i]==null || (arr[i] instanceof SwfMovieClip)==false)continue;
					if(rePlayChildMovie) (arr[i] as SwfMovieClip).currentFrame = 0;
					(arr[i] as SwfMovieClip).play(rePlayChildMovie);
				}
			}
		}
		this.needUpdateEveryFrame=rePlayChildMovie;
	}
	
	/**
	 * 停止
	 * @param	stopChild	是否停止子动画
	 * */
	public  stop(stopChild:boolean = false):void{
		this._isPlay = false;
		this.pastTime=0;
		MainManager.getInstence().removeEnterFrameFun(this.funEnter);
		
		if(this.numMC==0)	return;
		
		var k:string;
		var arr:Array<any>;
		var l:number;
		for(k in this._displayObjects){
			if(k.indexOf(Swf.dataKey_MovieClip) == 0){
				arr = this._displayObjects[k];
				if(arr==null)continue;
				l = arr.length;
				for (var i:number = 0; i < l; i++) {
					if(arr[i]==null || (arr[i] instanceof SwfMovieClip)==false)continue;
					if(stopChild==true)	(arr[i] as SwfMovieClip).stop(stopChild);
					else							(arr[i] as SwfMovieClip).play();
				}
			}
		}
		this.needUpdateEveryFrame=!stopChild;
	}
		
	/**
	 * 移动当前帧位置并停止播放
	 * @param frame  帧数或标签,使用的是帧数则从该帧起至总帧数的播放范围,使用的是标签则播放范围是该标签所属的.
	 * @param stopChild  是否停止子动画
	 * */	
	public  gotoAndStop(frame:Object,stopChild:boolean = false):void{
		this.goTo(frame);
		this.onCheckLastNotNullFrame();
		this.stop(stopChild);
	}
	
	/**
	 * 移动当前帧位置并开始播放
	 * @param frame	 帧数或标签,使用的是帧数则从该帧起至总帧数的播放范围,使用的是标签则播放范围是该标签所属的.
	 * @param rePlayChildMovie  子动画是否重新播放
	 * */	
	public  gotoAndPlay(frame:Object,rePlayChildMovie:boolean = false):void{
		this.goTo(frame);
		this.onCheckLastNotNullFrame();
		this.play(rePlayChildMovie);
	}
	private  onCheckLastNotNullFrame():void//强制更新mc，找到最近的一组数据
	{
		var count:number=0;
		while(this.__frameInfos==null)
		{
			if(this._currentFrame-count<0){
				this.__frameInfos = this._frames[0];
				break;
			}
			this.__frameInfos = this._frames[this._currentFrame-count];
			count++;
		}
		this.onSetCurrentFrame();
	}
	
	/**
	 *  移动到起始帧,并确定播放范围
	 * @param frame 帧或标签
	 * */
	private  goTo(frame:any):void{
		if(typeof frame == "string"){
			var labelData:Array<any> = this.getLabelData(frame);
			this._currentLabel = labelData[0];
			this._currentFrame = this._startFrame = labelData[1];
			this._endFrame = labelData[2];
		}else{
			if(frame < 0)frame=0;
			this._currentFrame = this._startFrame = frame;
			this._endFrame = this._frames.length - 1;
		}
		this.currentFrame = this._currentFrame;
	}
	
	/**
	 * 获取标签信息 
	 * @param label 标签名
	 * @return 返回[标签名,起始帧数,结束帧数]
	 * */		
	public  getLabelData(label:any):Array<any>{
		var length:number = this._labels.length;
		var labelData:Array<any>;
		for (var i:number = 0; i < length; i++) {
			labelData = this._labels[i];
			if(labelData[0] == label){
				return labelData;
			}
		}
		return null;
	}
	
	/**
	 * 是否再播放
	 * */
	public  get isPlay():boolean{
		return this._isPlay;
	}
	
	/**
	 * 设置/获取 是否循环播放
	 * */
	public  get loop():boolean{
		return this._loop;
	}
	public  set loop(value:boolean){
		this._loop = value;
	}
	
	/**
	 * 设置播放完毕的回调
	 */		
	public set completeFunction(value:Handler){
		this._complete = value;
	}
	public  get completeFunction():Handler{
		return this._complete;
	}
	
	/**
	 * 总共有多少帧
	 * */
	public  get totalFrames():number{
		return this._frames.length;
	}
	
	/**
	 * 返回当前播放的是哪一个标签
	 * */
	public  get currentLabel():String{
		return this._currentLabel;
	}
	
	/**
	 * 获取所有标签
	 * */
	public  get labels():Array<any>{
		if(this._labelStrings != null) return this._labelStrings;
		this._labelStrings = [];
		var length:number = this._labels.length;
		for (var i:number = 0; i < length; i++) {
			this._labelStrings.push(this._labels[i][0]);
		}
		return this._labelStrings;
	}
	
	/**
	 * 是否包含某个标签
	 * */
	public  hasLabel(label:string):boolean{
		return !(this.labels.indexOf(label) == -1);
	}
	
	/** 设置/获取 开始播放的帧 */
	public  set startFrame(value:number){
		this._startFrame = value < 0 ? 0 : value;
		this._startFrame = this._startFrame > this._endFrame ? this._endFrame : this._startFrame;
	}
	public  get startFrame():number{
		return this._startFrame;
	}
		
	/** 设置/获取 结束播放的帧 */
	public  set endFrame(value:number){
		this._endFrame = value > this._frames.length - 1 ? this._frames.length - 1 : value;
		this._endFrame = this._endFrame < this._startFrame ? this._startFrame : this._endFrame;
	}
	public  get endFrame():number{
		return this._endFrame;
	}
	
	private dicRemoved:Object;
	public  removeChildF(child:any,dispose:boolean=true):void{
		if(this.dicRemoved==null)this.dicRemoved={};
		if(child instanceof String){
			child=this.getChildByName(child as string);
		}
		if(child!=null){
			this.dicRemoved[child]=true;
			this.removeChild(child);
		}
	}
		
	public destroyF():void{
		this.dicRemoved=null;
		this.frameFunction=Tool_Object.destroyF_One(this.frameFunction);
		this.completeFunction=Tool_Object.destroyF_One(this.completeFunction);
		if(this._displayObjects){
			for (var key in this._displayObjects) {
				let array:Array<any> = this._displayObjects[key];
				var len:number = array.length;
				for (let i:number = 0; i < len; i++) {
					if(array[i]){
						array[i].removeFromParent(true);
					}
				}
			}
			this._displayObjects=null;
		}
		this._ownerSwf = null;
		if(this._isPlay){
			this._isPlay=false;
			MainManager.getInstence().removeEnterFrameFun(this.funEnter);
		}
	}
	
	/** 每帧的时长 */
	public static TimeFrame:number=0;
	/** 预缓存的动画数量 */
	public static CacheNumBegin:number =9999999;
	/** 动画的默认帧频 */
	private	NeedTime:number;
	private	pastTime:number=0;
	private	_fps:number;
	public  get fps():number{	return this._fps;	}
	public  set fps(value:number)	{
		this._fps = value;
		this.NeedTime=1000/this._fps;
	}


}
}