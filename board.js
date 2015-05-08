/* 
 * autor: DYF
 */

var TAVRELI = TAVRELI || {revision: "v0.0.1"};

TAVRELI.init = function() {

    var cSTATE = {NONE: -1, ROTATE: 0, WAIT: 1};
    var state = cSTATE.NONE;
    var nullCube = null;
    var mainBoard = null;
    var mainFigure = new Chess();
    mainFigure.init();
    var figures = {};
    var nullCube = 0;

    var resetBoardFigure = function() {
        figures.arr = [];
        for (var i = 0; i < 8; i++) {
            var chess = mainFigure.getMainObj().clone();
            chess.name = 'figure';
            chess.position.x = i - 4 + .5;
            chess.position.y = i - 4 + .5;
            chess.position.z = .5 + .25;
            figures.arr.push(chess);
            scene.add(chess);
        };
    };
    this.getMainObj = function() {
        return mainBoard;
    };

    this.render = function() {
    };

    this.createModel = function(obj) {
    };

    this.getBoundingBox = function(obj) {
        var box = new THREE.Box3();//this.geometry.boundingBox.clone();
        obj.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.geometry.computeBoundingBox();
                var childbox = child.geometry.boundingBox.clone();
                childbox.translate(child.localToWorld(new THREE.Vector3()));
                box.union(childbox);
            }
        });
        return box;
    };
    this.setNullCubePosition = function(obj) {

        if (state === cSTATE.NONE) {
            nullCube.position.copy(obj.position);
        }
    };
    (this.creates = function() {
        nullCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, .2, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
        var objectAxis = new THREE.AxisHelper(4);
        var objectArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 1, 0), new THREE.Vector3(0, 0, 0), 3);
        nullCube.arrow = objectArrow;
        nullCube.add(objectArrow);
        nullCube.add(objectAxis);
        scene.add(nullCube);

        mainBoard = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
        mainBoard.squares = [];
        for (var i = -3; i < 5; i++) {
            for (var j = -3; j < 5; j++) {
                var mSquare = new THREE.Mesh(new THREE.BoxGeometry( 1, 1, .1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true}));
                mSquare.name = 'square';
                mSquare.position.x = i - .5;
                mSquare.position.y = j - .5;
                mSquare.position.z = .5;
                scene.add(mSquare);
                mainBoard.squares.push(mSquare);
            };
        };
        // scene.add(mainBoard);
        resetBoardFigure();
    })();
};
