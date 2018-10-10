let gameplayState = function(){
	this.selection = "";
};

gameplayState.prototype.create = function(){
	game.physics.startSystem(Phaser.Physics.ARCADE);

	this.graphics = game.add.graphics(0,0);

	this.walls = game.add.group();
	this.walls.enableBody = true;

	this.gates = game.add.group();
	this.gates.enableBody = true;

	this.people = game.add.group();
	this.people.enableBody = true;

	// Draws Grid
	this.grid = [];
	for (let x = 0; x < 25; x++) {
		for (let y = 0; y < 15; y++) {
			this.grid.push(new Phaser.Rectangle(x * 75 + 535, y * 75, 75, 75));
		}
	}

};

gameplayState.prototype.update = function(){
	let mouse = game.input.activePointer;
	this.cursors = game.input.keyboard.createCursorKeys();

	this.graphics.clear(); // Clears all grid boxes

	// If the cursor is in a box, highlight as red
	for (let i = 0; i < this.grid.length; i++) {
		if (this.grid[i].contains(game.input.x, game.input.y)) {
			let box = this.grid[i];
			this.graphics.beginFill(0xFF3300);
			this.graphics.drawRect(box.x, box.y, box.width, box.height);
			this.graphics.endFill();
			if (mouse.leftButton.isDown) {
				this.buildObject(this.selection, box.x, box.y);
			}
		}
	}

	if (this.cursors.up.isDown) {
		this.selection = "wall";
	}
	if (this.cursors.down.isDown) {
		this.selection = "gate";
	}
	if (this.cursors.right.isDown) {
		this.selection = "crowd";
	}

	game.physics.arcade.collide(this.people, this.walls, this.turn, null, this);
};

gameplayState.prototype.buildObject = function(selection, x, y) {
	switch(selection) {
		case "wall":
			let wall = this.walls.create(x, y, "wall");
			wall.body.immovable = true;
			break;
		case "gate":
			this.gates.create(x, y, "gate");
			break;
		case "crowd":
			let person = this.people.create(x, y, "person");
			person.body.velocity.y = 75;
	}
};

gameplayState.prototype.turn = function(person, wall) {
	if (person.body.touching.down) {
		person.body.velocity.y = 0;
		person.body.velocity.x = 75;
	} else if (person.body.touching.right) {
		person.body.velocity.y = -75;
		person.body.velocity.x = 0;
	} else if (person.body.touching.up) {
		person.body.velocity.y = 0;
		person.body.velocity.x = -75;
	} else if (person.body.touching.left) {
		person.body.velocity.y = 75;
		person.body.velocity.x = 0;
	}
};
