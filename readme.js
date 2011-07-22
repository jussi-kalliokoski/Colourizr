Colourizr
=========

Colourizr is a simple color conversion tool for JavaScript, created with flexibility and simplicity in mind. Colourizr can convert the following values to RGB and vice versa:

* Hex
* 24 bit color value
* HSL
* HSV
* CSS named colors

Usage
-----

Colourizr provides an easy and flexible interface for color representation:

```

blue = new Colourizr('blue');
blue = new Colourizr('#00f');
blue = new Colourizr('0000ff');
blue = new Colourizr('rgb(0,0,255)');
blue = new Colourizr('rgba(0,0,255,1.0)');
blue = new Colourizr('hsl(240,100%,50%)');
blue = new Colourizr('hsla(240,100%,50%,1.0)');
blue = new Colourizr(0, 0, 255);
blue = new Colourizr(0, 0, 255, 255);
blue = new Colourizr(16711680);

blue.toHex();
blue.toRGB();
blue.toHSL();
blue.toHSLA();
blue.to24Bit();
blue.toHSV();
blue.toHSVA();
blue.toNamedColor();

Colourizr.Hex2RGB('00f'); // [0, 0, 255]
Colourizr.RGB2HSL(0,0,255); // [240, 100, 50]

```

Contributors
------------

* [Juha Halme](https://github.com/juha-halme/)
* [Jussi Kalliokoski](https://github.com/jussi-kalliokoski/)

MIT License
