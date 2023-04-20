import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Locking from "./pages/Locking";
import Deposit from "./pages/Deposit";
import './App.scss';

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
