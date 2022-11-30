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
const stopButton = select('.start');

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

function updateTimer() {
    let timeleft = 99;
    let timeValue = setInterval(function(){
    if(timeleft <= 0){
        clearInterval(timeValue);
    }
    timer.innerText = timeleft;
    timeleft -= 1;
    }, 1000);
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// function to generate a random word from the array for user to type
function generateWord() {

    let originalLength = shuffledWordBank.length;

    if(originalLength.length !== 0) {
        let i = Math.floor(Math.random() * originalLength);
        word.innerText = shuffledWordBank[i];
        currentWord = shuffledWordBank[i];
        processedWords.push(shuffledWordBank[i]);
        shuffledWordBank.splice(i, 1);
    }

    print(processedWords);
    print(processedWords.length);
    print(shuffledWordBank.length);
}

// compare the user input with the current word selected from the bank
onEvent('keyup', userInput, function() {
    compareValues(currentWord, userInput.value);
});


// start game when start button is clicked
onEvent('click', startButton, function() {
    startButton.innerText = 'STOP';
    startButton.classList.remove('start');
    startButton.classList.add('stop');
    updateTimer();
    generateWord();
});

// stop game when stop button is clicked
onEvent('click', stopButton, function() {
    stopButton.innerText = 'Click to Start';
    stopButton.classList.remove('stop');
    stopButton.classList.add('start');
    updateTimer();
});
  

// when page is reloaded set input focus
onEvent('load', window, () => {
    userInput.value = '';
    word.innerText = '';
    userInput.focus();
    userInput.scrollIntoView();
});