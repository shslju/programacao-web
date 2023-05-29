// classes rs
class MainCharacter {
    constructor() {
        // state 0 is title screen anim
        // state 1 is 'wake-up'
        this.ts_x = 0;
        this.ts_y = 0;
        this.listening_x = 20;
        this.listening_y = 80;
        this.x = this.ts_x;
        this.y = this.tx_y;
        // sprite import and creation;
        this.punch_cycle = mc_punch_cycle;
        this.listening_sprite = mc_listening_sprite;
        this.explaining_sprite = mc_explaining_sprite;
        this.current_sprite = this.punch_cycle[0];
        this.current_sprite_ptr = 0;
        this.current_sprite_ptr_dir = 1;
        //misc
        this.visible = true;
        this.interactable = false;
        this.state = 0
        this.anim_cont = 0;
    }
    update() {
        if (this.state == 0) {
            if (this.anim_cont % 10 == 0) {
                if (this.current_sprite_ptr == 2) {
                    this.current_sprite_ptr_dir = -1;
                } else if (this.current_sprite_ptr == 0) {
                    this.current_sprite_ptr_dir = 1;
                }
                this.current_sprite_ptr = this.current_sprite_ptr + this.current_sprite_ptr_dir;
                this.current_sprite = this.punch_cycle[this.current_sprite_ptr];
            }
            this.anim_cont++;
            if (this.anim_cont > 1000) {
                this.anim_cont = 0;
            }
        } else if (this.state == 1) {
            if (this.anim_cont > 30) {
                changeGameState(1);
            }
            this.anim_cont++;
        } else if (this.state == 2) {
            if (this.anim_cont == 15) {
                this.y = this.y - 10;
            } else if (this.anim_cont == 30) {
                this.y = this.y + 10;
            }
            this.anim_cont++;
            if (this.anim_cont > 30) {
                this.anim_cont = 0;
            }
        }
    }

    mouse_handler() {
        this.changeState(1);
        layer0.pop();
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
                this.interactable = true;
                this.current_sprite = this.punch_cycle[0]
                this.changeCoordinates(this.ts_x, this.ts_y);
                break;
            case 1:
                this.interactable = false;
                this.current_sprite = this.punch_cycle[1];
                this.changeCoordinates(this.ts_x, this.ts_y);
                break;
            case 2:
                this.interactable = false;
                this.current_sprite = this.listening_sprite;
                this.changeCoordinates(this.listening_x, this.listening_y);
                break;
            case 3:
                this.interactable = false;
                this.current_sprite = this.explaining_sprite;
                this.changeCoordinates(0, 0);
                break;
            default:
                break;
        }
    }
}
class CostumerGymFile {
    constructor(costumer) {
        this.name = costumer.name;
        this.description = costumer.dialogue;
        this.profile_pic = costumer.sprite;
        this.x = 100;
        this.y = 90;
        this.height = 390;
        this.width = 310;
        this.color = ANTIQUE_WHITE;
        this.profile_pic_width = 100;
        this.profile_pic_height = 100;
        this.profile_pic_x = 125;
        this.profile_pic_y = 125;
        this.profile_pic_color = WHITE;
        this.strokeLength = 10;
        this.profile_pic_stroke_color = undefined;
    }
    update() {

    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = this.strokeLength;
        ctx.strokeStyle = this.profile_pic_stroke_color;
        ctx.rect(this.profile_pic_x, this.profile_pic_y, this.profile_pic_width, this.profile_pic_height);
        ctx.fillStyle = this.profile_pic_color;
        ctx.stroke();
        ctx.fill();
        ctx.drawImage(this.profile_pic, this.profile_pic_x, this.profile_pic_y, this.profile_pic_width, this.profile_pic_height);
        this.draw_text("30px Lekton", "Nome: ", this.profile_pic_x + 120, this.profile_pic_y + 20, BLACK, BLACK);
        this.draw_text("30px Lekton", this.name.toUpperCase(), this.profile_pic_x + 120, this.profile_pic_y + 55, BLACK, BLACK);
        this.draw_text("30px Lekton", "Descrição: ", this.profile_pic_x, this.profile_pic_y + 140, BLACK, BLACK);
        for (let i = 0; i < this.description[0].length; i++) {
            this.draw_text("12px Lekton", this.description[0][i], this.profile_pic_x, this.profile_pic_y + 170 + (i * 18), BLACK, BLACK);
        }
    }

    draw_text(font, text, x, y, stroke, color) {
        ctx.font = font;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";//can be bevel or round
        ctx.miterLimit = 2;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
}
class ResultsFile {
    constructor() {
        this.x = 150;
        this.y = 90;
        this.height = 390;
        this.width = 340;
        this.color = ANTIQUE_WHITE;
        this.profile_pic_width = 80;
        this.profile_pic_height = 80;
        this.profile_pic_x = 190;
        this.profile_pic_y = 170;
        this.profile_pic_color = WHITE;
        this.strokeLength = 10;
        this.profile_pic_stroke_color = undefined;
        this.profile_pics = Array();
        this.names = Array();
        for (let i = 0; i < customer_list[game_day - 1].length; i++) {
            let a = new Customer(customer_list[game_day - 1][i]);
            this.profile_pics.push(a.sprite);
            this.names.push(a.name);
        }

    }
    update() {

    }
    draw() {
        this.draw_text("30px Lekton", "Resultados: ", this.x + 30, this.y + 20, BLACK, BLACK);
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        for (let i = 0; i < customer_list[game_day - 1].length; i++) {

            ctx.beginPath();
            ctx.lineWidth = this.strokeLength;
            ctx.strokeStyle = this.profile_pic_stroke_color;
            ctx.rect(this.profile_pic_x, this.profile_pic_y + (i * 120), this.profile_pic_width, this.profile_pic_height);

            ctx.fillStyle = this.profile_pic_color;
            ctx.stroke();
            ctx.fill();
            ctx.drawImage(this.profile_pics[i], this.profile_pic_x, this.profile_pic_y + (i * 120), this.profile_pic_width, this.profile_pic_height);
            this.draw_text("30px Courier", "Resultados: ", this.x + 30, this.y + 50, BLACK, BLACK);
            this.draw_text("18px Lekton", "Nome: " + this.names[i].toUpperCase(), this.profile_pic_x + this.profile_pic_width + 15, this.profile_pic_y + 10 + (i * 120), BLACK, BLACK);
            this.draw_text("18px Lekton", "Score: " + score[i], this.profile_pic_x + this.profile_pic_width + 15, this.profile_pic_y + 35 + (i * 120), BLACK, BLACK);
        }
    }

    draw_text(font, text, x, y, stroke, color) {
        ctx.font = font;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";//can be bevel or round
        ctx.miterLimit = 2;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
}
class TrainingGymFile {
    constructor() {
        this.x = 280;
        this.y = 190;
        this.height = 390;
        this.width = 310;
        this.color = FRONT_PAPER_WHITE;
        this.trainer_pic_width = 50;
        this.trainer_pic_height = 50;
        this.profile_pic_x = 125;
        this.profile_pic_y = 125;
        this.profile_pic_color = WHITE;
        this.strokeLength = 10;
        this.profile_pic_stroke_color = BLACK;
        let additive_x = 60;
        for (let i = 0; i < 6; i++) {
            if (i % 2 == 0) {
                additive_x = 0;
            } else {
                additive_x = 150;
            }
            let x = this.x + 50 + additive_x;
            let y = this.y + 50 + ((Math.ceil((i + 1) / 2) - 1) * 80);
            posicoes.push([x, y]);
        }
    }
    update() {

    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        for (let i = 0; i < 6; i++) {
            let x = posicoes[i][0];
            let y = posicoes[i][1];
            ctx.beginPath();
            ctx.rect(x, y, this.trainer_pic_width, this.trainer_pic_height);
            ctx.fillStyle = WHITE;
            ctx.strokeStyle = BLACK;
            ctx.stroke();
            ctx.fill();
            ctx.drawImage(trainers_mugshots[i], x, y, this.trainer_pic_width, this.trainer_pic_height);
            this.draw_text("20px Lekton", answer_qtd[i], x + (this.trainer_pic_width / 2) - 5, y + this.trainer_pic_height + 22, BLACK, BLACK);
        }
    }

    draw_text(font, text, x, y, stroke, color) {
        ctx.font = font;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";//can be bevel or round
        ctx.miterLimit = 2;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
}
class SingleSlider {
    constructor(associated_function, x, y, id) {
        this.x = x;
        this.y = y;
        this.associated_function = associated_function;
        this.id = id;
        this.width = 30;
        this.height = 30;
        this.visible = true;
        this.interactable = true;
        this.selected = false;
        if (this.associated_function == 1) {
            this.sprite = right_slider;
        } else {
            this.sprite = left_slider;
        }
    }
    isInside() {
        this.selected = mousePos.x > this.x && mousePos.x < this.x + this.width && mousePos.y < this.y + this.height && mousePos.y > this.y;
    }
    update() {
    }
    mouse_handler() {
        this.isInside();
        console.log(this.selected);
        if (this.selected) {
            change_ev_value(this.id, this.associated_function);
        }
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.sprite, this.x, this.y);
        }

    }
}
class BgSprite {
    constructor(sprite) {
        this.x = 0;
        this.y = 0;
        this.image = sprite;
    }
    update() {
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }
}
class Customer {
    constructor(customer) {
        this.x = 350;
        this.y = 150;
        this.theater_x = 220;
        this.theater_y = 160;
        this.id = customer.id;
        this.name = customers_names[this.id];
        this.sprite = customers_sprites[this.id];
        this.order = customer.order;
        this.dialogue = customer.dialogue;
        this.visible = true;
        this.interactable = false;
        this.anim_cont = 0;
        this.state = 0;

    }
    changeCoordinates(new_x, new_y) {
        this.x = new_x;
        this.y = new_y;
    }
    update() {
        if (this.state == 0) {
            if (this.anim_cont == 10) {
                this.y = this.y - 10;
            } else if (this.anim_cont == 20) {
                this.y = this.y + 10;
            }
            this.anim_cont++;
            if (this.anim_cont > 30) {
                this.anim_cont = 0;
            }
        } else if (this.state == 1) {
            if (this.anim_cont == 30) {
                let x = calc_score(this.order);
                score.push(x);
                cummulative_score += x;
                if (x < 0.5) {
                    layer0.push(new HappySign(0));
                } else {
                    layer0.push(new HappySign(1));
                }
                layer0.push(new ContinueButton(480, 30, LIGHT_BLUE, BLACK));
            }
            this.anim_cont++;
        }
    }
    draw() {
        console.log(this.sprite);
        ctx.drawImage(this.sprite, this.x, this.y);
    }
    changeState(id) {
        this.anim_cont = 0;
        switch (id) {
            case 1:
                this.state = 1;
                this.changeCoordinates(this.theater_x, this.theater_y);
                break;
            default:
                break;
        }
    }
}
class SpeechConfirmSprite {
    constructor(x, y) {
        this.sprite = new Image();
        this.sprite.src = "img/gemu/0/confirm_white.svg";
        this.x = x;
        this.y = y;
        this.anim = 0;
        this.visible = false;
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
class HappySign {
    constructor(h_or_s) {
        this.x = 270;
        this.y = 80;
        if (h_or_s) {
            this.sprite = happy_sprite;
        } else {
            this.sprite = sad_sprite;
        }
        this.interactable = false;
        this.visible = true;
        this.anim_cont = 0;
    }
    update() {
        this.anim_cont++;
        if (this.anim_cont == 65) {
            this.visible = false;
        }
    }
    draw() {
        if (this.visible) {
            ctx.drawImage(this.sprite, this.x, this.y);
        }

    }
}
class TextBox {
    constructor(text) {
        this.text = text;
        this.x = 270;
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
        this.scale_factor = 14;
        this.scale_x = 12;
        this.scale_y = 18;
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
        this.visible = true;
        this.interactable = true;
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
                    this.x + this.scale_x * this.txt_pointer,
                    this.y + this.scale_y * this.line_ptr
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
                changeGameState(game_state + 1);
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
                        this.x + this.scale_x * this.txt_pointer,
                        this.y + this.scale_y * this.line_ptr
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
        if (this.visible) {
            ctx.fillStyle = WHITE;
            for (let i = 0; i < this.list_char.length; i++) {
                let item = this.list_char[i];
                this.draw_character(item[0], item[1], item[2]);
            }
            this.confirmSprite.draw();
        }
    }
    draw_character(char, x, y) {
        ctx.font = "18px Courier"
        ctx.fillText(char, x, y);
    }
}
class ContinueButton {
    constructor(x, y, color, stroke_color) {
        this.x = x;
        this.y = y;
        this.width = 110;
        this.height = 40;
        this.text = "Continuar"
        this.stroke_color = stroke_color;
        this.color = color;
        this.radius = 10;
        this.size = 23;
        this.selected = undefined;
        this.audio_hover = new Audio("../sfx/sfx-hover-attack-button.wav");
        this.audio_select = new Audio("../sfx/sfx-select-attack-button.wav")
        this.interactable = true;
        this.audio_played = false;
        this.visible = true;
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
        if (game_state != 5) {
            changeGameState(game_state + 1);
        } else {
            game_customer++;
            answer_qtd = [0, 0, 0, 0, 0, 0];
            if (game_customer - 1 == customer_list[game_day - 1].length) {
                changeGameState(game_state + 1);
                console.log(game_state + 1);
            } else {
                changeGameState(2);
            }
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
        if (this.visible) {
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
class DayPopUp {
    constructor() {
        this.x = 500;
        this.y = 200;
        this.text = "Dia " + game_day;
        this.size = 90;
        this.text_style = "px Arial Italic";
        this.visible = true;
        this.width = this.size * this.text.length;
        this.interactable = false;
        this.anim_cont = 0;
        this.speed = 30;
    }
    update() {
        this.x -= this.speed;
        if (this.x <= 320 && this.x >= 230) {
            this.speed = 5;
        } else if (this.x < 210) {
            this.speed = 45;
        }
        if (this.x < 0 - this.width) {
            changeGameState(2);
        }
    }
    draw() {
        if (this.visible) {
            ctx.font = this.size + this.text_style;
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
// funcoes rs
function change_ev_value(id, value) {
    let promise = answer_qtd[id] + value
    if (promise > -1 && promise < 152) {
        if (answer_qtd[0] + answer_qtd[1] + answer_qtd[2] + answer_qtd[3] + answer_qtd[4] + answer_qtd[5] < 256) {
            answer_qtd[id] += value;
        }

    }
}
function calc_score(order) {
    let nota = 0;
    console.log(order)
    console.log(order.length)
    for (let i = 0; i < order.length; i++) {
        let total = order[i][1];
        nota += (answer_qtd[order[i][0]] * 8) / total;
    }
    let nota_final = nota / (order.length);
    return nota_final;
}
function changeGameState(state) {
    emptyLayer(0);
    emptyLayer(1);
    game_state = state;
    switch (state) {
        case 0:
            setUpTitleScreen();
            break;
        case 1:
            setUpEstablishingShot();
            break;
        case 2:
            setUpListeningScene();
            break;
        case 3:
            setUpExplainingScene();
            break;
        case 4:
            setUpChooseTrainingScene();
            break;
        case 5:
            setUpTheaterScene();
            break;
        case 6:
            setUpResultsScene();
            break;
        case 7:
            tryForGameOver();
            break;
        case 8:
            setUpEndGame();
        default:
            break;
    }
}
function setUpEndGame() {
    if (cummulative_score < 3.6) {
        layer0.push(new BgSprite(bad_end));
    } else {
        layer0.push(new BgSprite(good_end));
    }
}
function tryForGameOver() {
    if (game_customer - 1 == customer_list[game_day - 1].length) {
        answer_qtd = [0, 0, 0, 0, 0, 0];
        if (game_day == 3) {
            changeGameState(8);
        } else {
            progressDay();
        }
    }
}
function setUpResultsScene() {
    layer0.push(new BgSprite(bg_wood));
    layer0.push(new ResultsFile());

    layer0.push(new ContinueButton(480, 400, LIGHT_BLUE, BLACK))

}
function setUpTheaterScene() {
    layer0.push(new BgSprite(bg_theater));
    let customer = new Customer(customer_list[game_day - 1][game_customer - 1])
    customer.changeState(1);
    let x = calc_score(customer.order);
    layer0.push(customer);
}
function setUpChooseTrainingScene() {
    layer0.push(new BgSprite(bg_wood));
    layer0.push(new CostumerGymFile(new Customer(customer_list[game_day - 1][game_customer - 1])));
    layer0.push(new TrainingGymFile());
    for (let i = 0; i < 6; i++) {
        let x = posicoes[i][0];
        let y = posicoes[i][1];
        let left_slider = new SingleSlider(-1, x - 45, y + 15, i);
        let right_slider = new SingleSlider(1, x + 75, y + 15, i);
        layer0.push(left_slider);
        layer0.push(right_slider);
    }
    let continue_button = new ContinueButton(480, 30, LIGHT_BLUE, BLACK);
    layer0.push(continue_button);
    console.log(layer0)
}
function setUpExplainingScene() {
    layer0.push(new BgSprite(bg_inside));
    main_char.changeState(3);
    layer0.push(main_char);
    layer0.push(new TextBox(scorbunny_explaining_dialogue));
}
function setUpEstablishingShot() {
    layer0.push(new BgSprite(bg_gym));
    layer0.push(new DayPopUp());

}
function setUpListeningScene() {
    layer0.push(new BgSprite(bg_inside));
    main_char.changeState(2);
    layer0.push(main_char);
    customer = new Customer(customer_list[game_day - 1][game_customer - 1]);
    layer0.push(customer);
    let textbox = new TextBox(customer.dialogue);
    layer0.push(textbox);
}
function emptyLayer(layer) {
    let a = object_list[layer].length;
    for (let i = 0; i < a; i++) {
        object_list[layer].pop();
    }
}
function setUpTitleScreen() {
    main_char.changeState(0);
    layer0.push(main_char);
    layer0.push(new InteractableIndicator(295, 80));

}
function startAnimating(maxFPS) {
    fpsInterval = 1000 / maxFPS;
    then = Date.now();
    startTime = then;
    console.log
    animate();
}
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
function updateAndDrawAllobjects(object_listx) {
    for (let i = 0; i < object_listx.length; i++) {
        object_listx[i].update();
    }
    for (let i = 0; i < object_listx.length; i++) {
        object_listx[i].draw();
    }
}
function progressDay() {
    game_day += 1;
    game_customer = 1;
    score = Array();
    changeGameState(1);
}
function animate() {
    ctx.font = "12px Courier";
    requestAnimationFrame(animate);
    if (canGetNewFrame()) {
        updateTimeElapsedSinceLastFrame();
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        updateAndDrawAllobjects(object_list[0]);
        updateAndDrawAllobjects(object_list[1]);
    }
}


/*Variáveis Constantes*/
const canvas = document.getElementById("game-canvas");
const blur_button = document.getElementById("blur-button");
const close_button = document.getElementById("close-button");
const overlay = document.getElementById("overlay");
const ctx = canvas.getContext('2d');
const fps = 30;
const CANVAS_WIDTH = (canvas.width = 640);
const CANVAS_HEIGHT = (canvas.height = 480);

const WHITE = "rgb(255,255,255)";
const BLACK = "rgb(0,0,0)";
const GRAY = "rgb(69,69,69)";
const LIGHT_GRAY = "rgb(211,211,211)";
const ANTIQUE_WHITE = "rgb(250,235,215)";
const LIGHT_BLUE = "rgb(0,191,255)";
const FRONT_PAPER_WHITE = "rgb(246,242,237)";

const blip_audio = new Audio("./sfx/sfx-blipmale.wav");
const confirm_audio = new Audio("./sfx/sfx-confirm.wav");
const dialogue_start_audio = new Audio("./sfx/sfx-dialogue-start.wav");
const HP = 0;
const ATK = 1;
const DEF = 2;
const SP_ATK = 3;
const SP_DEF = 4;
const SPE = 5;
const stats_names = ['HP', 'ATK', 'DEF', 'SP_ATK', 'SP_DEF', 'SPE'];
/*Customers */
const RATTATA = 0;
const MISDREAVUS = 1;
const MEOWTH_GALAR = 2;
const FLITTLE = 3;
const QUAXLY = 4;
const GASTLY = 5;
const customers_names = ['scraggy', 'misdreavus', 'meowth-galar', 'flittle', 'quaxly', 'gastly'];

const customer_list = [
    [
        { id: RATTATA, order: [[HP, 252]], dialogue: [["Eu quero um treinamento", "que maximize minha vida!!"]] }
    ],
    [
        { id: MISDREAVUS, order: [[HP, 248], [DEF, 8], [SPE, 252]], dialogue: [["Preciso de MUITO HP", "somente 2 pontos de DEFESA", "e o máximo de velocidade."]] },
        { id: MEOWTH_GALAR, order: [[ATK, 252], [DEF, 4], [SPE, 252]], dialogue: [["Quero 63 pontos em Ataque", "o mínimo de defesa", "adicional e o máximo de", " velocidade."]] }
    ],
    [
        { id: FLITTLE, order: [[SP_ATK, 236], [SP_DEF, 36], [SPE, 236]], dialogue: [["Eu quero 9 pontos em", " defesa especial o restante", " deve ser alocado", " igualmente entre ataque", " especial."]] },
        { id: QUAXLY, order: [[ATK, 252], [DEF, 4], [SPE, 252]], dialogue: [["Eu vou querer o mesmo", " que o 2° cliente do", " 2° dia! "]] },
        { id: GASTLY, order: [[SP_ATK, 196], [DEF, 36], [SP_DEF, 76], [SPE, 196]], dialogue: [["Eu quero 9 pontos em defesa", "menos de 10% dos pontos", " totais devem ser ", "alocados em defesa especial", " e o restante devem ser", " distribuidos igualmente", " entre velocidade", " e ataque especial!!"]] }
    ]]

const scorbunny_explaining_dialogue = [["Eu acho que você vai", "precisar desse treinamento..."]];
/* 
game_state desc:
0 - title screen
1 - gym (DAY 1)
2 - customer talk
3 - scorbunny talk
4 - choose training
5 - feedback (theater bg)
6 - feedback paper 
(repeat 1 - 6 until day 3);
7-finish screen
*/
var f = new FontFace('Lekton', 'url(../misc/Lekton-Italic.ttf)');
document.fonts.add(f);

var game_state = 0;
var game_day = 1;
var game_customer = 1;
var answer_qtd = [0, 0, 0, 0, 0, 0];
var posicoes = Array();
var score = Array();
var cummulative_score = 0;

/* SPRITES */
// ui
var left_slider = new Image();
left_slider.src = '../img/gemu/2/misc/left_slider.png'
var right_slider = new Image();
right_slider.src = '../img/gemu/2/misc/right_slider.png'

var happy_sprite = new Image();
happy_sprite.src = '../img/gemu/2/misc/happy.png';
var sad_sprite = new Image();
sad_sprite.src = '../img/gemu/2/misc/sad.png';
// trainers sprites initialization
var trainers_mugshots = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
const trainers_mugshots_src = [
    '../img/gemu/2/char/blissey/0.png',
    '../img/gemu/2/char/pancham/0.png',
    '../img/gemu/2/char/kirlia/0.png',
    '../img/gemu/2/char/klefki/0.png',
    '../img/gemu/2/char/mr-mime/0.png',
    '../img/gemu/2/char/raboot/0.png'
]
for (let i = 0; i < trainers_mugshots_src.length; i++) {
    trainers_mugshots[i].src = trainers_mugshots_src[i];
}
// customers sprites initialization
customers_sprites = Array();
for (let i = 0; i < customers_names.length; i++) {
    customers_sprites.push(new Image);
    customers_sprites[i].src = '../img/gemu/2/char/' + customers_names[i] + '/0.png'
}
// backgrounds
var good_end = new Image();
good_end.src = '../img/gemu/2/misc/good_end.png'
var bad_end = new Image();
bad_end.src = '../img/gemu/2/misc/bad_end.png'
var bg_gym = new Image();
bg_gym.src = '../img/gemu/2/bg/gym.png';
var bg_theater = new Image();
bg_theater.src = '../img/gemu/2/bg/theater-bg.png';
var bg_wood = new Image();
bg_wood.src = '../img/gemu/2/bg/wood-paper.png';
var bg_inside = new Image();
bg_inside.src = '../img/gemu/2/bg/inside-gym-bg.png';
// title screen
const mc_punch_cycle_src = [
    '../img/gemu/2/char/scorbunny/ts-1.png',
    '../img/gemu/2/char/scorbunny/ts-0.png',
    '../img/gemu/2/char/scorbunny/ts-2.png',
]
var mc_punch_cycle = [new Image(), new Image(), new Image()];
for (let i = 0; i < 3; i++) {
    mc_punch_cycle[i].src = mc_punch_cycle_src[i];
}
// other sprites
var mc_listening_sprite = new Image();
mc_listening_sprite.src = '../img/gemu/2/char/scorbunny/listening.png';

var mc_explaining_sprite = new Image();
mc_explaining_sprite.src = '../img/gemu/2/char/scorbunny/explaining.png';


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

let main_char = new MainCharacter();
var customer = undefined;




/*Eventos do mouse*/
canvas.addEventListener("mousemove", function (evt) {
    var rect = canvas.getBoundingClientRect();
    let x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    let y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    mousePos.x = x;
    mousePos.y = y;
})
canvas.addEventListener("click", function (evt) {
    for (let i = 0; i < object_list[0].length; i++) {
        if (object_list[0][i].interactable) {
            object_list[0][i].mouse_handler();
        }
    }
});

blur_button.addEventListener("click", () => {
    overlay.classList.add('animated');
    overlay.style.pointerEvents = 'all';
    document.body.classList.toggle('blurred');
})
close_button.addEventListener("click", () => {
    console.log(1)
    overlay.classList.remove('animated');
    overlay.classList.toggle('reverseAnimated');
    document.body.classList.toggle('blurred');
    overlay.style.pointerEvents = 'none';
})

changeGameState(0);
startAnimating(fps);
