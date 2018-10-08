let buttonState = function(){};

buttonState.prototype.preload = function(){

};

buttonState.prototype.create = function(){
	game.add.sprite(0,0, "sky");

	button1 = createButton(5, 5, "Gate", defaultAction);
	button2 = createButton(5, 74, "Blocks", function(){console.log("checkcheck");});


};

buttonState.prototype.update = function(){

};


let createButton = function(x, y, text, onClick){
	var button = game.add.button(x, y, 'button_sheet', onClick, this, 2, 1, 0);
	var text = game.add.text(x + 5, y + 10, text, {fontSize:"12px", fill:"#000"});
	return button;
};

let defaultAction = function(){
	console.log("thing");
};