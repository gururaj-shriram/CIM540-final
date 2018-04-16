/*
  CIM540/CIM542 Final Project

  authors: jerry bonnell and gururaj shriram
  date last modified: 16 apr 2018
  */

  var backgroundColor = "#242930";
// current words displayed on the screen 
var wordList = [];
// list of constructed words created by the user  
var constructionList = [];
var rm;
// part of speech tags 
var nounTags = ['nn', 'nns', 'nnp', 'nnps'];
var verbTags = ['vb', 'vbd', 'vbg', 'vbn', 'vbp', 'vbz'];
var otherTags = ['cc', 'cd', 'dt', 'ex', 'fw', 'in', 'jj', 'jjr', 'jjs', 'ls', 
'md', 'pdt', 'pos', 'prp', 'prp$', 'rb', 'rbr', 'rbs', 'rp', 'sym', 'to', 'uh', 
'wdt', 'wp', 'wp$', 'wrb'];
// get a list of stopwords, e.g. the, you, me, but, .. 
var stopwords = RiTa.STOP_WORDS;
// probability of selecting a stopword, noun, verb, other tag, respectively
// later, this can be weighted and/or changed dynamically 
var probabilities = [
[stopwords, 0.3], [nounTags, 0.3], [verbTags, 0.3], [otherTags, 0.1]
];
// points to word that has been selected 
var wordSelected = undefined; 
// offset width and height
var selectedOffsets = [0, 0]; 
// padding width and height 
var padding = [6,4];
// hitbox width and height
var hitbox = [6, 10];

var serial;
var serialPort = '/dev/cu.usbmodem1421';
var cursorX, cursorY;

// calibrate these parameters before running if the Arduino controller 
// is used
var minPanX = 0;
var maxPanX = 179;
var minTiltY = 0;
var maxTiltY = 179;

function setup() {
	windowResized();

	serial = new p5.SerialPort();
	serial.open(serialPort);

  // serial callbacks
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
}

function draw() {
	updateCursor();
	render();
}

function updateCursor() {
	if (!serial.isConnected()) {
		cursorX = mouseX;
		cursorY = mouseY;
	}
}

function render() {
	background(backgroundColor); 
  //noStroke();
  fill(255, 255, 255); // white text

  wordList.forEach((wordObj) => {
  	var x = wordObj['x'];
  	var y = wordObj['y'];
  	var word = wordObj['word'];

    // selected word will follow mouse 
    if (wordObj === wordSelected) {
    	x = cursorX - selectedOffsets[0];
    	y = cursorY - selectedOffsets[1];    
    }

    text(word, x + padding[0], y + 10 + padding[1]);
    fill('rgba(0,255,0, 0)');
    rect(x, y, wordObj.width, wordObj.height);
    fill(255, 255, 255);
  })

}

function generateWord() {
	var word;
	var probability_sum = 0;
	var width;
	var height;

	var value = Math.random()
	for(var i = 0; i < probabilities.length; i++) {
		var arr = probabilities[i][0];
		probability_sum += probabilities[i][1];
    // if value is less than the probability sum (e.g. 0.3 for stopwords), 
    // then a word should be spawned from the stopwords list 
    if (value <= probability_sum) {
    	var index = parseInt(Math.random() * arr.length);
      // if the arr is from the stopwords list..
      if (arr === stopwords) {
      	word = stopwords[index];
      } else {
        // otherwise we need to generate it from randomWord()
        word = RiTa.randomWord(arr[index]);
      }

      break; 
    }
  }

  width = textWidth(word) + padding[0] * 2;
  height = 16 + padding[1] * 2;

  return {
  	'word': word,
  	'x': cursorX - width/2, 
  	'y': cursorY - height/2,
  	"width": width,
  	"height": height 
  }
}

function keyPressed() {
  if (keyCode === 80) { // pressing p 
    // push a new word to the list 
    wordList.push(generateWord())
  } else if (keyCode === 82) { // pressing r
    // TODO: delete a word  

  }
}

function mousePressed() {
	moveWords();
}

function moveWords() {
  // word selection 
  if (wordSelected === undefined) {
  	for (var i = 0; i < wordList.length; i++) {
  		var wordObj = wordList[i];
  		if (cursorX >= wordObj.x && cursorY >= wordObj.y 
  			&& cursorX <= wordObj.x + wordObj.width 
  			&& cursorY <= wordObj.y + wordObj.height) {
  			wordSelected = wordObj;
              // calculate offset; take the difference between mouse position
              // and the word's x coordinate
              selectedOffsets[0] = cursorX - wordObj.x; 
              selectedOffsets[1] = cursorY - wordObj.y; 
              break; 
            }
          }
        } else {
    // case where we want to de-select 
    wordSelected.x = cursorX - selectedOffsets[0];
    wordSelected.y = cursorY - selectedOffsets[1];
    wordSelected = undefined;
  }
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function gotOpen() {
	console.log('Serial port is open');
}

function gotError(err) {
	console.log('Serial error: \n' + err);
}

function gotData() {

	// data is provided as a space separated string from the Arduino controller as so:
	// panValue tiltValue addButtonState removeButtonState joystickButtonState
	var data = serial.readLine().trim().split(' ');

	var xPos = map(int(data[0]), minPanX, maxPanX, 0, width);
	var yPos = map(int(data[1]), minTiltY, maxTiltY, 0, height);
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
		// Add remove code
	}

	// Grab or deselect word if there's a joystick click
	if (isJoystickClick) {
		moveWords();		
	}
}

