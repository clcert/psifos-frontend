import { Tooltip } from 'react-tooltip'

export default function MoreInfoTooltip({
  children, descript, render,
  hidden, place="bottom", id,
}){
  return (
    <>
      <div
        data-tooltip-id={`my-tooltip-${id}`}
        className="more-info-tooltip"
        data-tooltip-content={descript}
      >
        {children}
      </div>
      {!hidden && <Tooltip
        id={`my-tooltip-${id}`}
        place={place}
        render={render}
      />}
    </>
  )
}