var UTILS = UTILS || {
    REVISION: '0.2'
};

if (typeof module === 'object') {
    module.exports = UTILS;
}

var isNumeric = function(obj) {
    if (typeof jQuery === "undefined") {
        // TODO:
        return true;
    };
    // http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
    return !jQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
}

UTILS.rotateAroundWorldAxis = function(object, axis, radians) {
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);

    rotationMatrix.multiply(object.matrix); // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix(rotationMatrix);
};
UTILS.getMoveArray = function(figure, board, isAllPositionsNeed) {
    return UTILS.getMoveArrayExt(figure.main, figure.boardPosition, board, isAllPositionsNeed);
};
UTILS.getMoveArrayExt = function(figureContainer, figureBoardPosition, board, isAllPositionsNeed) {
    var moveArray_ = [];
    var figureMoveRule_ = figureContainer.getMoveRule();
    // console.log("=======figureMoveRule_");
    // console.log(figureMoveRule_);
    for (var i = 0; i < figureMoveRule_.length; i++) {
        // console.log("=======getBoundPosition");
        // console.log(figureBoardPosition,figureMoveRule_[i],figureContainer.isJump(),isAllPositionsNeed);
        var endPos_ = UTILS.getBoundPosition(figureBoardPosition, figureMoveRule_[i], figureContainer.isJump(), board.getAllFigure(), isAllPositionsNeed);
        // console.log("=======endPos_");
        // console.log(endPos_);
        if (endPos_ != null) {
            if (isAllPositionsNeed === true) {
                moveArray_ = moveArray_.concat(endPos_);
            } else {
                moveArray_.push(endPos_);
            };
        };
    };
    // console.log("=======figureMoveRule_");
    // console.log(moveArray_);
    return moveArray_;
};
UTILS.getBoundPosition = function(pos2dVec, arrow2dVec, isJump, figuresArray, isAllPositionsNeed) {
    var allPositions_ = [];
    var targetPos_ = new THREE.Vector2().addVectors(pos2dVec, arrow2dVec);
    var boundBox = new THREE.Box2(new THREE.Vector2(0, 0), new THREE.Vector2(7, 7));
    if (isJump === true) {
        // console.log(boundBox,targetPos_);
        if (boundBox.containsPoint(targetPos_)) {
            return targetPos_;
        };
        return null;
    };
    var vNormal = arrow2dVec.clone(); //normalize();
    targetPos_ = pos2dVec.clone();
    targetPos_.add(vNormal);
    var prev_ = targetPos_;
    while (boundBox.containsPoint(targetPos_)) {
        prev_ = targetPos_.clone();
        allPositions_.push(targetPos_.clone());
        if (UTILS.isFigure(targetPos_, figuresArray) === true) {
            break;
        };
        targetPos_.add(vNormal);
    };
    if (isAllPositionsNeed === true) {
        return allPositions_.slice();
    };
    return prev_;
};
UTILS.isFigure = function(pos2dVec, figuresArray) {
    for (var i = 0; i < figuresArray.length; i++) {
        if (figuresArray[i].boardPosition.equals(pos2dVec)) {
            return true;
        };
    };
    return false;
};
UTILS.removeAllArrow = function(figure) {
    for (var i = 0; i < figure.children.length; i++) {
        var child_ = figure.children[i];
        if (child_.name == 'move_arrow') {
            figure.remove(child_);
            i--;
        };
    };
};
UTILS.showAvailablePositions = function(posArray, figure) {
    UTILS.removeAllArrow(figure);
    var dirFlag_ = 1;
    for (var i = 0; i < posArray.length; i++) {
        var arrow_ = figure.main.moveArrows[i];
        var vecDir_ = new THREE.Vector2().subVectors(posArray[i], figure.boardPosition);
        arrow_.setDirection(new THREE.Vector3(vecDir_.x, 0, vecDir_.y * dirFlag_).normalize());
        arrow_.setLength(vecDir_.length() * 4.0);
        figure.add(figure.main.moveArrows[i]);
    };
};
UTILS.addMoveArrow = function(figure) {
    var moveRule_ = figure.main.getMoveRule();
    figure.main.moveArrows = [];
    for (var i = 0; i < moveRule_.length; i++) {
        var vecDir_ = new THREE.Vector3(moveRule_[i].x, 0, moveRule_[i].y);
        var objectArrow = new THREE.ArrowHelper(vecDir_, new THREE.Vector3(0, 1, 0), 10);
        objectArrow.name = 'move_arrow';
        figure.main.moveArrows.push(objectArrow);
        // figure.add(objectArrow);
    };
};
UTILS.removeAllArrowWithArray = function(figuresArray) {
    for (var i = 0; i < figuresArray.length; i++) {
        UTILS.removeAllArrow(figuresArray[i]);
    };
};
UTILS.getFigureCountAtPosition = function(pos2d, figures) {
    var count_ = 0;
    for (var i = 0; i < figures.length; i++) {
        if (figures[i].boardPosition.equals(pos2d)) {
            count_++;
        };
    };
    return count_;
};
UTILS.getFigureWithIndex = function(index, figureArray) {
    for (var i = 0; i < figureArray.length; i++) {
        if (figureArray[i].figureIndex == index) {
            return figureArray[i];
        };
    };
    return null;
};
UTILS.setIndexFromNotation = function(notations, obj) {
    if (notations.length > 3) return -1;
    notation = notations.toLowerCase();
    var symbol = 0;
    if (notation.charAt(0) === 'a') symbol = 0;
    if (notation.charAt(0) === 'b') symbol = 1;
    if (notation.charAt(0) === 'c') symbol = 2;
    if (notation.charAt(0) === 'd') symbol = 3;
    if (notation.charAt(0) === 'e') symbol = 4;
    if (notation.charAt(0) === 'f') symbol = 5;
    if (notation.charAt(0) === 'g') symbol = 6;
    if (notation.charAt(0) === 'h') symbol = 7;

    var horizontal = notation.charAt(1);
    if (!isNumeric(horizontal)) {
        console.log('Error second symbol:' + horizontal + ' must be number!');
        return -1;
    }
    // return (horizontal - 1) * 8 + symbol;
    obj.boardPosition = new THREE.Vector2(symbol, 8 - horizontal); //todo revert board coordinate
};