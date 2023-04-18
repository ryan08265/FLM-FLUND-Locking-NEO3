import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Locking from "./pages/Locking";
import Deposit from "./pages/Deposit";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="locking" element={<Locking />} />
          <Route path="deposit" element={<Deposit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
