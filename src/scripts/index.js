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
const hitsBlock = select('.hits');
let hitCount = 0;
const timer = select('.timer span');
let timeValue = 0;
const word = select ('.word');
const userInput = select ('.user-input');
const startButton = select('.start');
const ninjaHeading = select('.center .game-container .heading p.merienda');
const ninjaSubheading = select('.center .game-container .heading h3');
const timeRemaining = select('.center .game-container .game-details .stats .timer p span');
const clock = select('.center .game-container .game-details .stats .timer p i');
const hint = select('.hint');

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

const typewriterAudio = new Audio('src/audio/keyboard-typing.mp3');
typewriterAudio.muted = false;
typewriterAudio.type = 'audio/mp3';
const swordAudio = new Audio('src/audio/sword.mp3');
swordAudio.muted = false;
swordAudio.type = 'audio/mp3';
const themeAudio = new Audio('src/audio/theme.mp3');
themeAudio.muted = false;
themeAudio.loop = true;
const gameProgressAudio = new Audio('src/audio/game-progress.mp3');
gameProgressAudio.muted = false;
gameProgressAudio.loop = true;
gameProgressAudio.type = 'audio/mp3';
const successAudio = new Audio('src/audio/success.mp3');
successAudio.muted = false;
successAudio.type = 'audio/mp3';
const failAudio = new Audio('src/audio/fail.mp3');
failAudio.muted = false;
failAudio.type = 'audio/mp3';

const pointGainedAudio1 = new Audio('src/audio/point-gained.mp3');
pointGainedAudio1.muted = false;
pointGainedAudio1.type = 'audio/mp3';
const pointGainedAudio2 = new Audio('src/audio/point-gained-2.mp3');
pointGainedAudio2.muted = false;
pointGainedAudio2.type = 'audio/mp3';
const pointGainedAudio3 = new Audio('src/audio/point-gained-3.mp3');
pointGainedAudio3.muted = false;
pointGainedAudio3.type = 'audio/mp3';
const pointGainedAudio4 = new Audio('src/audio/point-gained-4.mp3');
pointGainedAudio4.muted = false;
pointGainedAudio4.type = 'audio/mp3';
const pointGainedAudio5 = new Audio('src/audio/point-gained-5.mp3');
pointGainedAudio5.muted = false;
pointGainedAudio5.type = 'audio/mp3';

const hitsAudios = [pointGainedAudio1, pointGainedAudio2, pointGainedAudio3, pointGainedAudio4, pointGainedAudio5];

/**-------------------------------------------------------------------------- */

/**---------------------Game Functions and Events---------------------------- */

//function to generate score
function generateScore () {

    let heading = '';
    let today = new Date().toLocaleDateString('en-ca', { year:"numeric", month:"short", day:"numeric"});

    overlay.removeAttribute('style', `visibility: hidden;`);
    overlay.style.visibility = 'visible';
    scoreInfo.style.display = 'block';
    gameProgressAudio.pause();

    // create score object to show player results
    const score = new Score(today, hitCount, wordBank.length);
    
    if(score.percentage >= 45) {
        heading = `<h2 class="success">Awesome Job!</h2>`;
        successAudio.play();
    } else if(score.percentage > 25 && score.percentage < 45) {
        heading = `<h2 class="pass">Good Job!</h2>`;
        successAudio.play();
    } else {
        heading = `<h2 class="fail">Better Luck Next Time</h2>`;
        failAudio.play();
    }

    scoreDetails.innerHTML = `
        ${heading}
        <div class="results">
            <p class="score">Your Score: <span>${Math.floor(parseFloat(score.percentage))}%</span></p>
            <p class="out-of">You got ${score.hits} out of ${wordBank.length} words</p>
            <p class="date">${score.date}</p>
        </div>
    `;
}

// function to update the number of words the player has already matched
function updateHits() {
    let i = Math.floor(Math.random() * hitsAudios.length); 
    hitsAudios[i].play();
    hits.innerText = ++hitCount;
    hits.style.color = '#F7B538';
}

// function to compare the user input to the random word selected
function compareValues (currWord, input) {
    // clean strings for comparison
    currWord = currWord.toLowerCase().trim();
    input = input.toLowerCase().trim();

    if(currWord === input) {
        updateHits();
        focusInput();
        generateWord();
    }
}

// start timer
function updateTimer() {
    let timeleft = 99;
    timeValue = setInterval(function(){
    if(timeleft <= 0){
        // stop timer on expiry
        clearInterval(timeValue);
        // time has expired, calculate player's score and reset game
        generateScore();
        resetGame();
        focusInput();
        let themeInterval = setInterval(function(){
            gameProgressAudio.pause();
            themeAudio.play();
            clearInterval(themeInterval);
        }, 4_000);
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
        resetGame();
        focusInput();
        let themeInterval = setInterval(function(){
            themeAudio.play();
            clearInterval(themeInterval);
        }, 4_000);
    }
}
  
// function to reset game
function resetGame() {
    startButton.style.display = 'block';
    userInput.classList.add('disabled');
    userInput.setAttribute('readonly', 'readonly');
    hitsBlock.style.visibility = 'hidden';
    hint.style.visibility = 'hidden';
    timeRemaining.style.display = 'none';
    clock.style.display = 'inline';
    word.innerText = '';
    hits.innerText = 0;
    timer.innerText = 99;
    hitCount = 0;
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
    themeAudio.pause();
    gameProgressAudio.play();
    hitsBlock.style.visibility = 'visible';
    hint.style.visibility = 'visible';
    timeRemaining.style.display = 'inline';
    clock.style.display = 'none';
    startButton.style.display = 'none';
    userInput.classList.remove('disabled');
    userInput.removeAttribute('readonly');
    focusInput();
    updateTimer();
    generateWord();
});

onEvent('click', overlay, function () {
    this.removeAttribute('style', `visibility: visible;`);
    this.style.visibility = 'hidden';
    scoreInfo.style.display = 'none';
});

// when page is reloaded set input focus
onEvent('load', window, () => {

    typewriterAudio.play();
    let swordInterval = setInterval(function(){
        swordAudio.play();
        ninjaHeading.style.visibility = 'visible';
        ninjaHeading.style.animation = 'fly-in 1s 1';
        clearInterval(swordInterval);
    }, 4_000);
    
    let themeInterval = setInterval(function(){
        themeAudio.play();
        startButton.style.display = 'block';
        ninjaSubheading.style.visibility = 'visible';
        ninjaSubheading.style.animation = 'appearUp 0.4s ease-in';
        clearInterval(themeInterval);
    }, 7_000);
    
});

