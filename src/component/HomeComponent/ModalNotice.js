import $ from "jquery";

function ModalNotice(props) {
  return (
    <div className="modal" id={"info-notice" + String(props.index)}>
      <div
        className="modal-background"
        onClick={() => {
          $("#info-notice" + String(props.index)).removeClass("is-active");
        }}
      ></div>
      <div className="modal-card">
        <section className="modal-notice-body">
          <div
            className="modal-notice-sup pr-5 pb-1"
            onClick={() => {
              $("#info-notice" + String(props.index)).removeClass("is-active");
            }}
          >
            <span style={{ color: "red", cursor: "pointer" }}>⬤</span>
          </div>
          <div className="ml-5 mr-5 mb-4 modal-text-notice">
            <div className="modal-notice-title mt-3">
              <p>{props.title}</p>
            </div>

            <div className="modal-notice-info">
              <p>{props.info}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ModalNotice;
