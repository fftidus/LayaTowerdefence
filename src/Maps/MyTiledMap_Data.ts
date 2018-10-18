module Maps{
	export class MyTiledMap_Data{
		/** 一个格子的大小 */
		public width:number;
		public height:number;
		/** 45°坐标系内格子大小（菱形图块的边长） */
		public gripSize:number;
		/** 总共行数 */
		public row:number;
		/** 总共列数 */
		public col:number;
		/** 每个编号物体的url */
		public dicUrl:Object;
		/** 地表层数据 */
		public Layer1_rows:Object;
		/** 阴影层数据 */
		public Layer3_rows:Object;
		/** 物体层数据 */
		public Layer4_rows:Object;

		constructor(jobj:Object){
			this.width =jobj["size"];
			this.height =this.width/2;
			this.gripSize =this.height / Math.SQRT2;
			this.row =jobj["row"];
			this.col =jobj["col"];
			this.dicUrl =jobj["url"];
			for(let n in this.dicUrl){
				this.dicUrl[n]=new MyTiledMap_Data_urlOne(this.dicUrl[n]);
			}
			this.Layer1_rows =jobj["地表"];
			this.Layer3_rows =jobj["阴影"];
			this.Layer4_rows =jobj["物体"];
		}
	}
	export class MyTiledMap_Data_urlOne{
		public swf:string;
		public url:string;
		public size:number=1;
		constructor(jobj:Object){
			this.swf =jobj["swf"];
			this.url=jobj["url"];
			if(jobj["size"])this.size=jobj["size"];
		}
	}
}