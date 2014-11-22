var Grammer = require('./grammer.js');
var util = require('util');

module.exports = LL1;

function LL1() {
  this.grammer = null;
  this.table = [];
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
  var m, f, rhs, rules, rule, tokens;
  tokens = this.grammer.tokens;
  rules = this.grammer.rules;
  for (var r in rules) {
    rule = rules[r];
    for (var j = 0; j < rule.length; j++) {
      for (var i = 0; i < tokens.length; i++) {
        m = tokens[i];
        f = this.grammer.first(rule[j].rhs);
        if (f.length === 0) {
          f = this.grammer.follow(this.grammer.symbols[+r]);
        }

        if ([].indexOf.call(f, m) !== -1) {
          // add this rule to table
          if (typeof this.table[+r] === 'undefined') {
            this.table[+r] = [];
          }
            
          if (typeof this.table[+r][i] !== 'undefined') {
            throw new Error("Grammer error. LL1 grammer expected.");
          }
          this.table[+r][i] = rules[r][j];
        }
      }
    }
  }

  return this.table;
}

LL1.prototype.printTable = function () {
  if (this.table.length === 0) console.log("Empty table.");
  var write = process.stdout.write;

  for (var i = 0; i < this.table.length; i++) {
    for (var j = 0; j < this.table[i].length; j++) {
      if (typeof this.table[i][j] === 'undefined') {
        write("  ");
      } else {
        write(obj2String(this.table[i][j]) + " ");
      }
    }
    write('\n');
  }
}

function obj2String(o) {
  return o['lhs'] + ' := ' + o['rhs'].join(' ');
}
