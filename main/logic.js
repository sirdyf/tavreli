
var LOGIC = LOGIC || {
    revision: "v0.1.2"
};

if (typeof module === 'object') {
    module.exports = LOGIC;
}

// function LogicContainer() {
LOGIC.LogicContainer = function() {
    var funcArrays = null;
    var that = this;
    var cSTATE = {
        NONE: 0,
        SOURCE: 1,
        TARGET: 2,
        MOVE: 3,
        EXTERNAL: 4
    };
    var state = cSTATE.SOURCE;
    var selectedFigureIndex = null;
    var targetPosition = null;
    var sourceArray = [];
    var cPLAYER = {
        WHITE: 0,
        BLACK: 1,
        NONE: 2
    };
    var player = cPLAYER.WHITE;
    var curStep = null;

    var _steps = [];

    var _testBoard = null;
// TODO: var testBoard = board.copy(); 
    this.setTestBoard = function(testBoard){
        _testBoard = testBoard;
    };

    this.getLastStep = function() {
        if (_steps.length < 1) return "";
        return _steps[_steps.length - 1];
    };
    this.getCurrentStepNum = function() {
        return _steps.length;
    };
    this.getCurrentState = function() {
        return state;
    };
    this.getSelectedFigureIndex = function() {
        return selectedFigureIndex;
    };
    this.getCurrentPlayer = function() {
        if (player == cPLAYER.WHITE) {
            return "White";
        } else if (player == cPLAYER.BLACK) {
            return "Black";
        }
        return cPLAYER.NONE;
    };

    function zeroStep(obj, board) {
        console.log('zero step');
        UTILS.removeAllArrowWithArray(board.getAllFigure());
        board.deSelectFigureWithIndex(selectedFigureIndex);
        selectedFigureIndex = null;
    };

    function firstStep(obj, board) {
        if (player == cPLAYER.NONE) return;
        var res_ = isFigureAtPosition(obj.boardPosition, board.getAllFigure());
        if (res_ === false) {
            return;
        };
        var topFigure_ = that.getTopFigureAtPosition(obj, board.getAllFigure());
        var resW = isFigureIndexContaints(topFigure_.figureIndex, board.getWhite());
        var resB = isFigureIndexContaints(topFigure_.figureIndex, board.getBlack());
        if ((player == cPLAYER.WHITE) && (resB === true)) {
            return;
        };
        if ((player == cPLAYER.BLACK) && (resW === true)) {
            return;
        };
        var figures_ = board.getAllFigure();
        UTILS.removeAllArrowWithArray(figures_);
        board.deSelectFigureWithIndex(selectedFigureIndex);
        selectedFigureIndex = topFigure_.figureIndex; //getFigureIndex(obj,board.getAllFigure());
        board.selectFigureWithIndex(selectedFigureIndex);
        state = cSTATE.TARGET;
        var availablePositions = that.getAllPositionsForFigure(selectedFigureIndex, board);
        if (selectedFigureIndex === 12) {
            availablePositions = that.removeAttackedPosition(availablePositions, cPLAYER.WHITE, board);
        };
        var max_ = board.getWhiteMaxIndex();
        if (selectedFigureIndex === 12 + max_) {
            availablePositions = that.removeAttackedPosition(availablePositions, cPLAYER.BLACK, board);
        };
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
        // renderTmpObj(availablePositions);
        UTILS.showAvailablePositions(availablePositions, figure_);
        // console.log('figure=' + topFigure_);
        var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition, figures_) - 1;
        if (countSrc_ > 0) {
            RENDER.main.showTowerWithPosition(figure_, board);
        };
        // console.log(PARSER.main.getNotationFromStep(figure_.boardPosition));
        curStep = PARSER.main.getNotationFromStep(figure_.boardPosition);
    };
    this.getAllPositionsForFigure = function(figureIndex, board, forPlayer, isNeedAllPositions) {
        if ((isNeedAllPositions === undefined) || (isNeedAllPositions === null)) {
            isNeedAllPositions = false;
        };
        var player_ = player;
        if (forPlayer !== undefined) {
            player_ = forPlayer;
        };
        // console.log("-----getAllFigure");
        // console.log(board.getAllFigure());
        var figure_ = UTILS.getFigureWithIndex(figureIndex, board.getAllFigure());
        // console.log("-----");
        // console.log(figure_);
        var availablePositions_ = UTILS.getMoveArray(figure_, board, isNeedAllPositions);
        availablePositions_ = that.addAdditionPositions(availablePositions_, figure_, board, isNeedAllPositions);
        availablePositions_ = that.removeAdditionPositions(availablePositions_, figure_, board, player_);
        var tmpPositions_ = availablePositions_.concat();
        var availablePositions_ = [];
        for (var i = tmpPositions_.length - 1; i >= 0; i--) {
            availablePositions_ = addPosition(availablePositions_, tmpPositions_[i]);
        };
        return availablePositions_;
    };

    function addPosition(posArray, newPos) {
        var retArray = posArray.concat();
        var isUnique = true;
        for (var i = posArray.length - 1; i >= 0; i--) {
            if (posArray[i].equals(newPos)) {
                isUnique = false;
                break;
            }
        };
        if (isUnique) {
            retArray.push(newPos);
        };
        return retArray;
    };
    this.addAdditionPositions = function(positionsArray, figure, board, isAllPositionsNeed) {
        var retArray = positionsArray.slice();
        var ind_ = figure.figureIndex;
        var max_ = board.getWhiteMaxIndex();
        // ---------- RATNIK AT LINE 6
        if ((ind_ <= 7) && (figure.boardPosition.y == 6)) {
            var checkPosition_ = {};
            checkPosition_.boardPosition = new THREE.Vector2(figure.boardPosition.x, 5);
            if (isFigure(checkPosition_, board.getAllFigure()) === false) {
                // first step ratnik move at 2 position
                retArray[1].y = figure.boardPosition.y - 2;
            };
        };
        if (((ind_ >= max_) && (ind_ <= max_ + 7)) && (figure.boardPosition.y == 1)) {
            var checkPosition_ = {};
            checkPosition_.boardPosition = new THREE.Vector2(figure.boardPosition.x, 2);
            if (isFigure(checkPosition_, board.getAllFigure()) === false) {
                // first step ratnik move at 2 position
                retArray[1].y = figure.boardPosition.y + 2;
            };
        };
        // ---------- HELGI
        if ((ind_ == 20) || (ind_ == max_ + 20)) { //helgi
            var main_ = new FIGURES.VsadnikContainer();
            var extendAvailablePosition = UTILS.getMoveArrayExt(main_, figure.boardPosition, board, false);
            // console.log(extendAvailablePosition);
            if (isAllPositionsNeed === false) {
                for (var i = 8; i < retArray.length; i++) {
                    retArray[i].copy(extendAvailablePosition[i - 8]);
                };
            } else {
                for (var i = 0; i < extendAvailablePosition.length; i++) {
                    var nw_ = extendAvailablePosition[i].clone();
                    retArray.push(nw_);
                };
            };
        };
        // ---------- VOLHV
        if ((ind_ == 12) || (ind_ == max_ + 12)) { //volhv
            if (isRokirovkaAvailable(board, false) === true) {
                retArray.push(new THREE.Vector2(figure.boardPosition.x + 2, figure.boardPosition.y));
            };
            if (isRokirovkaAvailable(board, true) === true) {
                retArray.push(new THREE.Vector2(figure.boardPosition.x - 2, figure.boardPosition.y));
            };
        };
        return retArray;
    };

    function isRokirovkaAvailable(board, isShort) {
        var delta_ = 0,
            horizontal_ = 7;
        var max_ = board.getWhiteMaxIndex();
        if (player == cPLAYER.BLACK) {
            delta_ = max_;
            horizontal_ = 0;
        };
        var volhv_ = UTILS.getFigureWithIndex(delta_ + 12, board.getAllFigure());
        var volhvPos_ = volhv_.boardPosition;
        if ((volhvPos_.x == 4) && (volhvPos_.y == horizontal_)) {
            var availablePositions_ = getHorizontalAvailablePositions(volhv_, board);
            var short_ = 8;
            if (isShort === false) short_ = 15;
            var flag_ = isFigureIndexContaintsAtPositionsArray(delta_ + short_, availablePositions_, board);
            return flag_;
        };
        return false;
    };

    function getHorizontalAvailablePositions(figure, board) {
        var horizontal_ = new FIGURES.HorizontalContainer();
        var availablePositions_ = UTILS.getMoveArrayExt(horizontal_, figure.boardPosition, board, false);
        return availablePositions_;
    };

    function secondStep(obj, board) {
        if (player == cPLAYER.NONE) return;
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
        var res = isFigure(obj, board.getAllFigure());
        if (res === true) {
            if (figure_.boardPosition.equals(obj.boardPosition)) {
                state = cSTATE.SOURCE;
                zeroStep(null, board);
                RENDER.main.hideTower(board);
                return;
            };
        };

        var availablePositions = UTILS.getMoveArray(figure_, board, true); //moveArrow
        availablePositions = that.addAdditionPositions(availablePositions, figure_, board, true);
        availablePositions = that.removeAdditionPositions(availablePositions, figure_, board);

        if (figure_.figureIndex === 12) {
            availablePositions = that.removeAttackedPosition(availablePositions, cPLAYER.WHITE, board);
        };
        var max_ = board.getWhiteMaxIndex();
        if (figure_.figureIndex === 12 + max_) {
            availablePositions = that.removeAttackedPosition(availablePositions, cPLAYER.BLACK, board);
        };
        var flag_ = false;
        for (var i = 0; i < availablePositions.length; i++) {
            if (obj.boardPosition.equals(availablePositions[i])) {
                flag_ = true;
                break;
            };
        };
        if (flag_ === false) return;

// TODO: var testBoard = board.copy(); 
        if (_testBoard === 'undefined') {
            console.log("ERROR!");
            return;
        }
        _testBoard.SetFigures([],[]);
        // console.log("***************** " + _testBoard.getWhite().length);
        var allFree_ = board.getFreeAll();
        for (var i = allFree_.length - 1; i >= 0; i--) {
            var tmpIndex = allFree_[i].figureIndex;
            var tmpPosition = allFree_[i].boardPosition.clone();
            _testBoard.addTestFigure(tmpIndex, tmpPosition);
        };
        // _testBoard.SetFigures(board.getWhite(),board.getBlack());
        var testFigure_ = UTILS.getFigureWithIndex(selectedFigureIndex, _testBoard.getAllFigure());
        testFigure_.boardPosition = obj.boardPosition.clone();

        if (that.isCheck(_testBoard, player)) {
            console.log("Check!!");
            return;
        };

        state = cSTATE.MOVE;

        // rokirovka
        var max_ = board.getWhiteMaxIndex();
        var figureDelta_ = 0;
        var ind_ = figure_.figureIndex;
        if (ind_ > max_) figureDelta_ = max_;
        if ((ind_ == 12) || (ind_ == max_ + 12)) { //volhv
            var delta_ = obj.boardPosition.x - figure_.boardPosition.x;
            if (Math.abs(delta_) == 2) {
                var fIndex_ = 8;
                if (delta_ > 0) {
                    fIndex_ = 15;
                };
                var targetFigure_ = UTILS.getFigureWithIndex(fIndex_ + figureDelta_, board.getAllFigure());
                var figures_ = that.getAllFiguresAtPosition(targetFigure_.boardPosition, board.getAllFigure());
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
        sourceArray = that.getAllFiguresAtPosition(figure_.boardPosition, figures_);
        sourceArray = RENDER.main.getTowerUpFigures(sourceArray);

        res = isFigure(obj, board.getAllFigure());
        if (res === true) {
            var countDest_ = UTILS.getFigureCountAtPosition(obj.boardPosition, figures_);
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition, figures_) - 1;
            countSrc_ -= RENDER.main.getTowerIndex();
            var count_ = countSrc_ + countDest_;
            targetPosition.position.y = 0.5 + count_ * 0.5;
        } else {
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition, figures_) - 1;
            countSrc_ -= RENDER.main.getTowerIndex();
            targetPosition.position.y = 0.5 + countSrc_ * 0.5;
        };

        if (RENDER.main.getTowerIndex() > 0) {
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition, figures_);
            curStep += "(" + (countSrc_ - RENDER.main.getTowerIndex()) + ")";
        };
        RENDER.main.hideTower(board);
        var step2_ = PARSER.main.getNotationFromStep(obj.boardPosition);
        _steps.push(curStep + "-" + step2_);
        console.log("Push: " + curStep + "-" + step2_);
        console.log("current step = " + that.getCurrentStepNum());
    };
    this.removeAdditionPositions = function(positionsArray, figure, board, forPlayer) {
        var player_ = player;
        if (forPlayer !== undefined) {
            player_ = forPlayer;
        };
        var retArray = [];
        var max_ = board.getWhiteMaxIndex();
        var whiteVolhv = UTILS.getFigureWithIndex(12, board.getWhite());
        var blackVolhv = UTILS.getFigureWithIndex(max_ + 12, board.getBlack());
        var ind_ = figure.figureIndex;
        for (var i = 0; i < positionsArray.length; i++) {
            // ------
            if (whiteVolhv && blackVolhv) {
                // step over volhv not permitted
                if (player_ == cPLAYER.WHITE) {
                    if (positionsArray[i].equals(whiteVolhv.boardPosition)) {
                        continue;
                    };
                } else {
                    if (positionsArray[i].equals(blackVolhv.boardPosition)) {
                        continue;
                    };
                };
            };
            // ---------- RATNIK
            if (board.isFigureRatnik(ind_)) {
                // remove diagonal position if there not available figure
                // (no atack positions)
                if (figure.boardPosition.x != positionsArray[i].x) {
                    if (isPositionsArrayHaveEnemyFigures(figure, positionsArray[i], board) === false) {
                        continue; //skip if no attack
                    };
                } else {
                    if (isPositionsArrayHaveEnemyFigures(figure, positionsArray[i], board) === true) {
                        continue; //skip if enemy front
                    };
                };
            };

            retArray.push(positionsArray[i]);
        };
        return retArray;
    };

    function isPositionsArrayHaveEnemyFigures(figure, position, board) {
        var tmpObj = {};
        tmpObj.boardPosition = position.clone();
        var max_ = board.getWhiteMaxIndex();
        var checkFiguresArray_ = null;
        if (figure.figureIndex < max_) {
            checkFiguresArray_ = board.getFreeBlack();
        } else {
            checkFiguresArray_ = board.getFreeWhite();
        };
        return isFigure(tmpObj, checkFiguresArray_);
    };

    function renderTmpObj(posArray) {
        for (var i = 0; i < posArray.length; i++) {
            console.log(posArray[i].x + ' ' + posArray[i].z);
        };
    };

    function moveStep(obj, board) {
        console.log('move step');
    };
    this.getFigureIndex = function(obj, figureArray) {
        for (var i = 0; i < figureArray.length; i++) {
            if (figureArray[i].boardPosition.equals(obj.boardPosition)) {
                return figureArray[i].figureIndex;
            };
        };
        return null;
    };

    function isFigure(obj, figuresArray) {
        for (var i = 0; i < figuresArray.length; i++) {
            if (figuresArray[i].boardPosition.equals(obj.boardPosition)) {
                return true;
            };
        };
        return false;
    };

    function isFigureAtPosition(boardPosition, figuresArray) {
        for (var i = 0; i < figuresArray.length; i++) {
            if (figuresArray[i].boardPosition.equals(boardPosition)) {
                return true;
            };
        };
        return false;
    };

    function isFigureIndexContaints(figureIndex, figuresArray) {
        for (var i = 0; i < figuresArray.length; i++) {
            if (figuresArray[i].figureIndex == figureIndex) {
                return true;
            };
        };
        return false;
    };

    function isFigureIndexContaintsAtPositionsArray(figureIndex, figuresPositionsArray, board) {
        var figure_ = UTILS.getFigureWithIndex(figureIndex, board.getAllFigure());
        if (figure_) {
            for (var i = 0; i < figuresPositionsArray.length; i++) {
                if (figuresPositionsArray[i].equals(figure_.boardPosition)) {
                    return true;
                };
            };
        };
        return false;
    };
    // DEPRECATED
    this.getAllFiguresAtPosition = function(position, figuresArray) {
        var figures_ = [];
        for (var i = 0; i < figuresArray.length; i++) {
            if (figuresArray[i].boardPosition.equals(position)) {
                figures_.push(figuresArray[i]);
            };
        };
        return figures_;
    };
    // DEPRECATED
    this.getTopFigureAtPosition = function(figure, figuresArray) {
        var figures_ = that.getAllFiguresAtPosition(figure.boardPosition, figuresArray);
        if (figures_.length < 1) {
            return null;
        };
        var maxZFigure_ = figures_[0];
        for (var i = 1; i < figures_.length; i++) {
            if (figures_[i].position.y > maxZFigure_.position.y) {
                maxZFigure_ = figures_[i];
            };
        };
        return maxZFigure_;
    };
    this.Init = function(externalFunc) {
        funcArrays = [zeroStep, firstStep, secondStep, moveStep, externalFunc];
    };
    this.ClickOnObject = function(obj, board) {
        if (obj === undefined) return;
        if (board === undefined) return;
        if (board === null) return;
        funcArrays[state](obj, board);
    };
    this.RenderStep = function(board) {
        if (state == cSTATE.MOVE) {
            var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
            var dist = figure_.position.distanceTo(targetPosition.position);
            if (dist < 0.1) {
                funcArrays[cSTATE.EXTERNAL]();
                state = cSTATE.SOURCE;
                normalizeFiguresArray(targetPosition, sourceArray, board);
                zeroStep(null, board);
                if (player == cPLAYER.WHITE) {
                    player = cPLAYER.BLACK;
                } else {
                    player = cPLAYER.WHITE;
                };
                checkRuleAfterStep(board);
                that.isMat(board);
                return;
            };
            // figure_.position.lerp(targetPosition.position,0.11);
            moveFiguresArray(sourceArray, targetPosition, board);
        };
    };

    function checkRuleAfterStep(board) {
        var figures_ = board.getAllFigure();
        var maxWhiteIndex_ = board.getWhiteMaxIndex();
        // Check ratnik on last line
        for (var i = 0; i < figures_.length; i++) {
            if (board.isFigureRatnik(figures_[i].figureIndex)) {
                var ind_ = figures_[i].figureIndex;
                if (ind_ < maxWhiteIndex_) {
                    if (figures_[i].boardPosition.y == 0) {
                        board.convertRatnikWithIndex(ind_);
                    };
                } else {
                    if (figures_[i].boardPosition.y == 7) {
                        board.convertRatnikWithIndex(ind_);
                    };
                };
            };
        };
    };

    function isPositionContaintsAtPositionsArray(position, figuresPositionsArray, board) {
        for (var i = 0; i < figuresPositionsArray.length; i++) {
            if (figuresPositionsArray[i].equals(position)) {
                return true;
            };
        };
        return false;
    };

    this.removeAttackedPosition = function(positionsArray, forPlayer, board) {
        var figures_ = board.getAllFigure();
        var maxWhiteIndex_ = board.getWhiteMaxIndex();
        var allFigures_ = [];
        var player_ = player;
        if ((forPlayer !== undefined) && (forPlayer !== null)) {
            player_ = forPlayer;
        };
        if (player_ == cPLAYER.BLACK) {
            allFigures_ = board.getFreeWhite();
        } else {
            allFigures_ = board.getFreeBlack();
        };
        var allAttackPositions = [];
        for (var i = allFigures_.length - 1; i >= 0; i--) {
            var tmpPosArray = that.getAllPositionsForFigure([allFigures_[i].figureIndex], board, forPlayer, true);
            if (tmpPosArray.length > 0) {
                allAttackPositions = allAttackPositions.concat(tmpPosArray);
            };
        };
        var retArray = [];
        for (var i = positionsArray.length - 1; i >= 0; i--) {
            if (isPositionContaintsAtPositionsArray(positionsArray[i], allAttackPositions)) {
                continue; //skip
            }
            retArray.push(positionsArray[i]);
        };
        return retArray;
    };
    // checkmate
    this.isCheck = function(board, forPlayer) {
        var allFigures_ = [];
        var volhvObj_ = null;
        var enemyPlayer_ = null;
        var maxWhiteIndex_ = board.getWhiteMaxIndex();
        if (forPlayer == cPLAYER.BLACK) {
            enemyPlayer_ = cPLAYER.WHITE;
            allFigures_ = board.getFreeWhite();
            volhvObj_ = UTILS.getFigureWithIndex(maxWhiteIndex_ + 12, board.getBlack());
        } else {
            enemyPlayer_ = cPLAYER.BLACK;
            allFigures_ = board.getBlack();
            volhvObj_ = UTILS.getFigureWithIndex(12, board.getWhite());
        };
        var allAttackPositions = [];
        for (var i = allFigures_.length - 1; i >= 0; i--) {
            var tmpPosArray = that.getAllPositionsForFigure([allFigures_[i].figureIndex], board, enemyPlayer_);
            if (tmpPosArray.length > 0) {
                allAttackPositions = allAttackPositions.concat(tmpPosArray);
            };
        };
        // allAttackPositions = arrayUnique(allAttackPositions);
        var isVolhvAttack = false;
        // console.log("volhv=");
        // console.log(volhvObj_.boardPosition);
        for (var i = allAttackPositions.length - 1; i >= 0; i--) {
            // console.log(allAttackPositions[i]);
            if (allAttackPositions[i].equals(volhvObj_.boardPosition)) {
                isVolhvAttack = true;
                break;
            };
        };
        return isVolhvAttack;
    };
    this.isMat = function(board, forPlayer) {
        var volhvObj_ = null;
        var isVolhvAttack = that.isCheck(board, forPlayer);
        var maxWhiteIndex_ = board.getWhiteMaxIndex();
        if (forPlayer == cPLAYER.BLACK) {
            volhvObj_ = UTILS.getFigureWithIndex(maxWhiteIndex_ + 12, board.getBlack());
        } else {
            volhvObj_ = UTILS.getFigureWithIndex(12, board.getWhite());
        };
        var allVolhvAvailablePositions = that.getAllPositionsForFigure(volhvObj_.figureIndex, board, forPlayer);
        // console.log(allVolhvAvailablePositions);
        if (allVolhvAvailablePositions.length == 0) {
            if (isVolhvAttack) {
                // TODO check
                console.log("Нам МАТ!!!");
            } else {
                console.log("ПАТ..");
            };
            return truel
        };
        return false;
    };

    function arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    };

    function normalizeFiguresArray(target, figuresArray, board) {
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
        for (var i = 0; i < figuresArray.length; i++) {
            figuresArray[i].boardPosition.copy(target.boardPosition);
            figuresArray[i].position.x = figuresArray[i].boardPosition.x - 4 + 0.5;
            figuresArray[i].position.z = figuresArray[i].boardPosition.y - 4 + 0.5;
            var target_ = target.position.clone();
            var scale_ = -sourceArray[i].indexY;
            figuresArray[i].position.y = target.position.y + scale_ * 0.5;
        };
    };

    function moveFiguresArray(figuresArray, target, board) {
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
        for (var i = 0; i < sourceArray.length; i++) {
            var target_ = target.position.clone();
            var scale_ = -sourceArray[i].indexY;
            // console.log(scale_);
            target_.y = target.position.y + scale_ * 0.5;
            sourceArray[i].position.lerp(target_, 0.0911);
        };
    };
};