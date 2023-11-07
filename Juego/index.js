import { default as Player } from "./js/classes/Player.js";
import { default as addEvents } from "./js/eventListeners.js";
import { default as Sprite } from "./js/classes/Sprites.js";
import { collisionsLevel1 } from "./js/data/collisions.js";
import { convertAndCreateObjects } from "./js/utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 64 * 16; //1024
canvas.height = 64 * 9; //576

const doors = [
	new Sprite({
		loop: false,
		frameBuffer: 10,
		frameRate: 5,
		position: {
			x: 765,
			y: 270,
		},
		imageSrc: "./assets/img/doorOpen.png",
		ctx: ctx,
		autoplay: false,
	}),
];
let collisionBlocks = collisionsLevel1;
collisionBlocks = convertAndCreateObjects(collisionBlocks);

const gravity = 1;

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: "./assets/img/backgroundLevel1.png",
	ctx: ctx,
});
const player = new Player({
	ctx,
	canvas,
	gravity,
	collisionBlocks,
	position: {
		x: 200,
		y: 200,
	},
	imageSrc: "./assets/img/king/idle.png",
	frameRate: 11,
	animations: {
		idleRight: {
			frameRate: 11,
			frameBuffer: 2,
			loop: true,
			imageSrc: "./assets/img/king/idle.png",
			default: true,
		},
		idleLeft: {
			frameRate: 11,
			frameBuffer: 2,
			loop: true,
			imageSrc: "./assets/img/king/idleLeft.png",
		},
		runRight: {
			frameRate: 8,
			frameBuffer: 4,
			loop: true,
			imageSrc: "./assets/img/king/runRight.png",
		},
		runLeft: {
			frameRate: 8,
			frameBuffer: 4,
			loop: true,
			imageSrc: "./assets/img/king/runLeft.png",
		},
		enterDoor: {
			framerate: 8,
			frameBuffer: 4,
			imageSrc: "./assets/img/king/enterDoor.png",
			loop: false,
		},
	},
});

const events = new addEvents(doors, player);
events.addEventListeners();
const keys = events.getKeys();

function animate() {
	window.requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	background.draw();

	doors[0].draw();

	player.handleInput(keys);
	player.draw();
	player.update();
}

animate();
