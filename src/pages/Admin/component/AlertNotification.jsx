export default function AlertNotification({alertMessage, onClear}) {
    return (
        <div className="notification is-danger is-light">
            <div>{alertMessage}</div>
            <div style={{display: "flex", alignItems: "center"}}>
                <button
                    className="delete"
                    onClick={onClear}
                />
            </div>
        </div>
    )
}