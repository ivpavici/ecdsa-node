const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
(async () => {
    const PRIVATE_KEY = "5f543989958b616ff2cb1e8d92aab71547c313dca430b32c2c8c1909fbd6a493";
    let message = {
        from: "0xa40f11c177e7ed5e1ebec3aaf799cee15ca9b5a4a7498867dfe29123737624b4",
        to: "0xf3aa83f68070e4d588f8ab7d5f15caccf5514158f37759f55a4382015351127d",
        amount: 10,
    };
    console.log("Message : ", message);

    const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(message))));
    console.log("Hashed Message : ", messageHash);

    const [sig, recoveryBit]  = await secp.sign(messageHash, PRIVATE_KEY, {recovered: true});
    console.log("Signature : ", toHex(sig));
    console.log("Recovery Bit : ", recoveryBit);
})();