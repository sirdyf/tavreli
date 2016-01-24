var THREE = require('three');
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var winston = require('winston');
winston.emitErrs = true;
winston.loggers.add('testServerGameLogic', {
    console: {
        level: 'warn',
        colorize: true,
        prettyPrint: true,
        label: 'test Server Game Logic',
        json: false,
        handleExceptions: true
    },
    file: {
        level: 'info',
        filename: 'logs/testServerGameLogic.log',
        json: false,
        maxsize: 1024 * 1024 * 5, // 5MB
        handleExceptions: true,
        exceptionHandlers: [
            new winston.transports.File({
                filename: 'logs/exceptions.log'
            })
        ]
    }
});
winston.loggers.add('common', {
    console: {
        level: 'info',
        colorize: true,
        label: 'common logger'
    }
});
var loggerTest = winston.loggers.get('testServerGameLogic');
loggerTest.exitOnError = false;

loggerTest.log('debug', 'debug test message');
loggerTest.debug('test debug');
loggerTest.log('info', 'info test message');

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
    loggerTest.debug('MOCK: scene.add:' + mock.name);
};
scene.remove = function(mock) {
    loggerTest.debug('MOCK: scene.remove:' + mock.name);
};
global.scene = scene;

var testLogic = null;
var serverLogic = null;
var sampleBoard = null;
var samples = null;
var parser = null;


var fs = require('fs');
// var winston = require('winston');

// var stream = fs.createWriteStream('logs/dsm.log');
// var file = new (winston.transports.File)({ stream: stream });
// var logger = new (winston.Logger)({ transports: [file] });


var testWithSampleArray = function(sample, room, sampleName) {
    var sampleStr_ = sample.getSampleString();
    _sampleArray = parser.parseString(sampleStr_);
    // loggerTest.trace(_sampleArray);
    var stepData = {};
    loggerTest.info('========= %s ============(length=%d)', sampleName, _sampleArray.length);
    for (var i = 0; i < _sampleArray.length; i++) {
        stepData.stepNotation = _sampleArray[i] + '-' + _sampleArray[i + 1];
        loggerTest.info('%d)Check:', i, stepData.stepNotation);
        // logger.debug('%d)Check:', i, stepData.stepNotation);
        var res = serverLogic.isUserStepValid(room, stepData);
        if (res === false) {
            loggerTest.error('*** %s ERROR ***', sampleName);
            return false;
        }
        i++;
    };
    // funcDone();
    loggerTest.info('======== %s END', sampleName);
    return true;
};

function something() {
    return Q.reject(Error('fail'));
};
describe('The Server Game Logic Samples Test', function() {
    var room = {};
    var testConfig = {};
    var loggerCommon = winston.loggers.get('common');
    testConfig.logger = loggerCommon;

    describe('The Server Game Logic Tests', function() {
        before(function() {
            testLogic = new LOGIC.LogicContainer(testConfig);
            sampleBoard = new TAVRELI.init(testConfig);
            sampleBoard.creates();
            sampleBoard.createStartPositionsWithTestFigures();
            serverLogic = new SERVER_LOGIC(testConfig);
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
            })
    });
    describe('Samples Test', function() {
        beforeEach(function() {
            serverLogic = new SERVER_LOGIC(testConfig);
            samples = new SAMPLES.SamplesContainer();
            parser = new PARSER.ParserContainer();
            room.board = serverLogic.getDefaultBoard();
        });
        it('Shouid be true sample_1', function() {
            samples.InitWithSample(1);
            var result = testWithSampleArray(samples, room, 'sample_1');
            // loggerTest.debug('sample_1 END', function(err) {
            //     done();
            // });
            // loggerTest.transports.file.flush();
            assert.equal(true, result);
        });
        it('Shouid be true sample_2', function() {
            samples.InitWithSample(2);
            var result = testWithSampleArray(samples, room, 'sample_2');
            assert.equal(true, result);
        });
        it('Shouid be true sample_3', function() {
            samples.InitWithSample(3);
            var result = testWithSampleArray(samples, room, 'sample_3');
            assert.equal(true, result);
        });
        it('Shouid be true sample_4', function() {
            samples.InitWithSample(4);
            var result = testWithSampleArray(samples, room, 'sample_4');
            assert.equal(true, result);
        });
        it('Shouid be true sample_5', function() {
            samples.InitWithSample(5);
            var result = testWithSampleArray(samples, room, 'sample_5');
            assert.equal(true, result);
        });
        it('Shouid be true sample_6', function() {
            samples.InitWithSample(6);
            var result = testWithSampleArray(samples, room, 'sample_6');
            assert.equal(true, result);
        });
        it('Shouid be true sample_7', function() {
            samples.InitWithSample(7);
            var result = testWithSampleArray(samples, room, 'sample_7');
            assert.equal(true, result);
        });
        it('Shouid be true sample_8', function() {
            samples.InitWithSample(8);
            var result = testWithSampleArray(samples, room, 'sample_8');
            assert.equal(true, result);
        });
        it('Shouid be true sample_9', function() {
            samples.InitWithSample(9);
            var result = testWithSampleArray(samples, room, 'sample_9');
            assert.equal(true, result);
        });
        it('Shouid be true sample_10', function() {
            samples.InitWithSample(10);
            var result = testWithSampleArray(samples, room, 'sample_10');
            assert.equal(true, result);
        });
        it('Shouid be true sample_11', function() {
            samples.InitWithSample(11);
            var result = testWithSampleArray(samples, room, 'sample_11');
            assert.equal(true, result);
        });
        it('Shouid be true sample_12', function() {
            samples.InitWithSample(12);
            var result = testWithSampleArray(samples, room, 'sample_12');
            assert.equal(true, result);
        });
        it('Shouid be true sample_13', function() {
            samples.InitWithSample(13);
            var result = testWithSampleArray(samples, room, 'sample_13');
            assert.equal(true, result);
        });
        it('Shouid be true sample_14', function() {
            samples.InitWithSample(14);
            var result =
                testWithSampleArray(samples, room, 'sample_14');
            // loggerTest.transports.file.flush(function() {
            //     done();
            // });
            // return loggerTest.transports.file.flush().then(function(){
            //     done;
            // });
            // loggerTest.debug('sample_14 END', function(err) {
            //     done();
            // });
            // assert.equal(true, result);
        });
        it('Shouid be true sample_15', function() {
            samples.InitWithSample(15);
            var result = testWithSampleArray(samples, room, 'sample_15');
            assert.equal(true, result);
        });
        it('Shouid be true sample_16', function() {
            samples.InitWithSample(16);
            var result = testWithSampleArray(samples, room, 'sample_16');
            assert.equal(true, result);
        });
        it('Shouid be true sample_17', function() {
            samples.InitWithSample(17);
            var result = testWithSampleArray(samples, room, 'sample_17');
            assert.equal(true, result);
        });
        it('Shouid be true sample_18', function() {
            samples.InitWithSample(18);
            var result = testWithSampleArray(samples, room, 'sample_18');
            assert.equal(true, result);
        });
        it('Shouid be true sample_19', function() {
            samples.InitWithSample(19);
            var result = testWithSampleArray(samples, room, 'sample_19');
            assert.equal(true, result);
        });
        it('Shouid be true sample_20', function() {
            samples.InitWithSample(20);
            var result = testWithSampleArray(samples, room, 'sample_20');
            assert.equal(true, result);
        });
    });
});