class Map {
	constructor(layers, width, height, oldMap) {
		this.layers = layers;
		this.width = width;
		this.height = height;
		
		this.map = [];
		
		for (var l = 0; l < this.layers; l++) {
			this.map[l] = [];
			for (var j = 0; j < this.height; j++) {
				this.map[l][j] = [];
				for (var i = 0; i < this.width; i++) {
					this.map[l][j][i] = 0;
				}
			}
		}
		
		if (oldMap instanceof Map) {
			var lowestLayer;
			var lowestWidth;
			var lowestHeight;
			
			lowestLayer = Math.min(this.layers, oldMap.layers);
			lowestWidth = Math.min(this.width, oldMap.width);
			lowestHeight = Math.min(this.height, oldMap.height);
			
			for (var l = 0; l < lowestLayer; l++) {
				for (var j = 0; j < lowestHeight; j++) {
					for (var i = 0; i < lowestWidth; i++) {
						this.map[l][j][i] = oldMap.map[l][j][i];
					}
				}
			}
		}
	}
	
	//todo : add this.ready, don't loop until it's ready.
	
	size() {
		return ;
	}
	
	toBlob() {
		// Magic number
		// var str = "560360";
		// var bytes, blob;
		
		// str += pad(this.layers.toString(16), 2);
		// str += pad(this.width.toString(16), 2);
		// str += pad(this.height.toString(16), 2);
		
		// for (var l = 0; l < this.layers; l++) {
		// 	for (var j = 0; j < this.height; j++) {
		// 		for (var i = 0; i < this.width; i++) {
		// 			str += pad(this.map[l][j][i].toString(16), 4);
		// 		}
		// 	}
		// }
		
		// bytes = new Uint8Array(str.length / 2);
		
		// for (var i = 0; i < str.length; i++) {
		// 	bytes[i] = parseInt(str[i * 2] + str[(i * 2) + 1], 16);
		// }
		
		// // console.log(str);
		// // console.log(bytes);
		
		// blob = new Blob(bytes, {type: 'application/octet-stream'});
		
		// return URL.createObjectURL(blob);
		
		alert("OOF! Completely broken! Sorry.");
	}
	
	drawLayer(l) {
		for (var j = 0; j < this.height; j++) {
			for (var i = 0; i < this.width; i++) {
				drawTile(this.map[l][j][i], i, j);
			}
		}
	}
	
	draw() {
		for (var l = 0; l < this.layers; l++) {
			this.drawLayer(l);
		}
	}
}

function fileMap(file, callback) {
	var reader = new FileReader();
	
	reader.onload = function() {
		var arrayBuffer = this.result;
		var array = new Uint8Array(arrayBuffer);
		//var binaryString = String.fromCharCode.apply(null, array);
		
		console.log(array);
		
		var layers = array[3];
		var width = array[4];
		var height = array[5];
		
		var theActualMapYouWanted = new Map(layers, width, height);
		
		var c = 6;
		
		for (var l = 0; l < layers; l++) {
			for (var j = 0; j < height; j++) {
				for (var i = 0; i < width; i++) {
					theActualMapYouWanted.map[l][j][i] = array[c] << 8 | array[c + 1];
					console.log(theActualMapYouWanted.map[l][j][i]);
					c += 2;
				}
			}
		}
		
		callback(theActualMapYouWanted);
	}
	
	reader.readAsArrayBuffer(file);
}

class MapEditor {
	constructor(canvas, map) {
		this.canvas = canvas;
		this.c = this.canvas.getContext("2d", {alpha: false});
		
		this.cursorX = 0;
		this.cursorY = 0;
		this.cursorOn = false;
	}
	
	update() {
		
	}
	
	draw() {
		
	}
	
	// todo make more like this
	// despite it being static, it can use this, mainly because it's supposed to be used as an event handler.
	static eventCursor(e) {
		this.cursorX = Math.min(Math.max(0, e.offsetX), (canvas.width * canvasScale) - 1);
		this.cursorY = Math.min(Math.max(0, e.offsetY), (canvas.height * canvasScale) - 1);
	}
}

// A class that takes a few parameters a
class ItemListing {
	constructor(name, items, attachTo, header) {
		this.parent = attachTo;
		
		this.items = items;
		
		this.order = new Array(this.items);
		for (var i = 0; i < this.items; i++) {
			this.order[i] = {
				item: i,
				visible: false
			};
		}
		
		this.element = document.createElement("table");
		
		// still todo
		
		this.element = this.parent.appendChild(this.element);
	}
	
	get currentIndex() {
		var radioButtons = document.getElementsByName(this.name);
		
		for (i = 0; i < radioButtons.length; i++) {
			if (radioButtons[i].checked) {
				return radioButtons[i].value;
			}
		}
		
		return null;
	}
	
	drawMap(map) {
		if (map.layers < this.items) return;
		
		for (var i = 0; i < this.items; i++) {
			if (this.order[i].visible) map.drawLayer(this.order[i].item);
		}
	}
}

function drawTile(tile, x, y) {
	c.drawImage(tileSource, (tile % 32) * tileSize, Math.floor(tile / 32) * tileSize, tileSize, tileSize, x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawTileOutline(x, y, width = 1, height = width, fill = false) {
	var outlineDist = Math.round(bounceSine(frames, 30, 0, 4));
	
	if (!fill) outlineDist += .5;
	
	if (fill) {
		c.fillRect(x * tileSize - outlineDist, y * tileSize - outlineDist, tileSize * width + outlineDist * 2, tileSize * height + outlineDist * 2);
	} else {
		c.strokeRect(x * tileSize - outlineDist, y * tileSize - outlineDist, tileSize * width + outlineDist * 2, tileSize * height + outlineDist * 2);
	}
	//c.fillRect(x * tileSize - 2, y * tileSize - 2, tileSize + 4, tileSize + 4);
}

// Elements
var canvas, content;
var layerList;

// Panels
var mainPanel, leftPanel, right, top;

// Controls
var layerInput, widthInput, heightInput;
var newButton, openButton;
var resizeButton, exportButton;
var brushSizeInput, viewScaleInput;
var themeButton;

// View Settings
var canvasScale = 2;
var frames = 0;

// Map Info
var mapWidth, mapHeight, mapLayers;

// Cursor Info
var cursorShow;
var cursorX, cursorY;
var cursorDeleting;
var cursorLayer = 0;
var cursorTile = 1;
var cursorBrush = 1;

// General stuff
var canvas, c;
var editingMap;

// Background tiles
var tileSource;
var tileSize = 16;

// Polyfill because I'm lazy.
var wheelEvt = "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";

// Just start the thing already
window.addEventListener("DOMContentLoaded", generalSetup);

// Handles UI stuff
function generalSetup() {
	mainPanel = document.getElementById("mainPanel");
	leftPanel = document.getElementById("leftPanel");
	
	layerInput = document.getElementById("layerBox");
	widthInput = document.getElementById("widthBox");
	heightInput = document.getElementById("heightBox");
	
	newButton = document.getElementById("newButton");
	openButton = document.getElementById("openButton");
	resizeButton = document.getElementById("resizeButton");
	exportButton = document.getElementById("exportButton");
	
	brushSizeInput = document.getElementById("brushSizeBox");
	viewScaleInput = document.getElementById("viewScaleBox");
	
	themeButton = document.getElementById("themeButton");
	
	newButton.addEventListener("click", ()=>{
		mapLayers = layerInput.value;
		mapWidth = widthInput.value;
		mapHeight = heightInput.value;
		
		editingMap = new Map(mapLayers, mapWidth, mapHeight);
		updateCanvasSize();
	});
	openButton.addEventListener("click", ()=>{
		var fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = ".v360map";
		fileInput.addEventListener("change", (e)=>{
			fileMap(fileInput.files[0], (m)=>{editingMap = m; fileInput.remove();});
		});
		fileInput = leftPanel.appendChild(fileInput);
		fileInput.click();
	});
	resizeButton.addEventListener("click", ()=>{
		mapLayers = layerInput.value;
		mapWidth = widthInput.value;
		mapHeight = heightInput.value;
		
		var newMap = new Map(mapLayers, mapWidth, mapHeight, editingMap);
		editingMap = newMap;
		
		updateCanvasSize();
	});
	exportButton.addEventListener("click", ()=>{
		var info = document.createElement("a");
		var name = prompt("Name your file. It will have an extension of *.v360map.");
		
		if (!name) return;
		
		info.classList.add("lookLikeAButton");
		
		info.href = editingMap.toBlob();
		info.download = name + ".v360map";
		info.innerHTML = "📄 " + name + ".v360map";
		
		info.addEventListener("click", (e)=>{
			e.target.remove();
		});
		
		leftPanel.appendChild(info);
	});
	
	brushSizeInput.addEventListener("change", (e)=>{
		cursorBrush = parseInt(e.target.value);
	});
	viewScaleInput.addEventListener("change", (e)=>{
		updateCanvasSize(parseInt(e.target.value));
	});
	
	themeButton.addEventListener("click", ()=>{
		document.childNodes[1].classList.toggle("dark");
	});
	
	tileSource = document.createElement("img");
	tileSource.src = "bg.png";
	
	tileSource.addEventListener("load", canvasSetup);
}

// Handles Canvas Stuff
function canvasSetup() {
	clean(document.body);
	
	canvas = document.getElementById("display");
	c = canvas.getContext("2d", {alpha: false});
	c.scale(window.devicePixelRatio, window.devicePixelRatio);
	
	mapLayers = layerInput.value;
	mapWidth = widthInput.value;
	mapHeight = heightInput.value;
	
	canvasScale = viewScaleInput.value;
	
	cursorBrush = parseInt(brushSizeInput.value);
	updateCanvasSize(parseInt(viewScaleInput.value));
	
	editingMap = new Map(mapLayers, mapWidth, mapHeight);
	
	var content = document.getElementById("content");
	
	content.addEventListener("contextmenu", (e)=>{e.preventDefault();});
	
	mainPanel.addEventListener(wheelEvt, (e)=>{
		if (e.target == canvas) {
			// Change cursor
			cursorTile += Math.sign(e.deltaY);
			
			if (cursorTile < 0) cursorTile += 1024;
			if (cursorTile >= 1024) cursorTile -= 1024;
		} else {
			// Change size
			//updateCanvasSize(canvasScale + Math.sign(e.deltaY));
			// (Lets the viewScaleInput do the job of updating it.)
		}
	});
	
	canvas.addEventListener("mouseenter", (e)=>{cursorShow = true;});
	canvas.addEventListener("mouseleave", (e)=>{cursorShow = false;});
	canvas.addEventListener("mousedown", (e)=>{tilePut(e.buttons);});
	canvas.addEventListener("mouseup", (e)=>{cursorDeleting = false;});
	canvas.addEventListener("contextmenu", (e)=>{e.preventDefault();});
	canvas.addEventListener("mousemove", (e)=>{
		cursorX = Math.min(Math.max(0, e.offsetX), (canvas.width * canvasScale) - 1);
		cursorY = Math.min(Math.max(0, e.offsetY), (canvas.height * canvasScale) - 1);
		
		tilePut(e.buttons);
	});
	
	window.requestAnimationFrame(loop);
}

function loop() {
	c.clearRect(0, 0, canvas.width, canvas.height);
	
	if (mapLayers > 1) editingMap.drawLayer(1);
	editingMap.drawLayer(0);
	if (mapLayers > 2) editingMap.drawLayer(2);
	
	if (cursorShow) {
		var coords = tileCoords();
		
		if (cursorTile > 0 && !cursorDeleting) {
			c.strokeStyle = pulseColor();
			drawTileOutline(coords.x - cursorBrush, coords.y - cursorBrush, cursorBrush * 2 + 1);
			
			c.globalAlpha = sine(frames, 60, .25, .5);
			drawTile(cursorTile, coords.x, coords.y);
			c.globalAlpha = 1;
		} else {
			c.fillStyle = pulseColor(true);
			drawTileOutline(coords.x - cursorBrush, coords.y - cursorBrush, cursorBrush * 2 + 1, cursorBrush * 2 + 1, true);
		}
	}
	
	frames++;
	
	window.requestAnimationFrame(loop);
}

function tileCoords() {
	return {x: Math.floor(cursorX / (tileSize * canvasScale)), y: Math.floor(cursorY / (tileSize * canvasScale))};
}

function tilePut(buttons) {
	var coords = tileCoords();
	var tmpTile = cursorTile;
		
	cursorDeleting = false;
	
	if (buttons & 3) {
		if (buttons & 2) {
			tmpTile = 0;
			cursorDeleting = true;
		}
		
		for (var by = -cursorBrush; by <= cursorBrush; by++) {
			for (var bx = -cursorBrush; bx <= cursorBrush; bx++) {
				if (
					coords.x + bx >= 0 &&
					coords.x + bx < mapWidth &&
					coords.y + by >= 0 &&
					coords.y + by < mapHeight
				) {
					editingMap.map[cursorLayer][coords.y + by][coords.x + bx] = tmpTile;
				}
			}
		}
	}
}

function pulseColor(erase = false) {
	if (erase) {
		return rgb(
			sine(frames, 90, 0x7f, 0xff),
			sine(frames, 90, 0x1f, 0x3f),
			sine(frames, 90, 0x3f, 0x7f)
		);
	} else {
		return rgb(
			sine(frames, 90, 0x1f, 0x3f),
			sine(frames, 90, 0x3f, 0x7f),
			sine(frames, 90, 0x7f, 0xff)
		);
	}
}

function rgb(r, g, b, a = 255) {
	return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

function sine(time, cycle, from, to) {
	return from + (Math.sin(Math.PI * (time / cycle)) ** 2) * (to - from);
}

function bounceSine(time, cycle, from, to) {
	return from + Math.abs(Math.sin(Math.PI * (time / cycle))) * (to - from);
}

function updateCanvasSize(scale) {
	// If scale provided, update scale
	if (scale) {
		var min, max;
		
		min = parseInt(viewScaleInput.min);
		max = parseInt(viewScaleInput.max);
		
		canvasScale = Math.max(min, Math.min(scale, max));
		
		viewScaleInput.value = canvasScale;
	}
	
	// Resize canvas draw area to new area
	canvas.width = mapWidth * tileSize;
	canvas.height = mapHeight * tileSize;
	
	// Resize canvas display area to new area
	canvas.style.width  = (mapWidth  * tileSize * canvasScale) + "px";
	canvas.style.height = (mapHeight * tileSize * canvasScale) + "px";
	
	// Fix smoothing (always goes back to false after resize)
	c.imageSmoothingEnabled = false;
}

// From sitepoint.com/removing-useless-nodes-from-the-dom/
function clean(node) {
	for (var n = 0; n < node.childNodes.length; n++) {
		var child = node.childNodes[n];
		
		if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
			node.removeChild(child);
			n--;
		} else if (child.nodeType === 1 && !/pre|code|blockquote/i.test(child.tagName)) {
			clean(child);
		}
	}
}

// From https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function pad(n, width, z) {
	z = z || "0";
	n = n + "";
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
