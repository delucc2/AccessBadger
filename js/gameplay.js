let gameplayState = function(){

};

gameplayState.prototype.create = function(){
	this.graphics = game.add.graphics(0,0);

	// Draws Grid
	this.grid = [];
	for (let x = 0; x < 20; x++) {
		for (let y = 0; y < 15; y++) {
			game.debug.geom(new Phaser.Line(x * 40, 0, x * 40, 600));
			game.debug.geom(new Phaser.Line(0, y * 40, 800, y * 40));

			this.grid.push(new Phaser.Rectangle(x * 40, y * 40, 40, 40));
		}
	}

};

gameplayState.prototype.update = function(){
	let mouse = game.input.activePointer;

	this.graphics.clear(); // Clears all grid boxes

	// If the cursor is in a box, highlight as red
	for (let i = 0; i < this.grid.length; i++) {
		if (this.grid[i].contains(game.input.x, game.input.y)) {
			let box = this.grid[i];
			this.graphics.beginFill(0xFF3300);
			this.graphics.drawRect(box.x, box.y, box.width, box.height);
			this.graphics.endFill();
		}
	}
};
