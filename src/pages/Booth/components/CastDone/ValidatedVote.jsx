import { useState } from "react";
import { useParams } from "react-router-dom";
import { backendOpIP, frontIP } from "../../../../server";

function OptinalStep({ title, text, button }) {
  return (
    <div className="optional-step">
      <div className="statement mb-1 text-align-justify">
        <i
          class="fa fa-check mr-3 is-color-blue opt-title"
          aria-hidden="true"
        />
        <span>{title}</span>
      </div>
      <p className="text text-align-justify">{text}</p>
      <div className="opt-button" style={{}}>
        {button}
      </div>
    </div>
  );
}

function PrettyButton({ onClick, icon, text, id, subContent }) {
  return (
    <div>
      <button className="button" onClick={onClick} id={id}>
        <span className="icon is-small">{icon}</span>
        <span className="is-size-7-mobile">{text}</span>
      </button>
      {subContent}
    </div>
  );
}

function InfoCard({ title, content }) {
  return (
    <div className="box">
      <p className="subtitle is-3 is-color-blue">{title}</p>
      {content}
    </div>
  );
}

function ValidatedVote(props) {
  const [loadFileContent, setLoadFileContent] = useState();

  const { shortName } = useParams();
  async function downloadFile() {
    setLoadFileContent(
      <p className="mt-1">
        Generando el archivo{" "}
        <i id="step_1" className={"fa-solid fa-spinner fa-spin"}></i>
      </p>
    );
    const url = backendOpIP + "/" + shortName + "/get-certificate";
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
      setLoadFileContent(
        <p className="mt-1">
          Archivo descargado{" "}
          <i id="step_1" className={"fa-solid fa-circle-check"}></i>
        </p>
      );
      setTimeout(() => {
        window.URL.revokeObjectURL(objURL);
      }, 250);
    }
  }
  function openBallotBox() {
    window.open(
      frontIP +
        "psifos/booth/" +
        shortName +
        "/public-info?hash=" +
        encodeURIComponent(props.voteHash),
      "_blank"
    );
  }

  function exit() {
    window.location.href = frontIP;
  }

  return (
    <div className="validated-vote">
      <InfoCard
        title="SU PROCESO DE VOTACIÓN HA FINALIZADO"
        content={
          <div>
            <div className="mb-4" style={{ fontSize: "23px" }}>
              <span>Su voto encriptado ha sido recibido exitosamente.</span>
            </div>
            <PrettyButton
              onClick={exit}
              id="back-vote-button"
              icon={
                <i class="fa-solid fa-house" style={{ fontSize: "18px" }} />
              }
              text="VOLVER AL INICIO"
            />
          </div>
        }
      />
      <InfoCard
        title="¿QUÉ PUEDO HACER AHORA?"
        content={
          <div className="mb-4">
            <OptinalStep
              title="Puede descargar el certificado de su voto."
              text={
                "Este documento acredita que tu voto fue realizado " +
                "correctamente y que será contabilizado en el escrutinio final. " +
                "Sin embargo, el certificado no proporciona información sobre " +
                "las preferencias emitidas en el voto."
              }
              button={
                <PrettyButton
                  onClick={downloadFile}
                  id="back-vote-button"
                  icon={<i className="fa-solid fa-file-arrow-down" />}
                  text="DESCARGAR CERTIFICADO"
                  subContent={loadFileContent}
                />
              }
            />
            <OptinalStep
              title="Puede verificar su voto en la urna electrónica."
              text={
                "En este lugar se encuentran todos los votos encriptados " +
                "y enviados hasta el momento. Al ingresar, podrá observar que la " +
                "fila resaltada corresponde a una muestra de su voto encriptado."
              }
              button={
                <PrettyButton
                  onClick={openBallotBox}
                  id="back-vote-button"
                  icon={<i className="fa-solid fa-box-archive" />}
                  text="VER URNA ELECTRÓNICA"
                />
              }
            />
            <p className="optional-note">
              ¡Importante! Si así lo desea, tiene la opción de volver a votar
              mientras el proceso se mantenga abierto. En caso de que decida
              hacerlo, su nuevo voto encriptado reemplazará al anterior y solo
              se considerará válido el último voto encriptado emitido.
            </p>
          </div>
        }
      />
    </div>
  );
}

export default ValidatedVote;
