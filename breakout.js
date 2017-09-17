////////////////////////////////////////////////////////////////////////////////
/////// Author: Andres Zibula                                           ////////
/////// Source: https://github.com/andres-zibula/breakout-js            ////////
////////////////////////////////////////////////////////////////////////////////

var canvas = document.getElementById("idCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

if (ctx.canvas.width > 1024) {
    ctx.canvas.width = 1024;
}
if (ctx.canvas.height > 500) {
    ctx.canvas.height = 500;
}

var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 40;
var speedx = 3;
var speedy = -3;
var paddleHeight = 10;
var paddleWidth = canvas.width / 4;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleVel = 7;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 6;
var brickColumnCount = 3;
var brickWidth = canvas.width / brickRowCount - canvas.width / brickRowCount / 10;
var brickHeight = 20;
var brickPadding = canvas.width / brickRowCount / 10;
var brickOffsetTop = 30;
var brickOffsetLeft = brickPadding / 2;
var score = 0;
var lives = 3;
var level = 1;
var lastLevel = 3;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


function nextLevel() {

    x = canvas.width / 2;
    y = canvas.height - 40;
    speedx *= 2;
    speedy *= 2;
    if (speedy > 0) {
        speedy = -speedy;
    }
    paddleWidth -= paddleWidth / 3;
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleVel *= 2;
    rightPressed = false;
    leftPressed = false;
    brickRowCount += 4;
    brickColumnCount += 2;
    brickWidth = canvas.width / brickRowCount - canvas.width / brickRowCount / 10;
    brickHeight = 20;
    brickPadding = canvas.width / brickRowCount / 10;
    brickOffsetTop = 30;
    brickOffsetLeft = brickPadding / 2;
    score = 0;
    lives = 3;
    level++;

    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
                    speedy = -speedy;
                    b.status = 0;
                    score++;

                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if (c % 2 == 0) {
                    ctx.fillStyle = "blue";
                } else {
                    ctx.fillStyle = "red";
                }

                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Level: " + level, canvas.width / 2 - 30, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawLevel();
    collisionDetection();

    if (score == brickRowCount * brickColumnCount) {
        if (level != lastLevel) {
            nextLevel();
        } else {
            alert("YOU WIN");
            document.location.reload();
        }

    } else {

        if (x + speedx > canvas.width - ballRadius || x + speedx < ballRadius) {
            speedx = -speedx;
        }
        if (y + speedy < ballRadius) {
            speedy = -speedy;
        } else if (y + speedy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                speedy = -speedy;
            } else {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    paddleX = (canvas.width - paddleWidth) / 2;
                    if (speedy > 0) {
                        speedy = -speedy;
                    }
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += paddleVel;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= paddleVel;
        }

        x += speedx;
        y += speedy;
    }

    requestAnimationFrame(draw);
}

draw();