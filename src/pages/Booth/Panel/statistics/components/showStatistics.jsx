import NotAvailableMessage from "../../../../../component/Messages/NotAvailableMessage"
import Spinner from "../../../../../component/OthersComponents/Spinner"

export default function ShowStatistics({
    statisticsComponent, notAvailableMessage,
    showNotAvailableMessage, isLoadData,
}) {
    return (
        isLoadData ? (
            showNotAvailableMessage ? <div
                className="not-available-statistic-message-container"
            >
                <NotAvailableMessage
                    message={notAvailableMessage}
                />
            </div>
            : (
                statisticsComponent
            )
        ) : <Spinner />
    )
}