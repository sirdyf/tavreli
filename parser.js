var PARSER = PARSER || {revision: "v0.0.1"};

function ParserContainer() {

    this.parseString = function(str){
        var retArray_ = [];
        var arr_ = str.split(' ');
        for (var i = 0; i < arr_.length; i++) {
            var part_ = arr_[i].split('-');
            retArray_ = retArray_.concat(part_);
        };
        return retArray_.slice();
    };

    this.Init = function(){
    };
};
PARSER.main = new ParserContainer();
PARSER.main.Init();