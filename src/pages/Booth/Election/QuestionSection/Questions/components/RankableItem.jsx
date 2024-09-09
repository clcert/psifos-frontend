import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import OptionTooltip from "./OptionTooltip"

function ItemBasics({
  children, dragOverlay, itemType,
}) {
  const style = {
    cursor: dragOverlay ? "grabbing" : "grab",
  }
  return (
    <div style={style} className={`item ${itemType}`}>
      {children}
    </div>
  )
}

export function Item({
  dragOverlay, label, itemType,
}) {
  return (
    <ItemBasics
      dragOverlay={dragOverlay}
      itemType={`ranking__btn ${itemType}`}
    >
      <div
        style={{
          display: "flex", alignItems: "center",
        }}
      >
        <span className="mr-2">
          {label}
        </span>
      </div>
      <i className="fa-solid fa-grip-vertical" />
    </ItemBasics>
  )
}

function ItemEnvironment({
  children, id, dragging,
}){
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <OptionTooltip
        hidden={dragging}
      >
        {children}
      </OptionTooltip>
    </div>
  );
};

export function RankableItem({
  id, label, dragging,
}) {
  return (
    <ItemEnvironment
      id={id}
      dragging={dragging}
    >
        <Item
          id={id}
          label={label}
          itemType="rankable"
        />
    </ItemEnvironment>
  );
};

export function RankedItem({
  id, label, dragging, dragOverlay,
}) {
  return (
    <ItemEnvironment
      id={id}
      dragging={dragging}
    >
        <Item
          id={id}
          label={label}
          itemType="ranked"
          dragOverlay={dragOverlay}
        />
    </ItemEnvironment>
  );
};