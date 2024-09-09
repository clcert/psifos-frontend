import MoreInfoTooltip from "../../../../../../component/MoreInfo/MoreInfoTooltip";
import foto from "./foto-voto.png"

function OptionImage(){
    return (
      <div>
        <img
          src={foto} width={200} height={200}
          style={{pointerEvents: 'none'}}
        />
      </div>
    )
  }

export default function OptionTooltip ({
    children, hidden=false,
}) {
    return (
        <MoreInfoTooltip
          render={() => <OptionImage />}
          place="top"
          hidden={hidden}
        >
          {children}
        </MoreInfoTooltip>
    )
}