const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('#Result');
const scoreDisplay = document.querySelector('#score');
let width = 15;
let direction  = 1;
let goRight = true;
let goLeft = false;
let invaderId;
let aliensRemoved = [];
let scores = 0;

let currentShooterIndex = 202;

for(let i = 0; i < 225; i++){
    const square = document.createElement('div');
    grid.appendChild(square);
}

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

const squares = Array.from(document.querySelectorAll('.grid div'));

function draw(){
    for(let i = 0; i < alienInvaders.length; i++){
        if(!aliensRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add('invaders');
        }
    }
}
draw();

function remove(){
    for(let i = 0; i < alienInvaders.length; i++){
        squares[alienInvaders[i]].classList.remove('invaders');
    }
}
remove();

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e){
    squares[currentShooterIndex].classList.remove('shooter');
    switch(e.key){
        case 'ArrowLeft':{
            if(currentShooterIndex % width != 0){
                currentShooterIndex -= 1;
                console.log(currentShooterIndex);
                break;
            }
        }
        case 'ArrowRight':{
            if(currentShooterIndex % width < width - 1){
                currentShooterIndex += 1;
                console.log(currentShooterIndex);
                break;
            }
        }
    }
    squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown',moveShooter);

function moveInvaders(){
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1;
    remove();

    if(rightEdge && goRight){
        for(let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width + 1;
        }
        direction = -1;
        goRight = false;
        goLeft = true;
    }

    if(leftEdge && goLeft){
        for(let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width - 1;
        }
        direction = 1;
        goRight = true;
        goLeft = false;
    }

    for(let i =0; i < alienInvaders.length; i++){
        alienInvaders[i] += direction;  
    }

    draw();

    if(squares[currentShooterIndex].classList.contains('invaders','shooter')){
        resultDisplay.textContent = 'Game Over!!!'
        clearInterval(invaderId);
    }

    for(let i = 0; i < alienInvaders.length; i++){
        if(alienInvaders[i] > squares.length - width){
            resultDisplay.textContent = 'Game Over!!!'
            clearInterval(invaderId);
        }
    }
    if(aliensRemoved.length === alienInvaders.length){
        resultDisplay.textContent = 'You win!!!';
        clearInterval(invaderId);
        document.removeEventListener('keydown',shoot);
    }
}

function shoot(e){
    let laserId;
    let currentLaserIndex = currentShooterIndex;
    function moveLaser(){
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');
        if(squares[currentLaserIndex].classList.contains('invaders')){
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invaders');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'),300);
                clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);

            scores++;

            scoreDisplay.innerHTML = scores;
        }
    }
    switch(e.key){
        case 'ArrowUp': laserId = setInterval(moveLaser,100);
            break;
    }
}

document.addEventListener('keydown',shoot);

invaderId = setInterval(moveInvaders,500);