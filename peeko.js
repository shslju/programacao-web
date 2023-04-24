const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 640;
const CANVAS_HEIGHT = canvas.height = 480;

let character_sprite = new Image();
let speech_bubble_sprite = new Image();
speech_bubble_sprite.src = 'img/gemu/0/speech-bubble.png'
character_sprite.src = 'img/gemu/0/0-1.webp';

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(speech_bubble_sprite, 210, 0, 150, 150);
    ctx.drawImage(character_sprite, 0, 0, 450, 450);
    requestAnimationFrame(animate);
}
animate();
