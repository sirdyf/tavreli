var Chess =  function (obj) {
    var mainCube = obj.clone();
    this.getMainObj = function() {
        return mainCube;
    };
};