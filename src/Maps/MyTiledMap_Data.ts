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
				this.dicUrl[n]=new MyTiledMap_Data_One(this.dicUrl[n]);
			}
			this.Layer1_rows =jobj["地表"];
			this.Layer3_rows =jobj["阴影"];
			this.Layer4_rows =com.MyClass.Tools.Tool_ObjUtils.CopyF(jobj["物体"],false);
			if(this.Layer4_rows==null)this.Layer4_rows={};
		}
		/** 添加资源URL，传入新的url */
		public addNewUrlSource(dicNew:Object):void{
			for(let key in dicNew){
				this.dicUrl[key]=new MyTiledMap_Data_One(dicNew[key]);
			}
		}
		/** 添加资源，传入新的第四层物体数据={1:{"b1":[1]}} */
		public onAddNewLayer4Data(dicNewlayer4:Object):void{
			com.MyClass.Tools.Tool_ObjUtils.onComboObject(this.Layer4_rows,dicNewlayer4,false);
		}
	}
	export class MyTiledMap_Data_One{
		public swf:string;
		public url:string;
		public size:number=1;
		//特殊
		public dicSpe:Object;
		constructor(jobj:Object){
			this.swf =jobj["swf"];
			this.url=jobj["url"];
			if(jobj["size"])this.size=jobj["size"];
			this.dicSpe=jobj["属性"];
		}
	}
}