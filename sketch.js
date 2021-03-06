// Infinite Rainbows
// This code is adapted from Infinite Rainbows,
// a generative animation by [Marius Watz](http://mariuswatz.com/).
// The original Actionscript version was commissioned by
// [POKE](http://pokelondon.com) as part of Good Things Should Never End,
// an online brand experience for Orange UK.

// Marius Watz and Poke have generously given permission
// for this p5.js port started by Daniel Shiffman for use
// on the YouTube channel "Coding Rainbow."

// This work is licensed under a Creative Commons
// Attribution-NonCommercial 4.0 International License
// http://creativecommons.org/licenses/by-nc/4.0/).

// Still in progress!

/*
// TODO - MW

- Initialize to full page
- Fix "isAvoiding" behavior or reinitialize off-screen rainbows
- Better demo behaviors (rainbows die / born, differentiated behaviors,
 GUI parameter manipulation?)
- Try drawing stored geometry instead of not clearing background

*/

var rndSeed = -1;
var MITER = "miter";
var ROUND = "round";
var BEVEL = "bevel";
var SQUARE = "square";
var NONE = "none";
var NORMAL = "normal";
var SINCOS_PRECISION = 0.1;
var SINCOS_LENGTH = (360 / SINCOS_PRECISION);
var DEG_TO_RAD = Math.PI / 180.0;
var RAD_TO_DEG = 180.0 / Math.PI;
var cosLUT = [];
var sinLUT = [];

var ColorPalette;
var tmpbez = [];

var strokeMiter, strokeScale, strokeCaps, strokeW, strokeC;
var width, height;

var rbcol=[];

var rainbows = [];

var rbCnt = 0;

function setup() {
	createCanvas(1200, 800);
  col = new ColorPalette();
  strokeMiter = ROUND;
  strokeScale = NORMAL;
  strokeCaps = ROUND;
  strokeW = 1;
  strokeC = 0;
	initLUT();

  initRainbows();

}

function initRainbows() {
  var n=random(3,15);

  background(255);
  rainbows=[];
  while(rainbows.length<n) {
    var r = new Rainbow();
    r.init();
    r.start();
    r.initPath();
    rainbows.push(r);
  }
}

function draw() {
	if(frameCount<5) background(255);
	// translate(width/2, height/2);
  noStroke();
	for (var i = 0; i < rainbows.length; i++) {
		rainbows[i].update();
	}
}

function mousePressed() {
  initRainbows();
}

function initLUT() {
  SINCOS_PRECISION = 0.1;
  SINCOS_LENGTH = Math.floor(360 / SINCOS_PRECISION);
  // Init AppConstants

  sinLUT = new Array();
  cosLUT = new Array();
  for (var i = 0; i < SINCOS_LENGTH; i++) {
    sinLUT[i] = Math.sin(i * DEG_TO_RAD * SINCOS_PRECISION);
    cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
    //			out(" "+i+" "+sinLUT[i]+","+cosLUT[i]);
  }

  if (!rbcol.length<6) {
    rbcol = [];
    rbcol[0] = "#fd000b";
    rbcol[1] = "#ff6915";
    rbcol[2] = "#feed01";
    rbcol[3] = "#5fc42a";
    rbcol[4] = "#007ed3";
    rbcol[5] = "#530268";

    // updated
  // rbcol[0] = "#ff4316";
  // rbcol[1] = "#ff7900";
  // rbcol[2] = "#ffde00";
  // rbcol[3] = "#16cc93";
  // rbcol[4] = "#158acd";
  // rbcol[5] = "#af61db";
    // rbcol[0] = 0xffff4316;
    // rbcol[1] = 0xffff7900;
    // rbcol[2] = 0xffffde00;
    // rbcol[3] = 0xff16cc93;
    // rbcol[4] = 0xff158acd;
    // rbcol[5] = 0xffaf61db;
  }
}

function SIN(deg) {
  if (!(deg < 360)) deg = deg % 360;
  else if (deg < 0) deg = 360 - (Math.abs(deg) % 360);
  deg /= SINCOS_PRECISION;
  return sinLUT[Math.floor(deg)];
}

function COS(deg) {
  if (!(deg < 360)) deg = deg % 360;
  else if (deg < 0) deg = 360 - (Math.abs(deg) % 360);
  deg /= SINCOS_PRECISION;
  return cosLUT[Math.floor(deg)];
}




/////////////////////////////////////////////////////
// update & init functions
//
//
// function draw() {}
//
//
// function update() {}
//
// function reinit() {}



/////////////////////////////////////////////////////
// random number functions

function rndSetSeed(_seed) {
  if (_seed == undefined) {
    var d = new Date();
    _seed = d.getMilliseconds();
  }

  rndSeed = _seed;
  rndF(100);
}

function rndBool() {
  var val;
  rndSeed = (rndSeed * 16807) % 2147483647;
  val = (rndSeed / 2147483647) * 100;
  return val > 50;
}

function rndProb(prob) {
  var val;
  rndSeed = (rndSeed * 16807) % 2147483647;
  val = (rndSeed / 2147483647) * 100;
  return val > prob;
}

p5.prototype.rndI = function(min, max) {
  var val;
  rndSeed = (rndSeed * 16807) % 2147483647;
  val = (rndSeed / 2147483647);
  if (max == undefined) return Math.floor(val * min);
  return Math.floor(val * (max - min) + min);
}

function rndF(min, max) {
  var val;
  rndSeed = (rndSeed * 16807) % 2147483647;
  val = (rndSeed / 2147483647);
  if (max == undefined) return val * min;
  return val * (max - min) + min;
}

p5.Vector.prototype.setToTangent = function(v1, v2) {
//function setToTangent(v1,v2) {
	this.x=-(v2.y-v1.y);
	this.y=v2.x-v1.x;
	var l=Math.sqrt(this.x*this.x+this.y*this.y);
	if(l!=0) {
		this.x/=l;
		this.y/=l;
	}
}
