import { Button } from "react-bulma-components";
import { Link } from "react-router-dom";

function QuestionButton ({
    children, buttonId, disabled, handleClick,
}) {
return (
    <div className="col-sm d-flex justify-content-center mt-3">
        <Button
            className="btn-fixed"
            id={buttonId}
            disabled={disabled}
            onClick={handleClick}
        >
            {children}
        </Button>
    </div>
)
}

export default function ViewQuestionsButtons ({
    shortName, disabledEdit, addQuestion, sendQuestions,
}) {
return (
    <div className="row is-centered mt-5">
    <QuestionButton>
        <Link
            style={{ textDecoration: "none", color: "#363636" }}
            to={"/psifos/admin/" + shortName + "/panel"}
        >
           Volver inicio
        </Link>
    </QuestionButton>
    <QuestionButton
        buttonId="add-question"
        disabled={disabledEdit}
        handleClick={addQuestion}
    >
        Añadir pregunta
    </QuestionButton>
    <QuestionButton
        buttonId="button-save-questions"
        disabled={disabledEdit}
        handleClick={sendQuestions}
    >
        Guardar Preguntas
    </QuestionButton>
    </div>
)
}