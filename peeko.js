const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const blip_audio = new Audio("./sfx/sfx-blipmale.wav");
const confirm_audio = new Audio("./sfx/sfx-confirm.wav");
const dialogue_start_audio = new Audio("./sfx/sfx-dialogue-start.wav")
//add a button audio here!!
const CANVAS_WIDTH = (canvas.width = 640);
const CANVAS_HEIGHT = (canvas.height = 480);
const maxFPS = 15;
let object_list = new Array();
var then, now, elapsed, fpsInterval;
const textSpeed = 0.06;
let lines = [
    ["odiando muito minha vida", "kkkkkkk meu deus!!", "100 thieves flop do ano"],
    ["viva shslmoiry", "no i love overwatch"],
];

let character_sprite = new Image();
character_sprite.src = "img/gemu/0/0-1.webp";

class SpeechConfirmSprite {
    constructor(x, y) {
        this.sprite = new Image();
        this.sprite.src = "img/gemu/0/confirm.svg";
        this.x = x;
        this.y = y;
        this.anim = 0;
        this.visible = false;
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
    calc_new_x_on_txt_width(txt_box_x, width) {
        let final_pos = txt_box_x + width * 0.75;
        this.update_x_pos(final_pos);
    }
    update_x_pos(new_x) {
        this.x = new_x;
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.sprite, this.x, this.y);
        }
    }
}

class DialogueStartSprite {
    constructor(x, y) {
        this.sprite_chatbox = new Image();
        this.sprite_exclamation = new Image();
        this.sprite_chatbox.src = "img/gemu/0/chat-square.svg";
        this.sprite_exclamation.src = "img/gemu/0/exclamation-lg.svg";
        this.chatbox_width = 80;
        this.chatbox_height = 80;
        this.exclamation_width = 60;
        this.exclamation_height = 45;
        this.x_c = x;
        this.y_c = y;
        this.audio = dialogue_start_audio;

        this.x_e = x + 9;
        this.y_e = y + 5;
        this.anim = 0;
        this.visible = false;
    }
    mouse_handler() {
        this.audio.play();
        object_list.pop();
        var dialogue_peeko = new DialogueSprite(lines);
        object_list.push(dialogue_peeko);
    }
    update() {
        if (this.anim < 5) {
            this.y_e++;
            this.anim++;
        } else if (this.anim < 10) {
            this.y_e--;
            this.anim++;
        } else {
            this.anim = 0;
        }
    }
    draw() {
        ctx.drawImage(this.sprite_chatbox, this.x_c, this.y_c, this.chatbox_width, this.chatbox_height);
        ctx.drawImage(this.sprite_exclamation, this.x_e, this.y_e, this.exclamation_width, this.exclamation_height);
    }
}

class TextBox {
    constructor(text) {
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
        this.timer = 0;
        this.get_largest_phrase_size();
        this.scale_factor = 9;
        this.width = this.lrgst_phrase_currt_dialog * this.scale_factor;
        this.confirmSprite = new SpeechConfirmSprite(
            this.x + this.width * 0.78,
            80
        );
        this.skip_text = false;
        this.list_char = new Array();

        this.end_enable = false;
        this.confirm_sfx = confirm_audio;
        this.blip_sound_effect = blip_audio;
        this.blip_sound_effect.volume = 0.01;
        //state = 0 - drawing
        //state = 1 - paused
        this.state = 0;
    }
    update_width_sprite() {
        this.width = this.lrgst_phrase_currt_dialog * this.scale_factor;
    }

    update() {
        if (!this.end_enable) {
            if (!this.state) {
                this.timer++;
                if (this.timer % 2 == 0) {
                    this.add_character_to_draw();
                }
            }
        }
        this.confirmSprite.update();
    }
    call_next_dialogue_box() {
        this.dialogue_ptr++;
        this.get_largest_phrase_size();
        this.update_width_sprite();
        this.confirmSprite.calc_new_x_on_txt_width(this.x, this.width);
        this.list_char.length = 0;
        this.line_ptr = 0;
        this.txt_pointer = 0;
        this.state = 0;
        this.confirmSprite.visible = false;
    }
    finish_writing_box() {
        this.skip = true;
        for (
            this.line_ptr;
            this.line_ptr < this.text[this.dialogue_ptr].length;
            this.line_ptr++
        ) {
            let current_line = this.text[this.dialogue_ptr][this.line_ptr];
            for (
                this.txt_pointer;
                this.txt_pointer < this.text[this.dialogue_ptr][this.line_ptr].length;
                this.txt_pointer++
            ) {
                this.add_character_to_list(
                    current_line[this.txt_pointer],
                    this.x + 8 * this.txt_pointer,
                    this.y + 15 * this.line_ptr
                );
            }
            this.txt_pointer = 0;
        }
        this.skip = false;
    }
    pause_box() {
        this.state = 1;
        this.confirmSprite.visible = true;
    }
    mouse_handler() {
        if (this.state) {
            this.confirm_sfx.cloneNode().play();
            this.call_next_dialogue_box();
        } else {
            this.finish_writing_box();
            this.pause_box();
        }
    }
    add_character_to_list(char, x, y) {
        if (!this.skip) {
            this.blip_sound_effect.cloneNode().play();
        }
        let item = [char, x, y];
        this.list_char.push(item);
    }
    add_character_to_draw() {
        /*         console.log(this.text);
                console.log(this.dialogue_ptr);
                console.log(this.line_ptr); */
        if (this.dialogue_ptr >= this.num_boxes) {
            this.end_enable = true;
        } else {
            if (this.line_ptr >= this.text[this.dialogue_ptr].length) {
                this.pause_box();
            } else {
                let current_line = this.text[this.dialogue_ptr][this.line_ptr];
                if (this.txt_pointer >= current_line.length) {
                    this.txt_pointer = 0;
                    this.line_ptr++;
                } else {
                    this.add_character_to_list(
                        current_line[this.txt_pointer],
                        this.x + 8 * this.txt_pointer,
                        this.y + 15 * this.line_ptr
                    );
                    this.txt_pointer++;
                }
            }
        }
    }
    get_largest_phrase_size() {
        let maior = 0;
        for (let i = 0; i < this.text[this.dialogue_ptr].length; i++) {
            let x = this.text[this.dialogue_ptr][i].length;
            if (x > maior) {
                maior = x;
            }
        }

        this.lrgst_phrase_currt_dialog = maior;
    }
    draw() {
        for (let i = 0; i < this.list_char.length; i++) {
            let item = this.list_char[i];
            this.draw_character(item[0], item[1], item[2]);
        }
        this.confirmSprite.draw();
    }
    draw_character(char, x, y) {
        ctx.fillText(char, x, y);
    }
}

class DialogueSprite {
    constructor(text) {
        this.textbox = new TextBox(text);
        this.sprite = new Image();
        this.sprite.src = "img/gemu/0/speech-bubble.png";
        this.x = 210;
        this.y = 0;
        this.scale_factor = 9;
        this.width = this.textbox.width;
        this.height = 150;
        this.state = 0;
    }
    mouse_handler() {
        this.textbox.mouse_handler();
    }

    control_animation() {
        switch (this.state) {
            case 0:
                break;
        }
    }
    update() {
        this.width = this.textbox.width;
        this.control_animation();
        this.draw();
    }
    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}

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

        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(character_sprite, 0, 0, 450, 450);
        for (let i = 0; i < object_list.length; i++) {
            object_list[i].update();
        }
        for (let i = 0; i < object_list.length; i++) {
            object_list[i].draw();
        }
    }
}
let dialogue_start_sp = new DialogueStartSprite(185, 50);
object_list.push(dialogue_start_sp);

startAnimating(30);
let start_response = false;
canvas.addEventListener("click", function (evt) {
    for (let i = 0; i < object_list.length; i++) {
        object_list[i].mouse_handler();
    }
});
