var LOGIC = LOGIC || {revision: "v0.0.1"};

function LogicContainer() {
	var funcArrays = null;
	var that = this;
    var cSTATE = {NONE: 0, SOURCE: 1, TARGET: 2, MOVE: 3};
    var state = cSTATE.SOURCE;
    var selectedFigureIndex = null;
    var targetPosition = null;

	function zeroStep(obj,board){
		console.log('zero step');
	};
	function firstStep(obj,board){
		var res = isFigure(obj,board.getWhite());
		if (res === true){
			selectedFigureIndex = getFigureIndex(obj,board.getWhite());
			board.selectFigureWithIndex(selectedFigureIndex);
			state = cSTATE.TARGET;
			var figure_ = getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
			var availablePosition = UTILS.getMoveArray(figure_,board);
		};
		console.log('figure='+res);
	};
	function secondStep(obj,board){
		var figure_ = getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
		// if (figure_.position.equals(obj)){
		// 	board.deSelectFigureWithIndex(selectedFigureIndex);
		// 	state = cSTATE.NONE;
		// 	return;
		// };
		// TODO
		state = cSTATE.MOVE;
		var availablePosition = UTILS.getMoveArray(figure_,board);//moveArrow
	};
	function moveStep(obj,board){
		console.log('move step');
	};
	function getFigureWithIndex(index,figureArray){
		for (var i = 0; i < figureArray.length; i++) {
			if (figureArray[i].figureIndex == index) {
				return figureArray[i];
			};
		};
		return null;
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
		funcArrays=[zeroStep, firstStep, secondStep, moveStep];
	};
	this.ClickOnObject = function(obj,board){
		if (obj === undefined) return;
		funcArrays[state](obj,board);
	};
	this.RenderStep = function(){};
};
LOGIC.main = new LogicContainer();
LOGIC.main.Init();
// console.log(LOGIC);
