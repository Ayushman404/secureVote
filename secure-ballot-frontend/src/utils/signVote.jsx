import { ec as EC } from "elliptic";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import BN from "bn.js";

const ec = new EC("secp256k1");
const G = ec.g;
const qBN = ec.curve.n;
const q = BigInt(qBN.toString(10));

// Hash function H1 → BigInt
function H1(...args) {
  const hash = SHA256(args.join("")).toString(Hex);
  return BigInt("0x" + hash);
}

// Generates secure random BigInt of 256 bits mod q
function randomBigInt() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  const hex = [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
  return BigInt("0x" + hex) % q;
}

// Main signing function
export function sign(message, ring, privateKeyHex) {
  const n = ring.length;
  const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");
  const publicKeyHex = keyPair.getPublic().encode("hex");

  if (n < 2) throw new Error("Ring must contain at least 2 members");

  const signerIndex = ring.indexOf(publicKeyHex);
  if (signerIndex === -1) throw new Error("Signer’s public key not in ring");


  //Linkability tag genration
  const linkingScalar = H1(privateKeyHex); // BigInt
  const linkingBN = new BN(linkingScalar.toString());
  const y0 = G.mul(linkingBN).encode("hex");


  const s = new Array(n);
  const c = new Array(n);
  let sum = 0n;

  // Generate fake si, ci for everyone except signer
  for (let i = 0; i < n; i++) {
    if (i === signerIndex) continue;
    const si = randomBigInt();
    const ci = randomBigInt();
    s[i] = si;
    c[i] = ci;
    sum = (sum + ci) % q;
  }

  // Generate real signer's commitment r * G
  const r = randomBigInt();
  const R = G.mul(new BN(r.toString())); // EC Point
  const T_signer = R.encode("hex");

  // Compute full challenge input including T_signer
  const challengeInput =
    ring.join("") +
    y0 +
    message +
    ring
      .map((pkHex, i) => {
        if (i === signerIndex) return T_signer;
        const pubKeyPoint = ec.keyFromPublic(pkHex, "hex").getPublic();
        const siBN = new BN(s[i].toString());
        const ciBN = new BN(c[i].toString());
        const term = G.mul(siBN).add(pubKeyPoint.mul(ciBN));
        return term.encode("hex");
      })
      .join("");

  const cTotal = H1(challengeInput) % q;
  c[signerIndex] = (cTotal - sum + q) % q;

  // Compute s[signer] = r - c[signer] * x mod q
  const x = BigInt(keyPair.getPrivate().toString(10));
  const ci = c[signerIndex];
  let si = (r - ci * x) % q;
  if (si < 0n) si += q;
  s[signerIndex] = si;

  return {
    y0,
    c: c.map((ci) => ci.toString()),
    s: s.map((si) => si.toString())
  };
}
