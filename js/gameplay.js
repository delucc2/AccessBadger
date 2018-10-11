let gameplayState = function(){
	this.selection = "";
	this.isSpeechBubbleActive = false;
	this.speechBubbleActiveTime = 5000;
	this.speechBubbleStartTime = 0;
};

gameplayState.prototype.create = function(){
	this.startTime = this.game.time.time;
	this.time = this.game.time.time;
	this.blueBadgersLeft = 0;
	this.graphics = game.add.graphics(0,0);

	this.walls = game.add.group();
	this.walls.enableBody = true;

	this.gates = game.add.group();
	this.gates.enableBody = true;

	this.setupUI();
	

	// Draws Grid
	this.grid = [];
	for (let x = 0; x < 22; x++) {
		for (let y = 0; y < 15; y++) {
			this.grid.push(new Phaser.Rectangle(x * 75 + 514, y * 75, 75, 75));
		}
	}

	this.speechBubble = this.makeQuip(20, 500, "Hi, I'm an Access Badger");
	this.isSpeechBubbleActive = true;
	this.speechBubbleStartTime = game.time.time;

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

	this.updateSpeechBubble();	


	
};

gameplayState.prototype.buildObject = function(selection, x, y) {
	
	switch(selection) {
		case "wall":
			this.walls.create(x, y, "wall");
			break;
		case "gate":
			this.gates.create(x, y, "gate");
			break;
		default :
			break;
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
	this.talkBubble = this.createButton(350, 300, "THIS IS TEXT FROM AXX", "", "talk", this.destroyTalk, 100, 180);
	this.intercom = this.createButton(350, 800, "THIS IS TEXT FROM THE COYOTE", "", "intercom", this.destroyIntercom, 30, 180);
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
	
};


gameplayState.prototype.destroyIntercom = function(){
	this.intercom.kill();
};

gameplayState.prototype.destroyTalk = function(){
	this.talkBubble.kill();
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