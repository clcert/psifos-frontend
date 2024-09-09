import { Tooltip } from 'react-tooltip'

export default function MoreInfoTooltip({
  children, descript, render,
  hidden, place="bottom",
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
      {!hidden && <Tooltip
        id="my-tooltip"
        place={place}
        render={render}
      />}
    </>
  )
}