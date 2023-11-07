export default class EventListeners {
	constructor(player1, player2) {
		this.player1 = player1;
		this.player2 = player2;

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
			left: {
				pressed: false,
			},
			right: {
				pressed: false,
			},
			up: {
				pressed: false,
			},
			down: {
				pressed: false,
			},
			c: {
				pressed: false,
			},
			v: {
				pressed: false,
			},
			k: {
				pressed: false,
			},
			l: {
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
		if (!this.player1.preventInput) {
			switch (e.key) {
				case "w":
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
				case "c":
					this.keys.c.pressed = true;
					break;
				case "v":
					this.keys.v.pressed = true;
					break;
			}
		}
		if (!this.player2.preventInput) {
			switch (e.key) {
				case "ArrowLeft":
					this.keys.left.pressed = true;
					break;
				case "ArrowRight":
					this.keys.right.pressed = true;
					break;
				case "ArrowUp":
					this.keys.up.pressed = true;
					break;
				case "ArrowDown":
					this.keys.down.pressed = true;
					break;
				case "k":
					this.keys.k.pressed = true;
					break;
				case "l":
					this.keys.l.pressed = true;
					break;
			}
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
				this.player1.shielded = false;
				break;
			case "d":
				this.keys.d.pressed = false;
				break;
			case "ArrowLeft":
				this.keys.left.pressed = false;
				break;
			case "ArrowRight":
				this.keys.right.pressed = false;
				break;
			case "ArrowUp":
				this.keys.up.pressed = false;
				break;
			case "ArrowDown":
				this.keys.down.pressed = false;
				this.player2.shielded = false;
				break;
			case "c":
				this.keys.c.pressed = false;
				break;
			case "v":
				this.keys.v.pressed = false;
				break;
			case "k":
				this.keys.k.pressed = false;
				break;
			case "l":
				this.keys.l.pressed = false;
				break;
		}
	}

	getKeys() {
		return this.keys;
	}
}
