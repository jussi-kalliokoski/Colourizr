var Colourizr = (function(){

/**
 * Creates a new Colourizr color representation.
 *
 * @param r Color as RGB, Hex, HSL or 24 bit color value. If other arguments are supplied, acts as the red component.
 * @param g The green component. (Optional)
 * @param b The blue component. (Optional if g is not specified)
 * @param a The alpha component. (Optional)
 * @constructor
 * @this {Colourizr}
*/
function Colourizr(r, g, b, a){
	var	self	= this,
		color	= [255, 255, 255],
		alpha	= 255;
	/**
	 * Applies the color and alpha to This.
	 * @private
	*/
	function use(){
		self.r	= color[0];
		self.g	= color[1];
		self.b	= color[2];
		self.a	= alpha;
	}

	// If already a Colourizr
	if (r instanceof Colourizr){
		return r;
	}
	// If a string
	if (typeof r === 'string'){
		r = r.toLowerCase();
		if (Colourizr.namedColors[r]){
			color = Colourizr.Hex2RGB(Colourizr.namedColors[r]) || color;
			return use();
		}
		g = /^((hsl)|(rgb))(a?)\(/.exec(r);
		// If is hsl[a](... or rgb[a](...
		if (g){
			// If has alpha component
			a = !!g[4];
			// If is RGB
			if (g[3]){
				g = r.substr(g.length - 1);
				g = /\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*(,\s*([0-9\.]+))?/.exec(g);
				color = [
					Number(g[1]),
					Number(g[2]),
					Number(g[3])
				];
				alpha = a ? (Number(g[5]) * 255)|0 : alpha;
				return use();
			}
			// If is HSL
			g = r.substr(g.length - 1);
			g = /\s*([0-9]+)\s*,\s*([0-9]+)\s*%\s*,\s*([0-9]+)\s*%\s*(,\s*([0-9\.]+))?/.exec(g);
			color	= Colourizr.HSL2RGB(
					Number(g[1]),
					Number(g[2]),
					Number(g[3]));
			alpha	= a ? (Number(g[5]) * 255)|0 : alpha;
			return use();
		}
		// Otherwise, try a hex representation
		color = Colourizr.Hex2RGB(r) || color;
	// If all RGB components are provided.
	} else if (arguments.length > 2) {
		color	= [
			Number(r),
			Number(g),
			Number(b)
		];
		alpha	= typeof a === undefined ? 255 : Number(a)|0;
	// If a number, try getting from a 24Bit color value.
	} else if (typeof r === 'number') {
		color = Colourizr.Bin24Bit2RGB(r);
	}
	use();
}

/**
 * Converts a hex value to RGB.
 *
 * @param {String} hex A string representation of the hex value, with or without the number sign.
 * @return {Array} An array containing the RGB representation, as integers in that order.
*/

Colourizr.Hex2RGB = function(hex){
	if (hex[0] === '#'){
		hex = hex.substr(1);
	}
	if (hex.length === 3){
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length > 5){
		return[
			parseInt(hex.substr(0, 2), 16),
			parseInt(hex.substr(2, 2), 16),
			parseInt(hex.substr(4, 2), 16)
		];
	}
};

/**
 * Converts a HSL value to RGB.
 *
 * @param {Number} h The Hue component.
 * @param {Number} s The Saturation component.
 * @param {Number} l The Lightness component.
 * @return {Array} An array containing the RGB representation, as integers in that order.
*/

Colourizr.HSL2RGB = function(h, s, l){
	/**
	 * Converts a Hue component of HSL to an RGB component.
	 * @private 
	*/
	function Hue2RGB(k, l, h){
		h = (h + 1) % 1;
		var c = h * 6 < 1 ?
			(l + (k - l) * 6 * h) * 100 : (h * 2) < 1 ?
				k * 100 : h * 3 < 2 ?
					(l + (k - l) * (2/3 - h) * 6) * 100 : l * 100;
		return c|0;
	}

	var r, g, b, m, n;

	h	= h / 360;
	s	= s / 100;
	l	= l / 100;

	if (s === 0){
		r = g = b = l * 100;
	} else {
		m = l < .5 ? l * (1 + s) : l + s - (l * s);
		n = 2 * l - m;
		r = Hue2RGB(m, n, h + 1 / 3);
		g = Hue2RGB(m, n, h);
		b = Hue2RGB(m, n, h - 1 / 3);
	}
	return [
		(r * 2.55)|0,
		(g * 2.55)|0,
		(b * 2.55)|0
	];
};

/**
 * Converts a 24 bit color value to RGB.
 *
 * @param {Number} h The color value.
 * @return {Array} An array containing the RGB representation, as integers in that order.
*/

Colourizr.Bin24BitToRGB = function(n){
	return [
		r & 255,
		((r & 65281) / 256)|0,
		((r & 16711680) / 65536)|0
	];
};

/**
 * Converts an RGB value to HSL.
 *
 * @param {Number} r The Red component.
 * @param {Number} g The Green component.
 * @param {Number} b The Blue component.
 * @return {Array} An array containing the HSL representation, as integers in that order.
*/

Colourizr.RGB2HSL = function(r, g, b){
	r		= r / 255,
	g		= g / 255,
	b		= b / 255;
	var	max	= Math.max(r, g, b),
		min	= Math.min(r, g, b),
		d	= max - min,
		h, s, l	= (max + min) / 2;

	if (d === 0){
		h = s = 0;
	} else {
		s = l > 0.5 ? d / (2 - d) : d / (max + min);
		h = (r === max ? (g - b) / d + (g < b ? 6 : 0) : g === max ?
			(b - r) / d + 2 : b === max ?
				(r - g) / d + 4 : 0) / 6;
	}
	return	[(h * 360)|0, (s * 100)|0, (l * 100)|0];
};

/**
 * Converts an RGB value to HSV.
 *
 * @param {Number} r The Red component.
 * @param {Number} g The Green component.
 * @param {Number} b The Blue component.
 * @return {Array} An array containing the HSV representation, as integers in that order.
*/

Colourizr.RGB2HSV = function(r, g, b){
	r		= r / 255,
	g		= g / 255,
	b		= b / 255;
	var	max	= Math.max(r, g, b),
		min	= Math.min(r, g, b),
		d	= max - min,
		iD	= 1 / d,
		h, s, v	= max,
		dR, dG, dB;

	if (d === 0){
		h = s = 0;
	} else {
		s	= d / max;
		dR	= ((max - r) / 6 + d * 0.5) * iD;
		dR	= ((max - g) / 6 + d * 0.5) * iD;
		dR	= ((max - b) / 6 + d * 0.5) * iD;

		h = r === max ? dB - dG : g === max ?
			1 / 3 + dR - dB : b === max ?
				2 / 3 + dG - dR : 0;

		h = h < 0 ? h + 1 : h > 1 ? h -1 : h;
	}
	return [(h*360)|0, (s*100)|0, (h*100)|0];
};

/**
 * Converts an RGB value to Hex.
 *
 * @param {Number} r The Red component.
 * @param {Number} g The Green component.
 * @param {Number} b The Blue component.
 * @return {String} A string representation of the hex value, with a leading number sign.
*/

Colourizr.RGB2Hex = function(r, g, b){
	return '#' +
		(r < 16 ? '0' + (r|0).toString(16) : (r|0).toString(16)) +
		(g < 16 ? '0' + (g|0).toString(16) : (g|0).toString(16)) +
		(b < 16 ? '0' + (b|0).toString(16) : (b|0).toString(16));
};

/**
 * Converts an RGB value to a 24 bit color value.
 *
 * @param {Number} r The Red component.
 * @param {Number} g The Green component.
 * @param {Number} b The Blue component.
 * @return {Integer} A 3 byte representation of the color.
*/

Colourizr.RGB2Bin24Bit = function(r, g, b){
	return (b << 16) + (g << 8) + r;
};

Colourizr.prototype = {
/**
 * Gets a hex representation of the Colourizr object.
 *
 * @return {String} The hex representation.
*/
	toHex: function(){
		return Colourizr.RGB2Hex(this.r, this.g, this.b);
	},
/**
 * Gets a CSS-compatible RGB representation of the Colourizr object.
 *
 * @return {String} The RGB representation.
*/
	toRGB: function(){
		var self = this;
		return 'rgb(' +
			(self.r|0) + ',' +
			(self.g|0) + ',' +
			(self.b|0) + ')';
	},
/**
 * Gets a CSS-compatible RGBA representation of the Colourizr object.
 *
 * @return {String} The RGBA representation.
*/
	toRGBA: function(){
		var self = this;
		return 'rgb(' +
			(self.r|0) + ',' +
			(self.g|0) + ',' +
			(self.b|0) + ',' +
			(self.a / 255) + ')';
	},
/**
 * Gets a 24 bit color value representation of the Colourizr object.
 *
 * @return {Uint24} The color value.
*/
	to24Bit: function(){
		return Colourizr.RGB2Bin24Bit(this.r, this.g, this.b);
	},
/**
 * Gets a 32 bit color value representation of the Colourizr object.
 *
 * @return {Uint32} The color value.
*/
	to32Bit: function(){
		return (this.a << 24) + Colourizr.RGB2Bin24Bit(this.r, this.g, this.b);
	},
/**
 * Gets a CSS-compatible HSL representation of the Colourizr object.
 *
 * @return {String} The HSL representation.
*/
	toHSL: function(){
		var hsl = Colourizr.RGB2HSL(this.r, this.g, this.b);
		hsl[1] += '%';
		hsl[2] += '%';
		return 'hsl(' + hsl.join() + ')';
	},
/**
 * Gets a CSS-compatible HSLA representation of the Colourizr object.
 *
 * @return {String} The HSLA representation.
*/
	toHSLA: function(){
		var hsl = Colourizr.RGB2HSL(this.r, this.g, this.b);
		hsl[1] += '%';
		hsl[2] += '%';
		return 'hsl(' + hsl.join() + ',' + (this.a / 255) + ')';
	},
/**
 * Gets a CSS-compatible HSV representation of the Colourizr object.
 *
 * @return {String} The HSV representation.
*/
	toHSV: function(){
		var hsv = Colourizr.RGB2HSV(this.r, this.g, this.b);
		hsv[1] += '%';
		hsv[2] += '%';
		return 'hsv(' + hsv.join() + ')';
	},
/**
 * Gets a CSS-compatible HSVA representation of the Colourizr object.
 *
 * @return {String} The HSVA representation.
*/
	toHSVA: function(){
		var hsv = Colourizr.RGB2HSV(this.r, this.g, this.b);
		hsv[1] += '%';
		hsv[2] += '%';
		return 'hsva(' + hsv.join() + ',' + (this.a / 255) + ')';
	},
/**
 * Gets a CSS named color representation of the Colourizr object, if available. Otherwise returns undefined.
 *
 * @return {String} The color name.
*/
	toNamedColor: function(){
		var	hex	= this.toHex(),
			k;
		for (k in Colourizr.namedColors){
			if (Colourizr.namedColors.hasOwnProperty(k) && Colourizr.namedColors[k] === hex){
				return k;
			}
		}
	},
	toString: function(){
		return this.toHex();
	}
};

/**
 * A JS object containing the named colors by their names.
*/
Colourizr.namedColors = {
	aliceblue:	'f0f8ff',
	antiquewhite:	'faebd7',
	aqua:		'00ffff',
	aquamarine:	'7fffd4',
	azure:		'f0ffff',
	beige:		'f5f5dc',
	bisque:		'ffe4c4',
	black:		'000000',
	blanchedalmond:	'ffebcd',
	blue:		'0000ff',
	blueviolet:	'8a2be2',
	brown:		'a52a2a',
	burlywood:	'deb887',
	cadetblue:	'5f9ea0',
	chartreuse:	'7fff00',
	chocolate:	'd2691e',
	coral:		'ff7f50',
	cornflowerblue:	'6495ed',
	cornsilk:	'fff8dc',
	crimson:	'dc143c',
	cyan:		'00ffff',
	darkblue:	'00008b',
	darkcyan:	'008b8b',
	darkgoldenrod:	'b8860b',
	darkgray:	'a9a9a9',
	darkgreen:	'006400',
	darkkhaki:	'bdb76b',
	darkmagenta:	'8b008b',
	darkolivegreen:	'556b2f',
	darkorange:	'ff8c00',
	darkorchid:	'9932cc',
	darkred:	'8b0000',
	darksalmon:	'e9967a',
	darkseagreen:	'8fbc8f',
	darkslateblue:	'483d8b',
	darkslategray:	'2f4f4f',
	darkturquoise:	'00ced1',
	darkviolet:	'9400d3',
	deeppink:	'ff1493',
	deepskyblue:	'00bfff',
	dimgray:	'696969',
	dodgerblue:	'1e90ff',
	feldspar:	'd19275',
	firebrick:	'b22222',
	floralwhite:	'fffaf0',
	forestgreen:	'228b22',
	fuchsia:	'ff00ff',
	gainsboro:	'dcdcdc',
	ghostwhite:	'f8f8ff',
	gold:		'ffd700',
	goldenrod:	'daa520',
	gray:		'808080',
	green:		'008000',
	greenyellow:	'adff2f',
	honeydew:	'f0fff0',
	hotpink:	'ff69b4',
	indianred :	'cd5c5c',
	indigo:		'4b0082',
	ivory:		'fffff0',
	khaki:		'f0e68c',
	lavender:	'e6e6fa',
	lavenderblush:	'fff0f5',
	lawngreen:	'7cfc00',
	lemonchiffon:	'fffacd',
	lightblue:	'add8e6',
	lightcoral:	'f08080',
	lightcyan:	'e0ffff',
	lightgoldenrodyellow:	'fafad2',
	lightgrey:	'd3d3d3',
	lightgreen:	'90ee90',
	lightpink:	'ffb6c1',
	lightsalmon:	'ffa07a',
	lightseagreen:	'20b2aa',
	lightskyblue:	'87cefa',
	lightslateblue:	'8470ff',
	lightslategray:	'778899',
	lightsteelblue:	'b0c4de',
	lightyellow:	'ffffe0',
	lime:		'00ff00',
	limegreen:	'32cd32',
	linen:		'faf0e6',
	magenta:	'ff00ff',
	maroon:		'800000',
	mediumaquamarine:	'66cdaa',
	mediumblue:	'0000cd',
	mediumorchid:	'ba55d3',
	mediumpurple:	'9370d8',
	mediumseagreen:	'3cb371',
	mediumslateblue:	'7b68ee',
	mediumspringgreen:	'00fa9a',
	mediumturquoise:	'48d1cc',
	mediumvioletred:	'c71585',
	midnightblue:	'191970',
	mintcream:	'f5fffa',
	mistyrose:	'ffe4e1',
	moccasin:	'ffe4b5',
	navajowhite:	'ffdead',
	navy:		'000080',
	oldlace:	'fdf5e6',
	olive:		'808000',
	olivedrab:	'6b8e23',
	orange:		'ffa500',
	orangered:	'ff4500',
	orchid:		'da70d6',
	palegoldenrod:	'eee8aa',
	palegreen:	'98fb98',
	paleturquoise:	'afeeee',
	palevioletred:	'd87093',
	papayawhip:	'ffefd5',
	peachpuff:	'ffdab9',
	peru:		'cd853f',
	pink:		'ffc0cb',
	plum:		'dda0dd',
	powderblue:	'b0e0e6',
	purple:		'800080',
	red:		'ff0000',
	rosybrown:	'bc8f8f',
	royalblue:	'4169e1',
	saddlebrown:	'8b4513',
	salmon:		'fa8072',
	sandybrown:	'f4a460',
	seagreen:	'2e8b57',
	seashell:	'fff5ee',
	sienna:		'a0522d',
	silver:		'c0c0c0',
	skyblue:	'87ceeb',
	slateblue:	'6a5acd',
	slategray:	'708090',
	snow:		'fffafa',
	springgreen:	'00ff7f',
	steelblue:	'4682b4',
	tan:		'd2b48c',
	teal:		'008080',
	thistle:	'd8bfd8',
	tomato:		'ff6347',
	turquoise:	'40e0d0',
	violet:		'ee82ee',
	violetred:	'd02090',
	wheat:		'f5deb3',
	white:		'ffffff',
	whitesmoke:	'f5f5f5',
	yellow:		'ffff00',
	yellowgreen:	'9acd32'
};

if (typeof exports !== "undefined"){
	exports.Colourizr = Colourizr;
	var k;
	for (k in Colourizr){
		if (Colourizr.hasOwnProperty(k)){
			exports[k] = Colourizr[k];
		}
	}
}

return Colourizr;
}());
