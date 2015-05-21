var ROUTER = ROUTER || {revision: "v0.0.1"};

function RouterContainer() {
    var funcArrays = null;
    var that = this;
    var cSTATE = {NONE: 0, MANUAL: 1, AUTO: 2};
    var _state = cSTATE.MANUAL;
    var _logic = null;

    function zeroStep(obj,board){
    };
    this.Init = function(){
        _logic = new LogicContainer();
        _logic.Init(funcArrays);
        // funcArrays=[zeroStep,wait,parser.getnextStep(),...];
    };
    this.ClickOnObject = function(obj,board){
        if (_state == cSTATE.MANUAL) {
            _logic.ClickOnObject(obj,board);
        };
    };
    this.RenderStep = function(board){
        _logic.RenderStep(board);
    };
};
ROUTER.main = new RouterContainer();
ROUTER.main.Init();
