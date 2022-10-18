import { useParams } from "react-router-dom";
import { backendOpIP, frontIP } from "../../../../server";

function ValidatedVote(props) {
  const { uuid } = useParams();
  async function downloadFile() {
    const url = backendOpIP + "/" + uuid + "/get-certificate";
    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hash_vote: props.voteHash,
      }),
    });
    if (resp.status === 200) {
      const fname = "reporte" + ".pdf";
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

  return (
    <>
      <p className="subtitle is-3 has-text-black mb-1">
        HEMOS RECIBIDO TU VOTO EXITOSAMENTE
      </p>
      <p className="subtitle has-text-black send-text">
        Si tu papeleta no es objetada, será incorporada al conteo final.
      </p>
      <p className="subtitle has-text-black mb-0">
        Código de Papeleta:
        <span
          className="icon question-audit has-tooltip-arrow has-tooltip-right has-tooltip-left-mobile has-tooltip-multiline has-tooltip-info"
          data-tooltip="Código único o número serial de la papeleta encriptada. NO revela el contenido del voto."
        >
          <i className="far fa-question-circle"></i>
        </span>
      </p>
      <p className="subtitle py-1 mb-5" id="vote-code">
        {props.voteHash}
        <a
          id="vote-fingerprint-anchor"
          className="has-tooltip-arrow has-tooltip-bottom has-tooltip-info"
          data-tooltip="Copiar"
        >
          <strong>
            <tt className="has-text-white py-3" id="vote-fingerprint"></tt>
          </strong>
        </a>
      </p>

      <p className="subtitle is-5 pb-3">
        Puedes{" "}
        <a
          href={
            frontIP +
            "/booth/" +
            uuid +
            "/ballot-box?hash=" +
            encodeURIComponent(props.voteHash)
          }
        >
          verificar aquí
        </a>{" "}
        que tu código de papeleta está presente en la urna electrónica y será
        contabilizada.
      </p>

      <p className="subtitle is-5 pb-3">
        Puedes{" "}
        <span className="download-button" onClick={downloadFile}>
          descargar
        </span>{" "}
        un certificado que acredita tu voto.
      </p>
      <a href="https://participa.uchile.cl/">
        <button className="button is-medium my-4" id="back-vote-button">
          <span className="icon is-small">
            <i className="fas fa-2x fa-caret-left"></i>
          </span>
          <span>IR A PÁGINA PRINCIPAL</span>
        </button>
      </a>
    </>
  );
}

export default ValidatedVote;
