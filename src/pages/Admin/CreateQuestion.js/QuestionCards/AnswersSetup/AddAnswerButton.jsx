import { Button } from "react-bulma-components";

export default function AddAnswerButton ({
    questionId, handleNewAns,
  }) {
    return (
      <div className="is-flex level">
        <div className="is-flex leve-left">
          <Button
            id={`add-option-${questionId}`}
            className="button-create-question"
            onClick={handleNewAns}
          >
            Añadir opción
          </Button>
        </div>
      </div>
    )
  }