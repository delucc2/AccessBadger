let gameplayState = function(){
	this.selection = "";
	this.type = "";
	this.cursor_x = 0;
	this.cursor_y = 0;
	this.directions = ["right", "down", "left", "up"];
	this.canPlace = true;
	this.score = 0;
	this.counts = [0, 0, 0]; // Number of objects placed - [walls, switches, traps]
	this.object_caps = [0, 0, 0]; // Caps for number of objects placed - [walls, switches, traps]
	this.badger_types = ["blue", "red", "yellow", "honeybadger"];
	this.badger_nums = [0, 0, 0, 0];
	this.prev_x = -1;
	this.prev_y = -1;
	this.isSpeechBubbleActive = false;
	// this.speechBubbleActiveTime = 5000;
	// this.speechBubbleStartTime = 0;
	this.entrance_x;
	this.entrance_y;
	this.started = false;
};

gameplayState.prototype.create = function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

	//audio
	/*this.music = game.add.audio('music_1');
	this.music.loop = true;
    this.music.play();*/

	
	this.blueBadgersLeft = 0;
	this.graphics = game.add.graphics(0,0);

	// Floor Group
	this.floor = game.add.group();

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

	// Trap Group
	this.traps = game.add.group();
	this.traps.enableBody = true;

	// Spawn Points
	this.entrances = game.add.group();

	// Exit Points
	this.exits = game.add.group();
	this.exits.enableBody = true;

	this.loadLevel();
	this.setupUI();


	// Draws Grid
	this.grid = [];
	for (let x = 0; x < 25; x++) {
		for (let y = 0; y < 15; y++) {
			this.grid.push(new Phaser.Rectangle(x * 75 + 535, y * 75, 75, 75));
		}
	}

	// this.object_caps = [5,5,5];
	// this.badger_nums = [2, 2, 2, 2];
	// this.speechBubble = this.makeQuip(20, 500, "Hi, I'm an Access Badger");
	// this.isSpeechBubbleActive = true;
	// this.speechBubbleStartTime = game.time.time;

	game.input.activePointer.leftButton.onDown.add(this.buildObject, this);
};

gameplayState.prototype.update = function(){
	let mouse = game.input.activePointer;
	this.cursors = game.input.keyboard.createCursorKeys();
	let one = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	let two = game.input.keyboard.addKey(Phaser.Keyboard.TWO);

	this.graphics.clear(); // Clears all grid boxes
	//Sets ui zone
	this.graphics.beginFill(0xA5CBD2);
	this.graphics.drawRect(0, 0, 513, 1125);
	this.graphics.endFill();

	
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
	//this.updateSpeechBubble();

	// For debug, controls for placing badgers and switches
	if (this.cursors.right.isDown && !this.started) {
		this.startSpawning();
		this.started = true;
	}

	if (this.cursors.left.isDown) {
		this.selection = "delete";
	}

	if (this.cursors.down.isDown) {
		this.people.callAll("kill");
		this.spawnLoop.stop();
		this.floor.callAll("kill");
		this.walls.callAll("kill");
		this.gates.callAll("kill");
		this.switches.callAll("kill");
		this.traps.callAll("kill");
		this.entrances.callAll("kill");
		this.exits.callAll("kill");

		this.loadLevel();
		this.object_caps = [5,5,5];
		this.badger_nums = [2, 2, 2, 2];
		this.started = false;
	}

	// Collisions
	game.physics.arcade.collide(this.people, this.walls, this.turn, null, this);
	game.physics.arcade.collide(this.people, this.gates, this.turn, this.access, this);
	game.physics.arcade.overlap(this.people, this.switches, this.switchTurn, this.isCenter, this);
	game.physics.arcade.overlap(this.people, this.traps, this.trapped, this.isCenter, this);
	game.physics.arcade.overlap(this.people, this.exits, this.exit, this.isCenter, this);
};

// Builds whatever is selected on a grid location
gameplayState.prototype.buildObject = function() {
	if (this.cursor_x !== -1 && this.canPlace && (this.cursor_x !== this.prev_x || this.cursor_y !== this.prev_y) && this.selection !== "") {
		this.prev_x = this.cursor_x;
		this.prev_y = this.cursor_y;
		switch(this.selection) {
			case "wall":
			  this.counts[0]++;
				if (this.counts[0] > this.object_caps[0]) {
					this.counts[0]--;
					break;
				}
				this.wallButton.text.text = "Wall: " + (this.object_caps[0] - this.counts[0]);
				let wall = this.walls.create(this.cursor_x, this.cursor_y, "wall");
				wall.body.immovable = true;
				wall.inputEnabled = true;
				wall.events.onInputOver.add(this.disallowPlacement, this);
				wall.events.onInputOut.add(this.allowPlacement, this);
				wall.events.onInputDown.add(this.delete, this);
				this.index = 0;
				break;
			case "switch":
				this.counts[1]++;
				if (this.counts[1] > this.object_caps[1]) {
					this.counts[1]--;
					break;
				}
				this.switchButton.text.text = "Switch: " + (this.object_caps[1] - this.counts[1]);
				let arrow = this.switches.create(this.cursor_x + 37.5, this.cursor_y + 37.5, "switch");
				arrow.pointing = 0;
				arrow.body.immovable = true;
				arrow.inputEnabled = true;
				arrow.events.onInputDown.add(this.changeSwitch, this);
				arrow.events.onInputOver.add(this.disallowPlacement, this);
				arrow.events.onInputOut.add(this.allowPlacement, this);
				arrow.anchor.setTo(0.5, 0.5);
				this.index = 1;
				break;
			case "trap":
				this.counts[2]++;
				if (this.counts[2] > this.object_caps[2]) {
					this.counts[2]--;
					break;
				}
				this.trapButton.text.text = "Trap: " + (this.object_caps[2] - this.counts[2]);
				let trap = this.traps.create(this.cursor_x, this.cursor_y, "trap");
				trap.body.immovable = true;
				trap.inputEnabled = true;
				trap.events.onInputOver.add(this.disallowPlacement, this);
				trap.events.onInputOut.add(this.allowPlacement, this);
				trap.events.onInputDown.add(this.delete, this);
				this.index = 2;
				break;
		}
	}
};

gameplayState.prototype.setupUI = function(){
	this.graphics.beginFill(0xA5CBD2);
	this.graphics.drawRect(0, 0, 513, 1125);
	this.graphics.endFill();
	
	this.switchButton = this.createButton(0, 200, "Switch", "switch_ui", "blue", this.setSelectionSwitch);
	this.wallButton = this.createButton(0, 60, "Wall", "wall_ui", "red", this.setSelectionWall);
	this.trapButton = this.createButton(0, 340, "Trap", "trap_ui", "yellow", this.setSelectionTrap);
	this.blueBadgersLeftText = game.add.text(10, 480, "Blue Badgers Left: 0", {fontSize: '32px', fill: '#000'});
	this.talkBubble = this.createButton(350, 300, "THIS IS TEXT FROM AXX", "", "talk", this.destroyTalk, 100, 180);
	this.intercom = this.createButton(350, 800, "THIS IS TEXT FROM THE COYOTE", "", "intercom", this.destroyIntercom, 30, 180);


	this.wallButton.text.text = "Wall: " + this.object_caps[0];
	this.switchButton.text.text = "Switch: " + this.object_caps[1];
	this.trapButton.text.text = "Trap: " + this.object_caps[2];
};


gameplayState.prototype.decreaseBlueBadgersLeft = function(){
	this.blueBadgersLeft--;
	this.blueBadgersLeftText.text = "Blue Badgers Left: " + this.blueBadgersLeft;
};

gameplayState.prototype.setSelectionWall = function(){
	this.selection = "wall";
};

gameplayState.prototype.setSelectionSwitch = function(){
	this.selection = "switch";
};

gameplayState.prototype.setSelectionTrap = function(){
	this.selection = "trap";
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
	badger.angle -= 90;
};

gameplayState.prototype.destroyIntercom = function(){
	this.intercom.kill();
};
// Checks if badger can pass through gate
gameplayState.prototype.access = function(badger, gate) {
  if (gate.type.includes(badger.type) || badger.type === 'honeybadger') {
    return false;
		badger.passed = true;
  } else {
		return true;
	}
};

gameplayState.prototype.destroyTalk = function(){
	this.talkBubble.kill();
};
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
};

gameplayState.prototype.updateSpeechBubble = function(){
	if(this.isSpeechBubbleActive){
		let currentTime = game.time.time;
		if(currentTime - this.speechBubbleStartTime > this.speechBubbleActiveTime){
			this.isSpeechBubbleActive = false;
			this.speechBubble.kill();
		}
	}
};
// Ensures bager is fully overlapped with switch before badger turns
gameplayState.prototype.isCenter = function(object1, object2) {
	let dif_x = Phaser.Math.difference(object1.centerX, object2.centerX);
	let dif_y = Phaser.Math.difference(object1.centerY, object2.centerY);
	if (dif_x <= 2 && dif_y <= 2) {
		object1.body.velocity.x = 0;
		object1.body.velocity.y = 0;
		return true;
	}
	return false;
};

// Turns the switch
gameplayState.prototype.changeSwitch = function(arrow) {
	if (this.selection === "delete") {
		arrow.kill();
		this.counts[1]--;
	} else {
		arrow.angle += 90;
		if (arrow.pointing === 3) {
			arrow.pointing = 0;
		} else {
			arrow.pointing += 1;
		}
	}
};

// Forbids items to be place on top of one another
gameplayState.prototype.disallowPlacement = function(x) {
	this.canPlace = false;
};

gameplayState.prototype.allowPlacement = function(x) {
	this.canPlace = true;
};

// If badger passes over trap, kill it and change score
gameplayState.prototype.trapped = function(badger, trap) {
	// If badger is not a honeybadger, lose a point
	if (badger.type !== "honeybadger") {
		this.score -= 1;
	}
	badger.kill();
};

gameplayState.prototype.delete = function(object) {
	if (this.selection === "delete") {
		this.counts[this.index]--;
		object.kill();
	}
};

gameplayState.prototype.spawnBadger = function(args) {
	let x = args[0];
	let y = args[1];
	let is_valid = true;
	let badger_type = -1;
	for (let i = 0; i < this.badger_nums.length; i++) {
		if (this.badger_nums[i] !== 0) {
			is_valid = false;
		}
	}
	if (is_valid) {
		this.spawnLoop.stop();
	}
	while (!is_valid) {
		badger_index = game.rnd.integerInRange(0, 3);
		if (this.badger_nums[badger_index] !== 0) {
			is_valid = true;
		}
	}
	if (badger_index !== -1) {
		let badger_type = this.badger_types[badger_index];
		let badger = this.people.create(x + 37.5, y + 37.5, badger_type);
		badger.body.velocity.y = 75;
		badger.type = badger_type;
		badger.passed = false;
		this.badger_nums[badger_index]--;
		badger.animations.add("walk", [0,1,0,2], 6, true);
		badger.animations.play("walk");
		badger.anchor.setTo(0.5, 0.5);
		badger.angle += 180;
	}
}

gameplayState.prototype.startSpawning = function() {
	let enter_timer = game.time.create(false);
	enter_timer.loop(2000, this.spawnBadger, this, [this.entrance_x, this.entrance_y]);
	enter_timer.start();
	this.spawnLoop = enter_timer;
}

gameplayState.prototype.loadLevel = function(){
	let data = game.cache.getText('level1');
	this.generateLevelFromFile(data);
};

gameplayState.prototype.exit = function(badger, exit) {
	if (badger.type === exit.type && badger.passed) {
		this.score += 1;
	}
	console.log(this.score);
	badger.kill();
}

gameplayState.prototype.restart = function() {
	this.people.callAll("kill");
	this.floor.callAll("kill");
	this.walls.callAll("kill");
	this.gates.callAll("kill");
	this.switches.callAll("kill");
	this.traps.callAll("kill");
	this.entrances.callAll("kill");
	this.exits.callAll("kill");

	this.spawnLoop.stop();
	this.loadLevel();
	this.object_caps = [5,5,5];
	this.badger_nums = [2, 2, 2, 2];
	this.started = false;
}

gameplayState.prototype.generateLevelFromFile = function(text){
	let textData = text.split('\n');
	for(let i = 0; i < 15; i++){
		let textLine = textData[i].split('');
		for(let j = 0; j < textLine.length; j++){
			switch(textLine[j]){
			//	x * 75 + 535
				case('0'):
					this.floor.create(j * 75 + 535, i * 75, "floor");
					break;
				case('1'):
					let wall = this.walls.create(j * 75 + 535, i * 75, "wall");
					wall.body.immovable = true;

					break;
				case('2'):
					let gate = this.gates.create(j * 75 + 535, i * 75, "purple gate");
					gate.body.immovable = true;
					gate.type = ["blue", "red"];
					break;
				case('3'):
					let gate1 = this.gates.create(j * 75 + 535, i * 75, "green gate");
					gate1.body.immovable = true;
					gate1.type = ["blue", "yellow"];
					break;
				case('4'):
					let gate2 = this.gates.create(j * 75 + 535, i * 75, "orange gate");
					gate2.body.immovable = true;
					gate2.type = ["red", "yellow"];
					break;
				case('5'):
					let entrance = this.entrances.create(j * 75 + 535, i * 75, "start");
					entrance.events.onInputOver.add(this.disallowPlacement, this);
					entrance.events.onInputOut.add(this.allowPlacement, this);
					this.entrance_x = j * 75 + 535;
					this.entrance_y = i * 75;
					break;
				case('6'):
					let exit_blue = this.exits.create(j * 75 + 535, i * 75, "blue exit");
					exit_blue.type = "blue";
					exit_blue.events.onInputOver.add(this.disallowPlacement, this);
					exit_blue.events.onInputOut.add(this.allowPlacement, this);
					break;
				case('7'):
					let exit_red = this.exits.create(j * 75 + 535, i * 75, "red exit");
					exit_red.type = "red";
					exit_red.events.onInputOver.add(this.disallowPlacement, this);
					exit_red.events.onInputOut.add(this.allowPlacement, this);
					break;
				case('8'):
					let exit_yellow = this.exits.create(j * 75 + 535, i * 75, "yellow exit");
					exit_yellow.type = "yellow";
					exit_yellow.events.onInputOver.add(this.disallowPlacement, this);
					exit_yellow.events.onInputOut.add(this.allowPlacement, this);
					break;
				default:
					break;
			}
		}
	}
	this.object_caps = [parseInt(textData[15]), parseInt(textData[16]), parseInt(textData[17])];
	this.badger_nums = [parseInt(textData[18]), parseInt(textData[19]), parseInt(textData[20]), parseInt(textData[21])];
};
