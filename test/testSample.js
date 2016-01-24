var THREE = require('three');

// var log4js = require('log4js'); 
//console log is loaded by default, so you won't normally need to do this
//log4js.loadAppender('console');
// log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());
// log4js.addAppender(log4js.appenders.file('logs/cheese.log'), 'cheese');
var log4js = require('log4js');
log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: 'logs/sample.log',
        category: 'sample'
    }],
    replaceConsole: true
});
var logger = log4js.getLogger('sample');
logger.setLevel('INFO');

var TAVRELI = require('../main/board.js');
var FIGURES = require('../main/figures.js');
var UTILS = require('../main/utils.js');
var LOGIC = require('../main/logic.js');
var SAMPLES = require('../main/samples.js');
var SERVER_LOGIC = require('../server_logic.js');
var PARSER = require('../main/parser.js');
var assert = require("assert");


logger.trace('trace level');
logger.debug('debug level');
logger.info('info level');
logger.warn('warn level');
logger.error('error level');
logger.fatal('fatal level');

global.THREE = THREE;
global.FIGURES = FIGURES;
global.UTILS = UTILS;

var scene = {};
scene.add = function(mock) {
    logger.debug('MOCK: scene.add:' + mock.name);
};
scene.remove = function(mock) {
    logger.debug('MOCK: scene.remove:' + mock.name);
};
global.scene = scene;

var testLogic = null;
var serverLogic = null;
var sampleBoard = null;
var samples = null;
var parser = null;

describe('The Server Game Logic Samples Test', function() {
    var room = {};
    var testConfig = {};
    testConfig.logger = logger;

    describe('The Sample Test', function() {
        beforeEach(function() {
            serverLogic = new SERVER_LOGIC(testConfig);
            samples = new SAMPLES.SamplesContainer(testConfig);
            parser = new PARSER.ParserContainer();
            room.board = serverLogic.getDefaultBoard();
        });
        it('Shouid be true sample', function() {
            var _sampleArray = null;
            var sampleNum = 17;
            var sampleBadStepNum = 70;
            samples.InitWithSample(sampleNum);
            var sampleStr_ = samples.getSampleString();
            _sampleArray = parser.parseString(sampleStr_);
            logger.trace(_sampleArray);
            var stepData = {};
            logger.info('===== Test sample number:%d(length=%d) =====', sampleNum, _sampleArray.length);
            for (var i = 0; i < _sampleArray.length; i++) {
                stepData.stepNotation = _sampleArray[i] + '-' + _sampleArray[i + 1];
                logger.info('%d)Check:', i, stepData.stepNotation);
                if (sampleBadStepNum == i) {
                    logger.setLevel('DEBUG');
                };
                var res = serverLogic.isUserStepValid(room, stepData);
                assert.equal(true, res);
                if (res === false) break;
                // serverLogic.switchPlayer(room, stepData);//deprecated
                i++;
                logger.info('---------');
            };
        });
    })
})