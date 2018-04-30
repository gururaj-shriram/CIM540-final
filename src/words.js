/*
  CIM540/CIM542 Final Project

  provides functionality necessary for the p5 canvas

  file: words.js 
  authors: jerry bonnell and gururaj shriram
  date last modified: 26 apr 2018
  last modified by: jerry
*/

// current words displayed on the screen 
var wordList = [];
// part of speech tags 
var nounTags = ['nn', 'nns'];
var verbTags = ['vb', 'vbd', 'vbg', 'vbn', 'vbp', 'vbz'];
// get a list of stopwords, e.g. the, you, me, but, .. 
var stopwords = RiTa.STOP_WORDS;
var storywords = ['he', 'she', 'you', 'me', 'they', 'a', 'but', 'the', 'it',
  'and', 'are', 'aren\'t', 'will', 'were', 'am', 'I', 'him', 'her', 'can',
  'could', 'should', 'would', 'shall', 'won\'t', 'is', 'be'
];
var punctuation = ['.', '?', '!', ','];

// probability of selecting a stopword, noun, verb, other tag, respectively
// later, this can be weighted and/or changed dynamically 
var probabilities = [
  [stopwords, 0.1],
  [nounTags, 0.25],
  [verbTags, 0.3],
  [storywords, 0.3],
  [punctuation, 0.05]
];
var uuid = 0;
// offset width and height
var selectedOffsets = [0, 0];
// padding width and height 
var padding = [14, 14];
// hitbox width and height
var hitbox = [15, 45];

const yOffset = 15;

function generateWord(playSound) {
  var word;
  var probability_sum = 0;
  var width;
  var height;

  var value = Math.random()
  for (var i = 0; i < probabilities.length; i++) {
    var arr = probabilities[i][0];
    probability_sum += probabilities[i][1];
    // if value is less than the probability sum (e.g. 0.3 for stopwords), 
    // then a word should be spawned from the stopwords list; can be thought
    // of as a wheel of fortune where each tag represents a portion on 
    // the wheel 
    if (value <= probability_sum) {
      // update the probabilities for next time, where the i'th index 
      // denotes the part of speech tag selected (and the one to decrease)
      var index = parseInt(Math.random() * arr.length);
      // if the arr is from the stopwords list..
      if (arr === stopwords) {
        word = stopwords[index];
        console.log(word + " " + stopwords[index])
      } else if (arr === storywords) {
        word = storywords[index];
        console.log(word + " " + storywords[index])
      } else if (arr === punctuation) {
        word = punctuation[index];
        console.log(word + " " + punctuation[index])
      } else {
        // otherwise we need to generate it from randomWord()
        word = RiTa.randomWord(arr[index]);
        console.log(word + " " + arr[index])
      }

      break;
    }
  }

  width = textWidth(word) + padding[0] * 2;
  height = 16 + padding[1] * 2;

  // play add sound
  if (playSound === WITH_SOUND) {
    addSound.play();
  }

  return {
    'word': word,
    'x': cursorX - width / 2,
    'y': cursorY - height / 2,
    "width": width,
    "height": height,
    "previous": undefined,
    "next": undefined,
    "wordSnappingWith": undefined,
    "wordSnappingFrom": undefined, 
    "id": uuid++,
    "color": [globalColor[0], globalColor[1], globalColor[2]]
  }

}

function removeWord() {

  if (currentSentence !== undefined) {
    removeSound.play();
    var node = currentSentence.head;
    while (node !== undefined) {
      // we want to remove everything in the linked list
      var index = wordList.indexOf(node);
      // index should never return -1, but this is a hack
      if (index === -1) break;
      wordList.splice(index, 1);
      node.previous = undefined;
      node = node.next;
      if (node !== undefined) {
        node.previous.next = undefined;
      }
    }

    currentSentence = undefined;
    currentSentenceSet = undefined;
  }
}

function moveWords() {
  // word selection 
  if (currentSentence === undefined) {
    for (var i = 0; i < wordList.length; i++) {
      var wordObj = wordList[i];
      if (cursorX >= wordObj.x && cursorY >= wordObj.y &&
        cursorX <= wordObj.x + wordObj.width &&
        cursorY <= wordObj.y + wordObj.height) {
        // this returns an array of word objects that represent a connected
        // sentence of individual words 
        currentSentence = constructLinkedList(wordObj);
        // also run a set in parallel to determine which words are in the
        // list easily
        currentSentenceSet = constructSet(currentSentence.head);
        // calculate offset; take the difference between mouse position
        // and the word's x coordinate
        selectedOffsets[0] = cursorX - currentSentence.head.x;
        selectedOffsets[1] = cursorY - currentSentence.head.y;
        break;
      }
    }
  } else {
    // case where we want to de-select 
    if (currentSentence.head.wordSnappingWith !== undefined) {
      var snappingTo = currentSentence.head.wordSnappingWith;
      // are we snapping to the left or right 
      snapSound.play();
      if (currentSentence.head.wordSnappingFrom === 'left') {
        // commit the snap 
        snappingTo.previous = currentSentence.tail; 
        currentSentence.tail.next = snappingTo;
      } else if (currentSentence.head.wordSnappingFrom === 'right') {
        // the static word/sentence is on the LHS of the hovering word 
        snappingTo.next = currentSentence.head; 
        currentSentence.head.previous = snappingTo;
      }
    } 

    currentSentence = undefined;
    currentSentenceSet = undefined;
  }

}

function collidesWithHitboxA(listWidth, listHeight, x, y, hitboxA) {

  return (
    // top right point of the rectangle was 'hit' 
    // (x,y) is the coordinates of the top left point of word 
    ((x + listWidth >= hitboxA[0] &&
        y >= hitboxA[1] &&
        x + listWidth <= hitboxA[0] + hitbox[0] &&
        y <= hitboxA[1] + hitbox[1]) ||
      // bottom right point of the rectangle was 'hit'
      (x + listWidth >= hitboxA[0] &&
        y + listHeight >= hitboxA[1] &&
        x + listWidth <= hitboxA[0] + hitbox[0] &&
        y + listHeight <= hitboxA[1] + hitbox[1]))
  );
}

function collidesWithHitboxB(listWidth, listHeight, x, y, hitboxB) {

  return (
    // top left point of the rectangle was 'hit' 
    ((x >= hitboxB[0] &&
        y >= hitboxB[1] &&
        x <= hitboxB[0] + hitbox[0] &&
        y <= hitboxB[1] + hitbox[1]) ||
      // bottom left point of the rectangle was 'hit'
      (x >= hitboxB[0] &&
        y + listHeight >= hitboxB[1] &&
        x <= hitboxB[0] + hitbox[0] &&
        y + listHeight <= hitboxB[1] + hitbox[1]))
  );
}

function renderWords() {
  wordList.forEach((wordObj) => {
    var x = wordObj['x'];
    var y = wordObj['y'];
    var word = wordObj['word'];

    if (currentSentence !== undefined &&
      currentSentenceSet[wordObj.id] !== undefined) {
      // this is a word or sentence on the move and the current iterated
      // word is inside the linked list 
      if (wordObj === currentSentence.head) {
        // we only render if the word is at the head of the linked list, 
        // could have done instead at tail, middle, etc.
        x = cursorX - selectedOffsets[0];
        y = cursorY - selectedOffsets[1];
        // note that this updates the model 
        //currentSentence.head.previous = undefined;
        //currentSentence.tail.next = undefined;
        currentSentence.head.wordSnappingWith = undefined;
        currentSentence.head.wordSnappingFrom = undefined;
        var listWidth = calculateListLocations(x, y);
        var listHeight = currentSentence.head.height;
        //ellipse(x, y, 5, 5);  
        wordList.forEach((wordObj2) => {
          // go through every word and find the words that are not in the 
          // set; these are the words that we may need to snap with 
          if (currentSentenceSet[wordObj2.id] === undefined) {
            // determine the two rectangles for it
            hitboxA = [wordObj2.x - hitbox[0] / 2,
              wordObj2.y + wordObj2.height / 2 - hitbox[1] / 2
            ];
            //rect(hitboxA[0], hitboxA[1], hitbox[0], hitbox[1]);
            hitboxB = [wordObj2.x + wordObj2.width - hitbox[0] / 2,
              wordObj2.y + wordObj2.height / 2 - hitbox[1] / 2
            ];
            //rect(hitboxB[0], hitboxB[1], hitbox[0], hitbox[1]);
            // check hitbox on the left 
            // also check if the word sitting there is occupied 
            if (wordObj2.previous === undefined &&
              collidesWithHitboxA(listWidth, listHeight, x, y, hitboxA)) {
              // we found a place to snap this word 
              x = wordObj2.x - listWidth;
              y = wordObj2.y;
              // also update the model here
              calculateListLocations(x, y);
              currentSentence.head.wordSnappingWith = wordObj2;
              currentSentence.head.wordSnappingFrom = "left";
              return;
              // check hitbox on the right 
            } else if (wordObj2.next === undefined &&
              collidesWithHitboxB(listWidth, listHeight, x, y, hitboxB)) {
              // we found a place to snap this word 
              x = wordObj2.x + wordObj2.width;
              y = wordObj2.y;
              // also update the model here
              calculateListLocations(x, y);
              currentSentence.head.wordSnappingWith = wordObj2;
              currentSentence.head.wordSnappingFrom = "right";
              return;
            }
          }
        })

        var node = currentSentence.head;
        var size = getSize(node);
        // render the words in the linked list
        while (node !== undefined) {
          if (size === 1 || (node.previous === undefined &&
              node.next === undefined)) {
            // this is a solo word (size = 1) that is currently selected with 
            // the cursor 
            fill(globalColor[0], globalColor[1], globalColor[2]);
          } else {
            // otherwise we're picking up a sentence so we should use 
            // its color instead
            fill(node.color[0], node.color[1], node.color[2]);
          }

          strokeWeight(5);
          rect(node.x, node.y, node.width, node.height);
          fill(255, 255, 255);
          strokeWeight(0);
          text(node.word, node.x + padding[0], node.y + yOffset + padding[1]);
          node = node.next;
        }

      }

    } else {
      // it's a static (not moving) word/sentence
      if (wordObj.previous === undefined && wordObj.next === undefined) {
        // this is a static solo word (size = 1) 
        fill(globalColor[0], globalColor[1], globalColor[2]);
      } else {
        // otherwise this is a static word with neighbors 
        fill(wordObj.color[0], wordObj.color[1], wordObj.color[2]);
      }

      strokeWeight(5);
      rect(x, y, wordObj.width, wordObj.height);
      fill(255, 255, 255);
      strokeWeight(0);
      text(word, x + padding[0], y + yOffset + padding[1]);
    }

  })
}