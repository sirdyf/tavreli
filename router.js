var ROUTER = ROUTER || {revision: "v0.0.1"};

function RouterContainer() {
    var funcArrays = null;
    var that = this;
    var cSTATE = {NONE: 0, MANUAL: 1, AUTO: 2};
    var _state = cSTATE.MANUAL;
    var _logic = null;
    var _sampleArray = null;
    var _currentStepNum = 0;
    var _DEBUG = false;
    var _pauseOnStep = 99;//28;

    function zeroStep(obj,board){
    };
    this.Init = function(){
        _logic = new LogicContainer();
        _logic.Init(funcArrays);
        _state = cSTATE.AUTO;
        _DEBUG = true;
        var sampleStr_ = SAMPLES.main.getSampleString();
        _sampleArray = PARSER.main.parseString(sampleStr_);
        console.log(_sampleArray);
        // funcArrays=[zeroStep,wait,parser.getnextStep(),...];
        if (_state == cSTATE.AUTO) {
            var desc_ = SAMPLES.main.getDescriptionForStep(-1);
            $('#description').html(desc_);
        };
        clickMouse();
        // $('info').mousedown();
    };
    this.ClickOnObject = function(obj,board){
        if (_state == cSTATE.MANUAL) {
            _logic.ClickOnObject(obj,board);
        }else if (_state == cSTATE.AUTO) {
            if (_currentStepNum * 2 >= _sampleArray.length){
                _DEBUG = false;
                _state = cSTATE.NONE;
                return;
            };
            var curStepNotation_ = _sampleArray[_currentStepNum * 2] + "-" + _sampleArray[_currentStepNum * 2 + 1];
            $('#val_right').html(_currentStepNum +")" + curStepNotation_);
            var desc_ = SAMPLES.main.getDescriptionForStep(_currentStepNum);
            $('#description').html(desc_);
            var state_ = _logic.getCurrentState();
            if (state_ == 1){//cSTATE.SOURCE){ TODO
                var obj_ = {};
                var not_ = _sampleArray[_currentStepNum*2];
                console.log(not_);
                if (not_.length >2){
                    var towerIndex_ = not_.substring(3);
                    var intValue = parseInt(towerIndex_,10)

                    not_ = not_.substring(0,2);
                    UTILS.setIndexFromNotation(not_,obj_);
                    _logic.ClickOnObject(obj_,board);

                    var towerFigure_ = RENDER.main.getTowerFigureWithIndex(intValue);
                    RENDER.main.selectTowerWith(towerFigure_);
                }else{
                    UTILS.setIndexFromNotation(not_,obj_);
                    _logic.ClickOnObject(obj_,board);
                };
            }else if (state_ == 2){
                var obj_ = new THREE.Mesh(new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true}));
                var not_ = _sampleArray[_currentStepNum*2+1];
                console.log(not_);
                UTILS.setIndexFromNotation(not_,obj_);
                var fig_ = getBoardSquare(obj_.boardPosition,board);
                obj_.position = new THREE.Vector3();
                obj_.position.copy(fig_.position);
                _logic.ClickOnObject(obj_,board);
                _currentStepNum++;
            };
        };
    };
    function fireEvent(eventName,eventType){
        var event; // The custom event that will be created

        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(eventName, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = eventType;
        }

        event.eventName = eventName;

        if (document.createEvent) {
            element.dispatchEvent(event);
        } else {
            element.fireEvent("on" + event.eventType, event);
        }
    };
    function clickMouse(){
        // var targetNode = document.querySelector ("a[href*='stackoverflow']");
        var targetNode = document;
        if (targetNode) {
            //--- Simulate a natural mouse-click sequence.
            // triggerMouseEvent (targetNode, "mouseover");
            triggerMouseEvent (targetNode, "mousedown");
            triggerMouseEvent (targetNode, "mouseup");
            // triggerMouseEvent (targetNode, "click");
        }
        else
            console.log ("*** Target node not found!");
    };
    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    };
    function getBoardSquare(boardPosition, board){
        var figures_ = board.getSquares();
        for (var i = 0; i < figures_.length; i++) {
            if (figures_[i].boardPosition.equals(boardPosition)){
                return figures_[i];
            };
        };
        return null;
    };
    this.RenderStep = function(board){
        _logic.RenderStep(board);
            var state_ = _logic.getCurrentState();
            if ((_DEBUG === true) && (state_ == 1)){//cSTATE.SOURCE){ TODO
                if (_currentStepNum < _pauseOnStep) {
                    startTimer();
                };
            };
    };
    function startTimer () {
        // _timer.start();
        setTimeout(stopTimer,1000);
    };
    function stopTimer () {
        // _timer.stop();
        clickMouse();
    };
};
ROUTER.main = new RouterContainer();
ROUTER.main.Init();
