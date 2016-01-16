var ROUTER = ROUTER || {
    revision: "v0.0.2"
};
if (typeof module === 'object') {
    module.exports = ROUTER;
}
ROUTER.RouterContainer = function() {
    var that = this;
    var rSTATE = {
        NONE: 0,
        MANUAL: 1,
        AUTO: 2,
        NETWORK: 3,
        TEST: 4
    };
    var _state = rSTATE.NETWORK;
    var _logic = null;
    var _board = null;
    var _sampleArray = null;
    var _currentStepNum = 0;
    var _DEBUG = false;
    var _pauseOnStep = 1112;
    var _serverUrl = null;
    var _network = [];
    var _timePingPong = null;
    var _pingPongIndicator = 0;

    // Cookies.set('clientType', 'White', { expires: 1, path: '' });
    // Cookies.set('sessionId', "SampleSessionId_1" + "_room_4", { expires: 1, path: '' });
    // Cookies.set('clientType', 'Black', { expires: 1, path: '' });
    // Cookies.set('sessionId', "SampleSessionId_2" + "_room_4", { expires: 1, path: '' });
    function startServerPingPong() {
        console.log("startServerPingPong..");
        var curStepNum = _logic.length;
        var stepNotation = _logic.getLastStep();

        var sessionId_ = Cookies.get('sessionId');
        if (sessionId_ === undefined) sessionId_ = "1";
        var clientType_ = Cookies.get('clientType');
        if (clientType_ === undefined) clientType_ = "Init"
        var roomNum = "99";
        if (_network.roomNum !== undefined) {
            roomNum = _network.roomNum;
        } else {
            return;
        }
        var params = 'clientType=' + encodeURIComponent(clientType_) + '&sessionId=' + encodeURIComponent(sessionId_) + '&name=' + encodeURIComponent("3") + '&roomNum=' + encodeURIComponent(roomNum);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", _serverUrl + "/pingpong?" + params, true);
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', "http://localhost");
        xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState != 4) return

            clearTimeout(timeoutSendPlayerStep); // очистить таймаут при наступлении readyState 4

            if (xmlhttp.status == 200) {
                // Все ок
                console.log("Ping Pong OK!");
                _pingPongIndicator += 1;
                if (_pingPongIndicator === 4) _pingPongIndicator = 0;
                var resp = $.parseJSON(xmlhttp.responseText); //parse JSON
                _network.clientType = resp['clientType'];
                _network.sessionId = resp.sessionId;
                _network.roomNum = resp.roomNum;
                _network.currentStepNum = resp.currentStepNum;
                _network.playerWhite = resp.playerWhite;
                _network.playerBlack = resp.playerBlack;
                updateGameInfo();
                // that.zeroStep();
                startServerLoopIfNeed();
            } else {
                handleError(xmlhttp.statusText) // вызвать обработчик ошибки с текстом ответа
            }
        };

        xmlhttp.send(params);
        // Таймаут 10 секунд
        var timeoutSendPlayerStep = setTimeout(function() {
            xmlhttp.abort();
            handleError("Time over")
        }, 10000);
    };

    function isOurStep() {
        // && (curStepNum_ < _network.currentStepNum)
        var curStepNum_ = _logic.getCurrentStepNum();
        console.log("isOurStep serv step num=" + _network.currentStepNum + " local step num =" + curStepNum_);
        if (curStepNum_ < _network.currentStepNum) return false;
        // if player white and step even
        if ((curStepNum_ % 2 == 0) && (_network.clientType == 'White')) {
            console.log("our step 1!");
            return true;
        };
        // if player black and step odd
        if ((curStepNum_ % 2 != 0) && (_network.clientType == 'Black')) {
            console.log("our step 2!");
            return true;
        };
        console.log('Wait oponents');
        return false;
    };

    this.zeroStep = function() {
        if (_state == rSTATE.NONE) return;
        if (_state != rSTATE.NETWORK) return;
        // if (isOurStep() == false){ 
        //     return;
        // }
        console.log("Send data to server!");
        var curStepNum_ = _logic.getCurrentStepNum();
        console.log("isOurStep serv step num=" + _network.currentStepNum + " local step num =" + curStepNum_);
        if ((curStepNum_ == _network.currentStepNum) && (curStepNum_ != 0)) {
            console.log("Skip send data!");
            return;
        };
        var curStepNum_ = _logic.getCurrentStepNum();
        var name_ = "Player Name";
        var stepNotation_ = _logic.getLastStep();
        var params = 'curStepNum=' + encodeURIComponent(curStepNum_) + '&sessionId=' + encodeURIComponent(_network.sessionId) + '&name=' + encodeURIComponent(name_) + '&stepNotation=' + encodeURIComponent(stepNotation_) + '&roomNum=' + encodeURIComponent(_network.roomNum) + '&clientType=' + encodeURIComponent(_network.clientType);
        console.log("Send step with params:" + params);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", _serverUrl + '/playerStep', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState != 4) return

            clearTimeout(timeoutSendPlayerStep); // очистить таймаут при наступлении readyState 4

            if (xmlhttp.status == 200) {
                // Все ок
            } else {
                handleError(xmlhttp.statusText) // вызвать обработчик ошибки с текстом ответа
            }
        };

        xmlhttp.send(params);
        // Таймаут 10 секунд
        var timeoutSendPlayerStep = setTimeout(function() {
            xmlhttp.abort();
            handleError("Time over")
        }, 10000);
    };

    function handleError(message) {
        // обработчик ошибки
        alert("Ошибка: " + message)
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

    function updateGameInfo() {
        console.log('updateGameInfo:' + _network.roomNum);
        $('#boardNum').html(_network.roomNum);
        $('#player_white').html(_network.playerWhite);
        $('#player_black').html(_network.playerBlack);
        updatePingPongIndicator();
    }

    function updatePingPongIndicator() {
        var ind = "!";
        if (_pingPongIndicator === 0) {
            ind = "|";
        } else if (_pingPongIndicator === 1) {
            ind = "/";
        } else if (_pingPongIndicator === 2) {
            ind = "-";
        } else {
            ind = "\\";
        };
        $('#val_left').html(ind);
    };

    function serverGetStep() {
        var curStepNum_ = _logic.getCurrentStepNum();
        var name_ = "Player Name";
        var stepNotation_ = _logic.getLastStep();
        var params = 'curStepNum=' + encodeURIComponent(curStepNum_) + '&sessionId=' + encodeURIComponent(_network.sessionId) + '&name=' + encodeURIComponent(name_)
            // + '&stepNotation_=' + encodeURIComponent(stepNotation_)
            + '&roomNum=' + encodeURIComponent(_network.roomNum) + '&clientType=' + encodeURIComponent(_network.clientType);
        console.log("Get step with params:" + params);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", _serverUrl + "/getCurrentNotation?" + params, true);
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', "http://localhost");
        xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var resp = $.parseJSON(xmlhttp.responseText); //parse JSON
                console.log('Data from Server:' + resp);
                var ct = resp['clientType'];
                _network.clientType = resp['clientType'];
                _network.sessionId = resp.sessionId;
                _network.roomNum = resp.roomNum;
                _network.currentStepNum = resp.currentStepNum;
                _network.stepNotation = resp.stepNotation;
                console.log("serv step num=" + _network.currentStepNum + " local step num=" + curStepNum_);
                // if (_network.currentStepNum == 0){
                //     console.log("Stop timer, our step!");
                //     return;
                // };
                if ((_network.stepNotation != stepNotation_) && (_network.stepNotation != "") && (_network.stepNotation !== undefined)) {
                    console.log("processNetworkStep with:" + _network.stepNotation);
                    processNetworkStep();
                };
            }
        }
        xmlhttp.send();
    };

    function startServerLoopIfNeed() {
        if (isOurStep() === false) {
            serverGetStep();
        };
    };

    function processNetworkStep(board) {
        // TODO: process response
        console.log("processNetworkStep with notation:" + _network.stepNotation);
        processNotation(_network.stepNotation, board);
        processNotation(_network.stepNotation, board);
    };

    this.processNotation = function(stepNotation, board) {
        console.log('--- processNotation:%s ---', stepNotation);
        var logicState_ = _logic.getCurrentState();
        // TODO: !!!! scene.main !!!!
        // var board = scene.main; //TAVRELI;
        var arr_ = PARSER.main.parseString(stepNotation);
        console.log("Try parse:");
        console.log(arr_);
        if (logicState_ == 1) { //rSTATE.SOURCE){ TODO
            that.processNotationWithFirstStep(arr_[0], board);
        } else if (logicState_ == 2) {
            if (stepNotation == '0-0') {
                console.log('Long rokirovka!');
                that.processNotationWithSecondStep('0-0', board);
            }else{
                that.processNotationWithSecondStep(arr_[0], board);
            };
        };
        return _logic.getCurrentState();
    };

    this.processNotationWithFirstStep = function(stepNotation, board) {
        console.log("--- processNotationWithFirstStep:%s ---", stepNotation);
        var state_ = _logic.getCurrentState();
        if (state_ == 1) { //rSTATE.SOURCE){ TODO
            var obj_ = {};
            var not_ = stepNotation;
            console.log(not_);
            var max_ = board.getWhiteMaxIndex();
            if ((not_ == '0') || (not_ == 0)) {
                if (_currentStepNum % 2 == 0) {
                    obj_ = UTILS.getFigureWithIndex(12, board.getAllFigure());
                } else {
                    obj_ = UTILS.getFigureWithIndex(max_ + 12, board.getAllFigure());
                };
                _logic.ClickOnObject(obj_, board);
                return;
            }
            //************************************************************************
            if (not_.length > 2) {
                var towerIndex_ = not_.substring(3);
                var intValue = parseInt(towerIndex_, 10)

                not_ = not_.substring(0, 2);
                UTILS.setIndexFromNotation(not_, obj_);

                _logic.ClickOnObject(obj_, board);

                console.log('ROUTER tower Index=%d',intValue);
                var towerFigure_ = RENDER.main.getTowerFigureWithIndex(intValue);
                // console.log('ROUTER towerFigure_=', towerFigure_);
                RENDER.main.selectTowerWith(towerFigure_);
            } else {
                UTILS.setIndexFromNotation(not_, obj_);
                console.log("_logic.ClickOnObject(obj_,board) !!");
                _logic.ClickOnObject(obj_, board);
            };
        };
    };

    this.processNotationWithSecondStep = function(stepNotation, board) {
        console.log("--- processNotationWithSecondStep:%s ---", stepNotation);
        var state_ = _logic.getCurrentState();
        if (state_ == 2) { //rSTATE.SOURCE){ TODO
            var obj_ = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), new THREE.MeshBasicMaterial({
                color: 0xff00ff,
                wireframe: true
            }));
            var not_ = stepNotation;
            var fig_ = null;
            var max_ = board.getWhiteMaxIndex();
            if ((not_ == '0') || (not_ == '0-0')) {
                var volhvFigureIndex_ = 12;
                if (_currentStepNum % 2 != 0) {
                    volhvFigureIndex_ = max_ + 12;
                };
                var volhv_ = UTILS.getFigureWithIndex(volhvFigureIndex_, board.getAllFigure());
                var delta_ = 0;
                not_ = stepNotation; //_sampleArray[_currentStepNum*2+1];
                if (not_ == '0-0') {
                    // if (_logic.getCurrentPlayer() == 'White' ) {
                        delta_ = -2;
                    // }else{
                        // delta_ = 2;
                    // };
                } else {
                    // if (_logic.getCurrentPlayer() == 'White' ) {
                        delta_ = 2;
                    // }else{
                        // delta_ = -2;
                    // };
                };
                obj_.boardPosition = new THREE.Vector2();
                obj_.boardPosition.x = volhv_.boardPosition.x + delta_;
                obj_.boardPosition.y = volhv_.boardPosition.y;
            } else {
                not_ = stepNotation; //_sampleArray[_currentStepNum*2+1];
                console.log(not_);
                UTILS.setIndexFromNotation(not_, obj_);
            };
            fig_ = getBoardSquare(obj_.boardPosition, board);
            console.log('ROUTER fig board pos=', fig_.boardPosition);
            console.log('ROUTER fig position=', fig_.position);
            obj_.position = new THREE.Vector3();
            obj_.position.copy(fig_.position);
            _logic.ClickOnObject(obj_, board);
            _currentStepNum++;
        };
    };
    this.ClickOnObject = function(obj, board) {
        if (_state == rSTATE.NONE) return;
        console.log('ROUTER.ClickOnObject() WITH _state=%d', _state);
        if (_state == rSTATE.TEST) {
            _logic.ClickOnObject(obj, board);
        } else if (_state == rSTATE.MANUAL) {
            _logic.ClickOnObject(obj, board);
        } else if (_state == rSTATE.NETWORK) {
            if (isOurStep() === true) {
                _logic.ClickOnObject(obj, board);
            } else {
                console.log('Wait oponents');
            };
        } else if (_state == rSTATE.AUTO) {
            console.log('jnjnjnjnjnjjnjnjnjn', _currentStepNum, _sampleArray);
            if (_currentStepNum * 2 >= _sampleArray.length) {
                _DEBUG = false;
                _state = rSTATE.NONE;
                return;
            };
            var curStepNotation_ = _sampleArray[_currentStepNum * 2] + "-" + _sampleArray[_currentStepNum * 2 + 1];
            $('#val_right').html(_currentStepNum + ")" + curStepNotation_);
            var desc_ = SAMPLES.main.getDescriptionForStep(_currentStepNum);
            $('#description').html(desc_);
            var state_ = _logic.getCurrentState();
            if (state_ == 1) {
                var not_ = _sampleArray[_currentStepNum * 2];
                that.processNotation(not_, scene.main);
            } else if (state_ == 2) {
                var not_ = _sampleArray[_currentStepNum * 2 + 1];
                that.processNotation(not_, scene.main);
            };
        };
    };

    function fireEvent(eventName, eventType) {
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

    function clickMouse() {
        // var targetNode = document.querySelector ("a[href*='stackoverflow']");
        var targetNode = document;
        if (targetNode) {
            //--- Simulate a natural mouse-click sequence.
            // triggerMouseEvent (targetNode, "mouseover");
            triggerMouseEvent(targetNode, "mousedown");
            triggerMouseEvent(targetNode, "mouseup");
            // triggerMouseEvent (targetNode, "click");
        } else
            console.log("*** Target node not found!");
    };

    function triggerMouseEvent(node, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    };

    function getBoardSquare(boardPosition, board) {
        var figures_ = board.getSquares();
        for (var i = 0; i < figures_.length; i++) {
            if (figures_[i].boardPosition.equals(boardPosition)) {
                return figures_[i];
            };
        };
        return null;
    };
    this.RenderStep = function(board, testMode) {
        if (_state == rSTATE.NONE) return;
        if (testMode === undefined) {
            if ((_logic === undefined) || (_logic === null)) {
                console.log('_logic => null');
            } else {
                _logic.RenderStep(board);
            };
        } else {
            console.log('ROUTER.RenderStep()');
            _logic.RenderStep(board, testMode);
        };
        var state_ = null;
        if ((_logic === undefined) || (_logic === null)) {
            console.log('_logic => null');
        } else {
            state_ = _logic.getCurrentState();
        };

        if ((_DEBUG === true) && (state_ == 1)) { //rSTATE.SOURCE){ TODO
            if (_currentStepNum < _pauseOnStep) {
                startTimer();
            };
        };
        return state_;
    };

    function startTimer() {
        // _timer.start();
        setTimeout(stopTimer, 1000);
    };

    function stopTimer() {
        // _timer.stop();
        clickMouse();
    };

    function serverGetPlayer() {
        var curStepNum = _logic.length;
        var stepNotation = _logic.getLastStep();

        var sessionId_ = Cookies.get('sessionId');
        if (sessionId_ === undefined) sessionId_ = "1";
        var clientType_ = Cookies.get('clientType');
        if (clientType_ === undefined) clientType_ = "Init"
        var roomNum = Cookies.get('roomNumber');
        if (roomNum !== undefined) {
            // alert("roomNum "+roomNum);
        } else {
            // alert("undefined");
            roomNum = getRandomInt(9, 90);
        }
        var params = 'clientType=' + encodeURIComponent(clientType_) + '&sessionId=' + encodeURIComponent(sessionId_) + '&name=' + encodeURIComponent("3") + '&roomNum=' + encodeURIComponent(roomNum);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", _serverUrl + "/logonPlayer?" + params, true);
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', "http://localhost");
        xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var resp = $.parseJSON(xmlhttp.responseText); //parse JSON
                console.log('Data from Server:' + resp);
                var ct = resp['clientType'];
                console.log("We a " + ct);
                _network.clientType = resp['clientType'];
                _network.sessionId = resp.sessionId;
                _network.roomNum = resp.roomNum;
                _network.currentStepNum = resp.currentStepNum;
                _network.playerWhite = resp.playerWhite;
                _network.playerBlack = resp.playerBlack;
                updateGameInfo();

                Cookies.set('sessionId', _network.sessionId, {
                    expires: 1,
                    path: ''
                });
                Cookies.set('clientType', _network.clientType, {
                    expires: 1,
                    path: ''
                });
                startServerLoopIfNeed();
                if (_timePingPong !== null) clearInterval(_timePingPong);
                _timePingPong = setInterval(startServerPingPong, 5000);
            }
        }
        xmlhttp.send();
    };

    function defaultSettings() {
        _serverUrl = window.GameServerUrl;
        _state = window.GameState;
    }

    function makeBoard(boardData, board) {
        var resBoard = [];
        for (var i = 0; i < boardData.length; i++) {
            var savedFigure = {};
            savedFigure.name = boardData[i].name;
            savedFigure.position = {};
            savedFigure.position.x = boardData[i].position.x;
            savedFigure.position.y = boardData[i].position.y;
            savedFigure.position.z = boardData[i].position.z;
            savedFigure.boardPosition = {};
            savedFigure.boardPosition.x = boardData[i].boardPosition.x;
            savedFigure.boardPosition.y = boardData[i].boardPosition.y;
            savedFigure.indexY = boardData[i].indexY;
            savedFigure.figureIndex = boardData[i].figureIndex;
            resBoard.push(savedFigure);
        };
        console.log(resBoard);
        board.setBoardFigures(resBoard);
    };

    function getJsonErrorData(board) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", _serverUrl + "/showerror/1", true);
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', "http://localhost");
        xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var resp = $.parseJSON(xmlhttp.responseText); //parse JSON
                // console.log('Data from Server:' + resp);
                makeBoard(resp, board);
            }
        }
        xmlhttp.send();
    };
    this.Init = function(state, localLogic, board) {
        console.log('--- Init(state=%d) ---', state);
        if (state === rSTATE.TEST) {
            _state = state;
            console.log('* state set manual:%d', state);
            _logic = localLogic;
            return;
        };
        _logic = new LOGIC.LogicContainer();
        _logic.Init(this.zeroStep);
        var sampleBoard = new TAVRELI.init();
        sampleBoard.creates("skip");
        _logic.setTestBoard(sampleBoard);
        defaultSettings();
        SAMPLES.main = new SAMPLES.SamplesContainer();
        SAMPLES.main.InitWithSample(window.GameDemoNum);
        if (_state == 99) {
            getJsonErrorData(board);
            _state = rSTATE.NONE;
        } else if (_state == rSTATE.AUTO) {
            var desc_ = SAMPLES.main.getDescriptionForStep(-1);
            $('#description').html(desc_);
            _state = window.GameState;
            var sampleStr_ = SAMPLES.main.getSampleString();
            console.log('dddddddddddddddd', sampleStr_);
            _sampleArray = PARSER.main.parseString(sampleStr_);
            console.log(_sampleArray);
            clickMouse();
        } else if (_state == rSTATE.NETWORK) {
            setTimeout(serverGetPlayer, 1000 * 5);
            // TODO: get all previous steps
        } else {
            console.log('???');
        };
    };
    // $('info').mousedown();
};
// ROUTER.main = new ROUTER.RouterContainer();
// ROUTER.main.Init();