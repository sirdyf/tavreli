var LOGIC = LOGIC || {revision: "v0.0.1"};

function LogicContainer() {
    var funcArrays = null;
    var that = this;
    var cSTATE = {NONE: 0, SOURCE: 1, TARGET: 2, MOVE: 3};
    var state = cSTATE.SOURCE;
    var selectedFigureIndex = null;
    var targetPosition = null;
    var sourceArray = [];
    var cPLAYER = {WHITE: 0, BLACK:1, NONE: 2};
    var player = cPLAYER.WHITE;

    function zeroStep(obj,board){
        console.log('zero step');
        UTILS.removeAllArrowWithArray(board.getAllFigure());
        board.deSelectFigureWithIndex(selectedFigureIndex);
        selectedFigureIndex = null;
    };
    function firstStep(obj,board){
        if (player == cPLAYER.NONE) return;
        var res_ = isFigure(obj,board.getAllFigure());
        if (res_ === false){
            return;
        };
        var topFigure_ = getTopFigureAtPosition(obj,board.getAllFigure());
        var resW = isFigureIndexContaints(topFigure_.figureIndex,board.getWhite());
        var resB = isFigureIndexContaints(topFigure_.figureIndex,board.getBlack());
        if ((player == cPLAYER.WHITE) && (resB === true)){
            return;
        };
        if ((player == cPLAYER.BLACK) && (resW === true)){
            return;
        };
        var figures_ = board.getAllFigure();
        UTILS.removeAllArrowWithArray(figures_);
        board.deSelectFigureWithIndex(selectedFigureIndex);
        selectedFigureIndex = topFigure_.figureIndex;//getFigureIndex(obj,board.getAllFigure());
        board.selectFigureWithIndex(selectedFigureIndex);
        state = cSTATE.TARGET;
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex,board.getAllFigure());

        var availablePositions = UTILS.getMoveArray(figure_,board,false);
        availablePositions = addAdditionPositions(availablePositions,figure_);
        availablePositions = removeAdditionPositions(availablePositions,figure_,board);

        // renderTmpObj(availablePositions);
        UTILS.showAvailablePositions(availablePositions,figure_);
        console.log('figure='+topFigure_);
        var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition,figures_) - 1;
        if (countSrc_ > 0) {
            RENDER.main.showTowerWithPosition(figure_,board);
        };
    };
    function addAdditionPositions(positionsArray,figure){
        var retArray = positionsArray.slice();
        var ind_ = figure.figureIndex;
        if ((ind_ <= 7) && (figure.boardPosition.y == 6)){
            // first step ratnik move at 2 position
            retArray[1].y = figure.boardPosition.y - 2;
        };
        if (((ind_ >= 16)&&(ind_ <= 23)) && (figure.boardPosition.y == 1)){
            // first step ratnik move at 2 position
            retArray[1].y = figure.boardPosition.y + 2;
        };
        return retArray;
    };
    function secondStep(obj,board){
        if (player == cPLAYER.NONE) return;
        var res =  null;
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex,board.getAllFigure());

        var availablePositions = UTILS.getMoveArray(figure_,board,true);//moveArrow
        availablePositions = addAdditionPositions(availablePositions,figure_);
        availablePositions = removeAdditionPositions(availablePositions,figure_,board);

        var flag_ = false;
        for (var i = 0; i < availablePositions.length; i++) {
            if (obj.boardPosition.equals(availablePositions[i])){
                flag_ = true;
                break;
            };
        };
        if (flag_ === false) return;
        state = cSTATE.MOVE;
        // renderTmpObj(availablePositions);
        targetPosition = obj.clone();
        targetPosition.boardPosition = obj.boardPosition.clone();
        var figures_ = board.getAllFigure();
        sourceArray = getAllFiguresAtPosition(figure_.boardPosition,figures_);
        res = isFigure(obj,board.getAllFigure());
        if (res === true){
            var countDest_ = UTILS.getFigureCountAtPosition(obj.boardPosition,figures_);
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition,figures_) - 1;
            var count_ = countSrc_ + countDest_;
            targetPosition.position.y = 0.5 + count_ * 0.5;
        }else{
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition,figures_) - 1;
            targetPosition.position.y = 0.5 + countSrc_ * 0.5;
        };
        RENDER.main.hideTower(board);
    };
    function removeAdditionPositions(positionsArray,figure,board){
        var retArray = [];
        var whiteVolhv = UTILS.getFigureWithIndex(12,board.getWhite());
        var blackVolhv = UTILS.getFigureWithIndex(28,board.getBlack());
        var ind_ = figure.figureIndex;
        for (var i = 0; i < positionsArray.length; i++) {
            if (positionsArray[i].equals(whiteVolhv.boardPosition)){
                continue;
            };
            if (positionsArray[i].equals(blackVolhv.boardPosition)){
                continue;
            };
            if ((ind_ <= 7) || ((ind_ >= 16) && (ind_ <= 23))){ // ratnik
                if (figure.boardPosition.x != positionsArray[i].x){
                    var tmpObj = {};
                    tmpObj.boardPosition = positionsArray[i];
                    if (isFigure(tmpObj,board.getAllFigure()) === false){
                        continue;//skip if no attack
                    };
                };
            };

            retArray.push(positionsArray[i]);
        };
        return retArray;
    };
    function renderTmpObj(posArray){
        for (var i = 0; i < posArray.length; i++) {
            console.log(posArray[i].x + ' ' + posArray[i].z);
        };
    };
    function moveStep(obj,board){
        console.log('move step');
    };
    function getFigureIndex(obj,figureArray){
        for (var i = 0; i < figureArray.length; i++) {
            if (figureArray[i].boardPosition.equals(obj.boardPosition)) {
                return figureArray[i].figureIndex;
            };
        };
        return null;
    };
    function isFigure(obj,figuresArray){
        for (var i = 0; i < figuresArray.length; i++) {
            if (figuresArray[i].boardPosition.equals(obj.boardPosition)) {
                return true;
            };
        };
        return false;
    };
    function isFigureIndexContaints(figureIndex,figuresArray){
        for (var i = 0; i < figuresArray.length; i++) {
            if (figuresArray[i].figureIndex == figureIndex){
                return true;
            };
        };
        return false;
    };
    function getAllFiguresAtPosition(position,figuresArray){
        var figures_ = [];
        for (var i = 0; i < figuresArray.length; i++) {
            if (figuresArray[i].boardPosition.equals(position)) {
                figures_.push(figuresArray[i]);
            };
        };
        return figures_;
    };
    function getTopFigureAtPosition(figure,figuresArray){
        var figures_ = getAllFiguresAtPosition(figure.boardPosition,figuresArray);
        if (figures_.length < 1) {return null;};
        var maxZFigure_ = figures_[0];
        for (var i = 1; i < figures_.length; i++) {
            if (figures_[i].position.y > maxZFigure_.position.y){
                maxZFigure_ = figures_[i];
            };
        };
        return maxZFigure_;
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
            var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
            var dist = figure_.position.distanceTo(targetPosition.position);
            if (dist < 0.1) {
                state = cSTATE.SOURCE;
                normalizeFiguresArray(targetPosition,sourceArray,board);
                zeroStep(null,board);
                if (player == cPLAYER.WHITE) {
                    player = cPLAYER.BLACK;
                }else{
                    player = cPLAYER.WHITE;
                };
                return;
            };
            // figure_.position.lerp(targetPosition.position,0.11);
            moveFiguresArray(sourceArray,targetPosition,board);
        };
    };
    function normalizeFiguresArray(target,figuresArray,board){
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
        for (var i = 0; i < figuresArray.length; i++) {
            figuresArray[i].boardPosition.copy(target.boardPosition);
            figuresArray[i].position.x = figuresArray[i].boardPosition.x - 4 + 0.5;
            figuresArray[i].position.z = figuresArray[i].boardPosition.y - 4 + 0.5;
            var target_ = target.position.clone();
            var delta_ = (figuresArray[i].position.y - figure_.position.y);
            var scale_ = Math.floor(delta_ / 0.51 );
            if (delta_ < 0) scale_ = Math.ceil(delta_ / 0.49 );
            figuresArray[i].position.y = target.position.y + scale_ * 0.5;
        };
    };
    function moveFiguresArray(figuresArray,target,board){
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
        for (var i = 0; i < sourceArray.length; i++) {
            var target_ = target.position.clone();
            var delta_ = (sourceArray[i].position.y - figure_.position.y);
            var scale_ = Math.floor(delta_ / 0.51);
            if (delta_ < 0) scale_ = Math.ceil(delta_ / 0.49 );
            console.log(delta_+' '+scale_);
            target_.y = target.position.y + scale_ * 0.5;
            // console.log(sourceArray[i].position.z - figure_.position.z);
            sourceArray[i].position.lerp(target_,0.0911);
        };
    };
};
LOGIC.main = new LogicContainer();
LOGIC.main.Init();
// console.log(LOGIC);
