import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import ElectionResume from "./views/ElectionResume";
import Urna from "./views/Urna";
import CustodioClaves from "./views/CustodioClaves";


function App() {
  return (
    <Routes>
      <Route path=":uuid/resumen" element={<ElectionResume/>} />
      <Route path=":uuid/urna" element={<Urna/>} />
      <Route path=":uuid/custodio" element={<CustodioClaves/>} />
    </Routes>
  );
}

export default App;
