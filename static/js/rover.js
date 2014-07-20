var MAX_CELLS = 550;
var MIN_CELLS = 100;
var CELL_HEIGHT = 32;

function Player(){

	this.getX = function(){
		return x;
	}
	this.getY = function(){
		return y;
	}
	this.getFace = function(){
		return face;
	}
	this.setFace = function(new_face){
		face = new_face;
	}
	this.move = function(new_x, new_y){
		x = new_x;
		y = new_y;
	}
	this.rotateRight = function(){
		switch(this.getFace()){
			case 'N':
				this.setFace('E');
				break;
			case 'S':
				this.setFace('W');
				break;
			case 'E':
				this.setFace('S');
				break;
			case 'W':
				this.setFace('N');
				break;
		}
	}
	this.rotateLeft = function(){
		switch(this.getFace()){
			case 'N':
				this.setFace('W');
				break;
			case 'S':
				this.setFace('E');
				break;
			case 'E':
				this.setFace('N');
				break;
			case 'W':
				this.setFace('S');
				break;
		}
	}
	this.randomFace = function(){
		res = Math.floor(Math.random() * 4 +1);
		switch(res){
			case 1:
				return 'N';
				break;
			case 2:
				return 'S';
				break;
			case 3:
				return 'E';
				break;
			default:
				return 'W';
				break;
		}
	}
	this.info = function(){
		console.log('X: '+this.getX()+' Y: '+this.getY()+' Facing: '+this.getFace());
	}

	var x = 0;
	var y = 0;
	var face = this.randomFace();
}

function Planet(cells, cell_height) {
	var MAX_CELLS = 550;
	var MIN_CELLS = 100;
	var OBSTACLES_RATIO = 20;
	var side_length = Math.floor(Math.sqrt(cells));

	var cells = cells;
	var cell_height = cell_height;
	var positions = [];

    var that = this;
	this.player = new Player();

	this.getSideLength = function(){
		return side_length;
	}
	this.setPos = function(x,y,value){
		if(value === null){
			positions[x][y] = undefined;
		}else{
			positions[x][y] = value;	
		}
		
	}
	this.getPos = function(x,y){

		if(typeof positions[x][y] === "undefined" || positions[x][y] === "&nbsp;" ){
			return "&nbsp;";
		}
		return positions[x][y];
	}
	this.setCells = function(new_cells){
		cells = new_cells;
		if(new_cells < MIN_CELLS){
			cells = MIN_CELLS;
		}else if(new_cells > MAX_CELLS){
			cells = MAX_CELLS;
		}
		side_length = Math.floor(Math.sqrt(cells));		
	}
	this.randomObstacle = function(){
		option = Math.floor(Math.random() * OBSTACLES_RATIO +1);
		switch(option){
			case 1:
				return "meteor";
				break;
			case 2:
				return "alien";
				break;
			default:
				return "&nbsp;";
				break;
		}
	}
	this.cleanPlanet = function(){
		positions = [];
		for(var i = 1; i <= side_length; i++){
			positions[i] = [];
		}
	}
	this.insertPlayer = function(){
		var player_x = Math.floor(Math.random() * side_length +1);
		var player_y = Math.floor(Math.random() * side_length +1);

		positions[player_x][player_y] = 'player';
		this.player.move(player_x, player_y);
	}
	this.insertMotherShip = function(){

		var ship_landed = false;
		while(!ship_landed){
			var ship_x = Math.floor(Math.random() * side_length +1);
			var ship_y = Math.floor(Math.random() * side_length +1);

			if( typeof positions[ship_x][ship_y] === "undefined"){
				positions[ship_x][ship_y] = 'mothership';
				ship_landed = true;
			}
		}
	}
	this.insertObstacles = function(){
		for(var i = 1; i <= side_length; i++){
			for(var j = 1; j <= side_length; j++){
				if( typeof positions[i][j] === "undefined" ){
					positions[i][j] = this.randomObstacle();
				}
			}
		}
	}
	this.resetPlanet = function(){
		var new_dim = parseInt(document.getElementById('planet_cells').value);
		if(new_dim < MIN_CELLS){
			new_dim = MIN_CELLS;
		}
		if(new_dim>MAX_CELLS){
			new_dim = MAX_CELLS;
		}

		this.player = new Player();

		this.setCells(new_dim);
		this.cleanPlanet();
		this.insertPlayer();
		this.insertMotherShip();
		this.insertObstacles();

		document.getElementById('planet').innerHTML = drawPlanet(this);
		drawShip(myPlanet.player);
		setContentDimension(side_length);
		enableCommand(true);
		cleanAlert();
	}
	this.checkMove = function(new_x, new_y){		
		if( positions[new_x][new_y] != 'meteor' && positions[new_x][new_y] != 'alien'){
			return true;
		}
		return false;
	}
	this.checkWins = function(new_x, new_y){
		if( positions[new_x][new_y] == 'mothership'){
			return true;
		}
		return false;
	}

	this.setCells(cells);
	this.cleanPlanet();
}

var checkBounds = function(side_length, player_coord){
	if(player_coord < 1){
		return side_length;
	}else if(player_coord > side_length){
		return 1; 
	}
	return player_coord;
}

var processCommand = function(myPlanet){

	cleanAlert();

	var command_string = document.getElementById('command_input').value;

	for(var i = 0; i < command_string.length; i++){
		var com = command_string[i];

		var player_x = myPlanet.player.getX();
		var player_y = myPlanet.player.getY();
		var player_facing = myPlanet.player.getFace();
		var side_length = myPlanet.getSideLength();
		var hasWon = false;

		switch(com){
			case 'f':
				if(player_facing == 'N'){
					player_y -= 1; 
				}else if(player_facing == 'E'){
					player_x += 1;
				}else if(player_facing == 'S'){
					player_y += 1;
				}else if(player_facing == 'W'){
					player_x -= 1;
				}

				player_x = checkBounds(side_length, player_x);
				player_y = checkBounds(side_length, player_y);

				if(myPlanet.checkMove(player_x, player_y)){
					hasWon = myPlanet.checkWins(player_x, player_y);
					myPlanet.setPos(myPlanet.player.getX(), myPlanet.player.getY(), "&nbsp;");
					myPlanet.player.move(player_x, player_y);
					myPlanet.setPos(player_x, player_y, 'player');
				}else{
					showAlert('error','Collision on ' + player_x + ',' + player_y);
					return;
				}
				break;
			case 'b':
				if(player_facing == 'N'){
					player_y += 1; 
				}else if(player_facing == 'E'){
					player_x -= 1;
				}else if(player_facing == 'S'){
					player_y -= 1;
				}else if(player_facing == 'W'){
					player_x += 1;
				}

				player_x = checkBounds(side_length, player_x);
				player_y = checkBounds(side_length, player_y);

				if(myPlanet.checkMove(player_x, player_y)){
					hasWon = myPlanet.checkWins(player_x, player_y);
					myPlanet.setPos(myPlanet.player.getX(), myPlanet.player.getY(), null);
					myPlanet.player.move(player_x, player_y);
					myPlanet.setPos(player_x, player_y, 'player');
				}else{
					showAlert('error','Colision on ' + player_x + ',' + player_y);
					return;
				}
				break;
			case 'r':
				myPlanet.player.rotateRight();
				break;
			case 'l':
				myPlanet.player.rotateLeft();
				break;
			default:
				showAlert('error', 'Use l r to turn and f b to move yor rover.');
				return;
				break;
		}
		
		document.getElementById('planet').innerHTML = drawPlanet(myPlanet);
		drawShip(myPlanet.player);
		if(hasWon){
			showAlert('success','You win!');
			enableCommand(false);
			return;
		}
	}

	document.getElementById('command_input').value = '';
}

/*
 *	CSS Control Functions
 */

 var drawShip = function(player){
 	var rover_class = '';
 	switch(player.getFace()){
 		case 'N':
 			rover_class = 'rover_north';
 			break;
 		case 'E':
 			rover_class = 'rover_east';
 			break;
 		case 'S':
 			rover_class = 'rover_south';
 			break;
 		case 'W':
 			rover_class = 'rover_west';
 			break;
 	}
 	player_x = myPlanet.player.getX();
 	player_y = myPlanet.player.getY();
 	document.getElementById(player_x+','+player_y).className = "cell " + rover_class;
 }

var drawPlanet = function(myPlanet){
	html = "";
	side_length = myPlanet.getSideLength();
	for(var j=1; j <= side_length; j++){
		html += "<div class=\"row\" id=" + j +">";

		for(var i = 1; i <= side_length; i++){
			//html += myPlanet.getPos(j,i);
			var cell_class = '';
			if(myPlanet.getPos(i,j) == 'meteor'){
				cell_class = 'meteor';
			}else if(myPlanet.getPos(i,j) == 'alien'){
				cell_class = 'alien';
			}else if(myPlanet.getPos(i,j) == 'mothership'){
				cell_class = 'mothership';
			}
			html += "<div class=\"cell " + cell_class + "\" id=" +i +',' + j +"></div>"; 
		}
		html += "</div>";					
	}

	return html;
}

var setContentDimension = function(dimension){
	new_dim = dimension * CELL_HEIGHT + "px";
	document.getElementById('content').style.height = new_dim;
	document.getElementById('content').style.width = new_dim;
}

var enableCommand = function(mode){
	document.getElementById('command_input').disabled = !mode;
	document.getElementById('command_button').disabled = !mode;
	document.getElementById('command_input').value = '';
}

var showAlert = function(type, message){
	var html = "<span>" + type + ": </span>" + message;
	document.getElementById('alert-box').innerHTML = html;
	document.getElementById('alert-box').className = 'alert-box ' + type;
}

var cleanAlert = function(){
	document.getElementById('alert-box').innerHTML = '';
	document.getElementById('alert-box').className = '';
}

/*
 *	Initialize main objects
 *	Enable items
 */

var myPlanet = new Planet(300, CELL_HEIGHT);
enableCommand(false);

