let preloadState = function(){

};

preloadState.prototype.preload = function(){
	game.load.spritesheet("blue_button_sheet", "assets/blue_button_sheet.png", 512, 128);
	game.load.spritesheet("red_button_sheet", "assets/red_button_sheet.png", 512, 128);
	game.load.spritesheet("yellow_button_sheet", "assets/yellow_button_sheet.png", 512, 128);
	game.load.image("wall", "assets/wall.png");
	game.load.image("floor", "assets/floor.png");
	game.load.image("green gate", "assets/green_gate.png");
	game.load.image("orange gate", "assets/orange_gate.png");
	game.load.image("purple gate", "assets/purple_gate.png");
	game.load.spritesheet("blue", "assets/BadgerBlueWalk.png", 75, 75);
	game.load.spritesheet("blue jacket", "assets/BadgerBlueWalk_Coat.png", 75, 75);
	game.load.spritesheet("red", "assets/BadgerredWalk.png", 75, 75);
	game.load.spritesheet("red jacket", "assets/BadgerRedWalk_Coat.png", 75, 75);
	game.load.spritesheet("yellow", "assets/BadgerYellowWalk.png", 75, 75);
	game.load.spritesheet("yellow jacket", "assets/BadgerYellowWalk_Coat.png", 75, 75);
	game.load.image("gate_ui", "assets/gate_ui_placeholder.png");
	game.load.image("wall_ui", "assets/wall_ui_placeholder.png");
	game.load.image("switch_ui", "assets/switch_ui_placeholder.png");
	game.load.image("trap_ui", "assets/trap_ui_placeholder.png");
	game.load.image("switch", "assets/switch.png");
	game.load.image("trap", "assets/trap.png");
	game.load.image("start", "assets/start_placeholder.png");
	game.load.image("blue exit", "assets/blue_exit.png");
	game.load.image("red exit", "assets/red_exit.png");
	game.load.image("yellow exit", "assets/yellow_exit.png");
	game.load.text("level1", "levels/level1.txt");
	game.load.text("level2", "levels/level2.txt");
	game.load.image("intercom_button_sheet", "assets/intercom_bubble.png");
	game.load.image("talk_button_sheet", "assets/talk_bubble.png");
	game.load.image("speech_bubble", "assets/speech_bubble.png");
	game.load.audio("music_1", "assets/chill synthwave stuff.ogg");
};

preloadState.prototype.create = function(){
	game.state.start("Gameplay");
};

preloadState.prototype.update = function(){

};
