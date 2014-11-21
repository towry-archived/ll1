var ll1 = require("./init_test.js");
var util = require("util");

// regex +?, same type word, punctuation,
// http://lambda.uta.edu/cse5317/notes/node15.html
util.debug(ll1.grammer.follow('<E>'));
util.debug(ll1.grammer.follow('<E\'>'))
util.debug(ll1.grammer.follow('<T>'));
util.debug(ll1.grammer.follow('<T\'>'));
util.debug(ll1.grammer.follow('<F>'));
