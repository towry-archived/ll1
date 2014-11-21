var Grammer = require('./grammer.js');

module.exports = LL1;

function LL1() {
  this.grammer = null;
}

LL1.prototype.parse = function (file) {
  if (!this.grammer) {
    this.grammer = new Grammer(file);
  } else {
    this.grammer.setFile(file);
  }

  this.grammer.parse();
}

LL1.prototype.constructTable = function () {
  console.log("Yummy!");
}
