'use strict';

/*--------------------------------------------------------------------------- *
 * Keyboard Ninja
 * Jodi-Ann Barrett
 * 
 * */

import { select, onEvent } from './utils.js';
// import Score from './Score.js';

/**--------------------------------- Data ----------------------------------- */
const hits = select('.hits span');
const plusOne = select('.hits span.plus-one');
const hitsBlock = select('.hits');
let hitCount = 0;
const timer = select('.timer span');
let timeValue = 0;
const word = select ('.word');
const userInput = select ('.user-input');
const startButton = select('.start');
const leaderModalBtn = select('.leaderboard-modal-btn');
const ninjaHeading = select('.center .heading p.merienda');
const ninjaSubheading = select('.center .heading h3');
const timeRemaining = select('.center .game-container .game-details .stats .timer p span');
const clock = select('.center .game-container .game-details .stats .timer p i');
const hint = select('.hint');
let mainVolume = 0.07;
let effectVolume = 0.08;
const dialog = select('dialog');

// const wordBank = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
// 'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
// 'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
// 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
// 'database', 'periodic', 'capitalism', 'abominable', 'component', 'future',
// 'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
// 'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician',
// 'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution',
// 'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
// 'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button',
// 'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
// 'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
// 'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
// 'keyboard', 'window'];

const wordBank = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
'database', 'periodic'];

let shuffledWordBank = [...shuffle(wordBank)];
let processedWords = [];
let scoreArray = [];
let currentWord = '';
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

//function to retrieve top 9 scores from local storage
function retrieveScore () {

    dialog.showModal();
    let result = '';
    let index = 0;
    
    // retrieve local storage array and sort by hits (highest to lowest)
    const scores = JSON.parse(localStorage.getItem('scores'));
    scores.sort((a, b) => b.hits - a.hits);

    // trim array to top 9 entries
    scores.slice(0, 9);

    // build result list
    result += `
        <h2>Your High Scores</h2>
        <table>
            <tbody>`;

            for(const score of scores) {
                result += `
                <tr>
                    <td>#${++index}</td>
                    <td><p>${score.hits} words</p></td>
                    <td><p>${score.percentage}%</p></td>
                </tr>
            `;
    }
    result += `</tbody>
        </table>
    `;
    
    scoreDetails.innerHTML = result;
}


//function to save score to local storage
function saveScore () {
    gameProgressAudio.pause();
    let percentage = Math.floor((hitCount / wordBank.length) * 100);
    let today = new Date().toLocaleDateString('en-ca', { year:"numeric", month:"short", day:"numeric"});

    // create score object and add to local storage array
    const score = {
        today: today,
        hits: hitCount,
        percentage: percentage
    };
    
    scoreArray.push(score);    
    localStorage.setItem('scores', JSON.stringify(scoreArray));
    
    retrieveScore();
}

// function to update the number of words the player has already matched
function updateHits() {
    let i = Math.floor(Math.random() * hitsAudios.length); 
    hitsAudios[i].volume = effectVolume;    
    hitsAudios[i].play();    
    hits.innerText = ++hitCount;
    hits.style.color = '#941c1c';

    // add animated score incrementor
    hits.appendChild(plusOne);
    plusOne.style.display = 'inline';
    plusOne.innerText = '+1';
    let addPlus = setInterval(function(){
        setTimeout(function() {
            plusOne.style.display = 'none';
            clearInterval(addPlus);
        }, 500);
    });
}

// function to compare the user input to the random word selected
function compareValues (currWord, input) {
    // clean strings for comparison
    currWord = currWord.toLowerCase().trim();
    input = input.toLowerCase().trim();
    
    let inputLength = input.length;
    let currentWordMatched = currWord.slice(0, inputLength);
    let currentWordUnmatched = currWord.slice(inputLength);
    let string = '';

    // highlight each letter spelt in the correct order
    if(input === currentWordMatched) {
        for(let i = 0; i < inputLength; i++) {
            string += currentWordMatched[i].replace(currentWordMatched[i],`<span class="matched">${currentWordMatched[i]}</span>`);
        }
        string += currentWordUnmatched;
    }
    
    if(string) {
        word.innerHTML = string;
        if(currWord === input) {
            updateHits();
            // setTimeout(() => { 
                focusInput();
                generateWord();
            // }, 100);
        }
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
        saveScore();
        resetGame();
        focusInput();
        let themeInterval = setInterval(function(){
            gameProgressAudio.pause();
            themeAudio.currentTime = 0;
            themeAudio.volume = mainVolume;
            themeAudio.play();
            clearInterval(themeInterval);
        }, 2_000);
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
        saveScore();
        resetGame();
        focusInput();
        let themeInterval = setInterval(function(){
            themeAudio.currentTime = 0;
            themeAudio.volume = mainVolume;
            themeAudio.play();
            clearInterval(themeInterval);
        }, 4_000);
    }
}
  
// function to reset game
function resetGame() {
    startButton.style.visibility = 'visible';
    leaderModalBtn.style.visibility = 'visible';
    userInput.classList.add('disabled');
    userInput.setAttribute('readonly', 'readonly');
    hitsBlock.style.visibility = 'hidden';
    hint.style.visibility = 'hidden';
    timeRemaining.style.display = 'none';
    clock.style.display = 'inline';
    word.innerText = '';
    hits.innerText = 0;
    timer.innerText = 10;
    hitCount = 0;
    focusInput();
}

// function to keep the focus on the input 
function focusInput() {
    userInput.value = '';
    userInput.focus();
    userInput.scrollIntoView();
}

// function to control how long audio files play
function playAudio(audioName, timeInMilisec){
    audioName.play();
    setTimeout(() => { 
        audioName.pause(); 
    }, timeInMilisec);
}

// compare the player input with the current word selected from the bank
onEvent('keyup', userInput, function() {
    compareValues(currentWord, userInput.value);
});


// start game when start button is clicked
onEvent('click', startButton, function() {
    themeAudio.pause();
    gameProgressAudio.currentTime = 0;
    gameProgressAudio.volume = mainVolume;
    gameProgressAudio.play();
    hitsBlock.style.visibility = 'visible';
    hint.style.visibility = 'visible';
    timeRemaining.style.display = 'inline';
    clock.style.display = 'none';
    startButton.removeAttribute('style', `visibility: visible;`);
    leaderModalBtn.removeAttribute('style', `visibility: visible;`);
    userInput.classList.remove('disabled');
    userInput.removeAttribute('readonly');
    focusInput();
    updateTimer();
    generateWord();
});

// show score board when leaderboard button is clicked
onEvent('click', leaderModalBtn, function () {
    retrieveScore();
    console.log('here');
});

// close dialog when bounds outside of the modal are clicked
onEvent('click', dialog, function(event) {
    const rect = this.getBoundingClientRect();
    
    if(event.clientY < rect.top || event.clientY > rect.bottom || 
        event.clientX < rect.left || event.clientX < rect.right) {
        console.log('here2');
        dialog.close();
    }
});

// when page is reloaded set input focus
onEvent('load', window, () => {
    
    playAudio(typewriterAudio, 2_500);
    let swordInterval = setInterval(function(){
        playAudio(swordAudio, 4_000);
        ninjaHeading.style.visibility = 'visible';
        ninjaHeading.style.animation = 'fly-in 1s 1';
        clearInterval(swordInterval);
    }, 2_400);
    
    let themeInterval = setInterval(function(){
        themeAudio.currentTime = 0;
        themeAudio.volume = mainVolume;
        themeAudio.play();
        startButton.style.visibility = 'visible';
        leaderModalBtn.style.visibility = 'visible';
        ninjaSubheading.style.visibility = 'visible';
        ninjaSubheading.style.animation = 'appearUp 0.4s ease-in';
        clearInterval(themeInterval);
    }, 5_000);

    focusInput();
    
});

