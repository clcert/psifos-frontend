import { useEffect } from "react";
import { useParams } from "react-router-dom";

function AutchCas(){

  const { uuid } = useParams();

    useEffect(() => {
        window.location.href = "http://localhost:5000/CASLogin?uuid=" + uuid;
      }, []);

    return (<></>)
}
export default AutchCas;