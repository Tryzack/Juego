export default class Sprite {
	constructor({ position, imageSrc, ctx, frameRate = 1, animations, loop = true, frameBuffer = 2, autoplay = true }) {
		this.frameRate = frameRate;
		this.currentFrame = 0;
		this.elapsedFrames = 0;
		this.frameBuffer = frameBuffer;
		this.ctx = ctx;
		this.loop = loop;
		this.position = position;
		this.animations = animations;
		this.image = new Image();
		this.image.src = imageSrc;
		this.image.onload = () => {
			this.loaded = true;
			this.width = this.image.width / this.frameRate;
			this.height = this.image.height;
		};
		this.loaded = false;
		this.autoplay = autoplay;

		if (this.animations) {
			for (let key in this.animations) {
				const image = new Image();
				image.src = this.animations[key].imageSrc;
				this.animations[key].image = image;
				this.image.src = this.animations[key].imageSrc;
				if (!this.animations[key].frameBuffer) this.animations[key].frameBuffer = this.frameBuffer;
			}
		}
	}

	draw() {
		if (!this.loaded) return;
		const cropbox = {
			position: {
				x: this.width * this.currentFrame,
				y: 0,
			},
			width: this.width,
			height: this.height,
		};
		this.ctx.drawImage(
			this.image,
			cropbox.position.x,
			cropbox.position.y,
			cropbox.width,
			cropbox.height,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		this.updateFrames();
	}

	play() {
		this.autoplay;
	}

	updateFrames() {
		if (!this.autoplay) return;
		this.elapsedFrames++;
		if (this.elapsedFrames % this.frameBuffer === 0) {
			if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
			else if (this.loop) this.currentFrame = 0;
		}
	}
}
