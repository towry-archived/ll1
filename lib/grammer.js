var fs = require('fs');

module.exports = Grammer;

function Grammer(filename) {
  this.file = filename;
  this.rules = {};
  this.symbols = [];
  this.tokens = [];
}

Grammer.prototype.setFile = function (file) {
  this.file = file;
}

Grammer.prototype.parse = function () {
  var buf, len, col, sym, c, i, index, rhs, lhs;

  buf = fs.readFileSync(this.file, {encoding:'utf8'});
  len = buf.length;
  col = 0;


  for (i = 0; i < len; i++) {
    c = buf[i];

    // skip ws
    if (c === ' ' || c === '\n') {
      if (c === '\n') col = 0;
      continue;
    }

    // skip comments
    if (c == ';' && col === 0) {
      while (buf[i] != '\n') {
        i++;
      }
      continue;
    }

    // start symbol
    if (c === '<' && col === 0) {
      col++; i++; sym = '';
      while (buf[i] !== '>') {
        sym = sym + buf[i];
        col++; i++;
      }
      col++;i++;

      if (sym && (index = [].indexOf.call(this.symbols, sym)) === -1) {
        index = (this.symbols.push(sym) - 1);
      } else if (!sym) {
        throw new Error("Grammer error!");
      }

      if (index in this.rules) {
        this.rules[index].push({lhs:index, rhs: []});
      } else {
        this.rules[index] = [];
        this.rules[index].push({lhs:index, rhs: []});
      }

      lhs = index;
    } else if (c === '<' && rhs) {
      // rhs
      if (!(lhs+1)) {
        throw new Error("Unexpected character: " + c);
      }

      sym = ''; col++; i++;
      while (buf[i] !== '>') {
        sym = sym + buf[i];
        col++; i++;
      }
      col++;i++;
      
      if (sym && (index = [].indexOf.call(this.symbols, sym)) === -1) {
        index = (this.symbols.push(sym) - 1);
      } else if (!sym) {
        throw new Error("Grammer error!");
      }

      if (!(lhs+1) in this.rules) {
        throw new Error("Grammer error!");
      }

      (this.rules[lhs][this.rules[lhs].length - 1]).rhs.push(sym);
    } else if (c === ':' && buf[i+1] === '=') {
      i+=2;
      rhs = true;
      if (!(lhs+1) || !(lhs in this.rules)) {
        throw new Error("Grammer error!");
      }
    } else {
      sym = '';
      while (buf[i] !== ' ' 
        && buf[i] !== '\n' 
        && buf[i] !== '<' 
        && buf[i] !== '\r') {
        sym = sym+buf[i];
        col++; i++;
      }

      if (sym && (index = [].indexOf.call(this.tokens, sym)) === -1) {
        index = (this.tokens.push(sym) - 1);
      } else if (!sym) {
        throw new Error("Grammer error!");
      }

      (this.rules[lhs][this.rules[lhs].length -1]).rhs.push(sym);
    }
  }
}

Grammer.prototype.isToken = function (s) {
  return s.length > 0 && s[0] == s[0].toLowerCase();
}

Grammer.prototype.first = function (s) {
  var symbols = Object.prototype.toString.call(s) === '[object Array]' ? s : this.convertToSymbols(s);
  var r = [];

  for (var i = 0; i < symbols.length; i++) {
    if ([].indexOf.call(this.tokens, symbols[i]) > -1) {
      r.push(symbols[i]);
      break;
    } else if ([].indexOf.call(this.symbols, symbols[i]) > -1) {
      var r2 = this.firstOfSymbol(symbols[i]);
      for (var j = 0; j < r2.length; j++) {
        r.push(r2[j]);
      }
    } else {
      throw new Error("Unknow symbol.");
    }
  }

  return r;
}

Grammer.prototype.firstOfSymbol = function (sym) {
  var index, rules, r = [], r2, rhs;

  index = [].indexOf.call(this.symbols, sym);
  if (! index in this.rules) {
    return [];
  } else {
    rules = this.rules[index];
  }

  for (var i = 0; i < rules.length; i++) {
    rhs = rules[i].rhs;
    if (!rhs) return r;

    r2 = this.first(rhs.join(' '));
    for (var j = 0; j < r2.length; j++) {
      r.push(r2[i]);
    }
  }

  return r;
}

Grammer.prototype.convertToSymbols = function (s) {
  if (typeof s !== 'string') {
    throw new Error("Expect string.");
  }

  var a = null, index;

  a = s.replace('<', ' ');
  a = a.replace('>', ' ');
  a = a.split(' ');

  var r = [];
  for (var i = 0; i < a.length; i++) {
    if (a[i] == ' ') {
      continue;
    }
    r.push(a[i]);
  }

  return r;
} 
