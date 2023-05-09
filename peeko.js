const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 640;
const CANVAS_HEIGHT = canvas.height = 480;
const maxFPS = 15;
var then, now, elapsed, fpsInterval;
const textSpeed = 0.06;
let lines = [["odiando muito minha vida","kkkkkkk meu deus!!","100 thieves fundo de quintal!!"],["viva shslmoiry","maybe i like maroqs"]];

let character_sprite = new Image();
character_sprite.src = 'img/gemu/0/0-1.webp';

class TextBox {
    constructor(text){
        this.text = text;
        this.x = 222;
        this.y = 48;
        this.last_x = this.x;
        this.last_y = this.y;
        this.num_boxes = this.text.length;
        this.current_text = "";
        this.dialogue_ptr = 0;
        this.line_ptr = 0;
        this.txt_pointer = 0;
        this.timer=0;
        this.list_char = new Array();
        this.end_enable = false;
        this.blip_sound_effect = new Audio("./sfx/sfx-blipmale.wav");
        this.blip_sound_effect.volume = 0.01;
    }
    update(){
        if (!this.end_enable){
            this.timer++;
            if(this.timer%2==0 ){
                this.add_character_to_draw();
            }
        }

    }
    add_character_to_list(char, x, y){
        this.blip_sound_effect.cloneNode().play();
        let item = [char, x, y];
        this.list_char.push(item);
    }
    add_character_to_draw(){
        console.log(this.text);
        console.log(this.dialogue_ptr);
        console.log(this.line_ptr);
        if (this.dialogue_ptr >= this.num_boxes) {
            this.end_enable = true;
        } else {
            if (this.line_ptr >= this.text[this.dialogue_ptr].length){
                this.dialogue_ptr++;
                this.list_char.length = 0;
                this.line_ptr = 0;
                this.txt_pointer = 0;
            } else {
                let current_line = this.text[this.dialogue_ptr][this.line_ptr];
                if (this.txt_pointer >= current_line.length) {
                    this.txt_pointer = 0;
                    this.line_ptr++;
                } else {
                    this.add_character_to_list(current_line[this.txt_pointer], this.x+(8*this.txt_pointer),this.y+(15*this.line_ptr));
                    this.txt_pointer++;
                }
            }
        }
    }
    draw(){
        for(let i = 0; i < this.list_char.length; i++){
            let item = this.list_char[i];
            this.draw_character(item[0], item[1], item[2]);
        }
    }
    draw_character(char,x,y){
        ctx.fillText(char, x, y);
    }
    
}

class DialogueSprite{
    constructor(text){
        this.textbox = new TextBox(text);
        this.sprite = new Image();
        this.sprite.src = 'img/gemu/0/speech-bubble.png';
        this.x = 210;
        this.y = 0;
        this.width = 210;
        this.height = 150;
        this.state = 0;
    }
    control_animation(){
        switch (this.state){
            case 0:

                break;
        }
    }
    update(){
        this.control_animation();
        this.draw();
    }
    draw(){
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}
/* function text_animation(lines_i){
    let dialogue_box, line;
    let x = 222;
    let y = 48;
    for(let i = 0; i < lines_i.length; i++){
        dialogue_box = lines_i[i];
        for (let j = 0; j < dialogue_box.length; j++){
            line = dialogue_box[j];
            for (let k = 0; k < line.length; k++){
                draw_character(line[k], x +(k*8), y+(j*15))
            }
            /* let spliced_line = line.split(" ");
            for (let k = 0; k < spliced_line.length; k++){

            } 
        }
    }
} 
*/

function startAnimating(maxFPS){
    fpsInterval = 1000/maxFPS;
    then = Date.now();
    startTime = then;
    animate();
}
function animate(){
    ctx.font = "12px Courier";
    requestAnimationFrame(animate);
    
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval){
        dialogue_peeko.textbox.update();
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        dialogue_peeko.update();
        ctx.drawImage(character_sprite, 0, 0, 450, 450);
        dialogue_peeko.textbox.draw();
    }
    
    
}
let dialogue_peeko = new DialogueSprite(lines);
startAnimating(30);
