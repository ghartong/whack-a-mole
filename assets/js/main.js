/*
* VARIABLES 
*/

var defaultLevel = 1; /* default value, so we can reset to default later */
var defaultScore = 0; /* default value, so we can reset to default later */
var defaultMissed = 0; /* default value, so we can reset to default later */
var level = defaultLevel; /* current level of game */
var levelTime = 60; /* defaulting to 60 seconds */
var gameTime = 60; /* game time gets updated in timer below, levelTime acts as default game time */
var gameClock; /* global variable placeholder for our timer */
var danceClock; /* global variable placeholder for our dance timer */
var isGamePaused = false; /* flag to determine if game is in paused state */
var molesToProgress = 10; /* number of moles needed to level up, must catch them in faster than game time */
var score = defaultScore; /* confirmed hits */
var missed = defaultMissed; /* missed attacks */
var noticeScreen = document.getElementById('game-notice'); /* get the notice overlay element */
var gameTimeDisplay = document.getElementById('game-timer'); /* get the timer element */
var levelDisplay = document.getElementById('level-label'); /* get the Level display element */
var pauseButton = document.getElementById('btn-pause'); /* get the pause button */
var startButton = document.getElementById('btn-start'); /* get the start button */
var secondsDisplay = document.getElementById('timer-seconds'); /* get the seconds element of the timer */
var scoreDisplay = document.getElementById('score-label'); /* get the score display element */

/*
* GAME LOGIC 
*/

var setScreenNotice = function setScreenNotice(noticeType) {
    // sets class of the specified notice
    switch (noticeType) {
        case 'gameOver':
            noticeScreen.className = 'game-over';
            break;

        case 'levelUp':
            noticeScreen.className = 'level-up';
            break;

        default:
            noticeScreen.className = '';
    }
};

var levelUp = function levelUp() {
    // up the level
    level++; 
    
    // update the display
    levelDisplay.innerHTML = level; 
    
    // congratulate the player
    setScreenNotice('levelUp'); 
    
    // update the time limit for this level
    setLevelTime(); 
    
    // reset game clock to new level time
    resetGameClock(); 
    
    // wait 1 second,
    setTimeout(function () {
        // remove overlay
        setScreenNotice('none'); 
        
        // start clock
        startGameClock();
    }, 1000);
};

var showStartButton = function showStartButton() {
    pauseButton.className = 'hide';
    startButton.className = '';
};

var showPauseButton = function showPauseButton() {
    pauseButton.className = '';
    startButton.className = 'hide';
};

var hideStartPauseButtons = function hideStartPauseButtons() {
    pauseButton.className = 'hide';
    startButton.className = 'hide';    
}

/*
* CLOCK LOGIC 
*/

var setGameClock = function setGameClock() {
    // set game time to the current level's time
    gameTime = levelTime; 
    
    // display game time
    secondsDisplay.innerHTML = formatSeconds(gameTime);
};

var resetGameClock = function resetGameClock() {
    // stop the timer
    clearInterval(gameClock); 
    
    // stop any dancing moles
    clearTimeout(danceClock); 
    
    // set game time to the current level's time
    gameTime = levelTime; 
    
    // display game time
    secondsDisplay.innerHTML = formatSeconds(levelTime);
};

var startGameClock = function startGameClock() {
    gameClock = setInterval(function () {
        gameTimer();
    }, 1000);
};

var gameTimer = function gameTimer() {
    if (gameTime <= 6 && gameTime > 0) {
        setTimerAlert();
    }

    if (gameTime === 0) {
        stopGameClock();
        resetTimerAlert();
        setScreenNotice('gameOver');
        hideStartPauseButtons();
    } else {
        gameTime--;
        secondsDisplay.innerHTML = formatSeconds(gameTime);
    }
};

var stopGameClock = function stopGameClock() {
    // stop the timer
    clearInterval(gameClock); 
    
    // stop any dancing moles
    clearTimeout(danceClock); 
    
    // reset the UI clock to zero
    secondsDisplay.innerHTML = '00';
};

var pauseGameClock = function pauseGameClock() {
    // stop the timer
    clearInterval(gameClock); 
    
    // stop any dancing moles
    clearTimeout(danceClock);
};

var setTimerAlert = function setTimerAlert() {
    // sets new class to the timer
    gameTimeDisplay.className = 'red'; 
};

var resetTimerAlert = function resetTimerAlert() {
    // clears class of the timer
    gameTimeDisplay.className = ''; 
};

var setLevelTime = function setLevelTime() {
    /* level 1 gets 60 seconds, each progressive level loses 5 seconds */
    levelTime = 60 - (level - 1) * 5;
};

var formatSeconds = function formatSeconds(seconds) {
    return ('0' + seconds).substr(-2);
};

/*
* ATTACK LOGIC 
*/

// get all the mole holes
var moleHoles = document.getElementsByClassName('mole-hole'); 

// loop through the mole holes and add event listener for onClick
for (i = 0; i < moleHoles.length; i++) {
    moleHoles[i].addEventListener('click', function (e) {
        e.preventDefault(); 
        
        // check if we hit a mole, adjust for IE
        const target = e.target;
        var foundAMole = false;

        if (target.matches) { // Not IE
            if (target.matches('.mole')) {
                foundAMole = true;
            }
        } else if (target.msMatchesSelector) { // is IE
            if (target.msMatchesSelector('.mole')) {
                foundAMole = true;
            }
        }

        if (foundAMole) {
            // remove the mole
            removeMoles(); 
            
            // record a hit
            onScore(e.target.id);
        } else {
            // record a miss
            onMiss(e.target.id);
        }
    });
};

var onScore = function onScore(id) {
    //stop the mole dance so he doesn't move again too soon, although...it would add some difficulty to the game!
    clearTimeout(danceClock); 
    
    // add a point to the score variable
    score++; 
    
    // display new score
    scoreDisplay.innerHTML = score; 
    
    // did we level up yet?
    if (score % molesToProgress === 0) {
        levelUp();
    } 
    
    // start mole dance if there is time left in the game
    if (gameTime) {
        startMoleDance();
    }
};

var onMiss = function onMiss(id) {
    // add a point to the missed attack variable
    missed++;
};

/*
* BUTTON LOGIC 
*/

var onPause = function onPause() {
    // toggle pause/start buttons display
    showStartButton(); 
    
    // stop the timer
    pauseGameClock(); 
    
    // set paused flag in case we start back up
    isGamePaused = true; 
    
    // clear the moles
    removeMoles();
};

var onStart = function onStart() {
    // toggle pause/start buttons display
    showPauseButton();

    if (isGamePaused) {
        // un-pause
        isGamePaused = false; 
        
        // restart the timer
        startGameClock();
    } else {
        // set the timer to current level default time
        setGameClock(); 
        
        // start the timer
        startGameClock();
    } 
    
    // start the moles
    startMoleDance();
};

var onReset = function onReset() {
    // stop game clock
    stopGameClock(); 
    
    // reset level, in part so we can set clock back to level 1 time
    level = defaultLevel; 

    // update the display
    levelDisplay.innerHTML = level; 
    
    // update the time limit for this level
    setLevelTime(); 
    
    // reset game clock
    resetGameClock(); 
    
    // clear the moles
    removeMoles(); 
    
    // reset score
    score = defaultScore;
    scoreDisplay.innerHTML = score; 
    
    // reset missed
    missed = defaultMissed; 
    
    // make sure we are un-paused
    isGamePaused = false; 
    
    // show start button
    showStartButton(); 
    
    // remove any notices
    setScreenNotice('none');
};

/*
* MOLE LOGIC 
*/

var startMoleDance = function startMoleDance() {
    // hide any moles...maybe user hit start twice
    removeMoles(); 
    
    // pick a hole for the mole
    var moleHole = Math.floor(Math.random() * 7 + 1); 
    
    // display the mole by adding .mole to the hole
    addMoles(moleHole); 
    
    // get random amount of time per the requirements and let the mole dance for that long
    var danceTime = Math.floor(Math.random() * 4 + 1) * 1000; 
    
    // start dance timer
    danceClock = setTimeout(function () {
        // when time is up, clear the .mole from the hole
        // and start mole dance again, if game time has not expired
        if (gameTime) {
            startMoleDance();
        }
    }, danceTime);
};

var addMoles = function addMoles(id) {
    // get the hole we want
    var moleHole = document.getElementById('hole-' + id); 

    // sets new class to the hole
    moleHole.className = 'mole-hole mole'; 
};

var removeMoles = function removeMoles() {
    // get all the moles
    var moles = document.getElementsByClassName('mole'); 
    
    // loop through the moles and remove them
    for (i = 0; i < moles.length; i++) {
        // sets class back to only the hole
        moles[i].className = 'mole-hole'; 
    }
};
