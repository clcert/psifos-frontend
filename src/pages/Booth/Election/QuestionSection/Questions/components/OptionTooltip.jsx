import MoreInfoTooltip from "../../../../../../component/MoreInfo/MoreInfoTooltip";

function OptionImage({src}){
    return (
      <div>
        <img
          src={src} width={300} height={300}
          style={{pointerEvents: 'none'}}
          alt="Opción"
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