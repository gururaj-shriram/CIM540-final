/*

  file: wordlist.js
  a linked list data structure to facilitate creation of sentences 

  authors: jerry bonnell and gururaj shriram
  date last modified: 22 apr 2018
  last modified by: jerry
*/

// points to word that has been selected 
var currentSentence = undefined;
var currentSentenceSet = undefined;

function constructLinkedList(wordObj) {
    /* constructs a linked list (i.e. a sentence) for this word */
    var node = wordObj;
    var head = undefined; // will return
    var tail = undefined; // will return 
    // find the beginning
    while (node.previous !== undefined) {
        node = node.previous;
    }
    head = node; // got the head 
    node = wordObj;
    // find the end
    while (node.next !== undefined) {
        node = node.next;
    }
    tail = node; // got the tail 
    return {
        'head': head,
        'tail': tail
    };
}

function constructSet(head) {
    /* constructs a set to determine quickly which words are in the list */
    var node = head;
    var wordSet = {}
    while (node !== undefined) {
        wordSet[node.id] = 1;
        node = node.next;
    }
    return wordSet;
}

function calculateListLocations(x, y) {
    /* computes (x,y) positions of the linked list and returns a cumulative
       sum for the width */
    var node = currentSentence.head;
    var summedWidth = 0;
    while (node !== undefined) {
        node.x = x + summedWidth;
        node.y = y;
        summedWidth += node.width;
        node = node.next;
    }

    return summedWidth;
}

function getSize(head) {
    var size = 0; 
    while (head !== undefined) {
        size++; 
        head = head.next;
    }
    return size; 
}