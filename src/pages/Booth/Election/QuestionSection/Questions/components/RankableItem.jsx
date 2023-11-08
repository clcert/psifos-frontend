import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

export function Item({
  dragOverlay, label, itemType="ranking__btn unranked"
}) {
  const style = {
    cursor: dragOverlay ? "grabbing" : "grab",
  }
  return (
    <div style={style} className={`item ${itemType}`}>
      {label}
    </div>
  )
}

export function RankableItem({ id, itemType, label }) {
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
      <Item id={id} itemType={itemType} label={label}/>
    </div>
  );
};