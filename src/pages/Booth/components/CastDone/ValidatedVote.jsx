import { useParams } from "react-router-dom";
import { backendOpIP, frontIP } from "../../../../server";

function OptinalStep({title, text}) {
  return(
    <div>
      <div className="mb-1" style={{fontSize:"23px"}}>
        <i class="fa fa-check mr-3 is-color-blue" aria-hidden="true"/>
        <span>{title}</span>
      </div>
      <p>{text}</p>
    </div>
  )
}

function PrettyButton({
  onClick, icon, text, id
}) {
  return (
    <button
      className="button"
      onClick={onClick}
      id={id}
    >
      <span className="icon is-small">
        {icon}
      </span>
      <span>{text}</span>
    </button>
  )
}

function InfoCard({title, content, buttons}) {
  return (
    <div className="box">
      <p className="subtitle is-3 is-color-blue">
        {title}
      </p>
      {content}
      {buttons}
    </div>
  )
}

function ValidatedVote(props) {
  const { shortName } = useParams();
  async function downloadFile() {
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
            <div className="mb-4" style={{fontSize:"23px"}}>
              <span>
                Su voto encriptado ha sido recibido exitosamente.
              </span>
            </div>
          </div>
        }
        buttons={
          <div>
            <PrettyButton
              onClick={exit}
              id="back-vote-button"
              icon={
                <i class="fa-solid fa-house" style={{fontSize: "18px"}}/>
              }
              text="VOLVER AL INICIO"
            />
          </div>
        }
      />
      <InfoCard
        title="¿QUÉ PUEDO HACER AHORA?"
        content={
          <div className="text-align-justify mb-5">
            <OptinalStep
              title="Puede descargar el certificado de su voto."
              text={
                "Este documento acredita que tu voto fue realizado " +
                "correctamente y que será contabilizado en el escrutinio final. " +
                "Sin embargo, el certificado no proporciona información sobre " +
                "las preferencias emitidas en el voto."
              }
              />
            <OptinalStep
              title="Puede verificar su voto en la urna electrónica."
              text={
                "En este lugar se encuentran todos los votos encriptados " +
                "y enviados hasta el momento. Al ingresar, podrá observar que la " +
                "fila resaltada corresponde a una muestra de su voto encriptado."
              }
              />
            <OptinalStep
              title="Si lo desea, tiene la opción de volver a votar mientras el proceso esté abierto."
              text={
                "En caso de hacerlo, su nuevo voto encriptado reemplazará al anterior, y solo se " +
                "tomará en cuenta el último voto encriptado emitido."
              }
              />
          </div>
        }
        buttons={
          <div className="columns">
            <div className="column castdone-box mb-0 is-5">
              <PrettyButton
                id="back-vote-button"
                onClick={downloadFile}
                text="DESCARGAR CERTIFICADO DE VOTO"
                icon={
                  <i className="fa-solid fa-file-arrow-down"/>
                }
              />  
            </div>
            <div className="column is-2"/>
            <div className="column castdone-box is-5">
              <PrettyButton
                onClick={openBallotBox}
                id="back-vote-button"
                icon={
                  <i className="fa-solid fa-box-archive"/>
                }
                text="VER URNA ELECTRÓNICA"
              /> 
            </div>
          </div>
        }
      />
    </div>
  );
}

export default ValidatedVote;
