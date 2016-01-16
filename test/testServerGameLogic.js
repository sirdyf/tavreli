var THREE = require('three');

var TAVRELI = require('../main/board.js');
var FIGURES = require('../main/figures.js');
var UTILS = require('../main/utils.js');
var LOGIC = require('../main/logic.js');
var SAMPLES = require('../main/samples.js');
var SERVER_LOGIC = require('../server_logic.js');
var PARSER = require('../main/parser.js');
var assert = require("assert");

global.THREE = THREE;
global.FIGURES = FIGURES;
global.UTILS = UTILS;

var scene = {};
scene.add = function(mock) {
    console.log('MOCK: scene.add:' + mock.name);
};
scene.remove = function(mock){
    console.log('MOCK: scene.remove:' + mock.name);
};
global.scene = scene;

var testLogic = null;
var serverLogic = null;
var sampleBoard = null;
var samples = null;
var parser = null;

describe('The Server Game Logic Tests', function() {
    before(function() {
        testLogic = new LOGIC.LogicContainer();
        sampleBoard = new TAVRELI.init();
        sampleBoard.creates();
        sampleBoard.createStartPositionsWithTestFigures();
        serverLogic = new SERVER_LOGIC();
    });
    it('Create test board', function() {
            assert.notEqual('undefined', sampleBoard);
            assert.notEqual('undefined', testLogic);
        }),
        it('Create test board with start positions', function() {
            assert.equal(8 * 4, sampleBoard.getAllFigure().length);
        }),
        it('Create test board with start positions', function() {
            assert.equal(8 * 4, sampleBoard.getAllFigure().length);
        }),
        it('Should be step white', function() {
            var player = testLogic.getCurrentPlayer();
            assert.equal(player, 'White');
        })//,
        // it('Shouid available step E2-E4', function() {
        //     var room = {};
        //     room.board = serverLogic.getDefaultBoard();
        //     var data = {};
        //     data.stepNotation = "E2-E4";
        //     var res = serverLogic.isUserStepValid(room, data);
        //     assert.equal(true, res);
        // }),
        // it('Shouid not available step E4-D5', function() {
        //     var room = {};
        //     room.board = serverLogic.getDefaultBoard();
        //     var stepData = {};
        //     stepData.stepNotation = "E4-D5";
        //     var res = serverLogic.isUserStepValid(room, stepData);
        //     assert.equal(false, res);
        // })
})

describe('The Server Game Logic Sample_1 Test', function() {
    var room = {};
    beforeEach(function() {
        serverLogic = new SERVER_LOGIC();
        samples = new SAMPLES.SamplesContainer();
        parser = new PARSER.ParserContainer();
        room.board = serverLogic.getDefaultBoard();
    });
    // it('Shouid be true sample_4', function() {
    //         samples.InitWithSample(4);
    //         var sampleStr_ = samples.getSampleString();
    //         _sampleArray = parser.parseString(sampleStr_);
    //         // console.log(_sampleArray);
    //         var data = {};
    //         console.log('=====================');
    //         for (var i = 0; i < _sampleArray.length; i++) {
    //             data.stepNotation = _sampleArray[i] + '-' + _sampleArray[i + 1];
    //             console.log('\nCheck:', data.stepNotation);
    //             var res = serverLogic.isUserStepValid(room, data);
    //             assert.equal(true, res);
    //             if (res === false) break;
    //             // serverLogic.switchPlayer(room, data);
    //             i++;
    //             console.log('---------');
    //         };
    //     }),
        it('Shouid be true sample_3', function() {
            samples.InitWithSample(3);
            var sampleStr_ = samples.getSampleString();
            _sampleArray = parser.parseString(sampleStr_);
            // console.log(_sampleArray);
            var stepData = {};
            console.log('=====================');
            for (var i = 0; i < _sampleArray.length; i++) {
                stepData.stepNotation = _sampleArray[i] + '-' + _sampleArray[i + 1];
                console.log('\nCheck:', stepData.stepNotation);
                var res = serverLogic.isUserStepValid(room, stepData);
                assert.equal(true, res);
                if (res === false) break;
                // serverLogic.switchPlayer(room, stepData);//deprecated
                i++;
                console.log('---------');
            };
        })
})