if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, stats;

var camera, scene, renderer,projector;

var num = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var controls, time = Date.now();
var clock = new THREE.Clock();

var mouseRay = { x: 0, y: 0 }, INTERSECTED;

var raycaster = new THREE.Raycaster();

init();
animate();

function init() {
    this.init = true;
    
    projector = new THREE.Projector();
    
    container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({antialias: true});

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 500);
    camera.position.z = 15;

    controlsMouse = new THREE.OrbitControls(camera);
    controlsMouse.rotateLeft(.2);
    controlsMouse.rotateUp(-.8);
    controls = new THREE.PointerLockControls(camera);

    scene.add(camera);

    scene.add(new THREE.AmbientLight('rgb(20,20,20)'));

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(3, 3, 15);
    camera.add(directionalLight);

    var maxAnisotropy = renderer.getMaxAnisotropy();

    if (maxAnisotropy > 0) {

        document.getElementById("val_left").innerHTML = maxAnisotropy;

    } else {

        document.getElementById("val_left").innerHTML = "not supported";
        document.getElementById("val_right").innerHTML = "not supported";

    }
    scene.main = new TAVRELI.init();
    
    // model
    var loader = new THREE.OBJMTLLoader();
    loader.load( 'model/ratnik-1.obj', 'model/ratnik-1.mtl', function ( object ){
        scene.main.createModel(object);
        scene.main.getMaterialFromObj(object);
    });


    stats = new Stats();
    container.appendChild(stats.domElement);
    // RENDERER

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    renderer.domElement.style.position = "relative";
    container.appendChild(renderer.domElement);

    // STATS1

    stats = new Stats();
    container.appendChild(stats.domElement);

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;
}

function animate() {

    controlsMouse.update();
    controls.update();
    if (scene.main){
        // document.getElementById("val_right").innerHTML = scene.main.getMainCubeChildrenCount();
    }
    render();
    requestAnimationFrame(animate);
}
//    document.getElementById( "val_right" ).innerHTML = vv;
function render() {

    scene.main.render();

    renderer.render(scene, camera);

    stats.update();
}
function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouseRay.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouseRay.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // scene.main.mouseMove(event.clientX,event.clientY);

    raycaster.setFromCamera( mouseRay, camera );

    var child = scene.main.getMainObj();
    var intersects = raycaster.intersectObjects( child.children,true);

    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            INTERSECTED = intersects[ 0 ].object;
            if (scene.main){
                if (INTERSECTED.name === "square"){
                    scene.main.setNullCubePosition(intersects[ 0 ].object);
                }
                // if (INTERSECTED.name === "figure"){
                //     scene.main.setNullCubePosition(intersects[ 0 ].object);
                // }
            }
        }
    } else {
        // scene.main.clearSelection();
        INTERSECTED = null;
    }
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );

function onDocumentMouseDown( event ) {
    event.preventDefault();
    LOGIC.main.ClickOnObject(scene.main.getNullCubePosition(),TAVRELI);
};
function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

window.addEventListener('resize', onWindowResize, false);

