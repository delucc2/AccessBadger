let gameplayState = function(){
	this.selection = "";
};

gameplayState.prototype.create = function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
	this.startTime = this.game.time.time;
	this.time = this.game.time.time;
	this.blueBadgersLeft = 0;
	this.graphics = game.add.graphics(0,0);

	this.walls = game.add.group();
	this.walls.enableBody = true;

	this.gates = game.add.group();
	this.gates.enableBody = true;
	
	this.people = game.add.group();
	this.people.enableBody = true;

	this.setupUI();

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
	//this.cursors = game.input.keyboard.createCursorKeys();

	this.graphics.clear(); // Clears all grid boxes
	//Sets ui zone
	this.graphics.beginFill(0xA5CBD2);
	this.graphics.drawRect(0, 0, 513, 1125);
	this.graphics.endFill();

	this.updateTime();
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
};

gameplayState.prototype.buildObject = function(selection, x, y) {
	
	switch(selection) {
		case "wall":
			let wall = this.walls.create(x, y, "wall");
			wall.scale.setTo(1.875,1.875);
			wall.body.immovable = true;
			break;
		case "gate":
			this.gates.create(x, y, "gate");
	}
};
