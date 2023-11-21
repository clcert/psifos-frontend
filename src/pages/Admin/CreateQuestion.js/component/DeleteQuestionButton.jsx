export default function DeleteQuestionButton({
  enable, handleDelete
}) {
    return (
      <div className="header-question">
        {enable && (
          <i
            onClick={handleDelete}
            className="close-question fa-solid fa-trash"
          />
        )}
      </div>
    )
}