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

    materials.name = [];

    TAVRELI.getWhite = function(){
        var white = [];
        for (var i = 0; i < figures.allFigure.length; i++) {
            if (figures.allFigure[i].figureIndex <= 15){
                white.push(figures.allFigure[i]);
            };
        };
        return white;
    }
    TAVRELI.getBlack = function(){
        var black = []
        for (var i = 0; i < figures.allFigure.length; i++) {
            if (figures.allFigure[i].figureIndex > 15){
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
                renderSelectFigure(figures.allFigure[i]);
                break;
            };
        };
    };
    TAVRELI.deSelectFigureWithIndex = function(figureIndex){
        for (var i = 0; i < figures.allFigure.length; i++) {
            if (figures.allFigure[i].figureIndex == figureIndex){
                renderDeselectFigure(figures.allFigure[i]);
                break;
            };
        };
    };
    var renderDeselectFigure = function(figure3d){
        for (var i = 0; i < figure3d.children.length; i++) {
            if (figure3d.children[i].name == 'selected_figure'){
                figure3d.remove(figure3d.children[i]);
                return;
            };
        };
    };
    var renderSelectFigure = function(figure3d){
        var sFigure = new THREE.Mesh(new THREE.BoxGeometry( 5, 5, 5, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}));
        sFigure.name = 'selected_figure';
        // figure3d.position.copy(sFigure.position);
        figure3d.add(sFigure);
    };

    var resetBoardFigure = function() {
        figures.allFigure = [];
        mainFigure = new Chess(originCube);
        for (var i = 0; i < 8*4; i++) {
            var chess = mainFigure.getMainObj().clone();
            chess.name = 'figure';
            chess.position.x = (i % 8) - 4 + .5;
            chess.boardPosition = new THREE.Vector2();
            chess.boardPosition.x = (i % 8);
            chess.position.z = .5;
            if (i == 88){
                makeTestFigure(i);
                continue;
            };
            if (i <= 7){
                chess.position.y = 1 - 4 + .5;
                chess.boardPosition.y = 1;
            }else if ((i >= 8)&&(i <= 15)){
                chess.position.y = 0 - 4 + .5;
                chess.boardPosition.y = 0;
            }else if ((i >= 16)&&(i <= 23)){
                chess.position.y = 6 - 4 + .5;
                chess.boardPosition.y = 6;
            }else if ((i >= 24)&&(i <= 31)){
                chess.position.y = 7 - 4 + .5;
                chess.boardPosition.y = 7;
            }else{
                return;
            }
            makeFigureWithIndex(chess,i);
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
        chess.position.y = 3 - 4 + .5;
        chess.position.z = .5;
        makeFigureWithIndex(chess,figureIndex);
        figures.allFigure.push(chess);
        scene.add(chess);
    };
    var makeFigureWithIndex = function(obj,index){
        obj.figureIndex = index;
        if (index<16){
            makeTavreli(obj,index,'white');
        }else{
            makeTavreli(obj,index-16,'black');
            replaceMaterial(obj,'FrontColor','FrontColorBlack');
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
        var m = materials.brown;
        for (var i = -3; i < 5; i++) {
            for (var j = -3; j < 5; j++) {
                var mSquare = new THREE.Mesh(new THREE.BoxGeometry( 1, 1, .1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true}));
                mSquare.material = m;
                mSquare.name = 'square';
                mSquare.position.x = i - .5;
                mSquare.position.y = j - .5;
                mSquare.position.z = .5;
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
