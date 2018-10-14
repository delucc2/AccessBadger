let preloadState = function(){

};

preloadState.prototype.preload = function(){
	game.load.spritesheet("blue_button_sheet", "assets/blue_button_sheet.png", 512, 128);
	game.load.spritesheet("red_button_sheet", "assets/red_button_sheet.png", 512, 128);
	game.load.spritesheet("yellow_button_sheet", "assets/yellow_button_sheet.png", 512, 128);
	game.load.image("wall", "assets/wall_placeholder.png");
	game.load.image("gate", "assets/gate_placeholder.png");
	game.load.image("badger", "assets/person_placeholder.png");
	game.load.image("gate_ui", "assets/gate_ui_placeholder.png");
	game.load.image("wall_ui", "assets/wall_ui_placeholder.png");
	game.load.image("switch_ui", "assets/switch_ui_placeholder.png");
	game.load.image("trap_ui", "assets/trap_ui_placeholder.png");
	game.load.image("switch", "assets/switch.png");
	game.load.image("trap", "assets/trap.png");
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
