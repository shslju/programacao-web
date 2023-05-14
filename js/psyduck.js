const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext('2d');


const CANVAS_WIDTH = (canvas.width = 640);
const CANVAS_HEIGHT = (canvas.height = 480);

const main_char_walk_cycle_src = [
    '../img/gemu/1/char/psyduck/0.png',
    '../img/gemu/1/char/psyduck/1.png',
    '../img/gemu/1/char/psyduck/2.png'
]

class MainCharacterFieldSprite {
    constructor() {
        this.x = 215;
        this.y = 170;
        this.walk_cycle_sprite = new Array();
        for (let i = 0; i < main_char_walk_cycle_src.length; i++) {
            this.walk_cycle_sprite.push(new Image(200, 200));
            this.walk_cycle_sprite[i].src = main_char_walk_cycle_src[i];
        }
        this.current_sprite = this.walk_cycle_sprite[0];
        this.walk_cycle_ptr = 0;
        this.walk_cycle_ptr_dir = 1;
        //stage = 1 walk
        this.stage = 1
    }
    update() {
        if (this.stage) {
            if (this.walk_cycle_ptr == 2) {
                this.walk_cycle_ptr_dir = -1;
            } else if (this.walk_cycle_ptr == 0) {
                this.walk_cycle_ptr_dir = 1;
            }
            this.walk_cycle_ptr = this.walk_cycle_ptr + this.walk_cycle_ptr_dir;
            this.current_sprite = this.walk_cycle_sprite[this.walk_cycle_ptr];
        }
    }
    draw() {
        ctx.drawImage(this.current_sprite, this.x, this.y);
    }
}
var then, now, elapsed, fpsInterval;
let object_list = new Array();
let main_char = new MainCharacterFieldSprite();
object_list.push(main_char);
function startAnimating(maxFPS) {
    fpsInterval = 1000 / maxFPS;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    ctx.font = "12px Courier";
    requestAnimationFrame(animate);

    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        console.log("i");
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (let i = 0; i < object_list.length; i++) {
            object_list[i].update();
        }
        for (let i = 0; i < object_list.length; i++) {
            object_list[i].draw();
        }
    }
}
startAnimating(5);