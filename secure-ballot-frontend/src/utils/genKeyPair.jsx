// utils/ellipticUtils.js
import { ec as EC } from 'elliptic';
import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';

const ec = new EC('secp256k1'); // Bitcoin curve

// Hash functions
export function H1(...args) {
  const hash = SHA256(args.join('')).toString(Hex);
  return BigInt('0x' + hash);
}


// Key generation
export function generateKeyPair() {
  const key = ec.genKeyPair();

  localStorage.setItem('privateKey', key.getPrivate('hex'));
  
  return {
    privateKey: key.getPrivate('hex'),
    publicKey: key.getPublic().encode('hex'),
  };
}