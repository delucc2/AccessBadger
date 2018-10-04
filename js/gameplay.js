let gameplayState = function(){
	this.score = 0;
};

gameplayState.prototype.preload = function(){

};

gameplayState.prototype.create = function(){

	game.physics.startSystem(Phaser.Physics.ARCADE);


	game.add.sprite(0,0, "sky");


	this.platforms = game.add.group();
	this.platforms.enableBody = true;

	this.player = game.add.sprite(32, game.world.height - 150, "murph");
	game.physics.arcade.enable(this.player);
	this.player.body.gravity.y = 300;
	this.player.body.collideWorldBounds = true;
	this.player.body.bounce.y = 1.1;

	let ledge = this.platforms.create(400,400, "platform");
	ledge.body.immovable = true;

	ledge = this.platforms.create(-150,250, "platform");
	ledge.body.immovable = true;

	let ground = this.platforms.create(0, game.world.height - 64, "platform");
	ground.scale.setTo(2,2);
	ground.body.immovable=true;

	this.player.animations.add("left", [0, 1, 2, 3], 10, true);
	this.player.animations.add("right", [5, 6, 7, 8], 10, true);

	this.stars = game.add.group();
	this.stars.enableBody = true;
	for (let i=0;i<12;i++){
		let star = this.stars.create(i*70, 0, "star");
		star.body.gravity.y = 300;
		star.body.bounce.y = Math.random();
	}

	this.scoreText = game.add.text(16, 16, "Score: 0", {fontSize:"32px", fill:"#000"})

	this.cursors = game.input.keyboard.createCursorKeys();
};

gameplayState.prototype.update = function(){
	game.physics.arcade.collide(this.player, this.platforms);
	game.physics.arcade.collide(this.stars, this.platforms);

	game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
	this.player.body.velocity.x = 0;

	if(this.cursors.left.isDown){
		this.player.body.velocity.x = -150;
		this.player.animations.play("left");
	}

	else if(this.cursors.right.isDown){
		this.player.body.velocity.x = 150;
		this.player.animations.play("right");
	}
	else{
		this.player.animations.stop();
		this.player.frame = 4;
	}

	if(this.cursors.up.isDown && this.player.body.touching.down){
		this.player.body.velocity.y = -350;
	}
};


gameplayState.prototype.collectStar = function(a, b){
	b.kill();
	this.score += 10;
	this.scoreText.text = "Score: "+this.score;
};