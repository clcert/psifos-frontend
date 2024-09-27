export default function GenericModal ({
    children, showModal, handleClose, title,
}) {
    return (
        <div
            className={"modal " + (showModal ? "is-active" : "")}
            id="extend-modal"
        >
            <div className="modal-background" onClick={handleClose}/>
            <div className="modal-card">
                <section className="modal-card-body">
                <div
                    onClick={handleClose}
                    className="close-button"
                >
                    <i className="fa-solid fa-xmark"/>
                </div>
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                    {children}
                </section>
                <div
                    className="modal-footer"
                    style={{
                        background: "white", borderRadius: "0",
                    }}
                >
                    <button
                        onClick={handleClose}
                        className="is-medium question-button proceed-button"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}