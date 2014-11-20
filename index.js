var LL1 = require("./lib");
var util = require('util');

ll1 = new LL1();

ll1.parseGrammer("./ext/grammer.txt");

console.log(ll1.first('<E>'));
