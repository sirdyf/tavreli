var UTILS = UTILS || {REVISION: '0.1'};

UTILS.rotateAroundWorldAxis = function(object, axis, radians) {
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);

    rotationMatrix.multiply(object.matrix);                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix(rotationMatrix);
};
UTILS.getMoveArray = function(figure,board){
    var moveArray_ = [];
    var figureMoveRule_ = figure.main.getMoveRule();
    for (var i = 0; i < figureMoveRule_.length; i++) {
        var endPos_ = UTILS.getBoundPosition(figure.boardPosition,figureMoveRule_[i],figure.main.isJump(),board.getAllFigure());
        if (endPos_ != null) moveArray_.push(endPos_);
    };
    return moveArray_;
};
UTILS.getBoundPosition = function(pos2dVec,arrow2dVec,isJump,figuresArray){
    var targetPos_ = new THREE.Vector2().addVectors(pos2dVec,arrow2dVec);
    var boundBox = new THREE.Box2(new THREE.Vector2(0,0),new THREE.Vector2(7,7));
    if (isJump === true) {
        if (boundBox.containsPoint(targetPos_)) {
            return targetPos_;
        };
        return null;
    };
    var vNormal = arrow2dVec.clone();//normalize();
    targetPos_ = pos2dVec.clone();
    targetPos_.add(vNormal);
    var prev_ = targetPos_;
    while(boundBox.containsPoint(targetPos_)){
        prev_ = targetPos_;
        if (UTILS.isFigure(targetPos_,figuresArray) === true){
            break;
        };
        targetPos_.add(vNormal);
    };
    return prev_;
};
UTILS.isFigure = function(pos2dVec,figuresArray){
    for (var i = 0; i < figuresArray.length; i++) {
        if (figuresArray[i].boardPosition.equals(pos2dVec)){
            return true;
        };
    };
    return false;
};
UTILS.removeAllArrow = function(figure){
    for (var i = 0; i < figure.children.length; i++) {
        var child_ = figure.children[i];
        if (child_.name == 'move_arrow'){
            figure.remove(child_);
        };
    };
};
UTILS.showAvailablePositions = function(posArray,figure){
    UTILS.removeAllArrow(figure);
    var dirFlag_ = 1;
    for (var i = 0; i < posArray.length; i++) {
        var arrow_ = figure.main.moveArrows[i];
        var vecDir_ = new THREE.Vector2().subVectors(posArray[i],figure.boardPosition);
        if (figure.figureIndex <= 15) dirFlag_ = -1;//todo
        arrow_.setDirection(new THREE.Vector3(vecDir_.x,0,vecDir_.y * dirFlag_).normalize());
        arrow_.setLength(vecDir_.length() * 4.0);
        figure.add(figure.main.moveArrows[i]);
    };
};
UTILS.addMoveArrow = function(figure){
    var moveRule_ = figure.main.getMoveRule();
    figure.main.moveArrows = [];
    for (var i = 0; i < moveRule_.length; i++) {
        var vecDir_ = new THREE.Vector3(moveRule_[i].x,0,moveRule_[i].y);
        var objectArrow = new THREE.ArrowHelper(vecDir_, new THREE.Vector3(0, 1, 0), 10);
        objectArrow.name = 'move_arrow';
        figure.main.moveArrows.push(objectArrow);
        // figure.add(objectArrow);
    };
};