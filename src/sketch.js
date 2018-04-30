/*
CIM540/CIM542 Final Project

file: sketch.js 
authors: jerry bonnell and gururaj shriram
date last modified: 29 apr 2018
last modified by: jerry
*/

const IS_USING_ARDUINO_CONTROLLER = false;
const WITHOUT_SOUND = 0; 
const WITH_SOUND = 1;

var backgroundColor = "#242930";

var cursorX, cursorY;

var offset = 10;

var serial;

// change based on arduino port
var serialPort = '/dev/cu.usbmodem1411';

// global var to store arduino controller data
var data;

// calibrate these parameters before running if the Arduino controller 
// is used
var minPanX = 600;
var maxPanX = 2300;
var minTiltY = 900;
var maxTiltY = 2300;

// transition array to animate coloring of words
var colors = [
	[51, 153, 255],
	[255, 0, 255],
	[255, 0, 102],
	[102, 255, 102],
	[0, 255, 255]
];
// color that all words share at any given moment assuming they are 
// not a part of a sentence 
var globalColor = [colors[0][0], colors[0][1], colors[0][2]];
// index of the transition array marking the current color; points
// to the index of the color currently being transitioned from
var currColorIndex = 0;
// keep track of the current frame where the frame begins at 0.
var colorFrame = 0;
// how long should the duration of a color last? (in seconds)?
var colorDuration = 2.0;
// frames per second
var fps = 30;

var addSound;
var removeSound;
var snapSound;

function preload() {

	soundFormats('mp3', 'wav');

	addSound = loadSound('assets/add.mp3');
	removeSound = loadSound('assets/remove.wav');
	snapSound = loadSound('assets/snap.wav');
}

function setup() {

	textFont('Gloria Hallelujah');
	textSize(24);

	addSound.setVolume(0.05);
	removeSound.setVolume(0.1);
	snapSound.setVolume(0.1);

	windowResized();
	frameRate(fps); // attempt to match the user-specified frame rate

	// this is a hack to make sure text width provides the correct width 
	wordList.push(generateWord(WITHOUT_SOUND));
	wordList.pop();

	if (IS_USING_ARDUINO_CONTROLLER) {
		serial = new p5.SerialPort();
		serial.open(serialPort);

		// serial callbacks
		serial.on('data', gotData);
		serial.on('error', gotError);
		serial.on('open', gotOpen);
	}
}

function draw() {
	updateColors();
	updateCursor();
	render();
}

function updateColors() {
	// when currColorIndex is 1, then we are transitioning from index 1
	// of the array to index 2 of the colors array
	var currentColor = colors[currColorIndex] // color transitioning from
	// color transitioning to
	var nextColor = colors[(currColorIndex + 1) % colors.length]

	// we are mapping from 0 to 159 frames to a value between the
	// "from" color and the "to" color for r, g, and b
	for (var i = 0; i < 3; i++) {
		globalColor[i] = map(colorFrame, 0, colorDuration * fps - 1,
			currentColor[i], nextColor[i])
	}

	colorFrame++;
	// 2 seconds * 80 fps = 160 frames; on every 160th frame, color
	// index is updated, i.e. it is time to transition to the next index
	if (colorFrame === colorDuration * fps) {
		currColorIndex = (currColorIndex + 1) % colors.length;
		colorFrame = 0; // start over at 0
	}

}

function updateCursor() {
	if (!IS_USING_ARDUINO_CONTROLLER) {
		cursorX = mouseX;
		cursorY = mouseY;
	}
}

function render() {
	background(backgroundColor);

	//noStroke();
	stroke(255, 255, 255);
	fill(255, 255, 255); // white text

	renderWords();

	// Because the laser is not 100% reliable, use
	// an X to indicate current position
	if (IS_USING_ARDUINO_CONTROLLER) {
		fill(255, 255, 255); // white text
		text('X', cursorX, cursorY);
	}
}

function keyPressed() {
	if (keyCode === 80) { // pressing p 
		// push a new word to the list 
		wordList.push(generateWord(WITH_SOUND));
	} else if (keyCode === 82) { // pressing r 
		removeWord();
	} else if (keyCode == 83) { // pressing s to (s)tart min calibration
		if (data !== undefined && data.length === 5) {
			minPanX = int(data[0]);
			minTiltY = int(data[1]);
		}
	} else if (keyCode == 69) { // pressing e to (e)nd max calibration
		if (data !== undefined && data.length === 5) {
			maxPanX = int(data[0]);
			maxTiltY = int(data[1]);
		}
	}
}

function mousePressed() {
	moveWords();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function gotOpen() {
	console.log('Serial port is open');
}

function gotError(err) {
	if (err) {
		console.log('Serial error: \n' + err);
	}
}

function gotData() {

	// data is provided as a space separated string from the Arduino controller as so:
	// panValue tiltValue addButtonState removeButtonState joystickButtonState
	data = serial.readLine().trim().split(' ');


	// Empty packet from arduino
	if (data.length !== 5) {
		return;
	}

	console.log(data);

	var xPos = constrain(int(data[0]), minPanX, maxPanX);
	xPos = map(xPos, minPanX, maxPanX, 0 + offset, width - offset);

	var yPos = constrain(int(data[1]), minTiltY, maxTiltY);
	yPos = map(yPos, minTiltY, maxTiltY, 0 + offset, height - offset);

	var isAdd = int(data[2]) === 1 ? true : false;
	var isRemove = int(data[3]) === 1 ? true : false;
	var isJoystickClick = int(data[4]) === 1 ? true : false;

	// update cursor positions
	cursorX = xPos;
	cursorY = yPos;

	if (isAdd) {
		// push a new word to the list 
		wordList.push(generateWord(WITH_SOUND))
	}

	if (isRemove) {
		// remove word at cursor
		removeWord();
	}

	// Grab or deselect word if there's a joystick click
	if (isJoystickClick) {
		moveWords();
	}
}