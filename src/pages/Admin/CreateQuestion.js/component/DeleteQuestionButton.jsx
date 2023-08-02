export default function DeleteQuestionButton({enable, handleDelete}) {
    return (
      <div className="header-question level">
        <div className="level-left"></div>
        <div className="level-right">
          {enable && (
            <i
              onClick={handleDelete}
              className="close-question fa-solid fa-trash"
            ></i>
          )}
        </div>
      </div>
    )
}