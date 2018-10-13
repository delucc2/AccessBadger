let gameplayState = function(){
	this.selection = "";
	this.type = "";
	this.cursor_x = 0;
	this.cursor_y = 0;
	this.directions = ["right", "down", "left", "up"];
	this.canPlace = true;
	this.score = 0;
};

gameplayState.prototype.create = function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

	this.startTime = this.game.time.time;
	this.time = this.game.time.time;
	this.blueBadgersLeft = 0;
	this.graphics = game.add.graphics(0,0);

	// Wall group
	this.walls = game.add.group();
	this.walls.enableBody = true;

	// Gate group
	this.gates = game.add.group();
	this.gates.enableBody = true;

	// Badger group
	this.people = game.add.group();
	this.people.enableBody = true;

	// Switch Group
	this.switches = game.add.group();
	this.switches.enableBody = true;

	this.traps = game.add.group();
	this.traps.enableBody = true;

	this.setupUI();

	// Draws Grid
	this.grid = [];
	for (let x = 0; x < 25; x++) {
		for (let y = 0; y < 15; y++) {
			this.grid.push(new Phaser.Rectangle(x * 75 + 535, y * 75, 75, 75));
		}
	}

	game.input.activePointer.leftButton.onDown.add(this.buildObject, this);
};

gameplayState.prototype.update = function(){
	let mouse = game.input.activePointer;
	this.cursors = game.input.keyboard.createCursorKeys();

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
			this.cursor_x = box.x;
			this.cursor_y = box.y;
		}
	}

	// Checks if cursor is in UI portion
	if (game.input.x < 513) {
		this.cursor_x = -1;
		this.cursor_y = -1;
	}

	// For debug, controls for placing badgers and switches
	if (this.cursors.right.isDown) {
		this.selection = "badger";
		this.type = "blue";
	}

	if (this.cursors.down.isDown) {
		this.selection = "switch";
	}

	if (this.cursors.up.isDown) {
		this.selection = "trap";
	}

	// Collisions
	game.physics.arcade.collide(this.people, this.walls, this.turn, null, this);
	game.physics.arcade.collide(this.people, this.gates, this.turn, this.access, this);
	game.physics.arcade.overlap(this.people, this.switches, this.switchTurn, this.isCenter, this);
	game.physics.arcade.overlap(this.people, this.traps, this.trapped, this.isCenter, this);
};

// Builds whatever is selected on a grid location
gameplayState.prototype.buildObject = function() {
	if (this.cursor_x !== -1 && this.canPlace) {
		this.canPlace = false;
		switch(this.selection) {
			case "wall":
				let wall = this.walls.create(this.cursor_x, this.cursor_y, "wall");
				wall.scale.setTo(1.875,1.875);
				wall.body.immovable = true;
				wall.inputEnabled = true;
				wall.events.onInputOver.add(this.disallowPlacement, this);
				wall.events.onInputOut.add(this.allowPlacement, this);
				break;
			case "gate":
				let gate = this.gates.create(this.cursor_x, this.cursor_y, "gate");
				gate.body.immovable = true;
				gate.scale.setTo(1.875,1.875);
				gate.type = this.type;
				gate.inputEnabled = true;
				gate.events.onInputOver.add(this.disallowPlacement, this);
				gate.events.onInputOut.add(this.allowPlacement, this);
				break;
			case "badger":
				let person = this.people.create(this.cursor_x, this.cursor_y, "badger");
				person.type = this.type;
				person.body.velocity.y = 75;
				person.inputEnabled = true;
				person.events.onInputOver.add(this.disallowPlacement, this);
				person.events.onInputOut.add(this.allowPlacement, this);
				break;
			case "switch":
				let arrow = this.switches.create(this.cursor_x + 37.5, this.cursor_y + 37.5, "switch");
				arrow.pointing = 0;
				arrow.body.immovable = true;
				arrow.inputEnabled = true;
				arrow.events.onInputDown.add(this.changeSwitch, this);
				arrow.events.onInputOver.add(this.disallowPlacement, this);
				arrow.events.onInputOut.add(this.allowPlacement, this);
				arrow.anchor.setTo(0.5, 0.5);
				break;
			case "trap":
				let trap = this.traps.create(this.cursor_x, this.cursor_y, "trap");
				trap.body.immovable = true;
				trap.inputEnabled = true;
				trap.events.onInputOver.add(this.disallowPlacement, this);
				trap.events.onInputOut.add(this.allowPlacement, this);
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

// Turns badgers counter-clockwise
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

// Checks if badger can pass through gate
gameplayState.prototype.access = function(badger, gate) {
  if (badger.type !== gate.type) {
    return true;
  } else {
		return false;
	}
}

// Turns badger according to switch direction
gameplayState.prototype.switchTurn = function(badger, arrow) {
	let direction = this.directions[arrow.pointing];
	if (direction === 'right') {
		badger.body.velocity.x = 75;
		badger.body.velocity.y = 0;
	} else if (direction === 'left') {
		badger.body.velocity.x = -75;
		badger.body.velocity.y = 0;
	} else if (direction === 'up') {
		badger.body.velocity.x = 0;
		badger.body.velocity.y = -75;
	} else if (direction === 'down') {
		badger.body.velocity.x = 0;
		badger.body.velocity.y = 75;
	}
}

// Ensures bager is fully overlapped with switch before badger turns
gameplayState.prototype.isCenter = function(object1, object2) {
	let dif_x = Phaser.Math.difference(object1.centerX, object2.centerX);
	let dif_y = Phaser.Math.difference(object1.centerY, object2.centerY);
	console.log(dif_x, dif_y);
	if (dif_x <= 2 && dif_y <= 2) {
		object1.body.velocity.x = 0;
		object1.body.velocity.y = 0;
		return true;
	}
	return false;
}

// Turns the switch
gameplayState.prototype.changeSwitch = function(arrow) {
	arrow.angle += 90;
	if (arrow.pointing === 3) {
		arrow.pointing = 0;
	} else {
		arrow.pointing += 1;
	}
	console.log(arrow.pointing);
}

// Forbids items to be place on top of one another
gameplayState.prototype.disallowPlacement = function(x) {
	console.log("hovering");
	this.canPlace = false;
}
gameplayState.prototype.allowPlacement = function(x) {
	this.canPlace = true;
}

gameplayState.prototype.trapped = function(badger, trap) {
	if (badger.type === "honeybadger") {
		this.score += 1;
	} else {
		this.score -= 1;
	}
	badger.kill();
}
