'use strict';

/*--------------------------------------------------------------------------- *
 * Keyboard Ninja
 * Jodi-Ann Barrett
 * 
 * */

import { select, onEvent, print } from './utils.js';
import Score from './Score.js';

/**--------------------------------- Data ----------------------------------- */
const hits = select('.hits span');
let hitCount = 0;
const score = select('.score span');
const timer = select('.timer span');
const word = select ('.word');
const userInput = select ('.user-input');
const startButton = select('.start');
const stopButton = select('.stop');

const wordBank = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
'database', 'periodic', 'capitalism', 'abominable', 'component', 'future',
'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician',
'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution',
'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button',
'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
'keyboard', 'window'];

let shuffledWordBank = [...shuffle(wordBank)];
let processedWords = [];
let currentWord = '';

/**-------------------------------------------------------------------------- */

/**---------------------Game Functions and Events---------------------------- */



// function to compare the user input to the random word selected
function compareValues (currWord, input) {
    // clean strings for comparison
    currWord.toLowerCase().trim();
    input.toLowerCase().trim();

    print(currWord);
    print(input);
    if(currWord === input) {
        print('here');
        focusInput();
        generateWord();
    }
}

// start timer
function updateTimer() {
    let timeleft = 99;
    let timeValue = setInterval(function(){
    if(timeleft <= 0){
        // stop timer on expiry
        clearInterval(timeValue);
        // time has expired, calculate player's score
        generateScore();
        focusInput();
    }
    timer.innerText = timeleft;
    timeleft -= 1;
    }, 1000);
}

// function to shuffle items in an array
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// function to generate a random word from the shuffledWordBank for player to type
function generateWord() {
    if(shuffledWordBank.length !== 0) {
        let originalLength = shuffledWordBank.length;
    
        if(originalLength.length !== 0) {
            // grab a random index in the array
            let i = Math.floor(Math.random() * originalLength); 
            // display word to player
            word.innerText = shuffledWordBank[i];
            // store selected word in a global variable
            currentWord = shuffledWordBank[i];
            // add selected word to an array of words that have been selected
            processedWords.push(shuffledWordBank[i]);
            // remove the word from original array once selected
            shuffledWordBank.splice(i, 1);
        }
    
        print(processedWords);
        print(processedWords.length);
        print(shuffledWordBank.length);
    } else {
        // player has exhausted all words so calculate their score
        generateScore();
    }
}

function focusInput() {
    userInput.value = '';
    userInput.focus();
    userInput.scrollIntoView();
}

// compare the player input with the current word selected from the bank
onEvent('keyup', userInput, function() {
    compareValues(currentWord, userInput.value);
});


// start game when start button is clicked
onEvent('click', startButton, function() {
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
    focusInput();
    updateTimer();
    generateWord();
});

// stop game when stop button is clicked
onEvent('click', stopButton, function() {
    stopButton.style.display = 'none';
    startButton.style.display = 'block';
    updateTimer();
});
  

// when page is reloaded set input focus
onEvent('load', window, () => {
    userInput.value = '';
    word.innerText = '';
    focusInput();
});

