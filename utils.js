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
	var vNormal = arrow2dVec.normalize();
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