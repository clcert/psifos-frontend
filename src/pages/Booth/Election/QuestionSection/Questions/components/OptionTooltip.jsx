import MoreInfoTooltip from "../../../../../../component/MoreInfo/MoreInfoTooltip";

function OptionImage({src}){
    return (
      <div>
        <img
          src={src} width={200} height={200}
          style={{pointerEvents: 'none'}}
        />
      </div>
    )
  }

export default function OptionTooltip ({
    children, hidden, answerDescription, id,
}) {
    return (
        <MoreInfoTooltip
          render={() => <OptionImage
            src={
              `data:image/jpeg;base64,${answerDescription}`
            }
          />}
          place="top"
          hidden={Boolean(hidden)}
          id={id}
        >
          {children}
        </MoreInfoTooltip>
    )
}