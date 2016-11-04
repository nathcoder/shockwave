var settings = new Object();
settings.cols = 7;
settings.rows = 7;
settings.ec = (settings.cols * settings.rows) - 2;
settings.max_tile_number = 5;//but we have images for 4+ post-place-piece
settings.max_piece_number = 3;
settings.piece_location = 1;
settings.swipe_in_progress = false;
settings.time_per_round_of_triplets = 500;
settings.score = 0;
settings.sound_state = 0;
settings.random_blocks = 5;

Crafty.init(400,400, document.getElementById('game'));

Crafty.e('Floor, 2D, Canvas, Color')
  .attr({x: 0, y: 160, w: 140, h: 10})
  .color('green');

var ii=0; var pieces = []; var lastTwoRandom = [0,0];
var dropPieceArrInit = [];
for(var i=0; i<settings.cols * settings.rows; i++){
	/*setTimeout(function(){
		dropPiece(ii%7);ii++;
	}, i*45);*/
	dropPieceArrInit.push({"col":i%7,"index":i});
}
dropPieces(dropPieceArrInit, 45, -1);

function dropPiece(x, where, tileValue){
	var piece = Crafty.e('2D, Canvas, Color, Fourway, Gravity, Floor')
	  .attr({x: x*20, y: 0, w: 20, h: 20})
	  .color('#F00')
	  .gravity('Floor');
	  
	//set value of tile
	Crafty.defineField(piece, "tileValue", function() {
	   return this._tileValue;
	}, function(newValue) {
	   this._tileValue = newValue;
	});
	piece.tileValue = tileValue;
	console.log(piece.tileValue);
	
	//if index specified, insert there; else, add to pieces (init)
	if(typeof where !== "undefined") {
		pieces[where] = piece;
	} else {
		pieces.push(piece);
	}
}

function clearTriplet(pos){
	for(var i=pos; i<pos+3; i++){
		pieces[i].destroy();
		for(var j=i+7; j<settings.rows*settings.cols; j+=7){
			if(j==i+7){pieces[j].color('#ccc').gravity('Floor');}
			pieces[j-7] = pieces[j];
			pieces[j] = undefined;
		}
	}
	//re-index + add new pieces
	var dropPieceArr = [];
	for(var i=0; i<pieces.length; i++){
		var piece = pieces[i];
		if(piece == undefined){
			dropPieceArr.push({"col":i%7,"index":i});
		}
	}
	setTimeout(function(){
		dropPieces(dropPieceArr, 45, -1);
	},2000);
}

function dropPieces(arr, separation, stagger){
	ii=0;
	for(var i=0; i<arr.length; i++){
		setTimeout(function(){
			dropPiece(arr[ii].col,arr[ii].index,getTv(arr[ii].index));
			ii++;
		}, (i*separation)+(i*stagger));
	}
}

function getTv(i){
	var redundant = true;
	while(redundant){
		var tryReturn = Crafty.math.randomInt(1, 5);
		if((i>1 && pieces[i-1] != undefined && pieces[i-2] != undefined && pieces[i-1].tileValue == pieces[i-2].tileValue && pieces[i-1].tileValue == tryReturn) || (i<settings.ec && pieces[i+1] != undefined && pieces[i+2] != undefined && pieces[i+1].tileValue == pieces[i+2].tileValue && pieces[i+1].tileValue == tryReturn)){
			redundant = true;//keep going
		} else {
			if((pieces[0] != undefined && pieces[1] != undefined && pieces[2] != undefined && pieces[0].tileValue == pieces[1].tileValue && pieces[1].tileValue == pieces[2].tileValue) || (pieces[1] != undefined && pieces[2] != undefined && pieces[3] != undefined && pieces[1].tileValue == pieces[2].tileValue && pieces[2].tileValue == pieces[3].tileValue) || (pieces[46] != undefined && pieces[47] != undefined && pieces[48] != undefined && pieces[46].tileValue == pieces[47].tileValue && pieces[47].tileValue == pieces[48].tileValue) || (pieces[45] != undefined && pieces[46] != undefined && pieces[47] != undefined && pieces[45].tileValue == pieces[46].tileValue && pieces[46].tileValue == pieces[47].tileValue)){
				redundant = true;//keep going, edgecase
			} else {
				redundant = false;//stop, return current tryReturn
			}
		}
	}
	//reset last2
	lastTwoRandom[0] = lastTwoRandom[1]; lastTwoRandom[1] = tryReturn;
	return tryReturn;
}

function getAbsoluteLocation(position){
	var toReturn = new Object();
	var col = (position % 7 != 0)? (position % 7) : 7;
	var row = Math.ceil(position / 7);
	toReturn.x = ((col-1)*20);
	toReturn.y = ((row-1)*20);
	return toReturn;
}