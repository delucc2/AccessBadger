
let createButton = function(x, y, text, image, onClick){
	var button = game.add.button(x, y, 'button_sheet', onClick, this, 2, 1, 0);
	var text = game.add.text(x + 10, y + 10, text, {fontSize:"36px", fill:"#000"});
	return button;
};

let defaultAction = function(){
	console.log("thing");
};


