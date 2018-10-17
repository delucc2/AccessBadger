
gameplayState.prototype.createButton = function(x, y, text, image = "", color, onClick, textAlignmentX = 10, textAlignmentY = 10){
	let buttonGroup = game.add.group();
	let button = game.add.button(x, y, color+"_button_sheet", onClick, this, 2, 1, 0);
	let uiText = game.add.text(x, y, text, {fontSize:"36px", fill:"#000", wordWrap:true});
	if (color === "talk"){
		button.width = (text.length * 40) - textAlignmentX;
		if(button.width > 2000){
			button.width = 2000;
		}
	}
	uiText.setTextBounds(textAlignmentX, textAlignmentY, button.width * 2);
	uiText.padding.set(10, 16);
	uiText.wordWrapWidth = button.width*0.9;
	buttonGroup.add(button);
	buttonGroup.add(uiText);
	if(image !== ""){
		
		buttonGroup.add(game.add.sprite(x+280, y+30, image));
	}
	buttonGroup.text = uiText;
	buttonGroup.button = button;
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
