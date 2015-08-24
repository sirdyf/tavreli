var ROUTER = ROUTER || {revision: "v0.0.1"};

function RouterContainer() {
    var that = this;
    var cSTATE = {NONE: 0, MANUAL: 1, AUTO: 2, NETWORK: 3};
    var _state = cSTATE.NETWORK;
    var _logic = null;
    var _sampleArray = null;
    var _currentStepNum = 0;
    var _DEBUG = false;
    var _pauseOnStep = 1112;
    var _serverUrl = null;
    var _network = [];
    var _needUpdateStep = false;
    var _timePingPong = null;
    var _pingPongIndicator = 0;

    // Cookies.set('clientType', 'White', { expires: 1, path: '' });
    // Cookies.set('sessionId', "SampleSessionId_1" + "_room_4", { expires: 1, path: '' });
    // Cookies.set('clientType', 'Black', { expires: 1, path: '' });
    // Cookies.set('sessionId', "SampleSessionId_2" + "_room_4", { expires: 1, path: '' });
    function startServerPingPong(){
        console.log("startServerPingPong..");
        var curStepNum = _logic.length;
        var stepNotation = _logic.getLastStep();

        var sessionId_ = Cookies.get('sessionId');
        if (sessionId_ === undefined) sessionId_ = "1";
        var clientType_ = Cookies.get('clientType');
        if (clientType_ === undefined) clientType_ = "Init"
        var roomNum = "99";
        if (_network.roomNum !== undefined){
            roomNum = _network.roomNum;
        }else{
            return;
        }
        var params = 'clientType=' + encodeURIComponent(clientType_) + '&sessionId=' + encodeURIComponent(sessionId_) + '&name=' + encodeURIComponent("3") + '&roomNum=' + encodeURIComponent(roomNum);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET",_serverUrl+"/pingpong?"+params, true);
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', "http://localhost");
        xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        xmlhttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange=function(){
          if (xmlhttp.readyState != 4) return

          clearTimeout(timeoutSendPlayerStep); // очистить таймаут при наступлении readyState 4

          if (xmlhttp.status == 200) {
            // Все ок
            console.log("Ping Pong OK!");
            _pingPongIndicator += 1;
            if (_pingPongIndicator === 4) _pingPongIndicator = 0;
            var resp = $.parseJSON(xmlhttp.responseText);//parse JSON
            _network.clientType = resp['clientType'];
            _network.sessionId = resp.sessionId;
            _network.roomNum = resp.roomNum;
            _network.currentStepNum = resp.currentStepNum;
            _network.playerWhite = resp.playerWhite;
            _network.playerBlack = resp.playerBlack;
            updateGameInfo();
          } else {
              handleError(xmlhttp.statusText) // вызвать обработчик ошибки с текстом ответа
          }
        };

        xmlhttp.send(params);
        // Таймаут 10 секунд
        var timeoutSendPlayerStep = setTimeout( function(){ xmlhttp.abort(); handleError("Time over") }, 10000);
    };
    function isOurStep(){
        var curStepNum_ = _logic.getCurrentStepNum();
        console.log("isOurStep serv step num="+_network.currentStepNum+" local step num ="+curStepNum_);
        if (curStepNum_ < _network.currentStepNum) return false;
        // if player white and step even
        if ((curStepNum_ % 2 == 0) && (_network.clientType == 'White')) {
            console.log("our step 1!");
            return true;
        };
        // if player black and step odd
        if ((curStepNum_ % 2 != 0) && (_network.clientType == 'Black')) {
            _needUpdateStep = false;
            console.log("our step 2!");
            return true;
        };
        return false;
    };

    this.zeroStep = function(){
        if (_state != cSTATE.NETWORK) return;
        if ((isOurStep() == false) && (curStepNum_ < _network.currentStepNum)){ 
            _needUpdateStep = true;
            setTimeout(startServerLoop,1000*1);
            return;
        }
        console.log("Send data to server!");
        _needUpdateStep = false;

        var curStepNum_ = _logic.getCurrentStepNum();
        console.log("isOurStep serv step num="+_network.currentStepNum+" local step num ="+curStepNum_);
        if ((curStepNum_ == _network.currentStepNum) && (curStepNum_ != 0)){
            console.log("Skip send data!");
            // _needUpdateStep = false;
            // setTimeout(startServerLoop,1000*1);
            return;
        };  
        // if ((curStepNum_ % 2 == 0) && (_network.clientType == 'Black')) {
        //     console.log("Skip send data!");
        //     _needUpdateStep = true;
        //     setTimeout(startServerLoop,1000*1);
        //     return;
        // };
        // if ((curStepNum_ % 2 != 0) && (_network.clientType == 'Black')) {
        //     _needUpdateStep = false;
        //     console.log("Skip send data!");
        //     _needUpdateStep = true;
        //     setTimeout(startServerLoop,1000*1);
        //     return;
        // };


        var curStepNum_ = _logic.getCurrentStepNum();
        var name_ = "Player Name";
        var stepNotation_ = _logic.getLastStep();
        var params = 'curStepNum=' + encodeURIComponent(curStepNum_) 
            + '&sessionId=' + encodeURIComponent(_network.sessionId)
            + '&name=' + encodeURIComponent(name_)
            + '&stepNotation=' + encodeURIComponent(stepNotation_)
            + '&roomNum=' + encodeURIComponent(_network.roomNum)
            + '&clientType=' + encodeURIComponent(_network.clientType);
            console.log("Send step with params:"+params);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", _serverUrl+'/playerStep', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // xmlhttp.setRequestHeader( 'Content-Type', 'application/json' );//'text/plain; charset=UTF-8');
        xmlhttp.onreadystatechange=function(){
          if (xmlhttp.readyState != 4) return

          clearTimeout(timeoutSendPlayerStep); // очистить таймаут при наступлении readyState 4

          if (xmlhttp.status == 200) {
            // Все ок
            _needUpdateStep = true;
            setTimeout(startServerLoop,1000*3);
          } else {
              handleError(xmlhttp.statusText) // вызвать обработчик ошибки с текстом ответа
          }
        };

        xmlhttp.send(params);
        // Таймаут 10 секунд
        var timeoutSendPlayerStep = setTimeout( function(){ xmlhttp.abort(); handleError("Time over") }, 10000);
    };
    function handleError(message) {
      // обработчик ошибки
      alert("Ошибка: "+message)
    };
    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function serverGetPlayer(){
        var curStepNum = _logic.length;
        var stepNotation = _logic.getLastStep();

        var sessionId_ = Cookies.get('sessionId');
        if (sessionId_ === undefined) sessionId_ = "1";
        var clientType_ = Cookies.get('clientType');
        if (clientType_ === undefined) clientType_ = "Init"
        var roomNum = "4";
        if (window.GameRoomNum !== undefined){
            roomNum = window.GameRoomNum;
        }else{
            roomNum = getRandomInt(9,90);
        }
        var params = 'clientType=' + encodeURIComponent(clientType_) + '&sessionId=' + encodeURIComponent(sessionId_) + '&name=' + encodeURIComponent("3") + '&roomNum=' + encodeURIComponent(roomNum);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET",_serverUrl+"/logonPlayer?"+params, true);
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', "http://localhost");
        xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        xmlhttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                var resp = $.parseJSON(xmlhttp.responseText);//parse JSON
                console.log('Data from Server:'+resp);
                var ct = resp['clientType'];
                console.log("We a "+ct);
                _network.clientType = resp['clientType'];
                _network.sessionId = resp.sessionId;
                _network.roomNum = resp.roomNum;
                _network.currentStepNum = resp.currentStepNum;
                _network.playerWhite = resp.playerWhite;
                _network.playerBlack = resp.playerBlack;
                updateGameInfo();

                Cookies.set('sessionId', _network.sessionId, { expires: 1, path: '' });
                Cookies.set('clientType', _network.clientType, { expires: 1, path: '' });
                _needUpdateStep = true;
                startServerLoop();
                if (_timePingPong !== null) clearInterval(_timePingPong);
                _timePingPong = setInterval(startServerPingPong, 3000);
            }
        }
       xmlhttp.send();
    };
    function updateGameInfo () {
        console.log('updateGameInfo:'+_network.roomNum);
        $('#boardNum').html(_network.roomNum);
        $('#player_white').html(_network.playerWhite);
        $('#player_black').html(_network.playerBlack);
        updatePingPongIndicator();
    }
    function updatePingPongIndicator(){
        var ind = "!";
        if (_pingPongIndicator === 0) {
            ind = "|";
        } else if(_pingPongIndicator === 1){
            ind = "/";
        }else if(_pingPongIndicator === 2){
            ind = "-";
        }else{
            ind = "\\";
        };
        $('#val_left').html(ind);
    };
    function serverGetStep(){
        var curStepNum_ = _logic.getCurrentStepNum();
        var name_ = "Player Name";
        var stepNotation_ = _logic.getLastStep();
        var params = 'curStepNum=' + encodeURIComponent(curStepNum_) 
            + '&sessionId=' + encodeURIComponent(_network.sessionId)
            + '&name=' + encodeURIComponent(name_)
            // + '&stepNotation_=' + encodeURIComponent(stepNotation_)
            + '&roomNum=' + encodeURIComponent(_network.roomNum)
            + '&clientType=' + encodeURIComponent(_network.clientType);
            console.log("Get step with params:"+params);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET",_serverUrl+"/getCurrentNotation?"+params, true);
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', "http://localhost");
        xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        xmlhttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                var resp = $.parseJSON(xmlhttp.responseText);//parse JSON
                console.log('Data from Server:'+resp);
                var ct = resp['clientType'];
                _network.clientType = resp['clientType'];
                _network.sessionId = resp.sessionId;
                _network.roomNum = resp.roomNum;
                _network.currentStepNum = resp.currentStepNum;
                _network.stepNotation = resp.stepNotation;
                console.log("serv step num="+_network.currentStepNum + " local step num="+curStepNum_);
                if (_network.currentStepNum == 0){
                    _needUpdateStep = false;
                    console.log("Stop timer, our step!");
                    return;
                };
                    // console.log("serv step notation="+_network.stepNotation);
                    // if ((isOurStep() == true) && ((_network.stepNotation == ""))){
                        // _needUpdateStep = false;
                        // console.log("Stop timer, our step!");
                        // return;
                    // };
                    // console.log("processNetworkStep with:"+_network.stepNotation);
                    // processNetworkStep();
                    // if ((curStepNum_ % 2 == 0) &&(_network.clientType == 'White')) {
                    //     _needUpdateStep = false;
                    //     console.log("Stop timer, our step!");
                    //     return;
                    // };
                    // if ((curStepNum_ % 2 != 0) &&(_network.clientType == 'Black')) {
                    //     _needUpdateStep = false;
                    //     console.log("Stop timer, our step!");
                    //     return;
                    // };
                // }else 
                if ((_network.stepNotation != stepNotation_) && (_network.stepNotation != "") && (_network.stepNotation !== undefined)) {
                    console.log("processNetworkStep with:"+_network.stepNotation);
                    processNetworkStep();
                    _needUpdateStep = false;
                }else{
                    _needUpdateStep = true;
                };
            }
        }
       xmlhttp.send();
    };
    function startServerLoop(){
        console.log("Try get data from server");
        if (_needUpdateStep) {
            serverGetStep();
        };
        if (_needUpdateStep) {
            console.log("Start timer");
            setTimeout(startServerLoop, 1000*3);
        }
    };
    function processNetworkStep(){
        // TODO: process response
        console.log("processNetworkStep with notation:"+_network.stepNotation);
        processNotation(_network.stepNotation);
        processNotation(_network.stepNotation);
    };
    this.Init = function(){
        _logic = new LogicContainer();
        _logic.Init(this.zeroStep);
        _state = window.GameState;
        _serverUrl = window.GameServerUrl;
        // _serverUrl = "http://192.168.0.11:8080";
        // _serverUrl = "http://127.0.0.1:8080";
        // _serverUrl = "http://localhost:8080/";
        // _serverUrl = "http://dyf-tavreli.rhcloud.com/";
        // _DEBUG = true;
        var sampleStr_ = SAMPLES.main.getSampleString();
        _sampleArray = PARSER.main.parseString(sampleStr_);
        console.log(_sampleArray);
        if (_state == cSTATE.AUTO) {
            var desc_ = SAMPLES.main.getDescriptionForStep(-1);
            $('#description').html(desc_);
        }else if(_state == cSTATE.NETWORK){
            setTimeout(serverGetPlayer,1000*5);
            // TODO: get all previous steps
        }else{
            clickMouse();
        };
        // $('info').mousedown();
    };
    function processNotation(stepNotation){
        var state_ = _logic.getCurrentState();
        var board = TAVRELI;
        if (state_ == 1){//cSTATE.SOURCE){ TODO
            var arr_ = PARSER.main.parseString(stepNotation);
            console.log("Try parse:");
            console.log(arr_);
            processNotationWithFirstStep(arr_[0],board);
        }else if (state_ == 2) {
            var arr_ = PARSER.main.parseString(stepNotation);
            console.log("Try parse:");
            console.log(arr_);
            processNotationWithSecondStep(arr_[1],board);
        };
    };
    function processNotationWithFirstStep(stepNotation,board){
        var state_ = _logic.getCurrentState();
        if (state_ == 1){//cSTATE.SOURCE){ TODO
            var obj_ = {};
            var not_ = stepNotation;
            console.log(not_);
            var max_ = board.getWhiteMaxIndex();
            if ((not_ == '0') || (not_ == 0)){
                if (_currentStepNum % 2 == 0) {
                    obj_ = UTILS.getFigureWithIndex(12,board.getAllFigure());
                }else{
                    obj_ = UTILS.getFigureWithIndex(max_ + 12,board.getAllFigure());
                };
                _logic.ClickOnObject(obj_,board);
                return;
            }
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
                console.log("_logic.ClickOnObject(obj_,board) !!");
                _logic.ClickOnObject(obj_,board);
            };
        };
    };
    function processNotationWithSecondStep(stepNotation,board){
        console.log("processNotationWithSecondStep:"+stepNotation);
        var state_ = _logic.getCurrentState();
        if (state_ == 2){//cSTATE.SOURCE){ TODO
            var obj_ = new THREE.Mesh(new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true}));
            var not_ = stepNotation;
            var fig_ = null;
            var max_ = board.getWhiteMaxIndex();
            if ((not_ == '0') || (not_ == '0-0')){
                var volhvFigureIndex_ = 12;
                if (_currentStepNum % 2 != 0) {
                    volhvFigureIndex_ = max_ + 12;
                };
                var volhv_ = UTILS.getFigureWithIndex(volhvFigureIndex_,board.getAllFigure());
                var delta_ = 0;
                not_ = stepNotation;//_sampleArray[_currentStepNum*2+1];
                if ((not_ == '0-0')){
                    delta_ = -2;
                }else{
                    delta_ = 2;
                };
                obj_.boardPosition = new THREE.Vector2();
                obj_.boardPosition.x = volhv_.boardPosition.x + delta_;
                obj_.boardPosition.y = volhv_.boardPosition.y;
            }else{
                not_ = stepNotation;//_sampleArray[_currentStepNum*2+1];
                console.log(not_);
                UTILS.setIndexFromNotation(not_,obj_);
            };
            fig_ = getBoardSquare(obj_.boardPosition,board);
            obj_.position = new THREE.Vector3();
            obj_.position.copy(fig_.position);
            _logic.ClickOnObject(obj_,board);
            _currentStepNum++;
        };
    };
    this.ClickOnObject = function(obj,board){
        if (_state == cSTATE.MANUAL) {
            _logic.ClickOnObject(obj,board);
        }else if (_state == cSTATE.NETWORK){
            if (_needUpdateStep === false){
                _logic.ClickOnObject(obj,board);
            } else{
                console.log('Wait oponents');
            };
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
            if (state_ == 1){
                var not_ = _sampleArray[_currentStepNum * 2];
                processNotation(not_);
            }else if (state_ == 2){
                var not_ = _sampleArray[_currentStepNum * 2 + 1];
                processNotation(not_);
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
