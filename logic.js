var LOGIC = LOGIC || {revision: "v0.0.1"};

function Container() {
	var funcArrays = null;
	var that = this;
    var cSTATE = {NONE: 0, SOURCE: 1, TARGET: 2};
    var state = cSTATE.NONE;

	function firstStep(obj,board){
		var res = isFigure(obj,board.getWhite());
		if (res === true){
			board.selectFigureWithIndex(getFigureIndex(obj,board.getWhite()));
		};
		console.log('figure='+res);
	};
	function getFigureIndex(obj,figureArray){
		for (var i = 0; i < figureArray.length; i++) {
			if (figureArray[i].position.equals(obj)) {
				return figureArray[i].figureIndex;
			};
		};
		return null;
	};
	function isFigure(obj,figureArray){
		for (var i = 0; i < figureArray.length; i++) {
			if (figureArray[i].position.equals(obj)) {
				return true;
			};
		};
		return false;
	};
	this.Init = function(){

		funcArrays=[firstStep];
	};
	this.ClickOnObject = function(obj,board){
		if (obj === undefined) return;
		funcArrays[state](obj,board);
	};
};
LOGIC.main = new Container();
LOGIC.main.Init();
// console.log(LOGIC);
