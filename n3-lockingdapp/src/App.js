import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Locking from "./pages/Locking";
import Deposit from "./pages/Deposit";
import './App.scss';
import {
  default as Neon
} from "@cityofzion/neon-js";
const acct = Neon.create.account("NKuyBkoGdZZSLyPbJEetheRhMjeznFZszf");
import "../styles/globals.css";

import "@rainbow-me/rainbowkit/styles.css";

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, createClient, WagmiProvider } from "wagmi";

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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/locking' element={<Locking />} />
        <Route path='/deposit' element={<Deposit />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
