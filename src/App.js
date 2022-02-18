import "./App.css";
import { Routes, Route } from "react-router-dom";
import ElectionResume from "./views/ElectionResume";
import Urna from "./views/Urna";
import CustodioClaves from "./views/CustodioClaves";
import Resultados from "./views/Resultados";
import Home from "./views/Home";
import HomeCabin from "./component/CabinaComponent/HomeCabin";
import "bulma/css/bulma.min.css";

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
        <Route path=":uuid" element={<HomeCabin />} />
      </Route>
    </Routes>
  );
}

export default App;
