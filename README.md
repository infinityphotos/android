📸 Infinity Photos - Decentralized Photo Management Backup App
---

Introducing Infinity Photos: the decentralized photo manager that stores your precious memories safely on Bundlr Network and Arweave. 

The best part? You pay just once for life per megabyte uploaded, freeing you from monthly subscription programs and centralized parties. Take control of your past and future with Infinity Photos.

[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/bukotsunikki.svg?style=social&label=Follow%20%40InfinityPhotos)](https://twitter.com/InfinityPhotos_)

# Requirements

- Expo CLI
    - https://docs.expo.dev/get-started/installation/#requirements
- Android SDK

# Development

🚧 This is still a work in progress, there are few parts of the system at the minute that require some extra work 🚧

- ❗ Use the integrated `Mobile Wallet Adapter` to confirm signing transactions from the user interface
- 🛎️ Move from `Expo DocumentPicker` to `Expo ImagePicker`
- 🛎️ Improve UX and match with website/twitter style
- 🛎️ Upgrade `bundlr-network/client` dependency, the newer version break some of our actual dependencies
- 🛎️ Improve caching the images locally
- ⌛ Write a native Kotlin SDK for Bundlr
- ⌛ Re-write code from React Native to Kotlin

## Setup

#### 1. Create a Solana Wallet

🚧 This is a step only required on this version of the POC that will be later replaced by the `Mobile Wallet Adapter` implemtation on the SAGA phone 🚧

Create a `wallet.json` file and inject it's content on the `key` constant on [App.tsx](App.tsx), to create the `wallet.json` file follow [How to create a Solana Wallet](docs/how_to_create_a_solana_wallet.md) document.

> Don't forget to drop some SOL into it in order to be able to test the app, that's as well explained on the previuous link

#### 2. Install dependencies

```
yarn
```

## Run

#### 1. Run the Metro server 
```
yarn android
```

#### 2. Reload the app onto the mobile device
```
r
```

# Resources

- https://github.com/solana-labs/wallet-adapter
- https://github.com/solana-labs/solana-web3.js
- https://github.com/solana-mobile/seed-vault-sdk
- https://github.com/solana-mobile/mobile-wallet-adapter
- https://github.com/solana-mobile/expo-react-native-mwa-proof-of-concept
- https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/js/packages/mobile-wallet-adapter-protocol