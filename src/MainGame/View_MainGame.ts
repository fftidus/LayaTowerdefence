module MainGame{
	import Tool_ObjUtils=com.MyClass.Tools.Tool_ObjUtils;
export class View_MainGame extends starling.Sprite{
	private mso:com.MyClass.MySourceManagerOne=new com.MyClass.MySourceManagerOne();
	private mmo:com.MyClass.MainManagerOne=new com.MyClass.MainManagerOne();
	private UI:MainGame_UI;
	private backBg:Laya.Image;
	private map:Maps.MyTiledMap;
	//地图控制
	private mmeMap:com.MyClass.MyView.MyMouseEventStarling;
	private gesMapMove:com.MyClass.MyGestures.MyGesture_RightSlide;
	//关卡控制
	private source:Object={"能源":100,"木材":100,"矿石":100};
	private peoples:MainGame_Peoples;
	
	constructor(info){
		super();
		com.MyClass.MyView.LayerStarlingManager.getInstence().LayerView.addChild(this);

		this.backBg=new Laya.Image("res/skyBack.jpg");
		this.addChild(this.backBg);
		this.backBg.x = (com.MyClass.Config.stageScaleInfo["屏幕w"] - this.backBg.width)/2;
		this.backBg.y = (com.MyClass.Config.stageScaleInfo["屏幕h"] - this.backBg.height)/2;

		this.map =new Maps.MyTiledMap();
        this.map.data =info.map;
		this.initMission();
        this.addChild(this.map);
        this.map.initF();
		this.addMapController();

		this.UI=new MainGame_UI();
		this.addChild(this.UI);

		this.mmo.addEnterFrameFun(laya.utils.Handler.create(this,this.enterF,null,false));
	}
	/**
	 * 为地图添加控制器，点击，滚动，移动等
	 */
	private addMapController():void{
		this.mmeMap=new com.MyClass.MyView.MyMouseEventStarling(Laya.stage);
		this.mmeMap.setValue("点击",laya.utils.Handler.create(this,this.onClickMapF,null,false));
		this.mmeMap.setValue("滚轮",laya.utils.Handler.create(this,this.onWheelOnMapF,null,false));
		this.gesMapMove=new com.MyClass.MyGestures.MyGesture_RightSlide(Laya.stage,laya.utils.Handler.create(this,this.onRightMouseMoveMap,null,false),null);
	}

	/**
	 * 初始关卡，主塔位置，资源，地形
	 */
	private initMission():void{
		//资源属性
		let dicUrlSource:Object={
			"s1":{"url":"spr_gtype1","swf":"SWF_Fight","size":1,	"属性":{"type":"矿石","num":500}}
			,"b0":{"url":"spr_build0","swf":"SWF_Fight","size":1,	"属性":{"type":"基地"}}
		};
		this.map.data.addNewUrlSource(dicUrlSource);
		//矿位置
		let dicSourceData:Object={
			10:{"s1":[3,4,5,6,7]}
			,11:{"s1":[3,4,5,6,7]}
		};
		this.map.data.onAddNewLayer4Data(dicSourceData);
		//建筑位置
		let dicBuildData:Object={
			10:{"b0":[10]}
		};
		this.map.data.onAddNewLayer4Data(dicSourceData);
		//人口初始化
		this.peoples=new MainGame_Peoples();
	}



	/**
	 * 点击地图
	 */
	private onClickMapF(p:any):void{
		let obj:Maps.MyTiledMap_Object =this.map.onClickMapF(p);
		if(obj==null)return;
		
	}
	/**
	 * 滚轮缩放地图
	 */
	private onWheelOnMapF(delta:number):void{
		if (delta < 0) {//向上滚动：放大
			this.map.onScaleF(this.map.scaleX + 0.2);
		} else {//向下滚动：缩小
			this.map.onScaleF(this.map.scaleX - 0.2);
		}
	}
	/**
	 * 右键按下拖动地图
	 */
	private onRightMouseMoveMap(dic):void{
		this.map.onMoveCamera(-dic["x"],-dic["y"]);
	}

	/**
	 * 帧频
	 */
	private enterF():void{
		this.map.enterF();
	}

	public destroyF():void{
		this.mso=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mso);
		this.mmo=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mmo);
		Tool_ObjUtils.destroyDisplayObj(this);
		Tool_ObjUtils.destroyF_One(this.map);
		Tool_ObjUtils.destroyF_One(this.UI);
		this.mmeMap=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.mmeMap);
		this.gesMapMove=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.gesMapMove);
	}
}
}