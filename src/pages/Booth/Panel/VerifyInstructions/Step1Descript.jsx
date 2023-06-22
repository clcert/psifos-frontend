import { useParams } from "react-router-dom";
import { bundleDownload } from "../../../../services/bundle";
import CardInstruction from "./CardInstruction";

function Description() {
  /** @urlParam {string} shortName of election  */
  const { shortName } = useParams();
  const bundleButton = async () => {
    /**
     * Get bundle file a generate download file
     */
    bundleDownload(shortName);
  };
  return (
    <div className="verify-instruction-descript">
      {
        "El resumen matemático de la elección es un archivo que contiene la síntesis de los cálculos matemáticos que se realizaron para obtener los resultados."
      }
      <div className="is-flex is-justify-content-center button-container">
        <button
          onClick={bundleButton}
          className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
        >
          <div>Descargar resumen matemático de la elección</div>
        </button>
      </div>
    </div>
  );
}

function StepDescript() {
  return (
    <CardInstruction
      title={"Paso 1: Descargar el resumen matemático"}
      description={<Description />}
    />
  );
}

export default StepDescript;
