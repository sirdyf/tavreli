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
    var textures = null;
    var materials = [];
    var originCube = null;
    var originCubeSize = null;
    var originCubeScale = null;

    materials.name = [];
    
    var resetBoardFigure = function() {
        figures.white = [];
        mainFigure = new Chess(originCube);
        for (var i = 0; i < 16; i++) {
            var chess = mainFigure.getMainObj().clone();
            chess.name = 'figure';
            chess.position.x = (i % 8) - 4 + .5;
            if (i <= 7){
                chess.position.y = 1 - 4 + .5;
                chess.position.z = .5;
            }else if ((i >= 8)&&(i <= 15)){
                chess.position.y = 0 - 4 + .5;
                chess.position.z = .5;
            }else{
                return;
            }
            makeFigureWithIndex(chess,i);
            figures.white.push(chess);
            scene.add(chess);
        };
    };
    var makeFigureWithIndex = function(obj,index){
        obj.figureIndex = index;
        makeTavreli(obj,index);
    };
    var makeTavreli = function(obj,ind){
        if (ind == 0 || ind == 7){
            replaceMaterial(obj,'topFigureMaterial','ratnik_1');
            replaceMaterial(obj,'secondFigureMaterial','ratoborec_1');
        }else if (ind == 1 || ind == 6){
            replaceMaterial(obj,'topFigureMaterial','ratnik_1');
            replaceMaterial(obj,'secondFigureMaterial','vsadnik_1');
        }else if (ind == 2 || ind == 5){
            replaceMaterial(obj,'topFigureMaterial','ratnik_1');
            replaceMaterial(obj,'secondFigureMaterial','luchnik_1');
        }else if (ind == 3){
            replaceMaterial(obj,'topFigureMaterial','ratnik_1');
            replaceMaterial(obj,'secondFigureMaterial','knyaz_1');
        }else if (ind == 4){
            replaceMaterial(obj,'topFigureMaterial','ratnik_1');
            replaceMaterial(obj,'secondFigureMaterial','helgi_1');
        }else if (ind == 8 || ind == 15){
            replaceMaterial(obj,'topFigureMaterial','ratoborec_1');
            replaceMaterial(obj,'secondFigureMaterial','ratoborec_1');
            replaceMaterial(obj,'mainFigureMaterial','ratoborec_1');
        }else if (ind == 9 || ind == 14){
            replaceMaterial(obj,'topFigureMaterial','vsadnik_1');
            replaceMaterial(obj,'secondFigureMaterial','vsadnik_1');
            replaceMaterial(obj,'mainFigureMaterial','vsadnik_1');
        }else if (ind == 10 || ind == 13){
            replaceMaterial(obj,'topFigureMaterial','luchnik_1');
            replaceMaterial(obj,'secondFigureMaterial','luchnik_1');
            replaceMaterial(obj,'mainFigureMaterial','luchnik_1');
        }else if (ind == 11){
            replaceMaterial(obj,'topFigureMaterial','knyaz_1');
            replaceMaterial(obj,'secondFigureMaterial','knyaz_1');
            replaceMaterial(obj,'mainFigureMaterial','knyaz_1');
        }else if (ind == 12){
            replaceMaterial(obj,'topFigureMaterial','volhv_1');
            replaceMaterial(obj,'secondFigureMaterial','volhv_1');
            replaceMaterial(obj,'mainFigureMaterial','volhv_1');
        };
    };
    var replaceMaterial = function(object,matSourceName,matDestName){
        var matDest = materials[matDestName].clone();
        if (matDest === undefined) return;
        for (var i in object.children) {
            var mName = object.children[i].material.name;
            if (mName === matSourceName) {
                object.children[i].material = matDest;
                object.children[i].material.needsUpdate = true;
            };
        };
    };
    this.getMainObj = function() {
        return mainBoard;
    };

    this.render = function() {
    };

    this.getMaterialFromObj = function(object) {
        materials.grey = new THREE.MeshBasicMaterial({color: 0x111111});
        materials.yellow = new THREE.MeshLambertMaterial({color: new THREE.Color("yellow"), shading: THREE.FlatShading, overdraw: true}); 
        materials.yellow.name = 'yellow';
        materials.brown = new THREE.MeshLambertMaterial({color: new THREE.Color("brown"), shading: THREE.FlatShading, overdraw: true}); 
        materials.brown.name = 'brown';
        materials.one = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, side: THREE.DoubleSide});
        var originMaterial = null;
        for (var i in originCube.children) {
            var mName = originCube.children[i].material.name;
            if (mName.length > 1) {
                materials[mName] = originCube.children[i].material;
            };
            // if (mName === 'topFigureMaterial') {
            //     originMaterial = originCube.children[i].material;
            //     break;
            // };
        };
        // var crateTxr = THREE.ImageUtils.loadTexture( 'model/volhv.png' );
        // var material = new THREE.MeshBasicMaterial( { map: crateTxr } );
        // var material = originMaterial.clone();
        // material.map = crateTxr;

        // materials.ratoborec_1 = material;
        // for (mat in object.materialsInfo) {
            // console.log(mat);
            // var mm = originCube.material[1].clone();

            // materials[mat] = mm;
        // };
        if (object.children.length === 0)
            return;
        for (var i in object.children) {
            var mName = object.children[i].material.name;
            console.log(mName);
        //     // materials.push(object.children[i].material);
        }
        this.createBoardSquares();
        resetBoardFigure();
    };

    this.createModel = function(obj) {
        var tmpObj=obj.clone();
        var rotAngle = Math.PI / 2.0;
        var axis = new THREE.Vector3(1, 0, 0);
        UTILS.rotateAroundWorldAxis(tmpObj,axis,rotAngle);
        var bBox = this.getBoundingBox(tmpObj);
        originCubeSize = bBox.size();
        var sc=1/originCubeSize.x;
        originCubeScale = sc;
        tmpObj.scale.set(sc,sc,sc);
        originCube = tmpObj.clone();
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
