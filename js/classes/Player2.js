import { default as Sprite } from "./Sprites.js";

export default class Player extends Sprite {
	constructor({ collisionBlocks = [], ctx, gravity, imageSrc, frameRate = 1, animations, frameBuffer, position, otherPlayer, audios }) {
		super({ imageSrc, frameRate, animations, frameBuffer });
		this.otherPlayer = otherPlayer;
		this.gravity = gravity;
		this.ctx = ctx;
		this.position = position;
		this.ishurt = false;
		this.hp = 100;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.hitbox = {
			position: {
				x: 0,
				y: 0,
			},
			width: 0,
			height: 0,
		};
		this.speed = 3;
		this.collisionBlocks = collisionBlocks;
		this.lastDirection = "left";
		this.onAir = false;
		this.frameBuffer = frameBuffer;
		this.preventInput = false;
		this.shielded = false;
		this.attacking = false;
		this.attackBox = {
			position: this.hitbox.position,
			width: 100,
			height: 50,
		};
		this.attacktype = 0;
		this.attackNumber = 0;
		this.otherPlayerAtack = -1;
		this.alive = true;
		this.audios = audios;
		this.gameOver = false;
	}

	hurt() {
		if (this.ishurt || !this.otherPlayer.attacking || this.otherPlayerAtack === this.otherPlayer.attackNumber || !this.alive) return;
		this.otherPlayerAtack = this.otherPlayer.attackNumber;

		if (this.shielded && !(this.otherPlayer.lastDirection === this.lastDirection)) {
			if (this.lastDirection === "right") this.position.x -= 10;
			else this.position.x += 10;
			return;
		}

		this.audios.hurt.pause();
		this.audios.hurt.currentTime = 0;
		this.audios.hurt.play();

		if (this.otherPlayer.attacktype === 1 || this.otherPlayer.attacktype === 2) this.hp -= 20;
		else if (this.otherPlayer.attacktype === 3 || this.otherPlayer.attacktype === 4) this.hp -= 30;
		console.log(this.hp);
		this.ishurt = true;
		this.velocity.x = 0;

		gsap.to("#player2Health", { width: `${this.hp}%` });

		setTimeout(() => {
			this.ishurt = false;
			this.velocity.x = 0;
		}, 100);
	}

	drawHitbox() {
		this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
		this.ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

		//draw attack box
		this.ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
		this.ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
	}

	update() {
		if (this.hp <= 0) this.dead();
		if (!this.alive) {
			this.updateHitbox();
			this.CheckHorizontalCollisions();
			this.CheckVerticalCollisions();
			this.applyGravity();
			return;
		}

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

		//check if player hit other player
		if (
			this.attackBox.position.x + this.attackBox.width >= this.otherPlayer.hitbox.position.x &&
			this.attackBox.position.x <= this.otherPlayer.hitbox.position.x + this.otherPlayer.hitbox.width &&
			this.attackBox.position.y + this.attackBox.height >= this.otherPlayer.hitbox.position.y &&
			this.attackBox.position.y <= this.otherPlayer.hitbox.position.y + this.otherPlayer.hitbox.height &&
			this.attacking
		)
			this.otherPlayer.hurt();

		if (this.ishurt) {
			this.preventInput = true;
			if (this.otherPlayer.lastDirection === "right") {
				this.switchSprite("hurtLeft");
				this.velocity.x = 2;
				this.lastDirection = "left";
			} else {
				this.switchSprite("hurtRight");
				this.velocity.x = -2;
				this.lastDirection = "right";
			}
		} else {
			this.preventInput = false;
		}

		this.setIdle();
	}

	setIdle() {
		if (!this.preventInput) {
			//check if player is on air and update last direction
			if (this.velocity.x < 0) this.lastDirection = "left";
			if (this.velocity.x > 0) this.lastDirection = "right";
			if (this.velocity.y > 0 || this.velocity.y < 0) this.onAir = true;

			if (this.velocity.x === 0 && !this.shielded && !this.attacking) {
				if (this.lastDirection === "left") this.switchSprite("idleLeft");
				else this.switchSprite("idleRight");
			}
		}
	}

	handleInput(keys) {
		//check if player can move, is not attacking, not on air, or the game is not over
		if (!this.preventInput && !this.gameOver && !this.onAir && !this.attacking) {
			//shield
			if (keys.down.pressed) {
				this.velocity.x = 0;
				this.shielded = true;
				if (this.lastDirection === "right") this.switchSprite("shieldRight");
				else this.switchSprite("shieldLeft");
			}
			//check if player is not shielded
			if (!this.shielded) {
				this.velocity.x = 0;
				//jump
				if (keys.up.pressed) {
					this.velocity.y = -10;
					this.audios.jump.pause();
					this.audios.jump.currentTime = 0;
					this.audios.jump.play();
				}
				//move left
				if (keys.left.pressed) {
					this.velocity.x = -this.speed;
					this.switchSprite("runLeft");
				}
				//move right
				if (keys.right.pressed) {
					this.velocity.x = this.speed;
					this.switchSprite("runRight");
				}
				//attack 1
				if (keys.k.pressed) {
					this.velocity.x = 0;
					this.attacking = true;
					if (this.lastDirection === "right") {
						this.switchSprite("attack1Right");
						this.attacktype = 1;
					} else {
						this.switchSprite("attack1Left");
						this.attacktype = 2;
					}
					this.audios.espada1.pause();
					this.audios.espada1.currentTime = 0;
					this.audios.espada1.play();
					setTimeout(() => {
						this.attacking = false;
						this.setIdle();
						this.attacktype = 0;
					}, 300);
					this.attackNumber++;
				}
				//attack 2
				if (keys.l.pressed) {
					this.velocity.x = 0;
					this.attacking = true;
					if (this.lastDirection === "right") {
						this.switchSprite("attack2Right");
						this.attacktype = 3;
					} else {
						this.switchSprite("attack2Left");
						this.attacktype = 4;
					}
					this.audios.espada2.pause();
					this.audios.espada2.currentTime = 0;
					this.audios.espada2.play();
					setTimeout(() => {
						this.attacking = false;
						this.setIdle();
						this.attacktype = 0;
					}, 440);
					this.attackNumber++;
				}
			}
		}
	}

	//update hitbox position
	updateHitbox() {
		this.hitbox = {
			position: {
				x: this.position.x + 50,
				y: this.position.y + 48,
			},
			width: 28,
			height: 80,
		};
		if (this.attacktype === 0) {
			this.attackBox = {
				position: {
					x: 0,
					y: 0,
				},
				width: 0,
				height: 0,
			};
		} else if (this.attacktype === 1) {
			this.attackBox = {
				position: {
					x: this.hitbox.position.x + 28,
					y: this.hitbox.position.y + 28,
				},
				width: 50,
				height: 30,
			};
		} else if (this.attacktype === 2) {
			this.attackBox = {
				position: {
					x: this.hitbox.position.x - 50,
					y: this.hitbox.position.y + 28,
				},
				width: 50,
				height: 30,
			};
		} else if (this.attacktype === 3) {
			this.attackBox = {
				position: {
					x: this.hitbox.position.x + 28,
					y: this.hitbox.position.y + 28,
				},
				width: 50,
				height: 30,
			};
		} else if (this.attacktype === 4) {
			this.attackBox = {
				position: {
					x: this.hitbox.position.x - 50,
					y: this.hitbox.position.y + 28,
				},
				width: 50,
				height: 30,
			};
		}
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

	dead() {
		if (this.alive) {
			this.attacking = false;
			this.gameOver = true;
			this.otherPlayer.gameOver = true;
			this.audios.die.play();
			this.alive = false;
			this.preventInput = true;
			this.velocity.x = 0;
			if (this.lastDirection === "right") this.switchSprite("deadRight");
			else this.switchSprite("deadLeft");
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
