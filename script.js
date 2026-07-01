const startResetBtn = document.querySelector('#startreset');
const scoreDisplay = document.querySelector('#scoreValue');
const timeDisplay = document.querySelector('#timeremainingvalue');
const questionDisplay = document.querySelector('#question');
const gameOverBox = document.querySelector('#gameover');
const timerBox = document.querySelector('#timeremaining');
const correctPill = document.querySelector('#correct');
const wrongPill = document.querySelector('#wrong');
const GAME_TIME = 60;

let countdown = null;
const answerBoxes = [
    document.querySelector('#box1'),
    document.querySelector('#box2'),
    document.querySelector('#box3'),
    document.querySelector('#box4'),
];
let isPlaying = false;
let score = 0;
let timeRemaining;

let correctAns;

registerEvents();

function generateAnswers(nums){
    correctAns = nums[0] * nums[1];
    const correctAnsBoxNumber = getRandomInt(1,4);

    const selectedAnswers = [correctAns];

    answerBoxes.forEach((el, idx) => {
        const boxNumber = idx + 1;
        if(correctAnsBoxNumber === boxNumber){
            updateInnerHTML(el, correctAns);

        } else {
            let wrongAns;
            do{
                const num1 = getRandomInt(1, 10);
                const num2 = getRandomInt(1, 10);

                wrongAns = num1 * num2;
            } while(selectedAnswers.includes(wrongAns));
            selectedAnswers.push(wrongAns);
            updateInnerHTML(el, wrongAns);
        }
    })
}
function generateQuestion(){
    const num1 = getRandomInt(1, 10);
    const num2 = getRandomInt(1, 10);
    updateInnerHTML(questionDisplay, `${num1}x${num2}`);
    return [num1, num2];
}
function generateQuestionAnswer(){
    const nums = generateQuestion();
    generateAnswers(nums);
}
function stopCountDown(){
    clearInterval(countdown);
}
function endGame(){
    stopCountDown();
    updateInnerHTML(startResetBtn, "Start Game");
    isPlaying = false;
    updateInnerHTML(gameOverBox, `<p>Game Over</p><p>Your Score: ${score}</p>`);
    show(gameOverBox);
    hide(timerBox);
}
function startCountdown(){
    countdown = setInterval(function(){
        timeRemaining--;
        if(timeRemaining <= 0){
            endGame();
        }
        updateInnerHTML(timeDisplay, timeRemaining);
    }, 1000);
}
function startGame(){
    isPlaying = true;
    score = 0;
    hide(gameOverBox);
    timeRemaining = GAME_TIME;
    generateQuestionAnswer();
    updateInnerHTML(scoreDisplay, score);
    updateInnerHTML(timeDisplay, timeRemaining);
    show(timerBox);
    startCountdown();
    updateInnerHTML(startResetBtn, 'Reset Game');
}
function resetGame(){
    stopCountDown();
    startGame();
}
function startResetGame(evt){
    evt.preventDefault();
    if(isPlaying){
        // game reset
        resetGame();

    } else {
        //game start
        startGame();
    }

}
function handleAnswerClick(evt){
    evt.preventDefault();
    if(!isPlaying) return;
    const selectedAnswers = parseInt(evt.target.textContent);

    if(selectedAnswers === correctAns){
        score++;
        updateInnerHTML(scoreDisplay, score);
        hide(wrongPill)
        show(correctPill);
        setTimeout(() => hide(correctPill), 5000);
        generateQuestionAnswer();
    } else{
        hide(correctPill)
        show(wrongPill);
        setTimeout(() => hide(wrongPill), 5000);
    }
}
function registerEvents(){
    startResetBtn.addEventListener('click', startResetGame);
    answerBoxes.forEach(el => el.addEventListener('click',handleAnswerClick));
}

// helper functions
function updateInnerHTML(el, htmlText){
    el.innerHTML = htmlText;
}
function hide(el){
    el.style.display = 'none';
}
function show(el){
    el.style.display = 'block';
}
function getRandomInt(min, max){
    max = max + 1;
    return Math.floor(Math.random() * (max - min)) + min;
}