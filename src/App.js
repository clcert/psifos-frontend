import "./App.css";
import { Routes, Route } from "react-router-dom";
import ElectionResume from "./pages/ElectionResume/ElectionResume";
import Urna from "./pages/Urna/Urna";
import CustodioClaves from "./pages/CustodioClaves/CustodioClaves";
import Resultados from "./pages/Results/Resultados";
import Home from "./pages/Home/Home";
import "bulma/css/bulma.min.css";
import Cabina from "./pages/Cabina/Cabina";

function App() {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="/admin">
        <Route path=":uuid/resumen" element={<ElectionResume />} />
        <Route path=":uuid/urna" element={<Urna />} />
        <Route path=":uuid/custodio" element={<CustodioClaves />} />
        <Route path=":uuid/resultado" element={<Resultados />} />
      </Route>

      <Route path="/cabina">
        <Route path=":uuid" element={<Cabina />} />
      </Route>
    </Routes>
  );
}

export default App;
