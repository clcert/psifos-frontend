export default function NotAvalaibleMessage({message, note}) {
    return (
        <div
            className="box has-text-centered"
            id="not-results-box"
            style={{ maxWidth: "700px" }}
        >
            <p className="is-size-3 has-text-weight-bold mb-0">
            {message}
            </p>
            {note && <p className="is-size-8 has-text-weight-bold mb-0">
                {note}
            </p>}
        </div>
    )
}