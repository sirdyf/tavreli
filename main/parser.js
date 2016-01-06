var PARSER = PARSER || {
    revision: "v0.0.1"
};
if (typeof module === 'object') {
    module.exports = PARSER;
}
PARSER.ParserContainer = function() {

    this.parseString = function(str) {
        var retArray_ = [];
        var arr_ = str.split(' ');
        for (var i = 0; i < arr_.length; i++) {
            var part_ = arr_[i].split('-');
            if (part_.length > 2) {
                part_ = part_.slice(0, 2);
                part_[1] = "0-0";
            };
            retArray_ = retArray_.concat(part_);
        };
        return retArray_.slice();
    };
    this.getNotationFromStep = function(pos2d) {
        var symbol = String.fromCharCode(pos2d.x + 65);
        return symbol.toUpperCase() + (8 - pos2d.y);
    };
    this.Init = function() {};
};
// PARSER.main = new ParserContainer();
// PARSER.main.Init();