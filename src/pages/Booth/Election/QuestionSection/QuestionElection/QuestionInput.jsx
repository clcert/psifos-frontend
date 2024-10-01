import RankingSelection from "../RankingSelection"
import InputSelection from "../InputSelection"
import MixnetSelection from "../MixnetSelection/MixnetSelection"
import {
    isSTVQuestion, isClosedQuestion, isMixNetQuestion,
} from "../../../../../utils"

export default function QuestionInput ({
    questionType, selectionProps, index,
  }) {
    return (
      <div className="box has-text-left question-box has-text-white is-flex is-justify-content-center mb-3">
        <div className="control control-box">
          {isSTVQuestion(questionType) && (
            <RankingSelection {...selectionProps} />
          )}
          {isClosedQuestion(questionType) && (
            <InputSelection {...selectionProps} />
          )}
          {isMixNetQuestion(questionType) && (
            <MixnetSelection numQuestion={index} {...selectionProps} />
          )}
        </div>
      </div>
    )
  }