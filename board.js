/* 
 * autor: DYF
 */

var TAVRELI = TAVRELI || {revision: "v0.0.1"};

TAVRELI.init = function() {

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
    var _maxWhiteIndex = 99;
    var _maxRatnikIndex = 8;

    materials.name = [];

    TAVRELI.isFigureRatnik = function(figureIndex){
        var ind_ = figureIndex;
        if ((ind_ < _maxRatnikIndex) || ((ind_ > _maxWhiteIndex) && (ind_ < _maxWhiteIndex+_maxRatnikIndex)) ) return true;
        return false;
    };
    TAVRELI.getWhiteMaxIndex = function(){
        return _maxWhiteIndex;
    };
    TAVRELI.getWhiteRatnikMaxIndex = function(){
        return 8;
    };
    TAVRELI.getBlackRatnikMaxIndex = function(){
        return _maxWhiteIndex + 8;
    };
    TAVRELI.getSquares = function(){
        return mainBoard.squares;
    };
    TAVRELI.getWhite = function(){
        var white = [];
        for (var i = 0; i < figures.allFigure.length; i++) {
            if (figures.allFigure[i].figureIndex <= _maxWhiteIndex){
                white.push(figures.allFigure[i]);
            };
        };
        return white;
    }
    TAVRELI.getBlack = function(){
        var black = []
        for (var i = 0; i < figures.allFigure.length; i++) {
            if (figures.allFigure[i].figureIndex > _maxWhiteIndex){
                black.push(figures.allFigure[i]);
            };
        };
        return black;
    }
    TAVRELI.getAllFigure = function(){
        return figures.allFigure;
    }
    TAVRELI.selectFigureWithIndex = function(figureIndex){
        for (var i = 0; i < figures.allFigure.length; i++) {
            if (figures.allFigure[i].figureIndex == figureIndex){
                RENDER.main.renderSelectFigure(figures.allFigure[i]);
                break;
            };
        };
    };
    TAVRELI.deSelectFigureWithIndex = function(figureIndex){
        for (var i = 0; i < figures.allFigure.length; i++) {
            if (figures.allFigure[i].figureIndex == figureIndex){
                RENDER.main.renderDeselectFigure(figures.allFigure[i]);
                break;
            };
        };
    };
    var resetBoardFigure = function() {
        figures.allFigure = [];
        mainFigure = new Chess(originCube);
        for (var i = 0; i < 8*4 ; i++) {
            var chess = mainFigure.getMainObj().clone();
            chess.name = 'figure';
            chess.position.x = (i % 8) - 4 + .5;
            chess.boardPosition = new THREE.Vector2();
            chess.boardPosition.x = (i % 8);
            chess.position.y = .5;
            // if (i == 4){
            //     makeTestFigure(4 + 8 + 8);
            //     continue;
            // };
            // if (i == 27) continue;
            // if (i == 19) continue;
            if (i <= 7){
                chess.position.z = 6 - 4 + .5;
                chess.boardPosition.y = 6;
            }else if ((i >= 8)&&(i <= 15)){
                chess.position.z = 7 - 4 + .5;
                chess.boardPosition.y = 7;
            }else if ((i >= 16)&&(i <= 23)){
                chess.position.z = 1 - 4 + .5;
                chess.boardPosition.y = 1;
            }else if ((i >= 24)&&(i <= 31)){
                chess.position.z = 0 - 4 + .5;
                chess.boardPosition.y = 0;
            }else{
                return;
            }
            if (i < 16){
                makeFigureWithIndex(chess,i);
            }else{
                makeFigureWithIndex(chess,i - 16 + _maxWhiteIndex);
            };
            figures.allFigure.push(chess);
            scene.add(chess);
        };
    };
    var makeTestFigure = function(figureIndex){
        mainFigure = new Chess(originCube);
        var chess = mainFigure.getMainObj().clone();
        chess.name = 'figure';
        chess.boardPosition = new THREE.Vector2(3,3);
        chess.position.x = (3 % 8) - 4 + .5;
        chess.position.z = 3 - 4 + .5;
        chess.position.y = .5;
        makeFigureWithIndex(chess,figureIndex);
        figures.allFigure.push(chess);
        scene.add(chess);
    };
    var makeFigureWithIndex = function(obj,index){
        obj.figureIndex = index;
        if (index < _maxWhiteIndex){
            makeTavreli(obj,index,'white');
        }else{
            makeTavreli(obj,index - _maxWhiteIndex,'black');
            replaceMaterial(obj,'FrontColor','FrontColorBlack');
            if (index < _maxWhiteIndex + 8){
                var mv = obj.main.getMoveRule();
                mv[0].y = 1;
                mv[1].y = 1;
                mv[2].y = 1;
                mv[3].y = 1;
            };
        };
    };
    var makeTavreli = function(obj,ind,postfix){
        if (ind == 0 || ind == 7){
            obj.main = new RatnikContainer();
            replaceMaterial(obj,'topFigureMaterial','ratnik_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','ratoborec_'+postfix);
        }else if (ind == 1 || ind == 6){
            obj.main = new RatnikContainer();
            replaceMaterial(obj,'topFigureMaterial','ratnik_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','vsadnik_'+postfix);
        }else if (ind == 2 || ind == 5){
            obj.main = new RatnikContainer();
            replaceMaterial(obj,'topFigureMaterial','ratnik_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','luchnik_'+postfix);
        }else if (ind == 3){
            obj.main = new RatnikContainer();
            replaceMaterial(obj,'topFigureMaterial','ratnik_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','knyaz_'+postfix);
        }else if (ind == 4){
            obj.main = new RatnikContainer();
            replaceMaterial(obj,'topFigureMaterial','ratnik_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','helgi_'+postfix);
            obj.main = new RatnikContainer();
        }else if (ind == 8 || ind == 15){
            obj.main = new RatoborecContainer();
            replaceMaterial(obj,'topFigureMaterial','ratoborec_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','ratoborec_'+postfix);
            replaceMaterial(obj,'mainFigureMaterial','ratoborec_'+postfix);
        }else if (ind == 9 || ind == 14){
            obj.main = new VsadnikContainer();
            replaceMaterial(obj,'topFigureMaterial','vsadnik_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','vsadnik_'+postfix);
            replaceMaterial(obj,'mainFigureMaterial','vsadnik_'+postfix);
        }else if (ind == 10 || ind == 13){
            obj.main = new LuchnikContainer();
            replaceMaterial(obj,'topFigureMaterial','luchnik_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','luchnik_'+postfix);
            replaceMaterial(obj,'mainFigureMaterial','luchnik_'+postfix);
        }else if (ind == 11){
            obj.main = new KnyazContainer();
            replaceMaterial(obj,'topFigureMaterial','knyaz_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','knyaz_'+postfix);
            replaceMaterial(obj,'mainFigureMaterial','knyaz_'+postfix);
        }else if (ind == 12){
            obj.main = new VolhvContainer();
            replaceMaterial(obj,'topFigureMaterial','volhv_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','volhv_'+postfix);
            replaceMaterial(obj,'mainFigureMaterial','volhv_'+postfix);
        }else if (ind == 4 + 8 + 8){
            obj.main = new HelgiContainer();
            replaceMaterial(obj,'topFigureMaterial','helgi_'+postfix);
            replaceMaterial(obj,'secondFigureMaterial','helgi_'+postfix);
            replaceMaterial(obj,'mainFigureMaterial','helgi_'+postfix);
        };
        // obj.main.addMoveArrow(obj);
        UTILS.addMoveArrow(obj);
    };
    var replaceMaterial = function(object,matSourceName,matDestName){
        var matDest = materials[matDestName].clone();
        if (matDest === undefined) return;
        for (var i in object.children) {
            if (object.children[i].material === undefined) continue;
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
        // UTILS.rotateAroundWorldAxis(tmpObj,axis,rotAngle);
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
        nullCube.position.copy(obj.position);
        nullCube.boardPosition = obj.boardPosition.clone();
    };
    this.getNullCubePosition = function(obj) {
        return nullCube.position;
    };
    this.getNullCube = function() {
        return nullCube;
    };
    this.createBoardSquares = function(){
        mainBoard.squares = [];
        var m = materials.yellow;
        for (var i = -3; i < 5; i++) {
            for (var j = -3; j < 5; j++) {
                var mSquare = new THREE.Mesh(new THREE.BoxGeometry( 1, .1, 1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true}));
                mSquare.material = m;
                mSquare.name = 'square';
                mSquare.position.x = i - .5;
                mSquare.position.y = .5;
                mSquare.position.z = j - .5;
                mSquare.boardPosition = new THREE.Vector2(i+3,j+3);
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
        this.setNullCubePosition(mainBoard.squares[0]);
    };
    TAVRELI.convertRatnikWithIndex = function(figureIndex){
        if (TAVRELI.isFigureRatnik(figureIndex) === false) return;
        var figure_ = UTILS.getFigureWithIndex(figureIndex,figures.allFigure);
        // figures.allFigure.remove(figure_);
        var index_ = figures.allFigure.indexOf(figure_);
        if (index_ > -1) {
           figures.allFigure.splice(index_, 1);
        }
        scene.remove(figure_);

        mainFigure = new Chess(originCube);
        var chess = mainFigure.getMainObj().clone();
        chess.name = 'figure';
        chess.boardPosition = new THREE.Vector2();
        chess.boardPosition.copy(figure_.boardPosition);
        chess.position.copy(figure_.position);
        if ((figure_.figureIndex == 4) || (figure_.figureIndex == 4 + _maxWhiteIndex)){
            makeFigureWithIndex(chess,figure_.figureIndex + 8 + 8);
            chess.figureIndex = figure_.figureIndex + 8 + 8 + 8;
        }else{
            makeFigureWithIndex(chess,figure_.figureIndex + 8);
            chess.figureIndex = figure_.figureIndex + 8 + 8;
        };
        figures.allFigure.push(chess);
        scene.add(chess);
    };
    TAVRELI.getSquareAtPosition = function(pos2d){
        for (var i = 0; i < mainBoard.children.length; i++) {
            if ((mainBoard.children[i].name == 'square') && (mainBoard.children[i].boardPosition.equals(pos2d))){
                return mainBoard.children[i].clone();
            };
        };
    };
    (this.creates = function() {
        nullCube = new THREE.Mesh(new THREE.BoxGeometry(1, .2, 1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
        var objectAxis = new THREE.AxisHelper(4);
        var objectArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 1, 0), new THREE.Vector3(0, 0, 0), 3);
        nullCube.arrow = objectArrow;
        nullCube.add(objectArrow);
        nullCube.add(objectAxis);
        scene.add(nullCube);

        mainBoard = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 8, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));

        scene.add(mainBoard);
    })();
};
