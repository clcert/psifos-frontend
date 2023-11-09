import { Tooltip } from 'react-tooltip'

export default function MoreInfoTooltip({
  children, descript, place="bottom",
}){
  return (
    <>
      <div
        data-tooltip-id="my-tooltip" 
        className="more-info-tooltip"
        data-tooltip-content={descript}
      >
        {children}
      </div>
      <Tooltip id="my-tooltip" place={place}/>
    </>
  )
}