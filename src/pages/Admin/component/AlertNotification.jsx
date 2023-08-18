export default function AlertNotification({
  alertMessage,
  onClear,
  type = "danger",
  isLight = true,
}) {
  const typeAlert = {
    danger: "is-danger",
    primary: "is-primary",
    success: "is-success",
    info: "is-info",
    warning: "is-warning",
    link: "is-link",
  };

  return (
    <>
      {alertMessage && (
        <div
          className={`notification ${typeAlert[type]} ${
            isLight ? "is-light" : ""
          }`}
        >
          <div>{alertMessage}</div>
          {onClear && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className="delete" onClick={onClear} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
