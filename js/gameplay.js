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
	this.badger_threshold = 7;
	this.entrance_x;
	this.entrance_y;
	this.buildPhase = true;
	this.started = false;
	this.level = 1;
	this.animations = ["axx ear animation", "axx drink animation", "axx blink animation"];
};

gameplayState.prototype.create = function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

	//audio
	/*this.music = game.add.audio('music_1');
	this.music.loop = true;
    this.music.play();*/


	this.blueBadgersLeft = 0;
	this.redBadgersLeft = 0;
	this.yellowBadgersLeft = 0;
	this.graphics = game.add.graphics(0,0);

	// Floor Group
	this.floor = game.add.group();

	// Wall group
	this.walls = game.add.group();
	this.walls.enableBody = true;

	// Gate group
	this.gates = game.add.group();
	this.gates.enableBody = true;

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

	// Badger group
	this.people = game.add.group();
	this.people.enableBody = true;

	this.loadLevel(this.level);

	this.blueBadgersLeft = this.badger_nums[0];
	this.redBadgersLeft = this.badger_nums[1];
	this.yellowBadgersLeft = this.badger_nums[2];

	this.setupUI();
	this.loadConversation(this.level);

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

	this.correct = game.add.audio("correct");
	this.correct_exit = game.add.audio("correct exit");
	this.trap = game.add.audio("trap sfx");
	this.wrong = game.add.audio("wrong");
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

	if (this.people.countLiving() === 0 && this.started) {
		this.level++;
		this.restart();
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
	if (this.cursor_x !== -1 && this.canPlace && (this.cursor_x !== this.prev_x || this.cursor_y !== this.prev_y) && this.selection !== "" && this.buildPhase) {
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
	this.scoreText = game.add.text(10, 10, "Score: 0/" + this.badger_threshold, {fontSize: '32px', fill: '#000'});
	this.switchButton = this.createButton(0, 200, "Switch", "switch", "blue", this.setSelectionSwitch);
	this.wallButton = this.createButton(0, 60, "Wall", "wall", "red", this.setSelectionWall);
	this.trapButton = this.createButton(0, 340, "Trap", "trap", "yellow", this.setSelectionTrap);
	this.pauseButton = this.createButton(0, 480, "Pause", "", "orange", this.pauseGame);
	this.deleteButton = this.createButton(170, 480, "Delete", "", "orange", this.setDelete);
	this.startButton = this.createButton(340, 480, "Start", "", "orange", this.startGame);
	this.blueBadgersLeftText = game.add.text(10, 610, "Blue Badgers Left: " + this.blueBadgersLeft, {fontSize: '32px', fill: '#000'});
	this.redBadgersLeftText = game.add.text(10, 650, "Red Badgers Left: " + this.redBadgersLeft, {fontSize: '32px', fill: '#000'});
	this.yellowBadgersLeftText = game.add.text(10, 690, "Yellow Badgers Left: " + this.yellowBadgersLeft, {fontSize: '32px', fill: '#000'});

	this.uiGroup = game.add.group();
	this.uiGroup.add(this.switchButton);
	this.uiGroup.add(this.wallButton);
	this.uiGroup.add(this.trapButton);
	this.uiGroup.add(this.pauseButton);
	this.uiGroup.add(this.deleteButton);
	this.uiGroup.add(this.startButton);

	this.axx = game.add.sprite(10, 740, "axx drink animation");
	this.axx.animations.add("sip", [0,1,2,3,4,5,6,7,8,9,10,11,11,11,11,11,10,9,8,7,6,5,4,3,2,1,0], 10, false);
	this.axx.animations.add("blink", [0,1,2,3,2,1,0], 15, false);
	this.axx.animations.add("ears", [0,1,2,3,4,3,2,1,0], 10, false);
	let animation_timer = game.time.create(false);
	animation_timer.loop(10000, this.animateAxx, this);
	animation_timer.start();

	this.wallButton.text.text = "Wall: " + this.object_caps[0];
	this.switchButton.text.text = "Switch: " + this.object_caps[1];
	this.trapButton.text.text = "Trap: " + this.object_caps[2];
};


gameplayState.prototype.decreaseBlueBadgersLeft = function(){
	this.blueBadgersLeft--;
	this.blueBadgersLeftText.text = "Blue Badgers Left: " + this.blueBadgersLeft;
};

gameplayState.prototype.decreaseRedBadgersLeft = function(){
	this.redBadgersLeft--;
	this.redBadgersLeftText.text = "Red Badgers Left: " + this.redBadgersLeft;
};

gameplayState.prototype.decreaseBlueBadgersLeft = function(){
	this.yellowBadgersLeft--;
	this.yellowBadgersLeftText.text = "Yellow Badgers Left: " + this.yellowBadgersLeft;
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


// Checks if badger can pass through gate
gameplayState.prototype.access = function(badger, gate) {
	console.log(this.notSide(badger, gate));
  if ((gate.type.includes(badger.type) || badger.type === 'honeybadger') && this.notSide(badger, gate)){
		if (badger.passed === false) {
			switch (badger.type) {
				case "blue":
					badger.loadTexture("blue jacket");
					badger.animations.play("walk");
					break;
				case "red":
					badger.loadTexture("red jacket");
					badger.animations.play("walk");
					break;
				case "yellow":
					badger.loadTexture("yellow jacket");
					badger.animations.play("walk");
					break;
			}
			if (badger.type !== "honeybadger") { this.correct.play(); }
		}
		badger.passed = true;
    return false;
  } else {
		return true;
	}
};

// Checks to see if the badger is colliding with the gate's side
gameplayState.prototype.notSide = function(badger, gate) {
	if ((badger.centerY === gate.centerY && gate.direction === "horizontal") ||
		(badger.centerX === gate.centerX && gate.direction === "vertical")) {
		return true;
	} else {
		return false;
	}
}

gameplayState.prototype.destroyTalk = function(){
	this.talkBubble.kill();
};
// Turns badger according to switch direction
gameplayState.prototype.switchTurn = function(badger, arrow) {
	let direction = this.directions[arrow.pointing];
	if (badger.type !== "honeybadger") {
		if (direction === 'right') {
			badger.body.velocity.x = 75;
			badger.body.velocity.y = 0;
			badger.angle = 90;
		} else if (direction === 'left') {
			badger.body.velocity.x = -75;
			badger.body.velocity.y = 0;
			badger.angle = 270;
		} else if (direction === 'up') {
			badger.body.velocity.x = 0;
			badger.body.velocity.y = -75;
			badger.angle = 0;
		} else if (direction === 'down') {
			badger.body.velocity.x = 0;
			badger.body.velocity.y = 75;
			badger.angle = 180;
		}
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
		if (object1.type !== "honeybadger") {
			object1.body.velocity.x = 0;
			object1.body.velocity.y = 0;
		}
		return true;
	}
	return false;
};

// Turns the switch
gameplayState.prototype.changeSwitch = function(arrow) {
	if (this.selection === "delete") {
		this.counts[1]--;
		if (arrow.x - 37.5 === this.prev_x && arrow.y - 37.5 === this.prev_y) {
			this.prev_x = 0;
			this.prev_y = 0;
		}
		arrow.kill();
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
	this.trap.play();
	badger.kill();
};

gameplayState.prototype.delete = function(object) {
	if (this.selection === "delete") {
		this.counts[this.index]--;
		if (object.x === this.prev_x && object.y === this.prev_y) {
			this.prev_x = 0;
			this.prev_y = 0;
		}
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
		this.started = true;
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
	if(!this.started){
		let enter_timer = game.time.create(false);
		enter_timer.loop(2000, this.spawnBadger, this, [this.entrance_x, this.entrance_y]);
		enter_timer.start();
		this.spawnLoop = enter_timer;
	}
}

gameplayState.prototype.loadLevel = function(x){
	let file = 'level' + x;
	let data = game.cache.getText(file);
	this.generateLevelFromFile(data);
};

gameplayState.prototype.exit = function(badger, exit) {
	if (badger.type === exit.type && badger.passed) {
		this.correct_exit.play();
		this.score += 1;
		this.scoreText.text = "Score: "+this.score+"/"+this.badger_threshold;
	} else if (badger.type === "honeybadger") {
		this.score -= 1;
		this.wrong.play();
	} else {
		this.wrong.play();
	}
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

	if (this.spawnLoop != null) { this.spawnLoop.stop(); }
	this.loadLevel(this.level);
	this.loadConversation(this.level);
	this.startButton.text.text = "Start";
	this.counts = [0, 0, 0];
	this.buildPhase = true;
	this.started = false;
	this.score = 0;
	this.selection = "";
};

gameplayState.prototype.reset = function() {
	this.people.callAll("kill");

	if (this.spawnLoop != null) { this.spawnLoop.stop(); }
	this.loadLevel(this.level);
	this.buildPhase = true;
	this.started = false;
	this.score = 0;
};

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
					wall.inputEnabled = true;
					wall.events.onInputOver.add(this.disallowPlacement, this);
					wall.events.onInputOut.add(this.allowPlacement, this);
					break;
				case('2'):
					let gate = this.gates.create(j * 75 + 535, i * 75, "purple gate");
					gate.body.immovable = true;
					gate.type = ["blue", "red"];
					gate.direction = "horizontal";
					gate.inputEnabled = true;
					gate.events.onInputOut.add(this.allowPlacement, this);
					gate.events.onInputOver.add(this.disallowPlacement, this);
					break;
				case('3'):
					let gate1 = this.gates.create(j * 75 + 535, i * 75, "green gate");
					gate1.body.immovable = true;
					gate1.type = ["blue", "yellow"];
					gate1.direction = "horizontal";
					gate1.inputEnabled = true;
					gate1.events.onInputOut.add(this.allowPlacement, this);
					gate1.events.onInputOver.add(this.disallowPlacement, this);
					break;
				case('4'):
					let gate2 = this.gates.create(j * 75 + 535, i * 75, "orange gate");
					gate2.body.immovable = true;
					gate2.type = ["red", "yellow"];
					gate2.direction = "horizontal";
					gate2.inputEnabled = true;
					gate2.events.onInputOut.add(this.allowPlacement, this);
					gate2.events.onInputOver.add(this.disallowPlacement, this);
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
				case('a'):
					let gate3 = this.gates.create(j * 75 + 572.5, i * 75 + 37.5, "orange gate");
					gate3.body.immovable = true;
					gate3.type = ["red", "yellow"];
					gate3.direction = "vertical";
					gate3.inputEnabled = true;
					gate3.events.onInputOut.add(this.allowPlacement, this);
					gate3.events.onInputOver.add(this.disallowPlacement, this);
					gate3.anchor.setTo(0.5, 0.5);
					gate3.angle += 90;
					break;
				case('b'):
					let gate4 = this.gates.create(j * 75 + 572.5, i * 75 + 37.5, "purple gate");
					gate4.body.immovable = true;
					gate4.type = ["red", "blue"];
					gate4.direction = "vertical";
					gate4.inputEnabled = true;
					gate4.events.onInputOut.add(this.allowPlacement, this);
					gate4.events.onInputOver.add(this.disallowPlacement, this);
					gate4.anchor.setTo(0.5, 0.5);
					gate4.angle += 90;
					break;
				case('c'):
				let gate5 = this.gates.create(j * 75 + 572.5, i * 75 + 37.5, "green gate");
					gate5.body.immovable = true;
					gate5.type = ["blue", "yellow"];
					gate5.direction = "vertical";
					gate5.inputEnabled = true;
					gate5.events.onInputOut.add(this.allowPlacement, this);
					gate5.events.onInputOver.add(this.disallowPlacement, this);
					gate5.anchor.setTo(0.5, 0.5);
					gate5.angle += 90;
				default:
					break;
			}
		}
	}
	this.object_caps = [parseInt(textData[15]), parseInt(textData[16]), parseInt(textData[17])];
	this.badger_nums = [parseInt(textData[18]), parseInt(textData[19]), parseInt(textData[20]), parseInt(textData[21])];
};


gameplayState.prototype.loadConversation = function(levelNum){
	this.uiGroup.forEach(this.changeDisabled, this);
	let data = game.cache.getText('level'+levelNum+'Text');
	let textList = data.split("\n");
	this.runConversation(textList, 0);

};

gameplayState.prototype.pauseGame = function(){
	game.paused = !game.paused;
};


gameplayState.prototype.startGame = function(){
	if (this.buildPhase) {
		this.startSpawning();
		this.startButton.text.text = "Restart";
		this.buildPhase = false;
	} else {
	    this.reset();
	    this.startButton.text.text = "Start";
	}
};

gameplayState.prototype.setDelete = function(){
	this.selection = "delete";
};

gameplayState.prototype.runConversation = function(textList, index){
	if(index === textList.length){
		this.uiGroup.forEach(this.changeDisabled, this);
	}
	else if(index % 2 === 1){
		let line = textList[index].substring(textList[index].indexOf("- ") + 2, textList[index].length);
		this.talkBubble = this.createButton(350, 300, line, "", "talk", function(){
			this.talkBubble.kill();
			this.runConversation(textList, index + 1);
		}, 100, 180);
	}
	else{
		let line = textList[index].substring(textList[index].indexOf("- ") + 2, textList[index].length);
		this.intercom = this.createButton(350, 800, line, "", "intercom", function(){
			this.intercom.kill();
			this.runConversation(textList, index + 1);
		}, 30, 120);
	}


};

gameplayState.prototype.destroyIntercom = function(){
	this.intercom.kill();
};

gameplayState.prototype.destroyTalk = function(){
	this.talkBubble.kill();
};

gameplayState.prototype.changeDisabled = function(obj){

	obj.button.inputEnabled = !obj.button.inputEnabled;
};

gameplayState.prototype.animateAxx = function() {
	let animation = this.animations[game.rnd.integerInRange(0,2)];
	this.axx.loadTexture(animation);
	if (animation === "axx ear animation") {
		this.axx.play("ears");
	} else if (animation === "axx drink animation") {
		this.axx.play("sip");
	} else if (animation === "axx blink animation") {
		this.axx.play("blink");
	}
}
