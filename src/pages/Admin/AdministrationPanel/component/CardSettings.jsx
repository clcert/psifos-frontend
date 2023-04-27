import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { backendInfoIp, backendOpIP } from "../../../../server";

function CardSettings(props) {
  /** @state {bool} state for show infor message about copy */
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  /** @urlParam {string} shortName of election  */
  const { shortName } = useParams();

  const bundleDownload = async () => {
    /**
     * Get bundle file a generate download file
     */

    const url = backendInfoIp + "/election/" + shortName + "/bundle-file";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const jsonResponse = await response.json();
      const bundleContent = JSON.stringify(parseBundleFile(jsonResponse));
      let hiddenElement = document.createElement("a");
      hiddenElement.download = `bundle-file.json`;
      const blob = new Blob([bundleContent], {
        type: "application/json",
      });
      hiddenElement.href = window.URL.createObjectURL(blob);
      hiddenElement.click();
    }
  };

  const parseBundleFile = (bundleJson) => {
    /**
     * Parse file to b64 without spaces and \n
     */

    Object.keys(bundleJson).forEach((key) => {
      bundleJson[key] = btoa(
        JSON.stringify(bundleJson[key]).replace(/[\n\r\s]+/g, "")
      );
    });
    return bundleJson;
  };

  return (
    <div className="box ">
      <div className="is-size-4">Opciones de la elección</div>

      <hr />

      <div className="is-size-6">
        <div className="content-card-admin">
          <div className="icon-card-admin d-inline-flex justify-content-center mr-2">
            <i className="fa-solid fa-pen-to-square"></i>
          </div>
          <Link
            className="link-without-line"
            to={"/psifos/admin/" + shortName + "/edit-election/"}
          >
            Editar elección
          </Link>
        </div>
        <div className="content-card-admin">
          <div className="icon-card-admin d-inline-flex mr-2">
            <i className="fa-solid fa-circle-question"></i>
          </div>
          <Link
            className="link-without-line"
            to={"/psifos/admin/" + shortName + "/create-question/"}
          >
            Ver preguntas
          </Link>
        </div>

        {props.election.questions !== null && (
          <div className="content-card-admin">
            <div className="icon-card-admin d-inline-flex justify-content-center mr-2">
              <i className="fa-solid fa-person-booth"></i>
            </div>
            <Link
              className="link-without-line"
              to={"/psifos/admin/" + shortName + "/booth"}
            >
              Ver previsualización
            </Link>
          </div>
        )}

        <div className="content-card-admin">
          <div className="icon-card-admin d-inline-flex justify-content-center mr-2">
            <i className="fa-solid fa-square-poll-horizontal"></i>{" "}
          </div>
          <Link
            target="_blank"
            className="link-without-line"
            to={"/psifos/booth/" + shortName + "/public-info"}
          >
            Ver portal de información
          </Link>
        </div>

        <div className="content-card-admin">
          <div className="icon-card-admin d-inline-flex justify-content-center mr-2">
            <i class="fa-solid fa-copy"></i>{" "}
          </div>
          <CopyToClipboard
            text={backendOpIP + "/" + shortName + "/vote"}
            onCopy={() => setShowCopyMessage(true)}
          >
            <span>
              <Link to="" className="link-without-line">
                Copiar link de elección
              </Link>
              {showCopyMessage && (
                <span className="alert-copy ml-2">Link copiado!</span>
              )}
            </span>
          </CopyToClipboard>
        </div>
        {props.election.election_status === "Decryptions combined" && (
          <div onClick={bundleDownload} className="content-card-admin">
            <div className="icon-card-admin d-inline-flex justify-content-center mr-2">
              <i class="fa-solid fa-file-arrow-down"></i>{" "}
            </div>
            <Link className="link-without-line" to="">
              Descargar archivo de verificación
            </Link>
          </div>
        )}
        <div className="content-card-admin">
          <div className="icon-card-admin d-inline-flex justify-content-center mr-2">
            <i className="fa-solid fa-trash "></i>
          </div>
          <Link
            className="link-without-line-red"
            to=""
            onClick={() => {
              props.setDeleteElectionModal(true);
            }}
          >
            Eliminar elección
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CardSettings;
