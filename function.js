const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')

canvas.width = 448;
canvas.height = 400

//variables de la pelota
const ballRadius = 3;
//posicion de la pelota
let x = canvas.width / 2;
let y = canvas.height - 30;
//velocidad de la pelota
let dx = 1;
let dy = -1;

//variables de la paleta
const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = (canvas.height - paddleHeight) - 10

let rightPressed = false
let leftPressed = false

//VARIABLES DE LOS LADRILLOS
const brickRowCount = 6
const brickColumnCount = 13
const brickWidth = 30
const brickHeight = 14
const brickPadding = 2
const brickOffsetTop = 80
const brickOffsetLeft = 16
const bricks = []

const BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
}

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [] //inicializamos un array vacio
    for (let r = 0; r < brickRowCount; r++) {
        //calculamos la posicion del ladrillo en pantalla
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
        //asignar un color aleatorio a cada ladrillo
        const random = Math.floor(Math.random() * 8) //numero aleatorio entre 0 y 7
        //guardamos la informacion del ladrillo en el array
        bricks[c][r] = {
            x: brickX, y: brickY,
            status: BRICK_STATUS.ACTIVE,
            color: random
        }

    }
}

const PADDLE_SENSITIVITY = 6

function drawBall() {
    ctx.beginPath()//inicial el trasado
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()//terminar el trazado
}

function drawPaddle() {

    ctx.drawImage(
        $sprite, //imagen
        29,//clipX: desde donde lo quiero recortar
        174,//clipY: desde donde lo quiero recortar
        paddleWidth,//clipWidth: ancho del recorte
        paddleHeight,//clipHeight: alto del recorte
        paddleX, //x donde lo quiero poner
        paddleY, //y donde lo quiero poner
        paddleWidth, //width: ancho que quiero que tenga
        paddleHeight //height: alto que quiero que tenga
    )
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status === BRICK_STATUS.DESTROYED) {
                continue
            }
            ctx.fillStyle = 'yellow'
            ctx.fillRect(currentBrick.x, currentBrick.y, brickWidth, brickHeight)
            ctx.strokeStyle = 'black'
            ctx.stroke()
            ctx.fill()

            const clipX = currentBrick.color * 32
            ctx.drawImage(
                $bricks,
                clipX,
                0,
                brickWidth,
                brickHeight,
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            )
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status === BRICK_STATUS.DESTROYED) {
                continue
            }
            if (x > currentBrick.x &&
                 x < currentBrick.x + brickWidth && 
                 y > currentBrick.y && 
                 y < currentBrick.y + brickHeight) {
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }
    }
}

function ballMovement() {
    //rebotar las pelotas
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    //rebotar en la parte de arriba
    if (y + dy < ballRadius) {
        dy = -dy
    }

    //si la pelota toca la pala
    const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth
    const isBallTouchingPaddle = y + dy > paddleY
    if (isBallSameXAsPaddle && isBallTouchingPaddle) {
        dy = -dy //cambia mos la direccion de la pelota
    }
    //si la pelota toca el suelo
    else if (y + dy > canvas.height - ballRadius) {
        console.log('Game over')
        document.location.reload()
    }
    x += dx;
    y += dy;
}

function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SENSITIVITY
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SENSITIVITY
    }
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = true
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = true
        }
    }

    function keyUpHandler(event) {
        const { key } = event
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = false
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = false
        }
    }
}
function draw() {
    cleanCanvas()
    //hay que dibujar los elementos
    drawBall()
    ballMovement()
    drawPaddle()
    drawBricks()
    collisionDetection()
    paddleMovement()
    window.requestAnimationFrame(draw)
}

draw()
initEvents()
