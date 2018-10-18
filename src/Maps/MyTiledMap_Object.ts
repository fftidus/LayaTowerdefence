module Maps{
	export class MyTiledMap_Object extends starling.Sprite{
		public static PoolName_Ground:string="Map_G";
		public static getOne(data:MyTiledMap_Data_urlOne,	row:number,col:number):MyTiledMap_Object{
			var pool:com.MyClass.Tools.MyPools = MyTiledMap.pool;
			if (pool && pool.hasPool(this.PoolName_Ground) == false) {
				pool.registF(this.PoolName_Ground);
			}
			var one:MyTiledMap_Object;
			if(pool){
				one= pool.getFromPool(this.PoolName_Ground);
			}
			if (one == null) {
				one = new MyTiledMap_Object();
			}
			one.initF(data,	row,col);
			return one;
		}
		//-------------------------------------------------------------------------
		public CID:number;
		public Role:MyTiledMap_ObjView;
		private map:MyTiledMap;
		public row:number;
		public col:number;
		public layerIndex:number;
		public url:string;
		/** 占用格子大小 */
		public sizeNum:number=1;

		constructor(){
			super();
			this.CID =MyTiledMap.countObject++;
		}

		public initF(data:MyTiledMap_Data_urlOne,	row:number,col:number):void{
			if(this.Role==null){
				this.Role=MyTiledMap_ObjView.getOne(data.swf,data.url);
				this.addChild(this.Role);
			}
			this.sizeNum=data.size;
			this.url =data.url;
			this.row=row;
			this.col=col;
		}
		public setMap(map:MyTiledMap,	index:number):void{
			this.map =map;
			this.layerIndex =index;
			this.refreshXY();
		}
		/** 改变了row、col后刷新xy */
		public refreshXY():void{
			this.x =this.map.data.width * (this.col-1) / 2 - this.map.data.width * (this.row-1+1) / 2;
			this.y =(this.row-1 + this.col-1) * this.map.data.height/2;
		}


		/** 清理：人物等不缓存，直接清理。地面等地图素材缓存。 */
		public removeF():void{
			// this.destroyF();
			if(this.CID!=-1 && this.map){
				this.map.removeObject(this);
				return;
			}
			this.removeFromParent(false);
			if(this.Role){
				this.Role.removeF();
				this.Role=null;
			}
			this.map=null;
			if(MyTiledMap.pool)MyTiledMap.pool.returnToPool(MyTiledMap_Object.PoolName_Ground,this);
		}
		public destroyF():void{
			this.map=null;
			com.MyClass.Tools.Tool_ObjUtils.destroyDisplayObj(this);
			this.Role=com.MyClass.Tools.Tool_ObjUtils.destroyF_One(this.Role);
		}
	}
}