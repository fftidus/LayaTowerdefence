module com.MyClass.Tools{
import Sprite=starling.Sprite;
import Handler=laya.utils.Handler;
export class ProgressBar extends Sprite{
	private __width:number;
    public progressBar:any;
    private _type:number;
    private _ratio:number;
    private Fun:Handler;
    private isDestroy:boolean = false;
	private _maskedDisplayObject:any;

	constructor(){
		super();
	}

	private init(_type:number, _image:any):void {
		this._type = _type;
		if (_type == 1) {
			this.progressBar = _image;
			this.__width = _image.width;
			this.progressBar.width = 0;
		} else if (_type == 2) {
			this.progressBar = _image;
			this._ratio = _image.ratio;
		} else if(_type == 3){
			this.progressBar = _image["img"];
			this.progressBar.x = _image["x"];
			this._maskedDisplayObject = _image["maskedObject"];
			this.__width = _image["x"];
		}
	}

/**
 * 初始化一个缩放进度条
 * @param obj
 * @return
 */
public initScaling(obj:any):void {
	if(obj == null){
		Config.LogF("ProgressBar:initScaling参数错误");
		return;
	}
	var _obj:any;
	if (obj instanceof Sprite) {
		_obj = (obj as Sprite).getChildByName("进度条");
		if (_obj == null) {
			_obj = obj;
		}
	} else {
		_obj = obj;
	}
	this.init(1, _obj);
}

/**
 * 初始化圆形进度条
 * @param obj
 * @return
 */
public initQuadSection(obj:any):void {
	var texture:laya.resource.Texture;
	if (obj == null) {
	} else if (obj instanceof Sprite) {
		var image:starling.Image = (obj as Sprite).getChildByName("进度条") as starling.Image;
		if (image != null) {
			texture = image.texture;
		}
	} else if (obj instanceof starling.Image) {
		texture = (obj as starling.Image).texture;
	} else if (obj instanceof laya.resource.Texture) {
		texture = obj;
	}
	if (texture == null) {
		Config.LogF("ProgressBar:initQuadSection参数错误");
		return;
	}
	var q:QuadSection = QuadSection.fromTexture(texture);
	q.ratio = 0;
	if (obj instanceof Sprite) {
		obj.addChildAt(q, obj.getChildIndex(image) + 1);
		q.x = image.x;
		q.y = image.y;
		Tool_ObjUtils.destroyF_One(image);
	} else if (obj instanceof starling.Image) {
		this.addChild(q);
		Tool_SpriteUtils.onAddchild_ChangeParent(this, obj);
		Tool_ObjUtils.destroyF_One(obj);
	} else if (obj instanceof laya.resource.Texture) {
		this.addChild(q);
	}
	this.init(2, q);
}

/**
 * 初始化遮罩进度条，传入对象本身就是个进度条
 * @param image
 */
public initMaskImage(image:any):void {
	if(image == null){
		Config.LogF("ProgressBar:initMaskNoBar参数错误");
		return;
	}
	var img:any;
	if(image instanceof Sprite){
		img = Tool_SpriteUtils.cloneSprite(image);
	}if(image instanceof starling.Image){
		img = Tool_ImgUtils.cloneImage(image);
	}
	image.mask = img;
	var obj:Object = new Object();
	obj["img"] = img;
	obj["maskedObject"] = img;
	obj["x"] = -image.width;
	this.init(3, obj);
}

/**
 * 初始化遮罩进度条，传入对象中包含进度条
 * @param image
 */
public  initMaskSprite(sprite:Sprite):void{
	if(sprite == null){
		Config.LogF("ProgressBar:initMaskHasBar参数错误");
		return;
	}
	var _image:com.MyClass.MySwf.SwfImage;
	_image = sprite.getChildByName("进度条") as com.MyClass.MySwf.SwfImage;
	if(_image == null){
		Config.LogF("ProgressBar:initMaskHasBar参数错误");
		return;
	}
	var img:starling.Image = Tool_ImgUtils.cloneImage(_image);
	img.x = 0;
	img.y = 0;
	_image.mask=img;
	
	var obj:Object = new Object();
	obj["img"] = img;
	obj["maskedObject"] = img;
	obj["x"] = -_image.width;
	this.init(3, obj);
}

public get ratio():number {
	return this._ratio;
}

public set ratio(value:number) {
	if(this.isDestroy){
		return;
	}
	if (value < 0) {
		value = 0;
	} else if (value > 1) {
		value = 1;
	}
	if (this._type == 1) {
		this._ratio = value;
		this.progressBar.width = this.__width * value;
	} else if (this._type == 2) {
		this._ratio = value;
		(this.progressBar as QuadSection).ratio = value;
	} else if(this._type == 3){
	}
}

public setVisible(value:boolean):void
{
	this.visible =value;
	if(this.progressBar)this.progressBar.visible =value;
}

public destroyF():void {
	this.isDestroy = true;
	Tool_ObjUtils.destroyDisplayObj(this);
	this.progressBar = Tool_ObjUtils.destroyF_One(this.progressBar);
	this.Fun = Tool_ObjUtils.destroyF_One(this.Fun);
	this._maskedDisplayObject = Tool_ObjUtils.destroyF_One(this._maskedDisplayObject);
}
}
}