import QuestionCard from "./QuestionCard";

export default function QuestionCards ({
    questionList, election, disabledEdit,
    updateQuestion, removeQuestion, handleOptionsChecked,
}) {
return (
    questionList.map((item, index) => {
        return (
            <QuestionCard
                key={index}
                election={election}
                disabledEdit={disabledEdit}
                questionId={item.key}
                question={item}
                updateQuestion={updateQuestion}
                remove={() => {
                    removeQuestion(item.key);
                }}
                checkOptions={handleOptionsChecked}
            />
        );
    })
)
}