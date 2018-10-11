
gameplayState.prototype.createButton = function(x, y, text, image = "", color, onClick, textAlignmentX = 10, textAlignmentY = 10){
	let buttonGroup = game.add.group();
	let button = game.add.button(x, y, color+"_button_sheet", onClick, this, 2, 1, 0);
	var text = game.add.text(x + textAlignmentX, y + textAlignmentY, text, {fontSize:"36px", fill:"#000"});
	buttonGroup.add(button);
	buttonGroup.add(text);
	if(image !== ""){
		buttonGroup.add(game.add.sprite(x+200, y+30, image));
	}
	return buttonGroup;
};

gameplayState.prototype.makeQuip = function(x, y, text){
	let quipGroup = game.add.group();

	quipGroup.add(game.add.sprite (x, y, "speech_bubble"));
	var text = game.add.text(x + 50, y + 50, text, {fontSize:"20px", fill:"#000", wordWrap:true});
	text.setTextBounds(0, 0, 150, 130);
	quipGroup.add(text);
	return quipGroup;
};

