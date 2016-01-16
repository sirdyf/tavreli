var LOGIC = LOGIC || {
    revision: "v0.1.3"
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
    this.setTestBoard = function(testBoard) {
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
    this.isFirstStepAvailable = function(obj, board) {
        var res_ = isFigureAtPosition(obj.boardPosition, board.getAllFigure());
        if (res_ === false) {
            // if obj is not figure
            return false;
        };
        var topFigure_ = that.getTopFigureAtPosition(obj, board.getAllFigure());
        var resW = isFigureIndexContaints(topFigure_.figureIndex, board.getWhite());
        var resB = isFigureIndexContaints(topFigure_.figureIndex, board.getBlack());
        if ((player == cPLAYER.WHITE) && (resB === true)) {
            // if obj is enemy figure
            console.log('Error! Selected enemy figure!');
            return false;
        };
        if ((player == cPLAYER.BLACK) && (resW === true)) {
            // if obj is enemy figure
            console.log('Error! Selected enemy figure!');
            return false;
        };
        return true;
    };

    function firstStep(obj, board) {
        console.log('LOGIC.firstStep()');
        if (player == cPLAYER.NONE) {
            console.log('Error! (player = none!)');
            return;
        };

        if (that.isFirstStepAvailable(obj, board) === false) {
            console.log('Obj can not be selected!');
            return;
        };
        var figures_ = board.getAllFigure();
        console.log('figures count=',figures_.length);
        var topFigure_ = that.getTopFigureAtPosition(obj, figures_);
        console.log('Top figure index=%d, indexY=%d', topFigure_.figureIndex, topFigure_.indexY);
        UTILS.removeAllArrowWithArray(figures_);
        board.deSelectFigureWithIndex(selectedFigureIndex);
        selectedFigureIndex = topFigure_.figureIndex; //getFigureIndex(obj,board.getAllFigure());
        board.selectFigureWithIndex(selectedFigureIndex);
        state = cSTATE.TARGET;
        console.log('LOGIC.firstStep() state=cSTATE.TARGET')
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
    this.isSecondStepAvailable = function(obj, board, targetPositions, sampleBoard) {
        // TODO: remove testBoard
        var res = isFigure(obj, board.getAllFigure());
        if (res === false) {
            // if obj is not figure
            return false;
        };
        var topFigure_ = that.getTopFigureAtPosition(obj, board.getAllFigure());
        var availablePositions = UTILS.getMoveArray(topFigure_, board, true); //moveArrow
        availablePositions = that.addAdditionPositions(availablePositions, topFigure_, board, true);
        availablePositions = that.removeAdditionPositions(availablePositions, topFigure_, board);

        if (topFigure_.figureIndex === 12) {
            availablePositions = that.removeAttackedPosition(availablePositions, cPLAYER.WHITE, board);
        };
        var max_ = board.getWhiteMaxIndex();
        if (topFigure_.figureIndex === 12 + max_) {
            availablePositions = that.removeAttackedPosition(availablePositions, cPLAYER.BLACK, board);
        };
        var flag_ = false;
        for (var i = 0; i < availablePositions.length; i++) {
            if (targetPositions.equals(availablePositions[i])) {
                flag_ = true;
                break;
            };
        };
        console.log('available positions:', availablePositions);
        console.log('target board pos=', targetPositions);
        if (flag_ === false) {
            console.log('Error! Wrong second position!');
            return false;
        }
        console.log('LOGIC.isSecondStepAvailable() Chack target position with use test board:');
        sampleBoard.SetFigures([], []);
        // console.log("***************** " + _testBoard.getWhite().length);
        var allFree_ = board.getFreeAll();
        for (var i = allFree_.length - 1; i >= 0; i--) {
            var tmpIndex = allFree_[i].figureIndex;
            var tmpPosition = allFree_[i].boardPosition.clone();
            var tmpIndexY = allFree_[i].indexY;// NaN - WTF???
            // sampleBoard.addTestFigure(tmpIndex, tmpPosition, tmpIndexY);// not work WTF?
            sampleBoard.addTestFigure(tmpIndex, tmpPosition, 0);
        };
        var selectedFigureIndex = topFigure_.figureIndex;
        // sampleBoard.SetFigures(board.getWhite(),board.getBlack());
        var testFigure_ = UTILS.getFigureWithIndex(selectedFigureIndex, sampleBoard.getAllFigure());
        testFigure_.boardPosition = targetPositions;//obj.boardPosition.clone();
        testFigure_.indexY = 50; // must be top!
        console.log('LOGIC.isSecondStepAvailable() check _CHECK_');
        if (that.isCheck(sampleBoard, player)) {
            console.log("Check!!");
            return false;
        };
        console.log('LOGIC.isSecondStepAvailable() return TRUE!');
        return true;
    };

    function secondStep(obj, board) {
        console.log('|-- LOGIC.secondStep()');
        if (player == cPLAYER.NONE) {
            console.log('Error! (player = none!)');
            return;
        };
        var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
        var res = isFigure(obj, board.getAllFigure());
        if (res === true) {
            if (figure_.boardPosition.equals(obj.boardPosition)) {
                state = cSTATE.SOURCE;
                zeroStep(null, board);
                RENDER.main.hideTower(board);
                console.log('LOGIC => cancel select figure!');
                return;
            };
        };
        if ((_testBoard === 'undefined') || (_testBoard === null)) {
            console.log("\n\nERROR! Test board not found!\n\n");
            return;
        }
        //this.isSecondStepAvailable = function(obj, board, targetPositions, sampleBoard) {
        if (that.isSecondStepAvailable(figure_, board, obj.boardPosition, _testBoard) === false) {
            console.log('isSecondStepAvailable => false!');
            return;
        };
        console.log('LOGIC.secondStep() target position availabe!');
        // var availablePositions = UTILS.getMoveArray(figure_, board, true); //moveArrow
        // availablePositions = that.addAdditionPositions(availablePositions, figure_, board, true);
        // availablePositions = that.removeAdditionPositions(availablePositions, figure_, board);

        // if (figure_.figureIndex === 12) {
        //     availablePositions = that.removeAttackedPosition(availablePositions, cPLAYER.WHITE, board);
        // };
        // var max_ = board.getWhiteMaxIndex();
        // if (figure_.figureIndex === 12 + max_) {
        //     availablePositions = that.removeAttackedPosition(availablePositions, cPLAYER.BLACK, board);
        // };
        // var flag_ = false;
        // for (var i = 0; i < availablePositions.length; i++) {
        //     if (obj.boardPosition.equals(availablePositions[i])) {
        //         flag_ = true;
        //         break;
        //     };
        // };
        // if (flag_ === false) return;

        // // TODO: var testBoard = board.copy(); 
        // if (_testBoard === 'undefined') {
        //     console.log("ERROR!");
        //     return;
        // }
        // _testBoard.SetFigures([], []);
        // // console.log("***************** " + _testBoard.getWhite().length);
        // var allFree_ = board.getFreeAll();
        // for (var i = allFree_.length - 1; i >= 0; i--) {
        //     var tmpIndex = allFree_[i].figureIndex;
        //     var tmpPosition = allFree_[i].boardPosition.clone();
        //     _testBoard.addTestFigure(tmpIndex, tmpPosition);
        // };
        // // _testBoard.SetFigures(board.getWhite(),board.getBlack());
        // var testFigure_ = UTILS.getFigureWithIndex(selectedFigureIndex, _testBoard.getAllFigure());
        // testFigure_.boardPosition = obj.boardPosition.clone();

        // if (that.isCheck(_testBoard, player)) {
        //     console.log("Check!!");
        //     return;
        // };

        state = cSTATE.MOVE;
        console.log('LOGIC => state = cSTATE.MOVE')
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
        console.log('PPPP1', obj.boardPosition);
        targetPosition.boardPosition = obj.boardPosition.clone();
        console.log('PPPP2', obj.position);
        targetPosition.position.copy(obj.position);
        var figures_ = board.getAllFigure();
        sourceArray = that.getAllFiguresAtPosition(figure_.boardPosition, figures_);
        console.log('All figures at position count=%d', sourceArray.length);
        sourceArray = RENDER.main.getTowerUpFigures(sourceArray);
        console.log('Up figures count=%d', sourceArray.length);

        res = isFigure(obj, board.getAllFigure());
        if (res === true) {
            var countDest_ = UTILS.getFigureCountAtPosition(obj.boardPosition, figures_);
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition, figures_) - 1;
            targetPosition.indexYsrc = countSrc_;
            targetPosition.indexYdst = countDest_;
            countSrc_ -= RENDER.main.getTowerIndex();
            var count_ = countSrc_ + countDest_;
            targetPosition.position.y = count_ * 0.5 + 0.5;
            targetPosition.indexY = count_;
        } else {
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition, figures_) - 1;
            targetPosition.indexYsrc = countSrc_;
            targetPosition.indexYdst = countSrc_;
            countSrc_ -= RENDER.main.getTowerIndex();
            targetPosition.position.y = 0.5 + countSrc_ * 0.5;
            targetPosition.indexY = countSrc_;
        };
        console.log('indexYsrc = ',targetPosition.indexYsrc);
        console.log('indexYdst = ',targetPosition.indexYdst);
        console.log('Targer position', targetPosition.position);
        console.log('Target board pos', targetPosition.boardPosition);
        if (RENDER.main.getTowerIndex() > 0) {
            var countSrc_ = UTILS.getFigureCountAtPosition(figure_.boardPosition, figures_);
            curStep += "(" + (countSrc_ - RENDER.main.getTowerIndex()) + ")";
        };
        RENDER.main.hideTower(board);
        var step2_ = PARSER.main.getNotationFromStep(obj.boardPosition);
        _steps.push(curStep + "-" + step2_);
        console.log("Push: " + curStep + "-" + step2_);
        console.log("current step = " + that.getCurrentStepNum());
        console.log('LOGIC.secondStep() --|');
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
        if (externalFunc === undefined) {
            funcArrays = [zeroStep, firstStep, secondStep, moveStep];
        } else {
            funcArrays = [zeroStep, firstStep, secondStep, moveStep, externalFunc];
        };
    };
    this.ClickOnObject = function(obj, board) {
        if (obj === undefined) return;
        if (board === undefined) return;
        if (board === null) return;
        console.log('LOGIC.ClickOnObject() with state=%d', state);
        funcArrays[state](obj, board);
    };
    this.RenderStep = function(board, testMode) {
        if (state == cSTATE.MOVE) {
            var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
            if (testMode === undefined) {
                moveFiguresArray(sourceArray, targetPosition, board);
            } else {
                moveFiguresArray(sourceArray, targetPosition, board, 'test');
            };
            console.log('target pos', targetPosition.position);
            console.log('figure pos', figure_.position);
            var dist = figure_.position.distanceTo(targetPosition.position);
            console.log('Dist=%d', dist);
            if (dist < 0.1) {
                if (funcArrays[cSTATE.EXTERNAL] !== undefined) {
                    funcArrays[cSTATE.EXTERNAL]();
                };
                state = cSTATE.SOURCE;
                normalizeFiguresArray(targetPosition, sourceArray, board);
                zeroStep(null, board);
                // this.switchPlayer();
                if (player == cPLAYER.WHITE) {
                    player = cPLAYER.BLACK;
                } else {
                    player = cPLAYER.WHITE;
                };

                checkRuleAfterStep(board);
                that.isMat(board);
                return;
            };
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
        console.log('--- Normalize array ---');
        // var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
        for (var i = 0; i < figuresArray.length; i++) {
            console.log('1)figure index=', figuresArray[i].figureIndex);
            console.log('1)pos=', figuresArray[i].position);
            console.log('1)board pos=', figuresArray[i].boardPosition);
            console.log('1)indexY = ', sourceArray[i].indexY);
            figuresArray[i].boardPosition.copy(target.boardPosition);
            figuresArray[i].position.x = figuresArray[i].boardPosition.x - 4 + 0.5;
            figuresArray[i].position.z = figuresArray[i].boardPosition.y - 4 + 0.5;
            var target_ = target.position.clone();
            var scale_ = target.indexY - (target.indexYsrc - sourceArray[i].indexY);
            sourceArray[i].indexY = scale_;
            console.log('Scale=%d figure position.y=%d', scale_, figuresArray[i].position.y);
            figuresArray[i].position.y = scale_ * 0.5 + 0.5;
            console.log('2)pos=', figuresArray[i].position);
            console.log('2)board pos=', figuresArray[i].boardPosition);
            console.log('2)indexY = ', sourceArray[i].indexY);
        };
    };

    function moveFiguresArray(figuresArray, target, board, testMode) {
        var lerp_ = 0.0911;
        if (testMode !== undefined) {
            console.log('LOGIC.moveFiguresArray');
        };
        // var figure_ = UTILS.getFigureWithIndex(selectedFigureIndex, board.getAllFigure());
        console.log('Target pos ' + target.position);
        console.log('Target indexY=%d indexYsrc=%d indexYdst=%d', target.indexY, target.indexYsrc, target.indexYdst);
        for (var i = 0; i < sourceArray.length; i++) {
            var target_ = target.position.clone();
            var indexYdelta_  = parseInt(target.indexYsrc - sourceArray[i].indexY, 10);
            var figureIndexY_ = parseInt(sourceArray[i].indexY, 10);
            var figureIndex_  = parseInt(sourceArray[i].figureIndex, 10);
            console.log('i=%d figure index=%d indexY=%d, indexYdelta_=%d', i, figureIndex_, figureIndexY_, indexYdelta_);
            target_.y = target.position.y - indexYdelta_ * 0.5;
            console.log('1)pos=', sourceArray[i].position);
            if (testMode === undefined) {
                sourceArray[i].position.lerp(target_, lerp_);
            } else {
                console.log('...');
                sourceArray[i].position.copy(target_);
            };
            console.log('2)pos=', sourceArray[i].position);
        };
    };
    this.switchPlayer = function(obj1, obj2, towerCount, board) {
        var figures_ = board.getAllFigure();
        sourceArray = that.getAllFiguresAtPosition(obj1.boardPosition, figures_);
        var fig1 = that.getTopFigureAtPosition(obj1, board.getAllFigure());
        var targetPosition = fig1.clone();
        targetPosition.boardPosition = obj2.boardPosition.clone();
        var isTargetPosEmpty = isFigureAtPosition(obj2.boardPosition, board.getAllFigure());
        var count = null;
        if (isTargetPosEmpty === true) {
            var countDest_ = UTILS.getFigureCountAtPosition(obj2.boardPosition, figures_);
            var countSrc_ = UTILS.getFigureCountAtPosition(obj1.boardPosition, figures_);
            if (towerCount > countSrc_) {
                console.log('Error! Wrong tower count!');
                towerCount = 0;
            }
            // countSrc_ -= RENDER.main.getTowerIndex();
            var count_ = countSrc_ + countDest_ - towerCount;
            targetPosition.position.y = 0.5 + count_ * 0.5;
            var sourceTower = [];
            console.log('Counts: src=%d dst=%d tower=%d', countSrc_, countDest_, towerCount);
            if (towerCount !== 0) {
                towerCount = countSrc_ - towerCount;
            };
            for (var i = 0; i < sourceArray.length; i++) {
                console.log('source index =%d min index=%d', sourceArray[i].indexY, (towerCount));
                if (sourceArray[i].indexY >= (towerCount)) {
                    sourceTower.push(sourceArray[i]);
                }
            };
            console.log('source tower count=%d', sourceTower.length);
            sourceArray = sourceTower;
            for (var i = 0; i < sourceArray.length; i++) {
                // console.log('1)indexY = ', sourceArray[i].indexY);
                sourceArray[i].indexY += countDest_;
                console.log('2)indexY = ', sourceArray[i].indexY);
            };
        } else {
            var countSrc_ = UTILS.getFigureCountAtPosition(obj1.boardPosition, figures_) - 1;
            countSrc_ -= towerCount; //RENDER.main.getTowerIndex();
            targetPosition.position.y = 0.5 + countSrc_ * 0.5;
            count = countSrc_;
        };
        normalizeFiguresArray(targetPosition, sourceArray, board);
        if (player == cPLAYER.WHITE) {
            player = cPLAYER.BLACK;
        } else {
            player = cPLAYER.WHITE;
        };
    };
};