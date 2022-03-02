import "./App.css";
import { Routes, Route } from "react-router-dom";
import ElectionResume from "./pages/Admin/ElectionResume/ElectionResume";
import Urna from "./pages/Admin/Urna/Urna";
import CustodioClaves from "./pages/Admin/CustodioClaves/CustodioClaves";
import Resultados from "./pages/Admin/Results/Resultados";
import Home from "./pages/Home/Home";
import "bulma/css/bulma.min.css";
import Cabina from "./pages/Cabina/Cabina";
import HomeAdmin from "./pages/Admin/Home/HomeAdmin";
import AdministrationPanel from "./pages/Admin/AdministrationPanel/AdministrationPanel";
import Login from "./pages/Admin/Login/Login";
import CreateElection from "./pages/Admin/CreateElection/CreateElection";
import CreateQuestion from "./pages/Admin/CreateQuestion.js/CreateQuestion";
import Consult from "./pages/Cabina/Consult/Consult";

function App() {
  return (
    <Routes>
      <Route path="home" element={<Home />} />

      <Route path="/admin">
        <Route path="login" element={<Login />} />
        <Route path="home" element={<HomeAdmin />} />
        <Route path="createElection" element={<CreateElection />} />
        <Route path="createQuestion" element={<CreateQuestion />} />
        <Route path=":uuid/panel" element={<AdministrationPanel />} />
        <Route path=":uuid/resumen" element={<ElectionResume />} />
        <Route path=":uuid/urna" element={<Urna />} />
        <Route path=":uuid/custodio" element={<CustodioClaves />} />
        <Route path=":uuid/resultado" element={<Resultados />} />
      </Route>

      <Route path="/cabina">
        <Route path=":uuid" element={<Cabina />} />
        <Route path="consult" element={<Consult />} />
      </Route>
    </Routes>
  );
}

export default App;
