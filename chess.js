var Chess =  function () {
    var mainCube = null;
    this.init = function() {
        (this.creates = function() {
            mainCube = new THREE.Mesh(new THREE.BoxGeometry(.8, .8, .5, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false}));
        })();
    };
    this.getMainObj = function() {
        return mainCube;
    };
};