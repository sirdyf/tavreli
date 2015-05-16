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
			UTILS.removeAllArrowWithArray(board.getAllFigure());
			board.deSelectFigureWithIndex(selectedFigureIndex);
			selectedFigureIndex = getFigureIndex(obj,board.getWhite());
			board.selectFigureWithIndex(selectedFigureIndex);
			state = cSTATE.TARGET;
			var figure_ = getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
			var availablePositions = UTILS.getMoveArray(figure_,board,false);
			renderTmpObj(availablePositions);
			UTILS.showAvailablePositions(availablePositions,figure_);
		};
		console.log('figure='+res);
	};
	function secondStep(obj,board){
		var res = isFigure(obj,board.getWhite());
		if (res === true){
			firstStep(obj,board);
			return;
		};
		res = isFigure(obj,board.getBlack());
		if (res === true) {
			return;
		};
		// if (figure_.position.equals(obj)){
		// 	board.deSelectFigureWithIndex(selectedFigureIndex);
		// 	state = cSTATE.NONE;
		// 	return;
		// };
		// TODO
		state = cSTATE.MOVE;
		var figure_ = getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
		var availablePositions = UTILS.getMoveArray(figure_,board,true);//moveArrow
		// renderTmpObj(availablePositions);
		targetPosition = obj.clone();
		targetPosition.boardPosition = obj.boardPosition.clone();
	};
	function renderTmpObj(posArray){
		for (var i = 0; i < posArray.length; i++) {
			console.log(posArray[i].x + ' ' + posArray[i].y);
		};
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
			if (figureArray[i].boardPosition.equals(obj.boardPosition)) {
				return figureArray[i].figureIndex;
			};
		};
		return null;
	};
	function isFigure(obj,figureArray){
		for (var i = 0; i < figureArray.length; i++) {
			if (figureArray[i].boardPosition.equals(obj.boardPosition)) {
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
	this.RenderStep = function(board){
		if (state == cSTATE.MOVE) {
			var figure_ = getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
			var dist = figure_.position.distanceTo(targetPosition.position);
			if (dist < 0.1) {
				state = cSTATE.NONE;
				figure_.boardPosition.copy(targetPosition.boardPosition);
//             chess.position.x = (i % 8) - 4 + .5;
//             chess.position.y = 1 - 4 + .5;
console.log('y:'+figure_.boardPosition.y +'_'+ figure_.position.y +' ' + targetPosition.position.y)
				figure_.position.x = figure_.boardPosition.x - 4 + 0.5;
				figure_.position.y = figure_.boardPosition.y - 4 + 0.5;
			};
			figure_.position.lerp(targetPosition.position,0.11);
		};
	};
};
LOGIC.main = new LogicContainer();
LOGIC.main.Init();
// console.log(LOGIC);
