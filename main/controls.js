/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function(camera) {

    var scope = this;
    var enableContols = true;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var rotateYawCW = false; // По часовой
    var rotateYawСCW = false; // Против часовой
    var rotateYawForw = false;
    var rotateYawBack = false;
    var space = false;

    var velocity = new THREE.Vector3();

    var rotateYaw = new THREE.Vector3();

    var velocityYaw = 0;

    var onKeyDown = function(event) {

        switch (event.keyCode) {

            case 38: // up
                moveForward = true;
                break;
            case 87: // w
                rotateYawForw = true;
                break;

            case 37: // left
                moveLeft = true;
                break;

            case 65: // a
                rotateYawСCW = true;
                break;

            case 40: // down
                moveBackward = true;
                break;
            case 83: // s
                rotateYawBack = true;
                break;

            case 39: // right
                moveRight = true;
                break;

            case 68: // d
                rotateYawCW = true;
                break;

            case 32: // space
                space = true;
                    break;

            case 81: // Q 
                break;

            case 69: // E 
                break;

        }

    };

    var onKeyUp = function(event) {

         switch (event.keyCode) {

            case 38: // up
                moveForward = false;
                break;
            case 87: // w
                rotateYawForw = false;
                break;

            case 37: // left
                moveLeft = false;
                break;

            case 65: // a
                rotateYawСCW = false;
                break;

            case 40: // down
                moveBackward = false;
                break;
            case 83: // s
                rotateYawBack = false;
                break;

            case 39: // right
                moveRight = false;
                break;

            case 68: // d
                rotateYawCW = false;
                break;

            case 32: // space
                space = false;
    		break;

            case 81: // Q 
                scene.main.press_Q();
                break;

            case 69: // E 
                break;

        }

    };

    //document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    this.update = function(delta) {//delta is "delta time"
        if (scope.enabled === false)
            return;
        if (rotateYawCW || rotateYawСCW){
            scene.main.pressRotateLR(rotateYawCW ? 1 : -1);
            rotateYawCW=false;
            rotateYawСCW=false;
        }
        if (rotateYawForw || rotateYawBack) {
            scene.main.pressRotateFB(rotateYawForw ? 1 : -1);
            rotateYawForw=false;
            rotateYawBack=false;
        }
  
        if (moveRight || moveLeft){
//            scene.main.pressMoveFront(moveRight ? 1 : -1);
            moveRight=false;
            moveLeft=false;
        };
        if (moveForward || moveBackward){
//            scene.main.pressMoveRight(moveForward ? 1 : -1);
                moveForward=false;
                moveBackward=false;
        };
        if (space){
            scene.main.pressSpace();
            space = false;
        }
    };
//document.getElementById( "val_right" ).innerHTML = vv;

};
