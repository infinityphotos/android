Setup a Solana wallet
---

## 0. Requirements

Solana Tool Suite
- https://docs.solana.com/cli/install-solana-cli-tools

## 1. Create Solana wallet

```
solana-keygen new --force --outfile wallet.json
```

## 2. Set devnet network as default

```
solana config set --url https://api.devnet.solana.com
```

## 3. Set newly created wallet as default

```
solana config set --keypair ./wallet.json
```

## 4. Airdrop some SOL into the wallet (repeat x5 = 5 SOL)

```
solana airdrop 1 INTRODUCE_HERE_YOUR_WALLET_PUBKEY --url https://api.devnet.solana.com
```
