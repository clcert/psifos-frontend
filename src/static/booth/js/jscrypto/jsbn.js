// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = (canary & 0xffffff) == 0xefcafe;

// (public) Constructor
class BigInteger {
  constructor(a, b, c) {
    this.arr = [];
    if (a != null)
      if ("number" == typeof a) this.fromNumber(a, b, c);
      else if (b == null && "string" != typeof a) this.fromString(a, 256);
      else this.fromString(a, b);
  }
}

// return new, unset BigInteger
function nbi() {
  return new BigInteger(null);
}

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this.arr[i++] + w.arr[j] + c;
    c = Math.floor(v / 0x4000000);
    w.arr[j++] = v & 0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
  var xl = x & 0x7fff,
    xh = x >> 15;
  while (--n >= 0) {
    var l = this.arr[i] & 0x7fff;
    var h = this.arr[i++] >> 15;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x7fff) << 15) + w.arr[j] + (c & 0x3fffffff);
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
    w.arr[j++] = l & 0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
  var xl = x & 0x3fff,
    xh = x >> 14;
  while (--n >= 0) {
    var l = this.arr[i] & 0x3fff;
    var h = this.arr[i++] >> 14;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x3fff) << 14) + w.arr[j] + c;
    c = (l >> 28) + (m >> 14) + xh * h;
    w.arr[j++] = l & 0xfffffff;
  }
  return c;
}

  // This is tailored to VMs with 2-bit tagging. It makes sure
  // that all the computations stay within the 29 bits available.
  function am4(i, x, w, j, c, n) {
    const thisArray = this.arr;
    const wArray = w.arr;
  
    const xl = x & 0x1fff;
    const xh = x >> 13;
  
    let l, h, m;
    while (--n >= 0) {
      l = thisArray[i] & 0x1fff;
      h = thisArray[i++] >> 13;
      m = xh * l + h * xl;
      l = xl * l + ((m & 0x1fff) << 13) + wArray[j] + c;
      c = (l >> 26) + (m >> 13) + xh * h;
      wArray[j++] = l & 0x3ffffff;
    }
  
    return c;
  }
if (j_lm && navigator.appName === "Microsoft Internet Explorer") {
  BigInteger.prototype.am = am2;
  dbits = 30;
} else if (j_lm && navigator.appName !== "Netscape") {
  BigInteger.prototype.am = am1;
  dbits = 26;
} else {
  // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am4;
  dbits = 26;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = [];
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) {
  return BI_RM.charAt(n);
}
function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)];
  return c == null ? -1 : c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for (var i = this.t - 1; i >= 0; --i) r.arr[i] = this.arr[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = x < 0 ? -1 : 0;
  if (x > 0) this.arr[0] = x;
  else if (x < -1) this.arr[0] = x + this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) {
  var r = nbi();
  r.fromInt(i);
  return r;
}

function bnpChunkSize(r) {
  return Math.floor((Math.LN2 * this.DB) / Math.log(r));
}

// (protected) set from string and radix
function bnpFromString(s, b) {
  var k;
  if (b === 16) k = 4;
  else if (b === 8) k = 3;
  else if (b === 256) k = 8;
  // byte array
  else if (b === 2) k = 1;
  else if (b === 32) k = 5;
  else if (b === 4) k = 2;
  else {
    this.fromRadix(s, b);
    return;
  }
  this.t = 0;
  this.s = 0;
  var i = s.length,
    mi = false,
    sh = 0;
  while (--i >= 0) {
    var x = k === 8 ? s[i] & 0xff : intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) === "-") mi = true;
      continue;
    }
    mi = false;
    if (sh === 0) this.arr[this.t++] = x;
    else if (sh + k > this.DB) {
      this.arr[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
      this.arr[this.t++] = x >> (this.DB - sh);
    } else this.arr[this.t - 1] |= x << sh;
    sh += k;
    if (sh >= this.DB) sh -= this.DB;
  }
  if (k === 8 && (s[0] & 0x80) !== 0) {
    this.s = -1;
    if (sh > 0) this.arr[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
  }
  this.clamp();
  if (mi) BigInteger.ZERO.subTo(this, this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s & this.DM;
  while (this.t > 0 && this.arr[this.t - 1] === c) --this.t;
}

function bnEquals(a) {
  return this.compareTo(a) === 0;
}
function bnIntValue() {
  if (this.s < 0) {
    if (this.t === 1) return this.arr[0] - this.DV;
    else if (this.t === 0) return -1;
  } else if (this.t === 1) return this.arr[0];
  else if (this.t === 0) return 0;
  // assumes 16 < DB < 32
  return ((this.arr[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this.arr[0];
}

function bnpToRadix(b) {
  if (b == null) b = 10;
  if (this.signum() === 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b, cs);
  var d = nbv(a),
    y = nbi(),
    z = nbi(),
    r = "";
  this.divRemTo(d, y, z);
  while (y.signum() > 0) {
    r = (a + z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d, y, z);
  }
  return z.intValue().toString(b) + r;
}

function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

// (public) return string representation in given radix
function bnToString(b) {
  if (this.s < 0) return "-" + this.negate().toString(b);
  var k;
  if (b === 16) k = 4;
  else if (b === 8) k = 3;
  else if (b === 2) k = 1;
  else if (b === 32) k = 5;
  else if (b === 4) k = 2;
  else return this.toRadix(b);
  var km = (1 << k) - 1,
    d,
    m = false,
    r = "",
    i = this.t;
  var p = this.DB - ((i * this.DB) % k);
  if (i-- > 0) {
    if (p < this.DB && (d = this.arr[i] >> p) > 0) {
      m = true;
      r = int2char(d);
    }
    while (i >= 0) {
      if (p < k) {
        d = (this.arr[i] & ((1 << p) - 1)) << (k - p);
        d |= this.arr[--i] >> (p += this.DB - k);
      } else {
        d = (this.arr[i] >> (p -= k)) & km;
        if (p <= 0) {
          p += this.DB;
          --i;
        }
      }
      if (d > 0) m = true;
      if (m) r += int2char(d);
    }
  }
  return m ? r : "0";
}

function bnpFromRadix(s, b) {
  this.fromInt(0);
  if (b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b, cs),
    mi = false,
    j = 0,
    w = 0;
  for (var i = 0; i < s.length; ++i) {
    var x = intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) === "-" && this.signum() === 0) mi = true;
      continue;
    }
    w = b * w + x;
    if (++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w, 0);
      j = 0;
      w = 0;
    }
  }
  if (j > 0) {
    this.dMultiply(Math.pow(b, j));
    this.dAddOffset(w, 0);
  }
  if (mi) BigInteger.ZERO.subTo(this, this);
}

// (public) -this
function bnNegate() {
  var r = nbi();
  BigInteger.ZERO.subTo(this, r);
  return r;
}

// (public) |this|
function bnAbs() {
  return this.s < 0 ? this.negate() : this;
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s - a.s;
  if (r !== 0) return r;
  var i = this.t;
  r = i - a.t;
  if (r !== 0) return r;
  while (--i >= 0) if ((r = this.arr[i] - a.arr[i]) !== 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1,
    t;
  if ((t = x >>> 16) !== 0) {
    x = t;
    r += 16;
  }
  if ((t = x >> 8) !== 0) {
    x = t;
    r += 8;
  }
  if ((t = x >> 4) !== 0) {
    x = t;
    r += 4;
  }
  if ((t = x >> 2) !== 0) {
    x = t;
    r += 2;
  }
  if ((t = x >> 1) !== 0) {
    x = t;
    r += 1;
  }
  return r;
}

function bnMultiply(a) {
  var r = nbi();
  this.multiplyTo(a, r);
  return r;
}

function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) return the number of bits in "this"
function bnBitLength() {
  if (this.t <= 0) return 0;
  return (
    this.DB * (this.t - 1) + nbits(this.arr[this.t - 1] ^ (this.s & this.DM))
  );
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n, r) {
  var i;
  for (i = this.t - 1; i >= 0; --i) r.arr[i + n] = this.arr[i];
  for (i = n - 1; i >= 0; --i) r.arr[i] = 0;
  r.t = this.t + n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n, r) {
  for (var i = n; i < this.t; ++i) r.arr[i - n] = this.arr[i];
  r.t = Math.max(this.t - n, 0);
  r.s = this.s;
}

function bnpDMultiply(n) {
  this.arr[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
  ++this.t;
  this.clamp();
}

// (protected) r = this << n
function bnpLShiftTo(n, r) {
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << cbs) - 1;
  var ds = Math.floor(n / this.DB),
    c = (this.s << bs) & this.DM,
    i;
  for (i = this.t - 1; i >= 0; --i) {
    r.arr[i + ds + 1] = (this.arr[i] >> cbs) | c;
    c = (this.arr[i] & bm) << bs;
  }
  for (i = ds - 1; i >= 0; --i) r.arr[i] = 0;
  r.arr[ds] = c;
  r.t = this.t + ds + 1;
  r.s = this.s;
  r.clamp();
}

function bnpDAddOffset(n, w) {
  if (n === 0) return;
  while (this.t <= w) this.arr[this.t++] = 0;
  this.arr[w] += n;
  while (this.arr[w] >= this.DV) {
    this.arr[w] -= this.DV;
    if (++w >= this.t) this.arr[this.t++] = 0;
    ++this.arr[w];
  }
}

// (protected) r = this >> n
function bnpRShiftTo(n, r) {
  r.s = this.s;
  var ds = Math.floor(n / this.DB);
  if (ds >= this.t) {
    r.t = 0;
    return;
  }
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << bs) - 1;
  r.arr[0] = this.arr[ds] >> bs;
  for (var i = ds + 1; i < this.t; ++i) {
    r.arr[i - ds - 1] |= (this.arr[i] & bm) << cbs;
    r.arr[i - ds] = this.arr[i] >> bs;
  }
  if (bs > 0) r.arr[this.t - ds - 1] |= (this.s & bm) << cbs;
  r.t = this.t - ds;
  r.clamp();
}

function bnSigNum() {
  if (this.s < 0) return -1;
  else if (this.t <= 0 || (this.t === 1 && this.arr[0] <= 0)) return 0;
  else return 1;
}

function bnClone() {
  var r = nbi();
  this.copyTo(r);
  return r;
}
// (protected) r = this - a
function bnpSubTo(a, r) {
  var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
  while (i < m) {
    c += this.arr[i] - a.arr[i];
    r.arr[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c -= a.s;
    while (i < this.t) {
      c += this.arr[i];
      r.arr[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while (i < a.t) {
      c -= a.arr[i];
      r.arr[i++] = c & this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = c < 0 ? -1 : 0;
  if (c < -1) r.arr[i++] = this.DV + c;
  else if (c > 0) r.arr[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a, r) {
  var x = this.abs(),
    y = a.abs();
  var i = x.t;
  r.t = i + y.t;
  while (--i >= 0) r.arr[i] = 0;
  for (i = 0; i < y.t; ++i) r.arr[i + x.t] = x.am(0, y.arr[i], r, i, 0, x.t);
  r.s = 0;
  r.clamp();
  if (this.s !== a.s) BigInteger.ZERO.subTo(r, r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = (r.t = 2 * x.t);
  while (--i >= 0) r.arr[i] = 0;
  for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x.arr[i], r, 2 * i, 0, 1);
    if (
      (r.arr[i + x.t] += x.am(
        i + 1,
        2 * x.arr[i],
        r,
        2 * i + 1,
        c,
        x.t - i - 1
      )) >= x.DV
    ) {
      r.arr[i + x.t] -= x.DV;
      r.arr[i + x.t + 1] = 1;
    }
  }
  if (r.t > 0) r.arr[r.t - 1] += x.am(i, x.arr[i], r, 2 * i, 0, 1);
  r.s = 0;
  r.clamp();
}

function bnModInverse(m) {
  var ac = m.isEven();
  if ((this.isEven() && ac) || m.signum() === 0) return BigInteger.ZERO;
  var u = m.clone(),
    v = this.clone();
  var a = nbv(1),
    b = nbv(0),
    c = nbv(0),
    d = nbv(1);
  while (u.signum() !== 0) {
    while (u.isEven()) {
      u.rShiftTo(1, u);
      if (ac) {
        if (!a.isEven() || !b.isEven()) {
          a.addTo(this, a);
          b.subTo(m, b);
        }
        a.rShiftTo(1, a);
      } else if (!b.isEven()) b.subTo(m, b);
      b.rShiftTo(1, b);
    }
    while (v.isEven()) {
      v.rShiftTo(1, v);
      if (ac) {
        if (!c.isEven() || !d.isEven()) {
          c.addTo(this, c);
          d.subTo(m, d);
        }
        c.rShiftTo(1, c);
      } else if (!d.isEven()) d.subTo(m, d);
      d.rShiftTo(1, d);
    }
    if (u.compareTo(v) >= 0) {
      u.subTo(v, u);
      if (ac) a.subTo(c, a);
      b.subTo(d, b);
    } else {
      v.subTo(u, v);
      if (ac) c.subTo(a, c);
      d.subTo(b, d);
    }
  }
  if (v.compareTo(BigInteger.ONE) !== 0) return BigInteger.ZERO;
  if (d.compareTo(m) >= 0) return d.subtract(m);
  if (d.signum() < 0) d.addTo(m, d);
  else return d;
  if (d.signum() < 0) return d.add(m);
  else return d;
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m, q, r) {
  var pm = m.abs();
  if (pm.t <= 0) return;
  var pt = this.abs();
  if (pt.t < pm.t) {
    if (q != null) q.fromInt(0);
    if (r != null) this.copyTo(r);
    return;
  }
  if (r == null) r = nbi();
  var y = nbi(),
    ts = this.s,
    ms = m.s;
  var nsh = this.DB - nbits(pm.arr[pm.t - 1]); // normalize modulus
  if (nsh > 0) {
    pm.lShiftTo(nsh, y);
    pt.lShiftTo(nsh, r);
  } else {
    pm.copyTo(y);
    pt.copyTo(r);
  }
  var ys = y.t;
  var y0 = y.arr[ys - 1];
  if (y0 === 0) return;
  var yt = y0 * (1 << this.F1) + (ys > 1 ? y.arr[ys - 2] >> this.F2 : 0);
  var d1 = this.FV / yt,
    d2 = (1 << this.F1) / yt,
    e = 1 << this.F2;
  var i = r.t,
    j = i - ys,
    t = q == null ? nbi() : q;
  y.dlShiftTo(j, t);
  if (r.compareTo(t) >= 0) {
    r.arr[r.t++] = 1;
    r.subTo(t, r);
  }
  BigInteger.ONE.dlShiftTo(ys, t);
  t.subTo(y, y); // "negative" y so we can replace sub with am later
  while (y.t < ys) y.arr[y.t++] = 0;
  while (--j >= 0) {
    // Estimate quotient digit
    var qd =
      r.arr[--i] === y0
        ? this.DM
        : Math.floor(r.arr[i] * d1 + (r.arr[i - 1] + e) * d2);
    if ((r.arr[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
      // Try it out
      y.dlShiftTo(j, t);
      r.subTo(t, r);
      while (r.arr[i] < --qd) r.subTo(t, r);
    }
  }
  if (q != null) {
    r.drShiftTo(ys, q);
    if (ts !== ms) BigInteger.ZERO.subTo(q, q);
  }
  r.t = ys;
  r.clamp();
  if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
  if (ts < 0) BigInteger.ZERO.subTo(r, r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a, null, r);
  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
  return r;
}

function bnpAddTo(a, r) {
  var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
  while (i < m) {
    c += this.arr[i] + a.arr[i];
    r.arr[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c += a.s;
    while (i < this.t) {
      c += this.arr[i];
      r.arr[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while (i < a.t) {
      c += a.arr[i];
      r.arr[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = c < 0 ? -1 : 0;
  if (c > 0) r.arr[i++] = c;
  else if (c < -1) r.arr[i++] = this.DV + c;
  r.t = i;
  r.clamp();
}

function bnModPow(e, m) {
  var i = e.bitLength(),
    k,
    r = nbv(1),
    z;
  if (i <= 0) return r;
  else if (i < 18) k = 1;
  else if (i < 48) k = 3;
  else if (i < 144) k = 4;
  else if (i < 768) k = 5;
  else k = 6;
  if (i < 8) z = new Classic(m);
  else if (m.isEven()) z = new Barrett(m);
  else z = new Montgomery(m);

  // precomputation
  var g = [],
    n = 3,
    k1 = k - 1,
    km = (1 << k) - 1;
  g[1] = z.convert(this);
  if (k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1], g2);
    while (n <= km) {
      g[n] = nbi();
      z.mulTo(g2, g[n - 2], g[n]);
      n += 2;
    }
  }

  var j = e.t - 1,
    w,
    is1 = true,
    r2 = nbi(),
    t;
  i = nbits(e.arr[j]) - 1;
  while (j >= 0) {
    if (i >= k1) w = (e.arr[j] >> (i - k1)) & km;
    else {
      w = (e.arr[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
      if (j > 0) w |= e.arr[j - 1] >> (this.DB + i - k1);
    }

    n = k;
    while ((w & 1) === 0) {
      w >>= 1;
      --n;
    }
    if ((i -= n) < 0) {
      i += this.DB;
      --j;
    }
    if (is1) {
      // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    } else {
      while (n > 1) {
        z.sqrTo(r, r2);
        z.sqrTo(r2, r);
        n -= 2;
      }
      if (n > 0) z.sqrTo(r, r2);
      else {
        t = r;
        r = r2;
        r2 = t;
      }
      z.mulTo(r2, g[w], r);
    }

    while (j >= 0 && (e.arr[j] & (1 << i)) === 0) {
      z.sqrTo(r, r2);
      t = r;
      r = r2;
      r2 = t;
      if (--i < 0) {
        i = this.DB - 1;
        --j;
      }
    }
  }
  return z.revert(r);
}

// Modular reduction using "classic" algorithm
function Classic(m) {
  this.m = m;
}
function cConvert(x) {
  if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) {
  return x;
}
function cReduce(x) {
  x.divRemTo(this.m, null, x);
}
function cMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}
function cSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x.arr[y(2-xy)] = 1-k^2m^2
// x.arr[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if (this.t < 1) return 0;
  var x = this.arr[0];
  if ((x & 1) === 0) return 0;
  var y = x & 3; // y == 1/x mod 2^2
  y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
  y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
  y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y * (2 - ((x * y) % this.DV))) % this.DV; // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return y > 0 ? this.DV - y : -y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp & 0x7fff;
  this.mph = this.mp >> 15;
  this.um = (1 << (m.DB - 15)) - 1;
  this.mt2 = 2 * m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t, r);
  r.divRemTo(this.m, null, r);
  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while (x.t <= this.mt2)
    // pad x so am has enough room later
    x.arr[x.t++] = 0;
  for (var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x.arr[i]*mp mod DV
    var j = x.arr[i] & 0x7fff;
    var u0 =
      (j * this.mpl +
        (((j * this.mph + (x.arr[i] >> 15) * this.mpl) & this.um) << 15)) &
      x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i + this.m.t;
    x.arr[j] += this.m.am(0, u0, x, i, 0, this.m.t);
    // propagate carry
    while (x.arr[j] >= x.DV) {
      x.arr[j] -= x.DV;
      x.arr[++j]++;
    }
  }
  x.clamp();
  x.drShiftTo(this.m.t, x);
  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() {
  return (this.t > 0 ? this.arr[0] & 1 : this.s) === 0;
}

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e, z) {
  if (e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(),
    r2 = nbi(),
    g = z.convert(this),
    i = nbits(e) - 1;
  g.copyTo(r);
  while (--i >= 0) {
    z.sqrTo(r, r2);
    if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
    else {
      var t = r;
      r = r2;
      r2 = t;
    }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e, m) {
  var z;
  if (e < 256 || m.isEven()) z = new Classic(m);
  else z = new Montgomery(m);
  return this.exp(e, z);
}

// protected

BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.toRadix = bnpToRadix;


BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.addTo = bnpAddTo;

BigInteger.prototype.signum = bnSigNum;
// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.add = bnAdd;


BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.modInverse = bnModInverse;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

export { BigInteger };
