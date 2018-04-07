/*
  CIM540/CIM542 Final Project

  authors: jerry bonnell and gururaj shriram
  date last modified: 7 apr 2018
*/

var backgroundColor = "#242930"
// current words displayed on the screen 
var wordList = []
// list of constructed words created by the user  
var constructionList = []
var rm; 
// probability of selecting a stopword, noun, verb, other tag, respectively
// later, this can be weighted and/or changed dynamically 
var probabilities = [1/3, 1/3, 1/3]
// part of speech tags 
var nounTags = ['nn', 'nns', 'nnp', 'nnps']
var verbTags = ['vb', 'vbd', 'vbg', 'vbn', 'vbp', 'vbz']
var otherTags = ['cc', 'cd', 'dt', 'ex', 'fw', 'in', 'jj', 'jjr', 'jjs', 'ls', 'md', 'pdt', 'pos', 'prp', 'prp$', 'rb', 'rbr', 'rbs', 'rp', 'sym', 'to', 'uh', 'wdt', 'wp', 'wp$', 'wrb']
// get a list of stopwords, e.g. the, you, me, but, .. 
var stopwords = RiTa.STOP_WORDS

function setup() {
  windowResized()
}

function draw() {
  render();
}

function render() {
  background(backgroundColor) 
  fill(255, 255, 255) // white text

  wordList.forEach((wordObj) => {
    var x = wordObj['x']
    var y = wordObj['y']
    var word = wordObj['word']

    text(word, x, y)  
  })

  
}

function generateWord() {
  var randomX = parseInt(Math.random() * windowWidth)
  var randomY = parseInt(Math.random() * windowHeight)
  var word;
  
  var value = Math.random()
  if(value <= 1/3) {
    // 1/3 chance of choosing a stopword
    var index = parseInt(Math.random() * stopwords.length)
    word = stopwords[index]
  } else if (value <= 2/3) {
    // 1/3 chance of choosing a noun 
    var index = parseInt(Math.random() * nounTags.length)
    word = RiTa.randomWord(nounTags[index])
  } else {
    // 1/3 chance of choosing a verb 
    var index = parseInt(Math.random() * verbTags.length)
    word = RiTa.randomWord(verbTags[index])
  } 

  return {
    'word': word,
    'x': randomX, 
    'y': randomY
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
