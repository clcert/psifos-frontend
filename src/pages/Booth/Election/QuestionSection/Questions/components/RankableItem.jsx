import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

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
      <Item
        id={id}
        label={label}
        itemType="unranked"
      />
    </ItemEnvironment>
  );
};

export function RankedItem({ id, label }) {
  return (
    <ItemEnvironment id={id}>
      <Item
        id={id}
        label={label}
        itemType="ranked"
      />
    </ItemEnvironment>
  );
};