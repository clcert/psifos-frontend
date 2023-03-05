import { useParams } from "react-router-dom";
import { backendOpIP, frontIP } from "../../../../server";

function ValidatedVote(props) {
  const { uuid } = useParams();
  async function downloadFile() {
    const url = backendOpIP + "/" + uuid + "/get-certificate";
    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (resp.status === 200) {
      const fname = "reporte.pdf";
      const blob_resp = await resp.blob();
      const objURL = window.URL.createObjectURL(blob_resp);
      let lnk = document.createElement("a");
      lnk.href = objURL;
      lnk.download = fname;
      lnk.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(objURL);
      }, 250);
    }
  }
  function openBallotBox() {
    window.open(
      frontIP +
        "psifos/booth/" +
        uuid +
        "/public-info?hash=" +
        encodeURIComponent(props.voteHash),
      "_blank"
    );
  }

  function exit() {
    window.location.href = frontIP;
  }

  return (
    <>
      <p className="subtitle is-3 has-text-black mb-1">
        HEMOS RECIBIDO TU VOTO
      </p>
      <p className="subtitle has-text-black send-text">
        Tu voto ha sido recibido y validado exitosamente
      </p>

      <div className="columns">
        <div className="column castdone-box mb-0 is-5">
          <button
            className="button"
            onClick={downloadFile}
            id="back-vote-button"
          >
            <span className="icon is-small is-size-7-touch">
              <i className="fa-solid fa-file-arrow-down"></i>
            </span>
            <span className="is-size-7-touch">
              DESCARGAR CERTIFICADO DE VOTO
            </span>
          </button>
          <p className="subtitle is-6 mt-3">
            El Certificado de Voto no permite conocer como votaste, sino que
            solamente acredita que tu voto fue realizado correctamente y será
            contabilizado en el escrutinio final.
          </p>
        </div>

        <div className="column is-2"></div>

        <div className="column castdone-box is-5">
          <button
            className="button"
            onClick={openBallotBox}
            id="back-vote-button"
          >
            <span className="icon is-small">
              <i className="fa-solid fa-box-archive"></i>
            </span>
            <span>VER URNA ELECTRÓNICA</span>
          </button>
          <p className="subtitle is-6 mt-3">
            La Urna Electrónica contiene todos los votos cifrados enviados hasta
            ese momento.
          </p>
        </div>
      </div>

      <p className="subtitle is-5 pb-2 mt-4">
        Si lo deseas, puedes volver a votar durante el tiempo que la votación
        esté abierta. Si lo haces, el nuevo voto reemplazará al existente, y
        sólo se contará el último voto emitido.
      </p>
      <button
        onClick={exit}
        className="button is-medium my-4"
        id="back-vote-button"
      >
        <span className="icon is-small">
          <i className="fas fa-2x fa-caret-left"></i>
        </span>
        <span>SALIR</span>
      </button>
    </>
  );
}

export default ValidatedVote;
