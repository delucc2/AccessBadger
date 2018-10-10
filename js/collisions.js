gameplayState.prototype.turn = function(badger, wall) {
	if (badger.body.touching.down) {
		badger.body.velocity.y = 0;
		badger.body.velocity.x = 75;
	} else if (badger.body.touching.right) {
		badger.body.velocity.y = -75;
		badger.body.velocity.x = 0;
	} else if (badger.body.touching.up) {
		badger.body.velocity.y = 0;
	  badger.body.velocity.x = -75;
	} else if (badger.body.touching.left) {
		badger.body.velocity.y = 75;
		badger.body.velocity.x = 0;
	}
};

gameplayState.prototype.access = function(badger, gate) {
  console.log(badger.type, gate.type);
  if (badger.type !== gate.type) {
    this.turn(badger, null);
  }
}
