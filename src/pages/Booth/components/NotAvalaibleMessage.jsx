export default function NotAvalaibleMessage({message}) {
    return (
        <div className="box has-text-centered" id="not-results-box">
            <p className="is-size-3 has-text-weight-bold mb-0">
            {message}
            </p>
        </div>
    )
}