const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
//cores
const RED = "rgb(229, 119, 30)"
const BROWN = "rgb(91, 62, 44)"
const WHITE = "rgb(255,255,255)"
const BLACK = "rgb(0,0,0)"

const blip_audio = new Audio("./sfx/sfx-blipmale.wav");
const confirm_audio = new Audio("./sfx/sfx-confirm.wav");
const dialogue_start_audio = new Audio("./sfx/sfx-dialogue-start.wav");
//add a button audio here!!
const CANVAS_WIDTH = (canvas.width = 640);
const CANVAS_HEIGHT = (canvas.height = 480);
const maxFPS = 15;
let object_list = new Array();
var then, now, elapsed, fpsInterval;
const textSpeed = 0.06;

function elementFromHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}
/*
template para criação de dialogos hihihihi
let dialogue = {
    lines: [
        [""],
        [""]
    ],
    decision: [
    ]
}
*/
//0: nova caixa de dialogo
//1: redireção
let dialogue_list = [{
    lines: [
        ["Olá! ", "seja bem-vindo(a) a "],
        ["ZERIOUM...! "],
    ],
    decision: [
        ["Valeu", [0, 1]],
        ["Não.....", [0, 2]]
    ]
},
{
    lines: [
        ["Por favor ", "selecione um ", "jogo! "],
    ],
    decision: [
        ["PSYDUCK", [1, "psyduck.html"]],
        ["SCORBUNNY", [1, "scorbunny.html"]],
        ["????", [0, 3]]
    ]
},
{
    lines: [
        [" Então por favor ", " vá simbora "],
    ],
    decision: [
        ["Ok!", [1, "http://google.com"]]
    ]
},
{
    lines: [
        ["Novos jogos estão ", "sendo criados, ", "por favor tenha ", "paciência "],
    ]
}


]

let character_sprite = new Image();
character_sprite.src = "img/gemu/0/0-1.webp";

class actionButton {
    constructor(x, y, text, color) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.text = text[0]
        this.action = text[1]
        this.color = color;
        this.radius = 5;
        this.size = 23;
        this.text_width = 13 * this.text.length;
        this.selected = undefined;
        this.audio = dialogue_start_audio;
        this.audio_played = false;
    }
    isInside() {
        this.selected = mousePos.x > this.x && mousePos.x < this.x + this.width && mousePos.y < this.y + this.height && mousePos.y > this.y;
        console.log(this.selected)
    }
    update() {
        this.isInside()
        if (this.selected) {
            if (!this.audio_played) {
                let a = this.audio.cloneNode();
                a.play();
                this.audio_played = true;
            }
            this.color = BROWN;
        } else {
            this.color = RED;
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
        ctx.font = "23px Courier";
        ctx.fillText(this.text, this.x + (this.width / 2) - (this.text_width / 2), this.y + (this.height / 2) + 6);
    }
}
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
        var dialogue_peeko = new DialogueSprite(dialogue_list[0]);
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
        this.text = text.lines;
        this.decision = text.decision;
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
        //state = 2 - decision
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
        if (this.dialogue_ptr < this.text.length - 1) {
            this.dialogue_ptr++;
            this.get_largest_phrase_size();
            this.update_width_sprite();
            this.confirmSprite.calc_new_x_on_txt_width(this.x, this.width);
            this.list_char.length = 0;
            this.line_ptr = 0;
            this.txt_pointer = 0;
            this.state = 0;
            this.confirmSprite.visible = false;
            return 1;
        } else {
            return 0;
        }

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
        if (this.state == 1) {
            if (this.call_next_dialogue_box()) {
                this.confirm_sfx.cloneNode().play();
            } else {
                if (this.decision != null) {
                    this.state = 2;
                    this.confirmSprite.visible = false;
                    for (let i = 0; i < this.decision.length; i++) {
                        console.log(this.decision[i])
                        object_list.push(new actionButton(350, 100 + (80 * i), this.decision[i], RED))
                    }
                }
            }
        } else if (this.state == 0) {
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
        ctx.fillStyle = BLACK;
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
        this.textbox.update();

    }
    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        this.textbox.draw();
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
var mousePos = {
    x: undefined,
    y: undefined
}
startAnimating(30);
let start_response = false;
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
