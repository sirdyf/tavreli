var SAMPLES = SAMPLES || {revision: "v0.0.1"};

function SamplesContainer() {
    var s1="c1-b2 d8-c7 b1-c3 h8-h7 c3-d5 c7-h2 h1-h2 h7-h2 d5-c7 e8-f8 c7-a8 h2-h1";

    this.getSampleString = function(){
        return s1;
    };
    this.Init = function(){
    };
};
SAMPLES.main = new SamplesContainer();
SAMPLES.main.Init();
