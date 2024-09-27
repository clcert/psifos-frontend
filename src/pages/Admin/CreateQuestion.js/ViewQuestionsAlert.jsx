export default function ViewQuestionsAlert ({
    colorAlert, closeAlert, alertMessage,
  }) {
    return (
      <div className={"notification " + colorAlert + " is-light"}>
        <button
          onClick={closeAlert}
          className="delete"
        />
        {alertMessage}
      </div>
    )
  }