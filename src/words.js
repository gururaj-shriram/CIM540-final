/*
  CIM540/CIM542 Final Project

  provides functionality necessary for the p5 canvas

  file: words.js 
  authors: jerry bonnell and gururaj shriram
  date last modified: 21 apr 2018
  last modified by: jerry
*/

// current words displayed on the screen 
var wordList = [];
// part of speech tags 
var nounTags = ['nn', 'nns', 'nnp', 'nnps'];
var verbTags = ['vb', 'vbd', 'vbg', 'vbn', 'vbp', 'vbz'];
var otherTags = ['cc', 'cd', 'dt', 'ex', 'fw', 'in', 'jj', 'jjr', 'jjs', 'ls',
  'md', 'pdt', 'pos', 'prp', 'prp$', 'rb', 'rbr', 'rbs', 'rp', 'sym', 'to', 'uh',
  'wdt', 'wp', 'wp$', 'wrb'
];
// get a list of stopwords, e.g. the, you, me, but, .. 
var stopwords = RiTa.STOP_WORDS;
// probability of selecting a stopword, noun, verb, other tag, respectively
// later, this can be weighted and/or changed dynamically 
var probabilities = [
  [stopwords, 0.3],
  [nounTags, 0.3],
  [verbTags, 0.3],
  [otherTags, 0.1]
];

var uuid = 0;
// offset width and height
var selectedOffsets = [0, 0];
// padding width and height 
var padding = [6, 4];
// hitbox width and height
var hitbox = [15, 30];

function generateWord() {
  var word;
  var probability_sum = 0;
  var width;
  var height;

  var value = Math.random()
  for (var i = 0; i < probabilities.length; i++) {
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
    'x': cursorX - width / 2,
    'y': cursorY - height / 2,
    "width": width,
    "height": height,
    "previous": undefined,
    "next": undefined,
    "id": uuid++
  }

}

function removeWord() {

  if (currentSentence !== undefined) {
    var node = currentSentence.head;
    while (node !== undefined) {
      var index = wordList.indexOf(node);
      wordList.splice(index, 1);
      node.previous = undefined;
      node = node.next;
      node.previous.next = undefined;
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
    if (currentSentence.tail.next !== undefined) {
      // commit the snap 
      var next = currentSentence.tail.next;
      next.previous = currentSentence.tail;
    } else if (currentSentence.head.previous !== undefined) {
      var previous = currentSentence.head.previous;
      previous.next = currentSentence.head;
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
        currentSentence.head.previous = undefined;
        currentSentence.tail.next = undefined;
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

            hitboxB = [wordObj2.x + wordObj2.width - hitbox[0] / 2,
              wordObj2.y + wordObj2.height / 2 - hitbox[1] / 2
            ];
            // check hitbox on the left 
            // also check if the word sitting there is occupied 
            if (wordObj2.previous === undefined &&
              collidesWithHitboxA(listWidth, listHeight, x, y, hitboxA)) {
              // we found a place to snap this word 
              x = wordObj2.x - listWidth;
              y = wordObj2.y;
              // also update the model here
              calculateListLocations(x, y);
              currentSentence.tail.next = wordObj2;
              return;
              // check hitbox on the right 
            } else if (wordObj2.next === undefined &&
              collidesWithHitboxB(listWidth, listHeight, x, y, hitboxB)) {
              // we found a place to snap this word 
              x = wordObj2.x + wordObj2.width;
              y = wordObj2.y;
              // also update the model here
              calculateListLocations(x, y);
              currentSentence.head.previous = wordObj2;
              return;
            }
          }
        })

        var node = currentSentence.head;
        // render the words in the linked list
        while (node !== undefined) {
          text(node.word, node.x + padding[0], node.y + 10 + padding[1]);
          fill('rgba(0,255,0, 0)');
          rect(node.x, node.y, node.width, node.height);
          fill(255, 255, 255);
          node = node.next;
        }

      }

    } else {
      // it's a static (not moving) word/sentence
      text(word, x + padding[0], y + 10 + padding[1]);
      fill('rgba(0,255,0, 0)');
      rect(x, y, wordObj.width, wordObj.height);
      fill(255, 255, 255);
    }

  })
}