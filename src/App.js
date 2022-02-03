import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import ElectionResume from "./views/ElectionResume";
import Urna from "./views/Urna";

function App() {
  return (
    <Routes>
      <Route path=":uuid/resumen" element={<ElectionResume/>} />
      <Route path=":uuid/urna" element={<Urna/>} />
    </Routes>
  );
}

export default App;
