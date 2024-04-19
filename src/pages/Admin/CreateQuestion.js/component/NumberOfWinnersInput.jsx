import { Columns } from "react-bulma-components";
import CotedInput from "./CotedInput";
import { isSTVQuestion } from "../../../../utils";

export default function NumberOfWinnersInput({
    handleNumOfWinners, questionType, ...props
}) {
    return (
        isSTVQuestion(questionType) && (
            <Columns>
                <CotedInput
                    label="Número de opciones ganadoras"
                    inputId={`question-${props.questionId}-number-of-winners`}
                    placeholder="Número de ganadores"
                    minCoteWarningMessage="Debe introducir un número mayor que 0"
                    maxCoteWarningMessage="Debe introducir un número menor o igual a la cantidad de respuestas"
                    handleInput={(e) => {
                        const enteredValue = parseInt(e.target.value);
                        if (isNaN(enteredValue) || enteredValue >= 0) {
                            handleNumOfWinners(enteredValue);
                        }
                    }}
                    {...props}
                />
            </Columns>
        )
    )
}