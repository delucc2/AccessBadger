
gameplayState.prototype.createButton = function(x, y, text, image = "", color, onClick, textAlignmentX = 10, textAlignmentY = 10){
	let buttonGroup = game.add.group();
	let button = game.add.button(x, y, color+"_button_sheet", onClick, this, 2, 1, 0);
	let uiText = game.add.text(x + textAlignmentX, y + textAlignmentY, text, {fontSize:"36px", fill:"#000"});
	buttonGroup.add(button);
	buttonGroup.add(uiText);
	if(image !== ""){
		buttonGroup.add(game.add.sprite(x+280, y+30, image));
	}
	buttonGroup.text = uiText;
	return buttonGroup;
};

gameplayState.prototype.makeQuip = function(x, y, text){
	let quipGroup = game.add.group();

	quipGroup.add(game.add.sprite (x, y, "speech_bubble"));
	let quipText = game.add.text(x + 50, y + 50, text, {fontSize:"20px", fill:"#000", wordWrap:true});
	quipText.setTextBounds(0, 0, 150, 130);
	quipGroup.add(quipText);
	return quipGroup;
};
