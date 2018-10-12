
gameplayState.prototype.createButton = function(x, y, text, image, color, onClick){
	var button = game.add.button(x, y, color+"_button_sheet", onClick, this, 2, 1, 0);
	var text = game.add.text(x + 10, y + 10, text, {fontSize:"36px", fill:"#000"});
	game.add.sprite(x+200, y+30, image);
	return button;
};
