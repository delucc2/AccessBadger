let preloadState = function(){

};

preloadState.prototype.preload = function(){
	game.load.image("sky", "assets/sky.png");
	game.load.image("platform", "assets/platform.png");
	game.load.image("star", "assets/star.png");
	game.load.spritesheet("murph", "assets/character.png", 32, 48);
	game.load.spritesheet("blue_button_sheet", "assets/blue_button_sheet.png", 512, 128);
	game.load.spritesheet("red_button_sheet", "assets/red_button_sheet.png", 512, 128);
	game.load.image("wall", "assets/wall_placeholder.png");
	game.load.image("gate", "assets/gate_placeholder.png");
	game.load.image("gate_ui", "assets/gate_ui_placeholder.png");
	game.load.image("wall_ui", "assets/wall_ui_placeholder.png");
	game.load.audio("music_1", "assets/chill synthwave stuff.ogg");
};

preloadState.prototype.create = function(){
	game.state.start("Gameplay");
};

preloadState.prototype.update = function(){

};
