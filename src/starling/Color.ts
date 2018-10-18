module starling{
export class Color{
public static WHITE:number   = 0xffffff;
	public static  SILVER:number  = 0xc0c0c0;
	public static  GRAY:number    = 0x808080;
	public static  BLACK:number   = 0x000000;
	public static  RED:number     = 0xff0000;
	public static  MAROON:number  = 0x800000;
	public static  YELLOW:number  = 0xffff00;
	public static  OLIVE:number   = 0x808000;
	public static  LIME:number    = 0x00ff00;
	public static  GREEN:number   = 0x008000;
	public static  AQUA:number    = 0x00ffff;
	public static  TEAL:number    = 0x008080;
	public static  BLUE:number    = 0x0000ff;
	public static  NAVY:number    = 0x000080;
	public static  FUCHSIA:number = 0xff00ff;
	public static  PURPLE:number  = 0x800080;

	/** Returns the alpha part of an ARGB color (0 - 255). */
	public static  getAlpha(color:number):number { return (color >> 24) & 0xff; }

	/** Returns the red part of an (A)RGB color (0 - 255). */
	public static  getRed(color:number):number   { return (color >> 16) & 0xff; }

	/** Returns the green part of an (A)RGB color (0 - 255). */
	public static  getGreen(color:number):number { return (color >>  8) & 0xff; }

	/** Returns the blue part of an (A)RGB color (0 - 255). */
	public static  getBlue(color:number):number  { return  color        & 0xff; }

	/** Sets the alpha part of an ARGB color (0 - 255). */
	public static  setAlpha(color:number, alpha:number):number
	{
		return (color & 0x00ffffff) | (alpha & 0xff) << 24;
	}

	/** Sets the red part of an (A)RGB color (0 - 255). */
	public static  setRed(color:number, red:number):number
	{
		return (color & 0xff00ffff) | (red & 0xff) << 16;
	}

	/** Sets the green part of an (A)RGB color (0 - 255). */
	public static  setGreen(color:number, green:number):number
	{
		return (color & 0xffff00ff) | (green & 0xff) << 8;
	}

	/** Sets the blue part of an (A)RGB color (0 - 255). */
	public static  setBlue(color:number, blue:number):number
	{
		return (color & 0xffffff00) | (blue & 0xff);
	}

	/** Creates an RGB color, stored in an unsigned numbereger. Channels are expected
	 *  in the range 0 - 255. */
	public static  rgb(red:number, green:number, blue:number):number
	{
		return (red << 16) | (green << 8) | blue;
	}

	/** Creates an ARGB color, stored in an unsigned numbereger. Channels are expected
	 *  in the range 0 - 255. */
	public static  argb(alpha:number, red:number, green:number, blue:number):number
	{
		return (alpha << 24) | (red << 16) | (green << 8) | blue;
	}

	/** Converts a color to a vector containing the RGBA components (in this order) scaled
	 *  between 0 and 1. */
	public static  toVector(color:number, out:Array<number>=null):Array<number>
	{
		if (out == null) out = new Array<number>();

		out[0] = ((color >> 16) & 0xff) / 255.0;
		out[1] = ((color >>  8) & 0xff) / 255.0;
		out[2] = ( color        & 0xff) / 255.0;
		out[3] = ((color >> 24) & 0xff) / 255.0;

		return out;
	}

	/** Multiplies all channels of an (A)RGB color with a certain factor. */
	public static  multiply(color:number, factor:number):number
	{
		if (factor == 0.0) return 0x0;

		var alpha:number = ((color >> 24) & 0xff) * factor;
		var red:number   = ((color >> 16) & 0xff) * factor;
		var green:number = ((color >>  8) & 0xff) * factor;
		var blue:number  = ( color        & 0xff) * factor;

		if (alpha > 255) alpha = 255;
		if (red   > 255) red   = 255;
		if (green > 255) green = 255;
		if (blue  > 255) blue  = 255;

		return this.argb(alpha, red, green, blue);
	}

	/** Calculates a smooth transition between one color to the next.
	 *  <code>ratio</code> is expected between 0 and 1. */
	public static  numbererpolate(startColor:number, endColor:number, ratio:number):number
	{
		var startA:number = (startColor >> 24) & 0xff;
		var startR:number = (startColor >> 16) & 0xff;
		var startG:number = (startColor >>  8) & 0xff;
		var startB:number = (startColor      ) & 0xff;

		var endA:number = (endColor >> 24) & 0xff;
		var endR:number = (endColor >> 16) & 0xff;
		var endG:number = (endColor >>  8) & 0xff;
		var endB:number = (endColor      ) & 0xff;

		var newA:number = startA + (endA - startA) * ratio;
		var newR:number = startR + (endR - startR) * ratio;
		var newG:number = startG + (endG - startG) * ratio;
		var newB:number = startB + (endB - startB) * ratio;

		return (newA << 24) | (newR << 16) | (newG << 8) | newB;
	}

	/** @private */
	public  Color() { throw new Error(); }
}
}