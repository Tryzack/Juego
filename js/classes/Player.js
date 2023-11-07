import { default as Sprite } from "./Sprites.js";

export default class Player extends Sprite {
	constructor({ collisionBlocks = [], ctx, gravity, imageSrc, frameRate = 1, animations, frameBuffer, position }) {
		super({ imageSrc, frameRate, animations, frameBuffer });
		this.gravity = gravity;
		this.ctx = ctx;
		this.position = position;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.speed = 5;
		this.collisionBlocks = collisionBlocks;
		this.lastDirection;
		this.onAir = false;
		this.frameBuffer = frameBuffer;
		this.preventInput = false;
	}

	update() {
		//apply velocity on x axis
		this.position.x += this.velocity.x;

		//update hitbox
		this.updateHitbox();

		//check horizontal collisions
		this.CheckHorizontalCollisions();

		//apply gravity and velocity on y axis
		this.applyGravity();

		//update hitbox
		this.updateHitbox();

		//check vertical collisions
		this.CheckVerticalCollisions();

		//check if player is on air and update last direction
		if (this.velocity.x < 0) this.lastDirection = "left";
		if (this.velocity.x > 0) this.lastDirection = "right";
		if (this.velocity.y > 0 || this.velocity.y < 0) this.onAir = true;
	}

	handleInput(keys) {
		if (this.preventInput) return;
		this.velocity.x = 0;
		if (keys.w.pressed) if (!this.onAir) this.velocity.y = -15;

		if (keys.a.pressed) {
			this.velocity.x = -this.speed;
			this.switchSprite("runLeft");
		}
		if (keys.d.pressed) {
			this.velocity.x = this.speed;
			this.switchSprite("runRight");
		}
		if (this.velocity.x === 0)
			if (this.lastDirection === "left") this.switchSprite("idleLeft");
			else this.switchSprite("idleRight");
	}

	//update hitbox position
	updateHitbox() {
		this.hitbox = {
			position: {
				x: this.position.x + 58,
				y: this.position.y + 34,
			},
			width: 50,
			height: 54,
		};
	}

	//switch sprite properties
	switchSprite(name) {
		if (this.image === this.animations[name].image) return;
		this.currentFrame = 0;
		this.image = this.animations[name].image;
		this.frameRate = this.animations[name].frameRate;
		this.frameBuffer = this.animations[name].frameBuffer;
		this.loop = this.animations[name].loop;
	}

	//check horizontal collisions
	CheckHorizontalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];
			if (
				this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
				this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
				this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
				this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
			) {
				if (this.velocity.x < 0) {
					const offset = this.hitbox.position.x - this.position.x;
					this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
					this.velocity.x = 0;
					break;
				}
				if (this.velocity.x > 0) {
					const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
					this.position.x = collisionBlock.position.x - offset - 0.01;
					this.velocity.x = 0;
					break;
				}
			}
		}
	}

	//check vertical collisions
	CheckVerticalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];
			if (
				this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
				this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
				this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
				this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
			) {
				if (this.velocity.y < 0) {
					const offset = this.hitbox.position.y - this.position.y;
					this.velocity.y = 0;
					this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
					break;
				}
				if (this.velocity.y > 0) {
					this.onAir = false;
					this.velocity.y = 0;
					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
					this.position.y = collisionBlock.position.y - offset - 0.01;
					break;
				}
			}
		}
	}

	//apply gravity and velocity on y axis
	applyGravity() {
		this.velocity.y += this.gravity;
		this.position.y += this.velocity.y;
	}

	changeCollisionBlocks(collisionBlocks) {
		this.collisionBlocks = collisionBlocks;
	}
}
