import { default as Player1 } from "./js/classes/Player1.js";
import { default as Player2 } from "./js/classes/Player2.js";
import { default as addEvents } from "./js/eventListeners.js";
import { default as Sprite } from "./js/classes/Sprites.js";
import { collisionsLevel1 } from "./js/data/collisions.js";
import { convertAndCreateObjects } from "./js/utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 64 * 16; //1024
canvas.height = 64 * 9; //576

let collisionBlocks = collisionsLevel1;
collisionBlocks = convertAndCreateObjects(collisionBlocks);

const gravity = 0.5;

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: "./assets/img/backgroundLevel1.png",
	ctx,
});

const player1 = new Player1({
	ctx,
	canvas,
	gravity,
	collisionBlocks,
	position: {
		x: 200,
		y: 200,
	},
	imageSrc: "./assets/img/Fighter/idle.png",
	frameRate: 6,
	frameBuffer: 5,
	animations: {
		idleRight: {
			frameRate: 6,
			loop: true,
			imageSrc: "./assets/img/Fighter/idle.png",
			default: true,
		},
		idleLeft: {
			frameRate: 6,
			loop: true,
			imageSrc: "./assets/img/FighterInversed/idle.png",
		},
		runRight: {
			frameRate: 8,
			loop: true,
			imageSrc: "./assets/img/Fighter/Walk.png",
		},
		runLeft: {
			frameRate: 8,
			loop: true,
			imageSrc: "./assets/img/FighterInversed/Walk.png",
		},
		attack1Right: {
			frameRate: 6,
			loop: false,
			imageSrc: "./assets/img/Fighter/Attack_1.png",
		},
		attack1Left: {
			frameRate: 6,
			loop: false,
			imageSrc: "./assets/img/FighterInversed/Attack_1.png",
		},
		attack2Right: {
			frameRate: 4,
			loop: false,
			imageSrc: "./assets/img/Fighter/Attack_2.png",
		},
		attack2Left: {
			frameRate: 4,
			loop: false,
			imageSrc: "./assets/img/FighterInversed/Attack_2.png",
		},
		shieldRight: {
			frameRate: 2,
			frameBuffer: 15,
			loop: true,
			imageSrc: "./assets/img/Fighter/Shield.png",
		},
		shieldLeft: {
			frameRate: 2,
			frameBuffer: 15,
			loop: true,
			imageSrc: "./assets/img/FighterInversed/Shield.png",
		},
		deadRight: {
			frameRate: 3,
			frameBuffer: 20,
			loop: false,
			imageSrc: "./assets/img/Fighter/Dead.png",
		},
		deadLeft: {
			frameRate: 3,
			frameBuffer: 20,
			loop: false,
			imageSrc: "./assets/img/FighterInversed/Dead.png",
		},
		hurtRight: {
			frameRate: 3,
			frameBuffer: 20,
			loop: false,
			imageSrc: "./assets/img/Fighter/Hurt.png",
		},
		hurtLeft: {
			frameRate: 3,
			frameBuffer: 20,
			loop: false,
			imageSrc: "./assets/img/FighterInversed/Hurt.png",
		},
	},
});

const player2 = new Player2({
	ctx,
	canvas,
	gravity,
	collisionBlocks,
	otherPlayer: player1,
	position: {
		x: 600,
		y: 200,
	},
	imageSrc: "./assets/img/Samurai/idle.png",
	frameRate: 6,
	frameBuffer: 5,
	animations: {
		idleRight: {
			frameRate: 6,
			loop: true,
			imageSrc: "./assets/img/Samurai/idle.png",
			default: true,
		},
		idleLeft: {
			frameRate: 6,
			loop: true,
			imageSrc: "./assets/img/SamuraiInversed/idle.png",
		},
		runRight: {
			frameRate: 8,
			loop: true,
			imageSrc: "./assets/img/Samurai/Walk.png",
		},
		runLeft: {
			frameRate: 8,
			loop: true,
			imageSrc: "./assets/img/SamuraiInversed/Walk.png",
		},
		attack2Right: {
			frameRate: 6,
			loop: false,
			imageSrc: "./assets/img/Samurai/Attack_1.png",
		},
		attack2Left: {
			frameRate: 6,
			loop: false,
			imageSrc: "./assets/img/SamuraiInversed/Attack_1.png",
		},
		attack1Right: {
			frameRate: 3,
			loop: false,
			imageSrc: "./assets/img/Samurai/Attack_2.png",
		},
		attack1Left: {
			frameRate: 3,
			loop: false,
			imageSrc: "./assets/img/SamuraiInversed/Attack_2.png",
		},
		shieldRight: {
			frameRate: 2,
			frameBuffer: 15,
			loop: true,
			imageSrc: "./assets/img/Samurai/Shield.png",
		},
		shieldLeft: {
			frameRate: 2,
			frameBuffer: 15,
			loop: true,
			imageSrc: "./assets/img/SamuraiInversed/Shield.png",
		},
		deadRight: {
			frameRate: 3,
			loop: false,
			frameBuffer: 20,
			imageSrc: "./assets/img/Samurai/Dead.png",
		},
		deadLeft: {
			frameRate: 3,
			loop: false,
			frameBuffer: 20,
			imageSrc: "./assets/img/SamuraiInversed/Dead.png",
		},
		hurtRight: {
			frameRate: 2,
			frameBuffer: 20,
			loop: false,
			imageSrc: "./assets/img/Samurai/Hurt.png",
		},
		hurtLeft: {
			frameRate: 2,
			frameBuffer: 20,
			loop: false,
			imageSrc: "./assets/img/SamuraiInversed/Hurt.png",
		},
	},
});

player1.otherPlayer = player2;

const events = new addEvents(player1, player2);
events.addEventListeners();
const keys = events.getKeys();

function animate() {
	window.requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	background.draw();

	player1.handleInput(keys);
	player1.draw();
	player1.update();

	player2.handleInput(keys);
	player2.draw();
	player2.update();

	player1.drawHitbox();
	player2.drawHitbox();
}

animate();
