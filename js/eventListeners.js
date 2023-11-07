export default class EventListeners {
	constructor(doors = [], player) {
		this.doors = doors;
		this.player = player;
		console.log(player);
		this.keys = {
			w: {
				pressed: false,
			},
			a: {
				pressed: false,
			},
			s: {
				pressed: false,
			},
			d: {
				pressed: false,
			},
		};
		this.addEventListeners();
	}

	addEventListeners() {
		window.addEventListener("keydown", this.handleKeyDown.bind(this));
		window.addEventListener("keyup", this.handleKeyUp.bind(this));
	}

	handleKeyDown(e) {
		if (this.player.preventInput) return;
		switch (e.key) {
			case "w":
				this.doors.forEach((door) => {
					if (
						this.player.hitbox.position.x + this.player.hitbox.width <= door.position.x + door.width &&
						this.player.hitbox.position.x >= door.position.x &&
						this.player.hitbox.position.y + this.player.hitbox.height >= door.position.y &&
						this.player.hitbox.position.y <= door.position.y + door.height
					) {
						this.player.preventInput = true;
						this.player.velocity.x = 0;
						this.player.velocity.y = 0;
						this.player.switchSprite("enterDoor");
						return;
					}
				});
				this.keys.w.pressed = true;
				break;
			case "a":
				this.keys.a.pressed = true;
				break;
			case "s":
				this.keys.s.pressed = true;
				break;
			case "d":
				this.keys.d.pressed = true;
				break;
		}
	}

	handleKeyUp(e) {
		switch (e.key) {
			case "w":
				this.keys.w.pressed = false;
				break;
			case "a":
				this.keys.a.pressed = false;
				break;
			case "s":
				this.keys.s.pressed = false;
				break;
			case "d":
				this.keys.d.pressed = false;
				break;
		}
	}

	getKeys() {
		return this.keys;
	}
}
