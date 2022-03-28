let canvas = document.getElementById("canvas");
document.addEventListener("keydown", keyPressed);

let score = document.getElementById("score");
let highScoreHtml = document.getElementById("high-score");
let yourScore = 0;
let highScore = localStorage.getItem("highScore") != null ? localStorage.getItem("highScore") : 0;
highScoreHtml.innerHTML = "High Score : " + highScore;

let isPlaying = false;
let timer;

let context = canvas.getContext("2d");
context.fillStyle = "white";
context.font = "30px Arial";
context.fillText("Press enter to play", 170, 100);

let food = new Food(context);
let snake = new Snake(context);

function keyPressed(event){
	if(event.key == "Enter"){
		if(isPlaying){
			isPlaying = false;
			clearInterval(timer);
			context.fillText("Paused!", 230, 100);
			context.fillText("Press enter to continue.", 150, 140);
		}
		else {
			score.innerHTML = "Your Score: " + yourScore;
			context.clearRect(0 , 0, canvas.width, canvas.height);
			timer = setInterval(handleGame, 50);
			isPlaying = true;
		}
	}
	else {
		if(isPlaying){
			snake.changeDirection(event.key);
		}
	}
}

function handleGame(){
	snake.drawSnake();
	snake.moveSnake();
	food.createFood();
	if(snake.isDie()){
		die();
		if(yourScore > highScore){
			highScore = yourScore;
			highScoreHtml.innerHTML = "High Score : " + highScore;
			localStorage.setItem("highScore",highScore);
		}
		yourScore = 0;
	}
	if(isEaten()){
		snake.eat();
		yourScore++;
		score.innerHTML = "Your Score: " + yourScore;
	}
}

function die(){
		context.fillText("Game over!", 210, 100);
		context.fillText("Press enter to play again.", 150, 140);
		clearInterval(timer);
		isPlaying = false;
		snake.x = [100, 110, 120, 130];
		snake.y = [100,100,100,100];
		snake.direction = "right";
}

function isEaten(){
	if(food.foodX - 5 == snake.x[snake.x.length - 1] &&
		food.foodY - 5 == snake.y[snake.y.length - 1]){
			return true;
	}
	return false;
}

function Snake(context){
	//these are the coordinates of snake body.
	this.x = [100, 110, 120, 130];
	this.y = [100,100,100,100];
	this.direction = "right";
	
	this.drawSnake = function(){
		for(let counter = 0; counter < this.x.length; counter++){
			context.fillRect(this.x[counter],this.y[counter], 10, 10);
		}
	}
	this.moveSnake = function(){
		context.clearRect(this.x[0] , this.y[0], 10, 10);
		if(this.direction == "right"){
			this.x.shift();
			this.x.push(this.x[this.x.length - 1] + 10);
			/* the y coordinates will all be the same 
			 if its direction is right or left. */
			this.y.shift();
			this.y.push(this.y[this.y.length - 1]);
		}
		else if(this.direction == "left"){
			this.x.shift();
			this.x.push(this.x[this.x.length - 1] - 10);
			this.y.shift();
			this.y.push(this.y[this.y.length - 1]);
		}
		else if(this.direction == "top"){
			this.y.shift();
			this.y.push(this.y[this.y.length - 1] - 10);
			/* the x coordinates will all be the same 
			 if its direction is up or down. */
			this.x.shift();
			this.x.push(this.x[this.x.length - 1]);
		}
		else if(this.direction == "bottom"){
			this.y.shift();
			this.y.push(this.y[this.y.length - 1] + 10);
			this.x.shift();
			this.x.push(this.x[this.x.length - 1]);
		}
	}
	this.changeDirection = function(key){
		/* You can't go left if the direction is right.
		and vice versa.
			You can't go top if the direction is bottom.
 		and vice versa.
		*/
		if(key == "ArrowUp"){
			if(this.direction != "bottom"){
				this.direction = "top";
			}
		}
		else if(key == "ArrowDown"){
			if(this.direction != "top"){
				this.direction = "bottom";
			}
		}
		else if(key == "ArrowLeft"){
			if(this.direction != "right"){
				this.direction = "left";
			}
		}
		else if(key == "ArrowRight"){
			if(this.direction != "left"){
				this.direction = "right";
			}
		}
	}
	
		
	this.eat = function(){
		this.x.unshift(this.x[0]);
		this.y.unshift(this.y[0]);
		food.changeFood();
		food.createFood();
	}
	this.isDie = function() {
		if(this.x[this.x.length - 1] < 0 || 
		this.x[this.x.length - 1] > 600 ||
		this.y[this.y.length - 1] < 0 ||
		this.y[this.y.length - 1] > 300){
			return true;
		}
		for(let counter = 0; counter < this.x.length - 1; counter++){
			if(this.x[counter] == this.x[this.x.length - 1] &&
			this.y[counter] == this.y[this.y.length - 1]){
				return true;
			}
		}
		return false;
	}
}
function Food(context) {
	this.foodX;
	this.foodY;
	
	this.changeFood = function() {
		//This return a number that is divisble by 5 
		//between 0 and 600
		this.foodX = Math.floor((Math.random() * 600) + 1);
		this.foodX = Math.floor(this.foodX / 5) * 5;
		this.foodX = (this.foodX % 10 == 0) ? this.foodX - 5 : this.foodX;
		this.foodX = this.foodX <= 0 ? 5 : this.foodX;
		
		//This return a number that is divisble by 5 
		//between 0 and 600
		this.foodY = Math.floor((Math.random() * 300) + 1);
		this.foodY = Math.floor(this.foodY / 5) * 5;
		this.foodY = (this.foodY % 10 == 0) ? this.foodY - 5 : this.foodY;
		this.foodY = this.foodY <= 0 ? 5 : this.foodY;
	}
	this.changeFood();
	this.createFood = function(){
		context.beginPath();
		context.arc(this.foodX, this.foodY, 5, 0, 2 * Math.PI);
		context.fill();
	}
}