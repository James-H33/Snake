class Snakes {
    constructor() {
        this.tail = 0;
        this.posx = 0;
        this.posy = 0;
        this.posHistory = [];
    }

    getPos() {
        return {
            posx: this.posx,
            posy: this.posy
        }
    }
}

let Snake = new Snakes();
let Target = {
    posx: 50,
    posy: 50
}
let Canvas = null;
let ctx = null;
let currentDirection = null;

window.onload = () => {
    Canvas = document.getElementById('snake');
    document.addEventListener('keydown', keyPushed);
    Canvas.style.width = '400px';
    Canvas.style.height = '400px';
    Canvas.style.background = '#000';
    ctx = Canvas.getContext('2d');

    init(ctx, Snake);
};

let directionalFlow = {
    37: (s) => s.posx -= 10,
    39: (s) => s.posx += 10,
    38: (s) => s.posy -= 5,
    40: (s) => s.posy += 5
}

let allowedDirections = [37, 39, 38, 40];

function init() {
    setInterval(gameController, 100);
}

function gameController() {
    incrementDirection(Snake);
    renderBoard(ctx);
    renderTarget(ctx);
    renderSnake(ctx, Snake);

    if (Snake.posx === Target.posx &&
        Snake.posy === Target.posy) {
        Snake.tail++;
        Target = getNewTarget();
    }

    if (compareCordinates()) {
        Snake = new Snakes();
        currentDirection = null;
    }

    if (isOutOfBounds()) {
        Snake = Object.assign(Snake, getLegalCordinates(Snake));
    }
}

function getLegalCordinates(s) {
    let x = s.posx;
    let y = s.posy;

    if (s.posy === ctx.canvas.height) {
        y = 0;
    }

    if (s.posy === -10) {
        y = ctx.canvas.height;
    }
    
    if (s.posx === ctx.canvas.width) {
        x = 0;
    }

    if (s.posx === -10) {
        x = ctx.canvas.width;
    }
    
    return {
        posy: y,
        posx: x
    };
}

function isOutOfBounds() {
    return ctx.canvas.height === Snake.posy ||
        ctx.canvas.width === Snake.posx ||
        Snake.posy === -10 ||
        Snake.posx === -10;
}

function compareCordinates() {
    const s = Snake.getPos();
    return Snake.posHistory
        .slice(0, Snake.posHistory.length - 1)
        .some((x) => s.posx === x.posx && s.posy === x.posy);
}

function incrementDirection(s) {
    if (currentDirection) {
        directionalFlow[currentDirection](s);
    }
}

function keyPushed(event) {
    if (allowedDirections.includes(event.keyCode)) {
        currentDirection = event.keyCode;
    }
}

function renderTarget(c) {
    c.fillStyle = 'green';
    c.fillRect(Target.posx, Target.posy, 10, 5);
}

function renderBoard(c) {
    c.fillStyle = 'black';
    c.fillRect(0, 0, Canvas.width, Canvas.height);
}

function renderSnake(c, snake) {
    Snake.posHistory.push(Snake.getPos());
    Snake.posHistory = Snake.posHistory.slice(Snake.posHistory.length - (Snake.tail + 1), Snake.posHistory.length)

    Snake.posHistory.forEach((x) => {
        c.fillStyle = 'white';
        c.fillRect(x.posx, x.posy, 10, 5);
    });
}

function getNewTarget() {
    let x = Math.floor((Math.random() * 30));
    return {
        posx: x * 10,
        posy: x * 5
    }
}