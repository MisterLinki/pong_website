var game_screen = document.getElementById("game");
var playerScoreboard = document.getElementById("playerscore");
var computerScoreboard = document.getElementById("computerscore");

var playerscore = 0;
var computerscore = 0;
var pos_ball = 10;

var game = game_screen.getContext("2d");

game_screen.width = 800;
game_screen.height = 600;

var triggerKeys = {'z':false, 's':false, 'Z':false, 'S':false};
var start = true;

class PongBar{
    constructor(pos_x, pos_y){
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.width = 6;
        this.height = 160;
    }
    moveUp(){
        this.pos_y -= 3.5;
        return this.pos_y;
    }
    moveDown(){
        this.pos_y += 3.5;
        this.pos_y;
    }
    drawBar(game){
        game.fillStyle = "whitesmoke";
        game.fillRect(this.pos_x, this.pos_y, this.width, this.height);
    }
};

class Ball{
    constructor(){
        this.ballSize = 12.5;
        this.ballDirectionX = 2.5;
        this.ballDirectionY = 2.5;
        this.ballX = game_screen.width / 2 - this.ballSize / 2;
        this.ballY = game_screen.height / 2 - this.ballSize / 2;
    }
    drawBall(game){
        game.beginPath();
        game.arc(this.ballX + this.ballSize/2, this.ballY + this.ballSize/2, this.ballSize/2, 0, Math.PI*2);
        game.fillStyle = "white";        
        game.fill();
    }
};

var ball = new Ball();

var player_bar = new PongBar(10, 200);
var computer_bar = new PongBar(game_screen.width - 15, 200)


document.addEventListener('keydown', function(event) {
    triggerKeys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    triggerKeys[event.key] = false;
});

function collision(bar) {
    return (bar.pos_x + bar.width > ball.ballX && 
            bar.pos_y + bar.height > ball.ballY && 
            bar.pos_x < ball.ballX + ball.ballSize&&
            bar.pos_y < ball.ballY + ball.ballSize);
}

function gameLoop(){
    game.clearRect(0, 0, game_screen.width, game_screen.height);
    player_bar.drawBar(game);
    computer_bar.drawBar(game);

    ball.drawBall(game);

    if ((triggerKeys['s'] || triggerKeys['S']) && player_bar.pos_y < 600 - (player_bar.height + 3)) {
        player_bar.moveDown();
    }
    if ((triggerKeys['z'] || triggerKeys['Z']) && player_bar.pos_y > 3) {
        player_bar.moveUp();
    }
    if(start === true){      
        ball.ballX = game_screen.width / 2 - ball.ballSize / 2;
        ball.ballY = game_screen.height / 2 - ball.ballSize / 2;
        start = false;

        if((parseInt(Math.random()*10))%2 == 1){
            ball.ballDirectionX = -ball.ballDirectionX;
        }
        if((parseInt(Math.random()*10))%2 == 0){
            ball.ballDirectionY = -ball.ballDirectionY;
        }
    }
    else {
        ball.ballY += ball.ballDirectionY;
        ball.ballX += ball.ballDirectionX;

        if(ball.ballY >= 600){
            ball.ballDirectionY = -ball.ballDirectionY;
        }
        if(ball.ballY <= 0){
            ball.ballDirectionY = -ball.ballDirectionY;
        }
        if(collision(player_bar)){
            ball.ballDirectionX = -ball.ballDirectionX;
            ball.ballX += 1; 
        }
        if(collision(computer_bar)){
            ball.ballDirectionX = -ball.ballDirectionX;  
            ball.ballX -= 1; 
        }
        
        if(ball.ballX < 0 || ball.ballX > 800){
            start = true;
            if(ball.ballX < 0){playerscore += 1; console.log("player scored", playerscore)}
            if(ball.ballX > 800){computerscore += 1;console.log("computer scored", computerscore)}

            playerScoreboard.textContent = playerscore;
            computerScoreboard.textContent = computerscore;
        }
        
        if(520 > ball.ballY && ball.ballY > 60){
            if(ball.ballX > game_screen.width / 1.35){
                if(computer_bar.pos_y + computer_bar.height /2 < ball.ballY + ball.ballSize / 2){
                    computer_bar.moveDown();
                }
                else if (computer_bar.pos_y + computer_bar.height /2 > ball.ballY + ball.ballSize / 2){
                    computer_bar.moveUp();
                }
            }
        }
    }
    requestAnimationFrame(gameLoop);
};
gameLoop();
