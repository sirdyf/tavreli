var FIGURES = FIGURES || {revision: "v0.0.2"};

if ( typeof module === 'object' ) {
    module.exports = FIGURES;
}

FIGURES.chessFiguresType = {VIRTUAL: -1, RATNIK: 0, RATOBOREC: 1, VSADNIK: 2, LUCHNIK: 3, KNYAZ: 4, VOLHV: 5, HELGI: 6};

function chessFigures() {
	var _ratnik = new RatnikContainer();
};

FIGURES.RatnikContainer = function(){
	var _moveRule = [];
	var _isJump = true;
	var _figureType = FIGURES.chessFiguresType.RATNIK;

	this.name = 'Ratnik';

	_moveRule.push(new THREE.Vector2( 0, -1));
	_moveRule.push(new THREE.Vector2( 0, -1));
	_moveRule.push(new THREE.Vector2( 1, -1));
	_moveRule.push(new THREE.Vector2(-1, -1));

	this.getMoveRule   = function(){ return _moveRule;   };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
FIGURES.RatoborecContainer = function(){
	var _moveRule = [];
	var _isJump = false;
	var _figureType = FIGURES.chessFiguresType.RATOBOREC;

	this.name = 'Ratoborec';

	_moveRule.push(new THREE.Vector2( 1, 0));
	_moveRule.push(new THREE.Vector2(-1, 0));
	_moveRule.push(new THREE.Vector2( 0, 1));
	_moveRule.push(new THREE.Vector2( 0,-1));

	this.getMoveRule   = function(){ return _moveRule;   };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
FIGURES.VsadnikContainer = function(){
	var _moveRule = [];
	var _isJump = true;
	var _figureType = FIGURES.chessFiguresType.VSADNIK;

	this.name = 'Vsadnik';

	_moveRule.push(new THREE.Vector2( 1, 2));
	_moveRule.push(new THREE.Vector2( 1,-2));
	_moveRule.push(new THREE.Vector2(-1, 2));
	_moveRule.push(new THREE.Vector2(-1,-2));
	_moveRule.push(new THREE.Vector2( 2, 1));
	_moveRule.push(new THREE.Vector2( 2,-1));
	_moveRule.push(new THREE.Vector2(-2, 1));
	_moveRule.push(new THREE.Vector2(-2,-1));

	this.getMoveRule   = function(){ return _moveRule;   };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
FIGURES.LuchnikContainer = function(){
	var _moveRule = [];
	var _isJump = false;
	var _figureType = FIGURES.chessFiguresType.LUCHNIK;

	this.name = 'Luchnik';

	_moveRule.push(new THREE.Vector2( 1, 1));
	_moveRule.push(new THREE.Vector2(-1, 1));
	_moveRule.push(new THREE.Vector2( 1,-1));
	_moveRule.push(new THREE.Vector2(-1,-1));

	this.getMoveRule   = function(){ return _moveRule;   };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
FIGURES.KnyazContainer = function(){
	var _moveRule = [];
	var _isJump = false;
	var _figureType = FIGURES.chessFiguresType.KNYAZ;

	this.name = 'Knyaz';

	var _moveRule1 = new FIGURES.RatoborecContainer().getMoveRule().slice();
	var _moveRule2 = new FIGURES.LuchnikContainer().getMoveRule().slice();
	_moveRule = _moveRule1.concat(_moveRule2)

	this.getMoveRule   = function(){ return _moveRule;   };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
FIGURES.VolhvContainer = function(){
	var _moveRule = [];
	var _isJump = true;
	var _figureType = FIGURES.chessFiguresType.VOLHV;

	this.name = 'Volhv';

	var _moveRule = new FIGURES.KnyazContainer().getMoveRule().slice();
	_moveRule.push(new THREE.Vector2( 1, 0));//add for rocirovka
	_moveRule.push(new THREE.Vector2(-1, 0));//add for rocirovka

	this.getMoveRule   = function(){ return _moveRule;   };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
FIGURES.HelgiContainer = function(){
	var _moveRule = [];
	var _isJump = false;
	var _figureType = FIGURES.chessFiguresType.HELGI;

	this.name = 'Helgi';

	var _moveRule1 = new FIGURES.KnyazContainer().getMoveRule().slice();
	_moveRule = _moveRule1.concat(_moveRule1)

	this.getMoveRule   = function(){ return _moveRule;   };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
FIGURES.HorizontalContainer = function(){
	var _moveRule = [];
	var _isJump = false;
	var _figureType = FIGURES.chessFiguresType.VIRTUAL;

	this.name = 'Horizontal';

	_moveRule.push(new THREE.Vector2( 1,  0));
	_moveRule.push(new THREE.Vector2(-1,  0));

	this.getMoveRule   = function(){ return _moveRule;   };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
