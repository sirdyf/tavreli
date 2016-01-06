var THREE = require('three');

var TAVRELI = require('../main/board.js');
var FIGURES = require('../main/figures.js');
var UTILS = require('../main/utils.js');
var LOGIC = require('../main/logic.js');
var SERVER_LOGIC = require('../server_logic.js');
var assert = require("assert");

global.THREE = THREE;
global.FIGURES = FIGURES;
global.UTILS = UTILS;

var scene = {};
scene.add = function(mock) {
    console.log(mock.name);
};
global.scene = scene;

var testBoard = null;
var testLogic = null;

describe('The Server Game Logic Tests', function() {
    before(function() {
        testLogic = new LOGIC.LogicContainer();
        sampleBoard = new TAVRELI.init();
        sampleBoard.creates();
        sampleBoard.createStartPositionsWithTestFigures();
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
    it('test game logic', function() {
        var room = {};
        room.board = {};
        var data = {};
        var serverLogic = new SERVER_LOGIC();
        serverLogic.isUserStepValid(room, data);
        assert.equal('1','1');
    })
})
    // room_['White'].sessionId = "SampleSessionId_1" + "_room_" + roomNum;
    // room_['Black'].sessionId = "SampleSessionId_2" + "_room_" + roomNum;
    // room_.notations = ["E2-E4","D7-D6"];
    // room_.notations = ["E2-E4","D7-D6","C2-C3"];
    // room_.currentStepNum = room_.notations.length;