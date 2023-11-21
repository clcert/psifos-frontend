import { isMixNetQuestion } from "../../../../utils"

export default function GroupApplicationsCheckbox({
    disabledEdit, handleChange, checkedOption, questionType,
  }) {
    return (
      isMixNetQuestion(questionType) && (
        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input
                disabled={disabledEdit}
                onChange={handleChange}
                checked={checkedOption}
                type="checkbox"
                className="mr-2"
              />
              Agrupar candidaturas
            </label>
          </div>
          <p className="help">
            Se agruparan los distintos votos por grupo.
          </p>
        </div>
      )
    )
  }
  