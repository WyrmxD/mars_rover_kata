var MAX_CELLS = 800;
var MIN_CELLS = 100;
var CELL_HEIGHT = 22;

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

		console.log("Player moves to: " + x + "," + y)
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
	var MAX_CELLS = 800;
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

		if(typeof positions[x][y] === "undefined"){
			return "&nbsp;";
		}
		return positions[x][y];
	}
	this.setCells = function(new_cells){
		if(new_cells < MIN_CELLS){
			cells = MIN_CELLS;
		}else if(new_cells > MAX_CELLS){
			cells = MAX_CELLS;
		}else {
			cells = new_cells;
		}
		side_length = Math.floor(Math.sqrt(cells));		
	}
	this.randomObstacle = function(){
		option = Math.floor(Math.random() * OBSTACLES_RATIO +1);
		switch(option){
			case 1:
				return "M";
				break;
			case 2:
				return "~";
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

		positions[player_x][player_y] = "P";
		this.player.move(player_x, player_y);
	}
	this.insertMotherShip = function(){

		var ship_landed = false;
		while(!ship_landed){
			var ship_x = Math.floor(Math.random() * side_length +1);
			var ship_y = Math.floor(Math.random() * side_length +1);

			if( typeof positions[ship_x][ship_y] === "undefined"){
				positions[ship_x][ship_y] = "X";
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
		setContentDimension(side_length);
		enableCommand(true);
	}
	this.checkMove = function(new_x, new_y){
		if( positions[new_x][new_y] != 'M' && positions[new_x][new_y] != '~'){
			return true;
		}
		return false;
	}

	this.setCells(cells);
	this.cleanPlanet();
}

var showError = function(message){

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

	var command_string = document.getElementById('command_input').value;

	for(var i = 0; i < command_string.length; i++){
		var com = command_string[i];
		console.log('Processing ' + com);

		var player_x = myPlanet.player.getX();
		var player_y = myPlanet.player.getY();
		var player_facing = myPlanet.player.getFace();
		var side_length = myPlanet.getSideLength();

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
					myPlanet.setPos(myPlanet.player.getX(), myPlanet.player.getY(), null);
					myPlanet.player.move(player_x, player_y);
					myPlanet.setPos(player_x, player_y, 'P');
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
					myPlanet.setPos(myPlanet.player.getX(), myPlanet.player.getY(), null);
					myPlanet.player.move(player_x, player_y);
					myPlanet.setPos(player_x, player_y, 'P');
				}
				break;
			case 'r':
				myPlanet.player.rotateRight();
				break;
			case 'l':
				myPlanet.player.rotateLeft();
				break;
			default:
				showError('bleh');
				break;
		}
		
		myPlanet.player.info();
		document.getElementById('planet').innerHTML = drawPlanet(myPlanet);
	}

	document.getElementById('command_input').value = '';
}

/*
 *	CSS Control Functions
 */

var drawPlanet = function(myPlanet){
	html = "";
	side_length = myPlanet.getSideLength();
	for(var i=1; i <= side_length; i++){
		html += "<div class=\"row\" id=" +i +">";

		for(var j = 1; j <= side_length; j++){
			html += "<div class=\"cell\" id=" +i +',' + j +">";
			html += myPlanet.getPos(j,i);
			html += "</div>";
		}
		html += "</div>";					
	}

	return html;
}

var setContentDimension = function(dimension){
	new_dim = dimension * CELL_HEIGHT + "px";
	document.getElementById('content').style.height = new_dim;
	document.getElementById('content').style.width = new_dim;

	console.log(new_dim);
}

var enableCommand = function(mode){
	document.getElementById('command_input').disabled = !mode;
	document.getElementById('command_button').disabled = !mode;
	document.getElementById('command_input').value = '';
}

/*
 *	Initialize main objects
 *	Enable items
 */

var myPlanet = new Planet(300, 22);
enableCommand(false);

/*function callkeydownhandler(evnt, myPlanet) {
   var ev = (evnt) ? evnt : event;
   var code=(ev.which) ? ev.which : event.keyCode;
   //alert("El código de la tecla pulsada es: " + code);
   switch(code){
   		case 37:
   			console.log('<-');
   			var actual_x = planet.player.getX();
   			var actual_y = myPlanet.player.getY();

   			var result = myPlanet.checkMove(actual_x-1, actual_y);
   			if(result){
   				myPlanet.player.moves(actual_x-1, actual_y);
   				console.log("Player moved: " + myPlanet.player.getX + "," + myPlanet.player.getY);
   			}else{
   				console.log("Player cannot move there.");
   			}
   			
   			break;
   		case 38:
   			console.log('^');
   			break;
   		case 39:
   			console.log('->');
   			break;
   		case 40:
   			console.log('_');
   			break;
   		default:
   			break;
   }
}
if (window.document.addEventListener) {
   window.document.addEventListener("keydown", callkeydownhandler, false);
} else {
   window.document.attachEvent("onkeydown", callkeydownhandler(evnt,myPlanet));
}*/