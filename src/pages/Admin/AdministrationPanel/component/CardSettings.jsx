import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { backendOpIP } from "../../../../server";

function CardSettings(props) {
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const { uuid } = useParams();
  return (
    <div className="box ">
      <div className="is-size-4">Opciones de la elección</div>

      <hr />

      <div className="is-size-6">
        <div className="content-card-admin">
          <i className="fa-solid fa-pen-to-square pr-1 mr-2"></i>
          <Link
            className="link-without-line"
            to={"/psifos/admin/" + uuid + "/edit-election/"}
          >
            Editar elección
          </Link>
        </div>
        <div className="content-card-admin">
          <i className="fa-solid fa-circle-question pr-2 mr-1"></i>
          <Link
            className="link-without-line"
            to={"/psifos/admin/" + uuid + "/create-question/"}
          >
            Ver preguntas
          </Link>
        </div>

        {props.haveQuestions && (
          <div className="content-card-admin">
            <i className="fa-solid fa-person-booth mr-2"></i>
            <Link
              className="link-without-line"
              to={"/psifos/admin/" + uuid + "/booth"}
            >
              Ver previsualización
            </Link>
          </div>
        )}

        <div className="content-card-admin">
          <i className="fa-solid fa-square-poll-horizontal pr-2 "></i>{" "}
          <Link
            target="_blank"
            className="link-without-line"
            to={"/psifos/booth/" + uuid + "/ballot-box/"}
          >
            Ver urna electronica
          </Link>
        </div>

        <div className="content-card-admin">
          <i className="fa-solid fa-check-to-slot mr-2"></i>
          <CopyToClipboard
            text={backendOpIP + "/vote/" + uuid}
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
      </div>
    </div>
  );
}

export default CardSettings;
