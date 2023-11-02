import React from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import { SortableItem } from "./SortableItem";

/**
 *
 * @param {*} props
 * @returns
 */
const InputRanking = (props) => {
  // dnd-kit sortable ids start from 1.
  let rankingOptions = props.answers.map((id) => id + 1);
  let rankingIndices = Array.from(rankingOptions.keys()).map((id) => id + 1);

  /** @sensors */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   *
   * @param {*} event
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      props.setAnswers((answers) => {
        const oldIndex = answers.indexOf(active.id - 1);
        const newIndex = answers.indexOf(over.id - 1);
        return arrayMove(answers, oldIndex, newIndex);
        // TODO: modify QuestionElection answers as well for encryption.
      });
    }
  };

  return (
    <div className="ranking__container is-bordered">
      <div className="ranking__idx_col">
        {rankingIndices.map((id) => (
          <div className="ranking__idx" key={id}>
            {id}°
          </div>
        ))}
      </div>
      <div className="ranking__opt_col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext
            items={rankingOptions}
            strategy={verticalListSortingStrategy}
          >
            {rankingOptions.map((id) => (
              <SortableItem
                className="ranking__btn"
                content={props.question.closed_options[id - 1]}
                id={id}
                key={id}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default InputRanking;
