let titleState = function(){

};

titleState.prototype.preload = function(){

};

titleState.prototype.create = function(){
	game.add.sprite(0, 0, "titleScreen");

	this.createButton(915, 275, "Start", "title", function(){
		this.music.stop();
		game.state.start("Gameplay");
	}, 100, 360);

	this.music = game.add.audio('title music');
	this.music.loop = true;
  this.music.play();
};

titleState.prototype.update = function(){

};


titleState.prototype.createButton = function(x, y, text, color, onClick, textAlignmentX = 10, textAlignmentY = 10){
	let buttonGroup = game.add.group();
	let button = game.add.button(x, y, color+"_button_sheet", onClick, this, 2, 1, 0);
	let uiText = game.add.text(x, y, text, {fontSize:"36px", fill:"#000", wordWrap:true});

	uiText.setTextBounds(textAlignmentX, textAlignmentY, button.width * 2);
	uiText.padding.set(10, 16);
	uiText.angle = -5;
	return buttonGroup;
};
