// http://mochajs.org/
// type 'mocha' in console for run tests
// http://jsbeautifier.org/
var THREE = require('three');
var TAVRELI = require('../main/board.js');
var FIGURES = require('../main/figures.js');
var UTILS = require('../main/utils.js');
var LOGIC = require('../main/logic.js');
var assert = require("assert");
// var private_getAllPositionsForFigure = requireFrom('logicTestExports', './path-to-module').getAllPositionsForFigure;

global.THREE = THREE;
global.FIGURES = FIGURES;
// global.UTILS   = undefined;
global.UTILS = UTILS;

var scene = {};
scene.add = function(mock) {
  console.log(mock.name);
};
global.scene = scene;

var RENDER = {};
RENDER.main = {};
// RENDER.main.showTowerWithPosition(figure_, board);
RENDER.main.showTowerWithPosition = function(figure_, board) {
  console.log("CALL showTowerWithPosition(...)");
};
// RENDER.main.renderSelectFigure(figures.allFigure[i]);
RENDER.main.renderSelectFigure = function(figure3d) {
  console.log("CALL renderSelectFigure(...)");
};
// sourceArray = RENDER.main.getTowerUpFigures(sourceArray);
RENDER.main.getTowerUpFigures = function(sourceArray) {
  console.log("CALL getTowerUpFigures(...)");
};
// RENDER.main.getTowerIndex();
RENDER.main.getTowerIndex = function() {
  console.log("CALL getTowerIndex()");
  return 0;
};
// hideTower(board);
RENDER.main.hideTower = function(board) {
  console.log("CALL hideTower()");
};
global.RENDER = RENDER;

 // PARSER.main.getNotationFromStep(figure_.boardPosition)
var PARSER = {};
PARSER.main = {};
PARSER.main.getNotationFromStep = function(figure_, boardPosition) {
  console.log("CALL getNotationFromStep(...)");
  return "E2";
};
global.PARSER = PARSER;


var testBoard = null;
var testLogic = null;
var sampleTestBoard = null;

describe('The TAVRELI object', function() {
  describe('BOARD test', function() {
    before(function() {
      // runs before all tests in this block
      testBoard = new TAVRELI.init();
      testBoard.creates();
    });
    it('TAVRELI inits', function() {
        assert.notEqual('undefined', TAVRELI.init);
      }),
      it('testBoard.makeTestFigure', function() {
        var testFigure = testBoard.makeTestFigure(7, new THREE.Vector2(1, 0));
        assert.equal('figure', testFigure.name);
        assert.equal(1, testFigure.boardPosition.x)
        assert.equal(0, testFigure.boardPosition.y)
        assert.equal(7, testFigure.figureIndex)
      }),
      it('test create Ratnik', function() {
        testBoard.addTestFigure(7, new THREE.Vector2(1, 7));
        assert.equal(0, testBoard.getBlack().length);
        assert.equal(1, testBoard.getWhite().length);
        assert.equal(1, testBoard.getAllFigure().length);
      }),
      it('test free white', function() {
        var enemy = new THREE.Vector2(1, 7);
        var blackFigureIndex = 7 + testBoard.getWhiteMaxIndex();
        testBoard.addTestFigure(blackFigureIndex, enemy, 1);
        assert.equal(2, testBoard.getAllFigure().length);
        assert.equal(2, testBoard.getAllFiguresAtPosition(enemy).length);
        assert.equal(blackFigureIndex, testBoard.getTopFigureAtPosition(enemy).figureIndex);
        assert.equal(0, testBoard.getFreeWhite().length);
        assert.equal(1, testBoard.getFreeBlack().length);
      })
  })
  describe('LOGIC test', function() {
    before(function() {
      testLogic = new LOGIC.LogicContainer();
    });
    beforeEach(function() {
      testBoard = new TAVRELI.init();
      testBoard.creates();
    });
    it('LOGIC inits', function() {
        assert.notEqual('undefined', LOGIC.LogicContainer);
        var tLogic = new LOGIC.LogicContainer();
        assert.notEqual('undefined', tLogic);
      }),
      it('test Ratnik available positions at 6 line', function() {
        testBoard.addTestFigure(7, new THREE.Vector2(1, 6));
        var aPos = testLogic.getAllPositionsForFigure(7, testBoard, 0, true);
        assert.notEqual('undefined', aPos);
        assert.equal(2, aPos.length);
      }),
      it('test Ratnik available positions at 6 line with barrier', function() {
        testBoard.addTestFigure(7, new THREE.Vector2(1, 6));
        testBoard.addTestFigure(8, new THREE.Vector2(1, 5));
        var aPos = testLogic.getAllPositionsForFigure(7, testBoard, 0, true);
        assert.notEqual('undefined', aPos);
        assert.equal(1, aPos.length);
      }),
      it('test Ratnik available positions at 6 line with barrier enemy', function() {
        testBoard.addTestFigure(7, new THREE.Vector2(1, 6));
        testBoard.addTestFigure(7 + testBoard.getWhiteMaxIndex(), new THREE.Vector2(1, 5));
        var aPos = testLogic.getAllPositionsForFigure(7, testBoard, 0, true);
        assert.notEqual('undefined', aPos);
        assert.equal(0, aPos.length);
      }),
      it('test Ratnik available positions with attack', function() {
        testBoard.addTestFigure(7, new THREE.Vector2(1, 7));
        var enemyIndex = 7 + testBoard.getWhiteMaxIndex();
        testBoard.addTestFigure(enemyIndex, new THREE.Vector2(0, 6));
        var aPos = testLogic.getAllPositionsForFigure(7, testBoard, 0, false);
        assert.notEqual('undefined', aPos);
        assert.equal(2, aPos.length);
      }),
      it('test Ratnik available positions with attack2', function() {
        testBoard.addTestFigure(7, new THREE.Vector2(1, 7));
        var enemyIndex = 7 + testBoard.getWhiteMaxIndex();
        testBoard.addTestFigure(enemyIndex, new THREE.Vector2(0, 6));
        testBoard.addTestFigure(8, new THREE.Vector2(2, 6));
        assert.equal(3, testBoard.getAllFigure().length);
        var aPos = testLogic.getAllPositionsForFigure(7, testBoard, 0, false);
        assert.notEqual('undefined', aPos);
        assert.equal(2, aPos.length);
      }),
      it('test create Ratnik tower', function() {
        var vec2 = new THREE.Vector2(1, 7);
        testBoard.addTestFigure(7, vec2);
        var blackFigureIndex = 7 + testBoard.getWhiteMaxIndex();
        testBoard.addTestFigure(blackFigureIndex, vec2, 1);
        assert.equal(1, testBoard.getBlack().length);
        assert.equal(1, testBoard.getWhite().length);
        assert.equal(2, testBoard.getAllFigure().length);
        var allFigures = testBoard.getAllFigure();
        assert.equal(2, testLogic.getAllFiguresAtPosition(vec2, allFigures).length);
        var someObj = testBoard.makeTestFigure(7, vec2);
        var topFigure = testLogic.getTopFigureAtPosition(someObj, allFigures);
        assert.equal(blackFigureIndex, topFigure.figureIndex);
      }),
      it('test other functions', function() {
        var vec2 = new THREE.Vector2(1, 7);
        testBoard.addTestFigure(7, vec2);
        var someObj = {};
        someObj.boardPosition = vec2.clone();
        assert.equal(7, testLogic.getFigureIndex(someObj, testBoard.getAllFigure()));
        someObj.boardPosition = new THREE.Vector2(0, 0);
        assert.equal(null, testLogic.getFigureIndex(someObj, testBoard.getAllFigure()));
      })
  })
  describe('VOLHV test', function() {
    before(function() {
      testLogic = new LOGIC.LogicContainer();
      testBoard = new TAVRELI.init();
      testBoard.creates();
      testBoard.addTestFigure(12, new THREE.Vector2(4, 6));
    });
    it('test create volh', function() {
        var volhv = testBoard.makeTestFigure(12, new THREE.Vector2(5, 7));
        assert.notEqual('undefined', volhv);
      }),
      it('test volhv available positions', function() {
        var blackFigureIndex = 11 + testBoard.getWhiteMaxIndex();
        testBoard.addTestFigure(blackFigureIndex, new THREE.Vector2(5, 5));
        var aPos = testLogic.getAllPositionsForFigure(12, testBoard, 0, false);
        assert.equal(2, testBoard.getAllFigure().length);
        assert.notEqual('undefined', aPos);
        assert.equal(8, aPos.length);
        var freePos = testLogic.removeAttackedPosition(aPos, 0, testBoard);
        assert.notEqual('undefined', freePos);
        assert.equal(4, freePos.length);
      })
  })
  describe('KNYAZ test', function() {
    before(function() {
      testLogic = new LOGIC.LogicContainer();
      testBoard = new TAVRELI.init();
      testBoard.creates();
      testBoard.addTestFigure(11, new THREE.Vector2(5, 7));
    });
    it('test create knyaz', function() {
        var volhv = testBoard.makeTestFigure(11, new THREE.Vector2(5, 7));
        assert.notEqual('undefined', volhv);
      }),
      it('test knyaz available positions', function() {
        var aPos = testLogic.getAllPositionsForFigure(11, testBoard, 0, true);
        assert.equal(1, testBoard.getAllFigure().length);
        assert.notEqual('undefined', aPos);
        assert.equal(21, aPos.length);
      })
  })
  describe('test check', function() {
    before(function() {
      testLogic = new LOGIC.LogicContainer();
      testBoard = new TAVRELI.init();
      testBoard.creates();
      testBoard.addTestFigure(12, new THREE.Vector2(5, 7));
    });
    it('must be false', function() {
        assert.equal(false, testLogic.isCheck(testBoard, 0));
    }),
    it('must be check', function() {
      var blackFigureIndex = 11 + testBoard.getWhiteMaxIndex();
      testBoard.addTestFigure(blackFigureIndex, new THREE.Vector2(5, 4));
      assert.equal(true, testLogic.isCheck(testBoard, 0));
    }),
    it('must be true', function() {
      var whiteVolhv = UTILS.getFigureWithIndex(12, testBoard.getWhite());
      assert.notEqual('undefined', whiteVolhv);
      whiteVolhv.boardPosition.x = 4;
      assert.equal(false, testLogic.isCheck(testBoard, 0));
      whiteVolhv.boardPosition.x = 5;
      whiteVolhv.boardPosition.y = 6;
      assert.equal(true, testLogic.isCheck(testBoard, 0));
    }),
    it('must be available for attack', function() {
      var whiteVolhv = UTILS.getFigureWithIndex(12, testBoard.getWhite());
      assert.notEqual('undefined', whiteVolhv);
      whiteVolhv.boardPosition.x = 5;
      whiteVolhv.boardPosition.y = 7;
      var blackFigureIndex = 11 + testBoard.getWhiteMaxIndex();
      var blackKnyaz = UTILS.getFigureWithIndex(blackFigureIndex, testBoard.getBlack());
      assert.notEqual('undefined', blackKnyaz);
      blackKnyaz.boardPosition.x = 4;
      blackKnyaz.boardPosition.y = 6;
      var aPos = testLogic.getAllPositionsForFigure(12, testBoard, 0, true);
      var freePos = testLogic.removeAttackedPosition(aPos, 0, testBoard);
      // console.log(freePos);
      assert.equal(2, freePos.length);
    })
  })
  describe('test mat', function() {
    beforeEach(function() {
      testLogic = new LOGIC.LogicContainer();
      testBoard = new TAVRELI.init();
      testBoard.creates();
      testBoard.addTestFigure(12, new THREE.Vector2(5, 7));
    });
    it('must be false', function() {
        assert.equal(false, testLogic.isMat(testBoard, 0));
    }),
    it('must be true', function() {
      var blackFigureIndex = 20 + testBoard.getWhiteMaxIndex();
      testBoard.addTestFigure(blackFigureIndex, new THREE.Vector2(5, 5));
      assert.equal(true, testLogic.isCheck(testBoard, 0));
    })
  })
  describe('test first step', function() {
    before(function() {
      testLogic = new LOGIC.LogicContainer();
      testLogic.Init(function(){console.log("External function call!");});
      testBoard = new TAVRELI.init();
      testBoard.creates();
      testBoard.addTestFigure(12, new THREE.Vector2(5, 7));
    });
    it('Current state must be SOURCE(1)', function() {
        assert.equal(1, testLogic.getCurrentState());
    }),
    it('Current player must be White', function() {
        assert.equal('White', testLogic.getCurrentPlayer());
    }),
    it('Current state must be same', function() {
        testLogic.ClickOnObject();
        testLogic.ClickOnObject(null);
        testLogic.ClickOnObject(null, null);
        var testObj = {};
        testObj.boardPosition = new THREE.Vector2(0, 0);
        testLogic.ClickOnObject(testObj, testBoard);
        assert.equal(1, testLogic.getCurrentState());
    }),
    it('Current state must change to TARGET(2)', function() {
        var testObj = {};
        testObj.boardPosition = new THREE.Vector2(5, 7);
        testLogic.ClickOnObject(testObj, testBoard);
        assert.equal(2, testLogic.getCurrentState());
        assert.equal('White', testLogic.getCurrentPlayer());
    })
  })
  describe('test second step', function() {
    before(function() {
      testLogic = new LOGIC.LogicContainer();
      testLogic.Init(function(){console.log("External function call!");});
      testBoard = new TAVRELI.init();
      testBoard.creates();
      testBoard.addTestFigure(12, new THREE.Vector2(5, 7));
      testBoard.addTestFigure(11, new THREE.Vector2(4, 7));
      var blackFigureIndex = 11 + testBoard.getWhiteMaxIndex();
      testBoard.addTestFigure(blackFigureIndex, new THREE.Vector2(5, 5));
      // var blackVolhvIndex = 12 + testBoard.getWhiteMaxIndex();
      // testBoard.addTestFigure(blackVolhvIndex, new THREE.Vector2(4, 1));
      var testObj = {};
      testObj.boardPosition = new THREE.Vector2(4, 7);
      testLogic.ClickOnObject(testObj, testBoard);
      var sampleBoard = new TAVRELI.init();
      sampleBoard.creates();
      testLogic.setTestBoard(sampleBoard);
    });
    it('Current state must be TARGET(2)', function() {
      assert.equal(2, testLogic.getCurrentState());
      assert.equal('White', testLogic.getCurrentPlayer());
    }),
    it('must be check', function() {
      assert.equal(true, testLogic.isCheck(testBoard, 0));
    }),
    it('Selected figure index must be 11', function() {
      assert.equal(11, testLogic.getSelectedFigureIndex());
    }),
    it('Current state NOT must be changed', function() {
      // Пробуем сходить Князем вперед, т.к. остаемся под шахом
      // такой ход не разрешен
      var testTargetObj = {};
      testTargetObj.boardPosition = new THREE.Vector2(4, 6);
      testLogic.ClickOnObject(testTargetObj, testBoard);
      assert.equal(2, testLogic.getCurrentState());
      assert.equal('White', testLogic.getCurrentPlayer());
    }),
    it('Current state MUST be change', function() {
      // Пробуем закрыться от шаха Князем
      var testTargetObj  = new THREE.Mesh(new THREE.BoxGeometry(1, .2, 1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
      testTargetObj.boardPosition = new THREE.Vector2(5, 6);
      testLogic.ClickOnObject(testTargetObj, testBoard);
      assert.notEqual(2, testLogic.getCurrentState());
    })
  })
  describe('The Game Logic Tests', function() {
    before(function() {
      sampleTestBoard = new TAVRELI.init();
      sampleTestBoard.creates();
      sampleTestBoard.createStartPositionsWithTestFigures();
    });
    it('Create test board with start positions', function() {
      assert.equal(8 * 4, sampleTestBoard.getAllFigure().length);
    }),
    it('Check white figures count', function() {
      var whiteFigures = sampleTestBoard.getWhite();
      assert.equal(16, whiteFigures.length);
      for (var i = 0; i < whiteFigures.length; i++) {
        assert.equal(whiteFigures[i].figureIndex, i);
      };
    }),
    it('Check black figures count', function() {
      var blackFigures = sampleTestBoard.getBlack();
      assert.equal(16, blackFigures.length);
      for (var i = 0; i < blackFigures.length; i++) {
        assert.equal(blackFigures[i].figureIndex, i + sampleTestBoard.getWhiteMaxIndex());
      };
    })
  })
})