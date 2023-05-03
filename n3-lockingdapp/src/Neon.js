import {
    default as Neon
  } from "@cityofzion/neon-js";
const acct = Neon.create.account("NKuyBkoGdZZSLyPbJEetheRhMjeznFZszf");
import { chain, createClient, WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

neolineN3.getProvider()
.then(provider => {
    const {
        name,
        website,
        version,
        compatibility,
        extra
    } = provider;

    console.log('Provider name: ' + name);
    console.log('Provider website: ' + website);
    console.log('Provider dAPI version: ' + version);
    console.log('Provider dAPI compatibility: ' + JSON.stringify(compatibility));
    console.log('Extra provider specific atributes: ' + JSON.stringify(compatibility));
})
.catch((error) => {
    const {type, description, data} = error;
    switch(type) {
        case 'NO_PROVIDER':
            console.log('No provider available.');
            break;
        case 'CONNECTION_DENIED':
            console.log('The user rejected the request to connect with your dApp.');
            break;
        default:
            // Not an expected error object.  Just write the error to the console.
            console.error(error);
            break;
    }
});

neolineN3.getTransaction({
    txid: '0xe5a5fdacad0ba4e8d34d2fa0638357adb0f05e7fc902ec150739616320870f50'
  })
  .then(result => {
    console.log('Transaction details: ' + JSON.stringify(result));
  })
  .catch((error) => {
    const {type, description, data} = error;
    switch(type) {
        case 'NO_PROVIDER':
            console.log('No provider available.');
            break;
        case 'RPC_ERROR':
            console.log('There was an error when broadcasting this transaction to the network.');
            break;
        default:
            // Not an expected error object.  Just write the error to the console.
            console.error(error);
            break;
    }
});

neolineN3.pickAddress()
.then(result => {
    const { label, address } = result;
    console.log('label:' + label);
    console.log('address' + address);
})
.catch((error) => {
    const {type, description, data} = error;
    switch(type) {
        case 'NO_PROVIDER':
            console.log('No provider available.');
            break;
        case 'CANCELED':
            console.log('The user cancels, or refuses the dapps request');
            break;
        default:
            // Not an expected error object.  Just write the error to the console.
            console.error(error);
            break;
    }
});