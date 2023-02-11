const playBoard = document.querySelector('.play-board')
const scoreMarkup = document.querySelector('.score')
const highScoreMarkup = document.querySelector('.high-score')

//game over
let gameOver = false
//alimento
let foodX, foodY
//snake
let snakeX = 5, snakeY = 10
//corpo da snake
let snakeBody = []
//velocidade
let velocityX = 0, velocityY = 0
//intervalo de tempo
let setIntervalId
//pontuação
let score = 0
//salvamento em localstorage da maior pontuação do usuario
let highScore = localStorage.getItem('high-score') || 0
highScoreMarkup.innerText = `High Score: ${highScore}`
//botões de controle da versão mobile
let mobileControls = document.querySelectorAll('.controls i')



//controle da direção da snake 
const changeDirection = (e) => {
    if (e.key === 'ArrowUp' && velocityY != 1) {
        velocityX = 0
        velocityY = -1
    } else if (e.key === 'ArrowDown' && velocityY != -1) {
        velocityX = 0
        velocityY = 1
    } else if (e.key === 'ArrowLeft' && velocityX != 1) {
        velocityX = -1
        velocityY = 0
    } else if (e.key === 'ArrowRight' && velocityX != -1) {
        velocityX = 1
        velocityY = 0
    }
}

mobileControls.forEach(key => {
    key.addEventListener('click', () => changeDirection({key: key.dataset.key}))
})

function restartGame() {
    let body = document.querySelector('body')
    body.innerHTML = `
    <div class="alert">
    <p>GAME OVER</p>
    <button id="restart-button">RESTART</button>
    </div>
    `
}

const handleGameOver = () => {
    clearInterval(setIntervalId)
    restartGame()
    let restarButton = document.getElementById('restart-button')
    restarButton.onclick = () => {
        location.reload()
    }
}

//gera randomicamente o alimento da snake
const randomFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1
    foodY = Math.floor(Math.random() * 30) + 1
}

//iniciar o game
const initGame = () => {
    if (gameOver) return handleGameOver()
    //gerar o alimento da snake
    let foodAndSnakeMarkup = `<div class="food" style="grid-area:${foodY} / ${foodX}"></div>`

    if (snakeX === foodX && foodY === snakeY) {
        randomFoodPosition()
        //usando o metodo push para formar um array com os food's a cada vez que ouverm o contato de snake e food
        snakeBody.push([foodX, foodY])
        //incrementa os pontos de acordo com as colisoes com a comida
        score++
        scoreMarkup.innerText = `Score: ${score}`

        highScore = score >= highScore ? score : highScore
        localStorage.setItem('high-score', highScore)
        highScoreMarkup.innerText = `High Score: ${highScore}`
    }

    for (let f = snakeBody.length - 1; f > 0; f--) {
        snakeBody[f] = snakeBody[f - 1]
    }

    //atualizando a posição da snake com base na velocidade atual
    snakeX += velocityX
    snakeY += velocityY
    snakeBody[0] = [snakeX, snakeY]

    //caso a snake saia dos perimetros dispostos pelo "tabuleiro" ela entra em game over que passa a ser true
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true
    }

    for (let i = 0; i < snakeBody.length; i++) {
        //gerar a snake
        foodAndSnakeMarkup += `<div class="snake" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
        //verifica se a snake entrou em contato com parte do corpo dela mesma
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true
        }
    }
    playBoard.innerHTML = foodAndSnakeMarkup
}
randomFoodPosition()
setIntervalId = setInterval(initGame, 125)

//captura o precionamento das teclas
document.addEventListener('keydown', changeDirection)