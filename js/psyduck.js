const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext('2d');
const fps = 30;
//colors
const WHITE = "rgb(255,255,255)";
const BLACK = "rgb(0,0,0)";
const GRAY = "rgb(69,69,69)";
const BLUE = "rgb(49,151,255)";
const LIGHT_GRAY = "rgb(211,211,211)";
const LIGHT_BLUE = "rgb(153,217,234)";
// what layer is currently beign displayed
var layer = 0;
//pokemon constants
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

// hit_animation load
const main_char_game_over_sprite = new Image();
main_char_game_over_sprite.src = '../img/gemu/1/char/psyduck/go-0.png';
const hit_animation_src = [
    '../img/gemu/1/misc/hit0-0.png',
    '../img/gemu/1/misc/hit0-1.png',
    '../img/gemu/1/misc/hit0-2.png',
    '../img/gemu/1/misc/hit0-3.png'
];
const sleep_cycle_src = [
    '../img/gemu/1/char/psyduck/ts-1.png',
    '../img/gemu/1/char/psyduck/ts-2.png'
]
var sleep_cycle_animation = [new Image(), new Image()];
for (let i = 0; i < 2; i++) {
    sleep_cycle_animation[i].src = sleep_cycle_src[i];
}
var wake_up_sprite = new Image();
wake_up_sprite.src = '../img/gemu/1/char/psyduck/ts-4.png';
var hit_animation = [new Image(), new Image(), new Image(), new Image()];
for (let i = 0; i < 4; i++) {
    hit_animation[i].src = hit_animation_src[i];
}
// battle pad sprite load
let battle_pad_sprite = new Image();
battle_pad_sprite.src = '../img/gemu/1/bg/battle_pad.png';

let cut_in_bg = new Image();
cut_in_bg.src = '../img/gemu/1/misc/cutin.png';

const main_char_walk_cycle_src = [
    '../img/gemu/1/char/psyduck/0.png',
    '../img/gemu/1/char/psyduck/1.png',
    '../img/gemu/1/char/psyduck/2.png'
]
var main_char_victory_dance_sprites = [new Image(), new Image(), new Image()];
main_char_victory_dance_sprites[0].src = '../img/gemu/1/char/psyduck/vtr-0.png';
main_char_victory_dance_sprites[1].src = '../img/gemu/1/char/psyduck/vtr-1.png';
main_char_victory_dance_sprites[2].src = '../img/gemu/1/char/psyduck/vtr-2.png';
/*
const main_char_victory_dance_src = [
    '../img/gemu/1/char/psyduck/vtr-0.png',
    '../img/gemu/1/char/psyduck/vtr-1.png',
    '../img/gemu/1/char/psyduck/vtr-2.png'
]
*/
const cutin_animation_boxes_initial_pos = [[550, 140],
[615, 200],
[540, 240],
[480, 200],
[430, 160],
[290, 140],
[210, 133],
[180, 177],
[166, 247],
[67, 226],
[-60, 130],
[-40, 243]]

const attack_animation_boxes_initial_pos = [[49, 115],
[123, 451],
[281, 460],
[477, 467],
[107, 360],
[203, 401],
[341, 434],
[495, 403],
[581, 424],
[53, 266],
[162, 311],
[249, 300],
[425, 282],
[542, 289],
[206, 172],
[245, 219],
[351, 213],
[428, 157],
[506, 186],
[584, 204],
[60, 116],
[154, 79],
[480, 102],
[560, 102],
[47, 2],
[107, 33],
[229, 21],
[343, 31],
[442, 17],
[543, 19]
]

let creature_list = [
    [
        { name: 'karp', type1: WATER, type2: WATER, df: 103, sp_df: 40 },
        { name: 'tyrogue', type1: FIGHTING, type2: FIGHTING, df: 67, sp_df: 67 },
        { name: 'magby', type1: FIRE, type2: FIRE, df: 71, sp_df: 103 }
    ],
    [
        { name: 'floette', type1: FAIRY, type2: FAIRY, df: 89, sp_df: 189 },
    ]]
/*full creature list should only be added when all assets are drawn
let creature_list = [
    [
        { name: 'karp', type1: WATER, type2: WATER, df: 103, sp_df: 40 },
        { name: 'tyrogue', type1: FIGHTING, type2: FIGHTING, df: 67, sp_df: 67 },
        { name: 'magby', type1: FIRE, type2: FIRE, df: 71, sp_df: 103 }
    ],
    [
        { name: 'floette', type1: FAIRY, type2: FAIRY, df: 89, sp_df: 189 },
        { name: 'boldore', type1: ROCK, type2: ROCK, df: 193, sp_df: 76 },
        { name: 'fletchinder', type1: FIRE, type2: FLYING, df: 103, sp_df: 98 }
    ],
    [
        { name: 'galvantula', type1: BUG, type2: ELECTRIC, df: 112, sp_df: 112 },
        { name: 'gardevoir', type1: PSYCHIC, type2: FAIRY, df: 121, sp_df: 211 },
        { name: 'camerupt', type1: FIRE, type2: GROUND, df: 130, sp_df: 139 }
    ]]
*/

//-1 for title screen
var game_state = -1;
var game_stage = 0;
var game_encounter = 0;
/* 
    TO-DO LIST
    high priority-
    
    VICTORY SCREEN 
    GAME OVER SCREEN
    GAME END SCREEN

    medium-high priority

        MAKE SO THAT ALL IMAGES ARE LOADED AT BEGINNING 
        EMOLGA ALLY COMPANION - WILL HELP YOU MAKE DECISIONS
    medium priority- things to do after both games are done
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
class BoxesForAnimation {
    constructor(x, y, type, width, height, speed, color) {
        this.x = x;
        this.y = y;
        //1 for x animation;
        //0 for y animation;
        this.type = type;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
        this.anim_cont = 0;
    }
    update() {
        if (this.type) {
            this.x -= this.speed;
        } else {
            this.y -= this.speed;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }
}
//i separated this from cutin bg sprite so i could draw this in a upper layer
class CutInCreatureSprite {
    constructor(creature_sprite) {
        this.creature_sprite = creature_sprite;
        this.creature_x = 0;
        this.creature_y = 105;
        this.visible = true;
    }
    update() {
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.creature_sprite, this.creature_x, this.creature_y);
        }
    }
}
class CutInBgSprite {
    constructor(creature_sprite) {

        this.bg = cut_in_bg;
        this.bg_x = 0;
        this.creature_sprite = creature_sprite;
        this.bg_y = 100;
        this.height = 160;
        this.anim_cont = 1;
        this.finished = false;
        this.visible = true;
    }
    update() {
    }
    draw() {
        if (this.visible) {
            console.log(this.anim_cont);
            if (this.anim_cont < 11) {
                ctx.beginPath();
                ctx.fillStyle = BLUE;
                ctx.rect(0, this.bg_y + (this.height / 2) - (this.anim_cont * 8), 640, this.anim_cont * 16);
                ctx.fill();
                // create little boxes for animation in final frame of white thingy;
                if (this.anim_cont == 10) {
                    createAnimationBoxesFromPositionList(cutin_animation_boxes_initial_pos, 1, 90, 5, 5, LIGHT_BLUE);
                    layer1.push(new CutInCreatureSprite(this.creature_sprite));
                }
            } else if (this.anim_cont < 41) {
                ctx.drawImage(this.bg, this.bg_x, this.bg_y);
            } else {
                this.finished = true;
                for (let i = 0; i < cutin_animation_boxes_initial_pos.length; i++) {
                    layer0.pop();
                }
                emptyLayer(1);
                this.visible = false;
                changeGameState(5);
            }
            this.anim_cont++;
        }
    }
}
class Creature {
    constructor(name, type1, type2, df, sp_df) {
        this.name = name;
        console.log(this.name);
        let sprites_src = [
            '../img/gemu/1/char/' + this.name + '/0.png',
            '../img/gemu/1/char/' + this.name + '/1.png',
            '../img/gemu/1/char/' + this.name + '/2.png'
        ]
        console.log(sprites_src);
        this.type1 = type1;
        this.type2 = type2;
        this.defense_stat = df;
        this.sp_defense_stat = sp_df;
        this.sprites = new Array();
        for (let i = 0; i < sprites_src.length; i++) {
            this.sprites.push(new Image());
            this.sprites[i].src = sprites_src[i];
        }
        this.current_sprite = this.sprites[0];
        this.visible = true;
        this.normal_x = 340;
        this.normal_y = 80;
        this.attack_anim_x = 230;
        this.attack_anim_y = 140;
        this.victory_x = 170;
        this.victory_y = 190;
        this.x = this.normal_x;
        this.y = this.normal_y;
        this.state = 0;
        this.anim_cont = 0;
        this.interactable = false;

    }
    changeState(state) {
        this.state = state;
        this.anim_cont = 0;
        switch (state) {
            case 0:
                this.current_sprite = this.sprites[0]
                this.changeCoordinates(this.normal_x, this.normal_y);
                break;
            case 1:
                this.current_sprite = this.sprites[0];
                this.changeCoordinates(this.attack_anim_x, this.attack_anim_y);
                break;
            case 2:
                this.current_sprite = this.sprites[1];
                this.changeCoordinates(this.victory_x, this.victory_y);
            default:
                break;
        }
    }
    changeCoordinates(new_x, new_y) {
        this.x = new_x;
        this.y = new_y;
    }
    update() {
        if (this.state == 1) {
            if (this.anim_cont == 30) {
                object_list[0].push(new CutInBgSprite(this.sprites[2]));
            }
            this.anim_cont++;
        }
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.current_sprite, this.x, this.y);
        }

    }
}
function createAnimationBoxesFromPositionList(list, x_or_y, width, height, speed, color) {
    for (let i = 0; i < list.length; i++) {
        layer0.push(new BoxesForAnimation(list[i][0], list[i][1], x_or_y, width, height, speed, color));
    }
}

function getEncounterByStage(gs) {
    let number_of_encounters = creature_list[gs].length;
    game_encounter = Math.floor(Math.random() * number_of_encounters);
    return creature_list[gs][game_encounter];
}

/*Remove todos os objetos de uma dada layer*/
function emptyLayer(layer) {
    let a = object_list[layer].length;
    for (let i = 0; i < a; i++) {
        object_list[layer].pop();
    }
}

function setUpGameOverScene() {
    object_list[0].push(new ColorBg(BLACK));
    main_char = new MainCharacter();
    main_char.changeState(5);
    object_list[0].push(main_char);
    object_list[0].push(new ContinueButton(262, 400, 0, LIGHT_GRAY, WHITE));
    object_list[0].push(new OverlayText("GAME OVER", 55, 85, "90", 9999));

}
function setUpEnemyAttackScene() {
    object_list[0].push(battle_bg);
    object_list[0].push(new battlePadSprite(190, 200));
    let encounter_creature = creature_list[game_stage][game_encounter];
    let creature = new Creature(encounter_creature.name, encounter_creature.type1, encounter_creature.type2, encounter_creature.df, encounter_creature.sp_df)
    object_list[0].push(creature);
    creature.changeState(1);
}
function setUpFailAttackScene() {
    object_list[0].push(battle_bg);
    main_char = new MainCharacter();
    createAnimationBoxesFromPositionList(attack_animation_boxes_initial_pos, 0, 5, 90, 1, WHITE);
    object_list[1].push(main_char);
    main_char.changeState(3);
}
function setUpBattleScene() {
    object_list[0].push(battle_bg);
    object_list[0].push(new battlePadSprite(70, 350));
    object_list[0].push(new battlePadSprite(300, 150));
    main_char = new MainCharacter();
    object_list[0].push(main_char);
    main_char.changeState(1);

    //create the creature object the add it to the list
    let encounter_creature = getEncounterByStage(game_stage);
    object_list[0].push(new Creature(encounter_creature.name, encounter_creature.type1, encounter_creature.type2, encounter_creature.df, encounter_creature.sp_df));
    // create the damage array then get the index of the highest damage value choice
    damage_list = new Array();
    for (let i = 0; i < 4; i++) {
        let j = getDamageCalc(main_char.attacks_list[i], main_char, encounter_creature);
        console.log(j);
        damage_list.push(j);
    }
    console.log(damage_list);
    let correct_i = getCorrectChoice(damage_list);
    let correct = false;
    // create the attack buttons with info if they are the correct choice or not
    for (let i = 0; i < 4; i++) {
        if (i == correct_i) {
            correct = true;
        } else {
            correct = false;
        }
        object_list[0].push(new attackButton(390, 280 + (i * 40), main_char.attacks_list[i], correct));
    }
}
function setUpVictoryScene() { //-110
    object_list[0].push(battle_bg);
    object_list[0].push(new battlePadSprite(180, 250));

    let encounter_creature = creature_list[game_stage][game_encounter];
    let creature = new Creature(encounter_creature.name, encounter_creature.type1, encounter_creature.type2, encounter_creature.df, encounter_creature.sp_df);
    creature.changeState(2);
    object_list[0].push(creature);

    main_char = new MainCharacter();
    main_char.changeState(6);
    object_list[0].push(main_char);

    object_list[0].push(new OverlayText("Sucesso", 180, 80, "90", 9999));
    object_list[0].push(new ContinueButton(480, 360, 1, type_colors[GRASS - 1], BLACK));
}
function setUpFieldScene() {
    layer0.push(new SkySprite());
    layer0.push(new GroundSprite());
    main_char = new MainCharacter();
    main_char.changeState(0)
    layer0.push(main_char);


}
function setUpAttackAnimScene() {
    layer0.push(new ColorBg(BLACK));
    layer0.push(new attackAnimation());
}
function setUpChargeAttackScene() {
    object_list[0].push(battle_bg);
    main_char = new MainCharacter();
    createAnimationBoxesFromPositionList(attack_animation_boxes_initial_pos, 0, 5, 90, 1, WHITE);
    object_list[1].push(main_char);
    main_char.changeState(2);
}
function getDamageCalc(attack, char, oppose) {
    let level = 50;
    let level_scale = ((2 * level) / 5) + 2;
    let stab = 1;
    if (attack.is_phys) {
        a = char.attack_stat;
        d = oppose.df;
    } else {
        a = char.sp_attack_stat;
        d = oppose.sp_df;
    }
    if (attack.type == char.type_one || attack.type == char.type_two) {
        stab = 1.5
    }
    console.log(stab);

    type = type_matchups[attack.type - 1][oppose.type1 - 1] * type_matchups[attack.type - 1][oppose.type2 - 1];

    let start = level_scale * attack.power * (a / d);
    start = (start / 50 + 2);
    return start * stab * type;
}
//ningning me ajude
function setUpTitleScreen(ningning) {
    if (ningning) {
        main_char = new MainCharacter();
        main_char.changeState(9);
        layer0.push(main_char);
    } else {
        main_char = new MainCharacter();
        main_char.changeState(8);
        layer0.push(new InteractableIndicator(295, 80));
        layer0.push(main_char);
    }

}

/*Dado uma array com os danos essa função retorn o indice do maior*/
function getCorrectChoice(damage_list) {
    maior = damage_list[0];
    indice_maior = 0;
    for (let i = 0; i < 4; i++) {
        if (damage_list[i] > maior) {
            maior = damage_list[i];
            indice_maior = i;
        }
    }
    return indice_maior;
}
function changeGameState(state) {
    emptyLayer(0);
    emptyLayer(1);
    game_state = state;
    switch (state) {
        case -1:
            setUpTitleScreen(0);
            break;
        case 0:
            setUpFieldScene();
            break;
        case 1: //change scene to battle
            setUpBattleScene();
            break;
        case 2: //change scene to psyduck sucessful anim
            setUpChargeAttackScene();
            break;
        case 3: //change scene to psyduck fail anim
            setUpFailAttackScene();
            break;
        case 4: //change scene to enemy attack anim
            setUpEnemyAttackScene();
            break;
        case 5:
            setUpGameOverScene();
            break;
        case 6:
            setUpVictoryScene();
            break;
        case 7:
            setUpAttackAnimScene();
            break;
        default:
            break;
    }
}
function handleEncounter() {
    changeGameState(1);
}
class OverlayText {
    constructor(text, x, y, size, timer) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.size = size;
        // this timer determines how many frames the text will be active on screen;
        this.timer = timer;
        this.anim_cont = 0;
        this.visible = true;
        this.interactable = false;
    }
    update() {
        if (this.anim_cont > this.timer) {
            this.visible = false;
        }
    }
    draw() {
        if (this.visible) {
            ctx.font = this.size + "px Arial Italic";
            ctx.strokeStyle = WHITE;
            ctx.lineWidth = 3;
            ctx.lineJoin = "round";//can be bevel or round
            ctx.miterLimit = 2;
            ctx.strokeText(this.text, this.x, this.y);
            ctx.fillStyle = WHITE;
            ctx.fillText(this.text, this.x, this.y);
        }
        this.anim_cont++;

    }
}
class battlePadSprite {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.current_sprite = battle_pad_sprite;
        this.interactable = false;
        this.visible = true;
    }
    update() {
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.current_sprite, this.x, this.y);
        }

    }
}
class ContinueButton {
    constructor(x, y, g_or_v, color, stroke_color) {
        this.x = x;
        this.y = y;
        this.width = 110;
        this.height = 40;
        this.text = "Continuar"
        this.is_victory_screen = g_or_v;
        this.stroke_color = stroke_color;
        this.color = color;
        this.radius = 10;
        this.size = 23;
        this.selected = undefined;
        this.audio_hover = new Audio("../sfx/sfx-hover-attack-button.wav");
        this.audio_select = new Audio("../sfx/sfx-select-attack-button.wav")
        this.interactable = true;
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
        if (this.is_victory_screen) {
            game_stage++;
            if (game_stage == 4) {
                //end-game;
            }
        } else {
            game_stage = 0;
        }
        changeGameState(0);

    }
    mouse_handler() {
        this.isInside()
        console.log(this.selected);
        if (this.selected) {
            this.audio_select.play();
            this.exec_action();
        }
    }
    draw() {
        if (this.selected) {
            ctx.beginPath();
            ctx.roundRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4, this.radius);
            ctx.fillStyle = this.stroke_color;
            ctx.fill();

        }
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
        ctx.fillStyle = this.color;
        ctx.fill();
        this.draw_text();
    }
    draw_text() {
        ctx.font = "21px Arial";
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";//can be bevel or round
        ctx.miterLimit = 2;
        ctx.strokeText(this.text, this.x + (this.width / 10), this.y + (this.height / 2) + 7);
        ctx.fillStyle = WHITE;
        ctx.fillText(this.text, this.x + (this.width / 10), this.y + (this.height / 2) + 7);
    }
}
class attackButton {
    constructor(x, y, attack, choice) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 30;
        this.attack = attack;
        this.text = this.attack.name;
        this.color = type_colors[this.attack.type - 1];
        this.correct = choice
        this.radius = 10;
        this.size = 23;
        this.text_width = 13 * this.text.length;
        this.selected = undefined;
        this.audio_hover = new Audio("../sfx/sfx-hover-attack-button.wav");
        this.audio_select = new Audio("../sfx/sfx-select-attack-button.wav")
        this.interactable = true;
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
        if (this.correct) {
            changeGameState(2);
        } else {
            changeGameState(3);
        }

    }
    mouse_handler() {
        this.isInside()
        console.log(this.selected);
        if (this.selected) {
            this.audio_select.play();
            this.exec_action();
        }
    }
    draw() {
        if (this.selected) {
            ctx.beginPath();
            ctx.roundRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4, this.radius);
            ctx.fillStyle = BLACK;
            ctx.fill();

        }
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
        ctx.fillStyle = this.color;
        ctx.fill();
        this.draw_text();
    }
    draw_text() {
        ctx.font = "21px Arial";
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";//can be bevel or round
        ctx.miterLimit = 2;
        ctx.strokeText(this.text, this.x + (this.width / 10), this.y + (this.height / 2) + 7);
        ctx.fillStyle = WHITE;
        ctx.fillText(this.text, this.x + (this.width / 10), this.y + (this.height / 2) + 7);
    }
}
class ColorBg {
    constructor(color) {
        this.x = 0;
        this.y = 0;
        this.color = color;
        this.interactable = false;
        this.visible = true;
    }
    update() {
    }
    draw() {
        if (this.visible) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fill();
        }

    }
}
class BattleBgSprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.current_sprite = new Image();
        this.current_sprite.src = '../img/gemu/1/bg/battle-bg.png';
        this.interactable = false;
        this.visible = true;
    }
    update() {
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.current_sprite, this.x, this.y);
        }

    }
}
class SkySprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.current_sprite = new Image();
        this.current_sprite.src = '../img/gemu/1/bg/alpha_sky.png';
        this.interactable = false;
    }
    update() {
    }
    draw() {
        ctx.drawImage(this.current_sprite, this.x, this.y);
    }
}
class attackAnimation {
    constructor() {
        this.sprites = hit_animation;
        this.current_sprite_ptr = 0;
        this.current_sprite = this.sprites[this.current_sprite_ptr];
        this.x = 130
        this.y = 100
        this.anim_cont = -5;
        this.interactable = false;
        this.visible = true;
        this.finished = false;
    }
    update() {
        if (this.anim_cont % 6 == 0 && this.current_sprite_ptr < 4) {
            console.log("anim cont:" + this.anim_cont);
            console.log("ptr: " + this.current_sprite_ptr);

            this.current_sprite = this.sprites[this.current_sprite_ptr];
            this.current_sprite_ptr++;
            this.anim_cont = -2;
        }
        if (this.current_sprite_ptr >= 3 && this.anim_cont == 0) {
            this.finished = true;
            this.visible = false;
            changeGameState(6);
        }
        this.anim_cont++;
    }
    draw() {
        if (this.visible) {
            console.log(this.current_sprite);
            ctx.drawImage(this.current_sprite, this.x, this.y);
        }
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
        this.interactable = false;
    }
    update() {
        if (!this.sound_played) {
            this.sound.cloneNode().play();
            this.sound_played = true;
        }
    }
    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, 70, 70);
    }
}
class GroundSprite {
    constructor() {
        this.x = 0;
        this.y = 320;
        this.current_sprite = new Image();
        this.current_sprite.src = '../img/gemu/1/bg/alpha_ground.png';
        this.interactable = false;
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
        this.interactable = false;
    }
}
class MainCharacter {
    constructor() {
        this.field_x = 225;
        this.field_y = 180;
        this.x = this.field_x;
        this.y = this.field_y;
        this.battle_x = 110;
        this.battle_y = 230;
        this.attack_anim_x = 135;
        this.attack_anim_y = 100;
        this.victory_dance_x = 290;
        this.victory_dance_y = 136;
        this.game_over_x = 115;
        this.game_over_y = 40;
        // sprite import and creation;
        // since i am creating a new character object all the time, maybe already import sprites at beginning of execution and then just assign here...
        this.walk_cycle_sprite = new Array();
        for (let i = 0; i < main_char_walk_cycle_src.length; i++) {
            this.walk_cycle_sprite.push(new Image(200, 200));
            this.walk_cycle_sprite[i].src = main_char_walk_cycle_src[i];
        }
        this.current_sprite = this.walk_cycle_sprite[0];
        this.attention_sprite = new Image();
        this.attention_sprite.src = '../img/gemu/1/char/psyduck/att.png'
        this.back_sprite = new Image();
        this.back_sprite.src = '../img/gemu/1/char/psyduck/btl-0.png';
        this.attack_sprite = new Image();
        this.attack_sprite.src = '../img/gemu/1/char/psyduck/btl-1.png';
        this.attack_fail_sprite = new Image();
        this.attack_fail_sprite.src = '../img/gemu/1/char/psyduck/btl-2.png';
        this.game_over_sprite = main_char_game_over_sprite;
        this.victory_dance_sprites = main_char_victory_dance_sprites;
        this.sleep_cycle = sleep_cycle_animation;
        this.wake_up_sprite = wake_up_sprite;
        this.current_sprite_ptr = 0;
        this.current_sprite_ptr_dir = 1;
        //ataques
        this.attacks_list = new Array();
        this.attacks_list.push(new Attack("Scratch", NORMAL, 40, true));
        this.attacks_list.push(new Attack("Water Gun", WATER, 40, false));
        this.attacks_list.push(new Attack("Confusion", PSYCHIC, 50, false));
        this.attacks_list.push(new Attack("Mud Shot", GROUND, 55, false));
        this.attack_stat = 98;
        this.sp_attack_stat = 121;
        this.visible = true;
        this.interactable = false;
        this.type_one = WATER;
        this.type_two = WATER;
        this.state = 0
        this.anim_cont = 0;
    }
    update() {
        if (this.state == 0) {
            if (this.anim_cont % 6 == 0) {
                if (this.current_sprite_ptr == 2) {
                    this.current_sprite_ptr_dir = -1;
                } else if (this.current_sprite_ptr == 0) {
                    this.current_sprite_ptr_dir = 1;
                }
                this.current_sprite_ptr = this.current_sprite_ptr + this.current_sprite_ptr_dir;
                this.current_sprite = this.walk_cycle_sprite[this.current_sprite_ptr];
            }
            this.anim_cont++;
            if (this.anim_cont > 1000) {
                this.anim_cont = 0;
            }
        } else if (this.state == 2) {
            if (this.y > 30) {
                this.y--;
            } else if (this.y == 30) {
                changeGameState(7);
            }
        } else if (this.state == 3) {
            if (this.y > 30) {
                this.y--;
            } else if (this.y == 30) {
                //play fail sound
                this.current_sprite = this.attack_fail_sprite;
                this.anim_cont++;
                if (this.anim_cont > 40) {
                    changeGameState(4);
                }

            }
        } else if (this.state == 4) {
            this.anim_cont++;
            if (this.anim_cont >= 30) {
                handleEncounter();
            }
        } else if (this.state == 5) {
            if (this.anim < 20) {
                this.y++;
                this.anim++;
            } else if (this.anim < 40) {
                this.y--;
                this.anim++;
            } else {
                this.anim = 0;
            }
        } else if (this.state == 6) {
            if (this.anim_cont % 6 == 0) {
                if (this.current_sprite_ptr == 2) {
                    this.current_sprite_ptr_dir = -1;
                } else if (this.current_sprite_ptr == 0) {
                    this.current_sprite_ptr_dir = 1;
                }
                this.current_sprite_ptr = this.current_sprite_ptr + this.current_sprite_ptr_dir;
                this.current_sprite = this.victory_dance_sprites[this.current_sprite_ptr];
            }
            this.anim_cont++;
            if (this.anim_cont > 1000) {
                this.anim_cont = 0;
            }
        } else if (this.state == 8) {
            if (this.anim_cont % 20 == 0) {
                if (this.current_sprite_ptr == 1) {
                    this.current_sprite_ptr_dir = -1;
                } else if (this.current_sprite_ptr == 0) {
                    this.current_sprite_ptr_dir = 1;
                }
                this.current_sprite_ptr = this.current_sprite_ptr + this.current_sprite_ptr_dir;
                this.current_sprite = this.sleep_cycle[this.current_sprite_ptr];
            }
            this.anim_cont++;
            if (this.anim_cont > 1000) {
                this.anim_cont = 0;
            }
        } else if (this.state == 9) {
            this.anim_cont++;
            if (this.anim_cont >= 30) {
                changeGameState(0);
            }
        }
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.current_sprite, this.x, this.y);
        }

    }
    changeCoordinates(new_x, new_y) {
        this.x = new_x;
        this.y = new_y;
    }
    changeState(state) {
        this.state = state;
        this.anim_cont = 0;
        switch (state) {
            case 0:
                this.current_sprite = this.walk_cycle_sprite[0]
                this.changeCoordinates(this.field_x, this.field_y);
                break;
            case 1:
                this.current_sprite = this.back_sprite;
                this.changeCoordinates(this.battle_x, this.battle_y);
                break;
            case 2:
                this.current_sprite = this.attack_sprite;
                this.changeCoordinates(this.attack_anim_x, this.attack_anim_y);
                break;
            case 3:
                this.current_sprite = this.attack_sprite;
                this.changeCoordinates(this.attack_anim_x, this.attack_anim_y)
                break;
            case 4:
                this.current_sprite = this.attention_sprite;
                this.changeCoordinates(this.field_x, this.field_y);
                break;
            case 5:
                this.current_sprite = this.game_over_sprite;
                this.changeCoordinates(this.game_over_x, this.game_over_y);
                break;
            case 6:
                this.current_sprite = this.victory_dance_sprites[0];
                this.changeCoordinates(this.victory_dance_x, this.victory_dance_y);
                break;
            case 8:
                this.current_sprite = this.sleep_cycle[0];
                this.changeCoordinates(0, 0);
            case 9:
                this.current_sprite = this.wake_up_sprite;
                this.changeCoordinates(0, 0);
            default:
                break;
        }
    }
}
class InteractableIndicator {
    constructor(x, y) {
        this.sprite = new Image();
        this.sprite.src = "img/gemu/0/confirm.svg";
        this.x = x;
        this.y = y;
        this.anim = 0;
        this.visible = true;
        this.interactable = false;
    }
    update() {
        if (this.anim < 5) {
            this.y++;
            this.anim++;
        } else if (this.anim < 10) {
            this.y--;
            this.anim++;
        } else {
            this.anim = 0;
        }
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.sprite, this.x, this.y, 40, 40);
        }
    }
}

function startAnimating(maxFPS) {
    fpsInterval = 1000 / maxFPS;
    then = Date.now();
    startTime = then;
    console.log
    animate();
}
/*
this function is called every frame and will test for an ecnounter,
if an encounter is triggered handleEncounter() is called
*/
function encounterChance() {
    //field
    if (game_state == 0) {
        let chance = Math.floor(Math.random() * 101);
        if (chance < 2) {
            game_state = -2;
            layer0.push(new attBubbleSprite());
            main_char.changeState(4);
        }
    }
}
// this funciton uses the object list and calls update and draw for all of them
function updateAndDrawAllobjects(object_listx) {
    for (let i = 0; i < object_listx.length; i++) {
        object_listx[i].update();
    }
    for (let i = 0; i < object_listx.length; i++) {
        object_listx[i].draw();
    }
}
// i created this in case i want to draw some info on screen
function infoForMe() {
    let texty = "stage " + game_stage;
    ctx.fillText(texty, 10, 20);
}
/*
this function will check if enough time has been elapsed since last
frame to check if a new one should be generated 
*/
function canGetNewFrame() {
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        return true;
    } else {
        return false;
    }
}
function updateTimeElapsedSinceLastFrame() {
    then = now - (elapsed % fpsInterval);
}

function animate() {
    ctx.font = "12px Courier";
    requestAnimationFrame(animate);
    if (canGetNewFrame()) {
        encounterChance();
        updateTimeElapsedSinceLastFrame();
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        console.log(object_list[0]);
        updateAndDrawAllobjects(object_list[0]);
        updateAndDrawAllobjects(object_list[1]);
        //infoForMe();
    }
}

// start of runtime
const battle_bg = new BattleBgSprite();

var then, now, elapsed, fpsInterval;
var mousePos = {
    x: undefined,
    y: undefined
}

let object_list = new Array();
// layer that should always be used
let layer0 = new Array();
// layer for when i dont want to erase scene
let layer1 = new Array();

object_list.push(layer0);
object_list.push(layer1);
let main_char = undefined;

setUpTitleScreen(0);
startAnimating(fps);

canvas.addEventListener("mousemove", function (evt) {
    var rect = canvas.getBoundingClientRect();
    let x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    let y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    mousePos.x = x;
    mousePos.y = y;
})

canvas.addEventListener("click", function (evt) {
    if (game_state == -1) {
        emptyLayer(0);
        setUpTitleScreen(1);
    } else {
        for (let i = 0; i < object_list[0].length; i++) {
            if (object_list[0][i].interactable) {
                object_list[0][i].mouse_handler();
            }
        }
    }
});
