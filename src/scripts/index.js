'use strict';

/*--------------------------------------------------------------------------- *
 * Keyboard Ninja
 * Jodi-Ann Barrett
 * 
 * */

import { select, onEvent } from './utils.js';
import Score from './Score.js';

/**--------------------------------- Data ----------------------------------- */
const hits = select('.hits span');
let hitCount = 0;
const timer = select('.timer span');
let timeValue = 0;
const word = select ('.word');
const userInput = select ('.user-input');
const startButton = select('.start');
const ninjaHeading = select('.center .game-container .heading p.merienda');
const ninjaSubheading = select('.center .game-container .heading h3');

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
const overlay = select('.overlay');
const scoreInfo = select('.score-info');
const scoreDetails = select('.score-details');

/**-------------------------------------------------------------------------- */

/**---------------------Game Functions and Events---------------------------- */


//function to generate score
function generateScore () {

    let heading = '';

    overlay.removeAttribute('style', `
        visibility: hidden;
    `);
    overlay.setAttribute('style', `
        visibility: visible;
    `);
    profileInfo.style.display = 'block';

    const score = new Score(new Date(), hits, wordBank.length);
    
    heading = `<h2><span class="fail"></span>Better Luck Next Time</h2>`;
    if(score.percentage >= 70) heading = `<h2><span class="pass"></span>Awesome Job!</h2>`;
    if(score.percentage > 40 && score.percentage < 70) heading = `<h2><span class="average"></span>Good Job!</h2>`;

    scoreDetails.innerHTML = `
    ${heading}
    <div class="results">
        <p>You got ${score.hits} out of ${wordBank.length} words</p>
        <p>Your Score: ${score.percentage}%</p>
        <p>On: ${score.date}%</p>
    </div>
    `;
}

// function to update the number of words the player has already matched
function updateHits() {
    hits.innerText = ++hitCount;
}

// function to compare the user input to the random word selected
function compareValues (currWord, input) {
    // clean strings for comparison
    currWord.toLowerCase().trim();
    input.toLowerCase().trim();

    if(currWord === input) {
        updateHits();
        focusInput();
        generateWord();
    }
}

// start timer
function updateTimer() {
    let timeleft = 10;
    timeValue = setInterval(function(){
    if(timeleft <= 0){
        // stop timer on expiry
        clearInterval(timeValue);
        // time has expired, calculate player's score and reset game
        timer.innerText = 0;
        generateScore();
        resetGame();
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
    } else {
        // player has exhausted all words so calculate their score
        generateScore();
    }
}
  
// function to reset game
function resetGame() {
    word.innerText = '';
    hits.innerText = 0;
    timer.innerText = 10;
    focusInput();
}

// function to keep the focus on the input 
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
    focusInput();
    updateTimer();
    generateWord();
});

onEvent('click', overlay, function () {
    this.removeAttribute('style', `
      visibility: visible;
    `);
    this.setAttribute('style', `
      visibility: hidden;
    `);
    scoreInfo.style.display = 'none';
});

// when page is reloaded set input focus
onEvent('load', window, () => {
    setInterval(function(){
        ninjaHeading.style.visibility = 'visible';
        ninjaHeading.style.animation = 'fly-in 1s 1';
    }, 3_000);
    
    setInterval(function(){
        ninjaSubheading.style.visibility = 'visible';
        ninjaSubheading.style.animation = 'appearUp 0.4s ease-in';
    }, 4_500);

    resetGame();
});

