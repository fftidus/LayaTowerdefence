module Maps{
export class MyTiledMap extends starling.Sprite{
	public static pool:com.MyClass.Tools.MyPools;
	public static countObject:number;
	private INDEX_Shadow:number=2;
	private INDEX_GLight:number=3;

	public data:MyTiledMap_Data;
	public camera:MyTiledMap_Camera;
	//显示
	private dicLayers:Object ={};
	private dicObjects:Object={};
	private dicLayerData:Object ={};//每层的每个格子对应的object，多格物体则每个格子都是它
	private dicNeedSort:Object={};

	constructor(){
		super();
		MyTiledMap.pool =new com.MyClass.Tools.MyPools();
		MyTiledMap.countObject =1;
		for(let i=1;i<=5;i++){
			this.dicNeedSort[i]=true;
			this.dicLayers[i]=new starling.Sprite();
			this.addChild(this.dicLayers[i]);
			if(i == this.INDEX_Shadow){//阴影层，不叠加??
				this.dicLayers[i].alpha=0.5;
			}
			this.dicLayerData[i]={};
		}
	}
	public initF():void{
		if(this.data==null){return;}
		//生成地图----------
		var fun =(dic:Object,	index:number)=>{
			if(this.dicLayers[index]==null)return;
			for(let row in dic){
				let info =dic[row];
				for(let name in info){
					if(this.data.dicUrl==null || this.data.dicUrl[name]==null){
						com.MyClass.Config.onThrowNewErrorF("地图数据中找不到["+name+"]的资源数据");
						continue;
					}
					let arr:Array<number> =info[name];
					for(let i=0;i<arr.length;i++){
						let one =MyTiledMap_Object.getOne(this.data.dicUrl[name],parseInt(row),arr[i]);
						this.addMapObjectToLayer(one,index);
					}
				}
			}
		};
		if(this.data.Layer1_rows){
			fun.apply(this,[this.data.Layer1_rows,1]);
		}
		if(this.data.Layer4_rows){
			fun.apply(this,[this.data.Layer4_rows,4]);
		}
		//----------
		this.camera=new MyTiledMap_Camera(this);
		this.enterF();
	}

	/**
	 * 帧频事件
	 * */
	public enterF():void{
		this.camera.enterF();
		this.onSortGrips();
	}

	/** 排序图块 */
	private onSortGrips():void{
		for(var l in this.dicNeedSort){
			if(this.dicNeedSort[l] == true){
				this.dicNeedSort[l]=false;
				for(var key in this.dicLayers) {
					let index =parseInt(key);
					if(index==3){continue;}
					var _layer:starling.Sprite =this.dicLayers[index];
					var arrGrips = _layer._childs;
					arrGrips.sort(function (obj1:MyTiledMap_Object, obj2:MyTiledMap_Object):number {
						if(obj1.row > obj2.row)return 1;
						if(obj1.row < obj2.row)return -1;
						if(obj1.col > obj2.col)return 1;
						return -1;
					});
				}
			}
		}
	}
	/** 添加ob，index取值1~5，默认-1表示物体层级4，2阴影层，3地面特效层，1地表层j */
	public addMapObjectToLayer(obj:MyTiledMap_Object,   index:number=-1):void{
		if(index==-1) {//默认添加到物体层
			index =4;
		}
		if(this.dicLayers[index]){
			this.dicLayers[index].addChild(obj);
			obj.setMap(this,index);
			if(index!=3 && index != 2){
				this.dicNeedSort[index]=true;
			}
			this.dicObjects[obj.CID]=obj;
			//添加到数据
			if(this.dicLayerData[obj.layerIndex] != null){
				for(let i=0;i<obj.sizeNum;i++){
					if(this.dicLayerData[obj.layerIndex][obj.row+i]==null)this.dicLayerData[obj.layerIndex][obj.row+i]={};
					for(let j=0;j<obj.sizeNum;j++){
						this.dicLayerData[obj.layerIndex][obj.row+i][obj.col+j] =obj.CID;
					}
				}
			}
		}
	}
	/** 添加动画到最上层级 */
	public addMcToTopLayer(mc:MyTiledMap_Object):void{
		this.addMapObjectToLayer(mc,5);
	}
	/** 删除obj */
	public removeObject(obj:MyTiledMap_Object):void{
		if(this.dicLayerData[obj.layerIndex]){
			for(let i=0;i<obj.sizeNum;i++){
				if(this.dicLayerData[obj.layerIndex][obj.row+i]){
					for(let j=0;j<obj.sizeNum;j++){
						delete this.dicLayerData[obj.layerIndex][obj.row+i][obj.col+j];
					}
				}
			}
		}
		delete this.dicObjects[obj.CID];
		obj.CID=-1;
		obj.removeF();
	}

	/**
	 * 点击地图
	 */
	public onClickMapF(p:any):void{
		let _x:number =p.x;
		let _y:number =p.y;
		_x =(_x -this.x) / this.scaleX;
		_y =(_y -this.y) / this.scaleY;
		if(_y<0)return;
		//m：row范围<=m+1，col范围<=m+1
		//n：col - row -1 =n
		var halfw = this.data.width/2;
		var halfh = this.data.height/2;
		var wOneCol = (this.data.row+1) * halfw;//一列的总宽度
		var hOneRow = (this.data.col+1) * halfh;//一行的总高度
		for(let row =1;row<=this.data.row;row++){
			if(_y<(row-1) * halfh)break;
			if(_y>(row-1) * halfh + hOneRow)continue;
			for(let col=1;col<=this.data.col;col++){
				if(_x < col * halfw -wOneCol)	break;
				if(_x > col * halfw)continue;
				this.p1.x= (col-row) * halfw;
				this.p1.y=(row+col-2) * halfh;
				this.p2.x=this.p1.x +halfw;
				this.p2.y=this.p1.y + halfh;
				this.p3.x= this.p1.x;
				this.p3.y=this.p2.y +halfh;
				this.p4.x=this.p1.x -halfw;
				this.p4.y=this.p2.y;
				if(com.MyClass.Tools.Tool_HitTest.onPoint_IN_Eclipse([this.p1,this.p2,this.p3,this.p4],null,_x,_y) == true){
					console.log("点击"+row+":"+col);
					console.log("选中物体："+this.getObjectByRC(row,col));
					break;
				}
			}
		}
	}
	private p1 ={"x":0,"y":0};
	private p2 ={"x":0,"y":0};
	private p3 ={"x":0,"y":0};
	private p4 ={"x":0,"y":0};
	/**
	 * 根据row、col得到对应位置的物体。只判断4,2两层！
	 */
	public getObjectByRC(r:number,c:number):MyTiledMap_Object{
		for(let i=4;i>=2;i--){
			if(i==3)continue;
			if(this.dicLayerData[i]==null || this.dicLayerData[i][r]==null || this.dicLayerData[i][r][c]==null)continue;
			if(this.dicObjects[this.dicLayerData[i][r][c]]){
				return this.dicObjects[this.dicLayerData[i][r][c]];
			}
		}
		return null;
	}

	/**
	 * 缩放地图
	 */
	public onScaleF(s:number):void{
		if(s>2)s=2;
		else if(s<0.2)s=0.2;
		this.scaleX=this.scaleY = s;
	}
	/**
	 * 移动地图
	 */
	public onMoveCamera(_x:number,_y:number):void{
		this.camera.nowX+=_x;
		this.camera.nowY+=_y;
	}
	
	public destroyF():void{
		if(MyTiledMap.pool){
			MyTiledMap.pool.destroyF();
			MyTiledMap.pool=null;
		}
		this.removeFromParent();
		this.dicLayers = com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.dicLayers);
	}
}
}