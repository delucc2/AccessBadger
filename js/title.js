let titleState = function(){

};

titleState.prototype.preload = function(){

};

titleState.prototype.create = function(){
	game.add.text(500, 200, "Access Badge(r)", {fontSize:"36px", fill:"#FFF"});
	this.createButton(500, 300, "Start", "", "blue", function(){
		game.state.start("Gameplay");
	}, 200);

};

titleState.prototype.update = function(){

};


titleState.prototype.createButton = function(x, y, text, image = "", color, onClick, textAlignmentX = 10, textAlignmentY = 10){
	let buttonGroup = game.add.group();
	let button = game.add.button(x, y, color+"_button_sheet", onClick, this, 2, 1, 0);
	let uiText = game.add.text(x, y, text, {fontSize:"36px", fill:"#000", wordWrap:true});
	
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