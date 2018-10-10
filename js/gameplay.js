let gameplayState = function(){
	this.selection = "";
	this.type = "";
	this.overWall = false;
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

	this.switches = game.add.group();
	this.switches.enableBody = true;

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
	this.cursors = game.input.keyboard.createCursorKeys();
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

	if (this.cursors.right.isDown) {
		this.selection = "badger";
		this.type = "blue";
	}

	if (this.cursors.down.isDown) {
		this.selection = "switch";
	}

	game.physics.arcade.collide(this.people, this.walls, this.turn, null, this);
	game.physics.arcade.collide(this.people, this.gates, this.turn, this.access, this);
};

gameplayState.prototype.buildObject = function(selection, x, y) {
	switch(selection) {
		case "wall":
			let wall = this.walls.create(x, y, "wall");
			wall.scale.setTo(1.875,1.875);
			wall.body.immovable = true;
			wall.inputEnabled = true;
			wall.events.onInputOver.add(this.allowSwitch, this);
			wall.events.onInputOut.add(this.disallowSwitch, this);
			break;
		case "gate":
			let gate = this.gates.create(x, y, "gate");
			gate.body.immovable = true;
			gate.scale.setTo(1.875,1.875);
			gate.type = this.type;
			break;
		case "badger":
			let person = this.people.create(x, y, "badger");
			person.type = this.type;
			person.body.velocity.y = 75;
			break;
		case "switch":
			if (this.overWall) {
				let arrow = this.switches.create(x, y, "switch");
				arrow.pointing = "left";
				arrow.body.immovable = true;
			}
	}
};

gameplayState.prototype.setupUI = function(){
	this.graphics.beginFill(0xA5CBD2);
	this.graphics.drawRect(0, 0, 513, 1125);
	this.graphics.endFill();
	this.timeText = game.add.text(10, 10, "Time: 0", {fontSize: '32px', fill: '#000'});
	this.createButton(0, 60, "Blue Gate", "gate_ui", "blue", this.setSelectionBlueGate);
	this.createButton(0, 200, "Wall", "wall_ui", "red", this.setSelectionWall);
	this.blueBadgersLeftText = game.add.text(10, 340, "Blue Badgers Left: 0", {fontSize: '32px', fill: '#000'});
};

gameplayState.prototype.updateTime = function(){

	this.time = this.game.time.time;
	this.timeText.text = "Time: " + (Math.floor((this.time - this.startTime) / 1000));
};

gameplayState.prototype.decreaseBlueBadgersLeft = function(){
	this.blueBadgersLeft--;
	this.blueBadgersLeftText.text = "Blue Badgers Left: " + this.blueBadgersLeft;
};

gameplayState.prototype.setSelectionWall = function(){
	this.selection = "wall";
};

gameplayState.prototype.setSelectionBlueGate = function(){
	this.selection = "gate";
	this.type = "blue";
};

gameplayState.prototype.turn = function(badger, wall) {
	if (badger.body.touching.down) {
		badger.body.velocity.y = 0;
		badger.body.velocity.x = 75;
	} else if (badger.body.touching.right) {
		badger.body.velocity.y = -75;
		badger.body.velocity.x = 0;
	} else if (badger.body.touching.up) {
		badger.body.velocity.y = 0;
	  badger.body.velocity.x = -75;
	} else if (badger.body.touching.left) {
		badger.body.velocity.y = 75;
		badger.body.velocity.x = 0;
	}
};

gameplayState.prototype.access = function(badger, gate) {
  if (badger.type !== gate.type) {
    return true;
  } else {
		return false;
	}
};

gameplayState.prototype.allowSwitch = function(wall) {
	this.overWall = true;
};

gameplayState.prototype.disallowSwitch = function(wall) {
	this.overWall = false;
};
