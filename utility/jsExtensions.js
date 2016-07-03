String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

//DEBUG PURPOSES ONLY
Number.prototype.popCount = function() {
  var v = this.valueOf();
  v = v - ((v >> 1) & 0x55555555);                // put count of each 2 bits into those 2 bits
  v = (v & 0x33333333) + ((v >> 2) & 0x33333333); // put count of each 4 bits into those 4 bits
  return ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
};
