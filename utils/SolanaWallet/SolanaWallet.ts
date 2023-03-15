import { Connection, PublicKey, Signer } from "@solana/web3.js";
import nacl from "tweetnacl";
import { decodeUTF8 } from "tweetnacl-util";

export type KeyType = string | number[] | Array<number> | Uint8Array;

export default class SolanaPrivateKeyWallet {
  readonly name: string = "PrivateKeyWallet";

  public signer: Signer;
  get publicKey() {
    return this.signer.publicKey;
  }

  constructor(key: KeyType) {
    this.signer = {
      secretKey: new Uint8Array(Buffer.from(key)),
      publicKey: new PublicKey(key.slice(32)),
    };
  }

  public signMessage(message: any) {
    let data = message;
    if (typeof message === "string") data = decodeUTF8(message);
    return nacl.sign.detached(data, this.signer.secretKey);
  }

  public sendTransaction(
    data: any,
    connection: Connection,
    options: { [key: string]: any }
  ) {
    return connection.sendTransaction(data, [this.signer], options);
  }
}
