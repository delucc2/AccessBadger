let preloadState = function(){

};

preloadState.prototype.preload = function(){
	game.load.spritesheet("blue_button_sheet", "assets/images/blue_button_sheet.png", 512, 128);
	game.load.spritesheet("red_button_sheet", "assets/images/red_button_sheet.png", 512, 128);
	game.load.spritesheet("yellow_button_sheet", "assets/images/yellow_button_sheet.png", 512, 128);
	game.load.spritesheet("orange_button_sheet", "assets/images/orange_button_sheet.png", 160, 128);

	game.load.image("wall", "assets/images/wall.png");
	game.load.image("floor", "assets/images/floor.png");
	game.load.image("green gate", "assets/images/green_gate.png");
	game.load.image("orange gate", "assets/images/orange_gate.png");
	game.load.image("purple gate", "assets/images/purple_gate.png");

	game.load.spritesheet("blue", "assets/images/BadgerBlueWalk.png", 75, 75);
	game.load.spritesheet("blue jacket", "assets/images/BadgerBlueWalk_Coat.png", 75, 75);
	game.load.spritesheet("red", "assets/images/BadgerredWalk.png", 75, 75);
	game.load.spritesheet("red jacket", "assets/images/BadgerRedWalk_Coat.png", 75, 75);
	game.load.spritesheet("yellow", "assets/images/BadgerYellowWalk.png", 75, 75);
	game.load.spritesheet("yellow jacket", "assets/images/BadgerYellowWalk_Coat.png", 75, 75);
	game.load.spritesheet("honeybadger", "assets/images/HoneyBadger_Sheet.png", 75, 75);

	game.load.image("switch", "assets/images/switch.png");
	game.load.image("trap", "assets/images/trap.png");
	game.load.image("blue exit", "assets/images/blue_exit.png");
	game.load.image("red exit", "assets/images/red_exit.png");
	game.load.image("yellow exit", "assets/images/yellow_exit.png");
	game.load.image("start", "assets/images/StartingPanel.png");
	game.load.image("intercom_button_sheet", "assets/images/intercom_bubble.png");
	game.load.image("talk_button_sheet", "assets/images/talk_bubble.png");
	game.load.image("speech_bubble", "assets/images/speech_bubble.png");

	game.load.audio("music_1", "assets/sounds/chill synthwave stuff.ogg");
	game.load.audio("correct", "assets/sounds/correct SFX.ogg");
	game.load.audio("correct exit", "assets/sounds/good exit SFX.ogg");
	game.load.audio("trap sfx", "assets/sounds/trap SFX.ogg");
	game.load.audio("wrong", "assets/sounds/wrong SFX.ogg");

	game.load.text("level1", "levels/level1.txt");
	game.load.text("level2", "levels/level2.txt");
	game.load.text("level3", "levels/level3.txt");
	
	game.load.image("axx icon", "assets/images/AxxIcon.png");
	// game.load.spritesheet("axx ear animation", "assets/images/AxxEarAnimation.png", 500, 300);
	// game.load.spritesheet("axx drink animation", "assets/images/AxxDrinkAnimation.png", 500, 300);
	// game.load.spritesheet("axx ear animation", "assets/images/AxxBlinkAnimation.png", 500, 300);

	game.load.text("level1Text", "assets/writing/level_1.txt");

	game.load.image("intercom_button_sheet", "assets/intercom_bubble.png");
	game.load.image("talk_button_sheet", "assets/talk_bubble.png");
	game.load.image("speech_bubble", "assets/speech_bubble.png");
	game.load.audio("music_1", "assets/chill synthwave stuff.ogg");
};

preloadState.prototype.create = function(){
	game.state.start("Title");
};

preloadState.prototype.update = function(){

};
