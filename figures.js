var chessFiguresType = {RATNIK: 0, RATOBOREC: 1, VSADNIK: 2, LUCHNIK: 3, KNYAZ: 4, VOLHV: 5, HELGI: 6};

function chessFigures() {
	var _ratnik = new RatnikContainer();
};

function RatnikContainer(){
	var _moveRule = [];
	var _attackRule = [];
	var _isJump = false;
	var _figureType = chessFiguresType.RATNIK;

	this.name = 'Ratnik';

	this.addMoveArrow = function(figure){
	    // var objectAxis = new THREE.AxisHelper(4);
	    var objectArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 1, 0), 10);
	    objectArrow.name = 'move_arrow';
		figure.add(objectArrow);
	};

	_moveRule.push(new THREE.Vector2(0, 1));

	_attackRule.push(new THREE.Vector2(1, 1));
	_attackRule.push(new THREE.Vector2(1,-1));

	this.getMoveRule   = function(){ return _moveRule;   };
	this.getAttackRule = function(){ return _attackRule; };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
function RatoborecContainer(){
	var _moveRule = [];
	var _attackRule = [];
	var _isJump = false;
	var _figureType = chessFiguresType.RATOBOREC;

	this.name = 'Ratoborec';

	_moveRule.push(new THREE.Vector2( 8, 0));
	_moveRule.push(new THREE.Vector2(-8, 0));
	_moveRule.push(new THREE.Vector2( 0, 8));
	_moveRule.push(new THREE.Vector2( 0,-8));

	_attackRule = _moveRule.clone();

	this.getMoveRule   = function(){ return _moveRule;   };
	this.getAttackRule = function(){ return _attackRule; };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
function VsadnikContainer(){
	var _moveRule = [];
	var _attackRule = [];
	var _isJump = true;
	var _figureType = chessFiguresType.VSADNIK;

	this.name = 'Vsadnik';

	_moveRule.push(new THREE.Vector2( 1, 2));
	_moveRule.push(new THREE.Vector2( 1,-2));
	_moveRule.push(new THREE.Vector2(-1, 2));
	_moveRule.push(new THREE.Vector2(-1,-2));
	_moveRule.push(new THREE.Vector2( 2, 1));
	_moveRule.push(new THREE.Vector2( 2,-1));
	_moveRule.push(new THREE.Vector2(-2, 1));
	_moveRule.push(new THREE.Vector2(-2,-1));

	_attackRule = _moveRule.clone();

	this.getMoveRule   = function(){ return _moveRule;   };
	this.getAttackRule = function(){ return _attackRule; };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
function LuchnikContainer(){
	var _moveRule = [];
	var _attackRule = [];
	var _isJump = false;
	var _figureType = chessFiguresType.LUCHNIK;

	this.name = 'Luchnik';

	_moveRule.push(new THREE.Vector2( 8, 8));
	_moveRule.push(new THREE.Vector2(-8, 8));
	_moveRule.push(new THREE.Vector2( 8,-8));
	_moveRule.push(new THREE.Vector2(-8,-8));

	_attackRule = _moveRule.clone();

	this.getMoveRule   = function(){ return _moveRule;   };
	this.getAttackRule = function(){ return _attackRule; };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
function KnyazContainer(){
	var _moveRule = [];
	var _attackRule = [];
	var _isJump = false;
	var _figureType = chessFiguresType.KNYAZ;

	this.name = 'Knyaz';

	_moveRule.push(new RatoborecContainer().getMoveRule());
	_moveRule.push(new LuchnikContainer().getMoveRule());

	_attackRule = _moveRule.clone();

	this.getMoveRule   = function(){ return _moveRule;   };
	this.getAttackRule = function(){ return _attackRule; };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
function VolhvContainer(){
	var _moveRule = [];
	var _attackRule = [];
	var _isJump = false;
	var _figureType = chessFiguresType.VOLHV;

	this.name = 'Volhv';

	_moveRule.push(new THREE.Vector2( 0, 1));// |
	_moveRule.push(new THREE.Vector2( 1, 1));// /
	_moveRule.push(new THREE.Vector2( 1, 0));// -
	_moveRule.push(new THREE.Vector2( 1,-1));// \
	_moveRule.push(new THREE.Vector2( 0,-1));// |
	_moveRule.push(new THREE.Vector2(-1,-1));// /
	_moveRule.push(new THREE.Vector2(-1, 0));// -
	_moveRule.push(new THREE.Vector2(-1, 1));// \

	_attackRule = _moveRule.clone();

	this.getMoveRule   = function(){ return _moveRule;   };
	this.getAttackRule = function(){ return _attackRule; };
	this.isJump        = function(){ return _isJump;     };
	this.getFigureType = function(){ return _figureType; };
};
// TODO Helgi
