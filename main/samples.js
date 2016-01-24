var SAMPLES = SAMPLES || {
    revision: "v0.1.1"
};

if (typeof module === 'object') {
    module.exports = SAMPLES;
}

SAMPLES.SamplesContainer = function() {
    var _sample = {};
    var that = this;

    this.getSampleString = function() {
        return _sample.steps;
    };
    this.Init = function() {
        num = window.GameDemoNum;
        that.InitWithSample(num);
    };
    this.InitWithSample = function(sampleNum) {
        var sampleArray = [sample1, sample2, sample3, sample4, sample5, sample6, sample7, sample8, sample9, sample10, sample11, sample12, sample13,
        sample14, sample15, sample16, sample17, sample18, sample19, sample20];
        if ((sampleNum > 0) && (sampleNum < 21)) {
            // logger.debug('InitWithSample:', sampleNum);
            var curSample = sampleArray[sampleNum - 1];
            curSample();
        } else {
            sample1();
        };
        // logger.debug('SAMPLES num=%d', sampleNum);
    };
    this.getDescriptionForStep = function(stepNum) {

        var ret = _sample.descriptions["step" + stepNum];
        if (ret === undefined) return _sample.descriptions["default"];
        return ret;
    };

    function sample0() {
        _sample.steps = "c1-d2 ... b5-d6x";
        var desc = {};
        desc['default'] = "А.Карпов - В.Купрейчик, Москва, 1997 год";
        desc.step1 = "";
        _sample.descriptions = desc;
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
    // http://rus-chess.ru/partii
    function sample5() {
        _sample.steps = "d1-c1 b8-c6 f1-e2 d8-e7 c1-d2 e7-e6 g1-e2 f8-d6 d2-e2 g8-e7 b1-c3 c8-d7 e2(5)-d3 h7-h6 a1-d1 e6-d7 d3-d5 0-0-0 d5-d3 d7-c6 d3-h3+ c8-b8 h3-f3 c6(4)-d6 g2-g3 d6-h6x";
        var desc = {};
        desc['default'] = "Ларцева С. – Овчинникова Ю., Рязань 2002г.";
        desc.step15 = "Лучше 0-0-0";
        desc.step17 = "Нападая на f7";
        desc.step25 = "От многочисленных угроз: h6-h2, h6(4)-c1 и h6(4)-d2+ защиты нет, поэтому белые сдались.";
        desc.step26 = desc.step25;
        _sample.descriptions = desc;
    };

    function sample6() {
        _sample.steps = "g1-f3 f8-e7 f1-e2 d8-e7 b1-c3 c8-d7 c1-d2 b8-c6 d1-d2 d7(1)-e6 d2-e2 e7-e6 0-0 g8-e7 e2-e4 h7-h6 e4-f4 e7-d5 f4-g3 0-0 a1-e1 a8-e8 e1-e5? d5-c3! f1-e1 e6-d6! g3-f4 c3-e2! e1-e2 d6-d1+ e2-e1 d1(2)-f3 e1(2)-d1 f3-d1 f4(3)-d2? d1(5)-d2x";
        var desc = {};
        desc['default'] = "Безгодова С. – Ершова С., Рязань 2002г.";
        _sample.descriptions = desc;
    };

    function sample7() {
        _sample.steps = "d1-e2 f8-e7 b1-c3 d8-e7 e2-e3 c8-d7 f1-d3 b8-c6 g1-e2 d7(1)-e6 c1-d2 e7-e6 e3-d2 g8-e7 d2-d3 e6-h6 a1-d1 d7-d6 c3-b5 h6-h4 b5-c7+ e8-f8 0-0 h4-f6 d3-d6 f8-g7 d6-g3 e7-g6 d1-d7 h8-e8 g3(4)-c7 f6-f5 c7-b7 f5-e4 d7-f7+ g7(1)-h6? f2-f3? e4-e2 g3-f4+ g6-f4 b7-c6+ f4-g6x";
        var desc = {};
        desc['default'] = "Овчинникова Ю. – Ершова С., Рязань 2002г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample8() {
        _sample.steps = "d1-e2 c8-d7 e2-f1 b8-c6 c1-d2 g8-f6 g1-e2 d8-d7 b1-c3 f8-e7 f1-e2 d7-e7 e2-e3 h8-h7 e3(3)-d2 e7(4)-d6 h2-h3 d6-c6 0-0-0 c6(4)-d6 d2-d5 f6-d5 c3-d5 0-0-0 d5(2)-c3 d6-g6 d5(2)-c6! g6(1)-c2+ e3-c2 g6(2)-c2 d5(1)-e6x";
        var desc = {};
        desc['default'] = "Овчинникова Ю. – Донец В., Рязань 2002г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample9() {
        _sample.steps = "f1-e2 c8-d7 d1-e2 f8-e7 b1-c3 b8-d7 c1-d2 d8-d7 d2(1)-e3 g8-f6 e2-e3 d7-e7 g1-e2 e7(5)-b4 a1-a2 b4-c4 a2-a7 a8-d8 a7-a5 c4-b4 a5-e5 b4(4)-b2 0-0 b2-b4 c3-e4 b4(5)-b7 e3-b3 0-0 b3-f3 b7-c7 e5(2)-h5 c7-c2 f3-f5 d8-d2? e4-f6x";
        var desc = {};
        desc['default'] = "Ершова С. – Соколова О., Рязань 2002г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample10() {
        //                                                                                                                                                                                                                                                  d5(2)-b5
        _sample.steps = "g1-f3 f8-e7 f1-e2 c8-d7 b1-c3 g8-f6 c1-d2 d8-e7 d1-d2 e7-d7 d2-e2+ d7(4)-e6 e2-e5 b8-d7 e5(3)-d6 c7-d6 e5(1)-d6 e6(1)-d6 e5-d6 a7-a6 0-0-0 e6(1)-d5 f3-d4 e8-d7 d4-b5 f6-e8 h1-d1 e8-d6 d1(1)-d5 e6(1)-d5 d1-d5 e6-d5 c3-d5 d6-f7 d5(2)-b6+ d7-e7 d5-d7+ e7(2)-f6 d7(2)-e7 f7(2)-h6 b5-d6 f7(6)-a2 b6-d5+ f6(1)-g6 d5-f4+ g6-g7 c1-d2 a2(2)-a5 c2-c3 a2-a1 e7-f7x";
        var desc = {};
        desc['default'] = "Безгодова С. – Донец В., Рязань 2002г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample11() {
        _sample.steps = "d1-c1 f8-e7 f1-e2 d8-e7 c1-d2 c8-d7 d2-e2 b8-c6 b1-c3 e7-e6 e2-e3 g8-e7 g1-e2 e7-c6 e3(4)-g3 0-0 g3-c7 a8-e8 c3-d1? e6-c4 d1-c3 d7-g4 c7-d6? c4(1)-e2+ c3-e2 c4-e2 e1-f2 e2(3)-f1+ f2-g3 e2-g2+ g3-F4 f1(1)-e2+ F4-g5 f1-f3x";
        var desc = {};
        desc['default'] = "Соколова Н. – Ларцева С., Рязань 2002г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample12() {
        _sample.steps = "f1-e2 f8-e7 c1-d2 c8-d7 b1-c3 d8-d7 d1-e2 d7-e7 d2(1)-e3 b8-c6 e2-e3 g8-f6 g1-e2 a8-d8 a1-d1 e7(4)-d6 e1-d1 c6-b4 e3-g5 h8-g8 h1-e1 a7-a6 g5(3)-f5 h7-h6 g2-g3? h6-g5 c3-e4? f6-e4 d1(1)-e1 d6-d2+ d1-d2 d8-d2 e1(1)-f1 d2(2)-d8x";
        var desc = {};
        desc['default'] = "Рогова. Т – Ларцева С., Рязань 2002г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample13() {
        _sample.steps = "c1-d2 f8-e7 f1-e2 c8-d7 d1-d2 d8-e7 d2-e2 b8-c6 b1-c3 e7(2)-d7 a1-d1 g8-f6 e2(4)-c4 0-0-0 g1-f3 h8-d8 c3-d5 c8-b8 d1-d3 d7-c6 c4(1)-с6? b7-с6 d3-b3+ b8-a7? d5-e7 d8-d6 e7-c8+ a7-a8 c8-d6 c7-d6 c4-a6 c6(2)-c5 a6(2)-c8 a8-a7 c8(1)-f5*";// c6(4)-a6! c8-c7+ a7-a8 f5-d3? a6-a5+ c7-a5 c6-a5 0-0 a5(2)-b7 d3-e2 d6(3)-d5 f3-e5 a5-c5";
        var desc = {};
        desc['default'] = "Долженков Ю. – Корнилович Д., Смоленск 2002г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample14() {
        _sample.steps = "c1-d2 d8-e7 f1-e2 e7-f8 b1-c3 c8-d7 d2(1)-e3 f8-d6 g1-f3 b8-c6 d1-e2 g8-e7 e2-d3 d6-d7 d3-c3 0-0-0 c3-c5! e7-c6 a1-a2! a7-a6 c5-b6! c8-d8 b6-b7 d8(1)-e8 a2-a6 c6(1)-e5 a6-a7? d7(4)-d3! e1-f2 d3(2)-f1+ h1-f1 d3(1)-f1 b7-c7*";//" f1(2)-g2+";
        var desc = {};
        desc['default'] = "Рогова Т. – Овчинникова Ю., Рязань 2003г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample15() {
        _sample.steps = "b1-d2 f8-e7 c1-d2 d8-e7 f1-e2 c8-d7 d1-d2 b8-c6 g1-f3 d7(1)-e6 d2-e2 e7-e6 e2(5)-b5 g8-e7 b5(4)-B7 0-0 b7-b5 e6-e4 b5-b3 c6-d4 b3(1)-c4 e7-c6 h1-g1 d4-c2+ e1-f1 e4-e3! f1-g2 e3(3)-f2+ g2(1)-h3 f2(2)-g1 b3-c2 f2-f1 c2(4)-h7+ g8-h8 a1-f1 g1-f1 h7-f5 f1(4)-g2+ h3-h4 f1-f2 h4-h5 g2-f3";
        var desc = {};
        desc['default'] = "Донец В. – Ершова С., Рязань 2003г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample16() {
        _sample.steps = "f1-e2 c8-d7 d1-e2 f8-e7 c1-d2 d8-d7 b1-c3 b8-c6 d2(1)-e3 g8-e7 e2-e3 e7(2)-c6 g1-e2 d7-c6 0-0-0 c6(5)-g6 d2-d3 0-0 e2-f4 g6(4)-f6 f4-d5 f6(1)-e5 h1-e1 a8-d8 d1-d3 d8-d6 e1-d1 f8-d8 c1-b1 a7-a5 a2-a3 b7-b5 e3-h3 b5-b4? h3(3)-c8";
        var desc = {};
        desc['default'] = "Ершова С. – Ларцева С., Рязань 2003г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample17() {
        _sample.steps = "d1-c1 f8-e7 b1-c3 c8-d7 c1-d2 g8-f6 f1-e2 b8-d7 g1-e2 d8-d7 0-0-0 d7(3)-e7 e2-c3 e7(4)-E6 c1-b1 a8-a7 a2-a3 e6-f5 d1-c1 f5-c5 b1-c1 c5-a3 b2-a3 a7-a3 c1-d1 a3(3)-a1*";// c3-d2 a3-b2 d1-e2 a1(1)-c1";
        var desc = {};
        desc['default'] = "Соколова О. – Сухарева Е., Рязань 2003г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample18() {
        _sample.steps = "d1-c1 f8-e7 b1-c3 d8-e7 c1-d2 c8-d7 f1-e2 d7(1)-e6 g1-e2 e7-e6 d2(2)-e2 b8-c6 e2-e3 g8-e7 c3-e2 e6-e5 e3-d3? e5(3)-b2 a1-d1 b2-a1 d3-c2 a1(2)-e5 c2-c4 0-0-0 c4(3)-a6 a1-c2+ e1-f1 c2-d1+ f1-g2 e5-e4+ g2(1)-h2 e4(1)-g2x";
        var desc = {};
        desc['default'] = "Соколова О. – Ершова С., Рязань 2003г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample19() {
        _sample.steps = "c1-d2 d8-c8 d1-d2 c8-b7 b1-c3 b7(1)-g2 0-0-0 g8-f6 f1-e2 g2-b7 e2-c4 a8-b8 c4-b3 e7-e6 h1-g1 h8-h7 d2-g5 b7-f3 g5-g3 f3-c6 g3-g6! h7-h2 g6-g7";
        var desc = {};
        desc['default'] = "Грищенко С. – Аракелов И., Смоленск 2003г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample20() {
        _sample.steps = "f1-e2 f8-e7 c1-d2 c8-d7 d1-e2 d8-e7 b1-c3 b8-c6 0-0-0 d7(1)-e6 e2-d2 e7-e6 g1-f3 a8-a7 h1-e1 e6(3)-e7 d2-d4 c6-d4 f3-d4 e7-a3 d4(2)-b5 a3(2)-b2+ c1-d2 a7-a3 b5-c7+ e8-d8 c7-e6+ f7-e6 d4(3)-b6+ b2(1)-b6 d4-b6+ d8-e8 b6(3)-d8 b2-c3 d2-c1";
        var desc = {};
        desc['default'] = "Корнилович Д. – Жмуров В., Смоленск 2003г.";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

    function sample99() {
        _sample.steps = "";
        var desc = {};
        desc['default'] = "";
        desc.step1 = "";
        _sample.descriptions = desc;
    };

};
SAMPLES.main = new SAMPLES.SamplesContainer();
// SAMPLES.main.Init();