var SAMPLES = SAMPLES || {revision: "v0.0.1"};

function SamplesContainer() {
    var s0="c1-b2 d8-c7 b1-c3 h8-h7 c3-d5 c7-h2 h1-h2 h7-h2 d5-c7 e8-f8 c7-a8 h2-h1";
    // http://www.tavreli.narod.ru/advice.html
    // А.Карпов - В.Купрейчик, Москва,1997
    var s2="c1-d2 e8-e7 d2-c3 a8-a7 g1-f3 h8-h7 b1-c3 h7-h6 e2-e3 g8-f6 c3(1)-b5 a7-b7 a1-a2 h6-h5 d1-d3 f6-d5 a2-a8 d5-c3 b2-c3 c7-c6 c3(2)-c4 c6-b5 c4-b5 f8-g7 c3(1)-g7 h5-b5 d3-b5 e7-e4 b5(6)-e5 e4-e5 d?????";
    var s2="c1-d2 e8-e7 d2-c3 a8-a7 g1-f3 h8-h7 b1-c3 h7-h6 e2-e3 g8-f6 c3(1)-b5 a7-b7 a1-a2 h6-h5 d1-d3 f6-d5 a2-a8 d5-c3 b2-c3 c7-c6 c3(2)-c4 c6-b5 c4-b5 f8-g7 c3(1)-g7 h5-b5 d3-b5 e7-e4 b5(6)-e5 e4-e5 g7-e5 b8-d7 a8(1)-c8 e8-f7 f1-c4 f7(1)-g6 c8-g8 g6-f5 b5-d6";
    // У. Андерсон - В. Жмуров, Москва, 1997 год
    var s1="h1-h2 e7-e5 e2-e3 g8-f6 d2-d4 b8-c6 g1-f3 d7-d6 f1-e2 f8-d6 h2(1)-h1 d8-d6 h2-h3 c8-e6 b1-a3 a8-a7 c2-c3 a7-a3 b2-a3 d6(1)-a3 c1-a3 d6(1)-a3 a1-b1 a3(2)-b4 g2-g3 a3(2)-c3 e1-f1 a3-a2 f1-g2 0-0 h1-e1 f8-a8 d1-d3 e5-e4 d3-b5 e4-f3 e2-f3 c3-e1 b1 e1 b4-e1 b5-b7 a2(1)-f2 g2-g1 e1(3)-d2";
    var desc = {};
    desc.step = "У. Андерсон - В. Жмуров, Москва, 1997 год";
    desc.step0 = "лучше на ратников ставить более сильные таврели";
    desc.step1 = desc.step0;
    desc.step6 = "белые и черные разыгрывают дебют, похожий на классические шахматы. Для русских шахмат такое развитие является неудачным";
    desc.step7 = desc.step6;
    // А. Потапов - О. Свирин, Москва, 1998 год
    var s3="c1-d2 f8-e7 f1-e2 c8-d7 d1-d2 d8-d7 b1-c3 b8-c6 d2-e2 g8-f6 g1-f3 d7-d4 е2-d2 0-0-0 d2(3)-e3 e7-c5 e3(1)-g5 h8-e8 e3(1)-d2 f6-e4 g5-f5 c8-b8 a1-d1 d4-c4 b2-b3 c4-a6 d2(2)-e3 e4-c3 d2-d3 c5-e3 0-0 a6-b6 d1-d3 e3-f2 g1-h1 b6(1)-f2 f3-d4 f2(1)-f1 h1-h2 b6-d4 d3-f3 d4-e5 h2(1)-h3 e5-d4 f5-f7 f1-e2 f7-h5 e2-e6 g2-g4 f2-g1 f3(1)-f7 g1(1)-f2x";
    this.getSampleString = function(){
        return s1;
    };
    this.Init = function(){
    };
    this.getDescriptionForStep = function(stepNum){
        var ret=desc["step"+stepNum];
        if (ret === undefined) return desc["step"];
        return ret;
    };
};
SAMPLES.main = new SamplesContainer();
SAMPLES.main.Init();
