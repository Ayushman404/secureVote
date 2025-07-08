const { ec: EC } = require("elliptic");
const SHA256 = require("crypto-js/sha256");
const Hex = require("crypto-js/enc-hex");
const BN = require("bn.js");

const ec = new EC("secp256k1");
const G = ec.g;
const q = ec.curve.n;

// Hash function H1 → BN
function H1(...args) {
  const hash = SHA256(args.join("")).toString(Hex);
  return new BN(hash, 16).umod(q);
}

// Main verify function
function verifySignature(message, ring, signature) {
  const { y0, c, s } = signature;
  const n = ring.length;

  if (!Array.isArray(ring) || !Array.isArray(c) || !Array.isArray(s)) {
    throw new Error("Invalid signature format: arrays expected");
  }
  if (ring.length !== c.length || c.length !== s.length) {
    throw new Error("Signature length mismatch with ring");
  }

  // Rebuild terms: T_i = s_i * G + c_i * P_i
  const terms = ring.map((pkHex, i) => {
    const P = ec.keyFromPublic(pkHex, "hex").getPublic();
    const si = new BN(s[i]);
    const ci = new BN(c[i]);
    return G.mul(si).add(P.mul(ci)).encode("hex"); // T_i
  });

  // Rebuild challenge input: ring + y0 + message + all T_i terms
  const challengeInput = ring.join("") + y0 + message + terms.join("");

  const cTotal = H1(challengeInput);

  // Recompute sum of all provided c[i]
  const sumC = c.reduce((acc, ci) => acc.add(new BN(ci)).umod(q), new BN(0));

  const isValid = cTotal.eq(sumC);

  console.log("🔎 Recomputed cTotal:", cTotal.toString());
  console.log("🧮 Sum of all c[i]:", sumC.toString());
  console.log("✅ Signature Valid:", isValid);

  return isValid;
}

module.exports = { verifySignature };
