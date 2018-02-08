/**
 * TypeSnake - A classic renewed
 * 
 * @author Yuri Braga
 * @version ALPHA-1.0
 */

/**
 * For convenience, I created an interface to store x and y axis
 */
interface coordinates {
    x: number;
    y: number;
}

/**
 * This class contains all the attributes related to the snake itself
 */
class Snake {
    public size: number;
    public trail: coordinates[];
    public last: coordinates;
    public position: coordinates;
    public direction: number;

    constructor() {
        this.size = 2;
        this.direction = 1;
        this.position = { x: 1, y: 1 };
        this.trail = [{ x: this.position.x, y: this.position.x }];
        this.last = { x: this.position.x, y: this.position.x };
    }

    /**
     * This method is responsible for storing multiple coordinates where the snake passed in
     * 
     * @param x 
     * @param y 
     */
    public store(x: number, y: number) {
        if (this.trail.length >= this.size - 1) {
            this.last = this.trail.shift();
        }
        this.trail.push({ x: x, y: y });
    }
}

/**
 * This class contains the food generation
 */
class Food {
    public position: coordinates;

    constructor() {
        this.position = { x: 9, y: 9 };
    }

    public generate() {
        this.position = { x: Math.floor(Math.random() * 18), y: Math.floor(Math.random() * 18) };
    }
}

/*game configurations*/
var frames: number = (1 / 8) * 1000;
var colorBack: string = "#303642";
var colorSnake: string = "#5294E2";
var colorFood: string = "#CC575D";

/*main execution*/
window.onload = main();

function main(): any {
    document.addEventListener('keydown', keyboardInput);
    var canvas: any = document.getElementById("board");
    var ctx: any = canvas.getContext("2d");
    var snake: Snake = new Snake();
    var food: Food = new Food();
    var id: any = setInterval(gameplay, frames);

    /*background*/
    ctx.fillStyle = colorBack;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    /**
     * Most of the game happens here
     */
    function gameplay(): void {
        if (gameover()) {
            /*food colouring*/
            ctx.fillStyle = colorFood;
            ctx.fillRect(25 * (food.position.x) + 1, 25 * (food.position.y) + 1, 23, 23);

            /*snake colouring*/
            ctx.fillStyle = colorBack;
            ctx.fillRect(25 * snake.last.x, 25 * snake.last.y, 25, 25);
            ctx.fillStyle = colorSnake;
            move();
            eat();
        } else {
            clearInterval(id);
        }
    }

    /**
     * Verifies if the food is eaten
     */
    function eat(): void {
        if (food.position.x == snake.position.x && food.position.y == snake.position.y) {
            do{
                food.generate();
            }while(canGenerate());
            snake.size++;
        }
    }

    /**
     * Verifies if the food can be placed
     */
    function canGenerate(): boolean {
        var resp: boolean = false;
        for (let index = snake.trail.length - 1; index > 0; index--) {
            if (food.position.x == snake.trail[index].x && food.position.y == snake.trail[index].y) {
                resp = true;
                index = 0;
            }
        }
        if (food.position.x == snake.last.x && food.position.y == snake.last.y) {
            resp = true;
        }
        return resp;
    }

    /**
     * This function is responsible for the snake trail on the canvas
     */
    function move(): void {
        var d: number = snake.direction;
        snake.store(snake.position.x, snake.position.y);
        if (d == 1) {
            ctx.fillRect(25 * (snake.position.x++) + 1, 25 * (snake.position.y) + 1, 23, 23);
        } else if (d == 2) {
            ctx.fillRect(25 * (snake.position.x) + 1, 25 * (snake.position.y++) + 1, 23, 23);
        } else if (d == 3) {
            ctx.fillRect(25 * (snake.position.x--) + 1, 25 * (snake.position.y) + 1, 23, 23);
        } else if (d == 0) {
            ctx.fillRect(25 * (snake.position.x) + 1, 25 * (snake.position.y--) + 1, 23, 23);
        }
    }

    /**
     * Receives input from the keyboard to set the snake direction
     * @param event 
     */
    function keyboardInput(event: KeyboardEvent): void {
        if (event.keyCode == 37 && snake.direction != 1) {
            //console.log("left")
            snake.direction = 3;
        } else if (event.keyCode == 38 && snake.direction != 2) {
            //console.log("up")
            snake.direction = 0;
        } else if (event.keyCode == 39 && snake.direction != 3) {
            //console.log("right")
            snake.direction = 1;
        } else if (event.keyCode == 40 && snake.direction != 0) {
            //console.log("down")
            snake.direction = 2;
        }
    }

    /**
     * Determines when the game is over
     */
    function gameover(): boolean {
        var value: boolean = true;
        if (snake.position.x >= 18 || snake.position.y >= 18 || snake.position.x < 0 || snake.position.y < 0) {
            value = false;
        }
        for (let i = snake.trail.length - 2; i > 0; i--) {
            if ((snake.position.x == snake.trail[i].x && snake.position.y == snake.trail[i].y) || (snake.position.x == snake.last.x && snake.position.y == snake.last.y)) {
                value = false;
            }
        }
        return value;
    }
}

