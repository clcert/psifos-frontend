import GenericModal from "../../../../../component/Modals/GenericModal";
import { useState } from "react";

function ShowOptions ({
    options, optionsImages,
}) {
    return (
      <div>
        <div
          className="options-text-container"
        >
          A continuación, se presentan los diseños correspondientes a cada opción. Para indicar sus preferencias, haga clic en el botón ubicado en la parte inferior.
        </div>
        <div
          className="options-images-container"
        >
          {options.map((option, index) => {
            return (
              <div
                key={option}
                className="option-image-container"
              >
                <b>
                  {option}
                </b>
                <img
                  src={`data:image/jpeg;base64,${optionsImages[index]}`}
                  width={180}
                  height={180}
                  style={{pointerEvents: 'none'}}
                />
              </div>
          )
        })}
        </div>
      </div>
    )
  }

export default function QuestionOptionsDetail ({
    options, optionsImages,
  }) {
    const [showDetail, setShowDetail] = useState(true);
    return (
      <div>
        <div
          className="box options-box mb-3"
          onClick={() => setShowDetail(true)}
        >
          <i
            className="fa-solid fa-circle-info more-info-icon"
          />
          <span>
            Para ver las imágenes asociadas a cada opción haga click aquí.
          </span>
        </div>
        <GenericModal
          showModal={showDetail}
          handleClose={() => setShowDetail(false)}
          title="Detalle de las opciones"
          closeButtonText="Elegir Preferencias"
        >
          <ShowOptions
            options={options}
            optionsImages={optionsImages}
          />
        </GenericModal>
      </div>
    )
  }