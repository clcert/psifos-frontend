import React, { useState, useEffect } from "react";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import RankingIndices from "./components/RankingIndices";
import { RankedItem } from "./components/RankableItem";
import {
  SortedDroppable, UnsortedDroppable
} from "./components/RankingDroppable";
import {
  removeAtIndex, insertAtIndex, arrayMove, getEnumerateList
} from "./utils";


function RankingDndContext({
  children, activeIdHandler,
  itemGroups, itemGroupsHandler,
  cantMove,
}) {
  const [lastDistribution, setLastDistribution] = useState(itemGroups)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item)
    };
  };

  const handleDragStart = ({ active }) => activeIdHandler(active.id);

  const handleDragCancel = () => activeIdHandler(null);

  const handleDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      itemGroupsHandler((itemGroups) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex =
          over.id in itemGroups
            ? itemGroups[overContainer].length + 1
            : over.data.current.sortable.index;
        if (cantMove(
          activeContainer, overContainer, itemGroups
        )) {
          return lastDistribution;
        }

        setLastDistribution(itemGroups)
        return moveBetweenContainers(
          itemGroups,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      activeIdHandler(null);
      return;
    }

    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex =
        over.id in itemGroups
          ? itemGroups[overContainer].length + 1
          : over.data.current.sortable.index;

      itemGroupsHandler((itemGroups) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = {
            ...itemGroups,
            [overContainer]: arrayMove(
              itemGroups[overContainer],
              activeIndex,
              overIndex
            )
          };
        } else {
          newItems = moveBetweenContainers(
            itemGroups,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
        }

        return newItems;
      });
    }
    
    activeIdHandler(null);
  };

  return (
    <div className="ranking__container is-bordered">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </div>
  )
}

function InputRanking({
  answers, answersHandler, answerLabels,
  clickHandler, maxAnswers,
}) {
  const [itemGroups, setItemGroups] = useState({
    rankedItems: [],
    notRankedItems: answers.map((id) => id + 1),
  });

  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    answersHandler(itemGroups.rankedItems)
  }, [itemGroups]);

  return (
    <RankingDndContext
      activeIdHandler={setActiveId}
      itemGroups={itemGroups}
      itemGroupsHandler={setItemGroups}
      cantMove={(activeContainer, overContainer, itemGroups) => {
        return (
          overContainer === "rankedItems" &&
          activeContainer === "notRankedItems" &&
          itemGroups[overContainer].length === maxAnswers
        )
      }}
    >
      <div
        style={{display: "flex", flexDirection: "column", width: "100%"}}
        onClick={clickHandler}
      >
        <div className="ranked__container">
          <RankingIndices
            indices={getEnumerateList([
              ...itemGroups["rankedItems"],
              ...itemGroups["notRankedItems"]
            ]).slice(0, maxAnswers)}
          />
          <div className="ranking__opt_col">
            <SortedDroppable
              id="rankedItems"
              items={itemGroups["rankedItems"]}
              activeId={activeId}
              key="rankedItems"
              labels={answerLabels}
            />
          </div>
        </div>
        <div className="is-bordered ranking__opt_lake" >
          <UnsortedDroppable
            id="notRankedItems"
            items={itemGroups["notRankedItems"]}
            activeId={activeId}
            key="notRankedItems"
            labels={answerLabels}
          />
        </div>
        <DragOverlay>
          {activeId && <RankedItem
            id={activeId}
            label={answerLabels[activeId-1]}
            dragOverlay
          />}
        </DragOverlay>
      </div>
    </RankingDndContext>
  );
};

export default InputRanking;
