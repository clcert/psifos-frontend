import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

function CircleIcon({children}) {
  return (
    <div className="circled-icon">
      {children}
    </div>
  )
}

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

export function BasicItem({
  dragOverlay, label,
}) {
  return (
    <ItemBasics
      dragOverlay={dragOverlay}
      itemType="ranking__btn unranked"
    >
      {label}
    </ItemBasics>
  )
}

export function ComplexItem({
  dragOverlay, label,
}) {
  return (
    <ItemBasics
      dragOverlay={dragOverlay}
      itemType="ranking__btn ranked"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="d-flex">
          <CircleIcon>
            <i class="fa-solid fa-caret-up"/>  
          </CircleIcon>
          <div style={{width: "0.15em"}}/>
          <CircleIcon>
            <i class="fa-solid fa-caret-down"/>  
          </CircleIcon>
        </div>
        <span className="ml-2">
          {label}
        </span>
      </div>
      <i class="fa-solid fa-grip-vertical" />
    </ItemBasics>
  )
}

function ItemEnvironment({ children, id }){
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
      {children}
    </div>
  );
};

export function RankableItem({ id, label }) {
  return (
    <ItemEnvironment id={id}>
      <BasicItem
        id={id}
        label={label}
      />
    </ItemEnvironment>
  );
};

export function RankedItem({ id, label }) {
  return (
    <ItemEnvironment id={id}>
      <ComplexItem
        id={id}
        label={label}
      />
    </ItemEnvironment>
  );
};