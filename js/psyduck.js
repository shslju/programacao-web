const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext('2d');
//pokemon constants
const WHITE = "rgb(255,255,255)"
const type_colors = ['#A8A77A',
    '#EE8130',
    '#6390F0',
    '#F7D02C',
    '#7AC74C',
    '#96D9D6',
    '#C22E28',
    '#A33EA1',
    '#E2BF65',
    '#A98FF3',
    '#F95587',
    '#A6B91A',
    '#B6A136',
    '#735797',
    '#6F35FC',
    '#705746',
    '#B7B7CE',
    '#D685AD'];
const NORMAL = 1;
const FIRE = 2;
const WATER = 3;
const GRASS = 4;
const ELECTRIC = 5;
const ICE = 6;
const FIGHTING = 7;
const POISON = 8;
const GROUND = 9;
const FLYING = 10;
const PSYCHIC = 11;
const BUG = 12;
const ROCK = 13;
const GHOST = 14;
const DRAGON = 15;
const DARK = 16;
const STEEL = 17;
const FAIRY = 18;

const type_matchups = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1],
[1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1,],
[1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1],
[1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1],
[1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 1],
[1, 0.5, 0.5, 1, 2, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0.5, 1],
[2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5],
[1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2],
[1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 1, 2, 1],
[1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 0.5, 1],
[1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1],
[1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5],
[1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5, 1],
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0],
[1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 0.5],
[1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2],
[1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1]]
const CANVAS_WIDTH = (canvas.width = 640);
const CANVAS_HEIGHT = (canvas.height = 480);

const main_char_walk_cycle_src = [
    '../img/gemu/1/char/psyduck/0.png',
    '../img/gemu/1/char/psyduck/1.png',
    '../img/gemu/1/char/psyduck/2.png'
]

//0-field
//1-battle
//3-result?
//4-fuck me
var game_state = 0
var game_stage = 0

/* 
    TO-DO LIST
    high priority-
    FINISH BATTLE SCENE 
    FINISH RANDOM ENCOUNTER SYSTEM
    medium priority-
    CREATE RANDOM ROCKS TO POPULATE GROUND
    CREATE RANDOM FOLIAGE TO POPULATE GROUND
    CREATE ANIMATED CLOUDS TO POPULATE SKY
    ctx.save();
  ctx.lineWidth = 5;
  for (i=0;i<60;i++){
    if (i%5!=0) {
      ctx.beginPath();
      ctx.moveTo(117,0);
      ctx.lineTo(120,0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI/30);
  }
  ctx.restore()
  useful code for later when creating particles for attack
*/
class Creature {
    // name needs to be string;
    constructor(name) {
        this.name = name;
        let sprites_src = [
            '../img/gemu/1/char/' + this.name + '/0.png',
            '../img/gemu/1/char/' + this.name + '/1.png',
            '../img/gemu/1/char/' + this.name + '/2.png'
        ]
        this.sprites = new Array();
        for (let i = 0; i < sprites_src.length; i++) {
            this.sprites.push(new Image());
            this.sprites[i].src = sprites_src[i];
        }
        this.current_sprite = this.sprites[0];
        this.in_scene = true;
        this.x = 340;
        this.y = 90;
    }
    update() {
    }
    draw() {
        if (this.in_scene) {
            ctx.drawImage(this.current_sprite, this.x, this.y);
        }

    }
}
function getEncounterByStage(gs) {
    let number_of_encounters = encounters[gs].length;
    let chosen_one = Math.floor(Math.random() * number_of_encounters);
    console.log(encounters)
    console.log(number_of_encounters)
    console.log(chosen_one)
    return encounters[gs][chosen_one];
}
function changeGameState(state) {
    let a = object_list.length;
    for (let i = 0; i < a; i++) {
        object_list.pop();
    }
    game_state = state;
    switch (state) {
        case 0:
            break;
        case 1:
            object_list.push(new BattleBgSprite());
            object_list.push(new battlePadSprite(70, 350));
            object_list.push(new battlePadSprite(300, 150));
            main_char = new MainCharacter();
            object_list.push(main_char);
            main_char.stage = 3;
            main_char.current_sprite = main_char.back_sprite;
            main_char.x = main_char.battle_x;
            main_char.y = main_char.battle_y;

            let encounter_name = getEncounterByStage(game_stage);
            object_list.push(new Creature(encounter_name));
            for (let i = 0; i < 4; i++) {
                object_list.push(new attackButton(390, 280 + (i * 40), main_char.attacks_list[i]));
            }

        default:
            break;
    }
}
function handleEncounter() {

    changeGameState(1);
}
class battlePadSprite {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.current_sprite = new Image();
        this.current_sprite.src = '../img/gemu/1/bg/battle_pad.png';
    }
    update() {
    }
    draw() {
        ctx.drawImage(this.current_sprite, this.x, this.y);
    }
}
const encounters = [['karp']]

class attackButton {
    constructor(x, y, attack) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 30;
        this.attack = attack;
        this.text = this.attack.name;
        this.color = type_colors[this.attack.type - 1];
        this.radius = 5;
        this.size = 23;
        this.text_width = 13 * this.text.length;
        this.selected = undefined;
        this.audio_hover = new Audio("../sfx/sfx-hover-attack-button.wav");
        this.audio_select = new Audio("../sfx/sfx-select-attack-button.wav")

        this.audio_played = false;
    }
    isInside() {
        this.selected = mousePos.x > this.x && mousePos.x < this.x + this.width && mousePos.y < this.y + this.height && mousePos.y > this.y;
    }
    update() {
        this.isInside()
        if (this.selected) {
            if (!this.audio_played) {
                let a = this.audio_hover.cloneNode();
                a.play();
                this.audio_played = true;
            }
        } else {
            this.audio_played = false;

        }
    }
    exec_action() {
        switch (this.action[0]) {
            case 0:
                let a = object_list.length;
                for (let i = 0; i < a; i++) {
                    object_list.pop();
                }
                object_list.push(new DialogueSprite(dialogue_list[this.action[1]]))
                break;
            case 1:
                window.location.href = this.action[1];
                break;
            default:
                return 0;
        }
    }
    mouse_handler() {
        this.isInside()
        if (this.selected) {
            this.audio_select.play();
            this.exec_action();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
        ctx.fillStyle = this.color;
        ctx.fill();
        this.draw_text();
    }
    draw_text() {
        ctx.fillStyle = WHITE;
        ctx.font = "21px Courier";
        ctx.fillText(this.text, this.x + (this.width / 10), this.y + (this.height / 2) + 6);
    }
}
class BattleBgSprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.current_sprite = new Image();
        this.current_sprite.src = '../img/gemu/1/bg/battle-bg.png';
    }
    update() {
    }
    draw() {
        ctx.drawImage(this.current_sprite, this.x, this.y);
    }
}

class SkySprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        /* this.walk_cycle_sprite = new Array();
        for (let i = 0; i < main_char_walk_cycle_src.length; i++) {
            this.walk_cycle_sprite.push(new Image(200, 200));
            this.walk_cycle_sprite[i].src = main_char_walk_cycle_src[i];
        } */
        this.current_sprite = new Image();
        this.current_sprite.src = '../img/gemu/1/bg/alpha_sky.png';
        //stage = 1 walk
        this.stage = 1
    }
    update() {
    }
    draw() {
        ctx.drawImage(this.current_sprite, this.x, this.y);
    }
}


class attBubbleSprite {
    constructor() {
        this.x = 380;
        this.y = 170;
        this.sprite = new Image();
        this.sprite.src = '../img/gemu/1/att-icon.png'
        this.sound_played = false;
        this.sound = new Audio("../sfx/sfx-encounter-sound.wav");
    }
    update() {
        if (!this.sound_played) {
            this.sound.cloneNode().play();
            this.sound_played = true;
        }
    }
    draw() {
        ctx.drawImage(this.sprite, this.x, this.y);
    }
}
class GroundSprite {
    constructor() {
        this.x = 0;
        this.y = 320;
        this.current_sprite = new Image();
        this.current_sprite.src = '../img/gemu/1/bg/alpha_ground.png';
    }
    update() {
    }
    draw() {
        ctx.drawImage(this.current_sprite, this.x, this.y);
    }
}

class Attack {
    constructor(name, type, power, is_phys) {
        this.name = name;
        this.type = type;
        this.power = power;
        this.is_phys = is_phys;
    }
}
class MainCharacter {
    constructor() {
        this.x = 225;
        this.y = 180;
        this.battle_x = 110;
        this.battle_y = 230;
        this.walk_cycle_sprite = new Array();
        for (let i = 0; i < main_char_walk_cycle_src.length; i++) {
            this.walk_cycle_sprite.push(new Image(200, 200));
            this.walk_cycle_sprite[i].src = main_char_walk_cycle_src[i];
        }
        this.current_sprite = this.walk_cycle_sprite[0];
        this.att_sprite = new Image();
        this.att_sprite.src = '../img/gemu/1/char/psyduck/att.png'
        this.back_sprite = new Image();
        this.back_sprite.src = '../img/gemu/1/char/psyduck/btl-0.png';
        this.walk_cycle_ptr = 0;
        this.walk_cycle_ptr_dir = 1;
        //ataques
        this.attacks_list = new Array();
        this.attacks_list.push(new Attack("Scratch", NORMAL, 40, true));
        this.attacks_list.push(new Attack("Water Gun", WATER, 40, false));
        this.attacks_list.push(new Attack("Confusion", PSYCHIC, 50, false));
        this.attacks_list.push(new Attack("Mud Shot", GROUND, 55, false));
        this.attack_stat = 114
        this.sp_attack_stat = 128
        //stage = 1 walk
        //stage = 2 attention
        //stage = 3 battle back
        //stage
        this.stage = 1
    }
    update() {
        if (this.stage == 1) {
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
let main_char = new MainCharacter();
object_list.push(new SkySprite());
object_list.push(new GroundSprite());
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
        if (game_state == 0) {
            let chance = Math.floor(Math.random() * 101);
            if (chance <= 50) {
                handleEncounter();
            }
        }

        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (let i = 0; i < object_list.length; i++) {
            object_list[i].update();
        }
        for (let i = 0; i < object_list.length; i++) {
            object_list[i].draw();
        }
        console.log(toString(game_stage));
        let texty = "stage " + toString(game_stage);
        ctx.fillText(texty, 0, 10);
    }
}
startAnimating(5);
var mousePos = {
    x: undefined,
    y: undefined
}
canvas.addEventListener("mousemove", function (evt) {
    var rect = canvas.getBoundingClientRect();
    let x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    let y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    mousePos.x = x;
    mousePos.y = y;
})
canvas.addEventListener("click", function (evt) {
    for (let i = 0; i < object_list.length; i++) {
        object_list[i].mouse_handler();
    }
});
