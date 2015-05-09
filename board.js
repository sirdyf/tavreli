/* 
 * autor: DYF
 */

var TAVRELI = TAVRELI || {revision: "v0.0.1"};

TAVRELI.init = function() {

    var cSTATE = {NONE: -1, ROTATE: 0, WAIT: 1};
    var state = cSTATE.NONE;
    var nullCube = null;
    var mainBoard = null;
    var mainFigure = null;
    var figures = {};
    var nullCube = null;
    var materials = [];
    var originCube = null;
    
    var mNameRight = 0;
    var mNameLeft = 0;
    var mNameDown = 0;
    var mNameFront = 0;
    var mNameUp = 0;
    var mNameBack = 0;

    var resetBoardFigure = function() {
        figures.arr = [];
        mainFigure = new Chess(originCube);
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

    this.getMaterialFromObj = function(object) {
        var tmpMat = [];
        materials.grey = new THREE.MeshBasicMaterial({color: 0x111111});
        materials.yellow = new THREE.MeshLambertMaterial({color: new THREE.Color("yellow"), shading: THREE.FlatShading, overdraw: true}); 
        materials.yellow.name = 'yellow';
        materials.brown = new THREE.MeshLambertMaterial({color: new THREE.Color("brown"), shading: THREE.FlatShading, overdraw: true}); 
        materials.brown.name = 'brown';
        materials.one = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, side: THREE.DoubleSide});
        if (object.children.length === 0)
            return;
        for (var i in object.children) {
            var mName = object.children[i].material.name;
            // if (mName === "FrontColor") {
            //     object.children[i].material.side = THREE.DoubleSide;
//                materials.one=object.children[i].material.clone();
            // }
            tmpMat[mName] = true;
        }
        var k = 0;
        materials.name = [];
        for (var j in tmpMat) {
            materials.name[k] = j;
            k += 1;
        }
    };

    this.createModel = function(obj) {
        this.getMaterialFromObj(obj);
        originCube = obj.clone();
        this.createBoardSquares();
        resetBoardFigure();
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
    this.createBoardSquares = function(){
        mainBoard.squares = [];
        var m = materials.brown;
        for (var i = -3; i < 5; i++) {
            for (var j = -3; j < 5; j++) {
                var mSquare = new THREE.Mesh(new THREE.BoxGeometry( 1, 1, .1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true}));
                mSquare.material = m;
                mSquare.name = 'square';
                mSquare.position.x = i - .5;
                mSquare.position.y = j - .5;
                mSquare.position.z = .5;
                // scene.add(mSquare);
                mainBoard.add(mSquare);
                mainBoard.squares.push(mSquare);
                if (m.name == 'brown') {
                    m = materials.yellow;
                }else{
                    m = materials.brown;
                };
            };
            if (m.name == 'brown') {
                m = materials.yellow;
                }else{
                    m = materials.brown;
                };
        };
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
        scene.add(mainBoard);
    })();
};
