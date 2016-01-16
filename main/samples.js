var SAMPLES = SAMPLES || {
    revision: "v0.0.1"
};

if (typeof module === 'object') {
    module.exports = SAMPLES;
}

SAMPLES.SamplesContainer = function() {
    var _sample = {};

    this.getSampleString = function() {
        return _sample.steps;
    };
    this.Init = function() {
        num = window.GameDemoNum;
        if (num == 1) {
            sample1();
        } else if (num == 2) {
            sample2();
        } else if (num == 3) {
            sample3();
        } else {
            sample4();
        };
    };
    this.InitWithSample = function(sampleNum) {
        if (sampleNum == 1) {
            sample1();
        } else if (sampleNum == 2) {
            sample2();
        } else if (sampleNum == 3) {
            sample3();
        } else {
            sample4();
        };
    };
    this.getDescriptionForStep = function(stepNum) {

        var ret = _sample.descriptions["step" + stepNum];
        if (ret === undefined) return _sample.descriptions["default"];
        return ret;
    };
    // http://www.tavreli.narod.ru/advice.html
    function sample1() {
        _sample.steps = "h1-h2 e7-e5 e2-e3 g8-f6 d2-d4? b8-c6 g1-f3 d7-d6 f1-e2 f8-d6 h2(1)-h1 d8-d6 h2-h3 c8-e6 b1-a3? a8-a7 c2-c3 a7-a3 b2-a3 d6(1)-a3 c1-a3 d6(1)-a3 a1-b1 a3(2)-b4 g2-g3 a3(2)-c3 e1-f1 a3-a2 f1-g2 0-0 h1-e1 f8-a8 d1-d3 e5-e4 d3-b5 e4-f3 e2-f3 c3-e1 b1 e1 b4-e1 b5-b7 a2(1)-f2 g2-g1 e1(3)-d2x";
        var desc = {};
        desc['default'] = "У.Андерсон - В.Жмуров, Москва, 1997 год";
        desc.step1 = "лучше на ратников ставить более сильные таврели";
        desc.step6 = "белые и черные разыгрывают дебют, похожий на классические шахматы. Для русских шахмат такое развитие является неудачным";
        desc.step7 = desc.step6;
        desc.step11 = "черные создали сильную башню на поле d6, у них позиционное преимущество";
        desc.step16 = "c2-c3? допуская пленение всадника, лучше было a3-b5";
        desc.step20 = "c1-a3?? князь был защищен, поэтому в плен попадает лучник белых";
        desc.step24 = "g2-g3 белые в очередной раз делают пустой ход, хотя их позиция и так тяжелая";
        desc.step25 = "a3(2)-c3+ лучше было пойти на с3 всей башней";
        desc.step29 = "0-0 рокировка черных"
        desc.step34 = "d3-b5? лучше было 18. d3-e2";
        desc.step41 = "a2(1)-f2+";
        desc.step42 = "22)g2-g1   e1(3)-d2x";
        desc.step43 = desc.step42;
        _sample.descriptions = desc;
    };

    function sample2() {
        _sample.steps = "c1-d2 d8-e7 d2-c3 a8-a7 g1-f3 h8-h7 b1-c3 h7-h6 e2-e3 g8-f6 c3(1)-b5 a7-b7 a1-a2 h6-h5 d1-d3 f6-d5 a2-a8 d5-c3 b2-c3 c7-c6 c3(2)-c4 c6-b5 c4-b5 f8-g7 c3(1)-g7 h5-b5 d3-b5 e7-e4 b5(6)-e5+ e4-e5 g7-e5 b8-d7 a8(1)-c8 e8-f7 f1-c4+ f7(1)-g6 c8-g8+ g6-f5 b5-d6x";
        var desc = {};
        desc['default'] = "А.Карпов - В.Купрейчик, Москва, 1997 год";
        _sample.descriptions = desc;
    };

    function sample3() {
        _sample.steps = "c1-d2 f8-e7 f1-e2 c8-d7 d1-d2 d8-d7 b1-c3 b8-c6 d2-e2 g8-f6 g1-f3 d7-d4 e2-d2 0-0-0 d2(3)-e3 e7-c5 e3(1)-g5 h8-e8 e3(1)-d2 f6-e4 g5-f5 c8-b8 a1-d1 d4-c4 b2-b3 c4-a6 d2(2)-e3 e4-c3 d2-d3 c5-e3 0-0 a6-b6 d1-d3 e3-f2 g1-h1 b6(1)-f2 f3-d4 f2(1)-f1 h1-h2 b6-d4 d3-f3 d4-e5 h2(1)-h3 e5-d4 f5-f7 f1-e2 f7-h5 e2-e6 g2-g4 f2-g1 f3(1)-f7 g1(1)-f2x";
        var desc = {};
        desc['default'] = "А.Потапов - О.Свирин, Москва, 1998 год";
        desc.step6 = "оба соперника развивают фигуры, стремясь построить башни с включением князя и лучников";
        desc.step7 = desc.step6;
        desc.step10 = "черные первыми проявляют активность, нападая на поле с3";
        desc.step11 = desc.step10;
        desc.step14 = "d2(3)-e3 белые, защищаясь, нападают на башню d4. Однако надежнее было сыграть 0-0-0";
        desc.step15 = "e7-c5 теперь башня защищена, но под угрозой е3";
        desc.step16 = "e3(1)-g5 позиция белых тяжелая, все их силы разобщены";
        desc.step17 = "h8-e8 черные усиливают давление на е3";
        desc.step18 = "e3(1)-d2 проигрывало 10. g5-c5 d4(1)-c5";
        desc.step19 = "f6-e4 к атаке подключается всадник и нападает на d2";
        desc.step22 = "a1-d1 проигрывало 12. 0-0-0 из-за d4-d3 13. c2-d3 d8-d3 с сильной угрозой d3(2)-c3+";
        desc.step23 = "d4-c4! сильный ход, подчеркивающий слабость диагонали a6-f1, грозит 13. ... e4-c3 и 14. ... c4(1)-e2x";
        desc.step26 = "d2(2)-e3? надо было играть 14. d2(2)-c1, спасая от плена лучников";
        desc.step28 = "d2-d3 защищаясь от мата, белые допускают пленение лучников";
        desc.step29 = "c5-e3 позиция белых проиграна, но они по инерции продолжают сопротивляться в расчете на зевок противника или падение флажка";
        desc.step30 = "0-0 слишком дорогой ценой ушел волхв из опасной зоны, но...";
        desc.step31 = "a6-b6! покоя нет и здесь. Башня хорошо использовала свои возможности на диагонали a6-f1, теперь возникает угроза на другой диагонали";
        desc.step32 = "d1-d3 пункт f2 все равно не защитим";
        desc.step37 = "f2(1)-f1+ проще выиграть f2(6)-f1+, дальнейшая борьба проходила в обоюдном цейтноте";
        desc.step51 = "g1(1)-f2x хелги g1 объявила мат белому волхву";
        _sample.descriptions = desc;
    };

    function sample4() {
        _sample.steps = "d1-c1 d8-e7 c1-c2 g8-f6 c2-c7 b8-c6 c7(2)-b8? c6-b8x";
        var desc = {};
        desc['default'] = "А.Леонтьев - М.Улыбин, Смоленск, 1999 год";
        desc.step0 = "Вероятность ошибки в русских шахматах более высока, чем в классических. Это подтверждает самая короткая результативная партия третьего Чемпионата России среди мужчин.";
        desc.step2 = "с1-с2 создавая две угрозы: с2(1)-h7, c2-c7";
        desc.step6 = "после 4. c7(1)-b8 e7-b4 5. b8-a8 b4-b2 или 5. b2-b3 b4-b7 преимущество у черных, а после 4. b1-c3 вся борьба впереди";
        desc.step7 = "Теперь же черные берут в плен князя и лучника c6-b8 и белые сдались";
        _sample.descriptions = desc;
    };
};
SAMPLES.main = new SAMPLES.SamplesContainer();
// SAMPLES.main.Init();