var MAX_CELLS = 800;
var MIN_CELLS = 100;
var CELL_HEIGHT = 22;

function Player(){
	var x = 0;
	var y = 0;

	this.getX = function(){
		return x;
	}
	this.getY = function(){
		return y;
	}
	this.move = function(new_x, new_y){
		x = new_x;
		y = new_y;

		console.log("Player moves to: " + x + "," + y)
	}
}

function Planet(cells, cell_height) {
	var MAX_CELLS = 800;
	var MIN_CELLS = 100;
	var OBSTACLES_RATIO = 20;
	var side_length = Math.floor(Math.sqrt(cells));

	var cells = cells;
	var cell_height = cell_height;
	var positions = [];

	this.player = new Player();

	this.setPos = function(x,y,value){
		if( typeof positions[x][y] === "undefined"){
			positions[x][y] = value;
		}		
	}
	this.getPos = function(x,y){

		if(typeof positions[x][y] === "undefined"){
			return "&nbsp;";
		}
		return positions[x][y];
	}
	var setCells = function(new_cells){
		if(new_cells < MIN_CELLS){
			cells = MIN_CELLS;
		}else if(new_cells > MAX_CELLS){
			cells = MAX_CELLS;
		}else {
			cells = new_cells;
		}
		side_length = Math.floor(Math.sqrt(cells));		
	}
	var randomObstacle = function(){
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
	var initPositions = function(){
		positions = [];
		for(var i = 1; i <= side_length; i++){
			positions[i] = [];
		}
	}
	var insertPlayer = function(){
		var player_x = Math.floor(Math.random() * side_length +1);
		var player_y = Math.floor(Math.random() * side_length +1);

		positions[player_x][player_y] = "P";
		this.player.move(player_x, player_y);
	}
	var insertMotherShip = function(){

		var ship_landed = false;
		while(!ship_landed){
			var ship_x = Math.floor(Math.random() * side_length +1);
			var ship_y = Math.floor(Math.random() * side_length +1);

			if( typeof positions[ship_x][ship_y] === "undefined"){
				positions[ship_x][ship_y] = "S";
				ship_landed = true;
			}
		}
	}
	var insertObstacles = function(){
		for(var i = 1; i <= side_length; i++){
			for(var j = 1; j <= side_length; j++){
				if( typeof positions[i][j] === "undefined" ){
					positions[i][j] = randomObstacle();
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

		setCells(new_dim);
		initPositions();
		insertPlayer();
		insertMotherShip();
		insertObstacles();

		document.getElementById('planet').innerHTML = draw(side_length);
		setContentDimension(side_length);
	}
	this.checkMove = function(new_x, new_y){
		if( typeof positions[new_x][new_y] !== "undefined"){
			return true;
		}
		return false;
	}

	setCells(cells);
	initPositions();

}

var myPlanet = new Planet(300, 22);


var draw = function(cols){
	html = "";
	for(var i=1; i <= cols; i++){
		html += "<div class=\"row\" id=" +i +">";

		for(var j = 1; j <= cols; j++){
			html += "<div class=\"cell\" id=" +i +',' + j +">";
			html += myPlanet.getPos(i,j);
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

function callkeydownhandler(evnt) {
   var ev = (evnt) ? evnt : event;
   var code=(ev.which) ? ev.which : event.keyCode;
   //alert("El código de la tecla pulsada es: " + code);
   switch(code){
   		case 37:
   			console.log('<-');
   			var actual_x = myPlanet.player.getX();
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
   window.document.attachEvent("onkeydown", callkeydownhandler);
}

