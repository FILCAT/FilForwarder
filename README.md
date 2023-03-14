# FilForwarder

![fil-forwarder](https://user-images.githubusercontent.com/952183/221913008-653d36db-761b-4346-8021-a14f3b647308.png)

## Purpose

The **FilForwarder** smart contract enables FEVM users holding FIL in Ethereum based wallets (like Metamask, Coinbase Wallet, etc) to send their FIL safely and securely to other address spaces in the Filecoin ecosystem.

## Context

Filecoin has multiple address spaces, known as f0, f1, f2, f3, and f4 addresses. The newest address space is "f4," which has a 1:1 correspondence with ethereum-style "0x" addresses. 

You can read more about the address spaces in the Filecoin documentation: https://spec.filecoin.io/appendix/address/

## Problem

Filecoin users interacting with the FEVM will be using an f4 address, masked to the ethereum-style "0x" address. To interact with smart contracts, users will have FIL in an ethereum wallet, connected to the Filecion network. This means that FIL will be in Metamask, Coinbase Wallet, or any other EVM-based wallet that enables you to add custom networks.

However, there are use cases where upon a user with FIL in an 0x-style address would want to send to an f1, f2, or f3 address. An example of this would be taking FIL out of a smart contract, and sending to a multi-sig account or an exchange. In this case, ethereum-based wallets will not recognize the f1/f2/f3 address formats, making it impossible to send.

While there are ways to "mask" these f1/f2/f3 style address to 0x addresses, there are enough edge cases that it isn't always reliable. 

## Solution

The Fil Forwarder exposes a smart contract method called "forward" that takes a byte-level definition of a protocol address in "f-style," and a message value and uses internal Filecoin APIs exposed via FEVM to properly send FIL funds reliably using a method-0 send. This also has the side effect of creating the actor ID should the address be considered new. In this way, using Fil Forwarder from an ethereum wallet to any other Filecoin Address space is safe and reliable.

## Usage

### Cloning the repo

Open up your terminal (or command prompt) and navigate to a directory you would like to store this code on. Once there type in the following command:

```
git clone https://github.com/lotus-web3/FilForwarder.git
cd FilForwarder
yarn install
```

### Get a Private Key

You can get a private key from a wallet provider [such as Metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

### Add your Private Key as an Environment Variable

Add your private key as an environment variable by running this command:

 ```
export PRIVATE_KEY='abcdef'
```

If you use a .env file, don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

### Running the Task

The contract is deterministically deployed on all Filecoin networks at `0x2B3ef6906429b580b7b2080de5CA893BC282c225`. Any contract claiming to be a FIL forwarder that does not reside at this address should not be trusted. Any dApp can connect to the wallet, and use the ABI in this repository to call this method via any frontend.

Inside of this repository is also a hardhat task called `forward`. This task will use the private key in your .env file in the directory to send funds using the contract. This task uses the `fil-forwarder-{CHAIN_ID}.json` file to determine the deployed contract address for a given network. These addresses should always be the same, but these files prevent you from having to specify it each time.

For the below, the following should be considered:
* DESTINATION_ADDRESS: This is the address you want to send FIL to. This is a string, like `t01024` or `t3tejq3lb3szsq7spvttqohsfpsju2jof2dbive2qujgz2idqaj2etuolzgbmro3owsmpuebmoghwxgt6ricvq`.
* AMOUNT: This is the amount of FIL you want to send. The value `13.5` would be 13.5 FIL. 

#### Forwarding FIL on Hyperspace

`yarn hardhat forward --network hyperspace --destination DESTINATION_ADDRESS --amount AMOUNT`

Example:

`yarn hardhat forward --network hyperspace --destination t3tejq3lb3szsq7spvttqohsfpsju2jof2dbive2qujgz2idqaj2etuolzgbmro3owsmpuebmoghwxgt6ricvq --amount 9.0`

#### Forwarding FIL on Calibration

`yarn hardhat forward --network calibration --destination DESTINATION_ADDRESS --amount AMOUNT`

Example:

`yarn hardhat forward --network calibration --destination t010135 --amount 42.5`

#### Forwarding FIL on Mainnet

Coming Soon (3/14!)

