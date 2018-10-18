module com.MyClass.Tools{
	export class Tool_HitTest{
		 /**
		 * 目标点是否在多边形之内(任意多边形)<br>若p点在多边形顶点或者边上，返回值不确定，需另行判断
		 * @param vertexList    多边形顶点数组
		 * @param p                被判断点
		 * @param px              被判断点X(可选)
		 * @param py              被判断点Y(可选)
		 **/
		public static onPoint_IN_Eclipse(vertexList:any, p:any, px:number = NaN, py:number = NaN):boolean {
			if (vertexList == null) return false;
			if (p == null) {
				if (!isNaN(px) && !isNaN(py)) p = {"x": px, "y": py};
				else return false;
			}
			var n:number = vertexList.length;
			var i:number;
			var p1:any;
			var p2:any;
			var counter:number = 0;
			var xinters:number = 0;
			p1 = vertexList[0];
			for (i = 1; i <= n; i++) {
				p2 = vertexList[i % n];
				if (p.y > Math.min(p1.y, p2.y)) {
					if (p.y <= Math.max(p1.y, p2.y)) {
						if (p.x <= Math.max(p1.x, p2.x)) {
							if (p1.y != p2.y) {
								xinters = (p.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
								if (p1.x == p2.x || p.x <= xinters) counter++;
							}
						}
					}
				}
				p1 = p2;
			}
			return counter % 2 != 0;
		}
	}
}