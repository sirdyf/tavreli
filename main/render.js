var RENDER = RENDER || {
    revision: "v0.0.1"
};
if (typeof module === 'object') {
    module.exports = RENDER;
}

RENDER.RenderContainer = function(testMode) {
    var _testMode = false;
    if (testMode !== undefined) {
        _testMode = true;
    };
    console.log('RENDER test mode=',_testMode);
    var _tower = [];
    var _towerIndex = 0;
    var _platform = null;

    this.Init = function() {};
    this.hideTower = function(board) {
        if (_testMode === false) {
            for (var i = 0; i < _tower.length; i++) {
                camera.remove(_tower[i]);
            };
            camera.remove(_platform);
        };
        _tower = [];
        _towerIndex = 0;
    };
    var showTowerPlatform = function(figure, board) {
        var angleX = Math.PI / 6.0;
        var angleY = Math.PI / 4.0;
        var axisX = new THREE.Vector3(1, 0, 0);
        var axisY = new THREE.Vector3(0, 1, 0);
        _platform = board.getSquareAtPosition(figure.boardPosition);
        _platform.position.copy(new THREE.Vector3(4, -2, -10));
        _platform.rotateOnAxis(axisX, angleX);
        _platform.rotateOnAxis(axisY, angleY);
        camera.add(_platform);
    };
    this.showTowerWithPosition = function(figure, board) {
        var figures_ = board.getAllFigure();
        var srcCount_ = UTILS.getFigureCountAtPosition(figure.boardPosition, figures_);
        if (srcCount_ < 2) return;
        if (_testMode === false) {
            showTowerPlatform(figure, board);
        };
        var angleX = Math.PI / 6.0;
        var angleY = Math.PI / 4.0;
        var axisX = new THREE.Vector3(1, 0, 0);
        var axisY = new THREE.Vector3(0, 1, 0);
        for (var i = 0; i < figures_.length; i++) {
            if (figures_[i].boardPosition.equals(figure.boardPosition) === true) {
                var figure_ = figures_[i].clone();
                figure_.boardPosition = figures_[i].boardPosition;
                figure_.figureIndex = figures_[i].figureIndex;
                figure_.name = 'tower';
                var posY_ = figure_.position.y - 0;
                var scale_ = Math.floor(posY_ / 0.51);
                console.log('RENDER scale=' + scale_);
                figure_.indexY = scale_;
                figure_.position.x = 4;
                figure_.position.z = -10;
                if (_testMode === false) {
                    figure_.rotateOnAxis(axisX, angleX);
                    figure_.rotateOnAxis(axisY, angleY);
                    UTILS.removeAllArrow(figure_);
                    this.renderDeselectFigure(figure_);
                    camera.add(figure_);
                    console.log('RENDER.showTowerWithPosition figureIndex=',figure_.figureIndex);
                };
                _tower.push(figure_);
            };
        };
        _towerIndex = 1;
        this.selectTowerWith(getFigureWithYIndex(0));//figure.indexY));
    };
    this.getTowerFigureWithIndex = function(index) {
        var ind_ = _tower.length - index;
        return getFigureWithYIndex(ind_);
    };

    function getFigureWithYIndex(yIndex) {
        console.log('RENDER.getFigureWithYIndex(%d)', yIndex);
        console.log('Tower length=',_tower.length);
        for (var i = 0; i < _tower.length; i++) {
            console.log('i=%d _tower[i].figureIndex =%d indexY=%d',i,_tower[i].figureIndex,_tower[i].indexY);
            if (_tower[i].indexY == yIndex) return _tower[i];
        };
        return null;
    };
    this.selectTowerWith = function(object) {
        var ind_ = object.figureIndex;
        var figure_ = UTILS.getFigureWithIndex(ind_, _tower);
        var posY_ = figure_.indexY;
        console.log('select tower with index:' + posY_);
        _towerIndex = posY_;
        console.log(posY_);
        for (var i = 0; i < _tower.length; i++) {
            if (_tower[i].indexY < posY_) {
                _tower[i].position.y = _tower[i].indexY * 0.5 - 2;
            } else {
                _tower[i].position.y = _tower[i].indexY * 0.5 - 1.5;
            };
        };
    };
    this.getTowerUpFigures = function(figuresArray) {
        if (figuresArray.length < 2) {
            figuresArray[0].indexY = 0;
            return figuresArray;
        };
        var retArray_ = [];
        console.log("figuresArray count=%d, towerIndex =%d", figuresArray.length, _towerIndex);
        for (var i = 0; i < figuresArray.length; i++) {
            var indY_ = isFigureUp(figuresArray[i]);
            if (indY_ >= 0) {
                var upFiguresCount = figuresArray.length - _towerIndex - 1;
                // figuresArray[i].indexY = upFiguresCount - (indY_ - _towerIndex);
                console.log("indY=%d, indexY=%d", indY_, figuresArray[i].indexY);
                retArray_.push(figuresArray[i]);
            };
        };
        return retArray_;
    };

    function isFigureUp(figure) {
        for (var i = 0; i < _tower.length; i++) {
            if (_tower[i].figureIndex == figure.figureIndex) {
                if (_tower[i].indexY >= _towerIndex) {
                    return _tower[i].indexY;
                } else {
                    break;
                };
            };
        };
        return -1;
    };

    function isFigureDown(figure) {
        for (var i = 0; i < _tower.length; i++) {
            if (_tower[i].figureIndex == figure.figureIndex) {
                if (_tower[i].indexY < _towerIndex) {
                    return true;
                } else {
                    break;
                };
            };
        };
        return false;
    };
    this.renderDeselectFigure = function(figure3d) {
        for (var i = 0; i < figure3d.children.length; i++) {
            if (figure3d.children[i].name == 'selected_figure') {
                figure3d.remove(figure3d.children[i]);
                return;
            };
        };
    };
    this.renderSelectFigure = function(figure3d) {
        if (_testMode === true) {
            return;
        };
        var sFigure = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5, 1, 1, 1), new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        }));
        sFigure.name = 'selected_figure';
        // figure3d.position.copy(sFigure.position);
        figure3d.add(sFigure);
    };
    this.getTowerIndex = function() {
        return _towerIndex;
    };
};
// RENDER.main = new RenderContainer();
// RENDER.main.Init();