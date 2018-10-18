module com.MyClass.Tools{
export class Tool_Textfield{
	public static newTextfield(w:number,h:number,text:string,font:string,size:number,col:number
								,vUD:string="中",hLR:string="中",	italic:boolean=false,bold:boolean=false):starling.TextField{
		var t:starling.TextField=new starling.TextField(w,h,text);
		t.font=font;
		t.fontSize=size;
		t.color="#"+col.toString(16);
		if(vUD=="上"||vUD=="up")			t.valign="top";
		else if(vUD=="下"||vUD=="down")	t.valign="bottom";
		else							t.valign="middle";
		if(hLR=="左"||hLR=="left")		t.align="left";
		else if(hLR=="右"||hLR=="right")	t.align="right";
		else							t.align="center";

		t.width=w;
		t.height=h;
		t.italic=italic;
		t.bold=bold;
		t.text = text;

		t.autoScale=true;
		return t;
	}

}
}