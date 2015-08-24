var LOGIC = LOGIC || {revision: "v0.1.2"};

function LogicContainer() {
    var funcArrays = null;
    var that = this;
    var cSTATE = {NONE: 0, SOURCE: 1, TARGET: 2, MOVE: 3, EXTERNAL: 4};
    var state = cSTATE.SOURCE;
    var selectedFigureIndex = null;
    var targetPosition = null;
    var sourceArray = [];
    var cPLAYER = {WHITE: 0, BLACK:1, NONE: 2};
    var player = cPLAYER.WHITE;
    var curStep = null;

    var _steps = [];

    this.getLastStep = function(){
        if (_steps.length < 1 ) return "";
        return _steps[_steps.length - 1];
    };
    this.getCurrentStepNum = function(){
        return _steps.length;
    };
    this.getCurrentState = function(){
        return state;
    };
    this.getCurrentPlayer = function(){
        if (player == cPLAYER.WHITE ) {
            return "White";
        }else if (player == cPLAYER.BLACK){
            return "Black";
        }
        return cPLAYER.NONE;
    };
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
        availablePositions = addAdditionPositions(availablePositions,figure_,board,false);
        availablePositions = removeAdditionPositions(availablePositions,figure_,board);

        // renderTmpObj(availablePositions);
        UTILS.showAvailablePositions(availablePositions,figure_);
        console.log('figure='+topFigure_);
        var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition,figures_) - 1;
        if (countSrc_ > 0) {
            RENDER.main.showTowerWithPosition(figure_,board);
        };
        console.log(PARSER.main.getNotationFromStep(figure_.boardPosition));
        curStep = PARSER.main.getNotationFromStep(figure_.boardPosition);
    };
    function addAdditionPositions(positionsArray,figure,board,isAllPositionsNeed){
        var retArray = positionsArray.slice();
        var ind_ = figure.figureIndex;
        var max_ = board.getWhiteMaxIndex();
        if ((ind_ <= 7) && (figure.boardPosition.y == 6)){
            // first step ratnik move at 2 position
            retArray[1].y = figure.boardPosition.y - 2;
        };
        if (((ind_ >= max_)&&(ind_ <= max_ + 7)) && (figure.boardPosition.y == 1)){//todo
            // first step ratnik move at 2 position
            retArray[1].y = figure.boardPosition.y + 2;
        };
        if ((ind_ == 20) || (ind_ == max_ + 20)) {//helgi
            // var moves_ = figure_.main.getMoveRule();
            var main_ = new VsadnikContainer();
            var extendAvailablePosition = UTILS.getMoveArrayExt(main_,figure.boardPosition,board,false);
            // retArray.concat(extendAvailablePosition);
            if (isAllPositionsNeed === false){
                for (var i = 8; i < retArray.length; i++) {
                    retArray[i].copy(extendAvailablePosition[i-8]);
                };
            }else{
                for (var i = 0; i < extendAvailablePosition.length; i++) {
                    var nw_ = extendAvailablePosition[i].clone();
                    retArray.push(nw_);
                };
            };
        };
        if ((ind_ == 12) || (ind_ == max_ + 12)){//volhv
            if (isRokirovkaAvailable(board,false) === true){
                retArray.push(new THREE.Vector2(figure.boardPosition.x + 2,figure.boardPosition.y));
            };
            if (isRokirovkaAvailable(board,true) === true){
                retArray.push(new THREE.Vector2(figure.boardPosition.x - 2,figure.boardPosition.y));
            };
        };
        return retArray;
    };
    function isRokirovkaAvailable(board, isShort){
        var delta_ = 0,horizontal_ = 7;
        var max_ = board.getWhiteMaxIndex();
        if (player == cPLAYER.BLACK ) {
            delta_ = max_;
            horizontal_ = 0;
        };
        var volhv_ = UTILS.getFigureWithIndex(delta_ + 12, board.getAllFigure());
        var volhvPos_ = volhv_.boardPosition;
        if ((volhvPos_.x == 4) && (volhvPos_.y == horizontal_)){
            var availablePositions_ = getHorizontalAvailablePositions(volhv_,board);
            var short_ = 8;
            if (isShort === false) short_ = 15;
            var flag_ = isFigureIndexContaintsAtPositionsArray(delta_ + short_,availablePositions_,board);
            return flag_;
        };
        return false;
    };
    function getHorizontalAvailablePositions(figure, board){
        var horizontal_ = new HorizontalContainer();
        var availablePositions_ = UTILS.getMoveArrayExt(horizontal_,figure.boardPosition,board,false);
        return availablePositions_;
    };
    function secondStep(obj,board){
        if (player == cPLAYER.NONE) return;
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
        var res = isFigure(obj,board.getAllFigure());
        if (res === true) {
            if (figure_.boardPosition.equals(obj.boardPosition)){
                state = cSTATE.SOURCE;
                zeroStep(null,board);
                RENDER.main.hideTower(board);
                return;
            };
        };

        var availablePositions = UTILS.getMoveArray(figure_,board,true);//moveArrow
        availablePositions = addAdditionPositions(availablePositions,figure_,board,true);
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

        // rokirovka
        var max_ = board.getWhiteMaxIndex();
        var figureDelta_ = 0;
        var ind_ = figure_.figureIndex;
        if (ind_ > max_) figureDelta_ = max_;
        if ((ind_ == 12) || (ind_ == max_ + 12)){//volhv
            var delta_ = obj.boardPosition.x - figure_.boardPosition.x;
            if (Math.abs(delta_) == 2){
                var fIndex_ = 8;
                if (delta_ > 0) {
                    fIndex_ = 15;
                };
                var targetFigure_ = UTILS.getFigureWithIndex(fIndex_ + figureDelta_,board.getAllFigure());
                var figures_ = getAllFiguresAtPosition(targetFigure_.boardPosition,board.getAllFigure());
                for (var i = 0; i < figures_.length; i++) {
                    figures_[i].position.x = figure_.position.x + (delta_ / 2.0);
                    figures_[i].boardPosition.x = figure_.boardPosition.x + (delta_ / 2.0);
                };
            };
        };

        // renderTmpObj(availablePositions);
        targetPosition = obj.clone();
        targetPosition.boardPosition = obj.boardPosition.clone();
        var figures_ = board.getAllFigure();

        sourceArray = getAllFiguresAtPosition(figure_.boardPosition,figures_);
        sourceArray = RENDER.main.getTowerUpFigures(sourceArray);
        
        res = isFigure(obj,board.getAllFigure());
        if (res === true){
            var countDest_ = UTILS.getFigureCountAtPosition(obj.boardPosition,figures_);
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition,figures_) - 1;
            countSrc_ -= RENDER.main.getTowerIndex();
            var count_ = countSrc_ + countDest_;
            targetPosition.position.y = 0.5 + count_ * 0.5;
        }else{
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition,figures_) - 1;
            countSrc_ -= RENDER.main.getTowerIndex();
            targetPosition.position.y = 0.5 + countSrc_ * 0.5;
        };
        if (RENDER.main.getTowerIndex() > 0){
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition,figures_);
            curStep += "(" + (countSrc_ - RENDER.main.getTowerIndex()) + ")";
        };
        RENDER.main.hideTower(board);
        var step2_ = PARSER.main.getNotationFromStep(obj.boardPosition); 
        _steps.push(curStep + "-"  + step2_);
        console.log("Push: " + curStep + "-"  + step2_);
        console.log("current step = " + that.getCurrentStepNum());
    };
    function removeAdditionPositions(positionsArray,figure,board){
        var retArray = [];
        var max_ = board.getWhiteMaxIndex();
        var whiteVolhv = UTILS.getFigureWithIndex(12,board.getWhite());
        var blackVolhv = UTILS.getFigureWithIndex(max_ + 12,board.getBlack());
        var ind_ = figure.figureIndex;
        for (var i = 0; i < positionsArray.length; i++) {
            // if (positionsArray[i].equals(whiteVolhv.boardPosition)){
            //     continue;
            // };
            // if (positionsArray[i].equals(blackVolhv.boardPosition)){
            //     continue;
            // };
            // if ((ind_ <= 7) || ((ind_ >= 16) && (ind_ <= 23))){ // ratnik
            if (board.isFigureRatnik(ind_)){
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
    function isFigureIndexContaintsAtPositionsArray(figureIndex,figuresPositionsArray,board){
        var figure_ = UTILS.getFigureWithIndex(figureIndex,board.getAllFigure());
        for (var i = 0; i < figuresPositionsArray.length; i++) {
            if (figuresPositionsArray[i].equals(figure_.boardPosition)){
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
    this.Init = function(externalFunc){
        funcArrays=[zeroStep, firstStep, secondStep, moveStep, externalFunc];
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
                funcArrays[cSTATE.EXTERNAL]();
                state = cSTATE.SOURCE;
                normalizeFiguresArray(targetPosition,sourceArray,board);
                zeroStep(null,board);
                if (player == cPLAYER.WHITE) {
                    player = cPLAYER.BLACK;
                }else{
                    player = cPLAYER.WHITE;
                };
                checkRuleAfterStep(board);
                return;
            };
            // figure_.position.lerp(targetPosition.position,0.11);
            moveFiguresArray(sourceArray,targetPosition,board);
        };
    };
    function checkRuleAfterStep(board){
        var figures_ = board.getAllFigure();
        var maxWhiteIndex_ = board.getWhiteMaxIndex();
        for (var i = 0; i < figures_.length; i++) {
            if (board.isFigureRatnik(figures_[i].figureIndex)){
                var ind_ = figures_[i].figureIndex;
                if (ind_ < maxWhiteIndex_ ){
                    if (figures_[i].boardPosition.y == 0){
                        board.convertRatnikWithIndex(ind_);
                    };
                }else{
                    if (figures_[i].boardPosition.y == 7){
                        board.convertRatnikWithIndex(ind_);
                    };
                };
            };
        };
    };

    function normalizeFiguresArray(target,figuresArray,board){
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
        for (var i = 0; i < figuresArray.length; i++) {
            figuresArray[i].boardPosition.copy(target.boardPosition);
            figuresArray[i].position.x = figuresArray[i].boardPosition.x - 4 + 0.5;
            figuresArray[i].position.z = figuresArray[i].boardPosition.y - 4 + 0.5;
            var target_ = target.position.clone();
            var scale_ = - sourceArray[i].indexY;
            figuresArray[i].position.y = target.position.y + scale_ * 0.5;
        };
    };
    function moveFiguresArray(figuresArray,target,board){
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex,board.getAllFigure());
        for (var i = 0; i < sourceArray.length; i++) {
            var target_ = target.position.clone();
            var scale_ = - sourceArray[i].indexY;
            // console.log(scale_);
            target_.y = target.position.y + scale_ * 0.5;
            sourceArray[i].position.lerp(target_,0.0911);
        };
    };
};
