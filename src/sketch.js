/*
  CIM540/CIM542 Final Project

  file: sketch.js 
  authors: jerry bonnell and gururaj shriram
  date last modified: 21 apr 2018
  last modified by: guru
*/

const IS_USING_ARDUINO_CONTROLLER = false;

var backgroundColor = "#242930";

var cursorX, cursorY;

var offset = 5;

var serial;

// change based on arduino port
var serialPort = '/dev/cu.usbmodem1411';

// calibrate these parameters before running if the Arduino controller 
// is used
var minPanX = 0;
var maxPanX = 179;
var minTiltY = 0;
var maxTiltY = 179;

function setup() {
  
  windowResized();

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
	updateCursor();
	render();
}

function updateCursor() {
  if (!IS_USING_ARDUINO_CONTROLLER) {
		cursorX = mouseX;
		cursorY = mouseY;
	} 
}

function render() {
	background(backgroundColor); 
	textFont("Gloria Hallelujah");
	textSize(24);

  //noStroke();
  fill(255, 255, 255); // white text

  renderWords();

  if (IS_USING_ARDUINO_CONTROLLER) {
    fill(255, 255, 255); // white text
    text('X', cursorX, cursorY);
  }
}

function keyPressed() {
  if (keyCode === 80) { // pressing p 
    // push a new word to the list 
    wordList.push(generateWord())
  } else if (keyCode === 82) { // pressing r 
    removeWord();
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
	var data = serial.readLine().trim().split(' ');

  console.log(data);

  // Empty packet from arduino
  if (data.length !== 5) {
    return;
  }

	var xPos = map(int(data[0]), minPanX, maxPanX, 0, width - offset);
	var yPos = map(int(data[1]), minTiltY, maxTiltY, 0, height- offset);
	var isAdd = int(data[2]) === 1 ? true : false;
	var isRemove = int(data[3]) === 1 ? true : false;
	var isJoystickClick = int(data[4]) === 1 ? true : false;

	cursorX = xPos;
	cursorY = yPos;

	if (isAdd) {
		// push a new word to the list 
		wordList.push(generateWord())
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
