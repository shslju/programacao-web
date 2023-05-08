const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 640;
const CANVAS_HEIGHT = canvas.height = 480;
const maxFPS = 15;
var then, now, elapsed, fpsInterval;
const textSpeed = 0.06;
let lines = [["i like moiry from overwatch","aaa aaaa aaaa aaaa aaa2","aaaaaa aaaaa aaa!!"],["aaaa aaaaaaa aaaaaaaa a","aaaaa aaa."]];

let character_sprite = new Image();
let speech_bubble_sprite = new Image();
speech_bubble_sprite.src = 'img/gemu/0/speech-bubble.png'
character_sprite.src = 'img/gemu/0/0-1.webp';
let blip = new Audio("./sfx/sfx-blipmale.wav");
blip.volume = 0.1;


class SpeechConfirmSprite {
    constructor(x,y){
        
        this.sprite = new Image();
        this.sprite.src = 'img/gemu/0/confirm.svg';
        this.x = x;
        this.y = y;
        this.anim = 0;
    }
    update(){
        if (this.anim < 5) {
            this.y++;
            this.anim++
        } else if (this.anim < 10) {
            this.y--;
            this.anim++;
        } else {
            this.anim=0;
        }
        console.log("updating");
    }
    draw(){
        ctx.drawImage(this.sprite, this.x, this.y);
    }
}

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
        this.confirmSprite = new SpeechConfirmSprite(335,80);
        this.list_char = new Array();
        this.end_enable = false;
    }
    update(){
        if (!this.end_enable){
            this.timer++;
            if(this.timer%10==0){
                this.add_character_to_draw();
            }
        }
        this.confirmSprite.update();

    }
    add_character_to_list(char, x, y){
        blip.play();
        let item = [char, x, y];
        this.list_char.push(item);
    }
    add_character_to_draw(){
        console.log(this.text);
        console.log(this.dialogue_ptr);
        console.log(this.line_ptr);
        //old version
        /* if (this.txt_pointer < current_line.length) {
            console.log(this.dialogue_ptr);
            this.add_character_to_list(current_line[this.txt_pointer], this.x+(8*this.txt_pointer),this.y+(15*this.line_ptr))
            this.txt_pointer++;           
        } else {
            if (this.line_ptr < this.text[this.dialogue_ptr].length){
                this.txt_pointer = 0;
                this.line_ptr++;
            } else {
                if (this.dialogue_ptr < this.num_boxes) {
                    this.line_ptr=0;
                    this.dialogue_ptr++;
                    if (this.dialogue_ptr == this.num_boxes){
                        this.end_enable= true;
                    }
                }
         } */
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
        this.confirmSprite.draw();
    }
    draw_character(char,x,y){
        ctx.fillText(char, x, y);
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


canvas.addEventListener('click', function(evt){
    let x = evt.x;
    let y = evt.y;
    
})

function animate(){
    ctx.font = "12px Courier";
    requestAnimationFrame(animate);
    peeko_text.update();
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(speech_bubble_sprite, 210, 0, 150, 150);
        ctx.drawImage(character_sprite, 0, 0, 450, 450);
        peeko_text.draw();
    }
    
    
}
let peeko_text = new TextBox(lines);

startAnimating(24);
