var Grammer = require('./grammer.js');

module.exports = LL1;

function LL1() {
  this.grammer = null;
  this.table = {};
}

LL1.prototype.parse = function (file) {
  if (!this.grammer) {
    this.grammer = new Grammer(file);
  } else {
    this.grammer.setFile(file);
  }

  this.grammer.parse();
}

/*
 file: './ext/grammer.txt',
 rules:
  { '1': [ [Object] ],
    '2': [ [Object] ],
    '3': [ [Object], [Object], [Object] ],
    '4': [ [Object], [Object] ],
    '5': [ [Object], [Object], [Object] ] },
 symbols:
  [ 'epsilon',
    'E',
    'T',
    'E\'',
    'F',
    'T\'' ],
 tokens:
  [ '$',
    '+',
    '-',
    '*',
    '/',
    'num',
    'id' ],
 epsilon: 0,
 eof: 0 }
 */
LL1.prototype.constructTable = function () {
  
}
